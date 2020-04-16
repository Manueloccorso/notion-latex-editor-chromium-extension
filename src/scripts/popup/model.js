// act as advanced arrays :
  // get(id) : get code = { id , code, name, type }  with that id
  // getAll() : return codes = [{c1},{c2}, ...] with all the codes
  // push(code) : add code to the model and in case add it to storage
  // set(code_to_set): change the value of the code with the same id and in case update storage
  // remove(code_to_remove) : remove the code and in case delete it from storage
function AdvancedArray(store){

  return {
      codes : {},

      store : store,

      //TESTED
      syncWithStorage : function(){
        if(store){
          console.log("SYNC -------");
          for(loaded_code of global_storage.getAll()){
            console.log("MODEL SYNCING : ");
            console.log(loaded_code);
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


// Manage all the data needed for code blocks store
  // get(id) : get code = { id , code, name, type }  with that id
  // getAll() : return codes = [{c1},{c2}, ...] with all the codes
  // push(code) : add code to the model and in case add it to storage
  // set(code_to_set): change the value of the code with the same id and in case update storage
  // remove(code_to_remove) : remove the code and in case delete it from storage
function Model() {

  let m = {


    prefix : "Model : ",
    log_obj : function(obj){
      console.log(global_model.prefix, JSON.stringify(obj, function replacer(key, value) { return value}));
    },

    // type of codes
    code_page_type: "code_page_type",
    code_quick_type: "code_quick_type",
    code_stored_type: "code_stored_type",

    init : function(){
      global_model.codes[global_model.code_page_type] = AdvancedArray(false);
      console.log(global_model.codes[global_model.code_page_type].store);

      global_model.codes[global_model.code_quick_type] = AdvancedArray(false);
      console.log(global_model.codes[global_model.code_quick_type].store);

      global_model.codes[global_model.code_stored_type] = AdvancedArray(true);
      console.log(global_model.codes[global_model.code_stored_type].store);

      global_model.codes[global_model.code_stored_type].syncWithStorage();
    },

    // create a new code structure
    newCode : function(id, code, name, type){
      return {
        id : id,
        code : code,
        name : name,
        type : type
      }
    },

    getNewId : function(){
      return Math.random().toString(36);
    },

    //dict of advanced arrays of codes by type
    codes : {
      "code_page_type" : {},
      "code_quick_type": {},
      "code_stored_type": {},
    },



    //TESTED
    getCodesByType_internal : function(type){
      if(type !== null && global_model.codes[type] !== global_model.codes["NOT_A_TYPE"]){
        return global_model.codes[type];
      }
      return false;
    },


    // get the codes of a given type
    //TESTED
    getCodesByType: function(type) {
      let codes = global_model.getCodesByType_internal(type);
      if(codes == false) return false;
      return codes.getAll();
    },



    //get code by id from all types
    getCode : function(id){
      for(let type in global_model.codes) {
        let found_code = global_model.getCodesByType_internal(type).get(id);
        if(found_code) return found_code;
      }
      return null;
    },

    // add a code : TESTED
    addCode : function(code){
      //console.log( global_model.prefix , "adding code ");
      //global_model.log_obj( code );
      let codes = global_model.getCodesByType_internal(code.type);
      //console.log( global_model.prefix , " FOUND: ");
      //global_model.log_obj(codes);
      if (codes !== false) {
        codes.push(code);
        let codes_changed = global_model.getCodesByType(code.type);
        //console.log( global_model.prefix , "Added code : ");
        //global_model.log_obj(codes);
        return true;
      }
      return false;
    },
    //set a code: TESTED
    setCode : function(code){
      let codes = global_model.getCodesByType_internal(code.type);
      if (codes !== false) {
        codes.set(code);
        return true;
      }
      return false;
    },
    // set a code and force not to store it yet
    syncCode : function(code){
      let codes = global_model.getCodesByType_internal(code.type);
      if (codes !== false) {
        codes.setWithoutCommit(code);
        return true;
      }
      return false;
    },


    //remove a codes: TESTED
    delCode : function(code){
      let codes = global_model.getCodesByType_internal(code.type);
      if (codes !== false) {
        codes.remove(code.id);
        return true;
      }
      return false;
    },

    actOnCodesWithCodes : function(codes, action){
      if(codes !== null){
        for(let i = 0; i < codes.length; i++){
          action(codes[i]);
        }
      }
    },

    // add a list of codes
    addCodes: function(codes){
      global_model.actOnCodesWithCodes(codes,global_model.addCode);
    } ,
    // set a list of codes
    setCodes: function(codes){
      global_model.actOnCodesWithCodes(codes, global_model.setCode)
    },
    //remove a list of codes
    delCodes : function(codes_to_del){
      global_model.actOnCodesWithCodes(codes, global_model.delCode);
    }

  };
  return m;
}
