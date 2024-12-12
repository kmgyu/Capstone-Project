# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import dotenv
import os
import json
from datetime import date

import pymysql
pymysql.install_as_MySQLdb()

# # OpenAI API 키 설정
# openai.api_key = 
dotenv.load_dotenv()
DATABASE_URI=os.environ.get('DATABASE_URI')

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# 노지 db 연동
class FieldTodo(db.Model):
    __tablename__ = 'field_info'
    field_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    field_name = db.Column(db.String(255), nullable=False)
    lat_arr = db.Column(db.Text, nullable=False)
    lng_arr = db.Column(db.Text, nullable=False)
    # 아래는 수정 더미데이터들
    field_address = db.Column(db.String(255), default='mokpo, 임시 값이다.')
    crop_name = db.Column(db.String(255), default='상추, 임시값이다.')
    field_area = db.Column(db.Float, default=0.0)
    farm_startdate = db.Column(db.Date, default=date.today)



if __name__ == '__main__':
    # http://orion.mokpo.ac.kr:8483/
    app.run(host='0.0.0.0', port=3000, debug=True)