from ctypes import cast
import psycopg2
import pandas as pd
import eel
import json

  
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

#psycopg2 python date to string format

@eel.expose
def select_generico(select):
    cur_pos = con_pos.cursor()
    cur_pos.execute(select)
    colunas = [desc[0] for desc in cur_pos.description]
    dados = cur_pos.fetchall()
    #dados to pandas from pandas to list
    df = pd.DataFrame(dados, columns=colunas)
    #pandas to json
    json_data = df.to_json(orient='records')
    #json to python list
    cur_pos.close()
    print(colunas, dados)
    print(colunas, json_data)
    return colunas,dados,json_data


connect_postgres('localhost', 'BARATAO', 5432, 'postgres', '91396851')
select_generico("select * from unidade_medida where cod_unidade = 'BJ'")




#LOGTEC#
def logtec_unidade_medida():
    cur_pos = con_pos.cursor()
    select = "select cod_unidade, des_unidade from unidade_medida"
    cur_pos.execute(select)
    dados = cur_pos.fetchall()
    return dados
#LOGTEC#