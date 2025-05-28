import mysql.connector

def create_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='0207',
            port='3306',
            database='desktop'
        )
        return connection
    except mysql.connector.Error as err:
        return None

def close_connection(connection):
    if connection:
        connection.close()