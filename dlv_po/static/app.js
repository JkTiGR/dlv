const USE_BACKEND_API = (
    window.location.port === "5001" ||
    window.location.pathname === "/"
) && !window.location.hostname.endsWith(".github.io");
const API_BASE = USE_BACKEND_API ? "/api" : "";
const STATIC_STORE_KEY = "DRAGON_PO_STATIC_STORE_V1";

const state = {
    dashboard: null,
    suppliers: [],
    products: [],
    orders: [],
    authenticated: !API_BASE,
};

const statusLabels = {
    draft: "Черновик",
    pending_approval: "На согласовании",
    submitted: "Отправлен",
    received: "Получен",
    cancelled: "Отменен",
};

function nowIso() {
    return new Date().toISOString();
}

function emptyStaticStore() {
    return {
        nextSupplierId: 1,
        nextProductId: 1,
        nextOrderId: 1,
        suppliers: [],
        products: [],
        orders: [],
    };
}

function loadStaticStore() {
    try {
        return {
            ...emptyStaticStore(),
            ...(JSON.parse(localStorage.getItem(STATIC_STORE_KEY) || "{}") || {}),
        };
    } catch (_) {
        return emptyStaticStore();
    }
}

function saveStaticStore(store) {
    localStorage.setItem(STATIC_STORE_KEY, JSON.stringify(store));
    return store;
}

function dashboardFromStore(store) {
    const openStatuses = new Set(["draft", "pending_approval", "submitted"]);
    const committedTotal = store.orders
        .filter((order) => order.status !== "cancelled")
        .reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

    return {
        suppliers: store.suppliers.length,
        products: store.products.length,
        purchase_orders: store.orders.length,
        open_orders: store.orders.filter((order) => openStatuses.has(order.status)).length,
        committed_total: Math.round(committedTotal * 100) / 100,
    };
}

function supplierById(store, id) {
    return store.suppliers.find((supplier) => String(supplier.id) === String(id)) || null;
}

function productById(store, id) {
    return store.products.find((product) => String(product.id) === String(id)) || null;
}

function decorateProduct(store, product) {
    const supplier = supplierById(store, product.preferred_supplier_id);
    return {
        ...product,
        preferred_supplier_name: supplier?.name || null,
    };
}

function decorateOrder(store, order) {
    const supplier = supplierById(store, order.supplier_id);
    return {
        ...order,
        supplier_name: supplier?.name || "—",
        items: (order.items || []).map((item) => {
            const product = productById(store, item.product_id);
            return {
                ...item,
                product_name: product?.name || item.description || "—",
                product_sku: product?.sku || "",
            };
        }),
    };
}

function staticPoNumber(store) {
    const dateCode = new Date().toISOString().slice(0, 10).replaceAll("-", "");
    const todayCount = store.orders.filter((order) => String(order.created_at || "").slice(0, 10) === new Date().toISOString().slice(0, 10)).length;
    return `PO-${dateCode}-${String(todayCount + 1).padStart(3, "0")}`;
}

async function staticRequest(path, options = {}) {
    const method = String(options.method || "GET").toUpperCase();
    const payload = options.body ? JSON.parse(options.body) : {};
    const store = loadStaticStore();

    if (method === "GET" && path === "/dashboard") return dashboardFromStore(store);
    if (method === "GET" && path === "/suppliers") return [...store.suppliers].sort((a, b) => a.name.localeCompare(b.name));
    if (method === "GET" && path === "/products") return store.products.map((product) => decorateProduct(store, product)).sort((a, b) => a.name.localeCompare(b.name));
    if (method === "GET" && path === "/orders") return store.orders.map((order) => decorateOrder(store, order)).sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));

    if (method === "GET" && path.startsWith("/orders/")) {
        const id = Number(path.split("/").pop());
        const order = store.orders.find((entry) => Number(entry.id) === id);
        if (!order) throw new Error("Purchase order was not found.");
        return decorateOrder(store, order);
    }

    if (method === "POST" && path === "/suppliers") {
        const name = String(payload.name || "").trim();
        if (!name) throw new Error("Supplier name is required.");
        if (store.suppliers.some((supplier) => supplier.name.toLowerCase() === name.toLowerCase())) {
            throw new Error("Supplier with this name already exists.");
        }
        const supplier = {
            id: store.nextSupplierId++,
            name,
            contact_person: String(payload.contact_person || "").trim() || null,
            phone: String(payload.phone || "").trim() || null,
            email: String(payload.email || "").trim() || null,
            address: String(payload.address || "").trim() || null,
            notes: String(payload.notes || "").trim() || null,
            created_at: nowIso(),
        };
        store.suppliers.push(supplier);
        saveStaticStore(store);
        return supplier;
    }

    if (method === "POST" && path === "/products") {
        const name = String(payload.name || "").trim();
        const sku = String(payload.sku || "").trim() || null;
        const supplierId = payload.preferred_supplier_id ? Number(payload.preferred_supplier_id) : null;
        if (!name) throw new Error("Product name is required.");
        if (sku && store.products.some((product) => String(product.sku || "").toLowerCase() === sku.toLowerCase())) {
            throw new Error("Product with this SKU already exists.");
        }
        if (supplierId && !supplierById(store, supplierId)) throw new Error("Preferred supplier was not found.");

        const product = {
            id: store.nextProductId++,
            sku,
            name,
            description: String(payload.description || "").trim() || null,
            unit: String(payload.unit || "pcs").trim() || "pcs",
            last_price: Number(payload.last_price || 0),
            min_stock: Number(payload.min_stock || 0),
            preferred_supplier_id: supplierId,
            created_at: nowIso(),
        };
        store.products.push(product);
        saveStaticStore(store);
        return decorateProduct(store, product);
    }

    if (method === "POST" && path === "/orders") {
        const supplierId = Number(payload.supplier_id || 0);
        const supplier = supplierById(store, supplierId);
        const items = Array.isArray(payload.items) ? payload.items : [];
        if (!supplier) throw new Error("Supplier is required for a purchase order.");
        if (!items.length) throw new Error("At least one order item is required.");

        let totalAmount = 0;
        const preparedItems = items.map((item, index) => {
            const product = productById(store, item.product_id);
            const quantity = Number(item.quantity || 0);
            const unitPrice = Number(item.unit_price || product?.last_price || 0);
            if (!product) throw new Error(`Product is required for line ${index + 1}.`);
            if (quantity <= 0) throw new Error(`Line ${index + 1} must have quantity greater than zero.`);
            if (unitPrice < 0) throw new Error(`Line ${index + 1} cannot have a negative unit price.`);
            const lineTotal = Math.round(quantity * unitPrice * 100) / 100;
            totalAmount = Math.round((totalAmount + lineTotal) * 100) / 100;
            product.last_price = unitPrice;
            return {
                id: index + 1,
                order_id: store.nextOrderId,
                product_id: product.id,
                description: product.name,
                quantity,
                unit: String(item.unit || product.unit || "pcs").trim() || "pcs",
                unit_price: unitPrice,
                line_total: lineTotal,
            };
        });

        const createdAt = nowIso();
        const order = {
            id: store.nextOrderId++,
            po_number: staticPoNumber(store),
            supplier_id: supplier.id,
            status: String(payload.status || "draft").trim() || "draft",
            currency: "PLN",
            expected_date: String(payload.expected_date || "").trim() || null,
            total_amount: totalAmount,
            notes: String(payload.notes || "").trim() || null,
            created_at: createdAt,
            updated_at: createdAt,
            items: preparedItems,
        };
        store.orders.push(order);
        saveStaticStore(store);
        return decorateOrder(store, order);
    }

    throw new Error("Static PO endpoint is not supported.");
}

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

