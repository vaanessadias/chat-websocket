import http from "http"
import express from "express"
import authRoutes from "./routes/authRoutes.js"
import path from 'path'

const app = express()

// Criação do servidor para requisicao http

app.use(express.json())

app.use(express.static('public'))

app.use(authRoutes)

const server = http.createServer(app)


server.listen(3000, () => {

    console.log('Servidor rodando')
})