import { useContext, useState } from "react";
import { TaskContext, DispatchContext } from "./Context";

export default function TaskList({ tasks, onChange, onDelete }) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChange} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const dispatch = useContext(DispatchContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button
          onClick={() => {
            setIsEditing(false);
            dispatch({
              type: "changed",
              task: {
                ...task,
                text: editText,
              },
            });
          }}
        >
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        <span className="task-text">{task.text}</span>
        <span className={`priority-tag priority-${task.priority || "medium"}`}>{task.priority || "medium"}</span>
        {task.dueDate && <span className="due-date">Due: {task.dueDate}</span>}
        <button style={{ marginLeft: 10 }} onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }

  return (
    <div className={`task-item${task.done ? " done" : ""}`}>
      <input
        type="checkbox"
        className="custom-checkbox"
        checked={task.done}
        onChange={(e) => {
          dispatch({
            type: "changed",
            task: {
              ...task,
              done: e.target.checked,
            },
          });
        }}
      />
      {taskContent}
      <button
        style={{ marginLeft: 10 }}
        onClick={() => {
          onDelete ? onDelete(task.id) : dispatch({ type: "deleted", id: task.id });
        }}
      >
        Delete
      </button>
    </div>
  );
}
