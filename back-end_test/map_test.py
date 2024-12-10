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

for_test = 'map_test/'


# 노지 db 연동
class FieldInfo(db.Model):
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



@app.route('/')
def index():
    return render_template(for_test + 'index.html')

@app.route('/polygon')
def polygon():
    return render_template(for_test +'polygon.html')

@app.route('/view_field', methods=['GET', 'POST'])
def view_field():
    fields = FieldInfo.query.all()  # 데이터베이스에서 필드 정보를 가져옴
    field_data = [
        {
            'field_id': field.field_id,
            'coordinate': zip(json.loads(field.lat_arr), json.loads(field.lng_arr)),
        }
        for field in fields
    ]
    return render_template(for_test + 'view_field.html', fields=field_data)

@app.route('/save-field', methods=['POST'])
def save_field():
    # 요청 데이터
    data = request.get_json()

    field_data = data['fieldData'] # 위도 경도 저장
    field_id = field_data['name']  # 필드 id, 노지 입력란으로 일단 해둠
    # 위도, 경도 배열 추출
    lat_arr = json.dumps([point['lat'] for point in field_data['polygon']])
    lng_arr = json.dumps([point['lng'] for point in field_data['polygon']])

    # 새 필드 생성 및 DB 저장
    field = FieldInfo(
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