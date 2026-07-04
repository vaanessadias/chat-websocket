import { WebSocketServer, WebSocket } from "ws"
import wss from '../server.js'

export let filaAtendentes = []

export let filaCliente = []

export let valorIdCliente = 1

export let valorIdAtendente = -1

export function entrarNaFila (ws, dados){

    ws.tipoPessoa = dados.tipoPessoa
    ws.fila = true

    if(dados.tipoPessoa === "Atendente"){
        ws.id = valorIdAtendente 
        ws.nome = undefined
        ws.id_cliente = null
        ws.pessoaLogada = dados.pessoaLogada
        filaAtendentes.push(ws)
        valorIdAtendente--
    }else if(dados.tipoPessoa === "Cliente"){
        ws.id = valorIdCliente 
        ws.id_atendente = null
        ws.pessoaLogada = dados.pessoaLogada
        filaCliente.push(ws)
        valorIdCliente++
    }
}


export function parear(){

    if(filaAtendentes.length > 0 && filaCliente.length > 0){

        filaAtendentes.forEach(atendente => {

            if(atendente.id_cliente === null){

                for(let cliente of filaCliente){

                    if(cliente.id_atendente === null){

                        atendente.id_cliente = cliente.id
                        cliente.id_atendente = atendente.id

                        cliente.send(JSON.stringify({

                            mensagem: "Atendente Conectado.",
                            tipoPessoa: cliente.tipoPessoa,
                            listaVazia: false
                        }))
                        break
                    }
                }
            }
        })
    }
}

export function AvisarSemAtendente(){

    if(filaAtendentes.length === 0) {

        if(filaCliente.length !== 0){
            for(let pessoas of filaCliente){

                pessoas.send(JSON.stringify({

                    mensagem: "Nenhum Atendente Conectado.",
                    tipoPessoa: pessoas.tipoPessoa,
                    listaVazia: true

                }))
            }
        }
    }

}

export function enviarMensagem (dados, ws, wss){

    wss.clients.forEach(client => {

        if(client.id === ws.id){

            if(dados.mensagem && client.readyState === WebSocket.OPEN){
                client.send(JSON.stringify({
                    nome: client.nome,
                    mensagem: dados.mensagem,
                    posicao: 0,
                    tipoPessoa: client.tipoPessoa,
                    corEnvio: "azul"

                }));
            }

            if (ws.tipoPessoa === "Cliente" && ws.id_atendente !== null) {

                wss.clients.forEach(a => {
                    if(a.id === ws.id_atendente){
                        if (a.readyState === WebSocket.OPEN){
                            a.send(JSON.stringify({
                                nome: client.nome,
                                mensagem: dados.mensagem,
                                posicao: 0,
                                tipoPessoa: a.tipoPessoa,
                                corEnvio:"preto",
                                enviado: ws.tipoPessoa
                            }))
                        }
                    }
                })

            }else if (ws.tipoPessoa === "Atendente" && ws.id_cliente !== null) {


                wss.clients.forEach(c => {
                    if(c.id === ws.id_cliente){
                        if (c.readyState === WebSocket.OPEN){
                            c.send(JSON.stringify({
                                nome: client.nome,
                                mensagem: dados.mensagem,
                                posicao: 0,
                                tipoPessoa: c.tipoPessoa,
                                corEnvio:"preto",
                                nomeAtendente: ws.nome,
                                enviado: ws.tipoPessoa
                            }))
                        }
                    }
                })

            }else if(ws.tipoPessoa === "Cliente" && ws.id_atendente === null){
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({
                    posicao: filaCliente.findIndex(p => p.id === ws.id) + 1
                    }));
                    return
                }
            }
        }   

    })

}

export function trocarNomeAtendente(ws){

    ws.send(JSON.stringify({

        nomeAtendente: ws.nome,
        tipoPessoa: ws.tipoPessoa
    }))
}
