console.log("NM.Background : Running");

//MESSAGES
  //Request the math codes from the content
  var NOTION_MATH_RETRIEVE_MATH_CODES = "find_maths";
  //Request to store the codes in background
  var NOTION_MATH_STORE_CODES = "store_codes";
  //Signal Updated CODES
  var NOTION_MATH_CODES_UPDATED = "codes_updated";


//----------------------INIT CONTROLLER
chrome.runtime.onMessage.addListener(bg_receiver);


// ---------------------CONTROLLER BEHAVIOUR
function bg_receiver(request, sender, sendResponse){

  // From: Content
  // Subject: Updated list of codes from the page
  // Forward: popup
  if(request.type === NOTION_MATH_STORE_CODES){
    console.log("NM.background: received message:");
    console.log("NM.background: "+ NOTION_MATH_STORE_CODES);
    console.log("NM.background: "+ request.codes);
    let msg = {
      type : NOTION_MATH_CODES_UPDATED,
      codes : request.codes
    };
    chrome.runtime.sendMessage(msg);
  }

  //From : Popup
  //Subject: request the codes from the page
  //Forward: content
  if(request.type === NOTION_MATH_RETRIEVE_MATH_CODES){
    console.log("NM.background: received message:");
    console.log("NM.background: "+ NOTION_MATH_RETRIEVE_MATH_CODES);
    chrome.tabs.query(
      {active: true, currentWindow: true},
      function(tabs){
        if (tabs.length > 0) {
          console.log("NM.background: Forwarding KCodes Retrieve Request");
          chrome.tabs.sendMessage(tabs[0].id,
           request);
         }
       }
     );
  }
}
