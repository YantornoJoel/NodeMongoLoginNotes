const express= require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session= require('express-session')
const flash = require('connect-flash')
const passport = require('passport')


//INICIALIZACION
const app= express()
require('./database')
require('./config/passport')

//SETTINGS
app.set('port', process.env.PORT || 3300)

// // Configurar la carpeta views para poder usarla
app.set('views', path.join(__dirname, 'views')) //para decirle a node donde va a estar la carpeta views
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'), //concatenar la carpeta de layouts
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');


//MIDDLEWARES
app.use(express.urlencoded({extended: false})); //para recibir datos
app.use(methodOverride('_method')) //para que los formularios envien otros metodos aparte de get-post
// // Para permitir usuarios y almacenarlos temporalmente
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())


//VARIABLES GLOBALES
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next();
});



//RUTAS
app.use(require('./routes/index'))
app.use(require('./routes/notes'))
app.use(require('./routes/users'))



//ARCHIVOS ESTATICOS
app.use(express.static(path.join(__dirname, 'public')))




//INICIAR SERVIDOR
app.listen(app.get('port'), () => {
    console.log("Server corriendo en puerto:", app.get('port'))
})