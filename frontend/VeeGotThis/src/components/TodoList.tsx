import "./Todo.css";
// import "./TaskManagement.css"
import { useEffect, useState } from "react";

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

  // return (
  //   <div className="tasksPage">
  //     <header className="taskSetWrapper">
  //       <div className="appColumn">
  //         <ul className="taskSetList">
  //           {taskSets.map(set => (
  //             <li
  //               key={set.id}
  //               className={`taskSet ${set.id === selectedSetId ? "active" : ""}`}
  //               onClick={() => setSelectedSetId(set.id)}
  //             >
  //               {set.name}
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //     </header>

  //     <main className="tasksScrollArea">
  //         <div className="appColumn">
  //           <ul className="todolist">
  //             {selectedSet?.tasks.map(task => (
  //               <li key={task.id} className="todocard">
  //                 <input
  //                   type="checkbox"
  //                   className="CheckBox"
  //                   checked={task.completed}
  //                   onChange={() => toggleTask(task.id)}
  //                 />
  //                 <span
  //                   style={{
  //                     textDecoration: task.completed ? "line-through" : "none",
  //                     opacity: task.completed ? 0.6 : 1
  //                   }}
  //                 >
  //                   {task.text}
  //                 </span>
  //               </li>
  //             ))}
  //           </ul>
  //       </div>
  //     </main>

  //     <footer className="taskManagementWrapper">
  //       <div className="appColumn taskManagementContainer">
  //         <button type="button">+set</button>
  //         <button type="button">+task</button>
  //         <button type="button">-set</button>
  //         <button type="button">-task</button>
  //       </div>
  //     </footer>
  //   </div>
  // );
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
                className="CheckBox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <span
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                  opacity: task.completed ? 0.6 : 1,
                }}
              >
                {task.text}
              </span>
            </li>
          ))}
        </ul>
      </main>

      {/* Footer controls */}
      <footer className="taskManagementWrapper">
        <div className="taskManagementContainer">
          <button>+set</button>
          <button>+task</button>
          <button>-set</button>
          <button>-task</button>
        </div>
      </footer>
    </div>
  );
}
