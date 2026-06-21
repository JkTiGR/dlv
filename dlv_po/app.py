from __future__ import annotations

import os
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from flask import Flask, current_app, jsonify, request, send_from_directory
from flask_cors import CORS

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
SCHEMA_PATH = BASE_DIR / "schema.sql"
DEFAULT_DB_PATH = DATA_DIR / "po.db"
ALLOWED_STATUSES = {
    "draft",
    "pending_approval",
    "submitted",
    "received",
    "cancelled",
}


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def json_error(message: str, status_code: int = 400):
    return jsonify({"error": message}), status_code


def as_float(value: Any, field_name: str) -> float:
    try:
        return float(value)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"Field '{field_name}' must be numeric.") from exc


def as_int(value: Any, field_name: str) -> int:
    try:
        return int(value)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"Field '{field_name}' must be an integer.") from exc


def get_db() -> sqlite3.Connection:
    db_path = Path(current_app.config["DATABASE_PATH"])
    db_path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(db_path)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def init_db(app: Flask) -> None:
    db_path = Path(app.config["DATABASE_PATH"])
    db_path.parent.mkdir(parents=True, exist_ok=True)

    with sqlite3.connect(db_path) as connection:
        connection.execute("PRAGMA foreign_keys = ON")
        connection.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
        print(f"Database initialized at {db_path}")


def query_dashboard(connection: sqlite3.Connection) -> dict[str, Any]:
    supplier_count = connection.execute("SELECT COUNT(*) FROM suppliers").fetchone()[0]
    product_count = connection.execute("SELECT COUNT(*) FROM products").fetchone()[0]
    order_count = connection.execute("SELECT COUNT(*) FROM purchase_orders").fetchone()[0]
    open_orders = connection.execute(
        """
        SELECT COUNT(*)
        FROM purchase_orders
        WHERE status IN ('draft', 'pending_approval', 'submitted')
        """
    ).fetchone()[0]
    committed_total = connection.execute(
        """
        SELECT COALESCE(SUM(total_amount), 0)
        FROM purchase_orders
        WHERE status != 'cancelled'
        """
    ).fetchone()[0]

    return {
        "suppliers": supplier_count,
        "products": product_count,
        "purchase_orders": order_count,
        "open_orders": open_orders,
        "committed_total": round(committed_total, 2),
    }


def generate_po_number(connection: sqlite3.Connection) -> str:
    date_key = datetime.now(timezone.utc).date().isoformat()
    date_code = date_key.replace("-", "")
    current_count = connection.execute(
        """
        SELECT COUNT(*)
        FROM purchase_orders
        WHERE substr(created_at, 1, 10) = ?
        """,
        (date_key,),
    ).fetchone()[0]
    return f"PO-{date_code}-{current_count + 1:03d}"


def fetch_supplier(connection: sqlite3.Connection, supplier_id: int) -> sqlite3.Row | None:
    return connection.execute(
        "SELECT * FROM suppliers WHERE id = ?",
        (supplier_id,),
    ).fetchone()


def fetch_product(connection: sqlite3.Connection, product_id: int) -> sqlite3.Row | None:
    return connection.execute(
        "SELECT * FROM products WHERE id = ?",
        (product_id,),
    ).fetchone()


def serialize_order(connection: sqlite3.Connection, row: sqlite3.Row) -> dict[str, Any]:
    order = dict(row)
    items = connection.execute(
        """
        SELECT
            oi.id,
            oi.order_id,
            oi.product_id,
            oi.description,
            oi.quantity,
            oi.unit,
            oi.unit_price,
            oi.line_total,
            p.name AS product_name,
            p.sku AS product_sku
        FROM order_items oi
        JOIN products p ON p.id = oi.product_id
        WHERE oi.order_id = ?
        ORDER BY oi.id ASC
        """,
        (row["id"],),
    ).fetchall()
    order["items"] = [dict(item) for item in items]
    return order


def serialize_orders(connection: sqlite3.Connection) -> list[dict[str, Any]]:
    rows = connection.execute(
        """
        SELECT
            po.id,
            po.po_number,
            po.supplier_id,
            po.status,
            po.currency,
            po.expected_date,
            po.total_amount,
            po.notes,
            po.created_at,
            po.updated_at,
            s.name AS supplier_name
        FROM purchase_orders po
        JOIN suppliers s ON s.id = po.supplier_id
        ORDER BY po.created_at DESC, po.id DESC
        """
    ).fetchall()
    return [serialize_order(connection, row) for row in rows]


