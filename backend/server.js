require('dotenv').config()
const { connectDB } = require('./config/db')
const app = require('./app')

const PORT = process.env.PORT || 3000

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`)
    })
}).catch((error) => {
    console.error('Error crítico al conectar la base de datos:', error)
    process.exit(1)
})