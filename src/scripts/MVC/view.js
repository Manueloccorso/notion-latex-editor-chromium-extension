

  function View(){

    let view = {
      //------------------------ STATIC STRINGS --------------------------------------------------
        resources : {
          add_icon        : "images/icons/add-multi-size.ico",
          delete_icon     : "images/icons/delete-multi-size.ico",
          save_icon       : "images/icons/save-multi-size.ico",
          sync_icon       : "images/icons/sinchronize-multi-size.ico",
          scrolltop_icon  : "images/icons/up-multi-size.ico",
          },
        id_html_fixed : {
          top_title_box_id      : "top_title_box_id",
          page_codes_box_id     : "page_codes_box_id",
            btn_sync_page_codes   : "btn_sync_page_codes",
          quick_codes_box_id    : "quick_codes_box_id",
            btn_add_quick_code    : "btn_add_quick_code",
          stored_codes_box_id   : "stored_codes_box_id",
            btn_add_stored_code   : "btn_add_stored_code",
            btn_sync_stored_code  : "btn_sync_stored_code",
            select_stored_codes_filter  : "select_stored_codes_filter",
            textarea_search_by_name     : "textarea_search_by_name"
          },
        id_prefixes : {
          code_textarea   : "code_textarea_",
          code_summary    : "code_summary_",
          code_preview    : "code_preview_",
          code_name       : "code_name_",
          code_tag        : "code_tag_",
          save_btn        : "save_btn_",
          delete_btn      : "delete_btn_",
          scrolltop_btn   : "scroll_top_btn_"
          },
        css_class_names : {
          container       : "theme-container",
            header_control   : "theme-grid-header",
              search_textarea : "search-textarea",
                code_block_grid : "theme-grid-code-block",
                  code_textarea                       : "code-textarea",
                  code_preview                  : "code-preview",

          small_icon      : "theme-small-icon",
          small_btn       : "theme-small-btn"
          },
      //------------------------ DYNAMIC STRINGS -------------------------------------------------
        manageId : {
          clean : function(dirty_id){
            let cleaned = dirty_id;
            for (prefix in gview.id_prefixes){
              cleaned = cleaned.replace(gview.id_prefixes[prefix],"");
            }
            return cleaned;
          },
          code_block : {
            name : function(id){
              return gview.id_prefixes.code_name + id;
            },
            tag : function(id){
              return gview.id_prefixes.code_tag + id;
            },
            summary : function(id){
              return gview.id_prefixes.code_summary + id;
            },
            preview : function(id){
              return gview.id_prefixes.code_preview + id;
            },
            textarea : function (id){
              return gview.id_prefixes.code_textarea + id;
            },
            save_btn : function (id){
              return gview.id_prefixes.save_btn + id;
            },
            delete_btn : function (id){
              return gview.id_prefixes.delete_btn + id;
            },
            scroll_top_btn : function (id){
              return gview.id_prefixes.scrolltop_btn + id;
            },
          }
          },
      //----------------------- GET HTML OBJECTS ------------------------------------------------
        getElement : {
          static : {},
          page_codes_container : {
            container               : function(){return $(document.getElementById(gview.id_html_fixed.page_codes_box_id)); },
            sync_btn                : function(){ return $(document.getElementById(gview.id_html_fixed.btn_sync_page_codes)); }
          },
          quick_codes_container : {
            container               : function(){ return $(document.getElementById(gview.id_html_fixed.quick_codes_box_id));},
            add_btn                  : function(){ return $(document.getElementById(gview.id_html_fixed.btn_add_quick_code)); },
          },
          stored_codes_container : {
            container                : function(){ return $(document.getElementById(gview.id_html_fixed.stored_codes_box_id)); },
            add_btn                  : function(){ return $(document.getElementById(gview.id_html_fixed.btn_add_stored_code)); },
            sync_btn                 : function(){ return $(document.getElementById(gview.id_html_fixed.btn_sync_stored_code)); },
            filter_select            : function(){ return $(document.getElementById(gview.id_html_fixed.select_stored_codes_filter))},
            search_textarea          : function(){ return $(document.getElementById(gview.id_html_fixed.textarea_search_by_name))},
          },
          dynamic : {
            summary_from_code : function(code){
              return $(document.getElementById(gview.manageId.code_block.summary(code.id)));
            },
          }
        },
      // ---------------------- INIT --------------------------------
        init : function(){
          gview.manageTheme.set(goptions.options.theme);
          },
      //---------------------- HTML CREATION ---------------------------------------------------
        createHTML : {
          general : {
            div       : function(){
              return div = $(document.createElement("DIV"));
            },
            list_item : function(){
              return $(document.createElement("LI"));
            },
            code_block_grid      : function(){
              let div = this.div();
              div.addClass(gview.css_class_names.code_block_grid);
              return div;
            },
            btn_small : function(id, icon, alt){
              let btn = $(document.createElement("BUTTON"));
              btn.attr("id", id);
              btn.attr("type", "button");
              btn.addClass(gview.css_class_names.small_btn);
              btn.html(' <span class="front" > ' +
                                      '<img class="'  + gview.css_class_names.small_icon + '" ' +
                                          ' src="'    + icon        + '" '+
                                          ' alt="'    + alt         + '"> ' +
                                ' </span>');
              return btn;
            },
            title     : function(level, title) {
              let title_box = $(document.createElement("P"));
              title_box.html("<h"  + level + ">" + title + "</h" + level + ">");
              return title_box;
            },
            details   : function(){
              return $(document.createElement("DETAILS"));
            },
            summary   : function(){
                return $(document.createElement("SUMMARY"));
            },
            option    : function(str){
              let opt = $(document.createElement("option"));
              opt.get(0).value = str;
              opt.get(0).text = str;
              return opt;
            }
          },
          code : {
            name : function(code){
              let div = gview.createHTML.general.div();
              div.append(gview.createHTML.general.title(3,"Name"));
              let code_name = $(document.createElement("INPUT"));
              code_name.attr("type", "text");
              code_name.addClass(gview.css_class_names.code_textarea);
              code_name.attr("id", gview.manageId.code_block.name(code.id));
              code_name.get(0).value = code.name;
              gcontroller.setViewLogic.code_block.name_textarea(code_name);
              div.append(code_name);
              return div;
            },
            tag : function(code){
              let div = gview.createHTML.general.div();
              div.append(gview.createHTML.general.title(3,"Tag"));
              let code_tag = $(document.createElement("INPUT"));
              code_tag.attr("type", "text");
              code_tag.attr("id",gview.manageId.code_block.tag(code.id));
              code_tag.addClass(gview.css_class_names.code_textarea);
              code_tag.get(0).value = code.tag;
              gcontroller.setViewLogic.code_block.tag_textarea(code_tag);
              div.append(code_tag);
              return div;
            },
            summary : function(code){
              let summary = gview.createHTML.general.summary();
              summary.attr("id",gview.manageId.code_block.summary(code.id));

              return summary;
            },
            preview : function(code){
              let label = $(document.createElement("p"));
              label.attr("id", gview.manageId.code_block.preview(code.id))
              label.addClass(gview.css_class_names.code_preview);
              katex.render(code.code,
                          label.get(0),
                          { throwOnError: false}
                        );
              // TODO: Add Listeners
              return label;
            },
            textarea : function(code){
              let textarea = $(document.createElement("TEXTAREA"));
              textarea.attr(gview.manageId.code_block.textarea(code.id));
              textarea.get(0).value = code.code;

              // TODO: Add Listeners IF code mirror is taken down
              //gcontroller.addListenersToCodeTextArea(textarea);
              return textarea;
            },
            codemirror : function(textarea){
              let mirror_textarea = CodeMirror.fromTextArea(textarea.get(0), {
                lineNumbers: true,
                autoRefresh: true,
                theme : gview.manageTheme.cmThemeByTheme[gview.manageTheme.theme],
                mode : {name: "stex"}
              });
              mirror_textarea.getDoc().setValue(textarea.get(0).value);
              mirror_textarea.setSize("100%", "20rem");
              mirror_textarea.refresh();
              gcontroller.setViewLogic.code_block.codemirror(mirror_textarea);
            },
            add_btn : function(code){
              let add_btn = gview.createHTML.general.btn_small(  gmodel.newCodeId(),
                                              gview.resources.add_icon,
                                              "Add a new Code!");
              gcontroller.setViewLogic.code_block.buttons.set(add_btn, gcontroller.setViewLogic.code_block.buttons.types.btn_add);
              return add_btn;
            },
            delete_btn : function(code){
              let del_btn = gview.createHTML.general.btn_small(  gview.manageId.code_block.delete_btn(code.id),
                                              gview.resources.delete_icon,
                                              "Delete this Code!");
              gcontroller.setViewLogic.code_block.buttons.set(del_btn, gcontroller.setViewLogic.code_block.buttons.types.btn_delete);
              return del_btn;
            },
            save_btn : function(code){
                let save_btn = gview.createHTML.general.btn_small(  gview.manageId.code_block.save_btn(code.id),
                                                gview.resources.save_icon,
                                                "Store the Code!");
                gcontroller.setViewLogic.code_block.buttons.set(save_btn, gcontroller.setViewLogic.code_block.buttons.types.btn_save);
                return save_btn;
            },
            sync_btn : function(code){
              let sync_btn = gview.createHTML.general.btn_small(  gmodel.newCodeId(),
                                              gview.resources.sync_icon,
                                              "Sync with the page!");
              gcontroller.setViewLogic.code_block.buttons.set(sync_btn, gcontroller.setViewLogic.code_block.buttons.types.btn_sync);
              return sync_btn;
            },
            scroll_top_btn : function(code){
              let st_btn = gview.createHTML.general.btn_small(  gview.manageId.code_block.scroll_top_btn(code.id),
                                              gview.resources.scrolltop_icon,
                                              "Scroll to top!");
              gcontroller.setViewLogic.code_block.buttons.set(st_btn, gcontroller.setViewLogic.code_block.buttons.types.btn_scrollTop);
              return st_btn;
            },
            }
          },
        compose : {
          code_block : function (node, code, buttons){
            // Create all elements
            let li                    = gview.createHTML.general.list_item();
            li.addClass(gview.css_class_names.container);
              let code_block_grid    = gview.createHTML.general.code_block_grid();
                let btn_div           =  gview.createHTML.general.div();
                let code_name         = gview.createHTML.code.name(code);
                let code_tag          = gview.createHTML.code.tag(code);

                let details           = gview.createHTML.general.details();
                //Add some logic
                details.one(
                  "click",
                  function() {
                    gview.createHTML.code.codemirror(code_textarea);
                  });
                  let summary         = gview.createHTML.code.summary(code);
                    let code_preview  = gview.createHTML.code.preview(code);
                  let code_textarea   = gview.createHTML.code.textarea(code);
                  code_textarea.attr("id",code.id);

            //Compose
            node.append(li);
              li.append(code_block_grid);
                code_block_grid.append(btn_div);
                  for(button of buttons){
                    btn_div.append(button(code));
                  }
                code_block_grid.append(code_name);
                code_block_grid.append(code_tag);
                li.append(details);
                  details.append(summary);
                    summary.append(code_preview);
                  details.append(code_textarea);

            return node;
          },
          code_blocks : function(node, codes, buttons){
            for( let i = 0; i < codes.length; i++ ){
              this.code_block(node, codes[i], buttons);
            }
            return node;
          }
          },
      // ------------- REFRESHING VIEW PIECES
        refresh : {
          reset_append : function(parent, child){
            parent.html("");
            parent.append(child);

          },
          code_preview : function(code){
            this.reset_append(  gview.getElement.dynamic.summary_from_code(code),
                                gview.createHTML.code.preview(code) );
          },
          codes_container : function(container, codes, buttons){
            container.html("");
            gview.compose.code_blocks(container, codes, buttons);
          },
          page_codes_view : function (){
            if(gcontroller.contentInteraction.active){
              this.codes_container(
                  gview.getElement.page_codes_container.container(),
                  gmodel.getCodesByType(gmodel.code_page_type),
                  [ gview.createHTML.code.scroll_top_btn,
                    gview.createHTML.code.sync_btn,
                    gview.createHTML.code.save_btn ]
              );
            }
          },
          quick_codes_view : function (){
            this.codes_container(
                gview.getElement.quick_codes_container.container(),
                gmodel.getCodesByType(gmodel.code_quick_type),
                [ gview.createHTML.code.scroll_top_btn,
                  gview.createHTML.code.save_btn ]
            );
          },
          stored_codes_view : function (){
            this.codes_container(
                gview.getElement.stored_codes_container.container(),
                gmodel.getCodesByType(gmodel.code_stored_type),
                [ gview.createHTML.code.scroll_top_btn,
                  gview.createHTML.code.save_btn,
                  gview.createHTML.code.delete_btn]
            );
          },
          view : function(){
            this.page_codes_view();
            this.quick_codes_view();
            this.stored_codes_view();
          },
          view_by_code : function(code){
            if(code.type === gmodel.code_page_type)
              this.page_codes_view();
            if(code.type == gmodel.code_quick_type)
              this.quick_codes_view();
            if(code.type == gmodel.code_stored_type)
              this.stored_codes_view();
          },
          stored_codes_tags : function (filters){
            let select = gview.getElement.stored_codes_container.filter_select();
            select.html("");

            let opt = gview.createHTML.general.option();
            opt.html("All");
            opt.attr("value", "All");
            select.append(opt);

            for(tag in filters){
              let opt = gview.createHTML.general.option();
              opt.html(filters[tag]);
              opt.attr("value", filters[tag]);
              select.append(opt);
            }

            return select;
          }
        },

      //-------------- INTERACTIVE -------------------------------------------------------------
        interact : {
          find_element_position : function (obj) {
            let  curtop = 0;
            if (obj.offsetParent) {
                do {
                    curtop += obj.offsetTop;
                } while (obj = obj.offsetParent);
            return [curtop];
            }
          },
          scroll_to_element_by_id : function (id){
            window.scroll(0, this.find_element_position(document.getElementById(id)));
          },
          scroll_to_top : function(){
            this.scroll_to_element_by_id(gview.id_html_fixed.top_title_box_id);
          },
          scroll_to_page_codes : function(){
            this.scroll_to_element_by_id(gview.id_html_fixed.page_codes_box_id);
          },
          scroll_to_quick_codes : function(){
            this.scroll_to_element_by_id(gview.id_html_fixed.quick_codes_box_id);
          },
          scroll_to_stored_codes : function(){
            this.scroll_to_element_by_id(gview.id_html_fixed.stored_codes_box_id);
          }

        },
      //---------------------------THEME MANAGEMENT ---------------------------------------------
        manageTheme : {
          theme : 'dark',
          themes : ['dark', 'light', 'notion'],
          cmThemeByTheme : {
            'dark' : "material-darker",
            'light' : 'base16-light',
            'notion' : 'material-darker'
          },
          set : function (theme){
            gview.manageTheme.theme = theme;
            $("#"+'theme').attr(
                                                "href",
                                                "styles/themes/" + gview.manageTheme.theme +".css");
          }
        }
    }
    return view;
  }
