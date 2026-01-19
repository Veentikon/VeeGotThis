import "./Todo.css";
// import "./TaskManagement.css"
import { useEffect, useState } from "react";
import CreateTask from "./CreateTask";
import CreateSet from "./CreateSet";
// import Card from "@mui/material/Card";
// import { CardContent } from "@mui/material";

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
  const [taskSets, setTaskSets] = useState<TaskSet[]>([]);
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);

  useEffect(() => {
    // Simulated fetch
    const data: TaskSet[] = [
        {
            id: "set-1",
            name: "Misc",
            ownerId: "user-123",
            sharedWith: ["user-456"], // users who can access this set
            // createdAt: "2025-01-15",
            tasks: [
            {
                id: "task-1",
                text: "Buy groceries",
                completed: false
            },
            {
                id: "task-2",
                text: "Buy NAS compatible case",
                completed: false
            },
            {
                id: "task-10",
                text: "Buy groceries",
                completed: false
            },
            {
                id: "task-11",
                text: "Buy NAS compatible case",
                completed: false
            },
            {
                id: "task-12",
                text: "Buy groceries",
                completed: false
            },
            {
                id: "task-13",
                text: "Buy NAS compatible case",
                completed: false
            },
            {
                id: "task-14",
                text: "Buy groceries",
                completed: false
            },
            {
                id: "task-15",
                text: "Buy NAS compatible case",
                completed: false
            },
            {
                id: "task-16",
                text: "Buy groceries",
                completed: false
            },
            {
                id: "task-17",
                text: "Buy NAS compatible case",
                completed: false
            },
            {
                id: "task-18",
                text: "Buy groceries",
                completed: false
            },
            {
                id: "task-19",
                text: "Buy NAS compatible case",
                completed: false
            },
        ]
        },
        {
            id: "set-2",
            name: "Personal",
            ownerId: "user-123",
            sharedWith: [],
            tasks: [
            {
                id: "task-3",
                text: "Finish assignment",
                completed: true
            }
            ]
        },
        {
            id: "set-3",
            name: "Misk",
            ownerId: "user-123",
            sharedWith: [],
            tasks: [
            {
                id: "task-4",
                text: "Do some stuff",
                completed: true
            }
            ]
        },
        {
            id: "set-5",
            name: "Personallen",
            ownerId: "user-123",
            sharedWith: [],
            tasks: [
            {
                id: "task-6",
                text: "Do some other stuff",
                completed: true
            }
            ]
        },
        {
            id: "set-6",
            name: "Personal",
            ownerId: "user-123",
            sharedWith: [],
            tasks: [
            {
                id: "task-7",
                text: "Finish all the stuff",
                completed: true
            }
            ]
        }
    ];

    setTaskSets(data);
    setSelectedSetId(data[0].id); // default selection
  }, []);

  const selectedSet = taskSets.find(set => set.id === selectedSetId);

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

  const onAddTaskSet = (setName: string) => {
    // TODO
  }

  const onRemoveTaskSet = (setId: string) => {
    // TODO
  }

  const onRemoveTask = (taskId: string) => {
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

  const onAddTask = () => {
    // if (!selectedSetId) return;
    console.log("Adding task to set:", selectedSetId);
    setCreateTaskOpen(true);
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
                <button className="more">⋮</button>
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
                <button className="taskMenu">⋮</button>
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
          onCreate={onAddTask}
          onCancel={() => setCreateTaskOpen(false)}
        />
      ) : null}
      {createSetOpen ? (
        <CreateSet
          onCreate={onAddTaskSet}
          onCancel={() => setCreateSetOpen(false)}
        />
      ) : null}

    </div>
  );
}
