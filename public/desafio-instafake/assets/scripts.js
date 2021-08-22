// Form capture
const form = document.getElementById('js-form');
let posts = [];
const btnShowMore = document.getElementById('btnShowMore');

// Event Listener to form submit
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('js-input-email').value;
    const pass = document.getElementById('js-input-password').value;

    const JWT = await login(email, pass);
    posts = await getPosts(JWT)

    if(posts.length !== 0){
        addPosts(posts)
        btnShowMore.setAttribute('style','display:block;')
    }
})

// Funcion que Verifica y obtiene el TOKEN
const login = async (email, password) => {
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
        //console.log(data)
        return data;
    } catch(err) {
        console.error(`Error ${err}`)
    }
};

const getMorePosts = async (jwt, page) => {
    try {
        const res = await fetch(`http://localhost:3000/api/photos?page=${page}`, {
            method:'GET',
            headers: {
                Authorization: `Bearer ${jwt}`
            },
            //params: { $$$
            //	page: page
            //}
        })
        const { data } = await res.json(); // $$$ ? {}
        //console.log(data)
        //if(data){
        //	addPosts(data)
        //}
        return data;
    } catch(err) {
        console.error(`Error ${err}`)
    }
};


// Funcion que manipula y anade los posts en el DOM
const instaFotos = document.getElementById('instaFotos')

const addPosts = (posts) => {

    let template ='';
    let titlePage = `
        <div class="container d-flex justify-content-between align-items-center">
            <h2>Feed</h2>
            <h5 class=""><a class="" onclick="logout()" href="">Cerrar</a></h5>
        </div>
    `;

    instaFotos.innerHTML = titlePage;

    posts.forEach((element) => {
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

// Show more photos Btn

let contador = 2;

const showMorePhotos = async () => {
    const JWT = localStorage.getItem("jwt-token")
    const data = await getMorePosts(JWT, contador);

    let template= ''
    data.forEach((element) => {
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
    contador++
    //console.log(posts)
}

// Logout session
const logout = () => {
    localStorage.removeItem("jwt-token"); // Limpia el localStorage, en especifico la llave pasada como argumento al localStorage
    //localStorage.clear(); // Limpia el todo el localStorage
    location.reload(); // Recarga la pagina al cerrar sesion
}

// IIFE validate if exists token in localStorge, to hide login and load photos
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
