
function StorageManager(){

  let sm = {

    encoded_saved_codes_id : "encoded_saved_codes_id",

    encode : function(){
        return {
                encoded_saved_codes_id :
                      {
                          saved_codes : this.stored_codes
                      }
                }
    },

    synced : false,

    stored_codes : [],

    load : function(){
      let loaded_result = "";
      chrome.storage.local.get(
            [this.encoded_saved_codes_id],
            function(result) {
                  if(result.encoded_saved_codes_id){
                    gstorage.stored_codes =
                        result.encoded_saved_codes_id.saved_codes;
                    console.log("LOAD STORAGE COMPLETED!");
                  }
                  gstorage.synced = true;
              }
            );
    },

    getAll : function(){
      return this.stored_codes;
    },

    internal_storeInChrome : function(){
      let encoded_codes = this.encode();
      let myself = this;
      chrome.storage.local.set(
                                encoded_codes,
                                function() {
                                  myself.synced = true;
                                }
                               );
    },

    save : function(code) {
      if (!!code.id && !!code.name && !!code.code){
          //Update the loaded list
          let found = false;
          for(let i = 0; i < this.stored_codes.length; i++){
            if(code.id == this.stored_codes[i].id){
              this.stored_codes[i] = code;
              found = true;
              this.synced = false;
            }
          }
          if(!found){
            this.stored_codes.push(code);
            this.synced = false;
          }

          this.internal_storeInChrome();
      }
      return this.stored_codes;
    },

    remove : function(code){
      for(let i =0; i < this.stored_codes.length; i++){
        let stored_code = this.stored_codes[i];
        if (stored_code === code) {
            this.stored_codes.splice(i, 1);
            this.synced = false;
            this.internal_storeInChrome();
            return true;
        }
      }
    }

  }
  sm.load();
  return sm;
}
