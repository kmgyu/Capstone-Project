import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faMapMarkerAlt, 
  faPen, 
  faTrash, 
  faSave
} from '@fortawesome/free-solid-svg-icons';
import '../css/AddFarmlandModal.css';

const AddFarmlandModal = ({ isOpen, onClose, onAddFarmland }) => {
  // 맵 관련 상태 및 참조
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const polygon = useRef(null);
  
  // 폼 상태
  const [farmlandName, setFarmlandName] = useState('');
  const [farmlandDescription, setFarmlandDescription] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [drawingMode, setDrawingMode] = useState(false);
  const [polygonPath, setPolygonPath] = useState([]);
  const [area, setArea] = useState(0);
  const [mapScriptLoaded, setMapScriptLoaded] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);

  // 서비스 참조
  const ps = useRef(null);
  const geocoder = useRef(null);
  const infowindow = useRef(null);
  
  // 클릭 리스너 참조 - 나중에 이벤트 리스너를 제거할 때 사용
  const clickListenerRef = useRef(null);

  // 면적 계산 함수
  const calculateArea = useCallback((path) => {
    if (path.length < 3) return;
    
    // 지구 반경 (미터)
    const earthRadius = 6371000;
    
    // 면적 계산을 위한 함수
    const calculateAreaFromPath = () => {
      let total = 0;
      
      for (let i = 0; i < path.length; i++) {
        const p1 = path[i];
        const p2 = path[(i + 1) % path.length]; // 마지막 점은 첫 번째 점과 연결
        
        // 라디안으로 변환
        const lat1 = p1.lat * Math.PI / 180;
        const lng1 = p1.lng * Math.PI / 180;
        const lat2 = p2.lat * Math.PI / 180;
        const lng2 = p2.lng * Math.PI / 180;
        
        // 면적 계산에 필요한 공식 적용
        total += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
      }
      
      // 최종 면적 계산 및 제곱미터로 변환
      total = total * earthRadius * earthRadius / 2;
      return Math.abs(total);
    };
    
    const calculatedArea = calculateAreaFromPath();
    setArea(calculatedArea);
  }, []);

  // 폴리곤 업데이트 함수
  const updatePolygon = useCallback((path) => {
    if (!window.kakao || !window.kakao.maps || !map.current) {
      console.error("맵이 초기화되지 않았습니다.");
      return;
    }
    
    // 기존 폴리곤 제거
    if (polygon.current) {
      polygon.current.setMap(null);
    }
    
    // 카카오맵 경로 포맷으로 변환
    const kakaoPath = path.map(point => 
      new window.kakao.maps.LatLng(point.lat, point.lng)
    );
    
    // 새 폴리곤 생성
    polygon.current = new window.kakao.maps.Polygon({
      path: kakaoPath,
      strokeWeight: 3,
      strokeColor: '#39DE2A',
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
      fillColor: '#39DE2A',
      fillOpacity: 0.3
    });
    
    // 지도에 표시
    polygon.current.setMap(map.current);
    
    // 면적 계산 (제곱미터)
    calculateArea(path);
  }, [calculateArea]);

  // 지도 클릭 이벤트 핸들러
  const handleMapClick = useCallback((mouseEvent) => {
    if (!drawingMode || !map.current) return;

    // 클릭한 위치의 좌표
    const clickPosition = mouseEvent.latLng;
    
    // 마커 생성
    const marker = new window.kakao.maps.Marker({
      position: clickPosition,
      map: map.current
    });
    
    // 마커 배열에 추가
    markers.current.push(marker);
    
    // 폴리곤 경로 업데이트
    const newPath = [...polygonPath, {
      lat: clickPosition.getLat(),
      lng: clickPosition.getLng()
    }];
    setPolygonPath(newPath);
    
    // 폴리곤 그리기 (3개 이상의 점이 있을 때)
    if (newPath.length >= 3) {
      updatePolygon(newPath);
    }
  }, [drawingMode, polygonPath, updatePolygon]);

  // 모달이 처음 열릴 때 스크립트 로드
  useEffect(() => {
    if (!isOpen) return;
    
    function loadKakaoMapAsynchronously() {
      const existingScript = document.querySelector(
        'script[src*="dapi.kakao.com/v2/maps/sdk.js"]'
      );
      if (existingScript) {
        console.log("이미 카카오맵 스크립트가 존재합니다.");
        setMapScriptLoaded(true);
        return;
      }

      console.log("카카오맵 API 로드 시도...");
      const script = document.createElement("script");
      script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=0177e5aaa20d0847b3b223ccf30099c7&autoload=false&libraries=services,drawing";
      script.async = true;
      
      // 오류 이벤트 추가
      script.onerror = (error) => {
        console.error("카카오맵 API 로드 실패:", error);
      };
      
      script.onload = () => {
        window.kakao.maps.load(() => {
          console.log("카카오맵 API 초기화 완료!");
          setMapScriptLoaded(true);
        });
      };
      
      document.head.appendChild(script);
    }

    loadKakaoMapAsynchronously();
  }, [isOpen]);

  // 맵 초기화 및 이벤트 리스너 설정
  useEffect(() => {
    if (!isOpen || !mapContainer.current || !mapScriptLoaded || mapInitialized) return;
    
    // 맵 초기화 함수
    const initializeMap = () => {
      try {
        console.log("맵 DOM 요소 크기:", mapContainer.current.offsetWidth, "x", mapContainer.current.offsetHeight);
        
        if (!window.kakao || !window.kakao.maps) {
          console.error("카카오맵 API가 로드되지 않았습니다.");
          return;
        }
        
        // 맵 컨테이너 크기 확인
        if (mapContainer.current.offsetWidth === 0 || mapContainer.current.offsetHeight === 0) {
          console.error("맵 컨테이너 크기가 0입니다");
          return;
        }
        
        const options = {
          center: new window.kakao.maps.LatLng(36.5, 127.5), // 한국 중심 좌표
          level: 7 // 초기 줌 레벨
        };

        map.current = new window.kakao.maps.Map(mapContainer.current, options);
        
        // 장소 검색 객체 생성
        ps.current = new window.kakao.maps.services.Places();
        
        // 주소-좌표 변환 객체 생성
        geocoder.current = new window.kakao.maps.services.Geocoder();
        
        // 인포윈도우 생성
        infowindow.current = new window.kakao.maps.InfoWindow({ zIndex: 1 });
        
        setMapInitialized(true);
        console.log("카카오맵이 초기화되었습니다!");
      } catch (error) {
        console.error("맵 초기화 중 오류 발생:", error);
      }
    };
    
    // 약간의 지연을 두고 초기화 (DOM 요소가 완전히 렌더링된 후)
    const timer = setTimeout(() => {
      initializeMap();
    }, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, [isOpen, mapScriptLoaded, mapInitialized]);

  // 클릭 이벤트 리스너 설정 및 제거 (맵 초기화 후)
  useEffect(() => {
    if (!isOpen || !mapInitialized || !map.current) return;
    
    // 이미 리스너가 있으면 제거
    if (clickListenerRef.current) {
      window.kakao.maps.event.removeListener(map.current, 'click', clickListenerRef.current);
    }
    
    // 새 리스너 설정 및 참조 저장
    clickListenerRef.current = handleMapClick;
    window.kakao.maps.event.addListener(map.current, 'click', clickListenerRef.current);
    
    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      if (clickListenerRef.current && map.current) {
        window.kakao.maps.event.removeListener(map.current, 'click', clickListenerRef.current);
      }
    };
  }, [isOpen, mapInitialized, handleMapClick]);

  // 폴리곤 및 마커 복원 (리렌더링 후)
  useEffect(() => {
    if (!isOpen || !mapInitialized || !map.current) return;
    
    // polygonPath가 있고 맵이 초기화되었으면 폴리곤 복원
    if (polygonPath.length >= 3) {
      updatePolygon(polygonPath);
    }
    
    // 마커 복원
    if (markers.current.length > 0) {
      // 모든 마커가 지도에 표시되어 있는지 확인하고, 없으면 다시 설정
      markers.current.forEach(marker => {
        if (!marker.getMap()) {
          marker.setMap(map.current);
        }
      });
    }
  }, [isOpen, mapInitialized, polygonPath, updatePolygon]);

  // 드로잉 모드 변경 시 사용자에게 알림
  useEffect(() => {
    if (drawingMode && mapInitialized) {
      console.log("드로잉 모드 활성화: 지도를 클릭하여 노지 영역을 그리세요");
    }
  }, [drawingMode, mapInitialized]);

  // 장소 검색 함수
  const searchPlaces = () => {
    if (!searchKeyword.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }

    if (!ps.current) {
      console.error("장소 서비스가 초기화되지 않았습니다.");
      alert("지도가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    ps.current.keywordSearch(searchKeyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위 재설정
        displayPlaces(data);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
      } else if (status === window.kakao.maps.services.Status.ERROR) {
        alert('검색 중 오류가 발생했습니다.');
      }
    });
  };

  // 검색 결과 표시 함수
  const displayPlaces = (places) => {
    if (places.length === 0 || !map.current) return;
    
    // 첫 번째 검색 결과로 이동
    const bounds = new window.kakao.maps.LatLngBounds();
    
    places.forEach(place => {
      // 좌표를 생성하고 bounds에 추가
      const placePosition = new window.kakao.maps.LatLng(place.y, place.x);
      bounds.extend(placePosition);
      
      // 첫 번째 결과에 인포윈도우 표시
      if (place === places[0] && infowindow.current) {
        infowindow.current.setContent(`<div style="padding:5px;font-size:12px;">${place.place_name}</div>`);
        infowindow.current.open(map.current, new window.kakao.maps.Marker({
          position: placePosition,
          map: map.current
        }));
      }
    });
    
    // 검색된 장소들의 위치를 기준으로 지도 범위 재설정
    map.current.setBounds(bounds);
    
    // 적절한 줌 레벨 설정
    if (places.length === 1) {
      map.current.setLevel(3);
    }
  };

  // 마커 모두 제거 함수
  const clearMarkers = () => {
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];
    
    if (polygon.current) {
      polygon.current.setMap(null);
      polygon.current = null;
    }
    
    setPolygonPath([]);
    setArea(0);
  };

  // 폼 리셋 함수
  const resetForm = () => {
    setFarmlandName('');
    setFarmlandDescription('');
    setSearchKeyword('');
    setDrawingMode(false);
    setPolygonPath([]);
    clearMarkers();
  };

  // 노지 추가 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!farmlandName.trim()) {
      alert('노지 이름을 입력해주세요.');
      return;
    }
    
    if (polygonPath.length < 3) {
      alert('노지 영역을 지도에서 최소 3개 이상의 지점으로 표시해주세요.');
      return;
    }
    
    // 노지 데이터 생성
    const newFarmland = {
      id: Date.now(), // 임시 ID
      title: farmlandName,
      description: farmlandDescription,
      area: Math.round(area), // 제곱미터
      polygon: polygonPath,
      createdAt: new Date().toISOString(),
      image: '/api/placeholder/400/250' // 임시 이미지
    };
    
    // 부모 컴포넌트에 데이터 전달
    onAddFarmland(newFarmland);
    
    // 모달 닫기
    onClose();
  };

  // 키보드 엔터 키로 검색
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchPlaces();
    }
  };

  // 모달이 닫힌 상태면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="farmland-modal">
        <div className="modal-header">
          <h2>새 노지 추가</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-content">
          {/* 맵 영역 */}
          <div className="map-container">
            <div className="map-search-bar">
              <input 
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                placeholder="주소 또는 장소 검색..."
              />
              <button onClick={searchPlaces}>
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
            
            <div className="map-actions">
              <button 
                className={`drawing-mode-btn ${drawingMode ? 'active' : ''}`}
                onClick={() => setDrawingMode(!drawingMode)}
                title={drawingMode ? "그리기 중지" : "노지 영역 그리기"}
              >
                <FontAwesomeIcon icon={drawingMode ? faPen : faMapMarkerAlt} />
                {drawingMode ? "그리기 중지" : "노지 영역 그리기"}
              </button>
              
              <button 
                className="clear-markers-btn"
                onClick={clearMarkers}
                title="모든 마커 지우기"
              >
                <FontAwesomeIcon icon={faTrash} />
                초기화
              </button>
            </div>
            
            <div id="map" ref={mapContainer} className="kakao-map"></div>
            
            {area > 0 && (
              <div className="area-info">
                <span>면적: 약 {Math.round(area).toLocaleString()} m² ({Math.round(area / 10000 * 100) / 100} 헥타르)</span>
              </div>
            )}
          </div>
          
          {/* 노지 정보 폼 */}
          <form className="farmland-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="farmland-name">노지 이름</label>
              <input
                id="farmland-name"
                type="text"
                value={farmlandName}
                onChange={(e) => setFarmlandName(e.target.value)}
                placeholder="노지 이름을 입력하세요"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="farmland-description">간단 설명</label>
              <textarea
                id="farmland-description"
                value={farmlandDescription}
                onChange={(e) => setFarmlandDescription(e.target.value)}
                placeholder="노지에 대한 간단한 설명을 입력하세요"
                rows="4"
              ></textarea>
            </div>
            
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={onClose}>취소</button>
              <button 
                type="submit" 
                className="save-button"
                disabled={farmlandName.trim() === '' || polygonPath.length < 3}
              >
                <FontAwesomeIcon icon={faSave} />
                저장하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFarmlandModal;