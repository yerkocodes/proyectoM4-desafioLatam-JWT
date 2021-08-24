const api = 'http://localhost:3000/api/total';

const login = document.getElementById('login');
const email = document.getElementById('js-input-email').value;
const pass = document.getElementById('js-input-password').value;
const modalForm = document.getElementById('js-form');

login.addEventListener('click', (e) => {
   e.preventDefault();
   console.log('Bien hecho')
});

modalForm.addEventListener('submit', (e) => {
   e.preventDefault();
   console.log(`${email} y ${pass}`);
});
