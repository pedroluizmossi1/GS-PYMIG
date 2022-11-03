import pandas as pd
import eel
import firebirdsql


# abertura da conexao FIREBIRD
def connect_firebird(host, database, port, user, password, charset):
    global con_fire
    try:
        con_fire = firebirdsql.connect(
        host = host,
        database = database,
        port = port,
        user = user,
        password = password,
        charset = charset)
        print('Firebird conectado')
        return ("Postgres conectado", True)
    except:
        print('Erro ao conectar no Postgres')
        return ("Erro ao conectar no Postgres", False)
# abertura da conexao FIREBIRD

# Fechar conexao FIREBIRD
def fire_con_close():
    con_fire.close()
    print('Conexao Firebird Fechada')

# Execute a query
def select_seco():
    cur_fire = con_fire.cursor()
    cur_fire.execute("SELECT * FROM UNID_MEDID")
    records = cur_fire.fetchall()
    df = pd.DataFrame(records)
    print(df[0][0])



