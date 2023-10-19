const supabaseUrl = "https://gsvudwvxrevvctqktshw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdnVkd3Z4cmV2dmN0cWt0c2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc1MjEyMzEsImV4cCI6MjAxMzA5NzIzMX0.HILdAe9d2T0wrFCtpRXD-5rSuPS1WCzQB6H3JrDNFGs";
const database = supabase.createClient(supabaseUrl, supabaseKey);

const itemsPerPage = 5;
let currentPage = 1;

const obtenerListaDeImpresoras = async () => {
  return await ConectorPluginV3.obtenerImpresoras();
};
const URLPlugin = "http://localhost:8000";
const $listaDeImpresoras = document.getElementById("impresora");

function displayData(data, page) {
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = "";

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageData = data.slice(start, end);

  for (const item of pageData) {
    const row = document.createElement("tr");
    row.innerHTML = `
                    <td>${item.fecha}</td>
                    <td>${item.envia}</td>
                    <td>${item.destino}</td>
                    <td>${item.recibe}</td>
                    <td>${item.detalle}</td>
                    <td>${
                      item.estado === "Pagado"
                        ? '<span class="badge bg-success">Pagado</span>'
                        : '<span class="badge bg-danger">Pendiente</span>'
                    }</td>
                    <td>${item.valor}</td>
                    <td>${`
                        <button class="btn btn-warning" onclick="guia(${item.id})"><i class="fa-solid fa-print"></i></button>
                        <button class="btn btn-danger" onclick="eliminar(${item.id})"><i class="fa-solid fa-trash"></i></button>
                        <button class="btn btn-success" onclick="Whatsapp(${item.id})"><i class="fa-brands fa-whatsapp"></i></button>


                      `}
                    </td>
                `;
    tableBody.appendChild(row);
  }
}

const guia = async (id) => {
  //obtener datos de la encomienda con el id
  database
    .from("encomiendas")
    .select("*")
    .eq("id", id)
    .then((result) => {
      console.log(result.data[0]);
      //imprimir guia
      imprimirHolaMundo(nombreImpresora, result.data[0]);
    });

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

const imprimirHolaMundo = async (nombreImpresora, data) => {
  const conector = new ConectorPluginV3(URLPlugin);
  const respuesta = await conector
  .iniciar()
  .DeshabilitarElModoDeCaracteresChinos()
  .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
  .DescargarImagenDeInternetEImprimir("https://scontent.fuio15-1.fna.fbcdn.net/v/t39.30808-6/302281394_574195324492999_2031910601208551277_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=YJc4b_tW61QAX-rW_cM&_nc_pt=1&_nc_ht=scontent.fuio15-1.fna&oh=00_AfDDoJCTaczFBUpxE4SXxQXAKjwrM5vasqAfA7hIAG-i9w&oe=653607BD", 0, 216)
  .Feed(1)
  .EscribirTexto("COMPROBANTE\n")
  .Feed(1)
  .EscribirTexto("Fecha: " + data.fecha + "\n")
  .EscribirTexto("Envia: " + data.envia + "\n")
  .EscribirTexto("Destino: " + data.destino + "\n")
  .EscribirTexto("Recibe: " + data.recibe + "\n")
  .EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
  .EscribirTexto("_____________________________\n")
  .EscribirTexto("Detalle: " + data.detalle + "\n")
  .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
  .EscribirTexto("____________________\n")
  .EscribirTexto("Valor: " + data.valor + "\n")
  .EscribirTexto("____________________\n")
  .Feed(1)
  .EscribirTexto("____________________\n")
  .EscribirTexto("REMITENTE\n")
  .Feed(1)
  .EscribirTexto("____________________\n")
  .EscribirTexto("DESTINATARIO\n")
  .imprimirEn(nombreImpresora);
  if (respuesta === true) {
    alert("Impreso correctamente");
  } else {
    alert("Error: " + respuesta);
  }
};

function eliminar(id) {
  Swal.fire({
    title: "Estas seguro?",
    text: "No podras revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
  }).then((result) => {
    if (result.isConfirmed) {
      database
        .from("encomiendas")
        .delete()
        .eq("id", id)
        .then((result) => {
          Swal.fire(
            "Eliminado!",
            "La encomienda ha sido eliminada.",
            "success"
          );
          fetchDataFromSupabase();
        });
    }
  });
}

function Whatsapp(id) {
  //buscar cliente con el id
  database
    .from("encomiendas")
    .select("*")
    .eq("id", id)
    .then((result) => {
      console.log(result.data[0].recibe);
      let numero = "593993142521";
      let mensaje = `
      ¡Hola ${result.data[0].recibe}! Nos complace informarte que tu encomienda ya se encuentra disponible para ser retirada. El total a pagar es de $${result.data[0].valor}. Por favor, acércate a nuestra ubicación para recoger tu encomienda. ¡Gracias por confiar en nosotros!
      `;
      window.open(
        `https://api.whatsapp.com/send?phone=${numero}&text=${mensaje}`
      );
    });
  // //enviar un mensaje de whatsapp
}

const inputBusqueda = document.getElementById("inputBusqueda");
const tabla = document.getElementById("table-body");

// Agrega un evento de escucha al campo de búsqueda
inputBusqueda.addEventListener("input", function () {
  const textoBusqueda = inputBusqueda.value.toLowerCase();
  const filas = tabla.getElementsByTagName("tr");
  // Itera a través de todas las filas de la tabla y oculta/muestra según la búsqueda
  for (let i = 0; i < filas.length; i++) {
    const fila = filas[i];
    const contenidoFila = fila.innerText.toLowerCase();
    if (contenidoFila.includes(textoBusqueda)) {
      fila.style.display = "";
    } else {
      fila.style.display = "none";
    }
  }
});

function createPagination(data, itemsPerPage) {
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let page = 1; page <= totalPages; page++) {
    const li = document.createElement("li");
    li.className = "page-item";
    li.innerHTML = `<a class="page-link" href="#">${page}</a>`;
    li.addEventListener("click", () => {
      currentPage = page;
      displayData(data, currentPage);
    });
    pagination.appendChild(li);
  }
}

async function fetchDataFromSupabase() {
  const { data, error } = await database
    .from("encomiendas")
    .select("*")
    .order("id", { ascending: true });
  if (error) {
    console.error("Error fetching data from Supabase:", error);
    return;
  }
  displayData(data, currentPage);
  createPagination(data, itemsPerPage);
}

fetchDataFromSupabase();
