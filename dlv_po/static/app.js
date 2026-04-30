const API_BASE = "/api";

const state = {
    dashboard: null,
    suppliers: [],
    products: [],
    orders: [],
};

const statusLabels = {
    draft: "Черновик",
    pending_approval: "На согласовании",
    submitted: "Отправлен",
    received: "Получен",
    cancelled: "Отменен",
};

function formatMoney(value, currency = "PLN") {
    const amount = Number(value || 0).toFixed(2);
    return `${amount} ${currency}`;
}

function escapeHtml(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function mutedText(value) {
    return `<span class="muted">${escapeHtml(value)}</span>`;
}

function showNotice(message, kind = "success") {
    const notice = document.getElementById("notice");
    notice.textContent = message;
    notice.className = `notice notice--${kind}`;
    notice.classList.remove("hidden");

    window.clearTimeout(showNotice.timeoutId);
    showNotice.timeoutId = window.setTimeout(() => {
        notice.classList.add("hidden");
    }, 3200);
}

async function request(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.error || "Request failed.");
    }

    return response.json();
}

function updateStats() {
    const dashboard = state.dashboard || {};
    document.querySelector('[data-stat="suppliers"]').textContent = dashboard.suppliers || 0;
    document.querySelector('[data-stat="products"]').textContent = dashboard.products || 0;
    document.querySelector('[data-stat="purchase_orders"]').textContent = dashboard.purchase_orders || 0;
    document.querySelector('[data-stat="open_orders"]').textContent = dashboard.open_orders || 0;
    document.querySelector('[data-stat="committed_total"]').textContent = formatMoney(
        dashboard.committed_total || 0,
        "PLN",
    );
}

function renderSuppliers() {
    const tbody = document.querySelector("#suppliersTable tbody");
    tbody.innerHTML = state.suppliers
        .map(
            (supplier) => `
                <tr>
                    <td><strong>${escapeHtml(supplier.name)}</strong></td>
                    <td>${supplier.contact_person ? escapeHtml(supplier.contact_person) : mutedText("Не указан")}</td>
                    <td>${supplier.phone ? escapeHtml(supplier.phone) : mutedText("-")}</td>
                    <td>${supplier.email ? escapeHtml(supplier.email) : mutedText("-")}</td>
                </tr>
            `,
        )
        .join("");
}

function renderProducts() {
    const tbody = document.querySelector("#productsTable tbody");
    tbody.innerHTML = state.products
        .map(
            (product) => `
                <tr>
                    <td>${product.sku ? escapeHtml(product.sku) : mutedText("-")}</td>
                    <td><strong>${escapeHtml(product.name)}</strong></td>
                    <td>${escapeHtml(product.unit)}</td>
                    <td>${escapeHtml(formatMoney(product.last_price))}</td>
                    <td>${escapeHtml(Number(product.min_stock || 0).toFixed(2))}</td>
                    <td>${product.preferred_supplier_name ? escapeHtml(product.preferred_supplier_name) : mutedText("Не задан")}</td>
                </tr>
            `,
        )
        .join("");
}

function renderOrders() {
    const tbody = document.querySelector("#ordersTable tbody");
    tbody.innerHTML = state.orders
        .map((order) => {
            const items = order.items
                .map((item) => (
                    `${escapeHtml(item.product_name)} x ${escapeHtml(Number(item.quantity).toFixed(2))} ${escapeHtml(item.unit)}`
                ))
                .join("<br>");

            return `
                <tr>
                    <td>
                        <strong>${escapeHtml(order.po_number)}</strong><br>
                        <span class="muted">${escapeHtml(order.currency)}</span>
                    </td>
                    <td>${escapeHtml(order.supplier_name)}</td>
                    <td><span class="status-pill">${escapeHtml(statusLabels[order.status] || order.status)}</span></td>
                    <td>${escapeHtml(formatMoney(order.total_amount, order.currency))}</td>
                    <td>${escapeHtml(order.created_at.slice(0, 10))}</td>
                    <td>${items}</td>
                </tr>
            `;
        })
        .join("");
}

function buildSupplierOptions(includeEmptyLabel) {
    const options = state.suppliers.map(
        (supplier) => `<option value="${escapeHtml(supplier.id)}">${escapeHtml(supplier.name)}</option>`,
    );

    return [
        includeEmptyLabel ? `<option value="">${escapeHtml(includeEmptyLabel)}</option>` : "",
        ...options,
    ].join("");
}

function updateSupplierSelects() {
    document.getElementById("productSupplierSelect").innerHTML = buildSupplierOptions("Не выбран");
    document.getElementById("orderSupplierSelect").innerHTML = buildSupplierOptions("Выберите поставщика");
}

function buildProductOptions(selectedId = "") {
    return [
        '<option value="">Выберите товар</option>',
        ...state.products.map((product) => {
            const selected = String(product.id) === String(selectedId) ? "selected" : "";
            return `<option value="${escapeHtml(product.id)}" ${selected}>${escapeHtml(product.name)}</option>`;
        }),
    ].join("");
}

