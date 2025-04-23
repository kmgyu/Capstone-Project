import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  faEnvelope, 
  faLock, 
  faUser,
  faPhone,
  faSeedling,
  faCheckCircle,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faN } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    farmType: '',
    agreeTerms: false
  });

  const [passwordError, setPasswordError] = useState('');
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // 비밀번호 확인 검증
    if (name === 'confirmPassword' || name === 'password') {
      if (name === 'confirmPassword' && formData.password !== value) {
        setPasswordError('비밀번호가 일치하지 않습니다');
      } else if (name === 'password' && formData.confirmPassword && formData.confirmPassword !== value) {
        setPasswordError('비밀번호가 일치하지 않습니다');
      } else {
        setPasswordError('');
      }
    }
  };

  const nextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const prevStep = () => {
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 회원가입 로직 구현
    console.log('회원가입 제출:', formData);
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-logo">
          <span style={{ color: 'var(--primary-color)', fontSize: '36px' }}>🛸</span>
          <h1>농업드론관리</h1>
        </div>
        
        <div className="register-card">
          <h2 className="register-title">회원가입</h2>
          <p className="register-subtitle">농업 드론 관리 시스템에 가입하고 스마트 농업을 시작하세요</p>
          
          <div className="register-progress">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-name">기본 정보</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-name">추가 정보</span>
            </div>
          </div>
          
          <form className="register-form">
            {step === 1 && (
              <div className="register-step">
                <div className="form-group">
                  <label htmlFor="name">이름</label>
                  <div className="input-with-icon">
                    <FontAwesomeIcon icon={faUser} />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="이름을 입력하세요"
                      required
                    />
                  </div>
                </div>
                
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
                  <p className="password-hint">8자 이상, 영문, 숫자, 특수문자 포함</p>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">비밀번호 확인</label>
                  <div className="input-with-icon">
                    <FontAwesomeIcon icon={faLock} />
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="비밀번호를 다시 입력하세요"
                      required
                    />
                  </div>
                  {passwordError && <p className="error-message">{passwordError}</p>}
                </div>
                
                <button 
                  type="button" 
                  className="next-button" 
                  onClick={nextStep}
                  disabled={!formData.name || !formData.email || !formData.password || !formData.confirmPassword || passwordError}
                >
                  다음 단계
                </button>
              </div>
            )}
            
            {step === 2 && (
              <div className="register-step">
                <div className="form-group">
                  <label htmlFor="phoneNumber">연락처</label>
                  <div className="input-with-icon">
                    <FontAwesomeIcon icon={faPhone} />
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="연락처를 입력하세요"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="farmType">농장 유형</label>
                  <div className="input-with-icon">
                    <FontAwesomeIcon icon={faSeedling} />
                    <select
                      id="farmType"
                      name="farmType"
                      value={formData.farmType}
                      onChange={handleChange}
                    >
                      <option value="">농장 유형을 선택하세요</option>
                      <option value="rice">벼농사</option>
                      <option value="vegetable">채소</option>
                      <option value="fruit">과수원</option>
                      <option value="greenhouse">시설원예</option>
                      <option value="other">기타</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group terms-group">
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="agreeTerms">
                      <a href="#" className="terms-link">이용약관</a> 및 <a href="#" className="terms-link">개인정보처리방침</a>에 동의합니다
                    </label>
                  </div>
                </div>
                
                <div className="register-buttons">
                  <button type="button" className="back-button" onClick={prevStep}>
                    이전
                  </button>
                  <button 
                    type="submit" 
                    className="register-button" 
                    onClick={handleSubmit}
                    disabled={!formData.agreeTerms}
                  >
                    회원가입
                  </button>
                </div>
              </div>
            )}
          </form>
          
          <div className="login-link">
            이미 계정이 있으신가요? <Link to="/login">로그인</Link>
          </div>
        </div>
        
        <div className="register-footer">
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

export default Register;