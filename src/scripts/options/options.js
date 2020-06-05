
console.log("NM.option : RUNNING");


var gcontroller = Controller(content_page = false);
var gstorage = StorageManager();
var gview = View();
var gmodel = Model();
var goptions = OptionsManager();

function waitForStorage(){
    if(goptions.synced && gstorage.synced){
        console.log(goptions.options);

        gmodel.init();
        gview.init();
        gcontroller.init();


        gview.refreshStoredCodesView();

        let export_btn = document.getElementById("btn_exportdb");
        export_btn.addEventListener(
                  'click',
                  (event) => {
                    download(gmodel.getCodesByType(gmodel.code_stored_type));
                  }
        );



        let theme_selector = document.getElementById("theme_selector");
        theme_selector.innerHTML = "";
        for(th in gview.themes){
          console.log(gview.themes[th]);
          gview.addOptionStrToSelectElement(theme_selector, gview.themes[th], gview.themes[th] );
        }
        let selected_theme = goptions.get().theme;
        console.log("STORED THEME = ", selected_theme);
        for (i = 0; i < theme_selector.length; i++) {
          if(theme_selector[i].text == selected_theme){
            theme_selector.selectedIndex = i;
            console.log("SETTING ", i,  " as selected theme!");
          }
        }
        theme_selector.addEventListener(
          'change',
          function(){
            let theme = theme_selector.options[theme_selector.selectedIndex].value;
            gview.setTheme(theme);
            goptions.set({theme:theme})
          }
        );
    }
    else{
        console.log("Waiting Storage!");
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
