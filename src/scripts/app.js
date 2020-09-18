var gcontroller = Controller(content_page = true);
var gstorage = StorageManager();
var gview = View();
var gmodel = Model();
var goptions = OptionsManager();

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
function openNav() {
  $(document.getElementById("mySidenav")).css("width", "20%");
  $(document.getElementById("main")).css("marginLeft", "20%");
  $(document.getElementById("main")).css("marginLeft", "20%");
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
function closeNav() {
  $(document.getElementById("mySidenav")).css("width", "5%");
  $(document.getElementById("main")).css("marginLeft", "5%");
}

$(document).ready(function(){
  closeNav();
  $(document.getElementById("mySidenav")).hover( openNav ,closeNav);
  $(document.getElementById("navClose")).click( closeNav );

  $(document.getElementById("main")).load(chrome.extension.getURL("all.html"), MainAll);

  $(document.getElementById("nav-btn-all")).click(
    function(){
      $(document.getElementById("main")).load(chrome.extension.getURL("all.html"), MainAll);
    }
  );
  $(document.getElementById("nav-btn-page")).click(
    function(){
      $(document.getElementById("main")).load(chrome.extension.getURL("all.html"), MainPage);
    }
  );
  $(document.getElementById("nav-btn-stored")).click(
    function(){
        $(document.getElementById("main")).load(chrome.extension.getURL("all.html"), MainStored);
    }
  );
  $(document.getElementById("nav-btn-quick")).click(
    function(){
        $(document.getElementById("main")).load(chrome.extension.getURL("all.html"), MainQuick);
    }
  );
  $(document.getElementById("nav-btn-options")).click(
    function(){
      $(document.getElementById("main")).load(chrome.extension.getURL("options.html"), MainOptions);
      MainOptions();
    }
  );

});
