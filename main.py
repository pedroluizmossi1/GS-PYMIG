from logging import exception
from statistics import mode
import cx_Oracle
from email.policy import default
import eel
from ctypes.wintypes import CHAR
import pandas as pd
from tkinter import *
from tkinter import ttk
from tkinter import filedialog
import sqlite3
import sys
import os
import configparser

# import python files
import sistemas.firebird_test as firebird
import sistemas.logtec_sistemas as logtec_sistemas


# name of folder where the html, css, js, image files are located
eel.init('templates')


# Conexao SQLITE3
con_lite = sqlite3.connect("pymig.db")
cur_lite = con_lite.cursor()

# Conexao SQLITE3
@eel.expose
def connect_sqlite():
    global con_lite
    global cur_lite
    con_lite = sqlite3.connect("pymig.db")
    cur_lite = con_lite.cursor()

# close SQLITE3 connection
@eel.expose
def close_sqlite():
    con_lite.close()
    return "Conexao SQlite Fechada"


# Configuçao do config.ini
config = configparser.ConfigParser()
config.read('config.ini')
default_config = config['DEFAULT']
config.read('config.ini')
print(default_config.get('InstantClient'))
# Configuçao do config.ini


# Variavel de ambiente do Instant Client - Inicio
try:
    if sys.platform.startswith("darwin"):
        lib_dir = os.path.join(os.environ.get("HOME"), "Downloads",
                               "instantclient_19_8")
        cx_Oracle.init_oracle_client(lib_dir=lib_dir)
    elif sys.platform.startswith("win32"):
        lib_dir = (r'' + default_config.get('InstantClient'))
        cx_Oracle.init_oracle_client(lib_dir=lib_dir)
except Exception as err:
    print("Whoops!")
    print(err)
    #basic tkinter file explorer
    root = Tk()
    root.title('Selecione o caminho do Instant Client')
    root.filename = filedialog.askdirectory(initialdir="/", title="Selecione o caminho do Instant Client")
    print(root.filename)
    config['DEFAULT']['InstantClient'] = root.filename
    with open('config.ini', 'w') as configfile:
        config.write(configfile)
    root.destroy()
    lib_dir = (r'' + default_config.get('InstantClient'))
    cx_Oracle.init_oracle_client(lib_dir=lib_dir)

# Variavel de ambiente do Instant Client - Fim


@eel.expose
def read_parm_instant_client():
    return default_config.get('InstantClient')


# Abertura da Conexao ORACLE
@eel.expose
def connect_oracle(ora_login, ora_password, ora_host, ora_port, ora_service):
    try:
        dsn_tns = cx_Oracle.makedsn(ora_host, ora_port, service_name=ora_service)
        global con
        con = cx_Oracle.connect(user=ora_login, password=ora_password, dsn=dsn_tns)
        print(con.version)
        ora_conectado = ("Oracle Conectado", True)
        print(ora_conectado)
        return ora_conectado
    except :
        ora_conectado = ('Erro ao Conectar ao Oracle', False)
        print(ora_conectado)
        return ora_conectado



# Fechar conexao ORACLE
@eel.expose
def ora_con_close():
    con.close()
    print('Conexao Oracle Fechada')


# Encerramento da Conexao POSTGRES
@eel.expose
def pos_con_close():
    logtec_sistemas.pos_con_close()
# Encerramento da Conexao POSTGRES

# Select em todas tabelas
@eel.expose
def insert_tabelas_sqlite_logtec():
    logtec_sistemas.insert_tabelas_sqlite()
    return logtec_sistemas.insert_tabelas_sqlite()

# Abertura da Conexao FIREBIRD
@eel.expose
def connect_firebird(host, database, port, user, password, charset):
    firebird.connect_firebird(host, database, port, user, password, charset)
# Abertura da Conexao FIREBIRD

# Encerramento da Conexao FIREBIRD
@eel.expose
def fire_con_close():
    firebird.fire_con_close()
# Encerramento da Conexao FIREBIRD



@eel.expose
def insert_unid():
    print('Migrado')
    cur = con.cursor()
    cur.execute(
        "insert into unid_medid(um_sig,um_nom,dat_alter) values ('KD','KD',sysdate)")
    con.commit()


@eel.expose
def ora_version():
    cur = con.cursor()
    cur.execute("select banner from v$version")
    rows = cur.fetchmany(1)
    print('Migrado')
    eel.ora_version(cur.fetchmany(1))
    return rows


@eel.expose
def parm_ora_con(user, host, port, sid):
    cfgfile = open('config.ini', 'w')
    config.set('ORA_CON', 'user', user)
    config.set('ORA_CON', 'host', host)
    config.set('ORA_CON', 'port', port)
    config.set('ORA_CON', 'sid', sid)
    config.write(cfgfile)
    cfgfile.close()


@eel.expose
def read_parm_ora_con():
    return config.get('ORA_CON', 'user'), config.get('ORA_CON', 'host'), config.get('ORA_CON', 'port'), config.get('ORA_CON', 'sid')


@eel.expose
def parm_instant_client(parm_instant_client_value, ora_user, ora_host, ora_port, ora_sid):
    cfgfile = open('config.ini', 'w')
    config.set('DEFAULT', 'InstantClient', parm_instant_client_value)
    config.set('ORA_CON', 'user', ora_user)
    config.set('ORA_CON', 'host', ora_host)
    config.set('ORA_CON', 'port', ora_port)
    config.set('ORA_CON', 'sid', ora_sid)
    config.write(cfgfile)
    cfgfile.close()



