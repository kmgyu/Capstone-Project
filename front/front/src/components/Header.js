import React from "react";


function Header() {
  return (
    <header className="header">
      <div className="logo">스마트팜</div>
      <div className="auth-buttons">
        <button>로그인</button>
        <button>회원가입</button>
      </div>
    </header>
  );
}

export default Header;
