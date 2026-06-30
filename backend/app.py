from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config
from models import db
from routes import api_bp
import os

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Fix for Render's postgres:// vs postgresql:// scheme
    db_url = app.config['SQLALCHEMY_DATABASE_URI']
    if db_url and db_url.startswith('postgres://'):
        app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace('postgres://', 'postgresql://', 1)

    # Initialize extensions — allow frontend URL (configurable via env var)
    # Support multiple comma-separated origins
    frontend_url = app.config['FRONTEND_URL']
    allowed_origins = [url.strip() for url in frontend_url.split(',')] if frontend_url != '*' else '*'
    CORS(app, resources={r"/api/*": {"origins": allowed_origins}}, supports_credentials=True)
    db.init_app(app)
    Migrate(app, db)

    # Register blueprints
    app.register_blueprint(api_bp)

    @app.route('/')
    def index():
        return "LeadIQ AI Backend is running."

    return app

app = create_app()

if __name__ == '__main__':
    # Initialize the database for SQLite fallback if it doesn't exist
    with app.app_context():
        db.create_all()
        
        # Seed admin user
        from models import User
        from werkzeug.security import generate_password_hash
        if not User.query.filter_by(email='admin@leadiq.com').first():
            admin = User(
                email='admin@leadiq.com',
                password=generate_password_hash('admin123'),
                name='System Admin',
                role='ADMIN'
            )
            db.session.add(admin)
            db.session.commit()
            print("Admin user created: admin@leadiq.com / admin123")
    
    app.run(host='0.0.0.0', port=5000, debug=app.config['DEBUG'])
