$(document).ready(function(){
  var pathname = window.location.pathname;
    if ( pathname == '/index.html') {
    ora_conectado_load_page();
    pos_conectado_load_page();
    }
    sessionStorage.removeItem('sistema_migrado_id');
    sessionStorage.removeItem('modulos_gs_id');
});

function show_toast(title,message) {
  const toastLiveExample = document.getElementById('liveToast')
      const toast = new bootstrap.Toast(toastLiveExample)
      document.getElementById("toast_message").innerHTML = message
      document.getElementById("toast_origem").innerHTML = " " + title

      toast.show()
}

//Conexao Oracle
function conn_oracle(label, checkbox) {
  eel.connect_oracle(document.getElementById("oracle_user").value, document.getElementById("oracle_password").value, document.getElementById("oracle_host").value, document.getElementById("oracle_port").value, document.getElementById("oracle_sid").value)(function (number) {
    if (number[1] === true) {
      sessionStorage.setItem(label, "Conectado")
      sessionStorage.setItem("ora_conectado_color", "green")
      document.getElementById(label).style = "color: green"
      document.getElementById(checkbox).checked = true
      sessionStorage.setItem(checkbox, "true")
      document.getElementById(checkbox).disabled = false;
      document.getElementById("button_con_ora").disabled = true
      show_toast("Oracle",number[0])
    }
  })
}
//Conexao Oracle




//Conexao Postgres
function conn_postgres(label, checkbox) {
  eel.connect_postgres(document.getElementById("postgres_host").value,
  document.getElementById("postgres_database").value, 
  document.getElementById("postgres_port").value, 
  document.getElementById("postgres_user").value, 
  document.getElementById("postgres_password").value)(function (number) {
  if (number[1] === true){
  sessionStorage.setItem(label, "Conectado")
  document.getElementById(checkbox).checked = true
  sessionStorage.setItem(checkbox, "true")
  document.getElementById(checkbox).disabled = false;
  document.getElementById(label).style = "color: green"
  sessionStorage.setItem(label + "_color", document.getElementById(label).style.color)
  sessionStorage.setItem("sistema_conectado_bd", "POSTGRES")
  document.getElementById("drop_generate_sistemas").disabled = true
  show_toast("Postgres",number[0])
  }
  })
}
//Conexao Postgres

//Conexao Firebird
function conn_firebird(label, checkbox) {
  var firebird_host = document.getElementById("firebird_host").value;
  var firebird_database = document.getElementById("firebird_database").value;
  var firebird_port = document.getElementById("firebird_port").value;
  var firebird_user = document.getElementById("firebird_user").value;
  var firebird_password = document.getElementById("firebird_password").value;
  var firebird_charset = document.getElementById("firebird_charset").value;
  eel.connect_firebird(firebird_host,firebird_database,firebird_port,firebird_user,firebird_password,firebird_charset)(function (number) {
    sessionStorage.setItem(label, "Conectado")
    document.getElementById(checkbox).checked = true
    sessionStorage.setItem(checkbox, "true")
    document.getElementById(checkbox).disabled = false;
    document.getElementById(label).style = "color: green"
    sessionStorage.setItem(label + "_color", document.getElementById(label).style.color)
    sessionStorage.setItem("sistema_conectado", "FIREBIRD")

    alert(firebird_file)
  })
}

//Conexao Firebird



