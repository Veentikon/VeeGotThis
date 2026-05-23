// src/context/AuthContext.tsx
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";

type Task = {
  id: string;
  text: string;
  completed: boolean;
};

type TaskSet = {
  id: string;
  name: string;
  tasks: Task[];
  routine?: boolean;
};

// type TaskSet = {
//   id: string;
//   ownerId: string;
//   sharedWith: string[];
// //   createdAt: string;
//   name: string;
//   tasks: Todo[];
//   routine?: boolean;
// };

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
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
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
    const token = data.access_token;

    // Set data and navigate to home page
    setToken(token);
    localStorage.setItem("token", token);
    setUser(data.username);

    const tasksets = await apiFetch("/tasksets");
    setTaskSets(tasksets);

    navigate("/", { replace: true });
  }

  function logout() {
    setUser(null);
    setTaskSets([]);
    setToken(null);
    localStorage.removeItem("token");
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

