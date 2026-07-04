import http from "http"
import express from "express"
import authRoutes from "./routes/authRoutes.js"
import path from 'path'
import { WebSocketServer, WebSocket } from "ws"
import WebSocketService from './services/WebSocketService.js'

const app = express()

// Criação do servidor para requisicao http

app.use(express.json())

app.use(express.static('public'))

app.use(authRoutes)

const server = http.createServer(app)

const wss = new WebSocketServer({server})

WebSocketService.iniciarWebSocket(wss)

server.listen(3000, () => {

    console.log('Servidor rodando')
})

export default wss 