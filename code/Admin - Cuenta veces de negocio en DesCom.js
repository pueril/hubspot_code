const hubspot = require('@hubspot/api-client');

exports.main = async (event, callback) => {
    /*****
    Cuenta horas laborales entre dos fechas.
  *****/
  function counttime(start, end) {
	let dias = (Math.floor(end) - Math.floor(start))/(1000*60*60*24);
	let diaStart = new Date(start).toDateString();
	let diaEnd = new Date(end).toDateString();
	let horas;
	if(!(diaStart === diaEnd)) {
		let weekends = Math.floor((start.getDay() + dias)/7);
		let totalDias = dias - weekends;
		let inicio = start.getHours();
		let termino = end.getHours();
		if(inicio > 18) {
			inicio = 18;
		}
		let horasStart = 18 - inicio;
		if(termino < 9) {
			termino = 9;
		}
		let horasEnd = termino - 9;
		let horasBetween;
		if(totalDias >= 2) {
			horasBetween = 9 * (Math.ceil(totalDias) - 2);
		} else {
			horasBetween = 0;
		}
		horas = horasBetween + horasStart + horasEnd;
	} else {
		let inicio = start.getHours();
		let termino = end.getHours();
		horas = termino - inicio;
	}
	
	return horas;
  }
  /*****
    Usa entradas para extraer datos de cualquier acción del workflow y usarlos en el código en lugar de tener que usar la API de HubSpot.
  *****/
  const proce = event.inputFields['procesamientos_descom'];
  const espera = event.inputFields['espera_en_descom'];
  const start = new Date(event.inputFields['hs_v2_date_entered_183952419'] * 1);
  const end = new Date(event.inputFields['fecha_inicio_cotizacion'] * 1);
  let horas = counttime(start, end);
  const idProperty = undefined;
  console.log(horas);
  
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.SECRET_NAME
  });
  
  if(proce) {  
      try {
      const apiResponse = await hubspotClient.crm.deals.basicApi.update(event.object.objectId, {
        "properties": {
          "procesamientos_descom": parseInt(proce) + 1
        }
      } , idProperty);
      console.log(JSON.stringify(apiResponse, null, 2));
    } catch (e) {
      e.message === 'HTTP request failed'
        ? console.error(JSON.stringify(e.response, null, 2))
        : console.error(e)
    }
  } else {
        try {
      const apiResponse = await hubspotClient.crm.deals.basicApi.update(event.object.objectId, {
        "properties": {
          "procesamientos_descom":  1
        }
      } , idProperty);
      console.log(JSON.stringify(apiResponse, null, 2));
    } catch (e) {
      e.message === 'HTTP request failed'
        ? console.error(JSON.stringify(e.response, null, 2))
        : console.error(e)
    }
  }  
  
  if(espera) {  
      try {
      const apiResponse = await hubspotClient.crm.deals.basicApi.update(event.object.objectId, {
        "properties": {
          "espera_en_descom": parseInt(espera) + horas
        }
      } , idProperty);
      console.log(JSON.stringify(apiResponse, null, 2));
    } catch (e) {
      e.message === 'HTTP request failed'
        ? console.error(JSON.stringify(e.response, null, 2))
        : console.error(e)
    }
  } else {
        try {
      const apiResponse = await hubspotClient.crm.deals.basicApi.update(event.object.objectId, {
        "properties": {
          "espera_en_descom":  horas
        }
      } , idProperty);
      console.log(JSON.stringify(apiResponse, null, 2));
    } catch (e) {
      e.message === 'HTTP request failed'
        ? console.error(JSON.stringify(e.response, null, 2))
        : console.error(e)
    }
  }
  let foo = true;
  console.log('desde workflow');
  /*****
    Usa la función de devolución de llamadas para generar datos que se podrán usar en acciones posteriores en el workflow.
  *****/
  
  callback({
    outputFields: {
      foo
    }
  });
}
