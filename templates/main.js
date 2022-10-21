function conn_oracle(label,checkbox,message){  
  eel.connect_oracle(document.getElementById("oracle_user").value,document.getElementById("oracle_password").value,document.getElementById("oracle_host").value,document.getElementById("oracle_port").value,document.getElementById("oracle_sid").value)(function(number){                      
      if (number == 'Conectado') {
        document.getElementById(message).removeAttribute("hidden")        
      }

      document.getElementById(label).innerHTML = 'Conectado'
      sessionStorage.setItem(label,"Conectado")
      document.getElementById(checkbox).checked = true
      sessionStorage.setItem(checkbox,"true")
      document.getElementById(checkbox).disabled = false;
    }) 
}

function conn_postgres(label,checkbox){  
  eel.connect_postgres(document.getElementById("postgres_host").value,document.getElementById("postgres_database").value,document.getElementById("postgres_port").value,document.getElementById("postgres_user").value,document.getElementById("postgres_password").value)(function(number){                      
      document.getElementById(label).innerHTML = 'Conectado'
      sessionStorage.setItem(label,"Conectado")
      document.getElementById(checkbox).checked = true
      sessionStorage.setItem(checkbox,"true")
      document.getElementById(checkbox).disabled = false;
    }) 
}


async function ora_mod_select_js() {
  // Inside a function marked 'async' we can use the 'await' keyword.

  let n = await eel.ora_mod_select()(); // Must prefix call with 'await', otherwise it's the same syntax     
  console.log(n)
  console.log(n.includes("P_PYMIG_IMPORT_UN_MEDID"))
  if (n.includes("P_IMPORT_UN_MEDID") == true) {
      document.getElementById("flexCheck_valid_un_medid").setAttribute("checked","true")
  }
  if (n.includes("P_IMPORT_DEPT") == true) {
    document.getElementById("flexCheck_valid_dept").setAttribute("checked","true")
  }

}

// Onclick of the button
function ora_version() {  
    // Call python's random_python function
    eel.ora_version()(function(number){                      
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

function parm_instant_client_js(){
  eel.parm_instant_client(document.getElementById("save_parm_ins_cli_label").value,
  document.getElementById("oracle_user").value,
  document.getElementById("oracle_host").value,
  document.getElementById("oracle_port").value,
  document.getElementById("oracle_sid").value)
}

onload = function read_parm_instant_client_js(){
  eel.read_parm_instant_client()(function(read_value){
  if (document.getElementById("save_parm_ins_cli_label"))  {
      document.getElementById("save_parm_ins_cli_label").value = read_value
  } 
  })

  eel.read_parm_ora_con()(function(read_value){
  document.getElementById("oracle_user").value = read_value[0]
  document.getElementById("oracle_host").value = read_value[1]
  document.getElementById("oracle_port").value = read_value[2]
  document.getElementById("oracle_sid").value = read_value[3]
  })

   
    /*Check BOX ORACLE*/
    if (sessionStorage.getItem("ora_conectado") == null) {
      document.getElementById("ora_conectado").innerHTML = "Desconectado"
    } else {
      document.getElementById("ora_conectado").innerHTML = sessionStorage.getItem("ora_conectado")
    }
    
    if (sessionStorage.getItem("flexSwitch_conectado").value == 0) {
      document.getElementById("flexSwitch_conectado").checked = 'false'
    }  else {
      document.getElementById("flexSwitch_conectado").checked = sessionStorage.getItem("flexSwitch_conectado")
      document.getElementById("flexSwitch_conectado").disabled = false
    }
  
    /*Check BOX LOGTEC*/
    if (sessionStorage.getItem("sistema_conectado") == null) {
      document.getElementById("sistema_conectado").innerHTML = "Desconectado"
    } else {
      document.getElementById("sistema_conectado").innerHTML = sessionStorage.getItem("sistema_conectado")
    }
    
    if (sessionStorage.getItem("flexSwitch_sistema_conectado").value == 0) {
      document.getElementById("flexSwitch_sistema_conectado").checked = 'false'
    }  else {
      document.getElementById("flexSwitch_sistema_conectado").checked = sessionStorage.getItem("flexSwitch_sistema_conectado")
      document.getElementById("flexSwitch_sistema_conectado").disabled = false
    }
  
}


function ora_con_close_js(label,checkbox){ 
  eel.ora_con_close()
  sessionStorage.removeItem(checkbox);
  document.getElementById(checkbox).disabled = true
  document.getElementById(label).innerHTML = 'Desconectado'
  sessionStorage.setItem(label,"Desconectado")
}

function pos_con_close_js(label,checkbox){ 
  eel.pos_con_close()
  sessionStorage.removeItem(checkbox);
  document.getElementById(checkbox).disabled = true
  document.getElementById(label).innerHTML = 'Desconectado'
  sessionStorage.setItem(label,"Desconectado")
}

function close_modal(modal_name) {
  document.getElementById(modal_name).setAttribute("hidden", "true")
}