def create_app() -> Flask:
    app = Flask(__name__, static_folder="static", static_url_path="/static")
    CORS(app)
    app.config["DATABASE_PATH"] = Path(os.getenv("DRAGON_PO_DB_PATH", DEFAULT_DB_PATH))
    app.config["DEBUG"] = os.getenv("DRAGON_PO_DEBUG", "1") == "1"

    init_db(app)

    @app.get("/")
    def index():
        return send_from_directory(BASE_DIR, "index.html")

    @app.get("/dragon-theme.css")
    def dragon_theme():
        return send_from_directory(BASE_DIR.parent, "dragon-theme.css")

    @app.get("/fon1.png")
    def dragon_background():
        return send_from_directory(BASE_DIR.parent, "fon1.png")

    @app.get("/api/health")
    def healthcheck():
        return jsonify(
            {
                "status": "ok",
                "project": "DRAGON Purchase Order Starter",
                "database_path": str(Path(app.config["DATABASE_PATH"])),
                "generated_at": utc_now(),
            }
        )

    @app.get("/api/dashboard")
    def dashboard():
        with get_db() as connection:
            return jsonify(query_dashboard(connection))

    @app.route("/api/suppliers", methods=["GET", "POST"])
    def suppliers():
        with get_db() as connection:
            if request.method == "GET":
                rows = connection.execute(
                    """
                    SELECT
                        id,
                        name,
                        contact_person,
                        phone,
                        email,
                        address,
                        notes,
                        created_at
                    FROM suppliers
                    ORDER BY name COLLATE NOCASE ASC
                    """
                ).fetchall()
                return jsonify([dict(row) for row in rows])

            payload = request.get_json(silent=True) or {}
            name = (payload.get("name") or "").strip()

            if not name:
                return json_error("Supplier name is required.")

            try:
                cursor = connection.execute(
                    """
                    INSERT INTO suppliers (
                        name,
                        contact_person,
                        phone,
                        email,
                        address,
                        notes,
                        created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        name,
                        (payload.get("contact_person") or "").strip() or None,
                        (payload.get("phone") or "").strip() or None,
                        (payload.get("email") or "").strip() or None,
                        (payload.get("address") or "").strip() or None,
                        (payload.get("notes") or "").strip() or None,
                        utc_now(),
                    ),
                )
                connection.commit()
            except sqlite3.IntegrityError:
                return json_error("Supplier with this name already exists.", 409)

            row = connection.execute(
                "SELECT * FROM suppliers WHERE id = ?",
                (cursor.lastrowid,),
            ).fetchone()
            return jsonify(dict(row)), 201

    @app.route("/api/products", methods=["GET", "POST"])
    def products():
        with get_db() as connection:
            if request.method == "GET":
                rows = connection.execute(
                    """
                    SELECT
                        p.id,
                        p.sku,
                        p.name,
                        p.description,
                        p.unit,
                        p.last_price,
                        p.min_stock,
                        p.preferred_supplier_id,
                        p.created_at,
                        s.name AS preferred_supplier_name
                    FROM products p
                    LEFT JOIN suppliers s ON s.id = p.preferred_supplier_id
                    ORDER BY p.name COLLATE NOCASE ASC
                    """
                ).fetchall()
                return jsonify([dict(row) for row in rows])

            payload = request.get_json(silent=True) or {}
            name = (payload.get("name") or "").strip()
            sku = (payload.get("sku") or "").strip() or None
            unit = (payload.get("unit") or "pcs").strip() or "pcs"

            if not name:
                return json_error("Product name is required.")

            preferred_supplier_id = payload.get("preferred_supplier_id")
            if preferred_supplier_id in ("", None):
                preferred_supplier_id = None
            else:
                try:
                    preferred_supplier_id = as_int(preferred_supplier_id, "preferred_supplier_id")
                except ValueError as error:
                    return json_error(str(error))

                if fetch_supplier(connection, preferred_supplier_id) is None:
                    return json_error("Preferred supplier was not found.", 404)

            try:
                last_price = round(as_float(payload.get("last_price", 0), "last_price"), 2)
                min_stock = round(as_float(payload.get("min_stock", 0), "min_stock"), 2)
            except ValueError as error:
                return json_error(str(error))

            try:
                cursor = connection.execute(
                    """
                    INSERT INTO products (
                        sku,
                        name,
                        description,
                        unit,
                        last_price,
                        min_stock,
                        preferred_supplier_id,
                        created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        sku,
                        name,
                        (payload.get("description") or "").strip() or None,
                        unit,
                        last_price,
                        min_stock,
                        preferred_supplier_id,
                        utc_now(),
                    ),
                )
                connection.commit()
            except sqlite3.IntegrityError:
                return json_error("Product with this SKU already exists.", 409)

            row = connection.execute(
                """
                SELECT
                    p.*,
                    s.name AS preferred_supplier_name
                FROM products p
                LEFT JOIN suppliers s ON s.id = p.preferred_supplier_id
                WHERE p.id = ?
                """,
                (cursor.lastrowid,),
            ).fetchone()
            return jsonify(dict(row)), 201

    @app.route("/api/orders", methods=["GET", "POST"])
    def orders():
        with get_db() as connection:
            if request.method == "GET":
                return jsonify(serialize_orders(connection))

            payload = request.get_json(silent=True) or {}
            supplier_id = payload.get("supplier_id")
            items = payload.get("items") or []
            status = (payload.get("status") or "draft").strip()
            currency = "PLN"
            notes = (payload.get("notes") or "").strip() or None
            expected_date = (payload.get("expected_date") or "").strip() or None

            if supplier_id in ("", None):
                return json_error("Supplier is required for a purchase order.")
            if status not in ALLOWED_STATUSES:
                return json_error("Unsupported purchase order status.")
            if not items:
                return json_error("At least one order item is required.")

            try:
                supplier_id = as_int(supplier_id, "supplier_id")
            except ValueError as error:
                return json_error(str(error))

            supplier = fetch_supplier(connection, supplier_id)
            if supplier is None:
                return json_error("Supplier was not found.", 404)

            prepared_items: list[dict[str, Any]] = []
            total_amount = 0.0

            try:
                for index, item in enumerate(items, start=1):
                    product_id = item.get("product_id")
                    if product_id in ("", None):
                        return json_error(f"Product is required for line {index}.")

                    try:
                        product_id = as_int(product_id, "product_id")
                    except ValueError as error:
                        return json_error(str(error))

                    product = fetch_product(connection, product_id)
                    if product is None:
                        return json_error(f"Product {product_id} was not found.", 404)

                    quantity = round(as_float(item.get("quantity"), "quantity"), 2)
                    unit_price = round(
                        as_float(item.get("unit_price", product["last_price"]), "unit_price"),
                        2,
                    )

                    if quantity <= 0:
                        return json_error(f"Line {index} must have quantity greater than zero.")
                    if unit_price < 0:
                        return json_error(f"Line {index} cannot have a negative unit price.")

                    line_total = round(quantity * unit_price, 2)
                    total_amount = round(total_amount + line_total, 2)
                    prepared_items.append(
                        {
                            "product_id": product["id"],
                            "description": (item.get("description") or product["name"]).strip(),
                            "quantity": quantity,
                            "unit": (item.get("unit") or product["unit"] or "pcs").strip() or "pcs",
                            "unit_price": unit_price,
                            "line_total": line_total,
                        }
                    )
            except ValueError as error:
                return json_error(str(error))

            created_at = utc_now()
            po_number = generate_po_number(connection)

            cursor = connection.execute(
                """
                INSERT INTO purchase_orders (
                    po_number,
                    supplier_id,
                    status,
                    currency,
                    expected_date,
                    total_amount,
                    notes,
                    created_at,
                    updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    po_number,
                    supplier["id"],
                    status,
                    currency,
                    expected_date,
                    total_amount,
                    notes,
                    created_at,
                    created_at,
                ),
            )

            order_id = cursor.lastrowid

            for item in prepared_items:
                connection.execute(
                    """
                    INSERT INTO order_items (
                        order_id,
                        product_id,
                        description,
                        quantity,
                        unit,
                        unit_price,
                        line_total
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        order_id,
                        item["product_id"],
                        item["description"],
                        item["quantity"],
                        item["unit"],
                        item["unit_price"],
                        item["line_total"],
                    ),
                )
                connection.execute(
                    """
                    UPDATE products
                    SET last_price = ?
                    WHERE id = ?
                    """,
                    (item["unit_price"], item["product_id"]),
                )

            connection.commit()

            row = connection.execute(
                """
                SELECT
                    po.id,
                    po.po_number,
                    po.supplier_id,
                    po.status,
                    po.currency,
                    po.expected_date,
                    po.total_amount,
                    po.notes,
                    po.created_at,
                    po.updated_at,
                    s.name AS supplier_name
                FROM purchase_orders po
                JOIN suppliers s ON s.id = po.supplier_id
                WHERE po.id = ?
                """,
                (order_id,),
            ).fetchone()
            return jsonify(serialize_order(connection, row)), 201

    @app.get("/api/orders/<int:order_id>")
    def order_detail(order_id: int):
        with get_db() as connection:
            row = connection.execute(
                """
                SELECT
                    po.id,
                    po.po_number,
                    po.supplier_id,
                    po.status,
                    po.currency,
                    po.expected_date,
                    po.total_amount,
                    po.notes,
                    po.created_at,
                    po.updated_at,
                    s.name AS supplier_name
                FROM purchase_orders po
                JOIN suppliers s ON s.id = po.supplier_id
                WHERE po.id = ?
                """,
                (order_id,),
            ).fetchone()

            if row is None:
                return json_error("Purchase order was not found.", 404)

            return jsonify(serialize_order(connection, row))

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", "5001")),
        debug=app.config["DEBUG"],
    )
