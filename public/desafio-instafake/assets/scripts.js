// Form captura
const form = document.getElementById('js-form');
//Arreglo donde se añadiran los Posts
let posts = [];
//Captura del boton para mostrar más Posts
const btnShowMore = document.getElementById('btnShowMore');

// Event Listener to form submit login
form.addEventListener('submit', async (e) => {
	e.preventDefault();

	const email = document.getElementById('js-input-email').value; //Constante donde se almacena Imputs de Email
	const pass = document.getElementById('js-input-password').value; //Constante donde se almacena Imputs de Paswword

	const JWT = await login(email, pass); //Conatante donde se almacena el token del usuario
	posts = await getPosts(JWT) //Al arreglo posts se añadira la data obtenida por la function getPosts()

		if(posts.length !== 0){
			addPosts(posts)  //Si la cantidad elementos del array !=0 se ejecuta functin addPosts y se pasa parametro el arreglo
			btnShowMore.setAttribute('style','display:block;') //Atributo que muestra boton Mostrar mas al iniciar seccion
		}
})

// Funcion Asincrona que Verifica y obtiene el TOKEN del usuario y constraseña ingresados
const login = async (email, password) => {
	try {
		const response = await fetch(`http://localhost:3000/api/login`, {
			method:'POST',
			body: JSON.stringify({
				"email" : email,
				"password" : password
			})
		});
		const { token } = await response.json(); //Almacena en una constante token la respuesta en formato JSON
		localStorage.setItem('jwt-token', token) //Setea en localStorage el nombre y token
		return token
	} catch(err) {
		console.error(`Error: ${err}`)
	}
}

// Funcion Asincrona que retorna un arreglo con los primeros 100 posts 
const getPosts = async (jwt) => {
	try {
		const res = await fetch(`http://localhost:3000/api/photos`, { 
			method:'GET',
			headers: {
				Authorization: `Bearer ${jwt}`
			}
		})
		const { data } = await res.json();
		//console.log(data)
		return data;
	} catch(err) {
		console.error(`Error ${err}`)
	}
};

//Function Asincrona que agrega los siguientes 100 posts al arreglo actual
const getMorePosts = async (jwt, page) => {
	try {
		const res = await fetch(`http://localhost:3000/api/photos?page=${page}`, {
			method:'GET',
			headers: {
				Authorization: `Bearer ${jwt}` //Verificación de usuario para obtener datos 
			},
		})
		const { data } = await res.json(); // $$$ ? {}
		return data;
	} catch(err) {
		console.error(`Error ${err}`)
	}
};


const instaFotos = document.getElementById('instaFotos') //Captura de seccion html donde se añadiran los Posts

// Funcion que manipula y añade los posts en el DOM
const addPosts = (posts) => {

	let template ='';
	let titlePage = `
		<div class="container d-flex justify-content-between align-items-center">
			<h2>Feed</h2>
			<h5 class=""><a class="" onclick="logout()" href="">Cerrar</a></h5>
		</div>
	`;

	instaFotos.innerHTML = titlePage; //Añade a la sección instafotos el contenido de la variable titlePage

	posts.forEach((element) => { //Se recorre el arreglo Posts y se añade cada posts 
		template += `
			<div class="card w-50 my-5 mx-auto">
				<img src="${element.download_url}" class="card-img-top" alt="...">
				<div class="card-body">
					<p class="card-text">${element.author}</p>
				</div>
			</div>
		`
	})

	instaFotos.innerHTML += template; //Añade a la sección instafotos el contenido de la variable template(posts)

	// Esconder formulario
	form.setAttribute('style','display:none;')
}
//Se inicializa la variable contador en 2
let contador = 2;

// Funcion Asisncrona que muestra 100 posts más
 const showMorePhotos = async () => {
	const JWT = localStorage.getItem("jwt-token") //Se alamacena en una constante el token almacenado con nombre "jwt-token"
	const data = await getMorePosts(JWT, contador); //Se almacena en una constante la data obtenida con la function getMorePosts()

	let template= ''
	data.forEach((element) => { //Se recorre la data y genera un template con los elementos para los posts
		template += `
			<div class="card w-50 my-5 mx-auto">
				<img src="${element.download_url}" class="card-img-top" alt="...">
				<div class="card-body">
					<p class="card-text">${element.author}</p>
				</div>
			</div>
		`
	})

	instaFotos.innerHTML += template; //Añade a la sección instafotos cada posts obtenido con el forEach
	contador++ //A la variable contador se le suma 1
	//console.log(posts)
}

// Logout session
const logout = () => {
	localStorage.removeItem("jwt-token"); // Limpia el localStorage, en especifico la llave pasada como argumento al localStorage
	//localStorage.clear(); // Limpia el todo el localStorage
	location.reload(); // Recarga la pagina al cerrar sesion
}

// IIFE valida si existe token en el localStorge, para ocultar login y cargar las fotos
( async () => {
	if ( localStorage.getItem('jwt-token') ) {
		form.setAttribute('style','display:none;');
		posts = await getPosts(localStorage.getItem('jwt-token'))
		if(posts.length !== 0){
			addPosts(posts)
			btnShowMore.setAttribute('style','display:block;')
		}
	}
})()
