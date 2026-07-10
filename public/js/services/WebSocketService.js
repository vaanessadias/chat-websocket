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
let nomeAtendenteLogado = ""
let nomeAlterado = false

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

    console.log(dados)

    // Criar e mandar msg

    if(dados.posicao > 1){
        msgAviso(dados)
        return
    }

    if(condicao && alterarStatus === undefined){

        alterarStatus = criarStatusAtendimento("online")
        condicao = false
    }

    if(dados.enviado === "Atendente" || dados.tipoPessoa === "Atendente" && dados.enviado !== "Cliente"){

        nomeAtendenteLogado = dados.nome
        console.log("entrou aqui")
        alterarStatusAtendimento("Online", alterarStatus, nomeAtendenteLogado)
    }


    if(dados.tipoPessoa === "Cliente" && nomeAtendenteLogado !== undefined){

        alterarStatusAtendimento("Online", alterarStatus, nomeAtendenteLogado)
    }

    if(dados.corEnvio === "azul"){

        enviarMensagemNoProprioChat(dados)
    }

    if(dados.corEnvio === "preto"){

        enviarMensagemParaOutro(dados)

    }


    if(dados.listaVazia || !dados.listaVazia && dados.listaVazia !== undefined){
    
        msgAviso(dados, alterarStatus)
        return
    }

    if(dados.desligado || !dados.desligado && dados.desligado !== undefined){

        nomeAtendenteLogado = msgAviso(dados, alterarStatus, nomeAtendenteLogado)

        if(dados.tipo === "Atendente"){

            nomeAlterado = false
        }

        return
    }


}

export default socket

