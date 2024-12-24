from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import UserMixin
from sqlalchemy.sql import func
from datetime import date
import json

import pymysql
pymysql.install_as_MySQLdb()

# Initialize extensions
db = SQLAlchemy()
bcrypt = Bcrypt()

# User model
class Userinfo(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

# Field information model
class FieldInfo(db.Model):
    __tablename__ = 'field_info'
    field_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    field_name = db.Column(db.String(255), nullable=False)
    lat_arr = db.Column(db.Text, nullable=False)  # Latitude array stored as JSON
    lng_arr = db.Column(db.Text, nullable=False)  # Longitude array stored as JSON
    field_address = db.Column(db.String(255), default='mokpo, 임시 값이다.')
    crop_name = db.Column(db.String(255), default='상추, 임시값이다.')
    field_area = db.Column(db.Float, default=0.0)
    farm_startdate = db.Column(db.Date, default=date.today)

# Field tasks model
class FieldTodo(db.Model):
    __tablename__ = 'field_todo'
    task_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    task_name = db.Column(db.String(255), nullable=False)
    task_content = db.Column(db.Text, nullable=False)
    cycle = db.Column(db.Integer, default=1)
    start_date = db.Column(db.TIMESTAMP, default=func.now())  # Default: current timestamp
    period = db.Column(db.Integer, default=0)
