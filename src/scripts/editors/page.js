function MainPage() {
  function waitForStorage(){
      if(goptions.synced && gstorage.synced){
        gmodel.init();
        gview.init();
        gcontroller.options.page = true;
        gcontroller.options.stored = false;
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
