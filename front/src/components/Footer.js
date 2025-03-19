import React from 'react';
import '../css/Footer.css';

const Footer = () => {
    return (
        <footer>
        <div class="container">
            <div class="footer-container">
                <div class="footer-column">
                    <h3>농업드론관리</h3>
                    <p>최신 드론 기술을 활용한 스마트 농업 관리 시스템으로 농장 운영을 더욱 효율적으로 만들어 드립니다.</p>
                    <div class="social-links">
                        <a href="#"><i class="fab fa-facebook-f"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
                <div class="footer-column">
                    <h3>주요 기능</h3>
                    <ul class="footer-links">
                        <li><a href="#">드론 현황 관리</a></li>
                        <li><a href="#">작업 일정 관리</a></li>
                        <li><a href="#">농작물 모니터링</a></li>
                        <li><a href="#">농장 지도 관리</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h3>고객 지원</h3>
                    <ul class="footer-links">
                        <li><a href="#">자주 묻는 질문</a></li>
                        <li><a href="#">이용 가이드</a></li>
                        <li><a href="#">고객센터</a></li>
                        <li><a href="#">기술 지원</a></li>
                        <li><a href="#">문의하기</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h3>연락처</h3>
                    <p><i class="fas fa-map-marker-alt"></i> 전라남도 목포시</p>
                    <p><i class="fas fa-phone"></i> 02-123-4567</p>
                    <p><i class="fas fa-envelope"></i> info@farmdrone.kr</p>
                </div>
            </div>
            <div class="copyright">
                &copy; 2025 농업드론관리 시스템. All Rights Reserved.
            </div>
        </div>
    </footer>
    )
}

export default Footer;