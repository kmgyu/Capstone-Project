# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import dotenv
import os

import pymysql
pymysql.install_as_MySQLdb()

# # OpenAI API 키 설정
# openai.api_key = 
dotenv.load_dotenv()
DATABASE_URI=os.environ.get('DATABASE_URI')

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI

db = SQLAlchemy(app)

for_test = 'map_test/'


# 노지 db 연동
class field_info(db.Model, ):
    field_id = db.Column(db.Integer, primary_key=True)
    lat_arr = db.Column(db.String(), unique=True, nullable=False)
    lng_arr = db.Column(db.String(), unique=True, nullable=False)
    field_address = db.Column(db.String(), unique=True, nullable=False) 
    crop_name = db.Column(db.String(), unique=True, nullable=False)
# 메인 페이지 (HTML 렌더링)

@app.route("/")
def index():
    return render_template(for_test + "index.html")


fields = [] # 노지이름, 노지 좌표

saved_polygons = [] # 폴리곤 좌표 리스트 (임시 2차원 리스트로 저장중)
@app.route('/polygon', methods=['GET'])  # 폴리곤 화면 출력
def polygon():
    return render_template(for_test+'polygon.html')

@app.route("/save-field", methods=["POST"])
def save_field():
    data = request.get_json()

    if not data or "name" not in data or "polygon" not in data:
        return jsonify({"error": "Invalid data format"}), 400

    fields.append(data)
    print("Current fields:", fields)

    return jsonify({"message": "Field save", "fields": fields})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
