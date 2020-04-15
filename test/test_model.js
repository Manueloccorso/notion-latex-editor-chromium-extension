//TEST STORAGE
let storage_simulator = {
  prefix : "",
  add : function(code){ console.log(prefix, "Storage : added"); return true;},
  edit : function(code){console.log(prefix, "Storage : edited"); return true;},
  delete : function(code) {console.log(prefix, "Storage : deleted"); return true; },

  load : function(){
    console.log(prefix, " Storage : loading");
    loaded_codes = [
      { id : "id_prova", code : "code", name : "name", type : "type_page"},
      { id : "id_prova1", code : "code", name : "name", type : "type_quick"},
      { id : "id_prova2", code : "code", name : "name", type : "type_stored"},
    ];
    console.log(loaded_codes);
    return loaded_codes;
  }
};

/*
  advanced_array definition:
  {
      codes : {},

      store : store,
      storage : storage,
      syncWithStorage : function(){     },

      get : function(id){ },

      getAll : function() {},

      push : function(code) {},
      set : function(code_to_set){},
      remove : function(code_to_del){}
  }
*/

function test_advanced_array(array, m){
    array.push(m.newCode("id1","code1", "name1", m.type_page) );
      console.log(prefix,"added a code : ");
        log_obj(prefix,array);
      console.log(prefix,"retrived only the code : ");
        log_obj(prefix,array.get("id1"))

    array.push(m.newCode("id2","code2", "name2", m.type_page) );
      console.log(prefix,"added a code: ");
        log_obj(prefix,array);
      console.log(prefix,"retrived only the code : ");
        log_obj(prefix,array.get("id2"));

      console.log(prefix,"retrived all codes : ");
        log_obj(prefix,array.getAll());

    array.set(m.newCode("id2","code2_changed", "name2_changed", m.type_quick));
      console.log(prefix,"retrived all codes after change: " );
        log_obj(prefix,array.getAll());
      console.log(prefix,"retrived only the code after change: ");
        log_obj(prefix,array.get("id2"));

    array.remove("id2" );
    console.log(prefix,"retrived all codes after delete: ");
      log_obj(prefix,array.getAll());
    console.log(prefix,"retrived only the code after delete: ");
      log_obj(prefix,array.get("id2"));
}



function log_obj(prefix, obj){
  console.log(prefix, JSON.stringify(obj, function replacer(key, value) { return value}));
}


let prefix = "";
let m = Model(null, null);


// --------------- TEST ADVANCED arrays

  // -------------------Without Storage
  prefix = " Test.AdvancedArray : ";
  storage_simulator.prefix = prefix;

  console.log(prefix);
  console.log(prefix, "TESTING WITHOUT STORAGE");
  console.log(prefix);
  let array = AdvancedArray(false, null );
    console.log(prefix,"new array : ");
      log_obj(prefix,array);

  test_advanced_array(array, m);

  // ------------------------- WITH STORAGE
  prefix = " Test.AdvancedArray_withStorage : ";
  storage_simulator.prefix = prefix;

  console.log(prefix);
  console.log(prefix,"TESTING WITH STORAGE");
  console.log(prefix);
  console.log(storage_simulator);
  console.log(prefix);

  array = AdvancedArray(true, storage_simulator );
    console.log(prefix,"NEW ARRAY : ");
      log_obj(prefix,array);

  array.syncWithStorage();
    console.log(prefix,"LOADED CODES : ");
      log_obj(prefix,array);
      log_obj(prefix,array.getAll());

  test_advanced_array(array, m);

// ---------------- MODEL
  prefix = "Test.Model : ";
  storage_simulator.prefix = prefix;
  m = Model(true, storage_simulator );

  console.log( prefix , "Starting codes" );
    let obj_log = m.getCodesByType(m.type_page);
      log_obj( prefix , obj_log );
    obj_log = m.getCodesByType(m.type_quick);
      log_obj( prefix , obj_log );
    obj_log = m.getCodesByType(m.type_stored);
      log_obj( prefix , obj_log );

  console.log( prefix , "Add some page codes" );
    m.addCode(m.newCode("id1", "code1", "name1", m.type_page) );
      obj_log = m.getCodesByType(m.type_page);
      log_obj( prefix , obj_log);
    m.addCode(m.newCode("id2", "code2", "name2", m.type_page) );
      obj_log = m.getCodesByType(m.type_page);
      log_obj( prefix , obj_log);



  console.log( prefix , "Searching code: " );
    obj_log = m.getCode("id1");
      log_obj( prefix , obj_log);

  console.log( prefix , "Editing  code: " );
    obj_log = m.setCode(m.newCode("id1", "code1_changed", "name1_changed", m.type_page));
      log_obj( prefix , obj_log);
  console.log( prefix , "Searching code: " );
    obj_log = m.getCode("id1");
      log_obj( prefix , obj_log);

  console.log( prefix , "Removing  code: " );
    obj_log = m.delCode(m.newCode("id1", "", "", m.type_page));
      log_obj( prefix , obj_log);
  console.log( prefix , "Searching code: " );
    obj_log = m.getCode("id1");
      log_obj( prefix , obj_log);
