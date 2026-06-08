import tempfile
import unittest
from pathlib import Path

from dlv_po.app import create_app


class DlvPoAuthTests(unittest.TestCase):
    def setUp(self):
        self.tmpdir = tempfile.TemporaryDirectory()
        self.app = create_app(
            {
                "TESTING": True,
                "DATABASE_PATH": Path(self.tmpdir.name) / "po.db",
                "SECRET_KEY": "test-secret-key",
                "PO_ADMIN_PASSWORD": "dragon-test-pass",
                "PO_PASSWORD_SOURCE": "test",
            }
        )
        self.client = self.app.test_client()

    def tearDown(self):
        self.tmpdir.cleanup()

    def login(self, password: str = "dragon-test-pass"):
        return self.client.post("/api/session", json={"password": password})

    def test_dashboard_requires_authenticated_session(self):
        response = self.client.get("/api/dashboard")
        payload = response.get_json()

        self.assertEqual(response.status_code, 401)
        self.assertTrue(payload["auth_required"])

    def test_login_and_logout_guard_the_api(self):
        bad_login = self.login("wrong-pass")
        self.assertEqual(bad_login.status_code, 401)

        good_login = self.login()
        self.assertEqual(good_login.status_code, 200)
        self.assertTrue(good_login.get_json()["authenticated"])

        dashboard = self.client.get("/api/dashboard")
        self.assertEqual(dashboard.status_code, 200)

        logout = self.client.delete("/api/session")
        self.assertEqual(logout.status_code, 200)
        self.assertFalse(logout.get_json()["authenticated"])

        after_logout = self.client.get("/api/dashboard")
        self.assertEqual(after_logout.status_code, 401)

    def test_authenticated_user_can_create_purchase_order(self):
        self.login()

        supplier_response = self.client.post("/api/suppliers", json={"name": "Fresh Asia Foods"})
        self.assertEqual(supplier_response.status_code, 201)
        supplier_id = supplier_response.get_json()["id"]

        product_response = self.client.post(
            "/api/products",
            json={
                "name": "Jasmine Rice 5kg",
                "sku": "RICE-001",
                "unit": "bag",
                "last_price": 80,
                "preferred_supplier_id": supplier_id,
            },
        )
        self.assertEqual(product_response.status_code, 201)
        product_id = product_response.get_json()["id"]

        order_response = self.client.post(
            "/api/orders",
            json={
                "supplier_id": supplier_id,
                "status": "draft",
                "items": [
                    {
                        "product_id": product_id,
                        "quantity": 2,
                        "unit": "bag",
                        "unit_price": 80,
                    }
                ],
            },
        )
        payload = order_response.get_json()

        self.assertEqual(order_response.status_code, 201)
        self.assertTrue(payload["po_number"].startswith("PO-"))
        self.assertEqual(payload["total_amount"], 160)
        self.assertEqual(len(payload["items"]), 1)


if __name__ == "__main__":
    unittest.main()
