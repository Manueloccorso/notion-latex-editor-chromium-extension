

//MESSAGES
//Request the math codes from the content
var CODES_FROM_PAGE_REQUEST = "find_maths";
//Request to store the codes in background
var CODES_FROM_PAGE_ANSWER = "store_codes";

// --------------------- UTILITIES -----------------------------

function getEquationBlocks(node){
  return node.getElementsByClassName("notion-equation-block");
}
function getAnnotations(node){
  return node.getElementsByTagName('annotation');
}

function cleanCode(code) {
  let cleaned = code.replace(/amp;/g, "");
  return cleaned;
}

function getCodeFromAnnotation(annotation) {
  return cleanCode(annotation.innerHTML);;
}

function getCodesFromAnnotations(annotations){
  let codes = [];
  for (let i = 0; i < annotations.length; i++)
    codes.push(getCodeFromAnnotation(annotations[i]));
  return codes;
}

function getCodeFromEqBlock(eq_block) {
  let id = eq_block.dataset.blockId;
  let code = getCodesFromAnnotations(getAnnotations(eq_block))[0];
  return {
    id: id,
    code: code
  }
}

function getCodesFromEqBlocks(eq_blocks){
  let codes = [];
  for(let i = 0; i < eq_blocks.length; i++)
    codes.push(getCodeFromEqBlock(eq_blocks[i]));
  return codes;
}

function getCodesFromPage() {
  let codes = getCodesFromEqBlocks(getEquationBlocks(document));
  return codes;
}

function encodeCodesFromPage(){
  let codes = getCodesFromPage();
  return  msg = {
    type: CODES_FROM_PAGE_ANSWER,
    codes: codes
  };
}

function printCodesMsg(msg){




  for (let i = 0; i < msg.codes.length; i++) {
    code = msg.codes[i];


  }
}

//------------------------- LOGIC -------------------------------------

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {


    if(request.type === CODES_FROM_PAGE_REQUEST){
      let msg = encodeCodesFromPage();

      printCodesMsg(msg);
      sendResponse(msg);
      return true;
    }
  });
