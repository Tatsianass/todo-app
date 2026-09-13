import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTasks } from "./hooks/useTasks";
import HomeScreen from "./screens/HomeScreen";
import QuadrantScreen from "./screens/QuadrantScreen";

export default function App() {
  const { tasks, addTask, toggleTask, deleteTask, countByQuadrant } = useTasks();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomeScreen countByQuadrant={countByQuadrant} />}
        />
        <Route
          path="/quadrant/:id"
          element={
            <QuadrantScreen
              tasks={tasks}
              addTask={addTask}
              toggleTask={toggleTask}
              deleteTask={deleteTask}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
