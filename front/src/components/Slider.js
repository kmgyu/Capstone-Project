import React, { useState, useEffect, useRef } from 'react';
import '../css/Slider.css';

const Slider = () => {
  // 현재 슬라이드 인덱스 상태
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // 슬라이드 데이터
  const slides = [
    {
      title: '벼농사 모니터링',
      description: '최신 드론 기술로 작물의 상태를 정확하게 확인하세요.',
      image: '/api/placeholder/800/400',
      alt: '농장 이미지 1'
    },
    {
      title: '과수원 관리',
      description: '넓은 과수원도 드론으로 효율적으로 관리할 수 있습니다.',
      image: '/api/placeholder/800/400',
      alt: '농장 이미지 2'
    },
    {
      title: '비닐하우스 점검',
      description: '온도와 습도를 모니터링하여 최적의 환경을 유지하세요.',
      image: '/api/placeholder/800/400',
      alt: '농장 이미지 3'
    }
  ];

  // 자동 슬라이드를 위한 타이머 ref
  const slideInterval = useRef(null);

  // 이전 슬라이드로 이동
  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  // 다음 슬라이드로 이동
  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  // 특정 슬라이드로 직접 이동
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // 자동 슬라이드 시작
  const startSlideTimer = () => {
    slideInterval.current = setInterval(() => {
      goToNextSlide();
    }, 5000);
  };

  // 자동 슬라이드 정지
  const stopSlideTimer = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
  };

  // 컴포넌트 마운트 시 자동 슬라이드 시작
  useEffect(() => {
    startSlideTimer();
    
    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      stopSlideTimer();
    };
  }, []);

  return (
    <section className="slider-section">
      <h3 className="section-title">농장 현황</h3>
      <div 
        className="slider-container"
        onMouseEnter={stopSlideTimer}
        onMouseLeave={startSlideTimer}
      >
        <div 
          className="slider"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div className="slide" key={index}>
              <img src={slide.image} alt={slide.alt} />
              <div className="slide-content">
                <h4 className="slide-title">{slide.title}</h4>
                <p className="slide-description">{slide.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="slider-controls">
          <div className="slider-arrow prev" onClick={goToPrevSlide}>
            <i className="fas fa-chevron-left"></i>
          </div>
          <div className="slider-arrow next" onClick={goToNextSlide}>
            <i className="fas fa-chevron-right"></i>
          </div>
        </div>
        <div className="slider-dots">
          {slides.map((_, index) => (
            <div 
              key={index}
              className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Slider;