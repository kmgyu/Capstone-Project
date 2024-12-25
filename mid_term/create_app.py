from flask import Flask, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from mid_term.models import db, bcrypt, Userinfo
from mid_term.views.auth import auth
from mid_term.views.field_views import field_views
from mid_term.views.todo_views import todo_views

def create_app(config_path='default_config.py'):
    # 애플리케이션 인스턴스 생성
    app = Flask(__name__)
    
    app.config.from_pyfile(config_path)
    
    # 애플리케이션 설정
    # app.config['SECRET_KEY'] = 'your_secret_key'
    # app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'  # Update as needed
    # app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # 불필요한 경고 방지

    # 확장 초기화
    db.init_app(app)
    bcrypt.init_app(app)
    login_manager = LoginManager(app)
    login_manager.login_view = 'auth.login'
    
    # 사용자 로드 함수 등록
    @login_manager.user_loader
    def load_user(user_id):
        return Userinfo.query.get(int(user_id))  # 데이터베이스에서 사용자 ID로 사용자 로드

    @app.route('/')
    def index():
        return redirect(url_for('auth.dashboard'))

    # Blueprint 등록
    app.register_blueprint(auth, url_prefix='/auth')
    app.register_blueprint(field_views, url_prefix='/field')
    app.register_blueprint(todo_views, url_prefix='/todo')

    return app
