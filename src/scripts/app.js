var gcontroller = Controller(content_page = true);
var gstorage = StorageManager();
var gview = View();
var gmodel = Model();
var goptions = OptionsManager();

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
function openNav() {
  $(document.getElementById("mySidenav")).css("width", "20%");
  $(document.getElementById("main")).css("marginLeft", "20%");
  $(document.getElementsByClassName("nav-title")).show();
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
function closeNav() {
  $(document.getElementById("mySidenav")).css("width", "6%");
  $(document.getElementById("main")).css("marginLeft", "6%");
  $(document.getElementsByClassName("nav-title")).hide();
}

function refreshTags(){
  $(".nav-tag-btn").remove();
  if(gstorage.synced && gmodel.getAllTags()){
    console.log("ADDING TAGS");
    let tags = gmodel.getAllTags();
    for(tagg in tags){
      let tag = tags[tagg];
      console.log(tag);
      let button = $(document.createElement("BUTTON"));
      button.attr("id", "nav-btn-tag-"+tag);
      button.attr("class", "nav-btn");
      button.addClass("nav-tag-btn");
      let label = $("<h3>"+tag+"</h3>");
      label.attr("class","nav-title");
      let icon = $(gview.resources.icons.tags);
      button.append(icon);
      button.append(label);
      button.click(function(){
          $(document.getElementById("main")).load(chrome.extension.getURL("all.html"), function(){ MainTag(tag)});
          refreshTags();
      });
      $(document.getElementById("mySidenav")).append(button);
    }
  }else{
    setTimeout(refreshTags, 1000);
    console.log("waiting");
  }
}


$(document).ready(function(){
  closeNav();
  $(document.getElementById("mySidenav")).hover( openNav ,closeNav);
  $(document.getElementById("navClose")).click( closeNav );

  $(document.getElementById("main")).load(chrome.extension.getURL("all.html"), MainAll);

  $(document.getElementById("nav-btn-all")).click(
    function(){
      $(document.getElementById("main")).load(chrome.extension.getURL("all.html"), MainAll);
      refreshTags();
    }
  );
  $(document.getElementById("nav-btn-page")).click(
    function(){
      $(document.getElementById("main")).load(chrome.extension.getURL("all.html"), MainPage);
      refreshTags();
    }
  );
  $(document.getElementById("nav-btn-stored")).click(
    function(){
        $(document.getElementById("main")).load(chrome.extension.getURL("all.html"), MainStored);
        refreshTags();
    }
  );
  $(document.getElementById("nav-btn-quick")).click(
    function(){
        $(document.getElementById("main")).load(chrome.extension.getURL("all.html"), MainQuick);
        refreshTags();
    }
  );
  $(document.getElementById("nav-btn-options")).click(
    function(){
      $(document.getElementById("main")).load(chrome.extension.getURL("options.html"), MainOptions);
      refreshTags();
    }
  );


  refreshTags();

});
