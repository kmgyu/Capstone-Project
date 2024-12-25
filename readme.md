# Flask 기반 노지 관리 시스템

## 개요
이 프로젝트는 **Flask 프레임워크**를 사용하여 노지 관리 시스템을 구축하는 웹 애플리케이션입니다. 주요 기능으로는 사용자 인증, 노지 데이터 CRUD, 할 일 관리 기능을 포함하고 있으며, Jinja2 템플릿 엔진과 JavaScript를 활용하여 동적이고 직관적인 사용자 경험을 제공합니다.

---

## 주요 기능

1. **사용자 인증 시스템**
   - 회원가입 및 로그인.
   - 로그인된 사용자만 접근 가능한 대시보드.
   - Flask-Login을 활용한 세션 관리.

2. **노지 관리**
   - 노지 데이터 CRUD(Create, Read, Update, Delete).
   - 노지의 다각형 좌표를 지도 API를 통해 시각화.
   - 노지 상세 정보 표시 및 수정 기능.

3. **할 일 관리**
   - 특정 작업 추가, 조회, 수정, 삭제.
   - 주기 및 기간 설정을 통한 작업 관리.

4. **모달 기반 인터페이스**
   - iframe 및 Jinja 템플릿을 활용한 동적 데이터 로드.
   - AJAX 요청을 통한 비동기 데이터 로딩 지원.

---

## 프로젝트 구조
```bash
project/
├── mid_term/
│   ├── static/
│   │   ├── css/
│   │   ├── js/
│   │   │   └── function.js
│   │   └── images/
│   ├── templates/
│   │   ├── layout/
│   │   │   └── base.html
│   │   ├── field_views/
│   │   │   ├── view_field.html
│   │   │   └── polygon.html
│   │   └── auth/
│   │       ├── login.html
│   │       └── register.html
│   ├── views/
│   │   ├── auth.py
│   │   ├── field_views.py
│   │   └── todo_views.py
│   ├── models.py
│   ├── create_app.py
│   ├── default_config.py
│   └── run.py
├── requirements.txt
└── README.md
```
## 설치 및 실행

### 1. 필수 요구 사항
- Python 3.8 이상
- Flask 2.x
- Node.js (선택 사항, 정적 파일 관리 시)

### 2. 설치 방법

1. 리포지토리 클론:
```bash
git clone <repository-url>
cd project/
```

2. 가상 환경 설정 및 활성화:
```bash
python -m venv venv
source venv/bin/activate  # Windows는 venv\Scripts\activate
```

3. 의존성 설치:
```bash
pip install -r requirements.txt
```

4. 데이터베이스 초기화:
```bash
flask db init
flask db migrate
flask db upgrade
```

5. 애플리케이션 실행:
```bash
flask run
```

### 3. 환경 변수 설정
.env 파일 생성:
```bash
DATABASE_URI=<your-database-uri>
SECRET_KEY=<your-secret-key>
```

# 사용 기술
- Backend: Flask, SQLAlchemy
- Frontend: Jinja2, Bootstrap, JavaScript
- Database: MariaDB
- API Integration: 지도 API

# 주요 엔드포인트
|기능|HTTP 메서드|URL|설명|
|---|---|---|---|
|사용자 회원가입|GET/POST|/auth/register|사용자 회원가입.
|사용자 로그인|GET/POST|/auth/login|사용자 로그인.
|대시보드|GET|/auth/dashboard|로그인된 사용자 대시보드.
|노지 목록 조회|GET|/field/view-field|모든 노지 데이터 조회 및 시각화.
|노지 데이터 추가|POST|/field/save-field|새로운 노지 데이터 추가.
|할 일 목록 조회|GET|/todo/get-field-todos|할 일 데이터 조회.
|할 일 추가	POST|/todo/add-field-todo|새로운 할 일 추가.

# 기여 방법
이 프로젝트를 포크합니다.
새로운 브랜치를 생성합니다:
```bash
git checkout -b feature/my-feature
```

변경 사항을 커밋합니다:
```bash
git commit -m "Add my feature"
```

브랜치에 푸시합니다:
```bash
git push origin feature/my-feature
```

Pull Request를 엽니다.
- 프로젝트의 원본 리포지토리로 이동합니다.
- "Pull Requests" 탭을 클릭한 후 "New Pull Request" 버튼을 클릭합니다.
- 변경 사항을 검토한 후 "Create Pull Request" 버튼을 클릭합니다.

# 라이선스
이 프로젝트는 MIT License로 라이선스가 부여되었습니다.

# 추가 정보
버그 및 피드백은 [Issues](https://github.com/kmgyu/Capstone-Project/issues)에 남겨주세요.
