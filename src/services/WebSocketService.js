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

                let encontrarAtendente = filaAtendentes.findIndex(antendente => antendente.id === ws.id)
        
                filaAtendentes.splice(encontrarAtendente, 1)

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

                let encontrarCliente = filaCliente.findIndex(cli => cli.id === ws.id)
        
                filaCliente.splice(encontrarCliente, 1)

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