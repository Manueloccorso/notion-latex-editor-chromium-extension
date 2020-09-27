
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
      /**
       * syncWithStorage - load the codes from the StorageManager into the array
       */
      syncWithStorage : function(){
        if(store){
          for(loaded_code of gstorage.getAll()){
            this.codes[loaded_code.id] = loaded_code;
          }
        }
      },

      /**
       * get - get a code by id
       *
       * @param  {String} id
       * @returns {Code}
       */
      get : function(id){
        return this.codes[id];
      },

      /**
       * getAll - get all codes in the array as an array
       *
       * @returns {Array of Code}
       */
      getAll : function() {
        this.syncWithStorage();
        let cc = [];
        for(code_id in this.codes){
          cc.push(this.codes[code_id]);
        }
        return cc;
      },

      getAllByFilter : function(filter){
        let cc = [];
        for(code_id in this.codes){
          let code = this.codes[code_id];
          if(code.tag.indexOf(filter.tag) >= 0){
            if(code.name.indexOf(filter.name) >= 0){
              cc.push(code);
            }
          }else{
            if (filter == "All") cc.push(code);
          }
        }
        return cc;
      },

      /**
       * push - add a new code to the array
       *
       * @returns {boolean}  true if the code can be added, false if not.
       */
      push : function(code) {
        if(!this.codes[code.id]){
          this.codes[code.id] = code;
          if(this.store) gstorage.save(code);
          return true;
        }
        return false;
      },

      /**
       * set - update the values of a code in the array.
       *
       * @returns {boolean} true if the code could be updated, false if not.
       */
      set : function(code){
        if(this.codes[code.id]){
          this.codes[code.id] = code;
          if(store) gstorage.save(code);
          return true;
        }
        else return false;
      },

      /**
       * setWithoutCommit - update a code in the array but force the update to not be stored.
       *
       * @param  {type} code the code to update
       * @returns {type} true if the code could be updated, false if not.
       */
      setWithoutCommit : function(code){
        if(this.codes[code.id]){
          this.codes[code.id] = code;
          return true;
        }
        else return false;
      },

      /**
       * remove - remove a code from the array by id.
       *
       * @param  {String} id the id of the code to remove.
       * @returns {type} true if the code could be removed, false if not.
       */
      remove : function(id){
        if(this.codes[id]){
          if(this.store) gstorage.remove(this.codes[id]);
          delete this.codes[id];
          return true;
        }
        return false;
      },

  }
};
