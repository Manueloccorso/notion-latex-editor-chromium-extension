console.log("NM.popup : Running");

//MESSAGES
//Request the math codes from the content
var CODES_FROM_PAGE_REQUEST = "find_maths";
//Request to store the codes in background
var CODES_FROM_PAGE_ANSWER = "store_codes";


function Controller(){
  let controller = {
      // --------------------- VARS ----------------------------------------

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
                                                      gmodel.getNewId(), "\\text{Quick Code!}",
                                                      "Quick Code Title : Edit or not", gmodel.code_quick_type)
                      );
            gview.refreshQuickCodesView();
          },

          addStoredCode : function(code) {
            gmodel.addCode(gmodel.newCode(gmodel.getNewId(), code.code, "Stored " + code.title, gmodel.code_stored_type));
            gview.refreshStoredCodesView();
          },

          syncCodePreview : function(code){
            gmodel.syncCode(code);
            gview.refreshCodePreview(code);
          },

          commitCode : function(code){
            gmodel.setCode(code);
            gview.refreshCodePreview(code);
          },

        //------------------------ ADD BUTTON LOGIC ------------------------------------

          // -------------------------- STATIC BUTTONS ------------------------------
            init_addListenersToStaticButtons : function (){
              window.addEventListener(
                'load',
                function load(event){
                  // Page Codes
                    //---- Retrieve Codes From Notion Page
                    gview.getPageCodesSyncBtn().addEventListener(
                              'click',
                              function() {
                                gcontroller.requestCodesToContent(); }
                              );
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
            addListenersToCodeTextArea : function (code_textarea){
              // REFRESH the PREVIEW
              code_textarea.addEventListener(
                        'keyup',
                        (event) => {
                          let id = gview.cleanId(code_textarea.id);
                          let cleaned_code = auto_clean_code(code_textarea.value);
                          let old_code = gmodel.getCode(id);
                          gcontroller.syncCodePreview(gmodel.newCode(id,cleaned_code, old_code.name, old_code.type));
                        }
                    );
              // COMMIT CHANGES
              code_textarea.addEventListener(
                        'change',
                        (event) => {
                          code_textarea.select();
                          document.execCommand('copy');
                          window.getSelection().removeAllRanges();

                          let id = gview.cleanId(code_textarea.id);
                          // TODO: refactor FORMATTING as object
                          let cleaned_code = auto_clean_code(code_textarea.value);
                          let old_code = gmodel.getCode(id);

                          gcontroller.commitCode(gmodel.newCode(id,cleaned_code, old_code.name, old_code.type));
                        }
              );
              // KEY CAPTURING :
              //                tabs managing,
              //                TODO: custom katex codes
              code_textarea.addEventListener(
                'keydown',
                (event) => {
                  // TODO: REFACTOR TAB MANAGING
                  tabs_in_textarea(code_textarea, event);
                }
              );

              // TODO : translate stored code names into actual codes on key keydown

              //TODO : autocomplete
              //gcontroller.addAutocompleteToTextArea(code_textarea);

              // TODO: beautify TextArea with mirror!
              gcontroller.beautifyTextArea(code_textarea);

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

            beautifyTextArea : function(){


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
                  gview.refreshView();
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

var gcontroller = Controller();
var global_storage = StorageManager();
var gview = View();
var gmodel = Model();

global_storage.load();
gmodel.init();
gview.init();
gcontroller.init();

gcontroller.requestCodesToContent();


function restart_popup(){
  gcontroller = Controller();
  global_storage = StorageManager();
  gview = View();
  gmodel = Model();


  global_storage.load();
  gmodel.init();
  gview.init();
  gcontroller.init();

  gcontroller.requestCodesToContent();
}
