import sqlite3

conn = sqlite3.connect('pimeet.db')
cursor = conn.cursor()

cursor.execute("SELECT * FROM users")
cursor.execute("SELECT * FROM meetings")
rows = cursor.fetchall()

for row in rows:
    print(row)

conn.close()
