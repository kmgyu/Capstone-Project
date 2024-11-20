from flask import Flask, request, jsonify

app = Flask(__name__)

# 드론 로그 데이터를 저장할 메모리 공간
drone_logs = []

@app.route('/log', methods=['POST'])
def receive_log():
    data = request.get_json()  # JSON 데이터 받기
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    drone_logs.append(data)  # 데이터를 리스트에 저장
    print(f"Received log: {data}")
    return jsonify({"status": "success", "received": data}), 200

@app.route('/logs', methods=['GET'])
def get_logs():
    return jsonify({"logs": drone_logs}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)  # 서버 실행
