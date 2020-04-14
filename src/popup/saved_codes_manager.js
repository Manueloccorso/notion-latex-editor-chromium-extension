var encoded_saved_codes_id = "encoded_saved_codes_id";

let key = "";

function StorageManager(){

  let sm = {

    loaded_saved_codes : [],

    load_storage : function(){
      let loaded_result = "";
      myself = this;
      chrome.storage.local.get(
            [encoded_saved_codes_id],
            function(result) {
                  if(result.encoded_saved_codes_id){
                    console.log(result);
                    console.log("LOADED FROM STORAGE: ");
                    console.log(result);
                    console.log(result.encoded_saved_codes_id);
                    console.log(result.encoded_saved_codes_id.saved_codes);
                    console.log("ASSIGNING TO INTERNAL VARIABLE");
                    myself.loaded_saved_codes = result.encoded_saved_codes_id.saved_codes;
                    console.log(myself.loaded_saved_codes);
                    console.log("CALLING REFRESH");
                    refresh_saved_codes_visualization();
                    console.log("CAME BACK FROM REFRESH");
                    console.log(myself.loaded_saved_codes);
                }
              }
            );
    },

    get_codes: function(){
      return this.loaded_saved_codes;
    },

    get_name_from_id : function(id){
      let name = "";
      for(code of this.loaded_saved_codes){
        if(code.id == id){
          name = code.name;
        }
      }
      return name;
    },



    save : function(code) {
      // TODO: Store new code to chrome

      let new_saved_codes = this.loaded_saved_codes;

      if (!!code.id && !!code.name && !!code.code){
          //Update the loaded list
          let found = false;
          for(let i = 0; i < new_saved_codes.length; i++){
            if(code.id == new_saved_codes[i].id){
              new_saved_codes[i] = code;
            }
          }
          if(!found){
            new_saved_codes.push(code);
          }
          // create the new_encoded_saved_codes
          let new_encoded_saved_codes = {
            saved_codes : new_saved_codes
          };
          //store the new list
          myself = this;
          chrome.storage.local.set(
                      {encoded_saved_codes_id : new_encoded_saved_codes},
                        function() {
                            myself.loaded_saved_codes.push(code);
                            console.log("NM.Storage : Saved Codes");
                            console.log(new_encoded_saved_codes);
                          }
                );
      }
      return new_saved_codes;
    },

    remove : function(id){
      let saved_codes = get_codes();
    }

  }

  return sm;
}
