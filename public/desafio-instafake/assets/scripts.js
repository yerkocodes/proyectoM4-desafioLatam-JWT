// Form capture
const form = document.getElementById('js-form');

// Event Listener to form submit
form.addEventListener('submit', async (e) => {
	e.preventDefault();
	const email = document.getElementById('js-input-email').value;
	const pass = document.getElementById('js-input-password').value;
	const JWT = await postData(email, pass);
	const posts = await getPosts(JWT)
	if(posts){
		addPosts(posts)
	} else {
		alert('El JWT no es valido')
	}
	console.log(posts)
})

const postData = async (email, password) => {
	try {
		const response = await fetch('http://localhost:3000/api/login', {
			method:'POST',
			body: JSON.stringify({
				"email" : email,
				"password" : password
			})
		});
		const { token } = await response.json();
		localStorage.setItem('jwt-token', token)
		return token
	} catch(err) {
		console.error(`Error: ${err}`)
	}
}

const getPosts = async (jwt) => {
	try {
		const res = await fetch('http://localhost:3000/api/photos', {
			method:'GET',
			headers: {
				Authorization: `Bearer ${jwt}`
			}
		})
		const { data } = await res.json(); // $$$ ? {}
		return data;

	} catch(err) {
		console.error(`Error ${err}`)
	}
};

const addPosts = (posts) => {
	const instaFotos = document.getElementById('instaFotos')

	let template ='';
	let titlePage = `
		<div class="container d-flex justify-content-between align-items-center">
			<h2>Feed</h2>
			<h5 class=""><a id="logoutSesion" href="">Cerrar</a></h5>
		</div>
	`;

	instaFotos.innerHTML = titlePage;

	posts.forEach((element, index) => {
		template += `
			<div class="card w-50 my-5 mx-auto">
				<img src="${element.download_url}" class="card-img-top" alt="...">
				<div class="card-body">
					<p class="card-text">${element.author}</p>
				</div>
			</div>
		`
	})
	instaFotos.innerHTML += template;

	// Esconder formulario
	form.setAttribute('style','display:none;')
}

// Logout session
const logout = document.getElementById('logoutSesion')

logout.addEventListener('click', () => {
	localStorage.clear(); // Limpia el localStorage
	location.reload(); // Recarga la pagina al cerrar sesion
})
