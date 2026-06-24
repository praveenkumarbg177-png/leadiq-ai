import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'super-secret-leadiq-key'
    
    # SQLAlchemy configuration
    # Default to SQLite if Postgres URL is not provided
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///leadiq.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Optional API configs
    DEBUG = os.environ.get('FLASK_DEBUG', 'False') == 'True'
    
    # Frontend URL for CORS (set to your Vercel URL in production)
    FRONTEND_URL = os.environ.get('FRONTEND_URL', '*')
