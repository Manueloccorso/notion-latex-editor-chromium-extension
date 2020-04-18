var page_block_type = "page_block_type";
var custom_block_type = "custom_block_type";
var saved_block_type = "saved_block_type";


function View(){
  let view = {

    //---------------------- FIXED ID ------------------------------
      id_html_fixed : {
                        page_codes_box_id     : "page_codes_box_id",
                        quick_codes_box_id    : "quick_codes_box_id",
                        stored_codes_box_id   : "stored_codes_box_id",

                        top_title_box_id      : "top_title_box_id",

                        btn_sync_page_codes   : "btn_sync_page_codes",
                        btn_add_quick_code    : "btn_add_quick_code",
                        btn_sync_stored_code  : "btn_sync_stored_code",
                        btn_add_stored_code   : "btn_add_stored_code"
                      },
      //BOXED
      getPageCodesBox   : function(){return document.getElementById(gview.id_html_fixed.page_codes_box_id); },
      getQuickCodesBox  : function(){ return document.getElementById(gview.id_html_fixed.quick_codes_box_id);},
      getStoredCodesBox : function(){ return document.getElementById(gview.id_html_fixed.stored_codes_box_id); },

      getPageCodesSyncBtn   : function(){ return document.getElementById(gview.id_html_fixed.btn_sync_page_codes); },
      getQuickCodesAddBtn   : function(){ return document.getElementById(gview.id_html_fixed.btn_add_quick_code); },
      getStoredCodesSyncBtn : function(){ return document.getElementById(gview.id_html_fixed.btn_sync_stored_code); },
      getStoredCodesAddBtn  : function(){ return document.getElementById(gview.id_html_fixed.btn_add_stored_code); },

    //----------------------- ID PREFIXES ------------------------
      id_prefixes : {
                      code_textarea   : "code_textarea_",
                      code_preview    : "code_preview_",

                      save_btn        : "save_btn_",
                      delete_btn      : "delete_btn_",
                      scrolltop_btn   : "scroll_top_btn_",
                    },

      cleanId : function(dirty_id){
        cleaned = dirty_id;
        for (prefix in gview.id_prefixes){
          cleaned = cleaned.replace(gview.id_prefixes[prefix],"");
        }
        return cleaned;
      },

      codeTextareaId : function (id){
        return gview.id_prefixes.code_textarea + id;
      },

      codePreviewId : function(id){
        return gview.id_prefixes.code_preview + id;
      },

      saveBtnId : function (id){
          return gview.id_prefixes.save_btn + id;
      },

      deleteBtnId : function (id){
          return gview.id_prefixes.delete_btn + id;
      },

      scrollTopBtnId : function (id){
          return gview.id_prefixes.scrolltop_btn + id;
      },


    // ------------------- CLASS NAMES -----------------------------
      css_class_names : {
                  code_textarea   : "code-textarea",
                  code_preview    : "code-preview",
                  code_li         : "code-li",

                  add_btn         : "small-icon",
                  delete_btn      : "small-icon",
                  save_btn        : "small-icon",
                  sync_btn        : "small-icon",
                  scrolltop_btn   : "small-icon",

                  small_icon      : "small-icon",

                  small_btn : "btn-grid"


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
          textarea.id = gview.codeTextareaId(code.id);
          textarea.className += gview.css_class_names.code_textarea;
          textarea.value = code.code;
          // TODO: Add Listeners
          gcontroller.addListenersToCodeTextArea(textarea);
          return textarea;
        },

        createCodePreview : function(code){
          let label = document.createElement("p");
          label.id = gview.codePreviewId(code.id);
          label.className +=  gview.css_class_names.code_preview;
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
          btn.type = "button";
          btn.className = gview.css_class_names.small_btn;
          btn.innerHTML =  ' <span class="front" > ' +
                                  '<img class="'  + class_name  + '" ' +
                                      ' src="'    + icon        + '" '+
                                      ' alt="'    + alt         + '"> ' +
                            ' </span>';
          return btn;
        },


        createAddBtn : function(code){
          let add_btn = gview.createBtn(  gmodel.getNewId(),
                                          gview.css_class_names.add_btn,
                                          gview.resources.add_icon,
                                          "Add a new Code!");
          gcontroller.addListenersToAddBtn(add_btn);
          return add_btn;
        },

        createDeleteBtn : function(code){
          let del_btn = gview.createBtn(  gview.deleteBtnId(code.id),
                                          gview.css_class_names.delete_btn,
                                          gview.resources.delete_icon,
                                          "Delete this Code!");
          gcontroller.addListenersToDeleteBtn(del_btn);
          return del_btn;
        },

        createSaveBtn : function(code){
            let save_btn = gview.createBtn(  gview.saveBtnId(code.id),
                                            gview.css_class_names.save_btn,
                                            gview.resources.save_icon,
                                            "Store the Code!");
            gcontroller.addListenersToSaveBtn(save_btn);
            return save_btn;
        },

        createSyncBtn : function(code){
          let sync_btn = gview.createBtn(  gmodel.getNewId(),
                                          gview.css_class_names.sync_btn,
                                          gview.resources.sync_icon,
                                          "Sync with the page!");
          gcontroller.addListenersToSyncBtn(sync_btn);
          return sync_btn;
        },

        createScrollTopBtn : function(code){
          let st_btn = gview.createBtn(  gview.scrollTopBtnId(code.id),
                                          gview.css_class_names.scrolltop_btn,
                                          gview.resources.scrolltop_icon,
                                          "Scroll to top!");
          gcontroller.addListenersToScrollTopBtn(st_btn);
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
          list_item.className = gview.css_class_names.code_li;
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

        appendDeleteBtn : function (node, code){
          let del_btn = createDeleteBtn(code);
          node.append(del_btn);
          return node;
        },

        appendSaveBtn : function (node, code){
          let save_btn = createSaveBtn(code);
          node.append(gttop_btn);
          return node;
        },

        appendSyncBtn : function (node, code){
          let sync_btn = createSyncBtn(code);
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
          let li = gview.createListItem();
          node.append(li);
              let details = gview.createDetails();
              li.append(details);
                  let summary = gview.createSummary();
                  details.append(summary);
                      let code_preview = gview.createCodePreview(code);
                      summary.append(code_preview);
                  let code_textarea = gview.createCodeTextArea(code);
                  details.append(code_textarea);

                  for(buttonCreator of buttonCreators){
                    details.append(buttonCreator(code));
                  }
          return node;
        },

        appendCodeBlocks : function(node, codes, buttons){
          for(let i = 0; i < codes.length; i++){
            let code = codes[i];
            gview.appendCodeBlock(node, code, buttons);
          }
          return node;
        },

      // ------------- REFRESHING VIEW PIECES
        getSummaryFromCode : function(code){
          return  document.getElementById(gview.codePreviewId(code.id)).parentElement;
        },

        refreshCodePreview : function(code){
          let new_code_preview        = gview.createCodePreview(code);

          let summary = gview.getSummaryFromCode(code);
          summary.innerHTML = "";
          summary.append(new_code_preview);
        },


        refreshPageCodesView : function (){
          gview.getPageCodesBox().innerHTML = "";
          let pages_codes = gmodel.getCodesByType(gmodel.code_page_type);
          gview.appendCodeBlocks(gview.getPageCodesBox(), pages_codes, [
                                                              gview.createScrollTopBtn,
                                                              gview.createSyncBtn,
                                                              gview.createSaveBtn
                                                            ]
                          );
        },

        refreshQuickCodesView : function (){
          gview.getQuickCodesBox().innerHTML = "";
          let quick_codes = gmodel.getCodesByType(gmodel.code_quick_type);
          gview.appendCodeBlocks(gview.getQuickCodesBox(), quick_codes, [
                                                              gview.createScrollTopBtn,
                                                              gview.createSaveBtn
                                                            ]
                          );
        },

        refreshStoredCodesView : function (){
          gview.getStoredCodesBox().innerHTML = "";
          let stored_codes = gmodel.getCodesByType(gmodel.code_stored_type);
          gview.appendCodeBlocks(gview.getStoredCodesBox(), stored_codes, [
                                                              gview.createScrollTopBtn,
                                                              gview.createSaveBtn,
                                                              gview.createDeleteBtn
                                                            ]
                          );
        },

        refreshView : function(){
          gview.refreshPageCodesView();
          gview.refreshQuickCodesView();
          gview.refreshStoredCodesView();
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
        window.scroll(0,gview.findPosOfElement(document.getElementById(id)));
      },

      scrollToTop : function(){
        gview.scrollToElementById(gview.id_html_fixed.top_title_box_id);
      },
      scrollToPageBlocks : function(){
        gview.scrollToElementById(gview.id_html_fixed.page_codes_box_id);
      },
      scrollToQuickBlocks : function(){
        gview.scrollToElementById(gview.id_html_fixed.quick_codes_box_id);
      },
      scrollToStoredBlocks : function(){
        gview.scrollToElementById(gview.id_html_fixed.stored_codes_box_id);
      },



  }
  return view;
}
