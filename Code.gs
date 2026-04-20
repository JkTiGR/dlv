const DEFAULT_HEADERS = [
  'id',
  'code',
  'status',
  'type',
  'table',
  'pickup_in',
  'address',
  'phone',
  'comment',
  'payment_type',
  'payment_cash',
  'payment_card',
  'items',
  'subtotal',
  'delivery_fee',
  'total',
  'source',
  'created_at',
  'updated_at'
];

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents || '{}');
  const action = data.action;

  if (action === 'create') {
    return createOrder(data);
  }
  if (action === 'update_status') {
    return updateOrderStatus(data);
  }
  if (action === 'get_orders') {
    return getOrders();
  }

  return jsonResponse({ ok: false, error: 'Unknown action' });
}

function doGet(e) {
  if (e.parameter.action === 'get_orders') {
    return getOrders();
  }
  return jsonResponse({ ok: false, error: 'Unknown action' });
}

function getOrdersSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Orders');
  if (!sheet) {
    sheet = ss.insertSheet('Orders');
  }
  ensureHeaders(sheet);
  return sheet;
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() < 1) {
    sheet.getRange(1, 1, 1, DEFAULT_HEADERS.length).setValues([DEFAULT_HEADERS]);
    return DEFAULT_HEADERS.slice();
  }

  const width = Math.max(sheet.getLastColumn(), DEFAULT_HEADERS.length);
  const current = sheet.getRange(1, 1, 1, width).getValues()[0]
    .map(function(value) { return String(value || '').trim(); });

  let changed = false;
  const headers = current.slice();

  DEFAULT_HEADERS.forEach(function(header, index) {
    if (headers.indexOf(header) === -1) {
      if (!headers[index]) {
        headers[index] = header;
      } else {
        headers.push(header);
      }
      changed = true;
    }
  });

  if (changed) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  return headers;
}

function headersMap(headers) {
  const map = {};
  headers.forEach(function(header, index) {
    if (header) map[header] = index;
  });
  return map;
}

function serializeField(header, value) {
  if (header === 'items') {
    return JSON.stringify(Array.isArray(value) ? value : []);
  }
  if (header === 'subtotal' || header === 'delivery_fee' || header === 'total' || header === 'payment_cash' || header === 'payment_card') {
    return Number(value || 0);
  }
  if (header === 'created_at' || header === 'updated_at') {
    return value || new Date().toISOString();
  }
  return value || '';
}

function buildRow(headers, data) {
  return headers.map(function(header) {
    return serializeField(header, data[header]);
  });
}

function createOrder(data) {
  const sheet = getOrdersSheet();
  const headers = ensureHeaders(sheet);
  const map = headersMap(headers);
  const row = buildRow(headers, {
    id: data.id,
    code: data.code,
    status: data.status || 'NEW',
    type: data.type,
    table: data.table || '',
    pickup_in: data.pickup_in || '',
    address: data.address || '',
    phone: data.phone || '',
    comment: data.comment || '',
    payment_type: data.payment_type || '',
    payment_cash: data.payment_cash || 0,
    payment_card: data.payment_card || 0,
    items: data.items || [],
    subtotal: data.subtotal || data.total || 0,
    delivery_fee: data.delivery_fee || 0,
    total: data.total || 0,
    source: data.source || 'site',
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString()
  });

  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
    for (let i = 0; i < values.length; i++) {
      const sameId = map.id !== undefined && values[i][map.id] === data.id;
      const sameCode = map.code !== undefined && values[i][map.code] === data.code;
      if (sameId || sameCode) {
        sheet.getRange(i + 2, 1, 1, headers.length).setValues([row]);
        return jsonResponse({ ok: true, id: data.id, updated: true });
      }
    }
  }

  sheet.appendRow(row);
  return jsonResponse({ ok: true, id: data.id, created: true });
}

function updateOrderStatus(data) {
  const sheet = getOrdersSheet();
  const headers = ensureHeaders(sheet);
  const map = headersMap(headers);
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return jsonResponse({ ok: false, error: 'Order not found' });
  }

  const values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  for (let i = 0; i < values.length; i++) {
    const sameId = map.id !== undefined && values[i][map.id] === data.order_id;
    const sameCode = map.code !== undefined && values[i][map.code] === data.order_id;
    if (sameId || sameCode) {
      if (map.status !== undefined) {
        sheet.getRange(i + 2, map.status + 1).setValue(data.status);
      }
      if (map.updated_at !== undefined) {
        sheet.getRange(i + 2, map.updated_at + 1).setValue(new Date().toISOString());
      }
      return jsonResponse({ ok: true, order_id: data.order_id, status: data.status });
    }
  }

  return jsonResponse({ ok: false, error: 'Order not found' });
}

function parseItems(value) {
  if (!value) return [];
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return [];
  }
}

function getOrders() {
  const sheet = getOrdersSheet();
  const headers = ensureHeaders(sheet);
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return jsonResponse({ orders: [] });
  }

  const values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  const orders = values.map(function(row) {
    const order = {};
    headers.forEach(function(header, index) {
      if (!header) return;
      order[header] = row[index];
    });
    order.items = parseItems(order.items);
    order.payment_cash = Number(order.payment_cash || 0);
    order.payment_card = Number(order.payment_card || 0);
    order.subtotal = Number(order.subtotal || 0);
    order.delivery_fee = Number(order.delivery_fee || 0);
    order.total = Number(order.total || 0);
    return order;
  }).filter(function(order) {
    return order.id || order.code;
  });

  return jsonResponse({ orders: orders });
}
