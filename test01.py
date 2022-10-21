from ctypes.wintypes import CHAR
import psycopg2
import pandas as pd
from tkinter import *
from tkinter import ttk
import sys
import os
import cx_Oracle

# Connect to your postgres DB
conn = psycopg2.connect(host='localhost', 
                         database='BARATAO',
                         user='postgres', 
                         password='91396851')

# Open a cursor to perform database operations
cur = conn.cursor()

# Execute a query
cur.execute("SELECT * FROM public.unidade_med")

# Retrieve query results
records = cur.fetchall()

df = pd.DataFrame(records)
print(df[0][0])





try:
    if sys.platform.startswith("darwin"):
        lib_dir = os.path.join(os.environ.get("HOME"), "Downloads",
                               "instantclient_19_8")
        cx_Oracle.init_oracle_client(lib_dir=lib_dir)
    elif sys.platform.startswith("win32"):
        lib_dir = (r'instantclient_21_7')
        cx_Oracle.init_oracle_client(lib_dir=lib_dir)
except Exception as err:
    print("Whoops!")
    print(err)
    sys.exit(1)

con = cx_Oracle.connect('gondola/tgo12m50k@10.0.120.238/migs01')

print(con.version)

df1 = pd.read_sql('SELECT sysdate FROM dual', con=con) 

print(df1)

def ora_mod_select():
    cur = con.cursor()
    cur.arraysize = 100
    cur.execute("SELECT sysdate FROM dual")                           
    res = cur.fetchall()
    cur.close()  
    return(res)

print(ora_mod_select())