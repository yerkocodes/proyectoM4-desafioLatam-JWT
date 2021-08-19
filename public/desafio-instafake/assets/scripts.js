// captura de formulario
const form = document.getElementById('js-form');

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
	//console.log(posts)
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
		<div class="container d-flex">
			<h1>Feed</h1>
			<h4 class="ml-auto"><a href="...">Cerrar</a></h4>
		</div>
	`;

	instaFotos.innerHTML = titlePage;

	posts.forEach((element, index) => {
		template += `
			<div class="card w-100 my-5">
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
