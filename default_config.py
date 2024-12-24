import dotenv
import os

dotenv.load_dotenv()

API_KEY=os.environ.get('API_KEY')
SECRET_KEY = 'your_secret_key'
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI')
DEBUG = True