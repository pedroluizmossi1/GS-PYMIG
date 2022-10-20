from ctypes.wintypes import CHAR
import psycopg2
import pandas as pd
from tkinter import *
from tkinter import ttk

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


import cx_Oracle

def connect_oracle():
        con = cx_Oracle.connect('gondola/tgo12m50k@10.0.120.238/OURO')

        print(con.version)

        len_sql = (len(records))
        len_start = 0
        while len_start < len_sql:

            cur2 = con.cursor() 
            myvar = df[0][len_start]
            myvar2 = df[1][len_start]
            cur2.callproc('p_import_unidade_medida', (myvar,myvar2)) 
            len_start = len_start+1
            cur2.close() 
        con.commit()
        con.close()


