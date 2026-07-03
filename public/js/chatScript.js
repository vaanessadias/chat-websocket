const $ = (selector) => document.querySelector(selector)

const DOM = {

    Variaveis:{

        msg: $("#msg"),
        chat: $("#chat"),
        nome: $("#nome"),
        botaoEnviar: $("#btn-enviar") 
    },

    Chat:{

        conteudoCompleto: $(".conteudo-completo"),
        msgAviso: $(".msg-aviso"),
        nomeAtendente: $(".nome-atendente")

    }
}



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

function msgAviso(dados){

    const linhaMensagemPrincipal = document.createElement("span")
    const linhaMensagemSecundaria = document.createElement("span")
    const paragrafoAviso = DOM.Chat.msgAviso
    const iconeAviso = document.createElement("img")
    const nomeAtendente = DOM.Chat.nomeAtendente
    const statusAtendente = DOM.Chat.status

    iconeAviso.src = "imagens/icones/warning-filled-svgrepo-com.png"

    if(dados.listaVazia === true){
        linhaMensagemPrincipal.textContent = dados.mensagem
        linhaMensagemSecundaria.textContent = "Aguarde, Uma mensagem Será Enviada Quando Um Atendente Entrar."

        linhaMensagemPrincipal.classList.add("aviso-principal")
        linhaMensagemSecundaria.classList.add("aviso-secundario")

    }else if(dados.listaVazia === false){

        linhaMensagemPrincipal.textContent = dados.mensagem
        linhaMensagemSecundaria.textContent = "Mande Sua Mensagem!"

        linhaMensagemPrincipal.classList.add("aviso-principal")
        linhaMensagemSecundaria.classList.add("aviso-secundario")

    }else if(dados.desligado === true && dados.tipo === "Atendente"){

        linhaMensagemPrincipal.textContent = "Atendente Desconectado."

        linhaMensagemPrincipal.classList.add("aviso-principal")

    }else if(dados.desligado === true && dados.tipo === "Cliente"){

        linhaMensagemPrincipal.textContent = "Cliente Desconectado."

        linhaMensagemPrincipal.classList.add("aviso-principal")
    }

    iconeAviso.classList.add("aviso-icone")
    paragrafoAviso.appendChild(iconeAviso)

    if(dados.desligado === true){

        paragrafoAviso.appendChild(linhaMensagemPrincipal)
    }else{

        paragrafoAviso.appendChild(linhaMensagemPrincipal)
        paragrafoAviso.appendChild(linhaMensagemSecundaria)
    }

    paragrafoAviso.classList.add("msg-aviso")
    paragrafoAviso.style.display = "flex"
    
    setTimeout(() => {
        paragrafoAviso.classList.add("fade-out")

        setTimeout(() => {
            paragrafoAviso.textContent = ""
            paragrafoAviso.style.display = "none"
            paragrafoAviso.classList.remove("fade-out")
        }, 1000)
    }, 3000)
}

function criarMensagem(dados, imagem){

    const ConteudoCompletoMsg = DOM.Variaveis.chat
    const criarLinhaLista = document.createElement("li")
    const agruparConteudo = document.createElement("div")
    const linhaNome = document.createElement("span")
    const pularLinha = document.createElement("br")
    const linhaConteudoMensagem = document.createElement("span")

    
    linhaNome.textContent = `${dados.nome}`
    linhaConteudoMensagem.textContent = dados.mensagem


    linhaNome.classList.add("nome-pessoa")

    criarLinhaLista.appendChild(imagem)

    agruparConteudo.appendChild(linhaNome)
    agruparConteudo.appendChild(pularLinha)
    agruparConteudo.appendChild(linhaConteudoMensagem)

    criarLinhaLista.appendChild(agruparConteudo)

    linhaConteudoMensagem.classList.add("msg-enviada")
    agruparConteudo.classList.add("conteudo-msg")
    criarLinhaLista.classList.add("conteudo-completo")
    criarLinhaLista.classList.add("mudar-direita")

    if(dados.corEnvio === "preto"){

        criarLinhaLista.classList.remove("mudar-direita")
        agruparConteudo.classList.add("cor-de-receber")
    }
            
    ConteudoCompletoMsg.appendChild(criarLinhaLista)
}

function enviarMensagemNoProprioChat(dados){

    let imagem

    if(dados.tipoPessoa === "Atendente"){

        imagem = document.createElement("img")
        imagem.src = "imagens/icones/telemarketer-headset-svgrepo-com.png"
        imagem.classList.add("imagem-atendente")

        criarMensagem(dados, imagem)

           

    }else if(dados.tipoPessoa === "Cliente"){

        imagem = document.createElement("img")
        imagem.src = "imagens/icones/person-svgrepo-com.png"
        imagem.classList.add("imagem-cliente")
            
        criarMensagem(dados, imagem)
    }

}

function enviarMensagemParaOutro(dados){

    let imagem

    if(dados.enviado === "Atendente"){

        imagem = document.createElement("img")
        imagem.src = "imagens/icones/telemarketer-headset-svgrepo-com.png"
        imagem.classList.add("imagem-atendente")

        criarMensagem(dados, imagem)

           

    }else if(dados.enviado === "Cliente"){

        imagem = document.createElement("img")
        imagem.src = "imagens/icones/person-svgrepo-com.png"
        imagem.classList.add("imagem-cliente")
            
        criarMensagem(dados, imagem)
    }

}

socket.onmessage = (e) => {

    const dados = JSON.parse(e.data)
    const nomeAtendente = DOM.Chat.nomeAtendente
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

DOM.Variaveis.botaoEnviar.addEventListener("click", (e) => {

    e.preventDefault()
    const mensagem = DOM.Variaveis.msg.value.trim()
    let pessoa = DOM.Variaveis.nome.value.trim()
    let usuario = ""

    if(!pessoa){

        pessoa = "Cliente"
    }

    localStorage.setItem("nome", pessoa)

    if(!mensagem){
        return
    } 

    if(localStorage.getItem("tipoPessoa") === "Atendente"){
  
        pessoa = `Atendente ${localStorage.getItem("nome")}`  
        usuario = pessoa 

    }else{

        usuario = pessoa
    }

    socket.send(JSON.stringify({

        nome: usuario, 
        mensagem: mensagem,
        tipoPessoa: localStorage.getItem("tipoPessoa")
    }))

    DOM.Variaveis.msg.value = ""
})


