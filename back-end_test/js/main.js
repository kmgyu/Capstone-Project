// main.js

// 필요한 DOM 요소 가져오기
const addTaskBtn = document.getElementById('add-task-btn');
const taskModal = document.getElementById('task-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const saveTaskBtn = document.getElementById('save-task-btn');

// 모달 열기
addTaskBtn.addEventListener('click', () => {
    console.log(1)
    taskModal.classList.remove('hidden'); 
})

// 모달 닫기 (닫기 버튼 클릭 시)
closeModalBtn.addEventListener('click', () => {
    taskModal.classList.add('hidden');
});

// 모달 닫기 (저장 버튼 클릭 시)
saveTaskBtn.addEventListener('click', () => {
    alert('할 일이 저장되었습니다!'); 
    taskModal.classList.add('hidden');
});
