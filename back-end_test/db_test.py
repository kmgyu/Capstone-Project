from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
import pymysql

pymysql.install_as_MySQLdb()

# 환경 변수 로드
load_dotenv()

# 데이터베이스 URI 가져오기
DATABASE_URI = os.environ.get("DATABASE_URI")
if not DATABASE_URI:
    raise ValueError("Error: DATABASE_URI is not set in .env file!")

# Flask 애플리케이션 설정
app = Flask(__name__)
app.config["SECRET_KEY"] = "your_secret_key"
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# 데이터베이스 초기화
db = SQLAlchemy(app)

# 모델 정의
class FieldInfo(db.Model):
    __tablename__ = "field_info"

    field_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    lat_arr = db.Column(db.Text, nullable=False)
    lng_arr = db.Column(db.Text, nullable=False)
    field_address = db.Column(db.String(255), nullable=False)
    crop_name = db.Column(db.String(255), nullable=False)
    farm_area = db.Column(db.Float, nullable=True)
    farm_startdate = db.Column(db.Date, nullable=True)

# 데이터베이스 연결 테스트
with app.app_context():
    try:
        engine = db.engine
        connection = engine.connect()
        print("Database connection successful!")
        connection.close()
    except Exception as e:
        print(f"Database connection failed: {e}")

if __name__ == "__main__":
    app.run(debug=True)
