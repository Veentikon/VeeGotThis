# from multiprocessing import pool
from psycopg2 import pool
import psycopg2.extras
import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

# 1. Initialize the Connection Pool ONCE at startup
# Do NOT create a global 'conn' object directly for queries
db_pool = None  # This will hold the connection pool object
def init_db_pool():
    global db_pool
    db_pool = pool.ThreadedConnectionPool(
        minconn=2,
        maxconn=10,
        # host=os.getenv("POSTGRES_HOST", "db"),  # Use the service name defined in docker-compose.yml
        # database=os.getenv("POSTGRES_DB"),
        # user=os.getenv("POSTGRES_USER"),
        # password=os.getenv("POSTGRES_PASSWORD")
        host="db",
        database="fam_db",
        user="veeteck",
        password="ZaWardo24025",
    )
# db_pool = pool.ThreadedConnectionPool(
#     minconn=2,
#     maxconn=10,
#     host="fam_db",
#     database=os.getenv("POSTGRES_DB"),
#     user=os.getenv("POSTGRES_USER"),
#     password=os.getenv("POSTGRES_PASSWORD")
# )

def init_db():
    conn = db_pool.getconn()
    try:
        with conn.cursor() as cur:
            # Create table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS users (
                        id SERIAL PRIMARY KEY,
                        username VARCHAR(50) UNIQUE NOT NULL,
                        email VARCHAR(100) UNIQUE NOT NULL,
                        password_hash VARCHAR(255) NOT NULL
                );""")
            cur.execute("""
                CREATE TABLE IF NOT EXISTS tasksets (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(100) NOT NULL,
                        description TEXT
                );""")
            cur.execute("""
                CREATE TABLE IF NOT EXISTS tasks (
                        id SERIAL PRIMARY KEY,
                        taskset_id INT REFERENCES tasksets(id),
                        description TEXT NOT NULL,
                        completed BOOLEAN DEFAULT FALSE
                );""")
        conn.commit()
    finally: 
        db_pool.putconn(conn)  # Return connection to pool (do NOT close it)


# Add new user
def create_user(username, email, password_hash):
    print("db creating user ...") # ==========================================================
    # Get connection from the pool
    conn = db_pool.getconn()
    try: 
        # Cursor automatically closes when 'with' block exits
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
                (username, email, password_hash)
            )
            # new_user_id = cur.fetchone()[0]  # Get the ID of the newly inserted user
            conn.commit()
    except psycopg2.IntegrityError as e:
        conn.rollback()  # Rollback in case of error
        raise ValueError("Username or email already exists")
    finally:
        # Return connection to pool (do NOT close it)
        db_pool.putconn(conn)

# Add new taskset
def insert_taskset(name, description):
    # Get connection from the pool
    conn = db_pool.getconn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO tasksets (name, description) VALUES (%s, %s)",
                (name, description)
            )
            new_taskset_id = cur.fetchone()[0]  # Get the ID of the newly inserted taskset
            return new_taskset_id
        conn.commit()
    finally:
        db_pool.putconn(conn)

# Add new task
def insert_task(taskset_id, description):
    # Get connection from the pool
    conn = db_pool.getconn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO tasks (taskset_id, description) VALUES (%s, %s)",
                (taskset_id, description)
            )
            new_task_id = cur.fetchone()[0]  # Get the ID of the newly inserted task
            return new_task_id
        conn.commit()
    finally:
        db_pool.putconn(conn)

# Query functions
# Get user by username
def get_user_by_username(username):
    conn = db_pool.getconn()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                "SELECT id, username, email, password_hash FROM users WHERE username = %s",
                (username,)
            )
            return cur.fetchone()
    finally:
        db_pool.putconn(conn)

# Get user tasksets by user id
def get_taskset_by_id(taskset_id):
    conn = db_pool.getconn()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                "SELECT id, name, description FROM tasksets WHERE id = %s",
                (taskset_id,)
            )
            return cur.fetchone()
    finally:
        db_pool.putconn(conn)

# Get task by id
def get_task_by_id(task_id):
    conn = db_pool.getconn()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                "SELECT id, taskset_id, description, completed FROM tasks WHERE id = %s",
                (task_id,)
            )
            return cur.fetchone()
    finally:
        db_pool.putconn(conn)

# Get all tasksets for a user
def get_tasksets_by_user_id(user_id):
    conn = db_pool.getconn()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                "SELECT id, name, description FROM tasksets WHERE owner_id = %s",
                (user_id,)
            )
            return cur.fetchall()
    finally:
        db_pool.putconn(conn)

# Get all tasks by user id (via tasksets)
def get_tasks_by_user_id(user_id):
    conn = db_pool.getconn()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                "SELECT t.id, t.taskset_id, t.description, t.completed FROM tasks t JOIN tasksets ts ON t.taskset_id = ts.id WHERE ts.owner_id = %s",
                (user_id,)
            )
            return cur.fetchall()
    finally:
        db_pool.putconn(conn)

# Get all tasks by taskset id
def get_tasks_by_taskset_id(taskset_id):
    conn = db_pool.getconn()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                "SELECT id, description, completed FROM tasks WHERE taskset_id = %s",
                (taskset_id,)
            )
            return cur.fetchall()
    finally:
        db_pool.putconn(conn)

# Commit transaction and close
# conn.commit()
# cur.close()
# conn.close()

# Major Entities
# 1. User
# 2. TaskSet
# 3. Task
# 4. TaskAssignment (to correlate users with tasks) - skip for now