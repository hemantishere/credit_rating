import unittest
from credit_rating import calculate_credit_rating

class TestCreditRating(unittest.TestCase):
    def test_high_credit_score(self):
        mortgage = {
            "credit_score": 750,
            "loan_amount": 100000,
            "property_value": 150000,
            "annual_income": 50000,
            "debt_amount": 10000,
            "loan_type": "fixed",
            "property_type": "single_family"
        }
        self.assertEqual(calculate_credit_rating(mortgage), "AAA")

    def test_medium_risk_mortgage(self):
        mortgage = {
            "credit_score": 680,
            "loan_amount": 200000,
            "property_value": 220000,
            "annual_income": 40000,
            "debt_amount": 20000,
            "loan_type": "adjustable",
            "property_type": "condo"
        }
        self.assertEqual(calculate_credit_rating(mortgage), "BBB")

    def test_high_risk_mortgage(self):
        mortgage = {
            "credit_score": 600,
            "loan_amount": 300000,
            "property_value": 320000,
            "annual_income": 35000,
            "debt_amount": 25000,
            "loan_type": "adjustable",
            "property_type": "condo"
        }
        self.assertEqual(calculate_credit_rating(mortgage), "C")

if __name__ == '__main__':
    unittest.main()
