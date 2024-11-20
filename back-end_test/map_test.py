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

# 메인 페이지 (HTML 렌더링)
@app.route('/')
def index():
    return render_template(for_test+'map_gps.html')

@app.route('/move', methods=['GET'])
def move():
    return render_template(for_test+'move_way.html')

@app.route("/save-markers", methods=["POST"]) # move-markers 좌표값 받아오기
def save_markers():
    global saved_markers
    data = request.get_json()

    if not data or "markers" not in data:
        return jsonify({"error": "Invalid data format"}), 400

    # 마커 데이터를 서버에 저장
    saved_markers = data["markers"]
    print("Received marker data:", saved_markers)

    return jsonify({"message": "Markers saved successfully", "savedMarkers": saved_markers})
# @app.route("/save-markers", methods=["POST"])  # Save field_line data to the database
# def save_markers():
#     data = request.get_json()

#     if not data or "markers" not in data:
#         return jsonify({"error": "Invalid data format"}), 400

#     markers = data["markers"]
#     try:
#         # Convert marker list to JSON string
#         field_line = json.dumps(markers)

#         # Create and save the Field instance
#         new_field = Field(field_line=field_line)
#         db.session.add(new_field)
#         db.session.commit()

#         # Update field_name to match the auto-generated id
#         new_field.field_name = str(new_field.id)
#         db.session.commit()

#         return jsonify({
#             "message": "Field saved successfully",
#             "field_id": new_field.id,
#             "field_name": new_field.field_name,
#             "field_line": markers,
#         }), 200

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"error": str(e)}), 500
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

    return jsonify({"message": "Field saved successfully!", "fields": fields})
    #     try:
#         # Convert marker list to JSON string
#         field_line = json.dumps(markers)

#         # Create and save the Field instance
#         new_field = Field(field_line=field_line)
#         db.session.add(new_field)
#         db.session.commit()

#         # Update field_name to match the auto-generated id
#         new_field.field_name = str(new_field.id)
#         db.session.commit()

#         return jsonify({
#             "message": "Field saved successfully",
#             "field_id": new_field.id,
#             "field_name": new_field.field_name,
#             "field_line": markers,
#         }), 200

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"error": str(e)}), 500

    return jsonify({"message": "Polygon saved successfully!"})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
