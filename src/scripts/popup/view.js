var page_block_type = "page_block_type";
var custom_block_type = "custom_block_type";
var saved_block_type = "saved_block_type";


function View(){

  let view = {

    page_codes_box : function(){return document.getElementById(global_view.id_html_fixed.page_codes_box_id); },
    quick_codes_box : function(){ return document.getElementById(global_view.id_html_fixed.quick_codes_box_id);},
    stored_codes_box : function(){ return document.getElementById(global_view.id_html_fixed.stored_codes_box_id); },

    //----------------------- ID PREFIXES ------------------------
      id_prefixes : {
                      code_textarea   : "code_textarea_",
                      code_preview    : "code_preview_",

                      save_btn        : "save_btn_",
                      delete_btn      : "delete_btn",
                      scrolltop_btn   : "scroll_top_btn_",
                    },

      cleanId : function(dirty_id){
        cleaned = dirty_id;
        for (prefix of global_view.id_prefixes)
          cleaned = cleaned.replace(prefix,"");
        return cleaned;
      },

      codeTextareaId : function (id){
        return global_view.id_prefixes.textarea_code + id;
      },

      codePreviewId : function(id){
        return global_view.id_prefixes.preview_code + id;
      },

      saveBtnId : function (id){
          return global_view.id_prefixes.save_btn + id;
      },

      deleteBtnId : function (id){
          return global_view.id_prefixes.delete_btn + id;
      },

      scrollTopBtnId : function (id){
          return global_view.id_prefixes.scroll_top_btn + id;
      },

    //---------------------- FIXED ID ------------------------------
      id_html_fixed : {
                        page_codes_box_id : "page_codes_box_id",
                        quick_codes_box_id : "quick_codes_box_id",
                        stored_codes_box_id : "stored_codes_box_id",

                        top_title_box_id : "top_title_box_id"
                      },

    // ------------------- CLASS NAMES -----------------------------
      css_class_names : {
                  code_textarea   : "code-textarea",
                  code_preview    : "code-preview",
                  code_li         : "code-li",

                  add_btn         : "add-btn",
                  delete_btn      : "delete-btn",
                  save_btn        : "save-btn",
                  sync_btn        : "sync_btn",
                  scrolltop_btn   : "scroll-top-btn",

                  small_icon      : "small-icon"


    },

    //------------------- RESOURCES -----------------------------------
      resources : {
                    add_icon        : "images/icons/add-multi-size.ico",
                    delete_icon     : "images/icons/delete-multi-size.ico",
                    save_icon       : "images/icons/save-multi-size.ico",
                    sync_icon       : "images/icons/sinchronize-multi-size.ico",
                    scrolltop_icon  : "images/icons/up-multi-size.ico",
                  },

    // ---------------------- INIT --------------------------------
      init : function(){
      },
    //--------------------- ELEMENTS CREATION -----------------------
      // ----------------- CODE ELEMENTS ----------------------------
        createCodeTextArea : function(code){
          let textarea = document.createElement("TEXTAREA");
          textarea.id = global_view.codeTextareaId(code.id);
          textarea.className += global_view.css_class_names.code_textarea;
          textarea.value = code.code;
          // TODO: Add Listeners
          return textarea;
        },

        createCodePreview : function(code){
          let label = document.createElement("p");
          label.id = global_view.codePreviewId(code.id);
          label.className +=  global_view.css_class_names.code_preview;
          console.log(code.code);
          katex.render(code.code,
                      label,
                      { throwOnError: false}
                    );
          // TODO: Add Listeners
          return label;
        },

      //------------------- BUTTONS -------------------------------
        createBtn : function(id, class_name, icon, alt){
          let btn = document.createElement("BUTTON");
          btn.id = id;
          btn.className = global_view.css_class_names.scrolltop_btn;
          btn.innerHTML =  ' <span class="front"> ' +
                                  '<img class="'  + class_name  + '" ' +
                                      ' src="'    + icon        + '" '+
                                      ' alt="'    + alt         + '"> ' +
                            ' </span>';
          return btn;
        },


        createAddBtn : function(code){
          let add_btn = global_view.createBtn(  global_view.scrollTopBtnId(code.id),
                                          global_view.css_class_names.add_btn,
                                          global_view.resources.add_icon,
                                          "Add a new Code!");
          // TODO: Add Listener
          return add_btn;
        },

        createDeleteBtn : function(code){
          let del_btn = global_view.createBtn(  global_view.scrollTopBtnId(code.id),
                                          global_view.css_class_names.delete_btn,
                                          global_view.resources.delete_icon,
                                          "Delete this Code!");
          // TODO: Add Listener
          return del_btn;
        },

        createSaveBtn : function(code){
            let save_btn = global_view.createBtn(  global_view.saveBtnId(code.id),
                                            global_view.css_class_names.save_btn,
                                            global_view.resources.save_icon,
                                            "Store the Code!");
            // TODO: Add Listener
            return save_btn;
        },

        createSyncBtn : function(code){
          let sync_btn = global_view.createBtn(  global_view.scrollTopBtnId(code.id),
                                          global_view.css_class_names.sync_btn,
                                          global_view.resources.sync_icon,
                                          "Sync with the page!");
          // TODO: Add Listener
          return sync_btn;
        },

        createScrollTopBtn : function(code){
          let st_btn = global_view.createBtn(  global_view.scrollTopBtnId(code.id),
                                          global_view.css_class_names.scrolltop_btn,
                                          global_view.resources.scrolltop_icon,
                                          "Scroll to top!");
          // TODO: Add Listener
          return st_btn;
        },

      //------------------ OTHER ELEMENTS -------------------------------
        createTitle : function(level, title) {
        let title_box = document.createElement("P");
        title_box.innerHTML =   "<h"  + level + ">" + title + "</h" + level + ">";
        return title_box;
    },

        createListItem : function(){
          let list_item = document.createElement("LI");
          list_item.className = global_view.css_class_names.code_li;
          return list_item;
        },

        createDetails : function(){
          return document.createElement("DETAILS");
        },

        createSummary : function(){
            return document.createElement("SUMMARY");
        },


    //---------------------- BLOCKS CREATION ---------------------------
      // ---------------------- BUTTONS BLOCK ----------------------------

        appendAddBtn : function (node, code){
          let add_btn = createScrollTopBtn(code);
          node.append(add_btn);
          return node;
        },

        appendDeleteTopBtn : function (node, code){
          let del_btn = createScrollTopBtn(code);
          node.append(del_btn);
          return node;
        },

        appendSaveBtn : function (node, code){
          let save_btn = createScrollTopBtn(code);
          node.append(gttop_btn);
          return node;
        },

        appendSyncBtn : function (node, code){
          let sync_btn = createScrollTopBtn(code);
          node.append(sync_btn);
          return node;
        },

        appendScrollTopBtn : function (node, code){
          let st_btn = createScrollTopBtn(code);
          node.append(st_btn);
          return node;
        },

      //-------------------- OTHER ELEMENTS ----------------------------
        appendTitle : function(node, level, title){
          let title_el = createTitle(level, title);
          node.append(title_el);
          return node;
      },

      // ----------------- CODE BLOCKS --------------------------------
        appendCodeBlock : function (node, code, buttonCreators ){
          let li = global_view.createListItem();
          node.append(li);
              let details = global_view.createDetails();
              li.append(details);
                  let summary = global_view.createSummary();
                  details.append(summary);
                      let code_preview = global_view.createCodePreview(code);
                      summary.append(code_preview);
                  let code_textarea = global_view.createCodeTextArea(code);
                  global_controller.addListenersToCodeTextArea(code_textarea)
                  details.append(code_textarea);

                  for(buttonCreator of buttonCreators)
                    details.append(buttonCreator(code));
          return node;
        },

        appendCodeBlocks : function(node, codes, buttons){
          for(let i = 0; i < codes.length; i++){
            let code = codes[i];
            global_view.appendCodeBlock(node, code, buttons);
          }
          return node;
        },

      // ------------- REFRESHING VIEW PIECES
        refreshCodePreview : function(code){
          let code_preview_box    = document.getElementById(global_view.codePreviewId(code.id));
          let code_preview        = createCodePreview(code);
          let summary = code_preview_box.getElementByTagName("summary");
          summary.innerHTML(code_preview);
        },


        refreshPageCodesView : function (){
          global_view.page_codes_box().innerHTML = "";
          let pages_codes = global_model.getCodesByType("code_page_type");
          console.log("ADDING :");
          console.log(pages_codes);
          global_view.appendCodeBlocks(global_view.page_codes_box(), pages_codes, [
                                                              global_view.createScrollTopBtn,
                                                              global_view.createSyncBtn,
                                                              global_view.createSaveBtn,
                                                              global_view.createDeleteBtn,
                                                            ]
                          );
        },

        refreshQuickCodesView : function (){
          global_view.quick_codes_box().innerHTML = "";
          let quick_codes = global_model.getCodesByType(global_model.type_quick);
          console.log("ADDING :");
          console.log(quick_codes);
          global_view.appendCodeBlocks(global_view.quick_codes_box(), quick_codes, [
                                                              global_view.createScrollTopBtn,
                                                              global_view.createSaveBtn,
                                                              global_view.createDeleteBtn,
                                                            ]
                          );
        },

        refreshStoredCodesView : function (){
          global_view.stored_codes_box().innerHTML = "";
          let stored_codes = global_model.getCodesByType(global_model.type_stored);
          console.log("ADDING :");
          console.log(stored_codes);
          global_view.appendCodeBlocks(global_view.stored_codes_box(), stored_codes, [
                                                              global_view.createScrollTopBtn,
                                                              global_view.createSaveBtn,
                                                              global_view.createDeleteBtn,
                                                            ]
                          );
        },

        refreshView : function(){
          global_view.refreshPageCodesView();
          global_view.refreshQuickCodesView();
          global_view.refreshStoredCodesView();
        },

    // ----------------------------- INTERACTIVE -------------------------
      //Finds y value of given object
      findPosOfElement : function (obj) {
          var curtop = 0;
          if (obj.offsetParent) {
              do {
                  curtop += obj.offsetTop;
              } while (obj = obj.offsetParent);
          return [curtop];
          }
      },
      //scroll the view to an element given the id
      scrollToElementById : function (id){
        window.scroll(0,global_view.findPosOfElement(document.getElementById(id)));
      },

      scrollToTop : function(){
        global_view.scrollToElementById(global_view.id_html_fixed.top_title_box_id);
      },
      scrollToPageBlocks : function(){
        global_view.scrollToElementById(global_view.id_html_fixed.page_codes_box_id);
      },
      scrollToQuickBlocks : function(){
        global_view.scrollToElementById(global_view.id_html_fixed.quick_codes_box_id);
      },
      scrollToStoredBlocks : function(){
        global_view.scrollToElementById(global_view.id_html_fixed.stored_codes_box_id);
      },



  }
  return view;
}
