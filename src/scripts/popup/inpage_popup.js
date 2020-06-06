var gcontroller = Controller(content_page = true);
var gstorage = StorageManager();
var gview = View();
var gmodel = Model();
var goptions = OptionsManager();

var inpage_code = {};

function waitForStorage(){

    if(goptions.synced && gstorage.synced && gstorage.inpage_synced){
      console.log("Options and Storage loaded!");
      gmodel.init();
      gcontroller.init();
      gview.init();
      inpage_code = gstorage.inpage_code;
      inpage_code = gmodel.newCode(  inpage_code.id,
                                  inpage_code.code,
                                  "Formula #" ,
                                  "page",
                                  gmodel.code_page_type);
      console.log(inpage_code);
      gcontroller.addPageCode(inpage_code);
      gview.refreshPageCodesView();


      var w = window , d = document, b = document.body;
      window.resizeBy(0, (b.scrollHeight - w.innerHeight));
    }
    else{
        console.log("Waiting Storage!");
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

  //gcontroller.requestCodesToContent();
}

function setVisualizedCode(code){
  console.log("IN PAGE CODESSSSSS");
  inpage_code = code;
  inpage_synced = true;
}
