import eel

from ctypes.wintypes import CHAR
import psycopg2
import pandas as pd
from tkinter import *
from tkinter import ttk
import cx_Oracle

# name of folder where the html, css, js, image files are located
eel.init('templates')

# Connect to your postgres DB
conn = psycopg2.connect(host='10.1.28.30', 
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


@eel.expose
def connect_oracle(ora_host,ora_port,ora_service):

    dsn_tns = cx_Oracle.makedsn(ora_host, ora_port, service_name=ora_service)
    con = cx_Oracle.connect(user=r'gondola', password='tgo12m50k', dsn=dsn_tns)
    print(con.version)
    def unidade_med(valor):         
        if valor == 1:
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
    unidade_med()

        



# 1000 is width of window and 600 is the height
eel.start('index.html', size=(1000, 600))