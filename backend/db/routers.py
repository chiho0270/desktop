def fetch_all_data(connection, table_name: str):
    try:
        cursor = connection.cursor(dictionary=True)
        query = f"SELECT * FROM {table_name}"
        cursor.execute(query)
        return cursor.fetchall()
    except Exception as e:
        return None

def fetch_data_with_condition(connection, table_name: str, column: str, value: str):
    try:
        cursor = connection.cursor(dictionary=True)
        query = f"SELECT * FROM {table_name} WHERE {column} = %s"
        cursor.execute(query, (value,))
        result = cursor.fetchone()
        return result
    except Exception as e:
        return None
