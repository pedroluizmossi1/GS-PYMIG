import cx_Oracle
from email.policy import default
import eel
from ctypes.wintypes import CHAR
import psycopg2
import pandas as pd
from tkinter import *
from tkinter import ttk
import sqlite3
import sys
import os
import configparser

#import python files
import templates.sistemas.logtec as logtec

# name of folder where the html, css, js, image files are located
eel.init('templates')


#Conexao SQLITE3
con_lite = sqlite3.connect("pymig.db")
cur_lite = con_lite.cursor()



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
    sys.exit(1)


@eel.expose
def read_parm_instant_client():
    return default_config.get('InstantClient')


# Abertura da Conexao ORACLE
@eel.expose
def connect_oracle(ora_login, ora_password, ora_host, ora_port, ora_service):

    dsn_tns = cx_Oracle.makedsn(ora_host, ora_port, service_name=ora_service)
    global con
    con = cx_Oracle.connect(user=ora_login, password=ora_password, dsn=dsn_tns)
    print(con.version)
    try:
        ora_conectado = 'Conectado'
    except BaseException as e:
        ora_conectado = e
    return ora_conectado

# Abertura da Conexao POSTGRES
@eel.expose
def connect_postgres(host,database,port,user,password):
    logtec.connect_postgres(host,database,port,user,password)

@eel.expose
def pos_con_close():
    logtec.pos_con_close()


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
def parm_instant_client(parm_instant_client_value,ora_user,ora_host,ora_port,ora_sid):
    cfgfile = open('config.ini', 'w')
    config.set('DEFAULT', 'InstantClient', parm_instant_client_value)
    config.set('ORA_CON', 'user', ora_user)
    config.set('ORA_CON', 'host', ora_host)
    config.set('ORA_CON', 'port', ora_port)
    config.set('ORA_CON', 'sid', ora_sid)
    config.write(cfgfile)
    cfgfile.close()





# Fechar conexao ORACLE
@eel.expose
def ora_con_close():
    con.close()
    print('Conexao Oracle Fechada')



#Select para validor os modulos da migração

def to_tuple(first_output):
        series = []
        for py_tuple in first_output:
            series.append(py_tuple[0])
        return tuple(series)

@eel.expose
def ora_mod_select():
    cur = con.cursor()
    cur.arraysize = 100
    cur.execute("""select ao.procedure_name from all_procedures ao
                                where ao.object_name like '%P_PYMIG%'
                                and ao.object_type = 'PACKAGE'
                                and ao.procedure_name is not null
                                """)                           
    employee=[]
    for i in cur:
        employee.append(i[0])
    print(employee)
    cur.close()  
    return(employee)
    



#Insert Unidades de medida oracle
df = (['KD', 'KI'],['KD', 'KI'])

@eel.expose
def ora_mod_un_medid():
    cur = con.cursor()
    len_sql = (len(df))
    len_start = 0
    while len_start < len_sql:

        cur = con.cursor() 
        myvar = df[0][len_start]
        myvar2 = df[1][len_start]
        cur.callproc('gondola.p_pymig_import_un_medid', (myvar,myvar2)) 
        len_start = len_start+1
        cur.close() 
    con.commit()

# 1000 is width of window and 600 is the height
eel.start('index.html', mode='default', size=(1000, 600))
