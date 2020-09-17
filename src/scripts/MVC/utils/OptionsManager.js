


function OptionsManager(){

  let om = {
    encoded_saved_options_id : "encoded_saved_options_id",
    synced : false,
    options : {
      theme: "",
      mode: "",
    },

    load : function(){
      let loaded_result = "";
      myself = this;
      chrome.storage.local.get(
            [this.encoded_saved_options_id],
            function(result) {
                  if(result.encoded_saved_options_id){
                    goptions.options =
                        result.encoded_saved_options_id;
                    goptions.synced = true;
                    

                  }
                  else {
                    goptions.options = {
                      theme: "dark",
                      mode: "",
                    }
                  }
                  goptions.synced = true;
              }
            );
    },

    encode : function(options){
        return {
                encoded_saved_options_id : this.options
                }

    },


    get : function(){
      return this.options;
    },

    internal_storeInChrome : function(){
      let encoded_options = this.encode();
      let myself = this;
      chrome.storage.local.set(
                                encoded_options,
                                function() {
                                  myself.synced = true;
                                }
                               );
    },

    set : function(opts){
      this.synced = false;
      for(let opt in opts){
        this.options[opt] = opts[opt];
      }
      this.internal_storeInChrome();
    }

  }
  om.load();
  return om;
}
