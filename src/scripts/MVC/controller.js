console.log("NM.Controller : Running");

//MESSAGES
//Request the math codes from the content
var CODES_FROM_PAGE_REQUEST = "find_maths";
//Request to store the codes in background
var CODES_FROM_PAGE_ANSWER = "store_codes";


function Controller(content_page = true){
  console.log("NM.Controller : Created");
  let controller = {
      // --------------------- VARS ----------------------------------------
        /**
         * @todo : add variables in which to load the REQUEST identifiers via json file
         */

        /**
         * Identifies if there's a content page with which to communicate
         */
        content : content_page,

      // --------------------- INIT ----------------------------------------
        /**
         * init - initialize the controller, to be called after
         *          a gview and a gmodel are created
         *
         */
        init : function(){
          gcontroller.init_addListenersToStaticElements();
        },

      // --------------------- COMMUNICATION with the Browser ----------------------------

        /**
         * requestCodesToContent - send a request for the codes to the content.js
         *
         * @returns {type}  description
         */
        requestCodesToContent : function (){
          let msg = {
            type : CODES_FROM_PAGE_REQUEST
          };
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {
              gcontroller.onCodesReceivedFromContent(response)
            });
          });
        },

        /**
         * onCodesReceivedFromContent -
         *        manage the reply from the content.js with the codes
         *          by updating the model with the received code AND
         *          refreshing the page codes section in the view.
         *
         * @param  {type, codes} response
         */
        onCodesReceivedFromContent : function(response){
          if(response){
            if(response.type === CODES_FROM_PAGE_ANSWER){
              let page_codes = response.codes;
              for(let i = 0; i < page_codes.length; i++){
                code_id_text= page_codes[i];
                let code = gmodel.newCode(  code_id_text.id,
                                            code_id_text.code,
                                            "Formula #" + i ,
                                            "page",
                                            gmodel.code_page_type);
                gcontroller.addPageCode(code);
              }
              gview.refresh.page_codes_view();
            }
          }
        },

      //------------------------- LOGIC DEFINITION -------------------------------------
        // ----------------------- MODEL AND VIEW CONTROL ------------------------------------

          addPageCode : function(code){
            gmodel.addCode(code);
            gview.refresh.page_codes_view();
          },

          addQuickCode : function (code) {
            gmodel.addCode(gmodel.newCode(
                                            gmodel.newCodeId(),
                                            "\\text{Quick Code!}",
                                            "Quick Code Title : Edit or not",
                                            "Quick",
                                            gmodel.code_quick_type)
                      );
            gview.refresh.quick_codes_view();
          },

          addStoredCode : function(code) {
            console.log(code);
            gmodel.addCode(gmodel.newCode(
                                          gmodel.newCodeId(),
                                          code.code,
                                          "Stored " + code.name,
                                          code.tag,
                                          gmodel.code_stored_type));
            gview.refresh.stored_codes_view();
          },

          syncCodePreview : function(code){
            gmodel.syncCode(code);
            gview.refresh.code_preview(code);
          },

          commitCode : function(code){
            gmodel.setCode(code);
          },

        //------------------------ ADD BUTTON LOGIC ------------------------------------

          // -------------------------- STATIC BUTTONS ------------------------------
            init_addListenersToStaticElements : function (){
              window.addEventListener(
                'load',
                function load(event){
                  // Page Codes
                    //---- Retrieve Codes From Notion Page
                    if(gcontroller.content === true){
                      gview.getElement.page_codes_container.sync_btn().click(
                                function() {
                                  gcontroller.requestCodesToContent(); }
                                );
                    }
                    // Quick Codes
                    //----- Add a Quick Code
                    gview.getElement.quick_codes_container.add_btn().click(
                              function() {
                                  gcontroller.addQuickCode();
                                }
                              );
                  // Stored Codes
                    //------ Sync with Stored Codes
                    gview.getElement.stored_codes_container.sync_btn().click(
                              function() {
                                  gview.refresh.stored_codes_view();
                                }
                              );
                    //------ Add a new Stored Code
                    gview.getElement.stored_codes_container.add_btn().click(
                              function() {
                                    gcontroller.addStoredCode(gmodel.newCode(
                                                                              gmodel.newCodeId(),
                                                                              "\\text{New Stored Code!}",
                                                                              "Stored Code Title : better edit!",
                                                                              gmodel.getTagFilter(),
                                                                              gmodel.code_stored_type)
                                                              );
                                }
                              );
                    //------ Filtering and searching
                    gcontroller.init_filters();
                    let filter_select = gview.getElement.stored_codes_container.filter_select();
                    filter_select.focus(
                      function(){
                        gcontroller.init_filters();
                      }
                    );
                    filter_select.change(
                      function(){
                        let filter = filter_select.get(0).options[filter_select.selectedIndex].value;
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
                }
              );
            },

            init_filters : function(){
                gview.refresh.stored_codes_tags(gmodel.getAllTags() );
            },



          // ------------------------DYNAMIC BUTTONS -----------------

              addListenersToCodeNameTextArea : function (codename_textarea){
                // COMMIT CHANGES
                codename_textarea.change(
                          (event) => {
                            console.log("Title changed!");
                            let id = gview.manageId.clean(codename_textarea.attr("id"));
                            // TODO: refactor FORMATTING as object
                            let name = codename_textarea.get(0).value;
                            let old_code = gmodel.getCode(id);

                            gcontroller.commitCode(gmodel.newCode(
                                                                  id,
                                                                  old_code.code,
                                                                  name,
                                                                  old_code.tag,
                                                                  old_code.type));
                          }
                );
              },

              addListenersToCodeTagTextArea : function(codetag_textarea){

                codetag_textarea.change(
                          (event) => {
                            console.log("Title changed!");
                            let id = gview.manageId.clean(codetag_textarea.attr("id"));
                            // TODO: refactor FORMATTING as object
                            let tag = codetag_textarea.get(0).value;
                            let old_code = gmodel.getCode(id);
                            gcontroller.commitCode(gmodel.newCode(
                                                                  id,
                                                                  old_code.code,
                                                                  old_code.name,
                                                                  tag,
                                                                  old_code.type));
                          }
                );


              },

              addListenersToCodeMirrorTextArea : function(code_mirror){
                //INTERCEPT CODES names
                code_mirror.on(
                    (event, changeObj) => {
                      // ON SPACEC DETECTED
                      if (changeObj.origin == "+input" && changeObj.text == " "){


                        let pos = code_mirror.getCursor();
                        let starting_pos = pos;
                        let token = code_mirror.getTokenAt(changeObj.from);
                        let replaced = gmodel.replaceStoredCodeNameWithCode(token.string);

                        // WHEN A CODE NAME IS DETECTED
                        if(replaced !== token.string){

                          // Remove the code name
                          code_mirror.replaceRange("",
                          {line : starting_pos.line , ch : token.start },
                          {line : starting_pos.line , ch : starting_pos.ch});

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
                  (event, changeObj) => {
                    let textarea = code_mirror.getTextArea();
                    let old_code = gmodel.getCode(
                                                    gview.manageId.clean( textarea.attr("id") )
                                                  );
                    let new_code = auto_clean_code(code_mirror.getValue());
                    gcontroller.syncCodePreview(gmodel.newCode(
                                                                old_code.id,
                                                                new_code,
                                                                old_code.name,
                                                                old_code.tag,
                                                                old_code.type));
                  }
              );
                // COMMIT CHANGES
                code_mirror.blur(
                  (event) => {
                    let textarea = code_mirror.getTextArea();
                    let id = gview.manageId.clean(textarea.attr("id"));
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
                    gcontroller.commitCode(gmodel.newCode(
                                                              id,
                                                              cleaned_code,
                                                              old_code.name,
                                                              old_code.tag,
                                                              old_code.type));
                  }
                );

                // TODO : translate stored code names into actual codes on key keydown

                //TODO : autocomplete
                //gcontroller.addAutocompleteToTextArea(code_textarea);
              },

              addAutocompleteToTextArea : function(){
                var suggests = ["head", "hello", "heart", "health"];
                $(code_textarea.attr("id")).asuggest(suggests, {
                    'endingSymbols': ', ',
                    'minChunkSize': 3,
                    'delimiters': ':',
                    'stopSuggestionKeys': [$.asuggestKeys.RETURN]
                });
              },


            /**
             *  Manage Buttons logic
             */
            manageCodeBlock : {
              types : {
                btn_scrollTop : "scrollTop",
                btn_sync      : "sync",
                btn_save      : "save",
                btn_delete    : "delete",
                btn_add       : "add"
              },
              setBtn : function(btn, type){
                switch (type) {
                  case this.types.btn_scrollTop:
                    btn.click(
                      function()  {
                        gview.refresh.view();
                        gview.interact.scroll_to_top();
                      }
                    );
                    break;
                  case this.types.btn_sync:
                    break;
                  case this.types.btn_save:
                    btn.click(
                      function()  {
                        let code = gmodel.getCode(gview.manageId.clean(btn.attr("id")));
                        gcontroller.addStoredCode(code);
                        gview.interact.scroll_to_stored_codes();
                      }
                    );
                    break;
                  case this.types.btn_delete:
                    btn.click(
                      function()  {
                        let dirty_id = btn.attr("id");
                        let id = gview.manageId.clean(dirty_id);
                        let code = gmodel.getCode(id);
                        gmodel.delCode(code);
                        gview.refresh.view_by_code(code);
                      }
                    );
                    break;
                  case this.types.btn_add:
                    break;
                  default:
                }
              },
            }

    };



    return controller;
}


// --------------------- Interface INIT ------------------------------
