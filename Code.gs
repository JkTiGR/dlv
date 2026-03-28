function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;
  
  if (action === 'create') {
    return createOrder(data);
  } else if (action === 'update_status') {
    return updateOrderStatus(data);
  } else if (action === 'get_orders') {
    return getOrders();
  }
  
  return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Unknown action' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  if (e.parameter.action === 'get_orders') {
    return getOrders();
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: false }))
    .setMimeType(ContentService.MimeType.JSON);
}

function createOrder(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Sheet not found' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const row = [
    data.id,
    data.code,
    data.status || 'NEW',
    data.type,
    data.table || '',
    data.pickup_in || '',
    data.address || '',
    data.phone || '',
    JSON.stringify(data.items),
    data.subtotal || data.total || 0,
    data.delivery_fee || 0,
    data.total || 0,
    new Date().toISOString()
  ];
  
  sheet.appendRow(row);
  
  return ContentService.createTextOutput(JSON.stringify({ ok: true, id: data.id }))
    .setMimeType(ContentService.MimeType.JSON);
}

function updateOrderStatus(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Sheet not found' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const orders = sheet.getDataRange().getValues();
  for (let i = 1; i < orders.length; i++) {
    if (orders[i][0] === data.order_id || orders[i][1] === data.order_id) {
      sheet.getRange(i + 1, 3).setValue(data.status);
      break;
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ orders: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const orders = [];
  
  for (let i = 1; i < data.length; i++) {
    const order = {
      id: data[i][0],
      code: data[i][1],
      status: data[i][2],
      type: data[i][3],
      table: data[i][4],
      pickup_in: data[i][5],
      address: data[i][6],
      phone: data[i][7],
      items: JSON.parse(data[i][8] || '[]'),
      subtotal: data[i][9],
      delivery_fee: data[i][10],
      total: data[i][11],
      created_at: data[i][12]
    };
    orders.push(order);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ orders }))
    .setMimeType(ContentService.MimeType.JSON);
}