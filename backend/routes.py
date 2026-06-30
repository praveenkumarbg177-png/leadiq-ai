import datetime
import csv
import io
import jwt
from flask import Blueprint, jsonify, request, current_app, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Lead, FollowUp, Activity
from auth_middleware import token_required, admin_required
from scoring import calculate_lead_score

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'LeadIQ AI Flask API is running!'})

# --- AUTH ROUTES ---
@api_bp.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({'message': 'Email already registered'}), 400
        
    hashed_password = generate_password_hash(data.get('password'))
    new_user = User(
        email=data.get('email'),
        password=hashed_password,
        name=data.get('name'),
        role=data.get('role', 'SALES_AGENT')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

@api_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    if not user or not check_password_hash(user.password, data.get('password')):
        return jsonify({'message': 'Invalid credentials'}), 401
        
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, current_app.config['SECRET_KEY'], algorithm="HS256")
    
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role
        }
    })

# --- LEADS ROUTES ---
@api_bp.route('/leads', methods=['GET'])
@token_required
def get_leads(current_user):
    query = Lead.query
    if current_user.role != 'ADMIN':
        query = query.filter_by(assigned_to_id=current_user.id)
        
    leads = query.order_by(Lead.created_at.desc()).all()
    result = []
    for lead in leads:
        assigned_user = User.query.get(lead.assigned_to_id)
        result.append({
            'id': lead.id,
            'name': lead.name,
            'email': lead.email,
            'phone': lead.phone,
            'company': lead.company,
            'location': lead.location,
            'budget': lead.budget,
            'source': lead.source,
            'status': lead.status.lower(),
            'score': lead.score,
            'scoreCategory': lead.score_category.lower(),
            'propertyInterest': lead.property_interest,
            'propertyType': lead.property_type,
            'urgency': lead.urgency,
            'questionsAsked': lead.questions_asked,
            'siteVisitInterest': lead.site_visit_interest,
            'createdAt': lead.created_at.isoformat(),
            'lastContactedAt': lead.last_contacted_at.isoformat() if lead.last_contacted_at else None,
            'assignedTo': {
                'id': assigned_user.id if assigned_user else '',
                'name': assigned_user.name if assigned_user else 'Unassigned'
            }
        })
    return jsonify({'data': result})

@api_bp.route('/leads', methods=['POST'])
@token_required
def create_lead(current_user):
    data = request.get_json()
    
    try:
        score_data = calculate_lead_score(data)
        
        new_lead = Lead(
            name=data.get('name'),
            email=data.get('email'),
            phone=data.get('phone'),
            company=data.get('company'),
            location=data.get('location'),
            budget=float(data.get('budget', 0)),
            source=data.get('source', 'Website'),
            status='NEW',
            score=score_data['score'],
            score_category=score_data['score_category'],
            urgency=int(data.get('urgency', 0)),
            site_visit_interest=int(data.get('site_visit_interest', 0)),
            questions_asked=int(data.get('questions_asked', 0)),
            property_interest=data.get('property_interest'),
            property_type=data.get('property_type'),
            notes=data.get('notes'),
            ai_next_actions=score_data['ai_next_actions'],
            assigned_to_id=current_user.id
        )
        db.session.add(new_lead)
        db.session.commit()
        
        activity = Activity(
            type='LEAD_CREATED',
            description=f"Lead {new_lead.name} was created with score {new_lead.score} ({new_lead.score_category}).",
            lead_id=new_lead.id,
            user_id=current_user.id
        )
        db.session.add(activity)
        db.session.commit()
        
        return jsonify({'message': 'Lead created', 'id': new_lead.id, 'score': new_lead.score, 'category': new_lead.score_category}), 201
    
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating lead: {str(e)}")
        return jsonify({'message': f'Failed to create lead: {str(e)}'}), 500

