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
              gview.refreshPageCodesView();
            }
          }
        },

      //------------------------- LOGIC DEFINITION -------------------------------------
        // ----------------------- MODEL AND VIEW CONTROL ------------------------------------

          addPageCode : function(code){
            gmodel.addCode(code);
            gview.refreshPageCodesView();
          },

          addQuickCode : function (code) {
            gmodel.addCode(gmodel.newCode(
                                            gmodel.newCodeId(),
                                            "\\text{Quick Code!}",
                                            "Quick Code Title : Edit or not",
                                            "Quick",
                                            gmodel.code_quick_type)
                      );
            gview.refreshQuickCodesView();
          },

          addStoredCode : function(code) {
            gmodel.addCode(gmodel.newCode(
                                          gmodel.newCodeId(),
                                          code.code,
                                          "Stored " + code.name,
                                          code.tag,
                                          gmodel.code_stored_type));
            gview.refreshStoredCodesView();
          },

          syncCodePreview : function(code){
            gmodel.syncCode(code);
            gview.refreshCodePreview(code);
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
                      gview.getPageCodesSyncBtn().addEventListener(
                                'click',
                                function() {
                                  gcontroller.requestCodesToContent(); }
                                );
                    }
                    // Quick Codes
                    //----- Add a Quick Code
                    gview.getQuickCodesAddBtn().addEventListener(
                              'click',
                              function() {
                                  gcontroller.addQuickCode();
                                }
                              );
                  // Stored Codes
                    //------ Sync with Stored Codes
                    gview.getStoredCodesSyncBtn().addEventListener(
                              'click',
                              function() {
                                  gview.refreshStoredCodesView();
                                }
                              );
                    //------ Add a new Stored Code
                    gview.getStoredCodesAddBtn().addEventListener(
                              'click',
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
                    let filter_select = gview.getStoredCodesFilterSelect();
                    filter_select.addEventListener(
                      'focus',
                      function(){
                        gcontroller.init_filters();
                      }
                    );
                    filter_select.addEventListener(
                      'change',
                      function(){
                        let filter = filter_select.options[filter_select.selectedIndex].value;
                        gmodel.addTagFilter(filter);
                        gview.refreshStoredCodesView();
                      }
                    );
                    let search_textarea = gview.getStoredCodesSearchTextarea();
                    search_textarea.addEventListener(
                      'keyup',
                      function(event){
                        search_textarea.value = search_textarea.value.replace(/\r\n|\r|\n/g,"");
                        let search = search_textarea.value;
                        if(search == "") gmodel.removeNameFilter();
                        else gmodel.addNameFilter(search_textarea.value);
                        gview.refreshStoredCodesView();
                      }
                    );
                }
              );
            },

            init_filters : function(){
              let filter_select = gview.getStoredCodesFilterSelect();
              filter_select.innerHTML = "";
              gcontroller.addOptionStrToSelectElement(filter_select, "", "All");
              let filters = gmodel.getAllTags();
              for(tag in filters){
                gcontroller.addOptionStrToSelectElement(filter_select, filters[tag],filters[tag] );
              }
            },

            /**
              Adds an option to a select(HTML) element.
              @param {HTMLElement} select_element The select eletement.
              @param {string} option_str The text of the option.
              @param {Object} [option_attr] The options to be copied into the option element created.
              @returns {HTMLElement} The option element created.
            */
            addOptionStrToSelectElement : function (select_element, value, label){
                let opt = gview.createOption();
                opt.text = label;
                opt.value = value;
                select_element.add(opt);
                return opt;
            },

          // ------------------------DYNAMIC BUTTONS -----------------
            addListenersToCodeNameTextArea : function (codename_textarea){
              // COMMIT CHANGES
              codename_textarea.addEventListener(
                        'change',
                        (event) => {
                          console.log("Title changed!");
                          let id = gview.cleanId(codename_textarea.id);
                          // TODO: refactor FORMATTING as object
                          let name = codename_textarea.value;
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

              codetag_textarea.addEventListener(
                        'change',
                        (event) => {
                          console.log("Title changed!");
                          let id = gview.cleanId(codetag_textarea.id);
                          // TODO: refactor FORMATTING as object
                          let tag = codetag_textarea.value;
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
                              'change',
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
                        'change',
                        (event, changeObj) => {
                          let textarea = code_mirror.getTextArea();
                          let old_code = gmodel.getCode(
                                                          gview.cleanId( textarea.id )
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
              code_mirror.on(
                        'blur',
                        (event) => {
                          let textarea = code_mirror.getTextArea();
                          let id = gview.cleanId(textarea.id);
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
              $(code_textarea.id).asuggest(suggests, {
                  'endingSymbols': ', ',
                  'minChunkSize': 3,
                  'delimiters': ':',
                  'stopSuggestionKeys': [$.asuggestKeys.RETURN]
              });
            },

            /**
             * addListenersToAddBtn -
             *  @todo  implement
             */
            addListenersToAddBtn : function(){
            },

            addListenersToDeleteBtn : function(btn){
              btn.addEventListener(
                'click',
                function()  {
                  let code = gmodel.getCode(gview.cleanId(btn.id));
                  gmodel.delCode(code);
                  gview.refreshViewByCode(code);
                }
              );
            },

            addListenersToSaveBtn : function (btn){
              btn.addEventListener(
                'click',
                function()  {
                  let code = gmodel.getCode(gview.cleanId(btn.id));
                  gcontroller.addStoredCode(code);
                  gview.scrollToStoredBlocks();
                }
              );
            },

            addListenersToSyncBtn : function(btn){
              // TODO:
            },

            addListenersToScrollTopBtn : function (btn){
              btn.addEventListener(
                'click',
                function()  {
                  gview.refreshView();
                  gview.scrollToTop();
                }
              );
            },

    };

    return controller;
}


// --------------------- Interface INIT ------------------------------
