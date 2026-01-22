from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
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
    id: str
    text: str
    completed: bool = False

class TaskSet(BaseModel):
    id: str
    name: str
    owner_id: str
    shared_with: List[str] = []
    tasks: List[Task] = []

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    status: str
    username: str
    tasksets: list[TaskSet]


# Fake data
TASKSETS = [
    TaskSet(
        id="set-1",
        name="Misc",
        owner_id="Alice",
        shared_with=[],
        tasks=[
            Task(id="task-1", text="Buy groceries", completed=False),
            Task(id="task-2", text="Buy NAS compatible case", completed=False),
        ],
    ),
    TaskSet(
        id="set-2",
        name="Personal",
        owner_id="Alice",
        shared_with=[],
        tasks=[
            Task(id="task-3", text="Finish assignment", completed=True),
        ],
    ),
]

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

    user_tasksets = [
        ts for ts in TASKSETS
        if ts.owner_id == data.username or data.username in ts.shared_with
    ]

    return {
        "status": "ok",
        "username": "data.username",
        "tasksets": user_tasksets,
    }

# Return all tasks
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

#TODO: Implement pagination for task sets and tasks
# Get all task sets (By extension, includes their tasks)
@app.get("/tasksets", response_model=list[TaskSet])
def get_tasksets(username: str):
    return [
        ts for ts in TASKSETS
        if ts.owner_id == username or username in ts.shared_with
    ]

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

