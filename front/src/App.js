// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import Slider from './components/Slider';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar'; // 사이드바 컴포넌트 추가
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import './css/App.css';
import './css/AuthStyles.css'; // 인증 관련 CSS 임포트

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // 사이드바 상태 관리
  
  // 페이지 로드 시 인증 상태 확인
  useEffect(() => {
    // localStorage 또는 sessionStorage에서 토큰 확인
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // 로그인 처리 함수
  const handleLogin = (token) => {
    // 토큰은 이미 localStorage 또는 sessionStorage에 저장되어 있음
    setIsAuthenticated(true);
  };

  // 로그아웃 처리 함수
  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  // 메인 홈페이지 컴포넌트
  const HomePage = () => (
    <>
      <Header onLogout={handleLogout} />
      <div className={`app-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="main-content">
          <div className="container">
            <Hero />
            <Dashboard />
            <Slider />
          </div>
        </main>
      </div>
      <Footer />
    </>
  );

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 인증 관련 라우트 */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <Register />
              )
            }
          />
          <Route
            path="/forgot-password"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <ForgotPassword />
              )
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <ResetPassword />
              )
            }
          />

          {/* 보호된 라우트 */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <HomePage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          
          {/* 그 외 경로는 홈으로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;