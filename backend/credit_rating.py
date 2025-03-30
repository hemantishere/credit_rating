def calculate_individual_risk_score(mortgage):
    risk_score = 0
    ltv = mortgage["loan_amount"] / mortgage["property_value"]
    if ltv > 0.9:
        risk_score += 2
    elif ltv > 0.8:
        risk_score += 1

    dti = mortgage["debt_amount"] / mortgage["annual_income"]
    if dti > 0.5:
        risk_score += 2
    elif dti > 0.4:
        risk_score += 1

    if mortgage["credit_score"] >= 700:
        risk_score -= 1
    elif mortgage["credit_score"] < 650:
        risk_score += 1

    if mortgage["loan_type"] == "fixed":
        risk_score -= 1
    else:
        risk_score += 1

    if mortgage["property_type"] == "condo":
        risk_score += 1

    return risk_score

def get_rating_from_score(risk_score):
    if risk_score <= 2:
        return "AAA"
    elif 3 <= risk_score <= 5:
        return "BBB"
    else:
        return "C"

def calculate_credit_rating(mortgage):
    return calculate_individual_risk_score(mortgage)  # Return numeric score for storage

def calculate_rmbs_rating(mortgages):
    if not mortgages:
        return "N/A"
    
    individual_scores = [calculate_individual_risk_score(m) for m in mortgages]
    total_score = sum(individual_scores)
    avg_credit_score = sum(m["credit_score"] for m in mortgages) / len(mortgages)
    if avg_credit_score >= 700:
        total_score -= 1
    elif avg_credit_score < 650:
        total_score += 1

    return get_rating_from_score(total_score)