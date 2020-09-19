

  /**
   * Model - Manage all the data needed for code blocks
   *         Should be declared global variables, and uses other global variables such as:
   *            {@link controller | Controller}
   *            {@link view | View }
   *            {@link storage | StorageManager }
   *            {@link controller | Controller}
   *
   * @constructor
   */
function Model() {
  let m = {
    //----------------------------- VARS  -------------------------------------
      //----------------------------- LOGGING  -------------------------------------
        prefix : "Model : ",
        log_obj : function(obj){
          //
        },
      //----------------------------- TYPES  -------------------------------------

        /**
         * Possible type of codes.
         */
        code_page_type: "code_page_type",
        code_quick_type: "code_quick_type",
        code_stored_type: "code_stored_type",

        /**
         *    dict of AdvancedArray of Code for each type
         */
        codes : {
          code_page_type    : {},
          code_quick_type   : {},
          code_stored_type  : {},
        },

        tag_filter : "",
        name_filter : "",

    //----------------------------- INTERNALS -------------------------------------
      getCodesByType_internal : function(type){
        if(type !== null )
          return gmodel.codes[type];
        return false;
      },

      actOnCodesWithCodes_internal : function(codes, action){
        if(codes !== null){
            for(let i = 0; i < codes.length; i++){
              action(codes[i]);
            }
          }
      },


    //----------------------------- UTILS -------------------------------------

      /**
       * init - initialize the model to have:
       *          - a code_page_type AdvancedArray not stored.
       *          - a code_quick_type  AdvancedArray not stored.
       *          - a code_stored_type  AdvancedArray stored.
       */
      init : function(){
        gmodel.codes[gmodel.code_page_type] = AdvancedArray(false);

        gmodel.codes[gmodel.code_quick_type] = AdvancedArray(false);

        gmodel.codes[gmodel.code_stored_type] = AdvancedArray(true);
        gmodel.codes[gmodel.code_stored_type].syncWithStorage();
      },

    //----------------------------- CREATORS -------------------------------------

      /**
       * newCode - create a new Code object
       * @constructor
       *
       * @param  {string} id   unique id for the code
       * @param  {string} code the actual code string
       * @param  {type} name the name to be displayed or used for autocomplete
       * @param  {type} tag  the tag for categorization
       * @param  {type} type the type of code (see the code types)
       */
      newCode : function(id, code, name, tag, type){
        return {
          id    : id,
          code  : auto_clean_code(code),
          name  : name,
          tag   : tag,
          type  : type
        }
      },
      /**
       * newCodeId - get a new random id for a code
       *
       * @returns {string}  the random id string
       */
      newCodeId : function(){
        return Math.random().toString(36);
      },



    //----------------------------- GETTERS -------------------------------------

      /**
       * getCodesByType - get all the codes of a given type
       *
       * @returns {Array of Code} an array with all the codes of the specified type
       */
      getCodesByType: function(type) {
        let codes = gmodel.getCodesByType_internal(type);
        if(codes == false) return false;
        if(type !== gmodel.code_stored_type )
          return codes.getAll();
        else{
          //FILTERING AND SEARCH
          let filtered = codes.getAllByFilter({
                                                name  : gmodel.name_filter,
                                                tag   : gmodel.tag_filter}
                                              );
          return filtered;
        }
      },

      /**
       * getCode - get the code from the model by id
       *
       * @param  {string} id the id of the code you need
       */
      getCode : function(id){
        for(type in gmodel.codes) {
          let found_code = gmodel.getCodesByType_internal(type).get(id);
          if(found_code) return found_code;
        }
        return null;
      },

      getTagFilter : function(){
        return gmodel.tag_filter.substring(0, gmodel.tag_filter.length);
      },


    //----------------------------- SETTER -------------------------------------

      /**
       * addCode - add a new code in the model
       *
       * @returns {type}  true if the operation succeded, else false.
       */
      addCode : function(code){
          let codes = gmodel.getCodesByType_internal(code.type);
          if (codes !== false) {
            codes.push(code);
            let codes_changed = gmodel.getCodesByType(code.type);
            return true;
          }
          return false;
        },
      /**
       * setCode - update the value of a code (identified by the id AND type)
       *
       * @param  {Code} code the code to update, must have the right id and type
       * @returns {boolean} rue if the code exist, else false.
       */
      setCode : function(code){
        let codes = gmodel.getCodesByType_internal(code.type);
        if (codes !== false) {
          codes.set(code);
          return true;
        }
        return false;
      },
      /**
       * syncCode - sync a code in the model, but never store the update to Storage.
       *
       * @param  {Code} code the code to sync, must have the right id and type.
       * @returns {boolean} true if the code exist, else false.
       */
      syncCode : function(code){
        let codes = gmodel.getCodesByType_internal(code.type);
        if (codes !== false) {
          codes.setWithoutCommit(code);
          return true;
        }
        return false;
      },
      /**
       * delCode - delete a code from the model.
       *
       * @param  {Code} code the code to delete, must have the right id and type.
       * @returns {boolean} true if the code exist, else false.
       */
      delCode : function(code){
        let codes = gmodel.getCodesByType_internal(code.type);
        if (codes !== false) {
          codes.remove(code.id);
          return true;
        }
        return false;
      },

      /**
       * addCodes - add an array of Code in the model
       *
       * @param  {Array of Code} codes array of codes to add
       */
      addCodes: function(codes){
        gmodel.actOnCodesWithCodes_internal(codes,gmodel.addCode);
      } ,
      /**
       * setCodes - update an array of Code in the model
       *
       * @param  {Array of Code} codes array of codes to update
       */
      setCodes: function(codes){
        gmodel.actOnCodesWithCodes_internal(codes, gmodel.setCode)
      },
      /**
       * setCodes - remove an array of Code from the model
       *
       * @param  {Array of Code} codes array of codes to remove
       */
      delCodes : function(codes_to_del){
        gmodel.actOnCodesWithCodes_internal(codes, gmodel.delCode);
      },

      //---------------------- FILTERING AND SEARCH --------------------------

      addTagFilter : function(filter){
        gmodel.tag_filter = filter;
      },

      removeTagFilter : function(){
        gmodel.tag_filter = "";
      },
      /**
       * getAllTags - get all the tags assigned to the codes in the array
       *
       * @returns {Dict of Tags}  description
       */
      getAllTags : function(){
        try {
          let tags = {};

          let codes = gmodel.getCodesByType_internal(gmodel.code_stored_type).getAll();
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

      addNameFilter : function(filter){
          gmodel.name_filter = filter;
      },

      removeNameFilter : function(){
        gmodel.name_filter = "";
      },




    //-----------------------------  HIGH LEVEL UTILITIES -------------------------------------

      /**
       * replaceStoredCodeNameWithCode - Replace a CodeName string with its Code
       *
       * @param  {String} str the code name
       * @returns {String}     the actual code string
       */
      replaceStoredCodeNameWithCode: function(str){
        let stored_codes = gmodel.getCodesByType_internal(gmodel.code_stored_type).getAll();
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

  };
  return m;
}
