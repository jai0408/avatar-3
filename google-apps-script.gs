/**
 * Aspirealty Avatar 3 — Lead Capture Web App (Google Sheets + Email Alert)
 *
 * Setup (takes ~2 minutes):
 * 1. Open your "Aspirealty Avatar 3 - Leads Tracker" Google Sheet.
 * 2. Go to Extensions -> Apps Script.
 * 3. Delete any existing code, paste this entire file, and click Save.
 * 4. Click Deploy -> New deployment -> Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Click Deploy, authorize permissions, and copy the Web App URL.
 * 6. Paste that URL into LEAD_WEBHOOK_URL at the top of app.js.
 */

var RECIPIENT_EMAIL = 'rahkrr2@gmail.com';
var SPREADSHEET_ID = '1frVhusBwdEpTh3EfY6PeVx3GiZeaBMkgF5GQ8KtzRS0';
var SHEET_NAME = 'Leads';

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    var params = (e && e.parameter) ? e.parameter : {};
    var timestamp = Utilities.formatDate(
      new Date(),
      'Asia/Kolkata',
      'dd-MMM-yyyy hh:mm a'
    );

    var name = (params.buyerName || '').trim();
    var phone = (params.buyerPhone || '').trim();
    var plotSize = (params.buyerSize || '').trim();
    var enquiryType = (params.visitType || '').trim();
    var utmSource = (params.utm_source || 'whatsapp_or_direct').trim();
    var utmMedium = (params.utm_medium || '').trim();
    var utmCampaign = (params.utm_campaign || '').trim();
    var pageUrl = (params.page_url || '').trim();

    sheet.appendRow([
      timestamp,
      name,
      phone,
      plotSize,
      enquiryType,
      utmSource,
      utmMedium,
      utmCampaign,
      pageUrl,
      'New',
      ''
    ]);

    var subject = 'New Avatar 3 Lead: ' + (name || 'Website Visitor') + ' (' + phone + ')';
    var body = [
      'New lead submitted on your Aspirealty Avatar 3 landing page:',
      '',
      'Name: ' + name,
      'Phone / WhatsApp: ' + phone,
      'Preferred Plot Size: ' + plotSize,
      'Enquiry Type: ' + enquiryType,
      'Source / UTM: ' + utmSource + (utmCampaign ? ' / ' + utmCampaign : ''),
      'Submitted At: ' + timestamp + ' IST',
      'Page URL: ' + pageUrl,
      '',
      'All leads are also logged in your Google Sheet:',
      ss.getUrl()
    ].join('\n');

    MailApp.sendEmail(RECIPIENT_EMAIL, subject, body);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
