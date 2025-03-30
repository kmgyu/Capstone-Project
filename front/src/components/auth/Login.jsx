import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faLock, 
  faSpinner, 
  faComment,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { faN } from '@fortawesome/free-solid-svg-icons';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 관리자 계정 정보 (실제로는 이런 방식으로 하드코딩하지 않는 것이 좋습니다)
  const ADMIN_EMAIL = "root@mokpo.ac.kr";
  const ADMIN_PASSWORD = "ScE1234**";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // 입력 시 에러 메시지 초기화
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // 간단한 유효성 검사
    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      setLoading(false);
      return;
    }
    
    // 관리자 계정 확인 (실제 구현에서는 API 호출로 대체)
    setTimeout(() => {
      if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
        // 로그인 성공
        const token = generateFakeToken();
        if (formData.rememberMe) {
          // 로그인 상태 유지를 선택한 경우 로컬 스토리지에 저장
          localStorage.setItem('token', token);
        } else {
          // 세션 스토리지에만 저장 (브라우저 닫으면 로그아웃됨)
          sessionStorage.setItem('token', token);
        }
        
        // 로그인 콜백 호출
        onLogin && onLogin(token);
        
        // 메인 페이지로 이동
        navigate('/');
      } else {
        // 로그인 실패
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
      setLoading(false);
    }, 800); // 실제 API 호출을 시뮬레이션하기 위한 딜레이
  };

  // 간단한 토큰 생성 함수
  const generateFakeToken = () => {
    const randomString = Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now().toString(36);
    return `${randomString}_${timestamp}`;
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo">
          {/* FontAwesome이 없어서 유사한 아이콘 사용 */}
          <span style={{ color: 'var(--primary-color)', fontSize: '36px' }}>🛸</span>
          <h1>농업드론관리</h1>
        </div>
        
        <div className="login-card">
          <h2 className="login-title">로그인</h2>
          <p className="login-subtitle">농업 드론 관리 시스템에 오신 것을 환영합니다</p>
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <div className="input-with-icon">
                <FontAwesomeIcon icon={faEnvelope} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="이메일 주소를 입력하세요"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">비밀번호</label>
              <div className="input-with-icon">
                <FontAwesomeIcon icon={faLock} />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </div>
            </div>
            
            {error && (
              <div className="error-message" style={{ marginBottom: '15px', textAlign: 'center', color: '#e74c3c' }}>
                {error}
              </div>
            )}
            
            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label htmlFor="rememberMe">로그인 상태 유지</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">비밀번호 찾기</Link>
            </div>
            
            <button 
              type="submit" 
              className="login-button" 
              disabled={loading}
              style={loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
            >
              {loading ? (
                <span>
                  <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: '8px' }} />
                  로그인 중...
                </span>
              ) : (
                '로그인'
              )}
            </button>
            
            <div className="login-divider">
              <span>또는</span>
            </div>
            
            <div className="social-login">
              <button type="button" className="social-button kakao">
                <FontAwesomeIcon icon={faComment} /> 카카오 로그인
              </button>
              <button type="button" className="social-button naver">
                <FontAwesomeIcon icon={faN} /> 네이버 로그인
              </button>
            </div>
          </form>
          
          <div className="signup-link">
            계정이 없으신가요? <Link to="/register">회원가입</Link>
          </div>
          
          {/* 개발용 로그인 정보 안내 - 실제 배포 시 제거 */}
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px', fontSize: '13px', color: '#666' }}>
            <p style={{ textAlign: 'center', marginBottom: '5px' }}><strong>개발용 관리자 계정</strong></p>
            <p style={{ margin: '0', textAlign: 'center' }}>
              이메일: {ADMIN_EMAIL}<br />
              비밀번호: {ADMIN_PASSWORD}
            </p>
          </div>
        </div>
        
        <div className="login-footer">
          <p>&copy; 2025 농업드론관리 시스템. All Rights Reserved.</p>
          <div className="footer-links">
            <a href="#">이용약관</a>
            <a href="#">개인정보처리방침</a>
            <a href="#">고객센터</a>
          </div>
        </div>
      </div>
      
      <div className="login-background">
        <div className="login-info">
          <h2>스마트한 농업의 시작</h2>
          <p>효율적인 농작물 관리와 모니터링을 위한<br/>드론 일정 관리 시스템으로<br/>더 스마트한 농업을 경험해보세요.</p>
          <ul className="login-features">
            <li><FontAwesomeIcon icon={faCheckCircle} /> 실시간 모니터링</li>
            <li><FontAwesomeIcon icon={faCheckCircle} /> 간편한 작업 일정 관리</li>
            <li><FontAwesomeIcon icon={faCheckCircle} /> 농작물 상태 분석</li>
            <li><FontAwesomeIcon icon={faCheckCircle} /> 정밀 농업 지원</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;