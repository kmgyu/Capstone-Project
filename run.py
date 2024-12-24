from mid_term.create_app import create_app
import os

def main():
    """
    Flask 애플리케이션을 실행하는 엔트리 포인트.
    """
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    config_path = os.path.join(base_dir, 'default_config.py')
    # config_path = os.environ.get('FLASK_CONFIG', 'default_config.py')
    
    # Flask 애플리케이션 생성
    app = create_app(config_path=config_path)
    # 애플리케이션 실행
    app.run(host='0.0.0.0', port=3000, debug=app.config.get('DEBUG', False))

if __name__ == '__main__':
    main()
