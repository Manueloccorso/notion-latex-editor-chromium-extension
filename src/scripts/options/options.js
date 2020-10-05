function MainOptions () {


gcontroller = Controller(content_page = false);
gstorage = StorageManager();
gview = View();
gmodel = Model();
goptions = OptionsManager();


function set_theme_selector(){
  let theme_selector = $("#theme_selector");
  theme_selector.html("");
  for(th in gview.manageTheme.themes){
    let opt = gview.createHTML.general.option();
    opt.html(gview.manageTheme.themes[th]);
    opt.attr("value", gview.manageTheme.themes[th]);
    theme_selector.append(opt);
  }
  let selected_theme = goptions.get().theme;
  for (i = 0; i < theme_selector.length; i++) {
    if(theme_selector[i].text == selected_theme){
      theme_selector.selectedIndex = i;
    }
  }
  theme_selector.change(
    function(){
      let ts_dom  = theme_selector.get(0);
      let theme = ts_dom.options[ts_dom.selectedIndex].value;
      gview.manageTheme.set(theme);
      goptions.set({theme:theme})
    }
  );
}

function set_export_button(){
  let export_btn = $("#btn_exportdb");
  export_btn.click(
           (event) => {
             download(gmodel.get.codes.by_types(gmodel.types.codes.stored));
           }
  );
}

function set_blur_checkbox(){
  let blur_checkbox = $("#blur_checkbox");
  goptions.get().blur  ? blur_checkbox.attr("checked", true) : blur_checkbox.attr("checked", false);
  blur_checkbox.change(function(){
    blur_checkbox.prop("checked") ? goptions.set({blur : true}) : goptions.set({blur : false}) ;
  });
}

function  set_compact_checkbox(){
  let compact_checkbox = $("#compact_checkbox");
  goptions.get().compact ? compact_checkbox.attr("checked", true) : compact_checkbox.attr("checked", false);
  compact_checkbox.change(function(){
    compact_checkbox.prop("checked") ? goptions.set({compact : true}) : goptions.set({compact : false}) ;
  });
}



function waitForStorage(){
    if(goptions.synced && gstorage.synced){
      gmodel.init();
      gview.init();
      gcontroller.init();

      set_export_button();

      set_theme_selector();

      set_blur_checkbox();
      set_compact_checkbox();
    }
    else{
        setTimeout(waitForStorage, 5);
    }
}
waitForStorage();


function restart_options(){
  gcontroller = Controller();
  gstorage = StorageManager();
  gview = View();
  gmodel = Model();
  goptions = OptionsManager();


  gstorage.load();
  gmodel.init();
  gview.init();
  gcontroller.init();
  goptions.

  gcontroller.requestCodesToContent();

  gview.refreshStoredCodesView();
}

}
