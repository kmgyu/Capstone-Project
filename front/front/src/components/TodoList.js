import React from "react";

function TodoList() {
  return (
    <div className="todo-list">
      <h2> Todo List</h2>
      <ul>
        <li>작업1 이름</li>
        <li>작업2 이름</li>
        <li>작업3 이름</li>
      </ul>
      <h3> 병충해 대응 추천</h3>
      <ul>
        <li>작업1 이름</li>
        <li>작업2 이름</li>
      </ul>
      <button className="generate-btn">할 일 생성</button>
    </div>
  );
}

export default TodoList;