function createOrderItemRow(item = {}) {
    const row = document.createElement("div");
    row.className = "order-item";
    row.innerHTML = `
        <label class="order-items__row">
            <span>Товар</span>
            <select class="order-item__product" required>
                ${buildProductOptions(item.product_id)}
            </select>
        </label>
        <label class="order-items__row">
            <span>Количество</span>
            <input class="order-item__quantity" type="number" min="0.01" step="0.01" value="${escapeHtml(item.quantity || 1)}">
        </label>
        <label class="order-items__row">
            <span>Ед. изм.</span>
            <input class="order-item__unit" type="text" value="${escapeHtml(item.unit || "pcs")}">
        </label>
        <label class="order-items__row">
            <span>Цена за единицу</span>
            <input class="order-item__price" type="number" min="0" step="0.01" value="${escapeHtml(item.unit_price || 0)}">
        </label>
        <button type="button" class="button button--ghost order-item__remove">Удалить</button>
    `;

    const productSelect = row.querySelector(".order-item__product");
    const quantityInput = row.querySelector(".order-item__quantity");
    const unitInput = row.querySelector(".order-item__unit");
    const priceInput = row.querySelector(".order-item__price");

    productSelect.addEventListener("change", () => {
        const product = state.products.find((entry) => String(entry.id) === productSelect.value);
        if (!product) {
            return;
        }

        unitInput.value = product.unit || "pcs";
        if (!Number(priceInput.value)) {
            priceInput.value = Number(product.last_price || 0).toFixed(2);
        }
        updateOrderTotal();
    });

    quantityInput.addEventListener("input", updateOrderTotal);
    priceInput.addEventListener("input", updateOrderTotal);
    row.querySelector(".order-item__remove").addEventListener("click", () => {
        row.remove();
        if (!document.querySelector(".order-item")) {
            addOrderItemRow();
        }
        updateOrderTotal();
    });

    return row;
}

function addOrderItemRow(item = {}) {
    const container = document.getElementById("orderItems");
    container.appendChild(createOrderItemRow(item));
    updateOrderTotal();
}

function collectOrderItems() {
    return Array.from(document.querySelectorAll(".order-item")).map((row) => ({
        product_id: Number(row.querySelector(".order-item__product").value),
        quantity: Number(row.querySelector(".order-item__quantity").value || 0),
        unit: row.querySelector(".order-item__unit").value.trim() || "pcs",
        unit_price: Number(row.querySelector(".order-item__price").value || 0),
    }));
}

function updateOrderTotal() {
    const currency = document.querySelector('[name="currency"]').value || "PLN";
    const total = collectOrderItems().reduce((sum, item) => {
        return sum + item.quantity * item.unit_price;
    }, 0);

    document.getElementById("orderTotal").textContent = formatMoney(total, currency);
}

async function loadDashboard() {
    state.dashboard = await request("/dashboard");
    updateStats();
}

async function loadSuppliers() {
    state.suppliers = await request("/suppliers");
    renderSuppliers();
    updateSupplierSelects();
}

async function loadProducts() {
    state.products = await request("/products");
    renderProducts();

    document.querySelectorAll(".order-item__product").forEach((select) => {
        const currentValue = select.value;
        select.innerHTML = buildProductOptions(currentValue);
    });
}

async function loadOrders() {
    state.orders = await request("/orders");
    renderOrders();
}

async function loadAll() {
    await Promise.all([loadDashboard(), loadSuppliers(), loadProducts(), loadOrders()]);
}

function payloadFromForm(form) {
    return Object.fromEntries(new FormData(form).entries());
}

async function handleSupplierSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = payloadFromForm(form);

    await request("/suppliers", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    form.reset();
    await Promise.all([loadSuppliers(), loadDashboard()]);
    showNotice("Поставщик добавлен.");
}

async function handleProductSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = payloadFromForm(form);

    payload.last_price = Number(payload.last_price || 0);
    payload.min_stock = Number(payload.min_stock || 0);
    payload.preferred_supplier_id = payload.preferred_supplier_id || null;

    await request("/products", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    form.reset();
    form.querySelector('[name="unit"]').value = "pcs";
    await Promise.all([loadProducts(), loadDashboard()]);
    showNotice("Товар добавлен.");
}

async function handleOrderSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = payloadFromForm(form);

    payload.supplier_id = Number(payload.supplier_id);
    payload.items = collectOrderItems();

    await request("/orders", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    form.reset();
    document.getElementById("orderItems").innerHTML = "";
    addOrderItemRow();
    document.querySelector('[name="currency"]').value = "PLN";
    await Promise.all([loadOrders(), loadDashboard(), loadProducts()]);
    showNotice("Purchase order создан.");
}

async function init() {
    document.getElementById("supplierForm").addEventListener("submit", async (event) => {
        try {
            await handleSupplierSubmit(event);
        } catch (error) {
            showNotice(error.message, "error");
        }
    });

    document.getElementById("productForm").addEventListener("submit", async (event) => {
        try {
            await handleProductSubmit(event);
        } catch (error) {
            showNotice(error.message, "error");
        }
    });

    document.getElementById("orderForm").addEventListener("submit", async (event) => {
        try {
            await handleOrderSubmit(event);
        } catch (error) {
            showNotice(error.message, "error");
        }
    });

    document.getElementById("addOrderItemBtn").addEventListener("click", () => {
        addOrderItemRow();
    });

    document.querySelector('[name="currency"]').addEventListener("input", updateOrderTotal);

    addOrderItemRow();

    try {
        await loadAll();
    } catch (error) {
        showNotice(`Не удалось загрузить данные: ${error.message}`, "error");
    }
}

document.addEventListener("DOMContentLoaded", init);
