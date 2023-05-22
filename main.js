//Importaciones
const express = require('express')
const hbs = require('express-handlebars')
const { Server } = require('socket.io')
const { create } = require('connect-mongo')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const main = require('./routers/routes.js')
const { webSocket } = require('./utils/socketIo.js')
const { connectDB } = require('./config/DBConfig.js')

//instanciaciones
const app = express()
connectDB()

//Configuraciones
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', hbs.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')
app.use('/static', express.static(`${__dirname}/public`))
app.use(cookieParser('Mensaje secreto'))
app.use(session({
    store: create({
        mongoUrl: 'mongodb+srv://alvaro40992:carbonero1891@cluster0.pgtgcex.mongodb.net/',
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }),
    secret: 'Mensaje secreto 2',
    resave: false,
    saveUninitialized: false
}))

//routers
app.use(main)
app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send("Todo mal")
})

//launcher del server
const httpServer = app.listen(8080, (err) => {
    if (err)`ERROR en el servidor ${err}`
    console.log("Se inició el servidor.")
})

//utilización de sockets
const io = new Server(httpServer)
webSocket(io)