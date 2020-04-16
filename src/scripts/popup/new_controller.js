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
          //global_controller.init_addMessageListeners();
          global_controller.init_addListenersToStaticButtons();
        },
      // --------------------- COMMUNICATION with the Browser ----------------------------

        //----- send a request for the codes in the content
        requestCodesToContent : function (){
          let msg = {
            type : CODES_FROM_PAGE_REQUEST
          };
          let myself = this;
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {
              myself.onCodesReceivedFromContent(response)
            });
          });
        },

        //---- when the codes from the content are received -------------
        onCodesReceivedFromContent : function(response){
          if(response.type === CODES_FROM_PAGE_ANSWER){
            let page_codes = response.codes;
            for(let i = 0; i < page_codes.length; i++){
              code_id_text= page_codes[i];
              let code = global_model.newCode(code_id_text.id, code_id_text.code, "Formula #" + i , global_model.code_page_type);
              global_controller.addPageCode(code);
            }
            global_view.refreshPageCodesView();
          }
        },

        init_addMessageListeners : function(){

        },

      //------------------------- LOGIC DEFINITION -------------------------------------
        // ----------------------- MODEL AND VIEW CONTROL ------------------------------------
          addPageCode : function(code){
            global_model.addCode(code);
            global_view.refreshPageCodesView();
          },

          addQuickCode : function () {
            global_model.addCode(global_model.newCode(global_model.getNewId(), "\\text{Quick Code!}",
                                              "Quick Code Title : Edit or not", global_model.code_quick_type)
                      );
            global_view.refreshQuickCodesView();
          },

          addStoredCode : function(code) {
            global_model.addCode(global_model.newCode(global_model.getNewId(), code.code, "Stored " + code.title, global_model.code_stored_type));
            global_view.refreshStoredCodesView();
          },

          syncCodePreview : function(code){
            global_model.syncCode(code);
            global_view.refreshCodePreview(code);
          },

          commitCode : function(code){
            global_model.setCode(code);
            global_view.refreshCodePreview(code);
          },

        //------------------------ ADD BUTTON LOGIC ------------------------------------

          // -------------------------- STATIC BUTTONS ------------------------------
            init_addListenersToStaticButtons : function (){
              // TODO: UPDATE!
              let myself = this;
              window.addEventListener(
                'load',
                function load(event){
                    //---- Trigger Retrive codes from page
                    let updateBtn = document.getElementById('btn_retrieve_codes');
                    updateBtn.addEventListener(
                              'click',
                              function() {
                                global_controller.send_request_for_codes(); }
                              );

                    // ---- Add the KCode textarea and Preview (empty)
                    let addBtn = document.getElementById('btn_add_code');
                    addBtn.addEventListener(
                              'click',
                              function() {
                                  myself.addQuickCode();
                                  global_view.scrollToQuickBlocks();
                                }
                              );
                }
              );
            },

          // ------------------------DYNAMIC BUTTONS -----------------
            addListenersToCodeTextArea : function (code_textarea){
              // REFRESH the PREVIEW
              let myself = this;
              code_textarea.addEventListener(
                        'keyup',
                        (event) => {
                          let id = global_view.cleanId(code_textarea.id);
                          let cleaned_code = auto_de_formatting(text_area.value);
                          let old_code = global_model.getCode(id);
                          myself.syncCodePreview(global_model.newCode(id,cleaned_code, old_code.name, old_code.type));
                        }
                    );
              // COMMIT CHANGES
              code_textarea.addEventListener(
                        'change',
                        (event) => {
                          code_textarea.select();
                          document.execCommand('copy');
                          window.getSelection().removeAllRanges();

                          let id = global_view.cleanId(code_textarea.id);
                          // TODO: refactor FORMATTING as object
                          let cleaned_code = auto_de_formatting(text_area.value);
                          let old_code = global_model.getCode(id);

                          myself.commitCode(global_model.newCode(id,cleaned_code, old_code.name, old_code.type));
                        }
              );
              // KEY CAPTURING :
              //                tabs managing,
              //                TODO: custom katex codes
              code_textarea.addEventListener(
                'keydown',
                (event) => {
                  // TODO: REFACTOR TAB MANAGING
                  tabs_in_textarea(text_area, event);
                }
              );
            },

            // TODO: delete
            addListenersToDeleteBtn : function(btn){
              btn.addEventListener(
                'click',
                function()  {
                  let code = global_model.getCode(global_view.cleanId(btn.id));
                  global_model.remove(code);
                  // TODO: Maybe create a method which refreshes based on type of code in the view
                  global_view.refreshView();
                }
              );
            },

            addListenersToSaveBtn : function (btn){
              btn.addEventListener(
                'click',
                function()  {
                  let code = global_model.getCode(global_view.cleanId(btn.id));
                  myself.addStoredCode(code);
                  global_view.scrollToStoredBlocks();
                }
              );

            },

            addListenersToScrollTopBtn : function (btn){
              btn.addEventListener(
                'click',
                function()  {
                  global_view.refreshView();
                  global_view.scrollToTop();
                }
              );
            },



      //------------------ MESSAGES LOGIC

    };

    return controller;
}


// --------------------- Interface INIT ------------------------------

var global_controller = Controller();
var global_storage = StorageManager();
var global_view = View();
var global_model = Model();


global_storage.load();
global_model.init();
global_view.init();
global_controller.init();

global_controller.requestCodesToContent();
