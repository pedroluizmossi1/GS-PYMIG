import eel
from ctypes.wintypes import CHAR
import psycopg2
import pandas as pd
from tkinter import *
from tkinter import ttk
import cx_Oracle
import sys
import os

# name of folder where the html, css, js, image files are located
eel.init('templates')

# Connect to your postgres DB
#conn = psycopg2.connect(host='10.1.28.30', 
#                         database='BARATAO',
#                         user='postgres', 
#                         password='91396851')

# Open a cursor to perform database operations
#cur = conn.cursor()

# Execute a query
#cur.execute("SELECT * FROM public.unidade_med")

# Retrieve query results
#records = cur.fetchall()

#df = pd.DataFrame(records)
#print(df[0][0])



#Variavel de ambiente do Instant Client - Inicio

try:
    if sys.platform.startswith("darwin"):
        lib_dir = os.path.join(os.environ.get("HOME"), "Downloads",
                               "instantclient_19_8")
        cx_Oracle.init_oracle_client(lib_dir=lib_dir)
    elif sys.platform.startswith("win32"):
        lib_dir=r"instantclient_21_7"
        cx_Oracle.init_oracle_client(lib_dir=lib_dir)
except Exception as err:
    print("Whoops!")
    print(err);
    sys.exit(1);

#Variavel de ambiente do Instant Client - FIM

#Abertura da Conexao ORACLE
@eel.expose
def connect_oracle(ora_login,ora_password,ora_host,ora_port,ora_service):

    dsn_tns = cx_Oracle.makedsn(ora_host, ora_port, service_name=ora_service)
    global con
    con = cx_Oracle.connect(user=ora_login, password=ora_password, dsn=dsn_tns)
    print(con.version)
    ora_conectado = 'Conectado'
    return ora_conectado


@eel.expose
def insert_unid():
    print('Migrado')
    cur = con.cursor()
    cur.execute("insert into unid_medid(um_sig,um_nom,dat_alter) values ('KD','KD',sysdate)")
    con.commit()


@eel.expose
def ora_version():
    cur = con.cursor()
    cur.execute("select banner from v$version")
    rows = cur.fetchmany(1)
    print('Migrado')
    eel.ora_version(cur.fetchmany(1))
    return rows



# 1000 is width of window and 600 is the height
eel.start('index.html', mode='default', size=(1000, 600)) 