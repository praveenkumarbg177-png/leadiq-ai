"""
Database initialization script.
Run this once to create all tables and seed the default admin user.
Called automatically during Render deployment via buildCommand.
"""
import os
from app import create_app
from models import db, User
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    # Create all tables (safe to run multiple times)
    db.create_all()
    print("✅ Database tables created.")

    # Seed default admin user if not exists
    admin_email = 'admin@leadiq.com'
    if not User.query.filter_by(email=admin_email).first():
        admin = User(
            email=admin_email,
            password=generate_password_hash('admin123'),
            name='System Admin',
            role='ADMIN'
        )
        db.session.add(admin)

        # Also seed a demo sales agent
        agent = User(
            email='agent@leadiq.com',
            password=generate_password_hash('agent123'),
            name='Demo Agent',
            role='SALES_AGENT'
        )
        db.session.add(agent)

        db.session.commit()
        print("✅ Admin user created: admin@leadiq.com / admin123")
        print("✅ Agent user created: agent@leadiq.com / agent123")
    else:
        print("ℹ️  Admin user already exists.")
