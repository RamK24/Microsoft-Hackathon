import os
from dotenv import load_dotenv
import pyodbc
load_dotenv()

server_name = os.getenv("USER_DB_SERVER_NAME")
database_name = os.getenv("USER_DB_NAME")
username = os.getenv("USER_DB_USERNAME")
password = os.getenv("USER_DB_PASSWORD")

conn_str = (
    f"Driver=ODBC Driver 18 for SQL Server;"
    f"Server=tcp:{server_name},1433;"
    f"Database={database_name};"
    f"Uid={username};"
    f"Pwd={password};"
    "Encrypt=yes;"
    "TrustServerCertificate=no;"
    "Connection Timeout=30;"
)

conn = None  # Define conn before the try block

try:
    conn = pyodbc.connect(conn_str, autocommit=True)  # Keep the connection open with autocommit enabled
    print("Connected successfully!")

    cursor = conn.cursor()  # Only create cursor if connection succeeds

    # cursor.execute("""
    #     IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Emotion' AND xtype='U')
    #     CREATE TABLE Emotion (
    #         user_id INT,
    #         reason nvarchar(2000),
    #         emotion nvarchar(200)
    #     )
    # """)
    # conn.commit()

    result = cursor.execute("SELECT * FROM eMOTION;")
    print(result.fetchall())

except Exception as e:
    print("Error:", e)

finally:
    if conn:  # Don't close the connection explicitly to return it to the pool
        # conn.close()  # Optional: comment this out for connection pooling
        pass  # Connection will be automatically managed by the pool
