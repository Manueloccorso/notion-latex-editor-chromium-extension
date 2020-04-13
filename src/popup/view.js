
//----- Create a TextArea from the Katex_code
function set_text_area_with_code(code, id){
  let text_area = document.createElement("TEXTAREA");
  text_area.id = id;
  text_area.value = code;
  add_listeners_to_text_area(text_area);
  return text_area;
}

function create_preview_paragraph(code, id ){
  let label_area = document.createElement("p");
  label_area.id = preview_id_from_code_id(id);
  label_area.className +=  "rendered-code";
  katex.render(code,
              label_area,
              { throwOnError: false}
            );
  return label_area;
}

function append_title(node, level, title, anchor){
  let title_text = document.createElement("p");
  if(anchor.length < 1){
    title_text.innerHTML = "<h"+level+">"+title+ "</h"+level+">";
  }
  else {
    title_text.innerHTML = "<a href='"+anchor+"' id='"+anchor+"'' > <h"+level+">"+title+ "</h"+level+"> </a>";
  }
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

function append_code_block(node, code, index, custom){
  let li = document.createElement("LI");
  node.append(li);
    let spoiler_div = document.createElement("DETAILS");
    li.append(spoiler_div);
      let summary = document.createElement("SUMMARY");
      spoiler_div.append(summary);
        let preview_paragraph = create_preview_paragraph(code, index);
        summary.append(preview_paragraph);
      let text_area = set_text_area_with_code(autoformatting(code), index);
      spoiler_div.append(text_area);
}

function append_code_blocks(node, codes, starting_id){
  for(let index = 0; index < codes.length; index++){
    let code = codes[index];
    append_code_block(node, code.code, code.id, false);
  }
}


//----- Refresh Katex_codes textarea and preview
function refresh_codes_visualization(){

  //insert the codes from content
  let page_codes_div = document.getElementById('page_codes');
  page_codes_div.innerHTML = "";
  append_title(page_codes_div, "3", "Notion Page Katex Codes", page_codes_div_anchor);
  append_code_blocks(page_codes_div,page_codes, 0);

  //insert customly created codes
  let custom_codes_div = document.getElementById('custom_codes');
  custom_codes_div.innerHTML = "";
  append_title(custom_codes_div, "3", "Custom Katex Codes", custom_codes_div_anchor);
  append_code_blocks(custom_codes_div, custom_codes, page_codes.length);

}
