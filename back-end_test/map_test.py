# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

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



@app.route('/polygon', methods=['GET'])
def polygon():
    return render_template(for_test+'polygon.html')

saved_polygon = [] # 폴리곤 좌표값 json 형태로 저장
@app.route("/save-polygon", methods=["POST"]) # polygon 받아오기
def save_polygon():
    global saved_polygon
    data = request.get_json()

    if not data or "polygon" not in data:
        return jsonify({"error": "Invalid data format"}), 400

    saved_polygon = data["polygon"]
    print("Received polygon data:", saved_polygon)

    return jsonify({"message": "Polygon saved successfully!"})


# @app.route('/save_marker', methods=['POST'])
# def save_marker():
#     data = request.get_json()
#     lat = data.get('lat')
#     lng = data.get('lng')
#     print(f"Received marker data - Latitude: {lat}, Longitude: {lng}")
#     return jsonify({"message": "Marker data received", "lat": lat, "lng": lng})

# @app.route('/save_way', methods=['POST'])
# def save_way():
#     data = request.get_json()
#     marker_data = data.get('markerData')
#     print("Received path data:", marker_data)
#     return jsonify({"message": "Path data received", "path": marker_data})

# @app.route('/save_polygon', methods=['POST'])
# def save_polygon():
#     data = request.get_json()
#     polygon_data = data.get('polygonData')
#     print("Received polygon data:", polygon_data)
#     return jsonify({"message": "Polygon data received", "polygon": polygon_data})

# # 마커 데이터 저장 (DB 제외하고 출력만)
# @app.route('/add_marker', methods=['POST'])
# def add_marker():
#     data = request.get_json()
#     lat = data['lat']
#     lng = data['lng']
    
#     # 서버 터미널에 출력
#     print(f"Marker added - Latitude: {lat}, Longitude: {lng}")
    
#     return jsonify({'message': 'Marker added successfully!'})

# # 다각형 데이터 저장 (DB 제외하고 출력만)
# @app.route('/save_polygon', methods=['POST'])
# def save_polygon():
#     data = request.get_json()
#     path = data['path']  # 다각형의 좌표 리스트
    
#     # 서버 터미널에 출력
#     print(f"Polygon saved - Path: {path}")
    
#     return jsonify({'message': 'Polygon saved successfully!'})

# # 마커 데이터 조회 (DB 제외하고 출력만)
# @app.route('/get_markers', methods=['GET'])
# def get_markers():
#     # 예시로 몇 개의 마커를 출력
#     markers = [
#         {'lat': 33.450701, 'lng': 126.570667},
#         {'lat': 33.451701, 'lng': 126.571667}
#     ]
    
#     # 서버 터미널에 출력
#     print(f"Markers retrieved: {markers}")
    
#     return jsonify(markers)

# # 다각형 데이터 조회 (DB 제외하고 출력만)
# @app.route('/get_polygons', methods=['GET'])
# def get_polygons():
#     # 예시로 몇 개의 다각형을 출력
#     polygons = [
#         {'path': [{'lat': 33.450701, 'lng': 126.570667}, {'lat': 33.451701, 'lng': 126.571667}]}
#     ]
    
#     # 서버 터미널에 출력
#     print(f"Polygons retrieved: {polygons}")
    
#     return jsonify(polygons)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