function setAuthLocked(locked, message = "") {
    if (!API_BASE) return;

    const overlay = document.getElementById("authOverlay");
    const error = document.getElementById("authError");
    const sessionBar = document.getElementById("sessionBar");

    document.body.classList.toggle("auth-locked", locked);
    overlay.classList.toggle("hidden", !locked);
    overlay.setAttribute("aria-hidden", locked ? "false" : "true");
    sessionBar.classList.toggle("hidden", locked);

    if (error) {
        if (message) {
            error.textContent = message;
            error.classList.remove("hidden");
        } else {
            error.textContent = "";
            error.classList.add("hidden");
        }
    }

    if (locked) {
        window.setTimeout(() => {
            document.getElementById("loginPassword")?.focus();
        }, 30);
    }
}

function applyAuthState(authenticated, message = "") {
    state.authenticated = Boolean(authenticated) || !API_BASE;
    setAuthLocked(!state.authenticated, state.authenticated ? "" : message);
    return state.authenticated;
}

async function sessionRequest(path, options = {}) {
    return fetch(`${API_BASE}${path}`, {
        credentials: "same-origin",
        ...options,
        headers: {
            ...(options.headers || {}),
        },
    });
}

async function refreshSession() {
    if (!API_BASE) return true;
    const response = await sessionRequest("/session", { cache: "no-store" });
    if (!response.ok) {
        applyAuthState(false, "Не удалось проверить сессию.");
        return false;
    }
    const payload = await response.json().catch(() => ({}));
    return applyAuthState(Boolean(payload.authenticated));
}

async function login(password) {
    const response = await sessionRequest("/session", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload?.ok) {
        applyAuthState(false, payload.error || "Неверный пароль.");
        throw new Error(payload.error || "Неверный пароль.");
    }
    applyAuthState(true);
    return payload;
}

async function logout() {
    if (!API_BASE) return;
    await sessionRequest("/session", { method: "DELETE" }).catch(() => null);
    applyAuthState(false);
}

async function request(path, options = {}) {
    if (!API_BASE) {
        return staticRequest(path, options);
    }

    const response = await fetch(`${API_BASE}${path}`, {
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    if (response.status === 401) {
        const errorPayload = await response.json().catch(() => ({}));
        applyAuthState(false, "Сессия истекла. Войдите снова.");
        throw new Error(errorPayload.error || "Authentication required.");
    }

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
    const loginForm = document.getElementById("loginForm");
    const logoutBtn = document.getElementById("logoutBtn");

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

    loginForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const passwordInput = document.getElementById("loginPassword");
        const submitBtn = document.getElementById("loginSubmitBtn");
        const password = String(passwordInput?.value || "");
        if (!password.trim()) {
            applyAuthState(false, "Введите пароль.");
            passwordInput?.focus();
            return;
        }

        submitBtn.disabled = true;
        try {
            await login(password);
            loginForm.reset();
            await loadAll();
            showNotice("Сессия открыта.");
        } catch (error) {
            showNotice(error.message, "error");
        } finally {
            submitBtn.disabled = false;
        }
    });

    logoutBtn?.addEventListener("click", async () => {
        await logout();
        showNotice("Сессия завершена.");
    });

    if (API_BASE) {
        const authenticated = await refreshSession();
        if (!authenticated) {
            return;
        }
    }

    try {
        await loadAll();
    } catch (error) {
        showNotice(`Не удалось загрузить данные: ${error.message}`, "error");
    }
}

document.addEventListener("DOMContentLoaded", init);
