$(document).ready(function(){
  $("#myBtn").click(function(){
      $("#myToast").toast("show");
  });

    ora_conectado_load_page();
    pos_conectado_load_page();


});




//Conexao Oracle
function conn_oracle(label, checkbox, message) {
  eel.connect_oracle(document.getElementById("oracle_user").value, document.getElementById("oracle_password").value, document.getElementById("oracle_host").value, document.getElementById("oracle_port").value, document.getElementById("oracle_sid").value)(function (number) {
    if (number == 'Conectado') {
      document.getElementById(message).removeAttribute("hidden")
    }

    document.getElementById(label).innerHTML = 'Conectado'
    sessionStorage.setItem(label, "Conectado")
    document.getElementById(label).style = "color: green"
    document.getElementById(checkbox).checked = true
    sessionStorage.setItem(checkbox, "true")
    document.getElementById(checkbox).disabled = false;
    //store label style color on session storage
    sessionStorage.setItem(label + "_color", document.getElementById(label).style.color)
  })
}
//Conexao Oracle

//Conexao Postgres
function conn_postgres(label, checkbox) {
  eel.connect_postgres(document.getElementById("postgres_host").value, document.getElementById("postgres_database").value, document.getElementById("postgres_port").value, document.getElementById("postgres_user").value, document.getElementById("postgres_password").value)(function (number) {
    document.getElementById(label).innerHTML = 'Conectado'
    sessionStorage.setItem(label, "Conectado")
    document.getElementById(checkbox).checked = true
    sessionStorage.setItem(checkbox, "true")
    document.getElementById(checkbox).disabled = false;
    document.getElementById(label).style = "color: green"
    sessionStorage.setItem(label + "_color", document.getElementById(label).style.color)
  })
}
//Conexao Postgres



async function ora_mod_select_js() {
  let select = await eel.select_sqlite_modulos_gs()();
  //extract value from select third column and console log it with for loop
  for (let i = 0; i < select.length; i++) {
    //extract select third column value and separate it with dot and create 3 variables and use eel.ora_mod_select() to get the value from python
    let [id, modulo, descricao] = select[i][2].split(".");
    console.log(id, modulo, descricao)    
    let select_ora = await eel.ora_mod_select(id, modulo, descricao)() 
      console.log(select_ora)

  


  }
}


// Onclick of the button
function ora_version() {
  // Call python's random_python function
  eel.ora_version()(function (number) {
    // Update the div with a random number returned by python
    document.querySelector(".random_number").innerHTML = number;
  })
}

function sistema_migrado(selectObject) {
  var value = selectObject.value;
  if (value == 1) {
    document.getElementById('show_logtec_modal').click();
    return false;
  }
}

function parm_instant_client_js() {
  eel.parm_instant_client(document.getElementById("save_parm_ins_cli_label").value,
    document.getElementById("oracle_user").value,
    document.getElementById("oracle_host").value,
    document.getElementById("oracle_port").value,
    document.getElementById("oracle_sid").value)
}

onload = function read_parm_instant_client_js() {
  eel.read_parm_instant_client()(function (read_value) {
    if (document.getElementById("save_parm_ins_cli_label")) {
      document.getElementById("save_parm_ins_cli_label").value = read_value
    }
  })
  //check flexSwitch_conectado_sqlite
  if (sessionStorage.getItem("flexSwitch_conectado_sqlite") == "true") {
    document.getElementById("flexSwitch_conectado_sqlite").checked = true
  }
  //check o status da conexao do SQLite
  sqlite_status_con_js()
  //carrega a lista de Sistemas.
  select_sqlite_sistemas_js();
  //carrega a lista de Modulos GS.
  select_sqlite_modulos_gs_js()

  eel.read_parm_ora_con()(function (read_value) {
    document.getElementById("oracle_user").value = read_value[0]
    document.getElementById("oracle_host").value = read_value[1]
    document.getElementById("oracle_port").value = read_value[2]
    document.getElementById("oracle_sid").value = read_value[3]
  })
  
}


function ora_con_close_js(label, checkbox) {
  eel.ora_con_close()
  sessionStorage.removeItem(checkbox);
  document.getElementById(checkbox).disabled = true
  document.getElementById(label).innerHTML = 'Desconectado'
  sessionStorage.setItem(label, "Desconectado")
  document.getElementById(label).style = "color: red"
  sessionStorage.setItem(label + "_color", document.getElementById(label).style.color)
}

function pos_con_close_js(label, checkbox) {
  eel.pos_con_close()
  sessionStorage.removeItem(checkbox);
  document.getElementById(checkbox).disabled = true
  document.getElementById(label).innerHTML = 'Desconectado'
  sessionStorage.setItem(label, "Desconectado")
  document.getElementById(label).style = "color: red"
  sessionStorage.setItem(label + "_color", document.getElementById(label).style.color)
}

function close_modal(modal_name) {
  document.getElementById(modal_name).setAttribute("hidden", "true")
}

async function insert_tabelas_sqlite_logtec_js() {
  let n = await eel.insert_tabelas_sqlite()();
  console.log(n.array)
  console.log(n.length)
  console.log(n)
  var i = 0;
  for (let i = 0; i < n.length; i++) {
    i++;
    var title = document.getElementById('drop_generate').value;
    var node = document.createElement('div');
    node.innerHTML = '<input type="text" class="form-control" placeholder="' + n[i] + '">'
    document.getElementById('drop_generate').appendChild(node);
  }



}


async function select_sqlite_sistemas_js() {
  let select = await eel.select_sqlite_sistemas()();
  console.log(select.array)
  console.log(select.length)
  console.log(select)
  for (let i = 0; i < select.length; i++) {
    var node = document.createElement('option')
    node.value = select.map(col => col[0])[i]
    node.innerHTML = select.map(col => col[1])[i]
    document.getElementById('drop_generate_sistemas').appendChild(node);
  }
}

