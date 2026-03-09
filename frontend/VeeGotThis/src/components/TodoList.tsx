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

type TaskSet = {
  id: string;
  ownerId: string;
  sharedWith: string[];
//   createdAt: string;
  name: string;
  tasks: Todo[];
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
  })

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
  const onRemoveTaskSet = async (setId: string) => {
    if (!window.confirm("Are you sure you want to delete this task set?")) return;
    const data = await apiFetch("/tasksets", {
      method: "DELETE",
      body: JSON.stringify({
        taskSetID: setId,
      })
    });
    if (`${data.status}`.startsWith("4")) {
      throw new Error(data.detail || "Task set deletion failed");
    }

    setTaskSets(prev => prev.filter(set => set.id !== setId));
    setSelectedSetId(null);
  }


  const onRemoveTask = (taskId: string) => {
    // TODO
  }
  const onAssignTaskToUser = (taskId: string) => {
    // TODO
  }
  const onEditTask = (taskId: string) => {
    // TODO
  }
  const onMoveTask = (taskId: string) => {
    // TODO
  }

  const onUpdateTask = (taskId: string, newText: string) => {
    // TODO
  }

  const onShareTaskSet = (setId: string, userId: string) => {
    // TODO
  }

  const onUnshareTaskSet = (setId: string, userId: string) => {
    // TODO
  } 

  const onDeleteCompletedTasks = (setId: string) => {
    // TODO
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
              {set.name}
              {/* <div className="setMenuWrapper"> */}
                <button className="more"
                  onClick={(e) => openSetMenu(e, set.id)}
                >⋮</button>
              {/* </div> */}
              {/* <Card 
                elevation={set.id === selectedSetId ? 1 : 8}
                sx={{
                  transition: "box-shadow 150ms ease, transform 150ms ease",
                  transform: set.id === selectedSetId
                    ? "translateY(2px)"
                    : "translateY(0)",
                }}
              >
                <CardContent>
                  {set.name}
                </CardContent>
              </Card> */}
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
          <button onClick={() => { onRemoveTaskSet(menuSetId!); closeSetMenu(); }}>
            Delete Set
          </button>
          <button onClick={() => { onRemoveTaskSet(menuSetId!); closeSetMenu(); }}>
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
