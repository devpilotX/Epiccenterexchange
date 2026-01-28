/**
 * Google Sheets App Script for Epicenter Exchange
 * Handles newsletter signups and contact form submissions
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet with two sheets: "Newsletter" and "Contacts"
 * 2. In "Newsletter" sheet, add headers: Timestamp | Email | Source | Status
 * 3. In "Contacts" sheet, add headers: Timestamp | Name | Email | Subject | Message | Status
 * 4. Go to Extensions > Apps Script
 * 5. Paste this entire code into the script editor
 * 6. Click Deploy > New deployment > Web app
 * 7. Set "Execute as" = Me, "Who has access" = Anyone
 * 8. Copy the Web App URL and paste it into js/main.js (replace YOUR_GOOGLE_SCRIPT_URL)
 * 9. Click Deploy
 */

// Configuration
const SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const NEWSLETTER_SHEET = 'Newsletter';
const CONTACTS_SHEET = 'Contacts';

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Epicenter Exchange API is running.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST requests from website forms
 */
function doPost(e) {
  try {
    const params = e.parameter;

    // Determine form type based on parameters
    if (params.name && params.message) {
      // Contact Form Submission
      return handleContactForm(params);
    } else if (params.email) {
      // Newsletter Subscription
      return handleNewsletter(params);
    } else {
      return createResponse(400, 'Invalid request: missing required fields.');
    }
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return createResponse(500, 'Server error: ' + error.toString());
  }
}

/**
 * Handle newsletter subscription
 */
function handleNewsletter(params) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NEWSLETTER_SHEET);

  if (!sheet) {
    // Create sheet if it doesn't exist
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const newSheet = ss.insertSheet(NEWSLETTER_SHEET);
    newSheet.appendRow(['Timestamp', 'Email', 'Source', 'Status']);
    newSheet.getRange('1:1').setFontWeight('bold');
    return handleNewsletter(params); // Retry
  }

  const email = params.email || '';
  const source = params.source || 'unknown';
  const timestamp = params.timestamp || new Date().toISOString();

  // Check for duplicate email
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === email) {
      return createResponse(200, 'Email already subscribed.');
    }
  }

  // Add new subscriber
  sheet.appendRow([timestamp, email, source, 'Active']);

  // Send confirmation email (optional)
  try {
    MailApp.sendEmail({
      to: email,
      subject: 'Welcome to Epicenter Exchange Newsletter!',
      htmlBody: getWelcomeEmailHTML()
    });
  } catch (mailError) {
    Logger.log('Email send failed: ' + mailError.toString());
  }

  return createResponse(200, 'Successfully subscribed!');
}

/**
 * Handle contact form submission
 */
function handleContactForm(params) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONTACTS_SHEET);

  if (!sheet) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const newSheet = ss.insertSheet(CONTACTS_SHEET);
    newSheet.appendRow(['Timestamp', 'Name', 'Email', 'Subject', 'Message', 'Status']);
    newSheet.getRange('1:1').setFontWeight('bold');
    return handleContactForm(params); // Retry
  }

  const timestamp = params.timestamp || new Date().toISOString();
  const name = params.name || '';
  const email = params.email || '';
  const subject = params.subject || '';
  const message = params.message || '';

  // Add to sheet
  sheet.appendRow([timestamp, name, email, subject, message, 'New']);

  // Notify admin (optional - sends email to sheet owner)
  try {
    const adminEmail = Session.getActiveUser().getEmail();
    if (adminEmail) {
      MailApp.sendEmail({
        to: adminEmail,
        subject: '[Epicenter Exchange] New Contact: ' + subject,
        htmlBody: '<h3>New Contact Form Submission</h3>' +
          '<p><strong>Name:</strong> ' + name + '</p>' +
          '<p><strong>Email:</strong> ' + email + '</p>' +
          '<p><strong>Subject:</strong> ' + subject + '</p>' +
          '<p><strong>Message:</strong> ' + message + '</p>' +
          '<p><strong>Time:</strong> ' + timestamp + '</p>'
      });
    }
  } catch (mailError) {
    Logger.log('Admin notification failed: ' + mailError.toString());
  }

  return createResponse(200, 'Message sent successfully!');
}

/**
 * Create JSON response
 */
function createResponse(code, message) {
  const output = JSON.stringify({ status: code, message: message });
  return ContentService
    .createTextOutput(output)
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Welcome email HTML template
 */
function getWelcomeEmailHTML() {
  return `
    <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;background:#0b1426;color:#eaecef;padding:40px;border-radius:8px;">
      <div style="text-align:center;margin-bottom:30px;">
        <h1 style="color:#f0b90b;margin:0;">Epicenter Exchange</h1>
        <p style="color:#848e9c;margin-top:8px;">Your Crypto Intelligence Hub</p>
      </div>
      <h2 style="color:#ffffff;margin-bottom:16px;">Welcome Aboard!</h2>
      <p style="line-height:1.7;color:#848e9c;">Thank you for subscribing to the Epicenter Exchange newsletter. You will now receive:</p>
      <ul style="color:#848e9c;line-height:2;">
        <li>Daily market digests with top movers</li>
        <li>Unbiased exchange reviews and comparisons</li>
        <li>Expert trading insights and analysis</li>
        <li>Exclusive offers from top exchanges</li>
      </ul>
      <div style="text-align:center;margin:30px 0;">
        <a href="https://www.binance.com/referral/earn-together/refer2earn-usdc/claim?hl=en-IN&ref=GRO_28502_CGKN7&utm_source=default" style="display:inline-block;background:#f0b90b;color:#0b1426;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">Start Trading on Binance</a>
      </div>
      <p style="font-size:12px;color:#5e6673;text-align:center;margin-top:30px;border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;">
        You are receiving this because you subscribed at epicenterexchange.com.<br>
        <a href="#" style="color:#848e9c;">Unsubscribe</a> | <a href="https://epicenterexchange.com/privacy-policy.html" style="color:#848e9c;">Privacy Policy</a>
      </p>
    </div>
  `;
}

/**
 * Utility: Get all subscribers (for admin use)
 */
function getAllSubscribers() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NEWSLETTER_SHEET);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  return data.slice(1).map(row => ({
    timestamp: row[0],
    email: row[1],
    source: row[2],
    status: row[3]
  }));
}

/**
 * Utility: Get subscriber count
 */
function getSubscriberCount() {
  const subs = getAllSubscribers();
  return subs.filter(s => s.status === 'Active').length;
}
