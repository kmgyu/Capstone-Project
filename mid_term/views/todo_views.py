from flask import Blueprint, render_template, request, jsonify
from mid_term.models import db, FieldTodo
from sqlalchemy.sql import func

# Blueprint 생성: todo_views
# 이 블루프린트는 할 일 관리와 관련된 CRUD 작업을 담당합니다.
todo_views = Blueprint('todo_views', __name__)

# 템플릿 경로 설정
template_path = 'todo/'  # 모든 템플릿은 templates/todo/ 경로 아래에 있어야 함

@todo_views.route('/')
def index():
    """
    할 일 관리 메인 페이지.
    - GET: 할 일 관리의 메인 페이지 렌더링.

    반환값:
    - main.html 템플릿 렌더링.
    """
    return render_template(template_path + 'main.html')

@todo_views.route('/add-field-todo', methods=['POST'])
def add_field_todo():
    """
    새로운 할 일을 데이터베이스에 추가.
    - POST: 클라이언트에서 전달된 JSON 데이터를 기반으로 새로운 할 일 생성 및 저장.

    요청 데이터:
    - taskName: 작업 이름 (필수).
    - taskContent: 작업 내용 (필수).

    반환값:
    - 성공: 성공 메시지와 생성된 작업 ID를 포함한 JSON 응답 (HTTP 상태 코드 200).
    - 실패: 에러 메시지를 포함한 JSON 응답 (HTTP 상태 코드 400).
    """
    # 요청 데이터
    data = request.get_json()

    # 유효성 검사
    if not data or 'taskName' not in data or 'taskContent' not in data:
        return jsonify({"error": "Invalid input data"}), 400

    task_name = data['taskName']  # 작업 이름
    task_content = data['taskContent']  # 작업 내용

    # 새 작업 생성 및 DB 저장
    task = FieldTodo(
        task_name=task_name,
        task_content=task_content,
    )
    db.session.add(task)
    db.session.commit()

    return jsonify({"message": "Task saved successfully!", "taskId": task.task_id}), 200

@todo_views.route('/get-field-todos', methods=['GET'])
def get_field_todos():
    """
    모든 할 일을 조회하여 반환.
    - GET: 데이터베이스에서 모든 할 일 데이터를 가져와 JSON 형식으로 반환.

    반환값:
    - 성공: 모든 할 일 데이터를 포함한 JSON 응답 (HTTP 상태 코드 200).
    """
    # 데이터베이스에서 모든 할 일 가져오기
    tasks = FieldTodo.query.all()
    task_list = [
        {
            "taskId": task.task_id,
            "taskName": task.task_name,
            "taskContent": task.task_content,
            "cycle": task.cycle,
            "startDate": task.start_date,
            "period": task.period
        }
        for task in tasks
    ]
    return jsonify(task_list), 200

@todo_views.route('/update-field-todo/<int:task_id>', methods=['PUT'])
def update_field_todo(task_id):
    """
    기존 할 일 데이터를 업데이트.
    - PUT: 주어진 할 일 ID를 기반으로 데이터베이스에 저장된 작업을 업데이트.

    요청 데이터:
    - taskName: 작업 이름.
    - taskContent: 작업 내용.
    - cycle: 작업 주기.
    - period: 작업 기간.

    반환값:
    - 성공: 성공 메시지를 포함한 JSON 응답 (HTTP 상태 코드 200).
    - 실패: 에러 메시지를 포함한 JSON 응답 (HTTP 상태 코드 404).
    """
    # 요청 데이터 가져오기
    data = request.get_json()

    # 작업 데이터 조회
    task = FieldTodo.query.get_or_404(task_id)
    task.task_name = data.get('taskName', task.task_name)
    task.task_content = data.get('taskContent', task.task_content)
    task.cycle = data.get('cycle', task.cycle)
    task.period = data.get('period', task.period)

    db.session.commit()  # 변경사항 커밋
    return jsonify({"message": "Task updated successfully!"}), 200

@todo_views.route('/delete-field-todo/<int:task_id>', methods=['DELETE'])
def delete_field_todo(task_id):
    """
    특정 할 일 데이터를 삭제.
    - DELETE: 주어진 할 일 ID를 기반으로 데이터베이스에서 작업을 삭제.

    반환값:
    - 성공: 성공 메시지를 포함한 JSON 응답 (HTTP 상태 코드 200).
    - 실패: 에러 메시지를 포함한 JSON 응답 (HTTP 상태 코드 404).
    """
    # 작업 데이터 조회
    task = FieldTodo.query.get_or_404(task_id)

    # 데이터 삭제
    db.session.delete(task)
    db.session.commit()  # 변경사항 커밋
    return jsonify({"message": "Task deleted successfully!"}), 200
