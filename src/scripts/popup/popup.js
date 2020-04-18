var gcontroller = Controller(true);
var global_storage = StorageManager();
var gview = View();
var gmodel = Model();

global_storage.load();
gmodel.init();
gview.init();
gcontroller.init();

gcontroller.requestCodesToContent();


function restart_popup(){
  gcontroller = Controller();
  global_storage = StorageManager();
  gview = View();
  gmodel = Model();


  global_storage.load();
  gmodel.init();
  gview.init();
  gcontroller.init();

  gcontroller.requestCodesToContent();
}
