import React, { useState } from 'react';
import '../css/TodoList.css';

const TodoList = () => {
  // Todo 아이템의 초기 상태
  const [todos, setTodos] = useState([
    { id: 1, text: '논 벼 생육 상태 확인', completed: false },
    { id: 2, text: '드론 배터리 충전', completed: true },
    { id: 3, text: '방제 작업 계획 수립', completed: false },
    { id: 4, text: '비닐하우스 온도 체크', completed: false }
  ]);
  
  // 새로운 Todo 입력값을 위한 상태
  const [newTodoText, setNewTodoText] = useState('');

  // Todo 추가 함수
  const addTodo = (e) => {
    e.preventDefault();
    
    if (newTodoText.trim() === '') return;
    
    const newTodo = {
      id: Date.now(), // 고유 ID 생성을 위해 타임스탬프 사용
      text: newTodoText,
      completed: false
    };
    
    setTodos([...todos, newTodo]);
    setNewTodoText(''); // 입력 필드 초기화
  };

  // Todo 체크박스 상태 변경 함수
  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Todo 삭제 함수
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <section className="todo-section">
      <h3 className="section-title">오늘 할 일</h3>
      <form className="todo-form" onSubmit={addTodo}>
        <input 
          type="text" 
          className="todo-input" 
          placeholder="할 일 추가..." 
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
        />
        <button type="submit" className="todo-button">
          <i className="fas fa-plus"></i>
        </button>
      </form>
      <ul className="todo-list">
        {todos.map(todo => (
          <li 
            key={todo.id} 
            className={`todo-item ${todo.completed ? 'completed' : ''}`}
          >
            <input 
              type="checkbox" 
              className="todo-checkbox" 
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id)}
            />
            <span className="todo-text">{todo.text}</span>
            <button 
              className="todo-delete"
              onClick={() => deleteTodo(todo.id)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TodoList;