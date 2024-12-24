from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, login_required
from mid_term.models import Userinfo, db, bcrypt

auth = Blueprint('auth', __name__)
template_path = 'auth/'  # 모든 템플릿은 templates/auth/ 경로 아래에 있어야 함

@auth.route('/register', methods=['GET', 'POST'])
def register():
    """
    회원가입 페이지 라우트.
    - GET: 회원가입 폼 렌더링.
    - POST: 입력된 데이터를 기반으로 새 사용자 등록.

    요청 데이터:
    - username: 사용자 이름.
    - email: 이메일 주소.
    - password: 비밀번호.

    반환값:
    - 성공: 로그인 페이지로 리디렉션.
    - 실패: 에러 메시지를 포함한 회원가입 페이지 렌더링.
    """
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']

        # 유효성 검사
        if not username or not email or not password:
            flash('All fields are required.', 'danger')
            return redirect(url_for('auth.register'))

        existing_user = Userinfo.query.filter_by(email=email).first()
        if existing_user:
            flash('Email already exists. Please use a different email.', 'danger')
            return redirect(url_for('auth.register'))

        # 새 사용자 생성
        user = Userinfo(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        flash('Your account has been created successfully! Please log in.', 'success')
        return redirect(url_for('auth.login'))
    return render_template(template_path + 'register.html')

@auth.route('/login', methods=['GET', 'POST'])
def login():
    """
    로그인 페이지 라우트.
    - GET: 로그인 폼 렌더링.
    - POST: 입력된 자격 증명 확인 및 로그인 처리.

    요청 데이터:
    - email: 사용자 이메일 주소.
    - password: 비밀번호.

    반환값:
    - 성공: 대시보드로 리디렉션.
    - 실패: 에러 메시지를 포함한 로그인 페이지 렌더링.
    """
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = Userinfo.query.filter_by(username=username).first()
        if user and user.check_password(password):
            login_user(user)
            flash('You have successfully logged in.', 'success')
            return redirect(url_for('auth.dashboard'))
        else:
            flash('Invalid username or password. Please try again.', 'danger')
    return render_template(template_path + 'login.html')

@auth.route('/dashboard')
@login_required
def dashboard():
    """
    대시보드 페이지 라우트.
    - 로그인된 사용자만 접근 가능.

    반환값:
    - 대시보드 페이지 렌더링.
    """
    return render_template(template_path + 'dashboard.html')

@auth.route('/logout')
@login_required
def logout():
    """
    로그아웃 라우트.
    - 현재 로그인된 사용자를 로그아웃 처리.

    반환값:
    - 로그인 페이지로 리디렉션.
    """
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('auth.login'))

def email_check():
    """
    Todo Feature
    """
    pass

def password_check():
    """
    Todo Feature
    """
    pass