@api_bp.route('/leads/<lead_id>', methods=['GET'])
@token_required
def get_lead(current_user, lead_id):
    lead = Lead.query.get_or_404(lead_id)
    if current_user.role != 'ADMIN' and lead.assigned_to_id != current_user.id:
        return jsonify({'message': 'Unauthorized'}), 403
        
    follow_ups = FollowUp.query.filter_by(lead_id=lead.id).order_by(FollowUp.created_at.desc()).all()
    activities = Activity.query.filter_by(lead_id=lead.id).order_by(Activity.created_at.desc()).all()
    assigned_user = User.query.get(lead.assigned_to_id)
    
    return jsonify({
        'id': lead.id,
        'name': lead.name,
        'email': lead.email,
        'phone': lead.phone,
        'company': lead.company,
        'location': lead.location,
        'budget': lead.budget,
        'source': lead.source,
        'status': lead.status.lower(),
        'score': lead.score,
        'scoreCategory': lead.score_category.lower(),
        'urgency': lead.urgency,
        'siteVisitInterest': lead.site_visit_interest,
        'questionsAsked': lead.questions_asked,
        'aiNextActions': lead.ai_next_actions,
        'aiSummary': lead.ai_summary or f"Lead score: {lead.score}/100 ({lead.score_category}). Budget: ₹{lead.budget:,.0f}. Urgency: {lead.urgency}/10.",
        'notes': lead.notes,
        'propertyInterest': lead.property_interest,
        'propertyType': lead.property_type,
        'tags': lead.tags or [],
        'assignedTo': {
            'id': assigned_user.id if assigned_user else '',
            'name': assigned_user.name if assigned_user else 'Unassigned'
        },
        'createdAt': lead.created_at.isoformat(),
        'lastContactedAt': lead.last_contacted_at.isoformat() if lead.last_contacted_at else None,
        'followUps': [{
            'id': f.id,
            'type': f.type,
            'notes': f.notes,
            'status': f.status,
            'scheduledAt': f.scheduled_at.isoformat() if f.scheduled_at else None,
            'completedAt': f.completed_at.isoformat() if f.completed_at else None,
            'createdAt': f.created_at.isoformat()
        } for f in follow_ups],
        'activities': [{
            'id': a.id,
            'type': a.type,
            'description': a.description,
            'createdAt': a.created_at.isoformat(),
            'userName': User.query.get(a.user_id).name if User.query.get(a.user_id) else 'System'
        } for a in activities]
    })

@api_bp.route('/leads/<lead_id>', methods=['PUT'])
@token_required
def update_lead(current_user, lead_id):
    lead = Lead.query.get_or_404(lead_id)
    if current_user.role != 'ADMIN' and lead.assigned_to_id != current_user.id:
        return jsonify({'message': 'Unauthorized'}), 403
        
    data = request.get_json()
    old_status = lead.status

    if 'status' in data:
        lead.status = data['status'].upper()
        if lead.status != old_status:
            activity = Activity(
                type='STATUS_CHANGE',
                description=f"Status changed from {old_status} to {lead.status}.",
                lead_id=lead.id,
                user_id=current_user.id
            )
            db.session.add(activity)
    if 'notes' in data: lead.notes = data['notes']
    if 'assigned_to_id' in data: lead.assigned_to_id = data['assigned_to_id']
    
    if 'name' in data: lead.name = data['name']
    if 'email' in data: lead.email = data['email']
    if 'phone' in data: lead.phone = data['phone']
    if 'company' in data: lead.company = data['company']
    if 'location' in data: lead.location = data['location']
    if 'budget' in data: lead.budget = float(data['budget'])
    if 'source' in data: lead.source = data['source']
    if 'property_interest' in data: lead.property_interest = data['property_interest']
    if 'property_type' in data: lead.property_type = data['property_type']
        
    db.session.commit()
    return jsonify({'message': 'Lead updated'})

@api_bp.route('/leads/<lead_id>/contact', methods=['POST'])
@token_required
def mark_contacted(current_user, lead_id):
    lead = Lead.query.get_or_404(lead_id)
    lead.last_contacted_at = datetime.datetime.utcnow()
    if lead.status == 'NEW':
        lead.status = 'CONTACTED'
    
    activity = Activity(
        type='CALL',
        description='Lead marked as contacted.',
        lead_id=lead.id,
        user_id=current_user.id
    )
    db.session.add(activity)
    db.session.commit()
    return jsonify({'message': 'Lead marked as contacted'})

