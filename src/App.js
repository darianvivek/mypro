import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
const TodoList = () => {
  const [taskInput, setTaskInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [priorityInput, setPriorityInput] = useState("low");
  const [todos, setTodos] = useState([]);
  const [alertDiv, setAlertDiv] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAddTodo = async () => {
    const newTodo = {
      id: todos.length + 1,
      task: taskInput,
      dueDate: dateInput,
      priority: priorityInput,
      completed: false,
    };

    await axios.post("http://localhost:3500/api/add-todo", newTodo);

    setTodos([...todos, newTodo]);
    setTaskInput("");
    setDateInput("");

    showAlertMessage("Task added successfully");
  };

  const clearAllTodos = async () => {
    setTodos([]);
    await axios.delete("http://localhost:3500/api/delete-all");
    showAlertMessage("All tasks have been cleared");
  };

  const deleteTodo = async (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    await axios.delete(`http://localhost:3500/api/delete-todo/${id}`);
    showAlertMessage("Task deleted successfully");
  };

  const editTodo = async (id) => {
    const editedTodo = await axios.get(
      `http://localhost:3500/api/get-todo/${id}`
    );
    setTaskInput(editedTodo.task);
    setDateInput(editedTodo.dueDate);
    setPriorityInput(editedTodo.priority);

    await axios.put(`http://localhost:3500/api/edit-todo`, editedTodo);
  };

  const toggleStatus = async (id) => {
    const editedTodo = await axios.get(
      `http://localhost:3500/api/get-todo/${id}`
    );
    editTodo.completed = !editTodo.completed;
    await axios.put(`http://localhost:3500/api/edit-todo`, editedTodo);
    //setTodos(updatedTodos);
  };

  const sortTodos = (todoss) => {
    return todoss.sort((a, b) => {
      const dueDateWeight = 100;
      const statusWeight = 50;
      const priorityWeight = 10;
      const today = new Date();
      const priorityValues = { high: -1, medium: 0, low: 1 };

      const aSortingFactor =
        dueDateWeight * (2 * new Date(a.dueDate) - today) +
        statusWeight * (a.completed ? 1 : 0) +
        priorityWeight * priorityValues[a.priority];
      const bSortingFactor =
        dueDateWeight * (2 * new Date(b.dueDate) - today) +
        statusWeight * (b.completed ? 1 : 0) +
        priorityWeight * priorityValues[b.priority];

      return aSortingFactor - bSortingFactor;
    });
  };

  //  const displayTodos = async() => {
  //     const res=await axios.get('http://localhost:3500/api/get-todos');
  //     const todoss=res.data.payload;
  //     console.log(todoss);
  //     if(todoss===undefined)return [];
  //     return (sortTodos(todoss).map((todo) => (
  // <tr key={todo.id}>
  //   <td style={{width:"40%"}}>{todo.task}</td>
  //   <td>{todo.dueDate}</td>
  //   <td>{todo.completed ? 'Completed' : 'Pending'}</td>
  //   <td className='buttons'>
  //     <button onClick={() => editTodo(todo.id)}>Edit</button>
  //     <button onClick={() => deleteTodo(todo.id)}>Delete</button>f
  //     <button onClick={() => toggleStatus(todo.id)}>
  //       {todo.completed ? 'Mark as Pending' : 'Mark as Completed'}
  //     </button>
  //   </td>
  // </tr>
  //     )));
  //  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3500/api/get-todos");
        const todoss = res.data.payload;
        console.log(todoss);

        if (todoss === undefined) return [];

        const sortedTodos = sortTodos(todoss);
        setTodos(sortedTodos);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching todos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setTodos(loadFromLocalStorage());
  }, []);

  useEffect(() => {
    saveToLocalStorage(todos);
  }, [todos]);

  const showAlertMessage = (message) => {
    setAlertDiv(<div className="alert">{message}</div>);
    setTimeout(() => {
      setAlertDiv(null);
    }, 3000);
  };

  const saveToLocalStorage = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const loadFromLocalStorage = () => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  };

  return (
    <div className="TodoList">
      {alertDiv}
      <div className="form">
        <h1>Todo List</h1>
        <input
          type="text"
          style={{ width: "40%" }}
          placeholder="Task"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
        <input
          type="date"
          placeholder="Due Date"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
        />
        <select
          value={priorityInput}
          onChange={(e) => setPriorityInput(e.target.value)}
          className="priority"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={handleAddTodo} className="addtask">
          Add Task
        </button>
        <button onClick={clearAllTodos} className="clearall">
          Clear All Tasks
        </button>
      </div>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Task</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        {/* <tbody>{()=>displayTodos}</tbody> */}
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4">Loading...</td>
            </tr>
          ) : (
            todos.map((todo) => (
              <tr key={todo.id}>
                <td style={{ width: "40%" }}>{todo.task}</td>
                <td>{todo.dueDate}</td>
                <td>{todo.completed ? "Completed" : "Pending"}</td>
                <td className="buttons">
                  <button onClick={() => editTodo(todo.id)}>Edit</button>
                  <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                  <button onClick={() => toggleStatus(todo.id)}>
                    {todo.completed ? "Mark as Pending" : "Mark as Completed"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
export default TodoList;
