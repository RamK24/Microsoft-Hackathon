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


try:
    conn = pyodbc.connect(conn_str)
    print("Connected successfully!")

except Exception as e:
    print("Error:", e)


cursor = conn.cursor()

# cursor.execute("""
#         IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Emotion' AND xtype='U')
#         CREATE TABLE Emotion (
#             user_id INT,
#             reason nvarchar(2000),
#                emotion nvarchar(200)
#
#         )
#     """)
# conn.commit()


result = cursor.execute(""" select * from eMOTION ;""")
print(result.fetchall())

rows = result.fetchall()

# Now you can print the result or iterate over it
for row in rows:
    print(row)
