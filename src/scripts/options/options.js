function MainOptions () {


gcontroller = Controller(content_page = false);
gstorage = StorageManager();
gview = View();
gmodel = Model();
goptions = OptionsManager();


function waitForStorage(){
    if(goptions.synced && gstorage.synced){


        gmodel.init();
        gview.init();
        gcontroller.init();


        gview.refresh.stored_codes_view();

        let export_btn = $("#btn_exportdb");
        export_btn.click(
                  (event) => {
                    download(gmodel.getCodesByType(gmodel.code_stored_type));
                  }
        );



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
