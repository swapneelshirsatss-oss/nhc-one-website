// Google Apps Script: saves each website lead as a row in the Google Sheet it is attached to,
// and emails a notification. Deploy as Web app (Execute as: Me, Access: Anyone).
const NOTIFY = 'info@nhconstructions.in'; // change if leads should go elsewhere
const COLS = ['form', 'name', 'phone', 'email', 'country', 'date', 'timeline', 'request', 'cta_source',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'page'];

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sh.getLastRow() === 0) sh.appendRow(['Time'].concat(COLS));
  sh.appendRow([new Date()].concat(COLS.map(c => d[c] || '')));
  MailApp.sendEmail(NOTIFY, 'New NHC One lead: ' + d.name + ' ' + d.phone, JSON.stringify(d, null, 2));
  return ContentService.createTextOutput('ok');
}
