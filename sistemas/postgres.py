from ctypes import cast
import psycopg2
import pandas as pd
import eel

  


# Conectar ao Postgres
@eel.expose
def connect_postgres(host, database, port, user, password):

    global con_pos
    try:
        con_pos = psycopg2.connect(host=host,
                               database=database,
                               user=user,
                               port=port,
                               password=password)
        print('Postgres conectado')
        return ("Postgres conectado", True)
    except:
        print('Erro ao conectar no Postgres')
        return ("Erro ao conectar no Postgres", False)


# Fechar conexao POSTGRES
def pos_con_close():
    con_pos.close()
    print('Conexao Postgres Fechada')


@eel.expose
def select_all_tabelas_postgres(nome_tabela):
    cur_pos = con_pos.cursor()
    sql = "SELECT table_name FROM information_schema.tables where table_name = %s"
    cur_pos.execute(sql, [nome_tabela])
    tabelas = cur_pos.fetchone()
    print(tabelas)
    if tabelas is None:
        cur_pos.close()
        return False
    elif tabelas is not None:
        cur_pos.close()
        return True
    cur_pos.close()