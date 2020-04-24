
/**
 * AdvancedArray - Represents an Array in which to push codes, can be sync with a {@link Storage | storage}.
 *
 * @constructor
 * @param  {type} store description
 * @returns {type}       description
 */
function AdvancedArray(store){
  return {
      codes : {},

      store : store,

      //TESTED
      syncWithStorage : function(){
        if(store){
          for(loaded_code of global_storage.getAll()){
            this.codes[loaded_code.id] = loaded_code;
          }
        }
      },

      //TESTED
      get : function(id){
        return this.codes[id];
      },

      //TESTED
      getAll : function() {
        this.syncWithStorage();
        let cc = [];
        for(code_id in this.codes){
          cc.push(this.codes[code_id]);
        }
        return cc;
      },

      //TESTED
      push : function(code) {
        if(!this.codes[code.id]){
          this.codes[code.id] = code;
          if(this.store) global_storage.save(code);
          return true;
        }
        return false;
      },
      //TESTED
      set : function(code){
        if(this.codes[code.id]){
          this.codes[code.id] = code;
          if(store) global_storage.save(code);
          return true;
        }
        else return false;
      },

      setWithoutCommit : function(code){
        if(this.codes[code.id]){
          this.codes[code.id] = code;
          return true;
        }
        else return false;
      },

      //TESTED
      remove : function(id){
        if(this.codes[id]){
          if(this.store) global_storage.remove(this.codes[id]);
          delete this.codes[id];
          return true;
        }
        return false;
      }
  }
};