@api_bp.route('/leads/<lead_id>/followups', methods=['POST'])
@token_required
def add_followup(current_user, lead_id):
    lead = Lead.query.get_or_404(lead_id)
    data = request.get_json()
    
    scheduled_at_str = data.get('scheduled_at')
    if scheduled_at_str:
        try:
            scheduled_at = datetime.datetime.fromisoformat(scheduled_at_str)
        except ValueError:
            scheduled_at = datetime.datetime.utcnow()
    else:
        scheduled_at = datetime.datetime.utcnow()

    new_followup = FollowUp(
        type=data.get('type', 'CALL'),
        notes=data.get('notes'),
        status=data.get('status', 'pending'),
        scheduled_at=scheduled_at,
        lead_id=lead.id,
        user_id=current_user.id
    )
    db.session.add(new_followup)
    
    lead.follow_up_history = (lead.follow_up_history or 0) + 1
    
    activity = Activity(
        type='FOLLOW_UP',
        description=f"Follow-up ({data.get('type', 'CALL')}) scheduled. Notes: {data.get('notes', 'N/A')}",
        lead_id=lead.id,
        user_id=current_user.id
    )
    db.session.add(activity)
    db.session.commit()
    
    return jsonify({'message': 'Follow-up added', 'id': new_followup.id}), 201

# --- FOLLOW-UPS LIST ---
@api_bp.route('/followups', methods=['GET'])
@token_required
def get_all_followups(current_user):
    if current_user.role == 'ADMIN':
        follow_ups = FollowUp.query.order_by(FollowUp.scheduled_at.asc()).all()
    else:
        follow_ups = FollowUp.query.filter_by(user_id=current_user.id).order_by(FollowUp.scheduled_at.asc()).all()
    
    result = []
    for fu in follow_ups:
        lead = Lead.query.get(fu.lead_id)
        result.append({
            'id': fu.id,
            'leadId': fu.lead_id,
            'leadName': lead.name if lead else 'Unknown',
            'type': fu.type,
            'notes': fu.notes,
            'status': fu.status,
            'scheduledAt': fu.scheduled_at.isoformat() if fu.scheduled_at else None,
            'completedAt': fu.completed_at.isoformat() if fu.completed_at else None,
        })
    return jsonify({'data': result})

# --- CSV EXPORT ---
@api_bp.route('/leads/export/csv', methods=['GET'])
@token_required
def export_leads_csv(current_user):
    query = Lead.query
    if current_user.role != 'ADMIN':
        query = query.filter_by(assigned_to_id=current_user.id)
    leads = query.order_by(Lead.created_at.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Lead ID', 'Name', 'Email', 'Phone', 'Location', 'Budget', 'Score', 'Category', 'Status', 'Source', 'Property Interest', 'Created At'])
    for lead in leads:
        writer.writerow([
            lead.id, lead.name, lead.email, lead.phone, lead.location,
            lead.budget, lead.score, lead.score_category, lead.status,
            lead.source, lead.property_interest or '', lead.created_at.strftime('%Y-%m-%d')
        ])
    
    response = make_response(output.getvalue())
    response.headers['Content-Disposition'] = 'attachment; filename=leads_export.csv'
    response.headers['Content-Type'] = 'text/csv'
    return response

# --- ANALYTICS ---
@api_bp.route('/analytics/dashboard', methods=['GET'])
@token_required
def get_dashboard_analytics(current_user):
    query = Lead.query
    if current_user.role != 'ADMIN':
        query = query.filter_by(assigned_to_id=current_user.id)
        
    total_leads = query.count()
    hot_leads = query.filter_by(score_category='HOT').count()
    warm_leads = query.filter_by(score_category='WARM').count()
    cold_leads = query.filter_by(score_category='COLD').count()
    
    converted = query.filter_by(status='CONVERTED').count()
    revenue = sum([l.budget for l in query.filter_by(status='CONVERTED').all()])

    today = datetime.datetime.utcnow().date()
    today_start = datetime.datetime.combine(today, datetime.time.min)
    today_end = datetime.datetime.combine(today, datetime.time.max)
    today_leads = query.filter(Lead.created_at >= today_start, Lead.created_at <= today_end).count()

    month_start = datetime.datetime.utcnow().replace(day=1, hour=0, minute=0, second=0)
    monthly_leads = query.filter(Lead.created_at >= month_start).count()

    pending_followups = FollowUp.query.filter_by(status='pending').count()
    
    return jsonify({
        'metrics': {
            'totalLeads': total_leads,
            'hotLeads': hot_leads,
            'warmLeads': warm_leads,
            'coldLeads': cold_leads,
            'convertedLeads': converted,
            'totalRevenue': revenue,
            'todayLeads': today_leads,
            'monthlyLeads': monthly_leads,
            'followUpsPending': pending_followups,
            'conversionRate': round((converted / total_leads * 100), 1) if total_leads > 0 else 0
        }
    })
