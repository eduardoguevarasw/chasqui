const express = require('express');
const app = express();
const path = require('path');
const indexrouters = require('./routes/index');
//Configuraciones
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'))
app.engine('html', require('ejs').renderFile);

//routers 
app.use(indexrouters); 


//archivos estatico
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => 
{
console.log('Servidor Corriendo',3000)

});