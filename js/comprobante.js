const supabaseUrl = "https://gsvudwvxrevvctqktshw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdnVkd3Z4cmV2dmN0cWt0c2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc1MjEyMzEsImV4cCI6MjAxMzA5NzIzMX0.HILdAe9d2T0wrFCtpRXD-5rSuPS1WCzQB6H3JrDNFGs";
const database = supabase.createClient(supabaseUrl, supabaseKey);


//obtener cta,tipo,ci,nombres,contacto,valor de la url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const ticket = urlParams.get("ticket");

//obtener info de la guia de supabase
//obtener info de la guia de supabase 
function getComprobante(ticket){
    database
    .from("depositos")
    .select("*")
    .eq("numero_ticket", ticket)
    .then((result) => {
        let num = document.getElementById("ticket");
        num.textContent = result.data[0].numero_ticket;
        let fecha = document.getElementById("fecha");
        fecha.textContent = formatDateTime(result.data[0].created_at);
        //NUMERO DE TICKET
        let tipo = document.getElementById("tipo");
        tipo.textContent = result.data[0].tipo;
        let cta = document.getElementById("cta");
        cta.textContent = result.data[0].cta;
        let ci = document.getElementById("ci");
        ci.textContent = result.data[0].ci;
        let nombres = document.getElementById("nombres");
        nombres.textContent = result.data[0].nombres;
        let valor = document.getElementById("valor");
        valor.textContent = `$ ${result.data[0].valor}`
    });
}

getComprobante(ticket);


// Función para formatear la fecha y hora
function formatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const formattedDate = dateTime.toLocaleDateString();
    const formattedTime = dateTime.toLocaleTimeString();
    return `${formattedDate} ${formattedTime}`;
}
