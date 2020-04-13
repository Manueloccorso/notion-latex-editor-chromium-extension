console.log("NM.Popup: Running");

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

// --------------------- UTILITIES -----------------------------

//----- translate a code id used in the textarea
//                   to the one used for the preview
function preview_id_from_code_id(id){
  return "label_" + id.toString();
}

//----- send a request for the codes in the content
function send_request_for_codes(){
  console.log("NM.popup: Button Clicked;");
  let msg = {
    type : NOTION_MATH_RETRIEVE_MATH_CODES
  };
  chrome.runtime.sendMessage(msg);
}


//----- Create a TextArea from the Katex_code
function set_text_area_with_code(code, id){
  let text_area = document.createElement("TEXTAREA");
  text_area.id = id;
  text_area.value = code;
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
              text_area.select();
              document.execCommand('copy');
              window.getSelection().removeAllRanges()
            }
  );
  text_area.addEventListener(
    'keydown',
    (event) => {
      console.log("TAB INTERCEPTED");
      tabs_in_textarea(text_area, event);
    }
  );
  return text_area;
}

function create_preview_paragraph(code, id ){
  let label_area = document.createElement("p");
  label_area.id = preview_id_from_code_id(id);
  katex.render(code,
              label_area,
              { throwOnError: false}
            );
  return label_area;
}

function append_title(node, level, title){
  let title_text = document.createElement("p");
  title_text.innerHTML = "<h"+level+">"+title+ "</h"+level+">";
  node.append(title_text);
}

function append_divider(node){
  let divider = document.createElement("p");
  divider.innerHTML = "<hr>";
  node.append(divider);
}
function append_new_line(node){
    let divider = document.createElement("p");
    divider.innerHTML = "<br>";
    node.append(divider);
}

function append_code_block(node, code, index, custom){
    //HTML Creation

    append_new_line(node);
    append_divider(node);
    let spoiler_div = document.createElement("DETAILS");
    let summary = document.createElement("SUMMARY");
    summary.append(create_preview_paragraph(code, index))
    spoiler_div.append(summary);
    let text_area = set_text_area_with_code(autoformatting(code), index);
    spoiler_div.append(text_area);

    node.append(spoiler_div);
}

function append_big_divider(node){
  append_new_line(node);
  append_divider(node);
  append_new_line(node);
  append_divider(node);
  append_new_line(node);
}

function append_code_blocks(node, codes, starting_id){
  for(let index = 0; index < codes.length; index++){
    let code = codes[index];
    append_code_block(node, code, starting_id + index, false);
  }
}


//----- Refresh Katex_codes textarea and preview
function refresh_codes_visualization(){
  let codes_div = document.getElementById('codes');
  codes_div.innerHTML = "";
  //insert the codes from content
  append_title(codes_div, "3", "Notion Page Katex Codes");
  append_code_blocks(codes_div,page_codes, 0);

  append_big_divider(codes_div);

  //insert customly created codes
  append_title(codes_div, "3", "Custom Katex Codes");
  append_code_blocks(codes_div, custom_codes, page_codes.length);


}

// --------------------- Interface INIT ------------------------------

// ------- Load Buttons Listener :
window.addEventListener(
  'load',
  function load(event){

      //---- Trigger Retrive codes from page
      var updateBtn = document.getElementById('btn_retrieve_codes');
      updateBtn.addEventListener(
                'click',
                function() {
                  console.log("NM.popup: CLICKED BUTTON");
                  send_request_for_codes(); }
                );

      // ---- Add the KCode textarea and Preview (empty)
      var addBtn = document.getElementById('btn_add_code');
      addBtn.addEventListener(
                'click',
                function() {  add_custom_katex_code(); }
                );
  }
);

send_request_for_codes();

//------------------------- LOGIC -------------------------------------

function add_custom_katex_code() {
  custom_codes.push("New Code");
  refresh_codes_visualization();
}

function sync_katex_code(id, code){
  let label_area = document.getElementById(
                            preview_id_from_code_id(id)
                            );
  katex.render(code,
              label_area,
              { throwOnError: false}
            );
}

chrome.runtime.onMessage.addListener(popup_receiver);
function popup_receiver(request, sender, sendResponse){
  console.log("NM.popup: Message received");
  if(request.type === NOTION_MATH_CODES_UPDATED){
    console.log("Message Received with Katex Codes");
    page_codes = request.codes;
    refresh_codes_visualization();
    console.log("NM.popup: Updating popup with new codes");
  }
}
