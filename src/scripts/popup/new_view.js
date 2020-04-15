var page_block_type = "page_block_type";
var custom_block_type = "custom_block_type";
var saved_block_type = "saved_block_type";


function View(){

  let view = {

    model : {},
    attachModel : function(m){
      this.model = m;
      return this;
    },
    controller : {},
    attachController : function(ctrl){
      this.controller = ctrl;
      return this;
    },

    page_codes_box : document.getElementById(this.id_html_fixed.stored_codes_box_id),
    quick_codes_box : document.getElementById(this.id_html_fixed.quick_codes_box_id),
    stored_codes_box : document.getElementById(this.id_html_fixed.stored_codes_box_id),

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
        for (prefix of this.id_prefixes)
          cleaned = cleaned.replace(prefix,"");
        return cleaned;
      },

      codeTextareaId : function (id){
        return this.id_prefixes.textarea_code + id;
      },

      codePreviewId : function(id){
        return this.id_prefixes.preview_code + id;
      },

      saveBtnId : function (id){
          return this.id_prefixes.save_btn + id;
      },

      deleteBtnId : function (id){
          return this.id_prefixes.delete_btn + id;
      },

      scrollTopBtnId : function (id){
          return this.id_prefixes.scroll_top_btn + id;
      },

    //---------------------- FIXED ID ------------------------------
      id_html_fixed : {
                        pages_codes_box_id : "page_codes_div_id",
                        quick_codes_box_id : "custom_codes_div_id",
                        stored_codes_box_id : "saved_codes_div_id",

                        top_title_div_id : "top_title_div_id"
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

    //--------------------- ELEMENTS CREATION -----------------------
      // ----------------- CODE ELEMENTS ----------------------------
        createCodeTextArea : function(code){
          let textarea = document.createElement("TEXTAREA");
          textarea.id = codeTextareaId(code.id);
          textarea.className += this.css_class_names.code_textarea;
          textarea.value = code.code;
          // TODO: Add Listeners
          return textarea;
        },

        createCodePreview : function(code){
          let label = document.createElement("p");
          label.id = this.codePreviewId(id);
          label.className += css_class_names.code_preview;
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
          btn.className = this.css_class_names.scrolltop_btn;
          btn.innerHTML =  ' <span class="front"> ' +
                                  '<img class="'  + class_name  + '" ' +
                                      ' src="'    + icon        + '" '+
                                      ' alt="'    + alt         + '"> ' +
                            ' </span>';
          return btn;
        },


        createAddBtn : function(code){
          let add_btn = this.createBtn(  this.scrollTopBtnId(code.id),
                                          this.css_class_names.add_btn,
                                          this.resources.add_icon,
                                          "Add a new Code!");
          // TODO: Add Listener
          return add_btn;
        },

        createDeleteBtn : function(code){
          let del_btn = this.createBtn(  this.scrollTopBtnId(code.id),
                                          this.css_class_names.delete_btn,
                                          this.resources.delete_icon,
                                          "Delete this Code!");
          // TODO: Add Listener
          return del_btn;
        },

        createSaveBtn : function(code){
            let save_btn = this.createBtn(  this.saveBtnId(code.id),
                                            this.css_class_names.save_btn,
                                            this.resources.save_icon,
                                            "Store the Code!");
            // TODO: Add Listener
            return save_btn;
        },

        createSyncBtn : function(code){
          let sync_btn = this.createBtn(  this.scrollTopBtnId(code.id),
                                          this.css_class_names.sync_btn,
                                          this.resources.sync_icon,
                                          "Sync with the page!");
          // TODO: Add Listener
          return sync_btn;
        },

        createScrollTopBtn : function(code){
          let st_btn = this.createBtn(  this.scrollTopBtnId(code.id),
                                          this.css_class_names.scrolltop_btn,
                                          this.resources.scrolltop_icon,
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
          list_item.className = this.css_class_names.code_li;
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
          let li = createListItem();
          node.append(li);
              let details = createDetails();
              li.append(details);
                  let summary = createSummary();
                  details.append(summary);
                      let code_preview = createCodePreview(code);
                      summary.append(code_preview);
                  let code_textarea = createCodeTextArea(code);
                  details.append(code_textarea);

                  for(buttonCreator of buttonCreators)
                    details.append(buttonCreator(code));
          return node;
        },

        appendCodeBlocks : function(node, codes, buttons){
          for(let i = 0; i < codes.length; i++){
            let code = codes[i];
            appendCodeBlock(node, code, buttons);
          }
          return node;
        },

    // ------------- REFRESHING VIEW PIECES

      refreshPageCodesView : function (){
        this.pages_codes_box.innerHTML = "";
        let pages_codes = this.model.getCodesByType(this.model.type_page);
        console.log("ADDING :");
        console.log(pages_codes);
        appendCodeBlocks(this.pages_codes_box, pages_codes, [
                                                            this.createScrollTopBtn,
                                                            this.createSyncBtn,
                                                            this.createSaveBtn,
                                                            this.createDeleteBtn,
                                                          ]
                        );
      },

      refreshQuickCodesView : function (){
        this.quick_codes_box.innerHTML = "";
        let quick_codes = this.model.getCodesByType(this.model.type_quick);
        console.log("ADDING :");
        console.log(quick_codes);
        appendCodeBlocks(this.quick_codes_box, quick_codes, [
                                                            this.createScrollTopBtn,
                                                            this.createSaveBtn,
                                                            this.createDeleteBtn,
                                                          ]
                        );
      },

      refreshStoredCodesView : function (){
        this.stored_codes_box.innerHTML = "";
        let stored_codes = this.model.getCodesByType(this.model.type_stored);
        console.log("ADDING :");
        console.log(stored_codes);
        appendCodeBlocks(this.stored_codes_box, stored_codes, [
                                                            this.createScrollTopBtn,
                                                            this.createSaveBtn,
                                                            this.createDeleteBtn,
                                                          ]
                        );
      },

      refreshView : function(){
        refreshPageCodesView();
        refreshQuickCodesView();
        refreshStoredCodesView();
      },

  }

  return view;
}
