const supabaseUrl = "https://gsvudwvxrevvctqktshw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdnVkd3Z4cmV2dmN0cWt0c2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc1MjEyMzEsImV4cCI6MjAxMzA5NzIzMX0.HILdAe9d2T0wrFCtpRXD-5rSuPS1WCzQB6H3JrDNFGs";
const database = supabase.createClient(supabaseUrl, supabaseKey);

//obtener el id de la url 
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");

//obtener info de la guia de supabase 
function getGuia(id){
    database
    .from("encomiendas")
    .select("*")
    .eq("id", id)
    .then((result) => {
        //CREAR UN TICKER EN VERTICAL CON LA INFORMACION DE LA GUIA
        //FECHA
        let fecha = document.getElementById("fecha");
        fecha.innerHTML = result.data[0].fecha;
        //ENVIA
        let envia = document.getElementById("envia");
    });
}

getGuia(id);