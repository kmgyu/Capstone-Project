# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
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
    task_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    task_name = db.Column(db.String(255), nullable=False)
    task_content = db.Column(db.Text, nullable=False)
    # 아래는 수정 더미데이터들
    cycle = db.Column(db.Integer, default=1)
    start_date = db.Column(db.TIMESTAMP, default=func.now())  # 기본값: 현재 시간
    period = db.Column(db.Integer, default='상추, 임시값이다.')

@app.route('/')
def index():
    return render_template('main.html')

@app.route('/add-field-todo', methods=['GET', 'POST'])
def add_field_todo():
    # 요청 데이터
    data = request.get_json()

    field_data = data['fieldData'] # 위도 경도 저장
    field_id = field_data['name']  # 필드 id, 노지 입력란으로 일단 해둠
    # 위도, 경도 배열 추출
    lat_arr = json.dumps([point['lat'] for point in field_data['polygon']])
    lng_arr = json.dumps([point['lng'] for point in field_data['polygon']])

    # 새 필드 생성 및 DB 저장
    field = FieldTodo(
        field_name=field_id,
        lat_arr=lat_arr,
        lng_arr=lng_arr,
    )
    db.session.add(field)
    db.session.commit()

    return jsonify({"message": "Field saved successfully!"}), 200

if __name__ == '__main__':
    # http://orion.mokpo.ac.kr:8483/
    app.run(host='0.0.0.0', port=3000, debug=True)