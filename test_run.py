import unittest
from mid_term.create_app import create_app, db
from mid_term.models import Userinfo, FieldInfo, FieldTodo
import json
import os

class FlaskTestCase(unittest.TestCase):

    def setUp(self):
        """
        테스트 환경 설정.
        """
        base_dir = os.path.dirname(os.path.abspath(__file__))
        config_path = os.path.join(base_dir, 'default_config.py')
        # self.app = create_app('testing')
        self.app = create_app(config_path)  # 'testing' 환경 설정
        self.client = self.app.test_client()  # Flask 테스트 클라이언트
        self.app_context = self.app.app_context()
        self.app_context.push()

        # 데이터베이스 초기화
        db.create_all()

        # 더미 사용자 생성
        user = Userinfo(username="testuser", email="test@example.com")
        user.set_password("password123")
        db.session.add(user)
        db.session.commit()

    def tearDown(self):
        """
        테스트 종료 후 정리 작업.
        """
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def login(self, email, password):
        """
        로그인 헬퍼 함수.
        """
        return self.client.post('/auth/login', data={
            'email': email,
            'password': password
        })

    def test_home_page(self):
        """
        홈 페이지 테스트.
        """
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Welcome", response.data)

    def test_register_page(self):
        """
        회원가입 테스트.
        """
        # GET 요청: 회원가입 폼 확인
        response = self.client.get('/auth/register')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Register", response.data)

        # POST 요청: 유효한 데이터로 회원가입
        response = self.client.post('/auth/register', data={
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, 302)  # 성공적으로 리디렉션

        # POST 요청: 잘못된 데이터로 회원가입
        response = self.client.post('/auth/register', data={
            'username': '',
            'email': 'invalid-email',
            'password': 'short'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Invalid input", response.data)

    def test_login_page(self):
        """
        로그인 테스트.
        """
        # GET 요청: 로그인 폼 확인
        response = self.client.get('/auth/login')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Login", response.data)

        # POST 요청: 유효한 자격 증명으로 로그인
        response = self.login('test@example.com', 'password123')
        self.assertEqual(response.status_code, 302)  # 성공적으로 리디렉션

        # POST 요청: 잘못된 자격 증명으로 로그인
        response = self.client.post('/auth/login', data={
            'email': 'test@example.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Login Unsuccessful", response.data)

    def test_dashboard_page(self):
        """
        대시보드 테스트.
        """
        # 비로그인 상태에서 대시보드 접근
        response = self.client.get('/auth/dashboard', follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Login", response.data)

        # 로그인 후 대시보드 접근
        self.login('test@example.com', 'password123')
        response = self.client.get('/auth/dashboard')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Welcome to your Dashboard", response.data)

    def test_field_view_page(self):
        """
        노지 데이터 보기 테스트.
        """
        # 더미 데이터 추가
        field = FieldInfo(
            field_name="Test Field",
            lat_arr=json.dumps([37.5665]),
            lng_arr=json.dumps([126.9780])
        )
        db.session.add(field)
        db.session.commit()

        # GET 요청: 노지 데이터 확인
        response = self.client.get('/field/view-field')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"saved field list", response.data)
        self.assertIn(b"Test Field", response.data)

    def test_todo_page(self):
        """
        할 일 관리 페이지 테스트.
        """
        # 더미 할 일 추가
        todo = FieldTodo(
            task_name="Test Task",
            task_content="This is a test task."
        )
        db.session.add(todo)
        db.session.commit()

        # GET 요청: 할 일 데이터 확인
        response = self.client.get('/todo/get-field-todos')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Test Task", response.data)

        # POST 요청: 새로운 할 일 추가
        response = self.client.post('/todo/add-field-todo', json={
            'taskName': 'New Task',
            'taskContent': 'This is a new task.'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Task saved successfully!", response.data)


if __name__ == '__main__':
    unittest.main()
