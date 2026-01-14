from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Task(BaseModel):
    text: str = None
    is_done: bool = False   

class TaskSet(BaseModel):
    name: str = None

class LoginRequest(BaseModel):
    username: str
    password: str

# Healthcheck
@app.post("/health")
def health():
    return {"status": "ok"}

@app.post("/login")
def login(data: LoginRequest):
    print("Login attempt:", data.username)

    # validate credentials here
    if data.username != "Alice" or data.password != "password123":
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "status": "ok",
        "username": data.username
    }

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

# Create new set
@app.post("/tasksets")
def create_taskset(taskset: TaskSet):
    return {"status": "ok"}

# Delete a specific task
@app.delete("/tasks/{task_id}")
def delete_task():
    return {"status": "ok"}

# Delete a specific task set
@app.delete("/tasksets/{taskset_id}")
def delete_taskset():
    return {"status": "ok"}

# Get all task sets
@app.get("/tasksets", response_model=list[TaskSet])
def get_tasksets():
    return {"status": "ok"}

# Get specific task set
@app.get("/tasksets/{taskset_id}", response_model=TaskSet)
def get_taskset():
    return {"status": "ok"} 

# Update specific task set
@app.put("/tasksets/{taskset_id}")
def update_taskset():
    return {"status": "ok"} 

# Assign task to user
@app.post("/tasks/{task_id}/assign/{username}")
def assign_task():
    return {"status": "ok"}

# Unassign task from user
@app.post("/tasks/{task_id}/unassign")
def unassign_task():
    return {"status": "ok"} 

# Get tasks assigned to a user
@app.get("/users/{username}/tasks", response_model=list[Task]) 
def get_user_tasks():
    return {"status": "ok"}

# Get user's dashboard
@app.get("/users/{username}/dashboard")
def get_user_dashboard():
    return {"status": "ok"} 

# Update user's dashboard
@app.put("/users/{username}/dashboard")
def update_user_dashboard():
    return {"status": "ok"}
