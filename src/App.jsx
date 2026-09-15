import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useTasks } from "./hooks/useTasks";
import AuthScreen from "./screens/AuthScreen";
import HomeScreen from "./screens/HomeScreen";
import QuadrantScreen from "./screens/QuadrantScreen";

function AuthenticatedApp({ user, onLogout }) {
  const { tasks, addTask, editTask, toggleTask, deleteTask, countByQuadrant } =
    useTasks(user.id);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomeScreen
            user={user}
            onLogout={onLogout}
            countByQuadrant={countByQuadrant}
          />
        }
      />
      <Route
        path="/quadrant/:id"
        element={
          <QuadrantScreen
            tasks={tasks}
            addTask={addTask}
            editTask={editTask}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const { user, error, register, login, logout, clearError } = useAuth();

  return (
    <BrowserRouter>
      {user ? (
        <AuthenticatedApp key={user.id} user={user} onLogout={logout} />
      ) : (
        <Routes>
          <Route
            path="/login"
            element={<AuthScreen key="login" mode="login" onSubmit={login} error={error} onClearError={clearError} />}
          />
          <Route
            path="/register"
            element={
              <AuthScreen
                key="register"
                mode="register"
                onSubmit={register}
                error={error}
                onClearError={clearError}
              />
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}
