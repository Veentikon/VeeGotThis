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

  const onCreateTaskSet = (setName: string) => {
    const newSet: TaskSet = {
      id: crypto.randomUUID(),
      name: setName,
      ownerId: "user-123",
      sharedWith: [],
      tasks: [],
    };

    setTaskSets(prev => [...prev, newSet]);
    setSelectedSetId(newSet.id);
  }

  const onCreateTask = (description: string) => { 
    if (!selectedSetId) return;

    const newTask: Todo = {
      id: crypto.randomUUID(),
      text: description,
      completed: false,
    };

    setTaskSets(prev => 
      prev.map(set =>
        set.id === selectedSetId
        ? { ...set, tasks: [...set.tasks, newTask]}
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