async function ora_mod_select_js() {
  let select = await eel.select_sqlite_modulos_gs()();
  //extract value from select third column and console log it with for loop
  for (let i = 0; i < select.length; i++) {
    //extract select third column value and separate it with dot and create 3 variables and use eel.ora_mod_select() to get the value from python
    let [id, modulo, descricao] = select[i][2].split(".");
    let select_ora = await eel.ora_mod_select(id, modulo, descricao)() 
    if (select_ora == true) {
      modulo_gs_ora = id +'.'+ modulo +'.'+ descricao
      document.getElementById(modulo_gs_ora).checked = true
      ;
    }
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
var pathname = window.location.pathname;
function sistema_migrado(selectObject) {
  var value = document.querySelector('#'+selectObject.id);
  var index = value.options[value.selectedIndex].id;
  if (pathname == '/index.html'){
  if (index == "POSTGRES") {
    //show modal with this parameter data-bs-toggle data-bs-target
    //Document.getElementById('modal_postgres').setAttribute("data-bs-toggle", "collapse")
    document.getElementById('show_postgres_modal').click();
  } else if (index == "FIREBIRD") {
    document.getElementById('show_firebird_modal').click();
  } else if (index == "ORACLE") {
    document.getElementById('show_oracle_modal').click();
  } else if (index == "SQLSERVER") {
    document.getElementById('show_sqlserver_modal').click();
  } else if (index == "MYSQL") {
    document.getElementById('show_mysql_modal').click();
  } else {
  }
  }
  var value2 = document.querySelector('#'+selectObject.id);
  var index2 = value2.options[value2.selectedIndex].value;
  sessionStorage.setItem("sistema_conectado__bd_mig", index2)
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
  if(pathname == '/index.html'){
  select_sqlite_sistemas_js();
  }
  //carrega a lista de Modulos GS.
  select_sqlite_modulos_gs_js()

  if(pathname == '/utility.html'){
  }
  else{
    eel.read_parm_ora_con()(function (read_value) {
      document.getElementById("oracle_user").value = read_value[0]
      document.getElementById("oracle_host").value = read_value[1]
      document.getElementById("oracle_port").value = read_value[2]
      document.getElementById("oracle_sid").value = read_value[3]
    })
  }
}


function ora_con_close_js(label, checkbox) {
  eel.ora_con_close()
  sessionStorage.removeItem(checkbox);
  document.getElementById(checkbox).disabled = true
  sessionStorage.setItem(label, "Desconectado")
  document.getElementById(label).style = "color: red"
  sessionStorage.setItem(label + "_color", document.getElementById(label).style.color)
  document.getElementById("button_con_ora").disabled = false
}

function pos_con_close_js(label, checkbox) {
  eel.pos_con_close()
  sessionStorage.removeItem(checkbox);
  document.getElementById(checkbox).disabled = true
  sessionStorage.setItem(label, "Desconectado")
  document.getElementById(label).style = "color: red"
  sessionStorage.setItem(label + "_color", document.getElementById(label).style.color)
  document.getElementById("drop_generate_sistemas").disabled = false
}

function close_modal(modal_name) {
  document.getElementById(modal_name).setAttribute("hidden", "true")
}

async function insert_tabelas_sqlite_logtec_js() {
  let n = await eel.insert_tabelas_sqlite()();
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
  for (let i = 0; i < select.length; i++) {
    var node = document.createElement('option')
    node.value = select.map(col => col[0])[i]
    node.innerHTML = select.map(col => col[1])[i]
    node.id = select.map(col => col[2])[i]
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
  for (let i = 0; i < select.length; i++) {

    $("#table_modulos_gs").find('tbody').append("<tr><th>" + select.map(col => col[0])[i] + "</th><th>" + select.map(col => col[1])[i] + '</th><th><input class="form-check-input" type="checkbox" value="" id="' + select.map(col => col[2])[i] + '"><label class="form-check-label" for="flexCheckDefault"></th></tr>"');
  }
}

async function select_sqlite_modulos_gs_util_js() {
  let select = await eel.select_sqlite_modulos_gs()();
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
}
else {
  document.getElementById('sqlite_status').innerHTML = 'Desconectado'
  document.getElementById('sqlite_status').style.color = 'red'
  document.getElementById('flexSwitch_conectado_sqlite').checked = false
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
    document.getElementById("flexSwitch_conectado").checked = false
  }
    if (sessionStorage.getItem("ora_conectado") == "Conectado") {
    document.getElementById("ora_conectado").style = "color: " + sessionStorage.getItem("ora_conectado_color")
    document.getElementById("flexSwitch_conectado").checked = true
    document.getElementById("flexSwitch_conectado").disabled = false
    document.getElementById("button_con_ora").disabled = true
  }
}

function pos_conectado_load_page() {
if (sessionStorage.getItem("sistema_conectado") == "Desconectado") {
  document.getElementById("flexSwitch_sistema_conectado").checked = false
}
if (sessionStorage.getItem("sistema_conectado") == "Conectado") {
  document.getElementById("sistema_conectado").style = "color: " + sessionStorage.getItem("sistema_conectado_color")
  document.getElementById("flexSwitch_sistema_conectado").checked = true
  document.getElementById("flexSwitch_sistema_conectado").disabled = false
  document.getElementById("drop_generate_sistemas").disabled = true 
}
}

//Utilitarios Configurações de sistemas
function show_sistemas_config() {
  
  document.getElementById("sistemas_config").innerHTML = `<div class="text-start">
  <div class="mb-3">
      <label for="sistema_nome" class="form-label ">Nome do Sistema</label>
  <input class="form-control rounded-5" id="sistema_nome" aria-describedby="Sistema 01">
</div>
<div class="mb-3">
  <label for="sistema_bd" class="form-label ">Banco de dados do Sistema</label>
  <select class="form-select rounded-5" aria-label="Default select example" id="select_tipo_bd">
      <option selected>Selecione o Banco de Dados</option>
    </select>
</div>
</div>
<div class="mb-3">
                        <table class="table text-center" id="table_sistemas_gs_util_body">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Sistema</th>
                                    <th scope="col">Excluir?</th>
                                </tr>
                            </thead>
                            <tbody class="text-center" id="table_sistemas_gs_util_body">
                                <tr>
                                </tr>
                            </tbody>
                        </table>
                    </div>
<div class="text-end">
<button class="btn btn-success rounded-5" onclick="insert_sqlite_sistemas_gs_js()">Salvar</button>
<button class="btn btn-danger rounded-5" onclick="delete_sqlite_sistemas_gs_js()">Excluir</button>
<button type="button" class="btn btn-secondary rounded-5" onclick="hidden_sistemas_config()">Fechar</button>
</div>`
  select_sqlite_bd_gs_js()
  select_sqlite_sistemas_util_js()
}

function show_tabelas_sistemas_config() {
  
  document.getElementById("sistemas_config").innerHTML = `<div class="text-start">
  <div class="mb-3">
  <select class="form-select rounded-5" onchange="sistema_migrado_id(this)"
                    aria-label="Default select example" id="drop_generate_sistemas">
                    <option>Escolha o Sistema para Criar a Tabela de Verificação</option>
                  </select>
  </div>
  <div class="mb-3">
      <label for="nome_tabela_sistema" class="form-label">Nome da Tabela</label>
  <input class="form-control rounded-5" id="nome_tabela_sistema" aria-describedby="Sistema 01">
  <div id="nome_tabela_sistema_help" class="form-text">Cuidado a exclusão utiliza o ID do Sistema e o Nome da tabela.</div>
</div>
<div class="mb-3">
  <label for="modulo_gs_ora_util" class="form-label"></label>
  <select class="form-select rounded-5" onchange="session_storage_modulo_gs(this)" aria-label="Default select example" id="modulo_gs_ora_util">
      <option selected>Selecione o Modulo do GS</option>
    </select>
</div>
</div>
<div class="mb-3">
                        <table class="table text-center rounded-5" id="table_sistemas_gs_util_body">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Tabela</th>
                                    <th scope="col">ID Modulo</th>
                                    <th scope="col">Excluir?</th>
                                </tr>
                            </thead>
                            <tbody class="text-center rounded-5" id="table_sistemas_gs_util_body">
                                <tr>
                                </tr>
                            </tbody>
                        </table>
                    </div>
<div class="text-end">
<button class="btn btn-success rounded-5" onclick="insert_sqlite_sistemas_tabela_gs_js()">Salvar</button>
<button class="btn btn-danger rounded-5" onclick="delete_sqlite_tabela_sistemas_gs_js()">Excluir</button>
<button type="button" class="btn btn-secondary rounded-5" onclick="hidden_sistemas_config()">Fechar</button>
</div>`
select_sqlite_sistemas_js()
select_sqlite_modulos_gs_drop_js()
}

async function select_sqlite_bd_gs_js() {
  let select = await eel.select_sqlite_bd_gs()();
  for (let i = 0; i < select.length; i++) {
    var node = document.createElement('option')
    node.value = select.map(col => col[0])[i]
    node.innerHTML = select.map(col => col[0])[i]
    node.id = select.map(col => col[0])[i]
    document.getElementById('select_tipo_bd').appendChild(node);
  }
}

function insert_sqlite_sistemas_gs_js() {
  var value = document.querySelector('#select_tipo_bd');
  var index = value.options[value.selectedIndex].id;
  if (document.getElementById('sistema_nome').value != "" && index != "") {
    eel.insert_sqlite_sistemas_gs(document.getElementById('sistema_nome').value,index)
    show_sistemas_config()
  }
  else
    alert('Campo Sem valor')
}

async function insert_tabelas_sqlite_logtec_js() {
  let n = await eel.insert_tabelas_sqlite()();
  var i = 0;
  for (let i = 0; i < n.length; i++) {
    i++;
    var title = document.getElementById('drop_generate').value;
    var node = document.createElement('div');
    node.innerHTML = '<input type="text" class="form-control" placeholder="' + n[i] + '">'
    document.getElementById('drop_generate').appendChild(node);
  }

}

async function select_sqlite_sistemas_util_js() {
  let select = await eel.select_sqlite_sistemas()();
  for (let i = 0; i < select.length; i++) {

    $("#table_sistemas_gs_util_body").find('tbody').append("<tr id=" + 'row_modulos_gs' + "><th>" + select.map(col => col[0])[i] + "</th><th>" + select.map(col => col[1])[i] + '</th>"'+'"<th><input  class="form-check-input" type="checkbox" id="delete_modulos_gs_checkbox"value="' + select.map(col => col[0])[i] + '"><label class="form-check-label" for="delete_modulos_gs_checkbox></th></tr>"');
    
  }
  return select
}

function delete_sqlite_sistemas_gs_js() {
  var checked = $("input[type=checkbox]:checked").map(function () {
    return this.value;
  }).get();
  for (let i = 0; i < checked.length; i++) {
    eel.delete_sqlite_sistemas_gs(checked[i])
  }
  console.log(checked)
  show_sistemas_config()
}

async function select_sqlite_modulos_gs_drop_js() {
  let select = await eel.select_sqlite_modulos_gs()();
    for (let i = 0; i < select.length; i++) {
      var node = document.createElement('option')
      node.value = select.map(col => col[0])[i]
      node.innerHTML = select.map(col => col[1])[i]
      node.id = select.map(col => col[2])[i]
      document.getElementById('modulo_gs_ora_util').appendChild(node);
      console.log(select.map(col => col[1])[i])

  }
}

function insert_sqlite_sistemas_tabela_gs_js() {
  var value = document.querySelector('#modulo_gs_ora_util');
  var index = value.options[value.selectedIndex].value;
  
  if (document.getElementById('nome_tabela_sistema').value != "" && index != "" && $.isNumeric(sessionStorage.getItem('modulo_gs_id'))) {
    eel.insert_sqlite_sistemas_tabela_gs(document.getElementById('drop_generate_sistemas').value , document.getElementById('nome_tabela_sistema').value ,index )
    select_sqlite_sistemas_tabela_gs_js(sessionStorage.getItem('sistema_migrado_id'))
  }
  else
    alert('Campo Sem valor')  
}

async function select_sqlite_sistemas_tabela_gs_js(id) {
  $("#table_sistemas_gs_util_body").find('tbody').empty();
  let select = await eel.select_sqlite_sistemas_tabela_gs(id)();
  for (let i = 0; i < select.length; i++) {
    $("#table_sistemas_gs_util_body").find('tbody').append("<tr id=" + 'row_modulos_gs' + "><th>" + select.map(col => col[0])[i] + "</th><th>" + select.map(col => col[1])[i] + "</th><th>" + select.map(col => col[2])[i] + '</th><th><input  class="form-check-input" type="checkbox" id="'+select.map(col => col[1])[i]+'" value="' + select.map(col => col[0])[i] + '"><label class="form-check-label" for="delete_modulos_gs_checkbox></th></tr>"');
  }
}

function sistema_migrado_id(selectObject) {
  var value = document.querySelector('#'+selectObject.id);
  var index = value.options[value.selectedIndex].value;
  select_sqlite_sistemas_tabela_gs_js(index)
  sessionStorage.setItem('sistema_migrado_id', index);
}

function delete_sqlite_tabela_sistemas_gs_js() {
  var checked = $("input[type=checkbox]:checked").map(function () {
    return this.value;
  }).get();
  var checked2 = $("input[type=checkbox]:checked").map(function () {
    return this.id;
  }).get();
  for (let i = 0; i < checked.length; i++) {
    eel.delete_sqlite_tabela_sistemas_gs(checked[i],checked2[i])
  }
  console.log(checked)
  select_sqlite_sistemas_tabela_gs_js(sessionStorage.getItem('sistema_migrado_id'))
}

function session_storage_modulo_gs(sel) {
  sessionStorage.setItem('modulo_gs_id', sel.value);
}

function hidden_sistemas_config() {
  document.getElementById('sistemas_config').innerHTML = '';
}
//Utilitarios Configurações de sistemas