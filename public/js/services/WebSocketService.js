import {
  msgAviso,
  criarMensagem,
  enviarMensagemNoProprioChat,
  enviarMensagemParaOutro,
  DOM,
  criarStatusAtendimento,
  alterarStatusAtendimento
} from "../ui/chatUI.js"

const socket = new WebSocket("ws://localhost:3000")
let alterarStatus
let condicao = true

socket.onopen = () => {

    if(localStorage.getItem("tipoPessoa") === "Atendente"){
        socket.send(JSON.stringify({
            id: 0,
            tipoPessoa: localStorage.getItem("tipoPessoa"),
            fila: false,
            pessoaLogada: localStorage.getItem("pessoaLogada") 
        }))
        if(alterarStatus === undefined){
            alterarStatus = criarStatusAtendimento("online")
        }

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

    // Criar e mandar msg

    if(dados.posicao > 1){
        msgAviso(dados)
        return
    }


    if(dados.corEnvio === "azul"){

        enviarMensagemNoProprioChat(dados)
        alterarStatusAtendimento("Online", alterarStatus)

    }

    if(dados.corEnvio === "preto"){

        enviarMensagemParaOutro(dados)

    }


    if(dados.listaVazia || !dados.listaVazia && dados.listaVazia !== undefined){
    
        msgAviso(dados)
        return
    }

    if(dados.desligado || !dados.desligado && dados.desligado !== undefined){

        msgAviso(dados, alterarStatus)
        return
    }

    if(dados.pareado && condicao && dados.tipoPessoa !== "Atendente"){

        alterarStatus = criarStatusAtendimento("online")
        condicao = false
    }



}

export default socket

