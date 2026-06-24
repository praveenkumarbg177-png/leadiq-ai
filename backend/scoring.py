def calculate_lead_score(lead_data):
    """
    Calculates the lead score and categorizes it.

    Scoring Rules:
    - Budget > 50 Lakhs (5,000,000): +25
    - Budget > 20 Lakhs (2,000,000): +10
    - Wants site visit (site_visit_interest == 1): +20
    - Buying within 1 month (urgency == 1 or buying_timeline == 'immediate'): +25
    - Buying within 3 months (buying_timeline == '1-3months'): +15
    - Asked >= 5 questions: +20
    - Asked >= 2 questions: +10

    Categories:
    - 80-100 = HOT
    - 50-79 = WARM
    - Below 50 = COLD
    """
    score = 0

    # Budget scoring
    budget = float(lead_data.get('budget', 0))
    if budget > 5000000:
        score += 25
    elif budget > 2000000:
        score += 10

    # Site visit interest
    site_visit = int(lead_data.get('site_visit_interest', 0))
    if site_visit == 1:
        score += 20

    # Urgency / Buying timeline scoring
    urgency = int(lead_data.get('urgency', 0))
    buying_timeline = lead_data.get('buying_timeline', '')

    if urgency == 1 or buying_timeline == 'immediate':
        score += 25
    elif buying_timeline == '1-3months':
        score += 15
    elif buying_timeline == '3-6months':
        score += 8

    # Questions asked
    questions = int(lead_data.get('questions_asked', 0))
    if questions >= 5:
        score += 20
    elif questions >= 2:
        score += 10

    # Cap score at 100
    score = min(score, 100)

    if score >= 80:
        category = 'HOT'
    elif score >= 50:
        category = 'WARM'
    else:
        category = 'COLD'

    # AI Recommendations
    recommendations = []
    if category == 'HOT':
        recommendations.append("Contact Immediately — High buying intent detected")
    if site_visit == 1:
        recommendations.append("Schedule Site Visit — Customer expressed interest")
    if category == 'WARM':
        recommendations.append("Send Property Brochure — Nurture with relevant content")
    if category == 'COLD':
        recommendations.append("Call After 1 Week — Low urgency, needs time")
    if questions >= 5:
        recommendations.append("Prepare Detailed FAQ Response — High engagement")
    if budget > 5000000:
        recommendations.append("Assign Senior Agent — High-value prospect")

    if not recommendations:
        recommendations.append("Follow-up via Email")

    return {
        'score': score,
        'score_category': category,
        'ai_next_actions': recommendations
    }
