const supabaseUrl = "https://gsvudwvxrevvctqktshw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdnVkd3Z4cmV2dmN0cWt0c2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc1MjEyMzEsImV4cCI6MjAxMzA5NzIzMX0.HILdAe9d2T0wrFCtpRXD-5rSuPS1WCzQB6H3JrDNFGs";
const database = supabase.createClient(supabaseUrl, supabaseKey);

const obtenerListaDeImpresoras = async () => {
  return await ConectorPluginV3.obtenerImpresoras();
};

const loadprint = async () => {
  const URLPlugin = "http://localhost:8000";
  const $listaDeImpresoras = document.getElementById("impresora");
  const impresoras = await ConectorPluginV3.obtenerImpresoras(URLPlugin);
  for (const impresora of impresoras) {
    $listaDeImpresoras.appendChild(
      Object.assign(document.createElement("option"), {
        value: impresora,
        text: impresora,
      })
    );
  }
  const nombreImpresora = $listaDeImpresoras.value;
  if (!nombreImpresora) {
    return alert("Por favor seleccione una impresora.");
  }
};

//funcion para obtener los datos
function depositar() {
  event.preventDefault();
  let tipo = document.getElementById("tipo_cuenta").value;
  let cta = document.getElementById("cta").value;
  let ci = document.getElementById("ci").value;
  let nombres = document.getElementById("nombres").value;
  let contacto = document.getElementById("contacto").value;
  let valor = document.getElementById("valor").value;
  let estado = "Pendiente";

  let data = {
    tipo: tipo,
    cta: cta,
    ci: ci,
    nombres: nombres,
    contacto: contacto,
    valor: valor,
    estado: estado,
  };

  if (
    tipo == "" ||
    cta == "" ||
    ci == "" ||
    nombres == "" ||
    contacto == "" ||
    valor == ""
  ) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Todos los campos son obligatorios!",
    });
    return;
  } else {
    //mostar en un swal los datos antes de confirmar
    Swal.fire({
      title: "Estan correctos?",
      html:
        " <b>Tipo de cuenta:</b> " +
        tipo +
        "<br> <b>Numero de cuenta:</b> " +
        cta +
        "<br> <b>CI:</b> " +
        ci +
        "<br> <b>Nombres:</b> " +
        nombres +
        "<br> <b>Contacto:</b> " +
        contacto +
        "<br> <b>Valor:</b> " +
        valor,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#008f39",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, depositar dinero!",
    }).then((result) => {
      if (result.isConfirmed) {
        let numero_ticket = Math.floor(Math.random() * 1000000000);
        //guardar en la base de datos
        database
          .from("depositos")
          .insert([
            {
              numero_ticket: numero_ticket,
              tipo: tipo,
              cta: cta,
              ci: ci,
              nombres: nombres,
              contacto: contacto,
              valor: valor,
              estado: estado,
            },
          ])
          .then((result) => {
            //imprimir el ticket
            imprimirHolaMundo(nombreImpresora, data);
            Swal.fire({
              icon: "success",
              title: "Depositado!",
              text: "El deposito se realizo con exito!",
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Algo salio mal!",
            });
          });
      }
    });
  }
}

const imprimirHolaMundo = async (nombreImpresora, data) => {
  const conector = new ConectorPluginV3(URLPlugin);
  const respuesta = await conector
    .Iniciar()
    .DeshabilitarElModoDeCaracteresChinos()
    .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
    .EscribirTexto("COMPROBANT TRANSACCION\n")
    .Feed(1)
    .EscribirTexto("TIPO DE CUENTA: " + data.tipo + "\n")
    .EscribirTexto("CUENTA: " + data.cta + "\n")
    .EscribirTexto("CEDULA: " + data.ci + "\n")
    .EscribirTexto("NOMBRES: " + data.nombres + "\n")
    .EscribirTexto("CONTACTO: " + data.contacto + "\n")
    .EscribirTexto("VALOR: " + data.valor + "\n")
    .Feed(1)
    .EscribirTexto("El tiempo estimado para el deposito es de 20 min \n")
    .imprimirEn(nombreImpresora);
  if (respuesta === true) {
    alert("Impreso correctamente");
  } else {
    alert("Error: " + respuesta);
  }
};
