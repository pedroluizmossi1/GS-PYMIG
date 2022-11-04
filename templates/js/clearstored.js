eel.expose(clear_localStorage)
function clear_localStorage() {
      localStorage.clear();
      console.log("LocalStorage cleared")
      //delete IndexDB
      const request = window.indexedDB.deleteDatabase("NAV_DB");
      request.onsuccess = function(event) {
      console.log("IndexDB deleted");
      //page reload
    location.reload();
    }  
  }