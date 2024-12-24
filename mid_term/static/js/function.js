document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    loginBtn.addEventListener('click', () => {
        loginForm.classList.remove('d-none');
        registerForm.classList.add('d-none');
        loginBtn.classList.add('btn-primary');
        loginBtn.classList.remove('btn-secondary');
        registerBtn.classList.remove('btn-primary');
        registerBtn.classList.add('btn-secondary');
    });

    registerBtn.addEventListener('click', () => {
        registerForm.classList.remove('d-none');
        loginForm.classList.add('d-none');
        registerBtn.classList.add('btn-primary');
        registerBtn.classList.remove('btn-secondary');
        loginBtn.classList.remove('btn-primary');
        loginBtn.classList.add('btn-secondary');
    });
});