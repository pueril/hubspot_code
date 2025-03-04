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
  
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.SECRET_NAME
  });
  const idProoperty = undefined;
  const start = new Date(event.inputFields['fecha_inicio_cotizacion'] * 1);
  const end = new Date(event.inputFields['hs_v2_date_exited_183952419'] * 1);
  const entrada = event.inputFields['hs_v2_date_entered_183952419'];
  let hrsDC = event.inputFields['horas_de_descom'];
  let horas = counttime(start, end);
  
  if(start > entrada) {
    if(hrsDC) {
      try {
        const apiResponse = await hubspotClient.crm.deals.basicApi.update(event.object.objectId, {
          "properties": {
            "horas_de_descom": parseInt(hrsDC) + horas
          }
        }, idProoperty);
      } catch (e) {
        e.message === 'HTTP request failed'
        ? console.error(JSON.stringify(e.response, null, 2))
        : console.error(e)
      }
    } else {
      try {
        const apiResponse = await hubspotClient.crm.deals.basicApi.update(event.object.objectId, {
          "properties": {
            "horas_de_descom": horas
          }
        }, idProoperty);
      } catch (e) {
        e.message === 'HTTP request failed'
        ? console.error(JSON.stringify(e.response, null, 2))
        : console.error(e)
      }
    }
  }
  /*****
    Usa la función de devolución de llamadas para generar datos que se podrán usar en acciones posteriores en el workflow.
  *****/
  callback({
    outputFields: {
    }
  });
}
