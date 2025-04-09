import sqlite3

DATABASE = 'pimeet.db'

def init_db():
    conn = sqlite3.connect('pimeet.db')
    cursor = conn.cursor()

    # Create table if not exists
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL
        )
    ''')

    # Check if 'profile_image' column already exists
    cursor.execute("PRAGMA table_info(users)")
    columns = [column[1] for column in cursor.fetchall()]
    if 'profile_image' not in columns:
        cursor.execute("ALTER TABLE users ADD COLUMN profile_image BLOB;")

    conn.commit()
    conn.close()

def get_db_connection():
    """Get a connection to the database."""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn