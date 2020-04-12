console.log("NM.content: Running");

//MESSAGES
  //Request the math codes from the content
  var NOTION_MATH_RETRIEVE_MATH_CODES = "find_maths";
  //Request to store the codes in background
  var NOTION_MATH_STORE_CODES = "store_codes";
  //Signal Updated CODES
  var NOTION_MATH_CODES_UPDATED = "codes_updated";

// --------------------- VARS ----------------------------------------
var custom_codes = [];
var stored_codes = [];

// --------------------- UTILITIES -----------------------------

// ---- Return all the annotations containing katex code
function get_annotations_from_page(){
  return document.getElementsByTagName("annotation");
}

// --- extract the katex code from the annotations
function get_kcodes_from_annotations(annotations){
  let codes = [];
  for(let i = 0; i < annotations.length; i++){
    codes.push(annotations[i].innerHTML);
  }
  return codes;
}

// ---- retrieve a list of katex codes from the page,
//        and send a message with them
function retrieve_kcodes_from_page(){
  codes = get_kcodes_from_annotations(get_annotations_from_page());
  let msg = {
    type : NOTION_MATH_STORE_CODES,
    codes : codes
  };
  console.log("NM.content : Sent message: ");
  console.log("NM.content : "+ NOTION_MATH_STORE_CODES);
  console.log("NM.content : " +codes.toString());
  chrome.runtime.sendMessage(msg);
}


// --------------------- Interface INIT ------------------------------

retrieve_kcodes_from_page();

//------------------------- LOGIC -------------------------------------

chrome.runtime.onMessage.addListener(content_receiver);
function content_receiver(request, sender, sendResponse){
  console.log("NM.content : Received message: ");
  console.log(request.type);
  if(request.type === NOTION_MATH_RETRIEVE_MATH_CODES){
    retrieve_kcodes_from_page();
  }
}
