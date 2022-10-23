from ctypes.wintypes import CHAR
import psycopg2
import pandas as pd
import sqlite3
import sys
import os
import configparser
import eel

#Connect to your postgres DB
def connect_postgres(host,database,port,user,password):
    
    global con_pos
    con_pos = psycopg2.connect(host=host,
                    database=database,
                    user=user,
                    password=password)
    print('Postgres conectado')

# Execute a query
def select_seco():
    cur_pos = con_pos.cursor()
    cur_pos.execute("SELECT * FROM public.unidade_med")
    records = cur_pos.fetchall()
    df = pd.DataFrame(records)
    print(df[0][0])

# Fechar conexao POSTGRES
def pos_con_close():
    con_pos.close()
    print('Conexao Postgres Fechada')