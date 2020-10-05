function MainTag(tag) {


  function waitForStorage(){
      if(goptions.synced && gstorage.synced){
        gmodel.init();
        gview.init();
        gcontroller.options.page = false;
        gcontroller.options.stored = true;
        gcontroller.options.quick = false;
        gcontroller.init();
        let filter_select = gview.getElement.stored_codes_container.filter_select();
        console.log(tag);
        console.log(filter_select);
        filter_select.val(tag).change();
        $(document.getElementById("filter_div")).hide();
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
