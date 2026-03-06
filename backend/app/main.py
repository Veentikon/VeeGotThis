import uuid
from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

# Diagnostic imports for auth functions
# import os
# print("Current working directory:", os.getcwd())
# print("Contents of current directory:", os.listdir())

from app.auth import verify_password, create_access_token, get_current_user, hash_password


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
    tasks: List[Task] = [] # In principle, I could instead use id instead
    # that would align better with how data is stored in SQL db
    # Another option is to group tasks by TaskSet id
    # Create a table where key is TaskSetID
    # | TaskSetID | TaskID | description | completed | OwnerID  | SharedWith |
    # | 1         | 1      | Finish task | False     | 1        | 2          |
    # | 1         | 2      | Buy thing   | False     | 1        | N/A        |
    # | 2         | 4      | Read book   | True      | 2        | 1          |

    # Another table would correlate user Ids with their task sets
    # | UserID     | TaskSetID | Task # | Completed # |
    # | 1          | 1         | 23     | 15          |
    # Or is it better to instead have a list of TaskSetIDs that belong
    # to a user?

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
    ),
    TaskSet(
        id=str(uuid.uuid4()),
        name="Personal",
        owner_id="Alice",
        shared_with=[],
        tasks=[
            Task(id="task-3", text="Finish assignment", completed=True),
        ],
    ),
]
# ==========================================================================

# Healthcheck
@app.post("/health")
def health():
    return {"status": "ok"}

@app.post("/login")
def login(data: LoginRequest):

    if data.username not in USERS:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(
        data.password,
        USERS[data.username]["password"]
    ):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data.username)

    return {
        "access_token": token,
        "token_type": "bearer",
        "username": data.username
    }

# @app.post("/login")
# def login(data: LoginRequest):
#     print("Login attempt:", data.username)

#     # validate credentials
#     if data.username not in USERS or USERS[data.username]["password"] != data.password:
#         raise HTTPException(status_code=401, detail="Invalid credentials")

#     user_tasksets = [
#         ts for ts in TASKSETS
#         if ts.owner_id == data.username or data.username in ts.shared_with
#     ]

#     return {
#         "status": "ok",
#         "username": "data.username",
#         "tasksets": user_tasksets,
#     }

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
    
    print("Created task:", newTask)

    return {
        "status": "ok",
        "newTask": newTask
    }

# Create new set
@app.post("/tasksets")
def create_taskset(data: CreateTaskSetRequest, current_user: str = Depends(get_current_user)):

    newSet = TaskSet(
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
    for ts in TASKSETS:
        ts.tasks = [task for task in ts.tasks if task.id != task_id]
    return {"status": "ok"}

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
            return {"status": "ok"}
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

# Get user's dashboard
@app.get("/users/{username}/dashboard")
def get_user_dashboard(current_user: str = Depends(get_current_user)):
    return {"status": "ok"} 

# Update user's dashboard
@app.put("/users/{username}/dashboard")
def update_user_dashboard(current_user: str = Depends(get_current_user)):
    return {"status": "ok"}

