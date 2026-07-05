import uuid
from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from app.auth import verify_password, create_access_token, get_current_user, hash_password
import app.db as db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
db.init_db_pool()  # Initialize the connection pool
db.init_db()

# Request and response models ==============================================================================
class Task(BaseModel):
    id: str
    text: str
    completed: bool = False

class TaskSet(BaseModel):
    id: str
    name: str
    owner_id: str 
    shared_with: List[str] = []
    tasks: List[Task] = [] # In principle, I could instead use id instead
    routine: bool = False # Whether this task set is a routine or not. Routines are task sets that are meant to be completed on a regular basis, and have some special properties (e.g. they can be marked as completed for the day, but not deleted or archived)

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    status: str
    username: str
    tasksets: list[TaskSet]

class CreateTaskRequest(BaseModel):
    taskSetID: str
    description: str

class CreateTaskSetRequest(BaseModel):
    name: str
    ownerId: str

class UpdateTaskSetRequest(BaseModel):
    name: str
    shared_with: List[str] = []
    routine: bool

class CreateUserRequest(BaseModel):
    username: str
    email: str
    password: str
# =========================================================================================

# DUMMY DATA - In-memory storage for testing purposes ===========================
USERS = {
    "Alice": {"password": hash_password("123"), "id": str(uuid.uuid4())},
    "Bob": {"password": hash_password("securepass"), "id": str(uuid.uuid4())},
}
TASKSETS = [
    TaskSet(
        id=str(uuid.uuid4()),
        name="Misc",
        owner_id="Alice",
        shared_with=[],
        tasks=[
            Task(id="task-1", text="Buy groceries", completed=False),
            Task(id="task-2", text="Buy NAS compatible case", completed=False),
        ],
        routine=False,
    ),
    TaskSet(
        id=str(uuid.uuid4()),
        name="Personal",
        owner_id="Alice",
        shared_with=[],
        tasks=[
            Task(id="task-3", text="Finish assignment", completed=True),
        ],
        routine=True,
    ),
]
# ==========================================================================

# Healthcheck
@app.post("/health")
def health():
    return {"status": "ok"}

# Login endpoint
@app.post("/login")
def login(data: LoginRequest):
    user = db.get_user_by_username(data.username)  # This is just to ensure the user exists in the database, but we still need to verify the password
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(
        data.password,
        user["password_hash"]  # Assuming the hashed password is in the "password_hash" field of the user record
    ):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(str(user["id"]))  # Assuming the user record has an "id" field

    return {
        "access_token": token,
        "token_type": "bearer",
        "username": data.username
    }

# Return all tasks
@app.get("/tasks", response_model=list[Task])
def get_tasks(current_user: str = Depends(get_current_user)):
    return {"status": "ok"}

# Retrieve a specific task
@app.get("/tasks/{task_id}", response_model=Task)
def get_task(current_user: str = Depends(get_current_user)):
    return {"status": "ok"}

# Update a specific task (includes assignment)
@app.put("/tasks/{task_id}")
def update_task(current_user: str = Depends(get_current_user)):
    return {"status": "ok"}

# Create a new task
@app.post("/tasks")
def create_task(data: CreateTaskRequest, current_user: str = Depends(get_current_user)):
    taskSetID = data.taskSetID
    description = data.description

    newTask = Task(id=str(uuid.uuid4()), text=description, completed=False)
    for set in TASKSETS:
        if set.id==taskSetID:
            set.tasks.append(newTask)

    return {
        "status": "ok",
        "newTask": newTask
    }

# Create new set
@app.post("/tasksets")
def create_taskset(data: CreateTaskSetRequest, current_user: str = Depends(get_current_user)):

    newSet = TaskSet( # 
        id=str(uuid.uuid4()),
        name=data.name,
        owner_id=current_user,
        shared_with=[],
        tasks=[],
    )

    TASKSETS.append(newSet) # Update in-memory data

    return {
        "status": "ok",
        "newSet": newSet
    }

