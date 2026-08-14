/**
 * Caprio & Co — website form intake (Contact + Quote) -> Google Sheets.
 *
 * Deploy: Extensions > Apps Script in your Sheet, paste this file in as
 * Code.gs, then Deploy > New deployment > type "Web app" > execute as
 * "Me", access "Anyone". Copy the resulting /exec URL into WEBHOOK_URL
 * in assets/js/forms-submit.js on the website.
 *
 * Paste these header rows into row 1 of each tab, in this exact order
 * (create the tabs named exactly "Contact" and "Quote" first):
 *
 * Contact tab — row 1:
 *   Timestamp | Name | Company | Email | Phone | Message | Page URL |
 *   UTM Source | UTM Medium | UTM Campaign | UTM Term | UTM Content
 *
 * Quote tab — row 1:
 *   Timestamp | Name | Company | Email | Phone | Subject | Material |
 *   Grade | Quantity | Destination | Requirement Details | Page URL |
 *   UTM Source | UTM Medium | UTM Campaign | UTM Term | UTM Content
 */

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);

    var sheetName = payload.formType === "contact" ? "Contact"
      : payload.formType === "quote" ? "Quote"
      : null;
    if (!sheetName) {
      throw new Error('Missing or unrecognized formType (expected "contact" or "quote"), got: ' + payload.formType);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      throw new Error('Sheet tab "' + sheetName + '" not found. Create it and add the header row from the comment at the top of Code.gs.');
    }

    var utm = getUtmParams(payload.pageUrl || "");
    var timestamp = new Date();
    var phone = "'" + (payload.phone || ""); // leading apostrophe forces text, keeps "+" and leading zeros

    var row;
    if (payload.formType === "contact") {
      row = [
        timestamp,
        payload.name || "",
        payload.company || "",
        payload.email || "",
        phone,
        payload.message || "",
        payload.pageUrl || "",
        utm.utm_source,
        utm.utm_medium,
        utm.utm_campaign,
        utm.utm_term,
        utm.utm_content,
      ];
    } else {
      row = [
        timestamp,
        payload.name || "",
        payload.company || "",
        payload.email || "",
        phone,
        payload.subject || "",
        payload.product || "",
        payload.grade || "",
        payload.quantity || "",
        payload.destination || "",
        payload.message || "",
        payload.pageUrl || "",
        utm.utm_source,
        utm.utm_medium,
        utm.utm_campaign,
        utm.utm_term,
        utm.utm_content,
      ];
    }

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Apps Script has no built-in URL/query-string parser, so pull the
 * standard UTM params out of a full page URL with regex. Missing
 * params come back as "" (not undefined) so sheet rows stay aligned.
 */
function getUtmParams(pageUrl) {
  var keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  var result = {};
  keys.forEach(function (key) {
    var match = pageUrl.match(new RegExp("[?&]" + key + "=([^&#]*)"));
    result[key] = match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : "";
  });
  return result;
}
