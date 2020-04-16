// act as advanced arrays :
  // get(id) : get code = { id , code, name, type }  with that id
  // getAll() : return codes = [{c1},{c2}, ...] with all the codes
  // push(code) : add code to the model and in case add it to storage
  // set(code_to_set): change the value of the code with the same id and in case update storage
  // remove(code_to_remove) : remove the code and in case delete it from storage
function create_advanced_array(store, storage){
  return {
      codes : {},

      store : store,
      storage : storage,
      //TESTED
      syncWithStorage : function(){
        if(store){
          for(loaded_code of storage.load())
            this.codes[loaded_code.id] = loaded_code;
        }
      },

      //TESTED
      get : function(id){
        return this.codes[id];
      },

      //TESTED
      getAll : function() {
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
          if(this.store) this.storage.add(code);
          return true;
        }
        return false;
      },
      //TESTED
      set : function(code){
        if(this.codes[code.id]){
          this.codes[code.id] = code;
          if(store) this.storage.edit(code);
        }
        else return false;
      },
      //TESTED
      remove : function(id){
        if(this.codes[id]){
          if(this.store) this.storage.delete(this.codes[id]);
          delete this.codes[id];
          return true;
        }
        return false;
      }
  }
};



function Model(store, storage) {

  let m = {

    prefix : "Model : ",

    log_obj : function(obj){
      console.log(this.prefix, JSON.stringify(obj, function replacer(key, value) { return value}));
    },

    // view to notify on changev
    view: {},

    // type of codes
    type_page: "type_page",
    type_quick: "type_quick",
    type_stored: "type_stored",

    // create a new code structure
    newCode : function(id, code, name, type){
      return {
        id : id,
        code : code,
        name : name,
        type : type
      }
    },

    //dict of advanced arrays of codes by type
    codes : {
      "type_page" : {},
      "type_quick": {},
      "type_stored": {},
    },



    //TESTED
    getCodesByType_internal : function(type){
      //console.log( this.prefix , "Getting Codes by Type");
      //console.log( this.prefix , type, "   -    ", this.codes[type]);
      if(type !== null && this.codes[type] !== this.codes["NOT_A_TYPE"]){
        //console.log( this.prefix , " Returning retrived codes" );
        return this.codes[type];
      }
      return false;
    },


    // get the codes of a given type
    //TESTED
    getCodesByType: function(type) {
      let codes = this.getCodesByType_internal(type);
      if(codes == false) return false;
      return codes.getAll();
    },



    //get code by id from all types
    getCode : function(id){
      for(let type in this.codes) {
        let found_code = this.getCodesByType_internal(type).get(id);
        if(found_code) return found_code;
      }
      return null;
    },

    // add a code : TESTED
    addCode : function(code){
      //console.log( this.prefix , "adding code ");
      //this.log_obj( code );
      let codes = this.getCodesByType_internal(code.type);
      //console.log( this.prefix , " FOUND: ");
      //this.log_obj(codes);
      if (codes !== false) {
        codes.push(code);
        let codes_changed = this.getCodesByType(code.type);
        //console.log( this.prefix , "Added code : ");
        //this.log_obj(codes);
        return true;
      }
      return false;
    },
    //set a code: TESTED
    setCode : function(code){
      let codes = this.getCodesByType_internal(code.type);
      if (codes !== false) {
        codes.set(code);
        return true;
      }
      return false;
    },
    //remove a codes: TESTED
    delCode : function(code){
      let codes = this.getCodesByType_internal(code.type);
      if (codes !== false) {
        codes.remove(code.id);
        return true;
      }
      return false;
    },
    
    actOnCodesWithCodes : function(codes, action){
      if(codes !== null){
        for(code of codes){
          action(code);
        }
      }
    },

    // add a list of codes
    addCodes: function(codes){
      this.actOnCodesWithCodes(codes,this.addCode);
    } ,
    // set a list of codes
    setCodes: function(codes){
      this.actOnCodesWithCodes(codes, this.setCode)
    },
    //remove a list of codes
    delCodes : function(codes_to_del){
      this.actOnCodesWithCodes(codes, this.delCode);
    }

  };

  m.codes[m.type_page] = create_advanced_array(false, null);
  m.codes[m.type_quick] = create_advanced_array(false, null);
  m.codes[m.type_stored] = create_advanced_array(store, storage);
  m.codes[m.type_stored].syncWithStorage();
  return m;
}
