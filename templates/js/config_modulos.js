async function select_all_tabelas_sistemas(tipo_bd) {
    if (tipo_bd == 'POSTGRES') {
        let select = await eel.select_all_tabelas_postgres_raw()();
        return select
    }
  }
  
  async function insert_all_tables_in_nav_bd(event) {
    let select = await event
    const request = window.indexedDB.open("NAV_DB", 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore("tabelas", { keyPath: "id", autoIncrement: true  });
  
      request.onsuccess = (e) => {
        // Create DB connection
        const transaction = db.transaction('tabelas', 'readwrite');
  
        transaction.oncomplete = function(event) {
      };
  
      transaction.onerror = function(event) {
          console.log('Transaction not opened due to error: ' + transaction.error);
      };
  
      const objectStore = transaction.objectStore('tabelas');
      for (let i = 0; i < select.length; i++) {
        objectStore.add(select[i]);
        table = document.getElementById('list_all_tables')
            //create table rows 
            var tr = document.createElement('tr')
            var td = document.createElement('td')
            td.innerHTML = select[i]
            tr.appendChild(td)
            table.appendChild(tr)
      }
      
    };
    };
  }
  
  async function create_rows_to_table_from_nav_db() {
    const request = window.indexedDB.open("NAV_DB", 1);
    request.onsuccess = (e) => {
      const db = e.target.result;
      const transaction = db.transaction('tabelas', 'readwrite');
      const objectStore = transaction.objectStore('tabelas');
      const request = objectStore.getAll();
      request.onsuccess = (e) => {
        const data = e.target.result;
        for (let i = 0; i < data.length; i++) {
          table = document.getElementById('list_all_tables')
          //create table rows 
          var tr = document.createElement('tr')
          var td = document.createElement('td')
          td.innerHTML = data[i]
          tr.appendChild(td)
          table.appendChild(tr)
        }
      };
    };
  }
  
  function onchange_select_modulo(sel) {
    session_storage_modulo_gs(sel)
    insert_all_tables_in_nav_bd(select_all_tabelas_sistemas(localStorage.getItem('sistema_conectado_bd')))
  }
  