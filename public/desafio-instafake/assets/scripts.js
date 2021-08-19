// Form capture
const form = document.getElementById('js-form');

// Event Listener to form submit
form.addEventListener('submit', async (e) => {
	e.preventDefault();

	//let imagesPage = 1;

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

// Funcion que Verifica y obtiene el TOKEN
const postData = async (email, password) => {
	try {
		const response = await fetch(`http://localhost:3000/api/login`, {
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

// Funcion que retorna un arreglo con los posts 
const getPosts = async (jwt) => {
	try {
		const res = await fetch(`http://localhost:3000/api/photos`, {
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

// Funcion que manipula y anade los posts en el DOM
const addPosts = (posts) => {
	const instaFotos = document.getElementById('instaFotos')

	let template ='';
	let titlePage = `
		<div class="container d-flex justify-content-between align-items-center">
			<h2>Feed</h2>
			<h5 class=""><a class="" onclick="logout()" href="">Cerrar</a></h5>
		</div>
	`;

	instaFotos.innerHTML = titlePage;

	posts.forEach((element, index) => {
		template += `
			<div class="card w-50 my-5 mx-auto">
				<img src="${element.download_url}" class="card-img-top" style="width:20px;" alt="...">
				<div class="card-body">
					<p class="card-text">${element.author}</p>
				</div>
			</div>
		`
	})
	instaFotos.innerHTML += template;

	let showMoreBtn = `
		<div id="showPhotos">
			<button onclick="showMorePhotos" class="btn btn-primary text-center" >Mostrar mas</button>
		</div>
	`;
	instaFotos.innerHTML += showMoreBtn

	// Esconder formulario
	form.setAttribute('style','display:none;')
}

// Show more photos Btn

// Evento click para agregar más conjuntos de fotos, añadiéndolas
//const agregarFotos = async () =>{
//	pagina = pagina + 1;
//
//	const token = localStorage.getItem('jwt-token');
//	const photos = await getPosts(token,pagina);
//	addPosts(photos);
//
//	return pagina;
//};

const showMorePhotos = () => {

	const JWT = localStorage.getItem("jwt-token")
	imagesPage++;
	console.log("loadImg ", imagesPage);
	if (imagesPage <= 10) {
		getPosts(JWT, imagesPage);
	} else {
		alert("No hay mas fotos para cargar")
	}
}

// Logout session
const logout = () => {
	localStorage.clear(); // Limpia el localStorage
	location.reload(); // Recarga la pagina al cerrar sesion
}
