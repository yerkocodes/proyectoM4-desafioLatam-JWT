// API
const api = 'http://localhost:3000/api';

// HTML CAPTURE 
const login = document.getElementById('login');
const modalForm = document.getElementById('js-form');

// BTN 'INICIAR SESION'
login.addEventListener('click', (e) => {
   e.preventDefault();
});

// LOGIN FROM
modalForm.addEventListener('submit', async (e) => {
   const contenido = document.getElementById('contenido');

   const email = document.getElementById('js-input-email').value;
   const pass = document.getElementById('js-input-password').value;

   e.preventDefault();

   const jwt = await getTokenUser(email, pass);

   const dataUser = await getData(jwt);

   //console.log(dataUser);
   
   const showChart = mostrarGrafico(dataUser);

   //contenido.innerHTML = showChart;

   mostrarTabla(dataUser);
});

// VERIFY USER AND GET TOKEN
const getTokenUser = async (email, password) => {
   try {
      const response = await fetch(`${api}/login`, {
         method:'POST',
         body: JSON.stringify({
            "email" : email,
            "password" : password
         })
      });
      const { token } = await response.json();
      if ( token !== undefined ) {
         localStorage.setItem('jwt-token', token)
         successLogin();
         //console.log(token);
         return token
      }
   } catch(err) {
      console.error(`Error: ${err}`)
   }
}

const successLogin = () => {
   const formButtons = document.getElementById('form-buttons');
   let template = `
      <button type="button" class="btn btn-secondary my-4" data-dismiss="modal">Close</button>
      <p class="text-success">Sesion iniciada correctamente.</p>
   `;
   formButtons.innerHTML = template;
};

// GET DATA FUNCTION
const getData = async (jwt) => {
   try{
      const response = await fetch(`${api}/total`, {
         method: 'GET',
         headers: {
            Authorization: `Bearer ${jwt}`,
         }
      });
      const { data } = await response.json();
      //console.log(data);
      return data;
   } catch(err) {
      console.error(err);
   }
};

// CHART
const mostrarGrafico = (data) => {

   let activos = [];
   let recuperados = [];
   let muertos = [];
   let confirmados = [];

   let limit = 500000;

   const dataConfirmed = data.filter((element)=>{
      return element.confirmed >= limit;
   });
   dataConfirmed.forEach((element)=>{
      confirmados.push({ y: element.confirmed, label: element.location });
   })

   const dataDeaths = data.filter((element)=>{
      return element.deaths >= limit;
   });
   dataDeaths.forEach((element)=>{
      muertos.push({ y: element.deaths, label: element.location });
   })
   console.log(confirmados);

   var chart = new CanvasJS.Chart("chartContainer", {

      animationEnabled: false,
      title:{
         text: "Casos Covid19"
      },
      toolTip: {
         shared: true
      },
      legend: {
         cursor:"pointer",
      },
      axisX:{
         labelAngle: 50,
         interval: 1,
      },
      axisY:{
         title: "",
         gridThickness: 1
      },
      data: [{
         type: "column",
         name: "Confirmados",
         legendText: "Confirmados",
         showInLegend: true, // Banderines
         dataPoints:confirmados 
      },
         {
            type: "column",	
            name: "Recuperados",
            legendText: "Recuperados",
            axisYType: "secondary",
            showInLegend: true,
            dataPoints:recuperados
         },
         {
            type: "column",	
            name: "Muertos",
            legendText: "Muertos",
            axisYType: "secondary",
            showInLegend: true,
            dataPoints:muertos
         },{
            type: "column",	
            name: "Activos",
            legendText: "Activos",
            axisYType: "secondary",
            showInLegend: true,
            dataPoints:activos
         }
      ]
   });
   chart.render();
}

// FUNCION MOSTRAR TABLA

const thead = document.getElementById('thead');
const tbody = document.getElementById('tbody');



const mostrarTabla = (data) => {
   const theadTemplate = `
              <tr>
                <th scope="col">Nro</th>
                <th scope="col">Pais</th>
                <th scope="col">Activos</th>
                <th scope="col">Muertos</th>
                <th scope="col">Recuperados</th>
                <th scope="col">Confirmados</th>
                <th scope="col">Detalle</th>
              </tr>
   `;
   thead.innerHTML = theadTemplate;

   let tbodyTemplate = '';

   data.forEach((element, index)=>{
      let tbodyTemplate = `
              <tr>
                <th scope="row">${index+1}</th>
                <td>${element.location}</td>
                <td>${element.active}</td>
                <td>${element.deaths}</td>
                <td>${element.recovered}</td>
                <td>${element.confirmed}</td>
                <td><button onclick="funcion('${element.location}')" data-toggle="modal" data-target="#detalleModal" class="btn btn-primary">Ver Detalle</button></td>
              </tr>
      `;
      tbody.innerHTML += tbodyTemplate;
   })
}




// Insertar data al grafico
const modalDetalle = async (country) => {
   try{
      const data = await getDataCountry(country);
   } catch (err){
      console.error(err)
   }
}

// obtener la data de la location
const getDataCountry = async (location) => {
   try{
      const response = await fetch(`http://localhost:3000/api/countries/${location}`);
      const { data } = await response.json();
      //console.log(data);
      return data;
   } catch(err) {
      console.error(err);
   }
};

// Grafico a mostrar
const mostrarGraficoDetalle = (data) => {

   var chart = new CanvasJS.Chart("CHART", {

      animationEnabled: true,
      title:{
         text: `Detalle ${data.location}`
      },
      axisY:{
         title: "",
      },
      data: [{
         type: "column",
         indexLabelPlacement: "outside",
         indexLabel: "{y}",
         indexLabelOrientation: "horizontal",
         dataPoints: [
            { y: data.confirmed, label: "Confirmados"},
            { y: data.deaths, label: "Muertos"},
            { y: data.recovered, label: "Recuperados"},
            { y: data.active, label: "Activos"}
         ],
      }
      ]
   });
   chart.render();
}

const idGrafico = document.getElementById('grafico');

const funcion = async (param) => {
   try{

   console.log(`Funcionando ${param}`)

   let data = await getDataCountry(`${param}`)

   console.log(data);

   mostrarGraficoDetalle(data);
   
   } catch (err) {
      console.error(err);
   }
}

