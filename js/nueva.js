const supabaseUrl = "https://gsvudwvxrevvctqktshw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdnVkd3Z4cmV2dmN0cWt0c2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc1MjEyMzEsImV4cCI6MjAxMzA5NzIzMX0.HILdAe9d2T0wrFCtpRXD-5rSuPS1WCzQB6H3JrDNFGs";
const database = supabase.createClient(supabaseUrl, supabaseKey);

//funcion para obtener los datos
function obtenerDatos() {
  event.preventDefault();
  let fecha = document.getElementById("fecha").value;
  let destino = document.getElementById("destino").value;
  let envia = document.getElementById("envia").value;
  let recibe = document.getElementById("recibe").value;
  let detalle = document.getElementById("detalle").value;
  let estado = document.getElementById("estado").value;
  let contacto = document.getElementById("contacto").value;
  let valor = document.getElementById("valor").value;
  //genera un numero aleatorio para el codigo de barras
  let guia = Math.floor(Math.random() * 100000000000);

  //guardar en la base de supabase
  if (
    fecha == "" ||
    envia == "" ||
    recibe == "" ||
    detalle == "" ||
    estado == "" ||
    valor == "" ||
    destino == "" ||
    contacto == ""
  ) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Todos los campos son obligatorios!",
    });
    return;
  }
  database
    .from("encomiendas")
    .insert([
      {
        fecha: fecha,
        destino: destino,
        envia: envia,
        recibe: recibe,
        contacto: contacto,
        detalle: detalle,
        estado: estado,
        valor: valor,
        guia: guia,
      },
    ])
    .then((result) => {
      //swal alerta
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Encomienda registrada",
        showConfirmButton: false,
        timer: 1500,
      }).then((result) => {
        //limpiar formulario
        document.getElementById("fecha").value = "";
        document.getElementById("envia").value = "";
        document.getElementById("recibe").value = "";
        document.getElementById("detalle").value = "";
        document.getElementById("estado").value = "";
        document.getElementById("valor").value = "";
      });
    });
}