function insert_sqlite_modulos_gs_js() {
  if (document.getElementById('modulo_nome_input').value != "" && document.getElementById('modulo_procedure_input').value != "" && document.getElementById('modulo_texto_input').value != "") {
    eel.insert_sqlite_modulos_gs(document.getElementById('modulo_nome_input').value, document.getElementById('modulo_procedure_input').value, document.getElementById('modulo_texto_input').value)
    refreshTable();
  }
  else
    alert('Campo Sem valor')
}

async function select_sqlite_modulos_gs_js() {
  let select = await eel.select_sqlite_modulos_gs()();
  console.log(select.array)
  console.log(select.length)
  console.log(select)
  for (let i = 0; i < select.length; i++) {

    $("#table_modulos_gs").find('tbody').append("<tr><th>" + select.map(col => col[0])[i] + "</th><th>" + select.map(col => col[1])[i] + '</th><th><input class="form-check-input" type="checkbox" value="" id="' + select.map(col => col[2])[i] + '"><label class="form-check-label" for="flexCheckDefault"></th></tr>"');
  }
}

async function select_sqlite_modulos_gs_util_js() {
  let select = await eel.select_sqlite_modulos_gs()();
  console.log(select.array)
  console.log(select.length)
  console.log(select)
  for (let i = 0; i < select.length; i++) {

    $("#table_modulos_gs_util").find('tbody').append("<tr id=" + 'row_modulos_gs' + "><th>" + select.map(col => col[0])[i] + "</th><th>" + select.map(col => col[1])[i] + '</th><th><input class="form-check-input" type="checkbox" " id="delete_modulos_gs_checkbox" value="' + select.map(col => col[0])[i] + '"><label class="form-check-label" for="delete_modulos_gs_checkbox"></th></tr>"');
    
  }
  return select
}


// JQUERY START
$(document).ready(function () {


});


function refreshTable() {
  $("row_modulos_gs").load("utility.html table", select_sqlite_modulos_gs_util_js())
  $("row_modulos_gs").load("utility.html table", deletetable())
}

function deletetable() {

  $("#table_modulos_gs_util_body").empty();

}

function delete_sqlite_modulos_gs_js() {
  var checked = $("input[type=checkbox]:checked").map(function () {
    return this.value;
  }).get();
  for (let i = 0; i < checked.length; i++) {
    eel.delete_sqlite_modulos_gs(checked[i])
  }
  console.log(checked)
  refreshTable();
}


//close sqlite3 connection
function close_sqlite_js() {
  eel.close_sqlite()
  console.log("Conexao SQlite Fechada")
}





//check sqlite connection status every 10 second
setInterval(function () {
  sqlite_status_con_js()

}, 10000);

async function sqlite_status_con_js(){
  let select = await eel.sqlite_status_con()();
if ( select == 0) {
  document.getElementById('sqlite_status').innerHTML = 'Conectado'
  document.getElementById('sqlite_status').style.color = 'green'
  document.getElementById('flexSwitch_conectado_sqlite').checked = true
  console.log(select)
}
else {
  document.getElementById('sqlite_status').innerHTML = 'Desconectado'
  document.getElementById('sqlite_status').style.color = 'red'
  document.getElementById('flexSwitch_conectado_sqlite').checked = false
  console.log(select)
}
}


//catch all Uncaught in promise alert and extract texterror it to output message
window.addEventListener('unhandledrejection', function (event) {
  var texterror = event.reason;
  //texterror object to string
  var texterror = JSON.stringify(texterror);
  //find "Cannot operate on a closed database" inside texterror
  var texterror = texterror.search("Cannot operate on a closed database");
  //if texterror is not -1 then show alert
  if (texterror != -1) {
    //show toast id="myToast" with message from var texterror
    document.getElementById('myToast_message').innerHTML = 'Erro: Conexao com o banco de dados SQlite3 foi fechada'
    $("#myToast").toast("show");
    document.getElementById('sqlite_status').innerHTML = 'Desconectado'
    document.getElementById('sqlite_status').style.color = 'red'
    document.getElementById('flexSwitch_conectado_sqlite').checked = false

    event.preventDefault();
}
});


function connect_sqlite_js() {
  eel.connect_sqlite()
  console.log("Conexao SQlite Aberta")
}

function ora_conectado_load_page() {
  if (sessionStorage.getItem("ora_conectado") == "Desconectado") {
    document.getElementById("ora_conectado").innerHTML = "Desconectado"
    document.getElementById("flexSwitch_conectado").checked = false
  }
    if (sessionStorage.getItem("ora_conectado") == "Conectado") {
    document.getElementById("ora_conectado").innerHTML = sessionStorage.getItem("ora_conectado")
    document.getElementById("ora_conectado").style = "color: " + sessionStorage.getItem("ora_conectado_color")
    document.getElementById("flexSwitch_conectado").checked = true
    document.getElementById("flexSwitch_conectado").disabled = false
  }
}

function pos_conectado_load_page() {
if (sessionStorage.getItem("sistema_conectado") == "Desconectado") {
  document.getElementById("sistema_conectado").innerHTML = "Desconectado"
  document.getElementById("flexSwitch_sistema_conectado").checked = false
}
if (sessionStorage.getItem("sistema_conectado") == "Conectado") {
  document.getElementById("sistema_conectado").innerHTML = sessionStorage.getItem("sistema_conectado")
  document.getElementById("sistema_conectado").style = "color: " + sessionStorage.getItem("sistema_conectado_color")
  document.getElementById("flexSwitch_sistema_conectado").checked = true
  document.getElementById("flexSwitch_sistema_conectado").disabled = false
}
}

