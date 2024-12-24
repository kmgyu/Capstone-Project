from flask import Blueprint, render_template, request, jsonify
from mid_term.models import db, FieldInfo
import json
from datetime import date

# Blueprint 생성: field_views
# 이 블루프린트는 필드와 관련된 CRUD 작업을 담당합니다.
field_views = Blueprint('field_views', __name__)

# 템플릿 경로 설정
template_path = 'field_views/'  # 모든 템플릿은 templates/field_views/ 경로 아래에 있어야 함

@field_views.route('/')
def index():
    """
    필드 관리 메인 페이지.
    - GET: 필드 관리의 메인 페이지 렌더링.

    반환값:
    - index.html 템플릿 렌더링.
    
    주의 : view-field를 include함.
    """
    
    # 데이터베이스에서 모든 필드 정보 가져오기
    fields = FieldInfo.query.all()
    field_data = [
        {
            'field_id': field.field_id,
            'field_name': field.field_name,
            'field_address': field.field_address,
            'crop_name': field.crop_name,
            'field_area': field.field_area,
            'farm_startdate': field.farm_startdate,
            'coordinate': list(zip(json.loads(field.lat_arr), json.loads(field.lng_arr))),
        }
        for field in fields
    ]
    
    return render_template(template_path + 'index.html',  fields=field_data)

@field_views.route('/polygon')
def polygon():
    """
    다각형 데이터를 시각화하는 페이지.
    - GET: 다각형 정보를 표시하는 페이지 렌더링.

    반환값:
    - polygon.html 템플릿 렌더링.
    """
    return render_template(template_path + 'polygon.html')

@field_views.route('/view-field', methods=['GET'])
def view_field():
    """
    모든 필드 데이터를 조회하여 시각화.
    - GET: 데이터베이스에서 모든 필드 정보를 가져와 템플릿에 전달.

    반환값:
    - view_field.html 템플릿 렌더링 (필드 데이터 포함).
    """
    # 데이터베이스에서 모든 필드 정보 가져오기
    fields = FieldInfo.query.all()
    field_data = [
        {
            'field_id': field.field_id,
            'field_name': field.field_name,
            'field_address': field.field_address,
            'crop_name': field.crop_name,
            'field_area': field.field_area,
            'farm_startdate': field.farm_startdate,
            'coordinate': list(zip(json.loads(field.lat_arr), json.loads(field.lng_arr))),
        }
        for field in fields
    ]

    # 템플릿에 필드 데이터 전달
    return render_template(template_path + 'view_field.html', fields=field_data)

@field_views.route('/save-field', methods=['POST'])
def save_field():
    """
    새로운 필드를 데이터베이스에 저장.
    - POST: 클라이언트에서 전달된 JSON 데이터를 기반으로 새로운 필드 생성 및 저장.

    요청 데이터:
    - fieldData: 필드 이름, 주소, 경작 작물, 다각형 좌표 등.

    반환값:
    - 성공 메시지를 포함한 JSON 응답 (HTTP 상태 코드 200).
    """
    # 클라이언트 요청 데이터 가져오기
    data = request.get_json()

    # 필드 데이터 파싱
    field_data = data['fieldData']
    field_name = field_data['name']  # 필드 이름
    lat_arr = json.dumps([point['lat'] for point in field_data['polygon']])  # 위도 배열
    lng_arr = json.dumps([point['lng'] for point in field_data['polygon']])  # 경도 배열

    # 데이터베이스에 새 필드 저장
    field = FieldInfo(
        field_name=field_name,
        field_address=field_data.get('address', 'Unknown Address'),
        crop_name=field_data.get('crop', 'Unknown Crop'),
        field_area=field_data.get('area', 0.0),
        farm_startdate=field_data.get('start_date', date.today()),
        lat_arr=lat_arr,
        lng_arr=lng_arr,
    )
    db.session.add(field)
    db.session.commit()  # 변경사항 커밋

    # 성공 응답 반환
    return jsonify({"message": "Field saved successfully!"}), 200

@field_views.route('/update-field/<int:field_id>', methods=['PUT'])
def update_field(field_id):
    """
    기존 필드 데이터를 업데이트.
    - PUT: 주어진 필드 ID를 기반으로 필드 데이터를 업데이트.

    요청 데이터:
    - 필드 이름, 주소, 경작 작물, 면적, 시작 날짜 등.

    반환값:
    - 성공 메시지를 포함한 JSON 응답 (HTTP 상태 코드 200).
    """
    data = request.get_json()

    # 필드 데이터 조회
    field = FieldInfo.query.get_or_404(field_id)
    field.field_name = data.get('field_name', field.field_name)
    field.field_address = data.get('field_address', field.field_address)
    field.crop_name = data.get('crop_name', field.crop_name)
    field.field_area = data.get('field_area', field.field_area)
    field.farm_startdate = data.get('farm_startdate', field.farm_startdate)

    # 다각형 좌표 업데이트
    if 'lat_arr' in data and 'lng_arr' in data:
        field.lat_arr = json.dumps(data['lat_arr'])
        field.lng_arr = json.dumps(data['lng_arr'])

    db.session.commit()  # 변경사항 커밋
    return jsonify({"message": "Field updated successfully!"}), 200

@field_views.route('/delete-field/<int:field_id>', methods=['DELETE'])
def delete_field(field_id):
    """
    필드 데이터를 삭제.
    - DELETE: 주어진 필드 ID를 기반으로 데이터베이스에서 필드를 삭제.

    반환값:
    - 성공 메시지를 포함한 JSON 응답 (HTTP 상태 코드 200).
    """
    # 필드 데이터 조회 및 삭제
    field = FieldInfo.query.get_or_404(field_id)
    db.session.delete(field)
    db.session.commit()  # 변경사항 커밋
    return jsonify({"message": "Field deleted successfully!"}), 200
