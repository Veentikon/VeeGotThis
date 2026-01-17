// import { IconButton } from "@mui/material";
// import AddCircle from "@mui/icons-material/AddCircle"
import TodoList from "../components/TodoList";
// import { useState } from "react";
// import CreateTask from "../components/CreateTask";
// import TaskManagement from "../components/TaskManagement";
// import { Create } from "@mui/icons-material";
// import { teal } from "@mui/material/colors";
// import '../index.css'

export default function Todos() {
  // const [isEditing, setIsEditing] = useState(false);

  // const handleCreate = (taskDescription: string) => {
  //   console.log("Creating task:", taskDescription);
  //   // setIsEditing(false);
  // }

  return (
    <>
      <TodoList />
      {/* <TaskManagement /> */}
       {/* {isEditing ? (
        <CreateTask
          onCreate={handleCreate}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <IconButton
        className="addTaskButton"
        sx={{
          color: 'teal',
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 70,
          height: 70,
          zIndex: 1000,
        }}
        onClick={() => setIsEditing(true)}
        >
        <AddCircle sx={{ fontSize: 50 }} />
        </IconButton>
      )} */}
    </> 
  );
}