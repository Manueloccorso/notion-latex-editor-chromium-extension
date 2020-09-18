function MainAll() {


  function waitForStorage(){
      if(goptions.synced && gstorage.synced){
        gmodel.init();
        gview.init();
        gcontroller.options.page = true;
        gcontroller.options.stored = true;
        gcontroller.options.quick = true;
        gcontroller.init();

        gcontroller.contentInteraction.request_codes();
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
