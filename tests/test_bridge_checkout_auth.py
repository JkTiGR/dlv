import functools
import json
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from pathlib import Path

from dragon_bridge_runtime import BridgeRuntimeConfig
from dragon_local_server import DRAGONHandler, DRAGONServer


class RemoteOnlyHandler(DRAGONHandler):
    def is_loopback_client(self) -> bool:
        return False


class BridgeCheckoutAuthTests(unittest.TestCase):
    def setUp(self):
        self.tmpdir = tempfile.TemporaryDirectory()
        root_dir = Path(self.tmpdir.name)
        runtime_config = BridgeRuntimeConfig(
            bridge_token="test-bridge-token",
            allow_insecure_remote=False,
            kassa_pin="1990",
            telegram_bot_token="",
            telegram_chat_main="",
            telegram_chat_vn="",
            allowed_origins=(),
            liqpay_public_key="public-key",
            liqpay_private_key="private-key",
        )
        handler_cls = functools.partial(RemoteOnlyHandler, directory=str(root_dir))
        self.server = DRAGONServer(
            ("127.0.0.1", 0),
            handler_cls,
            root_dir,
            root_dir / "orders.json",
            root_dir / "menu.json",
            runtime_config,
        )
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.base_url = f"http://127.0.0.1:{self.server.server_address[1]}"

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join(timeout=2)
        self.tmpdir.cleanup()

    def post_json(self, path: str, payload: dict):
        request = urllib.request.Request(
            f"{self.base_url}{path}",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(request, timeout=5) as response:
            return response.status, json.loads(response.read().decode("utf-8"))

    def test_liqpay_checkout_requires_bridge_access(self):
        with self.assertRaises(urllib.error.HTTPError) as ctx:
            self.post_json(
                "/api/liqpay/checkout",
                {"amount": "10.00", "description": "Test", "order_id": "order-1"},
            )

        self.assertEqual(ctx.exception.code, 401)
        payload = json.loads(ctx.exception.read().decode("utf-8"))
        self.assertTrue(payload["auth_required"])

    def test_liqpay_checkout_accepts_valid_bridge_token(self):
        status, payload = self.post_json(
            "/api/liqpay/checkout?bridgeToken=test-bridge-token",
            {"amount": "10.00", "description": "Test", "order_id": "order-2"},
        )

        self.assertEqual(status, 200)
        self.assertTrue(payload["ok"])
        self.assertEqual(payload["payment"]["order_id"], "order-2")


if __name__ == "__main__":
    unittest.main()
