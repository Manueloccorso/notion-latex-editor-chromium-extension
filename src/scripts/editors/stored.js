function MainStored() {
  console.log("EHEH");
  gcontroller = Controller(content_page = true);
  gstorage = StorageManager();
  gview = View();
  gmodel = Model();
  goptions = OptionsManager();

  function waitForStorage(){
      if(goptions.synced && gstorage.synced){
        gmodel.init();
        gview.init();
        gcontroller.options.page = false;
        gcontroller.options.stored = true;
        gcontroller.options.quick = false;
        gcontroller.init();
      }
      else{
          setTimeout(waitForStorage, 5);
      }
  }

  waitForStorage();
}

function restart_popup(){
  gcontroller = Controller();
  gstorage = StorageManager();
  gview = View();
  gmodel = Model();

  gstorage.load();
  gmodel.init();
  gview.init();
  gcontroller.init();

  gcontroller.contentInteraction.request_codes();
}
