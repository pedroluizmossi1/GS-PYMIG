function conn_oracle(){  
    eel.connect_oracle(document.getElementById("oracle_login").value,document.getElementById("oracle_password").value,document.getElementById("oracle_host").value,document.getElementById("oracle_port").value,document.getElementById("oracle_sid").value)(function(number){                      
        // Update the div with a random number returned by python
        document.getElementById("ora_conectado").innerHTML = number;
      }) // call the demo function which we have created in the main.py file
}

function insert_unidade(){
    eel.insert_unid()
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