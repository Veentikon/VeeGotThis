// src/context/AuthContext.tsx
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

type Task = {
  id: string;
  text: string;
  completed: boolean;
};

type TaskSet = {
  id: string;
  name: string;
  tasks: Task[];
};

type AuthContextType = {
  user: string | null;
  taskSets: TaskSet[];
  setTaskSets: React.Dispatch<React.SetStateAction<TaskSet[]>>; // TEMP
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [taskSets, setTaskSets] = useState<TaskSet[]>([]);
  const navigate = useNavigate();

  async function login(username: string, password: string) {
    const res = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    const data = await res.json();

    console.log(data.tasksets);
    // Set data and navigate to home page
    setUser(data.username);
    setTaskSets(data.tasksets);
    navigate("/", { replace: true });
  }

  function logout() {
    setUser(null);
    setTaskSets([]);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        taskSets,
        setTaskSets,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}

