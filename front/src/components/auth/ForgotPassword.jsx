import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  faEnvelope, 
  faCheckCircle, 
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }
    
    // 비밀번호 재설정 이메일 전송 로직 구현
    console.log('비밀번호 재설정 요청:', email);
    
    // 성공 상태로 변경
    setSubmitted(true);
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo">
          <span style={{ color: 'var(--primary-color)', fontSize: '36px' }}>🛸</span>
          <h1>농업드론관리</h1>
        </div>
        
        <div className="login-card">
          {!submitted ? (
            <>
              <h2 className="login-title">비밀번호 찾기</h2>
              <p className="login-subtitle">가입하신 이메일을 입력하시면 비밀번호 재설정 링크를 보내드립니다</p>
              
              <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">이메일</label>
                  <div className="input-with-icon">
                    <FontAwesomeIcon icon={faEnvelope} />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="가입하신 이메일 주소를 입력하세요"
                      required
                    />
                  </div>
                  {error && <p className="error-message">{error}</p>}
                </div>
                
                <button type="submit" className="login-button">재설정 링크 받기</button>
              </form>
            </>
          ) : (
            <div className="success-message">
              <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'var(--primary-color)', fontSize: '48px', marginBottom: '20px', display: 'block', textAlign: 'center' }} />
              <h2 style={{ textAlign: 'center', marginBottom: '15px' }}>이메일이 전송되었습니다</h2>
              <p style={{ marginBottom: '20px', textAlign: 'center' }}>
                {email} 주소로 비밀번호 재설정 링크를 보냈습니다. 이메일을 확인하고 링크를 클릭하여 비밀번호를 재설정해주세요.
              </p>
              <p className="info-note" style={{ fontSize: '14px', color: '#888', marginBottom: '20px', textAlign: 'center' }}>
                이메일이 도착하지 않았나요? 스팸함을 확인하거나 다시 시도해 보세요.
              </p>
              <button 
                onClick={() => setSubmitted(false)} 
                className="login-button" 
                style={{ width: '100%', marginBottom: '15px' }}
              >
                다시 시도
              </button>
            </div>
          )}
          
          <div className="login-link" style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '5px' }} /> 로그인으로 돌아가기
            </Link>
          </div>
        </div>
        
        <div className="login-footer">
          <p>&copy; 2025 농업드론관리 시스템. All Rights Reserved.</p>
          <div className="auth_footer-links">
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

export default ForgotPassword;