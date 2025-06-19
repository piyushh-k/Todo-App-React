import "./App.css";
import TaskList from "./TaskList";
import AddTask from "./Add";
import { act, useReducer } from "react";
import { useContext, useRef, useState } from "react";
import { DispatchContext, TaskContext } from "./Context";

let nextId = 3;
const initialTasks = [
  { id: 0, text: "Philosopher's Path", done: true },
  { id: 1, text: "Visit the temple", done: false },
  { id: 2, text: "Drink matcha", done: false },
];

export default function App() {
  const [tasks, dispatch] = useReducer(TaskReducer, initialTasks);
  const [filter, setFilter] = useState("all");
  const [lastDeleted, setLastDeleted] = useState(null);
  const nextId = useRef(3);

  function handleAdd(text, priority, dueDate) {
    dispatch({
      type: "added",
      id: nextId.current++,
      text,
      priority,
      dueDate,
    });
  }

  function handleChange(task) {
    dispatch({ type: "changed", task });
  }

  function handleDelete(taskId) {
    const deletedTask = tasks.find((t) => t.id === taskId);
    setLastDeleted(deletedTask);
    dispatch({ type: "deleted", id: taskId });
  }

  function handleUndo() {
    if (lastDeleted) {
      dispatch({
        type: "added",
        id: lastDeleted.id,
        text: lastDeleted.text,
        priority: lastDeleted.priority,
        dueDate: lastDeleted.dueDate,
        done: lastDeleted.done,
      });
      setLastDeleted(null);
    }
  }

  function handleClearCompleted() {
    tasks.filter((t) => t.done).forEach((t) => handleDelete(t.id));
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "active") return !task.done;
    if (filter === "completed") return task.done;
    return true;
  });

  return (
    <div className="app-container">
      <TaskContext value={tasks}>
        <DispatchContext value={dispatch}>
          <h1>Day off in Kyoto</h1>
          <div className="add-task-row">
            <AddTask onAdd={handleAdd} />
          </div>
          <div className="filter-row">
            <div>
              <button className={`filter-btn${filter === "all" ? " selected" : ""}`} onClick={() => setFilter("all")}>All</button>
              <button className={`filter-btn${filter === "active" ? " selected" : ""}`} onClick={() => setFilter("active")}>Active</button>
              <button className={`filter-btn${filter === "completed" ? " selected" : ""}`} onClick={() => setFilter("completed")}>Completed</button>
            </div>
            <span className="counter">{filteredTasks.length} tasks</span>
          </div>
          <TaskList
            tasks={filteredTasks}
            onChange={handleChange}
            onDelete={handleDelete}
          />
          <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
            <button style={{ flex: 1, background: "#444", color: "#fff" }} onClick={handleClearCompleted}>Clear Completed</button>
            <button style={{ flex: 1, background: lastDeleted ? "#e52e71" : "#888", color: "#fff" }} onClick={handleUndo} disabled={!lastDeleted}>Undo Delete</button>
          </div>
        </DispatchContext>
      </TaskContext>
    </div>
  );
}

function TaskReducer(tasks, action) {
  if (action.type === "deleted") {
    return tasks.filter((p) => p.id !== action.id);
  } else if (action.type === "changed") {
    return tasks.map((task) => {
      if (task.id === action.task.id) {
        return { ...task, ...action.task };
      } else {
        return task;
      }
    });
  } else if (action.type === "added") {
    return [
      ...tasks,
      {
        id: action.id,
        text: action.text,
        done: action.done ?? false,
        priority: action.priority || "medium",
        dueDate: action.dueDate || "",
      },
    ];
  }
}
