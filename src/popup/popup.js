console.log("NM.popup : Running");


//MESSAGES
  //Request the math codes from the content
  var NOTION_MATH_RETRIEVE_MATH_CODES = "find_maths";
  //Request to store the codes in background
  var NOTION_MATH_STORE_CODES = "store_codes";
  //Signal Updated CODES
  var NOTION_MATH_CODES_UPDATED = "codes_updated";


// --------------------- VARS ----------------------------------------
var custom_codes = [];
var page_codes = [];
var saved_codes = [];

// --------------------- UTILITIES -----------------------------

//----- translate a block id used
//                   to the one used for the preview
function preview_id(id){
  return "preview_" + id.toString();
}

//----- translate a block id used
//                   to the one used for the preview
function textarea_id(id){
  return "textarea_" + id.toString();
}

function save_btn_id(id){
    return "save_btn_" + id.toString();
}

function delete_btn_id(id){
    return "delete_btn_" + id.toString();
}

function gttop_btn_id(id){
    return "gttop_btn_" + id.toString();
}


function clean_id(custom_id){
  return custom_id.replace("label_","").replace("textarea_","")
                  .replace("save_btn_","").replace("delete_btn_","")
                  .replace("gttop_btn_","");
}



//----- send a request for the codes in the content
function send_request_for_codes(){
  console.log("NM.popup :   Button Clicked;");
  let msg = {
    type : NOTION_MATH_RETRIEVE_MATH_CODES
  };
  chrome.runtime.sendMessage(msg);
}


//------------------------- LOGIC DEFINITION -------------------------------------

// Get the position of an element in the page
function getPosition(element){
        var e = document.getElementById(element);
        var y = 0;
        do{
            y += e.offsetTop;
        }while(e = e.offsetParent);
        return y;
    }


function add_custom_katex_code() {
  let new_id = Math.random().toString(36).substr(2, 9);
  custom_codes.push(
        {
          id : new_id,
          code : "\\frac{New Code}{Click to change code}"

        }
    );
  refresh_codes_visualization();
}
function add_saved_katex_code(code) {
  let new_id = Math.random().toString(36).substr(2, 9);
  saved_codes.push(
        {
          id : new_id,
          code : code

        }
    );
  refresh_codes_visualization();
}

function sync_katex_code(id, code){
  let label_area = document.getElementById(
                            preview_id(id)
                            );
  katex.render(code,
              label_area,
              { throwOnError: false}
            );
}

//-------- LISTENERS

function add_listeners_to_text_area(text_area){
  text_area.addEventListener(
            'keyup',
            (event) => {
              clean_code = auto_de_formatting(text_area.value);
              sync_katex_code(text_area.id,
                clean_code
                );
            }
        );
  text_area.addEventListener(
            'change',
            (event) => {
              console.log("NM.popup :   COPY TO CLIPBOARD");
              text_area.select();
              document.execCommand('copy');
              window.getSelection().removeAllRanges()
            }
  );
  text_area.addEventListener(
    'keydown',
    (event) => {
      console.log("NM.popup : TAB INTERCEPTED");
      tabs_in_textarea(text_area, event);
    }
  );
}

function add_listeners_to_delete_btn(btn){


}

function add_listeners_to_save_btn(btn){
  // TODO: STORE IN CHROME A NEW BLOCK WITH THE SAME ID
  btn.addEventListener(
    'click',
    function()  {
      let id = clean_id(btn.id);
      let code = document.getElementById(textarea_id(id)).value;
      add_saved_katex_code(code);
    }
  );

}

function add_listeners_to_gttop_btn(btn){
  window.scrollTo(0,0);
}

chrome.runtime.onMessage.addListener(popup_receiver);
function popup_receiver(request, sender, sendResponse){
  console.log("NM.popup :   Message received");
  if(request.type === NOTION_MATH_CODES_UPDATED){
    console.log("NM.popup : Message Received with Katex Codes");
    page_codes = request.codes;
    refresh_codes_visualization();
    console.log("NM.popup :   Updating popup with new codes");
  }
}

// ------- Load Buttons Listener :
window.addEventListener(
  'load',
  function load(event){
      //---- Trigger Retrive codes from page
      var updateBtn = document.getElementById('btn_retrieve_codes');
      updateBtn.addEventListener(
                'click',
                function() {
                  send_request_for_codes(); }
                );

      // ---- Add the KCode textarea and Preview (empty)
      var addBtn = document.getElementById('btn_add_code');
      addBtn.addEventListener(
                'click',
                function() {
                    add_custom_katex_code();
                    console.log("NM.popup : ANCHORING TO CUSTOM CODES");
                    console.log(getPosition(custom_codes_div_anchor));
                    window.scrollTo(0,
                                    getPosition(custom_codes_div_anchor));
                  }
                );
  }
);

// --------------------- Interface INIT ------------------------------

send_request_for_codes();
