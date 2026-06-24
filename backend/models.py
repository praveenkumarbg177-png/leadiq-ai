from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()

def generate_uuid():
    return str(uuid.uuid4())

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), default='SALES_AGENT') # ADMIN, SALES_MANAGER, SALES_AGENT
    phone = db.Column(db.String(20))
    department = db.Column(db.String(50))
    avatar = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    last_active = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    leads = db.relationship('Lead', backref='assigned_to', lazy=True)
    activities = db.relationship('Activity', backref='user', lazy=True)
    follow_ups = db.relationship('FollowUp', backref='user', lazy=True)
    notifications = db.relationship('Notification', backref='user', lazy=True)

class Lead(db.Model):
    __tablename__ = 'leads'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    company = db.Column(db.String(100))
    location = db.Column(db.String(100), nullable=False)
    budget = db.Column(db.Float, nullable=False)
    source = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default='NEW') # NEW, CONTACTED, QUALIFIED, PROPOSAL, CONVERTED, LOST
    
    # AI Scoring Fields
    score = db.Column(db.Integer, default=0)
    score_category = db.Column(db.String(20), default='COLD') # HOT, WARM, COLD
    urgency = db.Column(db.Integer, default=1)
    site_visit_interest = db.Column(db.Integer, default=1)
    questions_asked = db.Column(db.Integer, default=0)
    follow_up_history = db.Column(db.Integer, default=0)
    
    property_interest = db.Column(db.String(255))
    property_type = db.Column(db.String(100))
    notes = db.Column(db.Text)
    
    # Array fields (simulated with JSON for SQLite compatibility, natively JSONB/Array in Postgres)
    tags = db.Column(db.JSON, default=list)
    ai_summary = db.Column(db.Text)
    ai_next_actions = db.Column(db.JSON, default=list)
    
    assigned_to_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    
    last_contacted_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    activities = db.relationship('Activity', backref='lead', lazy=True, cascade='all, delete-orphan')
    follow_ups = db.relationship('FollowUp', backref='lead', lazy=True, cascade='all, delete-orphan')

class Activity(db.Model):
    __tablename__ = 'activities'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    metadata_json = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    lead_id = db.Column(db.String(36), db.ForeignKey('leads.id'), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)

class FollowUp(db.Model):
    __tablename__ = 'follow_ups'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    type = db.Column(db.String(50), nullable=False)
    notes = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending') # pending, completed, missed
    scheduled_at = db.Column(db.DateTime, nullable=False)
    completed_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    lead_id = db.Column(db.String(36), db.ForeignKey('leads.id'), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)

class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    title = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(20), nullable=False) # info, warning, alert, success
    read = db.Column(db.Boolean, default=False)
    action_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
