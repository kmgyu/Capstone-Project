import React, { useState } from 'react';
import Modal from './Modal';
import moment from 'moment';
import 'moment/locale/ko';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import '../css/TodoModal.css';

const TodoModal = ({ 
  isOpen, 
  onClose, 
  date, 
  todos, 
  onAddTodo, 
  onDeleteTodo, 
  onToggleComplete 
}) => {
  // 날짜 형식 포맷팅
  const formattedDate = moment(date).format('YYYY년 M월 D일');
  const dayOfWeek = moment(date).format('dddd');
  
  // 입력 상태 관리
  const [newTodoText, setNewTodoText] = useState('');
  
  // 일정 추가 핸들러
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      onAddTodo({
        title: newTodoText.trim(),
        type: 'farming', // 기본값
        start: date,
        end: date,
        color: '#4CAF50', // 기본 색상
        completed: false
      });
      setNewTodoText(''); // 입력 필드 초기화
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="todo-modal-title">
          <FontAwesomeIcon icon={faCalendarDay} className="date-icon" />
          <span>{formattedDate}</span>
          <span className="day-of-week">({dayOfWeek})</span>
        </div>
      }
      className="todo-modal"
    >
      <div className="todo-modal-content">
        {/* 일정 추가 폼 */}
        <form className="todo-form" onSubmit={handleAddTodo}>
          <input 
            type="text" 
            className="todo-input" 
            placeholder="할 일 추가..." 
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
          />
          <button type="submit" className="todo-button">추가</button>
        </form>
        
        {/* 할 일 목록 */}
        {todos.length === 0 ? (
          <div className="no-todos">
            <p>이 날짜에 예정된 일정이 없습니다.</p>
            <p className="add-todo-prompt">새로운 일정을 추가해보세요!</p>
          </div>
        ) : (
          <ul className="todo-list">
            {todos.map(todo => (
              <li 
                key={todo.id} 
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
                style={{ borderLeft: `4px solid ${todo.color}` }}
              >
                <input 
                  type="checkbox" 
                  className="todo-checkbox" 
                  checked={todo.completed || false}
                  onChange={() => onToggleComplete(todo.id)}
                />
                <span className="todo-text">
                  {todo.title}
                  {todo.start !== todo.end && (
                    <small className="todo-date">
                      {` (${moment(todo.start).format('M/D')} ~ ${moment(todo.end).format('M/D')})`}
                    </small>
                  )}
                </span>
                <span className={`todo-status ${todo.completed ? 'completed-status' : 'pending-status'}`}>
                  {todo.completed ? '완료' : '진행중'}
                </span>
                <span className="todo-type">{todo.type === 'farming' ? '농사' : '병충해'}</span>
                <button 
                  className="todo-delete"
                  onClick={() => onDeleteTodo(todo.id)}
                  aria-label="삭제"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
};

export default TodoModal;