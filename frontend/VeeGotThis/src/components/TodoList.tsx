import "./Todo.css";
import { useEffect, useState } from "react";
import CreateTask from "./CreateTask";
import CreateSet from "./CreateSet";
import { useAuth } from "../context/AuthContext";

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

  async function onCreateTaskSet(setName: string) {
    const res = await fetch("http://localhost:8000/tasksets", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({
        name: setName,
        ownerId: user,
      })
    })

    if (!res.ok) {
      throw new Error("Task set creation failed");
    }

    const data = await res.json();

    setTaskSets(prev => [...prev, data.newSet]);
    setSelectedSetId(data.newSet.id);
  }

  async function onCreateTask(description: string) { 
    if (!selectedSetId) return;

    const res = await fetch("http://localhost:8000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskSetID: selectedSetId,
        description: description,
      })
    });

    if (!res.ok) {
      throw new Error("Task creation failed");
    }
    const data = await res.json();

    /** When successfull, update the gui list */
    setTaskSets(prev => 
      prev.map(set =>
        set.id === selectedSetId
        ? { ...set, tasks: [...set.tasks, data.newTask]}
        : set
      )
    )
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

    </div>
  );
}
