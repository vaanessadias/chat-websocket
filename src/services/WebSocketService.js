import { WebSocket } from "ws"
import { 
    entrarNaFila, 
    parear, 
    AvisarSemAtendente, 
    enviarMensagem, 
    trocarNomeAtendente,
    filaAtendentes,
    filaCliente,
    valorIdCliente,
    valorIdAtendente
} from "./chatService.js"

console.log("Entrei em websocketservice")

export function iniciarWebSocket(wss){

    wss.on("connection", (ws) => {

        ws.on("close", () => {

            if(ws.tipoPessoa === "Atendente"){

                filaAtendentes = filaAtendentes.filter(atendente => atendente.id !== ws.id)

                wss.clients.forEach(client => {

                    if(client.id === ws.id_cliente){

                        if(client.readyState === WebSocket.OPEN){

                            client.id_atendente = null
                            client.send(JSON.stringify({

                                desligado: true,
                                tipo: "Atendente"

                            }))

                        }
                        parear()
                        return
                    }

                })

            }else if(ws.tipoPessoa === "Cliente"){

                filaCliente = filaCliente.filter(cli => cli.id !== ws.id)

                wss.clients.forEach(client => {

                    if(client.id === ws.id_atendente){

                        if(client.readyState === WebSocket.OPEN){

                            client.id_cliente = null
                            client.send(JSON.stringify({

                                desligado: true,
                                tipo: "Cliente"

                            }))

                        }
                        parear()
                        return
                    }
                })
            }
        })

        ws.on("message", (mensagem) => {

            const dados = JSON.parse(mensagem.toString());

            if(dados.fila === false){
                entrarNaFila(ws, dados)
                parear(dados)
                return
            }

            if(ws.nome === undefined){

                ws.nome = dados.nome
                
            }

            if(filaAtendentes.length === 0){
                AvisarSemAtendente()
                return
            }

            if(dados.tipoPessoa === "Atendente"){

                trocarNomeAtendente(ws)
            }

            parear()
            enviarMensagem(dados, ws, wss)

        
        })
    })
}

export default {iniciarWebSocket}