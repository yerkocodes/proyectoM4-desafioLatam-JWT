// API's
const API = 'http://localhost:3000/api';
const APITOTAL = 'http://localhost:3000/api/total';

window.onload = async () => {
  try {
    const response = await fetch(`${APITOTAL}`)
    const {data} = await response.json()
    mostrarGrafico(data)
    mostrarTabla(data);
  }catch(err){
    console.error(`Error: ${err}`)
  }
}

// HTML CAPTURE 
const navbarLogin = document.getElementById('login');
const modalForm = document.getElementById('js-form');
const situacionChileBtn = document.getElementById('situacionChile');
const cerrarSesion = document.getElementById('cerrarSesion');
const tablaContainer = document.getElementById('dataTable');

situacionChileBtn.addEventListener('click', async () => {
  try {
    const jwt = await localStorage.getItem('jwt-token');
    graficoChile(jwt);
    dataTable.setAttribute('style','display:none;')
  } catch (err) {
    console.error(`Error: ${err}`);
  }
} )

// BTN 'INICIAR SESION'
navbarLogin.addEventListener('click', (e) => {
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
  // Cambian style de botones para ocultar y mostrar correspondientes en el navbar
  situacionChileBtn.setAttribute('style','display:block')
  cerrarSesion.setAttribute('style','display:block')
  login.setAttribute('style','display:none')
});

situacionChile.addEventListener('click', () => {
  console.log('very good');

})

cerrarSesion.addEventListener('click', () => {
  console.log('Cerrar Sesion');
})

// VERIFY USER AND GET TOKEN
const getTokenUser = async (email, password) => {
  try {
    const response = await fetch(`${API}/login`, {
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
    const response = await fetch(`${API}/total`, {
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

// CHART SITUACION CHILE

const getDataSituacion = async (situacion, jwt) => {
  try{
    const response = await fetch(`${API}/${situacion}`, {
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

// APIS PARA GRAFICO CHILE

let graficoChile = async (jwt) => {
  
  const confir = await getDataSituacion('confirmed', jwt)
  const muert = await getDataSituacion('deaths', jwt)
  const recupe = await getDataSituacion('recovered', jwt)

  console.log(confir);
  console.log(muert);
  console.log(recupe);

  let recuperados= [];
  let muertos = [];
  let confirmados = [];

  confir.forEach((element)=>{
    confirmados.push({ y: element.total, label: element.date });
  })

  muert.forEach((element)=>{
    muertos.push({ y: element.total, label: element.date});
  })
  //console.log(confirmados);

  recupe.forEach((element)=>{
    recuperados.push({ y: element.total, label: element.date});
  })
  //console.log(recuperados);

  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    title:{
      text: "Situacion Chile"
    },
    axisX: {
      valueFormatString: "DD MMM,YY",
      labelAngle: 50,
      //interval: 1,
    },
    axisY: {
      title: "Cantidad de casos",
    },
    legend:{
      cursor: "pointer",
      fontSize: 16,
      itemclick: toggleDataSeries
    },
    toolTip:{
      shared: true
    },
    data: [{
      name: "Confirmados",
      type: "spline",
      yValueFormatString: "#0.## °C",
      showInLegend: true,
      dataPoints: confirmados
    },
      {
        name: "Muertos",
        type: "spline",
        yValueFormatString: "#0.## °C",
        showInLegend: true,
        dataPoints: muertos
      },
      {
        name: "Recuperados",
        type: "spline",
        yValueFormatString: "#0.## °C",
        showInLegend: true,
        dataPoints: recuperados
      }]
  });
  chart.render();

  function toggleDataSeries(e){
    if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    }
    else{
      e.dataSeries.visible = true;
    }
    chart.render();
  }

}
// -----------------------------------------------

// CHART SITUACION MUNDIAL
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
                <td><button onclick="countryDetails('${element.location}')" data-toggle="modal" data-target="#detalleModal" class="btn btn-primary">Ver Detalle</button></td>
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
    const response = await fetch(`${API}/countries/${location}`);
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

const countryDetails = async (param) => {
  try{
    //    param.split(' ').join('_');
    //    console.log(param);
    //    console.log(`Funcionando ${param}`)
    let data = await getDataCountry(`${param}`)
    //    console.log(data);
    mostrarGraficoDetalle(data);
  } catch (err) {
    console.error(err);
  }
}

// Logout session
const logout = () => {
    localStorage.removeItem("jwt-token"); // Limpia el localStorage, en especifico la llave pasada como argumento al localStorage
    //localStorage.clear(); // Limpia el todo el localStorage
    location.reload(); // Recarga la pagina al cerrar sesion
}