# Delete a specific task
@app.delete("/tasks/{task_id}")
def delete_task(task_id: str, current_user: str = Depends(get_current_user)):
    global TASKSETS

    # This will be replaced with a querry to the database that deletes the task with the given ID
    # and checks that the user has permissions to delete it (is owner or shared with)
    for ts in TASKSETS:
        if not (ts.owner_id == current_user or current_user in ts.shared_with):
            continue

        for task in ts.tasks:
            if task.id == task_id:
                ts.tasks = [task for task in ts.tasks if task.id != task_id]
                return {"status": "ok"}
    raise HTTPException(status_code=404, detail="Task not found")

# Delete a specific task set
@app.delete("/tasksets/{taskset_id}")
def delete_taskset(taskset_id: str, current_user: str = Depends(get_current_user)):
    global TASKSETS
    TASKSETS = [ts for ts in TASKSETS if ts.id != taskset_id]
    return {"status": "ok"}

#TODO: Implement pagination for task sets and tasks
# Get all task sets (By extension, includes their tasks)
# @app.get("/tasksets", response_model=list[TaskSet])
# def get_tasksets(username: str):
#     return [
#         ts for ts in TASKSETS
#         if ts.owner_id == username or username in ts.shared_with
#     ]
@app.get("/tasksets", response_model=list[TaskSet])
def get_tasksets(current_user: str = Depends(get_current_user)):
    return [
        ts for ts in TASKSETS
        if ts.owner_id == current_user or current_user in ts.shared_with
    ]

# Get specific task set
@app.get("/tasksets/{taskset_id}", response_model=TaskSet)
def get_taskset(taskset_id: str, current_user: str = Depends(get_current_user)):
    for ts in TASKSETS:
        if ts.id == taskset_id and (ts.owner_id == current_user or current_user in ts.shared_with):
            return ts
    raise HTTPException(status_code=404, detail="TaskSet not found")

# Update specific task set
@app.put("/tasksets/{taskset_id}")
def update_taskset(taskset_id: str, data: UpdateTaskSetRequest, current_user: str = Depends(get_current_user)):
    for ts in TASKSETS:
        if ts.id == taskset_id and ts.owner_id == current_user:
            ts.name = data.name
            ts.shared_with = data.shared_with
            if data.routine and ts.routine: ts.routine = False
            elif data.routine and not ts.routine: ts.routine = True # change set to a routine
            return {"status": "ok", "routine": ts.routine} # If successful, there is no need to send the whole set back, but realize the update on the front end if the status is ok
    raise HTTPException(status_code=404, detail="TaskSet not found")

# Assign task to user
@app.post("/tasks/{task_id}/assign/{username}")
def assign_task(task_id: str, username: str, current_user: str = Depends(get_current_user)):
    global TASKSETS
    for ts in TASKSETS:
        for task in ts.tasks:
            if task.id == task_id:
                task.assigned_to = username
                return {"status": "ok"}
    raise HTTPException(status_code=404, detail="Task not found")

# Unassign task from user
@app.post("/tasks/{task_id}/unassign")
def unassign_task(task_id: str, current_user: str = Depends(get_current_user)):
    global TASKSETS
    for ts in TASKSETS:
        for task in ts.tasks:
            if task.id == task_id and task.assigned_to == current_user:
                task.assigned_to = None
                return {"status": "ok"}
    raise HTTPException(status_code=404, detail="Task not found or not assigned to user")

# Get tasks assigned to a user
@app.get("/users/{username}/tasks", response_model=list[Task]) 
def get_user_tasks(current_user: str = Depends(get_current_user)):
    tasks = []
    for ts in TASKSETS:
        for task in ts.tasks:
            if task.assigned_to == current_user:
                tasks.append(task)
    return tasks

# User handling endpoints =============================================================================
# Create a new user
@app.post("/users")
def create_user(data: CreateUserRequest):
    if db.get_user_by_username(data.username):
        raise HTTPException(status_code=400, detail="Username already exists")
    
    db.create_user(data.username, data.email, hash_password(data.password))
    return {"status": "ok", "username": data.username}

# Get user's dashboard
@app.get("/users/{username}/dashboard")
def get_user_dashboard(current_user: str = Depends(get_current_user)):
    return {"status": "ok"} 

# Update user's dashboard
@app.put("/users/{username}/dashboard")
def update_user_dashboard(current_user: str = Depends(get_current_user)):
    return {"status": "ok"}
# ======================================================================================================