# Select para validor os modulos da migração
@eel.expose
def ora_mod_select(user_name,package_name,procedure_name):
    print(user_name,package_name,procedure_name)
    cur = con.cursor()
    sql = ('''select owner||'.'||object_name||'.'||procedure_name  from all_procedures where object_name = upper(:1) and procedure_name = upper(:2) and owner = upper(:3)''')
    bind = (package_name, procedure_name, user_name)
    select = cur.execute(sql, bind)
    select = cur.fetchone()
    while True:
        if select is None:
            print(select)
            return False
        elif select is not None:
            return True

df = ()
@eel.expose
def ora_mod_un_medid():
    cur = con.cursor()
    len_sql = (len(df))
    len_start = 0
    while len_start < len_sql:

        cur = con.cursor()
        myvar = df[0][len_start]
        myvar2 = df[1][len_start]
        cur.callproc('gondola.p_pymig_import_un_medid', (myvar, myvar2))
        len_start = len_start+1
        cur.close()
    con.commit()

# Selecionar os sistemas cadastrados SQLITE.
@eel.expose
def select_sqlite_sistemas():
    cur_lite.execute("select id_sistema, nome, tipo_bd from sistemas")
    row = cur_lite.fetchall()
    print(row)
    return (row)

# Selecionar os modulos do GS cadastrados SQLITE.
@eel.expose
def select_sqlite_modulos_gs():
    cur_lite.execute("select id_modulo, nome, nome_procedure from modulos_gs")
    row = cur_lite.fetchall()
    return (row)

# Selecionar os bancos de dados cadastrados SQLITE.
@eel.expose
def select_sqlite_bd_gs():
    cur_lite.execute("select tipo_bd from tipo_bd")
    row = cur_lite.fetchall()
    return (row)


# Inserir Modulos migrados SQLITE.
@eel.expose
def insert_sqlite_modulos_gs(modulo_nome, modulo_procedure, modulo_texto):
    cur_lite.execute("SELECT max(id_modulo) FROM modulos_gs")
    next_primary_key = cur_lite.fetchone()
    next_primary_key = next_primary_key[0]
    if next_primary_key is None:
        next_primary_key = 0
    next_primary_key = next_primary_key + 1
    sqlite_insert_with_param = "INSERT INTO modulos_gs (id_modulo,nome, nome_procedure, texto_procedure) VALUES (?,?,?,?)"
    data_tuple = (next_primary_key, modulo_nome,
                  modulo_procedure, modulo_texto)
    cur_lite.execute(sqlite_insert_with_param, data_tuple)
    con_lite.commit()
    return (next_primary_key, modulo_nome, modulo_procedure, modulo_texto)


@eel.expose
def delete_sqlite_modulos_gs(id_modulo_del):
    sqlite_delete_with_param = "delete from modulos_gs where id_modulo = ?"
    cur_lite.execute(sqlite_delete_with_param, (id_modulo_del,))
    con_lite.commit()
    print(id_modulo_del)
    return(id_modulo_del)


#check sqlite status conexao
@eel.expose
def sqlite_status_con():
    cur_lite.execute("select 1")
    status = cur_lite.fetchone()
    status = status[0]
    if  status == 1:
        return 0
    else:
        return 1


@eel.expose
def insert_sqlite_sistemas_gs(sistema_nome, sistema_tipo_bd):
    cur_lite.execute("SELECT max(id_sistema) FROM sistemas")
    next_primary_key = cur_lite.fetchone()
    print(next_primary_key)
    next_primary_key = next_primary_key[0]
    if next_primary_key is None:
        next_primary_key = 0
    next_primary_key = next_primary_key + 1
    sqlite_insert_with_param = "INSERT INTO sistemas (id_sistema,nome,tipo_bd) VALUES (?,?,?)"
    data_tuple = (next_primary_key, sistema_nome,sistema_tipo_bd)
    cur_lite.execute(sqlite_insert_with_param, data_tuple)
    con_lite.commit()
    print(next_primary_key, sistema_nome, sistema_tipo_bd)
    return (next_primary_key, sistema_nome, sistema_tipo_bd)


@eel.expose
def delete_sqlite_sistemas_gs(id_sistema_del):
    sqlite_delete_with_param = "delete from sistemas where id_sistema = ?"
    cur_lite.execute(sqlite_delete_with_param, (id_sistema_del,))
    con_lite.commit()
    print(id_sistema_del)
    return(id_sistema_del)

@eel.expose
def insert_sqlite_sistemas_tabela_gs(id_sistema, nome,id_modulo):
    sqlite_insert_with_param = "INSERT INTO sistemas_tabelas (id_sistema,tabela,id_modulo) VALUES (?,?,?)"
    data_tuple = (id_sistema, nome,id_modulo)
    cur_lite.execute(sqlite_insert_with_param, data_tuple)
    con_lite.commit()
    return (id_sistema, nome, id_modulo)  

#select sistemas_tabelas
@eel.expose
def select_sqlite_sistemas_tabela_gs(id):
    #use id to select the table name and id_sistema
    cur_lite.execute("select id_sistema, tabela, id_modulo from sistemas_tabelas where id_sistema = ?", (id,))
    row = cur_lite.fetchall()
    print(row)
    return (row)

@eel.expose
def delete_sqlite_tabela_sistemas_gs(id_sistema,tabela):
    sqlite_delete_with_param = "delete from sistemas_tabelas where id_sistema = ? and tabela = ?"
    cur_lite.execute(sqlite_delete_with_param, (id_sistema,tabela))
    con_lite.commit()
    print(id_sistema,tabela)
    return(id_sistema,tabela)



# 1000 is width of window and 600 is the height
eel.start('index.html', mode='default', size=(1366, 768))



