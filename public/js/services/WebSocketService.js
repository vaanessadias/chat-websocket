import {
  msgAviso,
  criarMensagem,
  enviarMensagemNoProprioChat,
  enviarMensagemParaOutro
} from "../ui/chatUI.js"

const socket = new WebSocket("ws://localhost:3000")

socket.onopen = () => {

    if(localStorage.getItem("tipoPessoa") === "Atendente"){
        socket.send(JSON.stringify({
            id: 0,
            tipoPessoa: localStorage.getItem("tipoPessoa"),
            fila: false,
            pessoaLogada: localStorage.getItem("pessoaLogada") 
        }))
    }else if(localStorage.getItem("tipoPessoa") === "Cliente"){

        socket.send(JSON.stringify({
            id: 0,
            tipoPessoa: localStorage.getItem("tipoPessoa"),
            fila: false,
            pessoaLogada: localStorage.getItem("pessoaLogada")
        }))
    }
}

socket.onmessage = (e) => {

    const dados = JSON.parse(e.data)
    let nomeAtendente = dados.nome
    const status = document.createElement("span")

    console.log(dados)

    // Criar e mandar msg

    if(dados.posicao > 1){

        console.log(dados)
        msgAviso(dados)
        return
    }

    if(dados.nomeAtendente !== undefined){

        nomeAtendente = "Atendente"
    }

    if(dados.desligado && dados.tipo === "Atendente"){
        status.textContent = " (Offline)"
        status.classList.remove("status-online")
        status.classList.add("status-offline")

    }else if(dados.nomeAtendente !== undefined){
        status.textContent = " (Online)"
        status.classList.add("status-online")
    }


    if(dados.corEnvio === "azul"){

        enviarMensagemNoProprioChat(dados)

    }

    if(dados.corEnvio === "preto"){

        enviarMensagemParaOutro(dados)

    }

    if(dados.listaVazia || !dados.listaVazia && dados.listaVazia !== undefined){
    
        msgAviso(dados)
        return
    }

    if(dados.desligado || !dados.desligado && dados.desligado !== undefined){

        msgAviso(dados)
        return
    }

}

export default socket

