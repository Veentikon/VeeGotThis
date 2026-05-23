import "./Todo.css";
import { useEffect, useState } from "react";
import CreateTask from "./CreateTask";
import CreateSet from "./CreateSet";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/api";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

export default function TodoList() {
  const { user, taskSets, setTaskSets } = useAuth();
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const [menuAnchorSet, setMenuAnchorSet] = useState<null | HTMLElement>(null);
  const [menuAnchorTask, setMenuAnchorTask] = useState<null | HTMLElement>(null);
  const [menuSetId, setMenuSetId] = useState<string | null>(null);
  const [menuTaskId, setMenuTaskId] = useState<string | null>(null);

  useEffect(() => {
    const close = () => setMenuAnchorSet(null);
    window.addEventListener("click", close);

    return () => window.removeEventListener("click", close);
  }, []);
  useEffect(() => {
    const close = () => setMenuAnchorTask(null);
    window.addEventListener("click", close);

    return () => window.removeEventListener("click", close);
  }, []);

  const selectedSet = taskSets.find(set => set.id === selectedSetId);
  const openSetMenu = (e: React.MouseEvent<HTMLButtonElement>, setId: string) => {
    e.stopPropagation();
    setMenuAnchorSet(e.currentTarget);
    setMenuSetId(setId);
  };
  const openTaskMenu = (e: React.MouseEvent<HTMLButtonElement>, taskId: string) => {
    e.stopPropagation();
    setMenuAnchorTask(e.currentTarget);
    setMenuTaskId(taskId);
  };
  const closeSetMenu = () => {
    setMenuAnchorSet(null);
    setMenuSetId(null);
  };
  const closeTaskMenu = () => {
    setMenuAnchorTask(null);
    setMenuTaskId(null);
  };

  const toggleTask = (taskId: string) => {
    setTaskSets(prev =>
      prev.map(set =>
        set.id !== selectedSetId
          ? set
          : {
              ...set,
              tasks: set.tasks.map(task =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              )
            }
      )
    );
  };

  async function onCreateTaskSet(setName: string) {
    if (!selectedSetId) return;
    const data = await apiFetch("/tasksets", {
      method: "POST",
      body: JSON.stringify({
        name: setName,
        ownerId: user,
      })
    });

    if (`${data.status}`.startsWith("4")) {
      throw new Error(data.detail || "Task set creation failed");
    }

    setTaskSets(prev => [...prev, data.newSet]);
    setSelectedSetId(data.newSet.id);
  }

  async function onCreateTask(description: string) {
    if (!selectedSetId) return;

    const data = await apiFetch("/tasks", {
      method: "POST",
      body: JSON.stringify({
        taskSetID: selectedSetId,
        description: description,
      })
    });

    if (`${data.status}`.startsWith("4")) {
      throw new Error(data.detail || "Task creation failed");
    }

    /** When successfull, update the gui list */
    setTaskSets(prev => 
      prev.map(set =>
        set.id === selectedSetId
        ? { ...set, tasks: [...set.tasks, data.newTask]}
        : set
      )
    )
  }

  /* Delete selected set */
  const onDeleteTaskSet = async (setId: string) => {
    if (!window.confirm("Are you sure you want to delete this task set?")) return;

    const data = await apiFetch(`/tasksets/${setId}`, {
      method: "DELETE",
    });
    if (`${data.status}`.startsWith("4")) {
      throw new Error(data.detail || "Task set deletion failed");
    }

    setTaskSets(prev => prev.filter(set => set.id !== setId));
    setSelectedSetId(null);
  }

  const onRemoveTask = async (taskId: string) => {
    if (!selectedSetId) return;
    
    const data = await apiFetch("/tasks", {
      method: "DELETE",
      body: JSON.stringify({
        taskSetID: selectedSetId,
        taskID: taskId,
      })
    });

    if (`${data.status}`.startsWith("4")) {
      throw new Error(data.detail || "Task deletion failed");
    }

    setTaskSets(prev => 
      prev.map(set =>
        set.id === selectedSetId
          ? { ...set, tasks: set.tasks.filter(t => t.id !== taskId) }
          : set
      )
    );
  }

  // Need to implement users and permissions before these can be implemented
  const onAssignTaskToUser = (taskId: string) => {
    // TODO
  }

  // Open a dialog, can modify the existing text and save changes (can reuse the CreateTask component)
  const onEditTask = (taskId: string) => {
    // TODO
  }
  // Might need to implement a separate task set list dialog for this, where you can move tasks between sets by dragging them
  const onMoveTask = (taskId: string) => {
    // TODO
  }

  // Need to implement users and persmissions first, also need to implement a way to search for users to share with (probably in a separate dialog)
  const onShareTaskSet = (setId: string, userId: string) => {
    // TODO
  }
  const onUnshareTaskSet = (setId: string, userId: string) => {
    // TODO
  } 

  // Need to define the scope, delete all recently marked completed tasks or delete every completed task, (include confirmation dialog)
  const onDeleteCompletedTasks = (setId: string) => {
    // TODO
  } 

  const onSetAsRoutine = async () => {
    const mySet = taskSets.find(s => s.id === selectedSetId);

    const data = await apiFetch(`/tasksets/${selectedSetId}`, {
      method: "PUT",
      body: JSON.stringify({
        name: mySet?.name || "Routine Set",
        shared_with: [], // TODO: implement sharing first, then allow user to select who to share with when setting as routine
        taskSetID: selectedSetId,
        routine: true,
      })}
    );
    if (data.status.toString().startsWith("4")) {
      throw new Error(data.detail || "Failed to set task set as routine");
    }
    setTaskSets(prev => 
      prev.map(set =>
        set.id === selectedSetId
          ? { ...set, routine: true }
          : set
      )
    );
  }

  const [ createTaskOpen, setCreateTaskOpen ] = useState(false);
  const [ createSetOpen, setCreateSetOpen] = useState(false);

  return (
    <div className="tasksPage">
      {/* Sticky Task Sets Header */}
      <header className="taskSetHeader">
        <ul className="taskSetList">
          {taskSets.map(set => (
            <li
              key={set.id}
              className={`taskSet ${set.id === selectedSetId ? "active" : ""}`}
              onClick={() => setSelectedSetId(set.id)}
            >
              {/* {set.routine && <div className="routine-bar"/>} */}
              <div className="setContents">
                <div className="set">
                  <span>{set.name}</span>
                  <button className="more"
                    onClick={(e) => {setSelectedSetId(set.id), openSetMenu(e, set.id)}}
                  >⋮</button>
                </div>
                {set.routine && <div className="routine-bar"></div>}
              </div>
            </li>
          ))}
        </ul>
      </header>

      {/* Scrollable task list */}
      <main className="tasksScrollArea">
        <ul className="todolist">
          {selectedSet?.tasks.map(task => (
            <li key={task.id} className="todocard">
              <input
                type="checkbox"
                className="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <label htmlFor={`task-${task.id}`} className="checkbox-label" />
              <span
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                  opacity: task.completed ? 0.6 : 1,
                }}
              >
                {task.text}
              </span>
              <div className="taskMenuWrapper">
                <button className="taskMenu"
                  onClick={(e) => {openTaskMenu(e, task.id)}}
                >⋮</button>
              </div>
            </li>
          ))}
        </ul>
      </main>

      {/* Footer controls */}
      <footer className="taskManagementWrapper">
        <div className="taskManagementContainer">
          <button onClick={() => setCreateTaskOpen(true)}>+ Task</button>
          <button onClick={() => setCreateSetOpen(true)}>+ Set</button>
        </div>
      </footer>
      {createTaskOpen ? (
        <CreateTask
          onCreate={onCreateTask}
          onCancel={() => setCreateTaskOpen(false)}
        />
      ) : null}
      {createSetOpen ? (
        <CreateSet
          onCreate={onCreateTaskSet}
          onCancel={() => setCreateSetOpen(false)}
        />
      ) : null}

      {menuAnchorSet && (
        <div
          className="dropdownMenu"
          style={{
            position: "absolute",
            top: menuAnchorSet.getBoundingClientRect().bottom + window.scrollY,
            left: menuAnchorSet.getBoundingClientRect().left,
          }}
        >
          <button onClick={() => { onShareTaskSet(menuSetId!, "user"); closeSetMenu(); }}>
            Share
          </button>
          <button onClick={() => { onDeleteCompletedTasks(menuSetId!); closeSetMenu(); }}>
            Delete Completed
          </button>
          <button onClick={() => { onDeleteTaskSet(menuSetId!); closeSetMenu(); }}>
            Delete Set
          </button>
          <button onClick={() => { onSetAsRoutine(); closeSetMenu(); }}>
            Set as Routine
          </button>
        </div>
      )}
      {menuAnchorTask && (
        <div
          className="dropdownMenu"
          style={{
            position: "absolute",
            top: menuAnchorTask.getBoundingClientRect().bottom + window.scrollY,
            left: menuAnchorTask.getBoundingClientRect().left,
          }}
        >
          {/* <button onClick={() => { onShareTask(menuTaskId!, "user"); closeTaskMenu(); }}>
            Share
          </button> */}
          <button onClick={() => { onAssignTaskToUser(menuTaskId!); closeTaskMenu(); }}>
            Assign to user
          </button>
          <button onClick={() => { onRemoveTask(menuTaskId!); closeTaskMenu(); }}>
            Delete Task
          </button>
          <button onClick={() => { onEditTask(menuTaskId!); closeTaskMenu(); }}>
            Edit
          </button>
          <button onClick={() => { onMoveTask(menuTaskId!); closeTaskMenu(); }}>
            Assign to set
          </button>
        </div>
      )}
    </div>
  );
}
