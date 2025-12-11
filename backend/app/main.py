from fastapi import fastAPI, HTTPException
from pydantic import BaseModel

app = fastAPI()

class Task(BaseModel):
    text: str = None
    is_done: bool = False

# Healthcheck
@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/login")
def login(username: str, password: str):
    return {"status": "ok"}

# Return full list of tasks
@app.get("/tasks", response_model=list[Task])
def get_tasks():
    return {"status": "ok"}

# Retrieve a specific task
@app.get("/tasks/{task_id}", response_model=Task)
def get_task():
    return {"status": "ok"}

# Update a specific task (includes assignment)
@app.put("/tasks/{task_id}")
def update_task():
    return {"status": "ok"}

# Create a new task
@app.post("/tasks")
def create_task(task: Task):
    return {"status": "ok"}
