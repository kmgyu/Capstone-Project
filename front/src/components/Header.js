import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  // faDrone, 
  faSun, 
  faUser, 
  faBars 
} from '@fortawesome/free-solid-svg-icons';
import '../css/Header.css';

const Header = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState({
    icon: faSun,
    description: '맑음',
    temperature: 22
  });

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <header>
      <div className="container header-container">
        <div className="logo">
          <FontAwesomeIcon 
            // icon={faDrone} 
            style={{ color: 'var(--primary-color)', fontSize: '28px' }} 
          />
          <h1>농업드론관리</h1>
        </div>
        
        <ul className={`nav-menu ${showMobileMenu ? 'show-mobile-menu' : ''}`}>
          <li><a href="#" className="active">홈</a></li>
          <li><a href="#">드론 현황</a></li>
          <li><a href="#">작업 일정</a></li>
          <li><a href="#">농장 관리</a></li>
          <li><a href="#">도움말</a></li>
        </ul>
        
        <div className="header-right">
          <div className="weather-info">
            <FontAwesomeIcon icon={weatherInfo.icon} />
            <span id="weather-text">
              {weatherInfo.description}, {weatherInfo.temperature}°C
            </span>
          </div>
          
          <div className="user-profile">
            <div className="user-avatar">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <span>테스터</span>
          </div>
          
          <div className="hamburger-menu" onClick={toggleMobileMenu}>
            <FontAwesomeIcon icon={faBars} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;