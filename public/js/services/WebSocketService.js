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
    const nomeAtendente = localStorage.getItem("nome")
    const status = document.createElement("span")
    // Criar e mandar msg


    if(dados.nomeAtendente !== undefined){

        nomeAtendente.textContent = dados.nomeAtendente || "Atendente"
    }

    if(dados.desligado === true && dados.tipo === "Atendente"){
        status.textContent = " (Offline)"
        status.classList.remove("status-online")
        status.classList.add("status-offline")
    }else if(dados.nomeAtendente !== undefined){
        status.textContent = " (Online)"
        status.classList.add("status-online")
    }

    nomeAtendente.appendChild(status)
    

    if(dados.corEnvio === "azul"){

        enviarMensagemNoProprioChat(dados)

    }

    if(dados.corEnvio === "preto"){

        enviarMensagemParaOutro(dados)

    }

    if(dados.tipoPessoa === "Cliente" && dados.listaVazia === true){
    
        msgAviso(dados)
    }else if(dados.tipoPessoa === "Cliente" && dados.listaVazia === false){

        msgAviso(dados)
    }

    if(dados.desligado === true && dados.desligado !== undefined){

        msgAviso(dados)
    }

}

export default socket

