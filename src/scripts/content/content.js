//MESSAGES
//Request the math codes from the content
var CODES_FROM_PAGE_REQUEST = "find_maths";
//Request to store the codes in background
var CODES_FROM_PAGE_ANSWER = "store_codes";

// --------------------- UTILITIES -----------------------------

let htmlManager = {
  get : {
    equation_blocks : function(node){
      return node.getElementsByClassName("notion-equation-block");
    },
    annotations : function(node){
      return node.getElementsByTagName('annotation');
    }
  }
}

let codesManager = {
  utils : {
    clean_code : function(code){
      return code.replace(/amp;/g, "");
    }
  },
  get : {
     code_from_annotation : function(annotation) {
      return codesManager.utils.clean_code(annotation.innerHTML);;
    },
     code_from_equation_block : function(eq_block) {
      let id = eq_block.dataset.blockId;
      let code = codesManager.get.code_from_annotation(htmlManager.get.annotations(eq_block)[0]);
      return {
        id: id,
        code: code
      }
    },
    codes_from_equation_blocks : function(eq_blocks){
      let codes = [];
      for(let i = 0; i < eq_blocks.length; i++)
        codes.push(codesManager.get.code_from_equation_block(eq_blocks[i]));
      return codes;
    },

    codes_from_page : function(){
      return this.codes_from_equation_blocks(htmlManager.get.equation_blocks(document));
    }
  }
}

let encoder = {
  codes : function(codes){
    return  msg = {
      type: CODES_FROM_PAGE_ANSWER,
      codes: codes
    };
  }
}




//------------------------- LOGIC -------------------------------------

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.type === CODES_FROM_PAGE_REQUEST){
      let msg = encoder.codes(codesManager.get.codes_from_page());
      sendResponse(msg);
      return true;
    }
  });
