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
        content : content_page,


        // TODO: VARIABLE IN WHICH TO LOAD THE MESSAGES FROM A json FILE (to sync with content and background)



      // --------------------- INIT ----------------------------------------
        init : function(){
          //INIT THE CONTROLLER
          //gcontroller.init_addMessageListeners();
          gcontroller.init_addListenersToStaticButtons();
        },
      // --------------------- COMMUNICATION with the Browser ----------------------------

        //----- send a request for the codes in the content
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

        //---- when the codes from the content are received -------------
        onCodesReceivedFromContent : function(response){
          if(response.type === CODES_FROM_PAGE_ANSWER){
            let page_codes = response.codes;
            for(let i = 0; i < page_codes.length; i++){
              code_id_text= page_codes[i];
              let code = gmodel.newCode(code_id_text.id, code_id_text.code, "Formula #" + i , gmodel.code_page_type);
              gcontroller.addPageCode(code);
            }
            gview.refreshPageCodesView();
          }
        },

        init_addMessageListeners : function(){

        },

      //------------------------- LOGIC DEFINITION -------------------------------------
        // ----------------------- MODEL AND VIEW CONTROL ------------------------------------
          addPageCode : function(code){
            gmodel.addCode(code);
            gview.refreshPageCodesView();
          },

          addQuickCode : function () {
            gmodel.addCode(gmodel.newCode(
                                            gmodel.getNewId(),
                                            "\\text{Quick Code!}",
                                            "Quick Code Title : Edit or not", gmodel.code_quick_type)
                      );
            gview.refreshQuickCodesView();
          },

          addStoredCode : function(code) {
            gmodel.addCode(gmodel.newCode(gmodel.getNewId(), code.code, "Stored " + code.name, gmodel.code_stored_type));
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
            init_addListenersToStaticButtons : function (){
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
                                                                              gmodel.getNewId(), "\\text{New Stored Code!}",
                                                                              "Stored Code Title : better edit!", gmodel.code_stored_type)
                                                              );
                                }
                              );
                }
              );
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

                          gcontroller.commitCode(gmodel.newCode(id, old_code.code, name, old_code.type));
                        }
              );
            },

            addListenersToCodeMirrorTextArea : function(code_mirror){
              //INTERCEPT CODES names
              code_mirror.on(
                              'beforeChange',
                              (event, changeObj) => {
                                // ON SPACEC DETECTED
                                if (changeObj.origin == "+input" && changeObj.text == " "){


                                  let token = code_mirror.getTokenAt(changeObj.from);
                                  let replaced = gmodel.replaceStoredCodeNames(token.string);

                                  // WHEN A CODE NAME IS DETECTED
                                  if(replaced !== token.string){
                                    //DETELE THE CODE NAME
                                    changeObj.from.ch = token.start;
                                    changeObj.to.ch = token.end;
                                    changeObj.text = [""];

                                    //INSERT THE CODE TO BE REPLACED
                                    let tokens_from_code = replaced.split("\n");
                                    code_mirror.execCommand("newlineAndIndent");
                                    code_mirror.execCommand("goLineStart");
                                    for(let i = 0; i < tokens_from_code.length; i++){
                                      let pos = code_mirror.getCursor();
                                      code_mirror.replaceRange(tokens_from_code[i], {line : pos.line , ch : pos.ch});
                                      code_mirror.execCommand("newlineAndIndent");
                                      code_mirror.execCommand("goLineStart");
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
                          gcontroller.syncCodePreview(gmodel.newCode(old_code.id , new_code, old_code.name, old_code.type));
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
                          code_mirror.save();
                          textarea.select();
                          document.execCommand('copy');
                          window.getSelection().removeAllRanges();

                          //COMMIT THE CHANGES TO THE MODEL
                          gcontroller.commitCode(gmodel.newCode(id,cleaned_code, old_code.name, old_code.type));
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


            addListenersToAddBtn : function(){
              // TODO:
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



      //------------------ MESSAGES LOGIC

    };

    return controller;
}


// --------------------- Interface INIT ------------------------------
