import { useState , useContext} from "react";
import { DispatchContext } from "./Context";

export default function AddTask({ onAdd }) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  return (
    <>
      <input
        type="text"
        value={text}
        placeholder="Enter a Task"
        onChange={(e) => setText(e.target.value)}
      />
      <select
        value={priority}
        onChange={e => setPriority(e.target.value)}
        className="add-task-select"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
        className="add-task-date"
      />
      <button
        onClick={() => {
          if (text.trim() === "") return;
          onAdd(text, priority, dueDate);
          setText("");
          setPriority("medium");
          setDueDate("");
        }}
      >
        Add
      </button>
    </>
  );
}