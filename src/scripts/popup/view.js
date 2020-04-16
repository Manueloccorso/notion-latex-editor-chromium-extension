
var page_codes_div_id = "page_codes_div_id";
var custom_codes_div_id = "custom_codes_div_id";
var saved_codes_div_id = "saved_codes_div_id";
var top_title_div_id = "top_title_div_id";


var page_block_type = "page_block_type";
var custom_block_type = "custom_block_type";
var saved_block_type = "saved_block_type";

var custom_codes_div_anchor = "#custom_codes_div_anchor";
var page_codes_div_anchor = "#page_codes_div_anchor";
var saved_codes_div_anchor = "#saved_codes_div_anchor";
var top_title_anchor = "#top_title";

//----- Create a TextArea from the Katex_code
function set_text_area_with_code(code, id, stored){
  let text_area = document.createElement("TEXTAREA");
  text_area.id = textarea_id(id);
  text_area.value = code;
  add_listeners_to_text_area(text_area, stored);
  return text_area;
}

function create_preview_paragraph(code, id ){
  let label_area = document.createElement("p");
  label_area.id = preview_id(id);
  label_area.className +=  "rendered-code";
  katex.render(code,
              label_area,
              { throwOnError: false}
            );
  return label_area;
}

function append_title(node, level, title){
  let title_text = document.createElement("p");
  title_text.innerHTML = "<h"+level+">"+title+ "</h"+level+"> ";
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

function append_big_divider(node){
  append_new_line(node);
  append_divider(node);
  append_new_line(node);
  append_divider(node);
  append_new_line(node);
}

function append_gttop_btn(node, id){
  let gttop_btn = document.createElement("BUTTON");
  gttop_btn.id = gttop_btn_id(id);
  gttop_btn.innerHTML =  ' <span class="front"> <img class="small-icon" '+
                              ' src="images/icons/up-multi-size.ico" '+
                              ' alt="Go To Top"> </span>';
  add_listeners_to_gttop_btn(gttop_btn);
  node.append(gttop_btn);
}

function append_save_block_btn(node, id){
  let save_block_btn = document.createElement("BUTTON");
  save_block_btn.id = save_btn_id(id);
  save_block_btn.innerHTML =  ' <span class="front"> <img class="small-icon" '+
                              ' src="images/icons/save-multi-size.ico" '+
                              ' alt="Save"> </span>';
  add_listeners_to_save_btn(save_block_btn);
  node.append(save_block_btn);
}


function append_delete_block_btn(node, id){
  let delete_block_btn = document.createElement("BUTTON");
  delete_block_btn.id = delete_btn_id(id);
  delete_block_btn.innerHTML =  ' <span class="front"> <img class="small-icon" '+
                              ' src="images/icons/delete-multi-size.ico" '+
                              ' alt="Delete"> </span>';
  add_listeners_to_delete_btn(delete_block_btn);
  node.append(delete_block_btn);
}



function append_code_block(node, code, id, type){
  id = id;
  let li = document.createElement("LI");
  li.class = type;
  node.append(li);
    let spoiler_div = document.createElement("DETAILS");
    li.append(spoiler_div);
      let summary = document.createElement("SUMMARY");
      spoiler_div.append(summary);
        let preview_paragraph = create_preview_paragraph(code, id);
        summary.append(preview_paragraph);

      let stored = false;
      if(type == saved_block_type)
        stored = true;
      let text_area = set_text_area_with_code(autoformatting(code), id, stored);
      spoiler_div.append(text_area);

      append_gttop_btn(spoiler_div, id);
      append_save_block_btn(spoiler_div, id);
      if(type == custom_block_type || type == saved_block_type ){
        append_delete_block_btn(spoiler_div, id);
      }

}

function append_code_blocks(node, codes, type){
  for(let index = 0; index < codes.length; index++){
    let code = codes[index];
    append_code_block(node, code.code, code.id, type);
  }
}

//----- Refresh Katex_codes textarea and preview
function refresh_saved_codes_visualization(){
    //insert customly created codes
    let saved_codes_div = document.getElementById(saved_codes_div_id);
    saved_codes_div.innerHTML = "";
    let saved_codes = storage_manager.loaded_saved_codes;
    console.log("ADDING :");
    console.log(saved_codes);
    append_code_blocks(saved_codes_div, saved_codes, saved_block_type);
}


//----- Refresh Katex_codes textarea and preview
function refresh_codes_visualization(){

  //insert the codes from content
  let page_codes_div = document.getElementById(page_codes_div_id);
  page_codes_div.innerHTML = "";
  append_code_blocks(page_codes_div, page_codes, page_block_type);

  //insert customly created codes
  let custom_codes_div = document.getElementById(custom_codes_div_id);
  custom_codes_div.innerHTML = "";
  append_code_blocks(custom_codes_div, custom_codes, custom_block_type);

  //insert customly created codes
  let saved_codes_div = document.getElementById(saved_codes_div_id);
  saved_codes_div.innerHTML = "";
  let saved_codes = storage_manager.loaded_saved_codes;
  append_code_blocks(saved_codes_div, saved_codes, saved_block_type);

}
