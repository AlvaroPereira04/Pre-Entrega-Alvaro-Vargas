const {connect} = require('mongoose')

const url = "mongodb+srv://alvaro40992:carbonero1891@cluster0.pgtgcex.mongodb.net/"

module.exports = {
  connectDB: ()=>{
    connect(url)
    console.log('Base de datos conectada')
  }
}