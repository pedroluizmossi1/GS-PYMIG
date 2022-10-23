from ctypes.wintypes import CHAR
import psycopg2
import pandas as pd
import sqlite3
import sys
import os
import configparser
import eel


# Conectar ao Postgres
def connect_postgres(host, database, port, user, password):

    global con_pos
    con_pos = psycopg2.connect(host=host,
                               database=database,
                               user=user,
                               port=port,
                               password=password)
    print('Postgres conectado')


# Fechar conexao POSTGRES
def pos_con_close():
    con_pos.close()
    print('Conexao Postgres Fechada')


# Execute a query
def select_seco():
    cur_pos = con_pos.cursor()
    cur_pos.execute("SELECT * FROM public.unidade_med")
    records = cur_pos.fetchall()
    df = pd.DataFrame(records)
    print(df[0][0])


@eel.expose
def insert_tabelas_sqlite():
    cur_pos = con_pos.cursor()
    cur_pos.execute(
        "SELECT table_name FROM information_schema.tables limit 10;")
    employee = []
    for i in cur_pos:
        employee.append(i[0])
    print(employee)
    cur_pos.close()
    return (employee)
