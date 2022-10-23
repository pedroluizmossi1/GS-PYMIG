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

# import python files
import templates.sistemas.logtec as logtec

# name of folder where the html, css, js, image files are located
eel.init('templates')


# Conexao SQLITE3
con_lite = sqlite3.connect("pymig.db")
cur_lite = con_lite.cursor()
# Conexao SQLITE3


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
def connect_postgres(host, database, port, user, password):
    logtec.connect_postgres(host, database, port, user, password)
# Abertura da Conexao POSTGRES
# Encerramento da Conexao POSTGRES


@eel.expose
def pos_con_close():
    logtec.pos_con_close()
# Encerramento da Conexao POSTGRES
# Select em todas tabelas


@eel.expose
def insert_tabelas_sqlite_logtec():
    logtec.insert_tabelas_sqlite()
    return logtec.insert_tabelas_sqlite()
# Select em todas tabelas


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


# Fechar conexao ORACLE
@eel.expose
def ora_con_close():
    con.close()
    print('Conexao Oracle Fechada')


# Select para validor os modulos da migração

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
    employee = []
    for i in cur:
        employee.append(i[0])
    print(employee)
    cur.close()
    return (employee)


# Insert Unidades de medida oracle
df = (['KD', 'KI'], ['KD', 'KI'])


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
    cur_lite.execute("select id_sistema, nome from sistemas")
    row = cur_lite.fetchall()
    print(row)
    return (row)

# Selecionar os modulos do GS cadastrados SQLITE.


@eel.expose
def select_sqlite_modulos_gs():
    cur_lite.execute("select id_modulo, nome, nome_procedure from modulos_gs")
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

@eel.expose
def check_sqlite_connection():
    try:
        cur_lite.execute("SELECT 1")
    except sqlite3.OperationalError:
        return 1
    return 0






# 1000 is width of window and 600 is the height
eel.start('index.html', mode='default', size=(1000, 600))
