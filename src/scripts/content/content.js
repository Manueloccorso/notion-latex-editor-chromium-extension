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
    let noisy_code =annotations[i].innerHTML;
    noisy_code = noisy_code.replace(/amp;/g, "");
    codes.push(noisy_code);
  }
  return codes;
}

// ---- retrieve a list of katex codes from the page,
//        and send a message with them
function retrieve_kcodes_from_page(){
  let notion_blocks = document.getElementsByClassName("notion-equation-block");
  let msg_blocks = [];

  for(let i = 0; i < notion_blocks.length ; i++){
    nb_dom = notion_blocks[i];

    nb_id = nb_dom.dataset.blockId;
    nb_code = get_kcodes_from_annotations(
                  nb_dom.getElementsByTagName('annotation')
              )[0];

    let msg_block = {
      id : nb_id,
      code : nb_code
    };

    msg_blocks.push(msg_block);
  }

  let msg = {
    type : NOTION_MATH_STORE_CODES,
    codes : msg_blocks
  }

  console.log("NM.content : Sent message with blocks: ");
  console.log("NM.content : "+ msg.type);
  console.log("NM.content : # of Blocks " + msg.codes.length);
  for (let i = 0; i < msg.codes.length; i++){
    msg_block = msg.codes[i];
    console.log("NM.content : Id : " + msg_block.id);
    console.log("NM.content : code : " + msg_block.code);
  }
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
