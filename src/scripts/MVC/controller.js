//MESSAGES


//Request the math codes from the content
var CODES_FROM_PAGE_REQUEST = "find_maths";
//Request to store the codes in background
var CODES_FROM_PAGE_ANSWER = "store_codes";

function Controller(content_interaction = true,
                    stored_interaction = true,
                    quick_interaction = true
                  ){

  let controller = {
      // --------------------- INIT ----------------------------------------
        /**
         * init - initialize the controller, to be called after
         *          a gview and a gmodel are created
         *
         */
        init : function(){
          gcontroller.setViewLogic.static_elements.init();
        },


        options : {
          page : content_interaction,
          stored  : stored_interaction,
          quick   : quick_interaction
        },

      // --------------------- content page interaction ----------------------------

        contentInteraction : {

          /**
          * on_receive_codes -
          *        manage the reply from the content.js with the codes
          *          by updating the model with the received code AND
          *          refreshing the page codes section in the view.
          *
          * @param  {type, codes} response
          */
          on_receive_codes : function(response){
            if(response && response.type === CODES_FROM_PAGE_ANSWER){
                console.log("CODE RECEIVED");
                for(let i = 0; i < response.codes.length; i++){
                  gcontroller.add_page_code(gmodel.newCode(
                                              response.codes[i].id,
                                              response.codes[i].code,
                                              "Formula #" + i ,
                                              "page",
                                              gmodel.code_page_type)
                                          );
              }
            }
          },
          request_codes : function(){
            if (gcontroller.options.page){
              let msg = {
                type : CODES_FROM_PAGE_REQUEST
              };
              let self = this;
              chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {
                  self.on_receive_codes(response)
                });
              });
            }
          }
        },


      //------------------------ VIEW LOGIC ------------------------------------
        setViewLogic : {
          static_elements : {
            page_block : function(){
              gview.getElement.page_codes_container.sync_btn().click(
                        function() {
                          gcontroller.contentInteraction.request_codes();
                        } );
            },
            quick_block : function(){
              gview.getElement.quick_codes_container.add_btn().click(
                        function() {
                            gcontroller.add_quick_code();
                          }
                        );
            },
            stored_block : function(){
              //------ Sync with Stored Codes
              gview.getElement.stored_codes_container.sync_btn().click(
                        function() {
                            gview.refresh.stored_codes_view();
                          }
                        );
              //------ Add a new Stored Code
              gview.getElement.stored_codes_container.add_btn().click(
                        function() {
                              gcontroller.add_stored_code(gmodel.newCode(
                                                                        gmodel.newCodeId(),
                                                                        "\\text{New Stored Code!}",
                                                                        "Stored Code Title : better edit!",
                                                                        gmodel.getTagFilter(),
                                                                        gmodel.code_stored_type)
                                                        );
                          }
                        );
              //------ Filtering and searching
              gview.refresh.stored_codes_tags(gmodel.getAllTags());
              let filter_select = gview.getElement.stored_codes_container.filter_select();
              filter_select.focus(
                function(){
                  gview.refresh.stored_codes_tags(gmodel.getAllTags());
                }
              );
              filter_select.change(
                function(){

                  let filter_select_dom = filter_select.get(0);

                  let filter = filter_select_dom.options[filter_select_dom.selectedIndex].value;

                  gmodel.addTagFilter(filter);
                  gview.refresh.stored_codes_view();
                }
              );
              let search_textarea = gview.getElement.stored_codes_container.search_textarea();
              search_textarea.keyup(
                function(event){
                  search_textarea.get(0).value = search_textarea.get(0).value.replace(/\r\n|\r|\n/g,"");
                  let search = search_textarea.get(0).value;
                  if(search == "") gmodel.removeNameFilter();
                  else gmodel.addNameFilter(search_textarea.get(0).value);
                  gview.refresh.stored_codes_view();
                }
              );
            },

            init: function(){
              let self = this;
              gview.hide.unhide_all();
              console.log();
              gcontroller.options.page === true ?
                self.page_block() : gview.hide.page_block();
              gcontroller.options.quick === true ?
                self.quick_block() : gview.hide.quick_block();
              gcontroller.options.stored === true ?
                self.stored_block() : gview.hide.stored_block();
            }
          },
          code_block : {
            //addListenersToCodeNameTextArea
            name_textarea : function(textarea, id){
              textarea.change(
                        (event) => {
                          let old_code = gmodel.getCode(gview.manageId.clean(textarea.attr("id")));
                          gcontroller.commit_code(gmodel.newCode(
                                                                gview.manageId.clean(textarea.attr("id")),
                                                                old_code.code,
                                                                textarea.get(0).value,
                                                                old_code.tag,
                                                                old_code.type));
                        }
              );
            },
            //addListenersToCodeTagTextArea
            tag_textarea : function(textarea){
              textarea.change(
                (event) => {
                  let old_code = gmodel.getCode(gview.manageId.clean( textarea.attr("id")));
                  gcontroller.commit_code(gmodel.newCode(
                                                        gview.manageId.clean(textarea.attr("id")),
                                                        old_code.code,
                                                        old_code.name,
                                                        textarea.get(0).value,
                                                        old_code.type));
                }
              );
            },
            //addListenersToCodeMirrorTextArea
            codemirror : function(code_mirror){
              //INTERCEPT CODES names
              code_mirror.on(
                  "change",
                  (event, changeObj) => {
                    if (changeObj.origin == "+input" && changeObj.text == " "){
                      let space = code_mirror.getCursor();
                      let space_ch = space_pos.ch;
                      let space_line = space_pos.line;

                      let token = code_mirror.getTokenAt(changeObj.from);


                      let replaced = gmodel.replaceStoredCodeNameWithCode(token.string);

                      // WHEN A CODE NAME IS DETECTED
                      // TODO: use an object instead
                      if(replaced !== token.string){
                        // Remove the code name
                        code_mirror.replaceRange("",
                                                {line : space_line , ch : token.start },
                                                {line : space_line , ch : space_ch}
                                                );

                        let pos;
                        //INSERT THE CODE TO BE REPLACED
                        let tokens_from_code = replaced.split("\n");
                        for(let i = 0; i < tokens_from_code.length; i++){
                          pos = code_mirror.getCursor();
                          code_mirror.replaceRange(tokens_from_code[i],
                                                  {line : pos.line , ch : pos.ch});
                          if(i < tokens_from_code.length - 1){
                            code_mirror.execCommand("newlineAndIndent");
                            code_mirror.execCommand("goLineStart");
                          }
                        }
                      }
                    }
                  }
              );
              // REFRESH the PREVIEW
              code_mirror.on(
                "change",
                (event, changeObj) => {
                  let textarea = code_mirror.getTextArea();

                  let old_code = gmodel.getCode(
                                                  gview.manageId.clean( textarea.id)
                                                );

                  let new_code = auto_clean_code(code_mirror.getValue());

                  gcontroller.sync_code_preview(gmodel.newCode(
                                                              old_code.id,
                                                              new_code,
                                                              old_code.name,
                                                              old_code.tag,
                                                              old_code.type));
                }
            );
              // COMMIT CHANGES
              code_mirror.on( "blur",
                (event) => {
                  let textarea = code_mirror.getTextArea();

                  let id = gview.manageId.clean(textarea.id);

                  let cleaned_code = auto_clean_code(code_mirror.getValue());

                  let old_code = gmodel.getCode(id);


                  //COPY TO CLIPBOARD
                  /*
                  code_mirror.save();
                  textarea.select();
                  document.execCommand('copy');
                  window.getSelection().removeAllRanges();
                  */

                  //COMMIT THE CHANGES TO THE MODEL
                  let new_code = gmodel.newCode(
                                                            id,
                                                            cleaned_code,
                                                            old_code.name,
                                                            old_code.tag,
                                                            old_code.type);
                  gcontroller.commit_code(new_code);
                }
              );
              //TODO : autocomplete
            },

            buttons : {
              types : {
                btn_scrollTop :
                  function(btn)  {
                    gview.interact.scroll_to_top();
                  },
                btn_sync      :
                  function(btn){},
                btn_save      :
                  function(btn){
                    let code = gmodel.getCode(gview.manageId.clean(btn.attr("id")));
                    gcontroller.add_stored_code(code);
                    gview.interact.scroll_to_stored_codes();
                  },
                btn_delete    :
                  function(btn)  {
                    let dirty_id = btn.attr("id");
                    let id = gview.manageId.clean(dirty_id);
                    let code = gmodel.getCode(id);
                    gmodel.delCode(code);
                    gview.refresh.view_by_code(code);
                  },
                btn_add       :
                  function(btn){}
              },
              set : function(btn, type){

                btn.click( function(){ type(btn); });
              },
            }
          }
        },

      //------------------------- UTILITIES -------------------------------------
        add_page_code : function(code){
          gmodel.addCode(code);
          gview.refresh.page_codes_view();
        },

        add_quick_code : function (code) {
          gmodel.addCode(gmodel.newCode(
                                          gmodel.newCodeId(),
                                          "\\text{Quick Code!}",
                                          "Quick Code Title : Edit or not",
                                          "Quick",
                                          gmodel.code_quick_type));
          gview.refresh.quick_codes_view();
        },

        add_stored_code : function(code) {

          gmodel.addCode(gmodel.newCode(
                                        gmodel.newCodeId(),
                                        code.code,
                                        "Stored " + code.name,
                                        code.tag,
                                        gmodel.code_stored_type));
          gview.refresh.stored_codes_view();
        },

        sync_code_preview : function(code){
          gmodel.syncCode(code);
          gview.refresh.code_preview(code);
        },

        commit_code : function(code){
          gmodel.setCode(code);
        },
    };
  return controller;
}


// --------------------- Interface INIT ------------------------------
