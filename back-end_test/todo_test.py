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
    period = db.Column(db.Integer, default=0)

@app.route('/')
def index():
    return render_template('main.html')

@app.route('/add-field-todo', methods=['POST'])
def add_field_todo():
    # 요청 데이터
    data = request.get_json()
    if not data or 'taskName' not in data or 'taskContent' not in data:
        return jsonify({"error": "Invalid input data"}), 400

    task_name = data['taskName']  # 작업 이름
    task_content = data['taskContent']  # 작업 내용
    # cycle = data.get('cycle', 1)  # 주기 (기본값: 1)
    # period = data.get('period', 0)  # 기간 (기본값: 0)

    # 새 작업 생성 및 DB 저장
    task = FieldTodo(
        task_name=task_name,
        task_content=task_content,
        # cycle=cycle,
        # period=period
    )
    db.session.add(task)
    db.session.commit()

    return jsonify({"message": "Task saved successfully!", "taskId": task.task_id}), 200

@app.route('/get-field-todo', methods=['GET'])
def get_field_todo():
    tasks = FieldTodo.query.all()
    task_data = [
        {
            'taskId': task.task_id,
            'taskName': task.task_name,
            'taskContent': task.task_content,
            'cycle': task.cycle,
            'startDate': task.start_date,
            'period': task.period
        }
        for task in tasks
    ]
    return jsonify(task_data), 200

if __name__ == '__main__':
    # http://orion.mokpo.ac.kr:8483/
    app.run(host='0.0.0.0', port=3000, debug=True)