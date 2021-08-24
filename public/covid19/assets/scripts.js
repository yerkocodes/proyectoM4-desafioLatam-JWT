// API
const api = 'http://localhost:3000/api';

// HTML CAPTURE 
const login = document.getElementById('login');
const modalForm = document.getElementById('js-form');

// BTN 'INICIAR SESION'
login.addEventListener('click', (e) => {
   e.preventDefault();
   console.log('Bien hecho')
});

// LOGIN FROM
modalForm.addEventListener('submit', (e) => {
   const email = document.getElementById('js-input-email').value;
   const pass = document.getElementById('js-input-password').value;

   e.preventDefault();
   getTokenUser(email, pass);

   //console.log(`${email} y ${pass}`);
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
         console.log('Si existe el token')
         console.log(token);
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
const getData = () => {
   
};

// CHART
window.onload = function () {

   var chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      title:{
         text: "Paises con Covid19"
      },
      legend: {
         cursor:"pointer",
         itemclick : toggleDataSeries
      },
      toolTip: {
         shared: true,
         content: toolTipFormatter
      },
      data: [{
         type: "column",
         showInLegend: true,
         name: "Casos Activos",
         color: "red",
         dataPoints: [
            { y: 243, label: "Italy" },
            { y: 236, label: "China" },
            { y: 243, label: "France" },
            { y: 273, label: "Great Britain" },
            { y: 269, label: "Germany" },
            { y: 196, label: "Russia" },
            { y: 1118, label: "USA" }
         ]
      },
         {
            type: "column",
            showInLegend: true,
            name: "Casos confirmados",
            color: "yellow",
            dataPoints: [
               { y: 212, label: "Italy" },
               { y: 186, label: "China" },
               { y: 272, label: "France" },
               { y: 299, label: "Great Britain" },
               { y: 270, label: "Germany" },
               { y: 165, label: "Russia" },
               { y: 896, label: "USA" }
            ]
         },
         {
            type: "column",
            showInLegend: true,
            name: "Casos muertos",
            color: "gray",
            dataPoints: [
               { y: 236, label: "Italy" },
               { y: 172, label: "China" },
               { y: 309, label: "France" },
               { y: 302, label: "Great Britain" },
               { y: 285, label: "Germany" },
               { y: 188, label: "Russia" },
               { y: 788, label: "USA" }
            ]
         },
         {
            type: "column",
            showInLegend: true,
            name: "Casos recuperados",
            color: "turquoise",
            dataPoints: [
               { y: 236, label: "Italy" },
               { y: 172, label: "China" },
               { y: 309, label: "France" },
               { y: 302, label: "Great Britain" },
               { y: 285, label: "Germany" },
               { y: 188, label: "Russia" },
               { y: 788, label: "USA" }
            ]
         }]
   });
   chart.render();

   function toolTipFormatter(e) {
      var str = "";
      var total = 0 ;
      var str3;
      var str2 ;
      for (var i = 0; i < e.entries.length; i++){
         var str1 = "<span style= \"color:"+e.entries[i].dataSeries.color + "\">" + e.entries[i].dataSeries.name + "</span>: <strong>"+  e.entries[i].dataPoint.y + "</strong> <br/>" ;
         total = e.entries[i].dataPoint.y + total;
         str = str.concat(str1);
      }
      str2 = "<strong>" + e.entries[0].dataPoint.label + "</strong> <br/>";
      str3 = "<span style = \"color:Tomato\">Total: </span><strong>" + total + "</strong><br/>";
      return (str2.concat(str)).concat(str3);
   }

   function toggleDataSeries(e) {
      if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
         e.dataSeries.visible = false;
      }
      else {
         e.dataSeries.visible = true;
      }
      chart.render();
   }

}
