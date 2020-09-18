var gcontroller = Controller(true);
var gstorage = StorageManager();
var gview = View();
var gmodel = Model();
var goptions = OptionsManager();

function waitForStorage(){
    if(goptions.synced && gstorage.synced){
      gmodel.init();
      gview.init();
      gcontroller.init();

      gcontroller.contentInteraction.request_codes();
    }
    else{
        setTimeout(waitForStorage, 5);
    }
}
waitForStorage();

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
