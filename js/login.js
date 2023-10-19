const supabaseUrl = "https://gsvudwvxrevvctqktshw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdnVkd3Z4cmV2dmN0cWt0c2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc1MjEyMzEsImV4cCI6MjAxMzA5NzIzMX0.HILdAe9d2T0wrFCtpRXD-5rSuPS1WCzQB6H3JrDNFGs";
const database = supabase.createClient(supabaseUrl, supabaseKey);

//funcion para validar el login

let ingresar = document.getElementById("ingresar");

ingresar.addEventListener("click", async (e) => {
  e.preventDefault();
  let usuario = document.getElementById("usuario").value;
  let password = document.getElementById("password").value;
  console.log(usuario, password);
  let { data: usuarios, error } = await database
    .from("usuarios")
    .select("*")
    .eq("usuario", usuario)
    .eq("password", password);

  if (usuarios.length == 1) {
    window.location.href = "../pages/dashboard.html";
  } else {
    alert("Usuario o contraseña incorrecta");
  }
});
