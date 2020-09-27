function Model() {
  let m = {
    // TYPES
        types : {
          codes : {
            page: "code_page_type",
            quick: "code_quick_type",
            stored: "code_stored_type",
          }
        },
        codes : {
          code_page_type    : {},
          code_quick_type   : {},
          code_stored_type  : {},
        },
        filtering : {
          tag : "",
          name : "",
        },

        init : function() {
          gmodel.codes[gmodel.types.codes.page] = AdvancedArray(false);
          gmodel.codes[gmodel.types.codes.quick] = AdvancedArray(false);
          gmodel.codes[gmodel.types.codes.stored] = AdvancedArray(true);
          gmodel.codes[gmodel.types.codes.stored].syncWithStorage();
        },

    //----------------------------- INTERNALS -------------------------------------

      actOnCodesWithCodes_internal : function(codes, action){
        if(codes !== null){
            for(let i = 0; i < codes.length; i++){
              action(codes[i]);
            }
          }
      },

      getCodesByType_internal : function(type){
        if(type !== null )
          return gmodel.codes[type];
        return false;
      },


    //----------------------------- CREATORS -------------------------------------

      create : {
        code : function(id, code, name, tag, type){
          return {  id    : id,
                    code  : auto_clean_code(code),
                    name  : name,
                    tag   : tag,
                    type  : type   }
        },
        id : function(){
          return Math.random().toString(36);
        },
      },
    //----------------------------- GETTERS -------------------------------------


    get : {

      state : {
        tag_filter : function(){
          return gmodel.filtering.tag.substring(0, gmodel.filtering.tag.length);
        },
      },

      codes : {
        by_types : function(type){
          let codes = gmodel.getCodesByType_internal(type);
          if(codes == false) return false;
          if(type !== gmodel.types.codes.stored )
            return codes.getAll();
          else{
            //FILTERING AND SEARCH
            let filtered = codes.getAllByFilter({
                                                  name  : gmodel.filtering.name,
                                                  tag   : gmodel.filtering.tag}
                                                );
            return filtered;
          }
        },
        by_id : function(id){
          for(type in gmodel.codes) {
            let found_code = gmodel.getCodesByType_internal(type).get(id);
            if(found_code) return found_code;
          }
          return null;
        },
        tags : function(){
          try {
            let tags = {};

            let codes = gmodel.getCodesByType_internal(gmodel.types.codes.stored).getAll();
            for(let i = 0; i < codes.length; i++){
              let code = codes[i];
              if(code.tag){
                tags[code.tag] = code.tag;
                let splitted_tags = code.tag.split(" ");
                for(let j = 0; j < splitted_tags.length; j++){
                  tags[splitted_tags[j]] = splitted_tags[j];
                }
              }
            }
            return tags;
          }
          catch(err) {
            return false;
          }

        },
      },


    },

    //----------------------------- SETTER -------------------------------------

    change : {
      state : {
        add_tag_filter : function(filter){
          gmodel.filtering.tag = filter;
        },
        remove_tag_filter : function(){
          gmodel.filtering.tag = "";
        },
        add_name_filter : function(filter){
            gmodel.filtering.name = filter;
        },
        remove_name_filter : function(){
          gmodel.filtering.name = "";
        },
      },
      codes : {
        add : function(code){
            let codes = gmodel.getCodesByType_internal(code.type);
            if (codes !== false) {
              codes.push(code);
              return true;
            }
            return false;
          },
        // setCode
        set : function(code){
          let codes = gmodel.getCodesByType_internal(code.type);
          if (codes !== false) {
            codes.set(code);
            return true;
          }
          return false;
        },
        // syncCode
        sync : function(code){
          let codes = gmodel.getCodesByType_internal(code.type);
          if (codes !== false) {
            codes.setWithoutCommit(code);
            return true;
          }
          return false;
        },
        //delCode
        del : function(code){
          let codes = gmodel.getCodesByType_internal(code.type);
          if (codes !== false) {
            codes.remove(code.id);
            return true;
          }
          return false;
        },
        // addCodes
        multi_add: function(codes){
          gmodel.actOnCodesWithCodes_internal(codes,gmodel.addCode);
        } ,
        //setCodes
        multi_set : function(codes){
          gmodel.actOnCodesWithCodes_internal(codes, gmodel.setCode)
        },
        // delCodes
        multi_sync: function(codes){
          gmodel.actOnCodesWithCodes_internal(codes, gmodel.delCode);
        },
      }

    },


    //-----------------------------  HIGH LEVEL UTILITIES -------------------------------------
      utils : {

        /**
         * replaceStoredCodeNameWithCode - Replace a CodeName string with its Code
         *
         * @param  {String} str the code name
         * @returns {String}     the actual code string
         */
        transform_codename_to_code : function(str){
          let stored_codes = gmodel.getCodesByType_internal(gmodel.types.codes.stored).getAll();
          for (let i = 0; i < stored_codes.length; i++ ){
            let stored_code_coding = "\\" +  stored_codes[i].name;
            let stored_code_code = stored_codes[i].code;
            //
            if(str === stored_code_coding ){
              return stored_code_code;
            }
          }
          return str;
        },

      }

  };
  return m;
}
