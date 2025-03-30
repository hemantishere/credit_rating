import unittest

from credit_rating import calculate_individual_risk_score, calculate_rmbs_rating, get_rating_from_score

# Test class
class TestCreditRating(unittest.TestCase):
    
    def setUp(self):
        # Test cases defined once, reused in tests
        self.mortgage_1 = {
            "loan_amount": 160000,
            "property_value": 200000,  # LTV = 0.8
            "debt_amount": 20000,
            "annual_income": 100000,   # DTI = 0.2
            "credit_score": 750,
            "loan_type": "fixed",
            "property_type": "house"
        }
        
        self.mortgage_2 = {
            "loan_amount": 190000,
            "property_value": 200000,  # LTV = 0.95
            "debt_amount": 60000,
            "annual_income": 100000,   # DTI = 0.6
            "credit_score": 600,
            "loan_type": "variable",
            "property_type": "condo"
        }
        
        self.mortgage_3 = {
            "loan_amount": 170000,
            "property_value": 200000,  # LTV = 0.85
            "debt_amount": 45000,
            "annual_income": 100000,   # DTI = 0.45
            "credit_score": 675,
            "loan_type": "fixed",
            "property_type": "house"
        }
        
        self.mortgage_4 = {
            "loan_amount": 180000,
            "property_value": 200000,  # LTV = 0.9
            "debt_amount": 50000,
            "annual_income": 100000,   # DTI = 0.5
            "credit_score": 680,
            "loan_type": "variable",
            "property_type": "house"
        }
        
        self.mortgages_high = [self.mortgage_1, {**self.mortgage_1, "credit_score": 720}]
        self.mortgages_low = [self.mortgage_2, {**self.mortgage_2, "credit_score": 620}]
        self.mortgages_empty = []

    def test_calculate_individual_risk_score_low(self):
        score = calculate_individual_risk_score(self.mortgage_1)
        self.assertEqual(score, -2)

    def test_calculate_individual_risk_score_high(self):
        score = calculate_individual_risk_score(self.mortgage_2)
        self.assertEqual(score, 7)

    def test_calculate_individual_risk_score_medium(self):
        score = calculate_individual_risk_score(self.mortgage_3)
        self.assertEqual(score, 1)

    def test_calculate_individual_risk_score_bbb_edge(self):
        score = calculate_individual_risk_score(self.mortgage_4)
        self.assertEqual(score, 3)

    def test_get_rating_from_score_aaa(self):
        rating = get_rating_from_score(-2)
        self.assertEqual(rating, "AAA")

    def test_get_rating_from_score_bbb(self):
        rating = get_rating_from_score(3)
        self.assertEqual(rating, "BBB")

    def test_get_rating_from_score_c(self):
        rating = get_rating_from_score(7)
        self.assertEqual(rating, "C")

    def test_calculate_rmbs_rating_high(self):
        rating = calculate_rmbs_rating(self.mortgages_high)
        self.assertEqual(rating, "AAA")  # Total: -4 - 1 = -5 -> AAA

    def test_calculate_rmbs_rating_low(self):
        rating = calculate_rmbs_rating(self.mortgages_low)
        self.assertEqual(rating, "C")    # Total: 14 + 1 = 15 -> C

    def test_calculate_rmbs_rating_empty(self):
        rating = calculate_rmbs_rating(self.mortgages_empty)
        self.assertEqual(rating, "N/A")

if __name__ == '__main__':
    unittest.main()