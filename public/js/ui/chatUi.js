export const $ = (selector) => document.querySelector(selector)

export const DOM = {

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

    },
    Painel:{

        atendentesOnline: $("#numero-atendentes"),
        clientesAguardando: $("#numero-clientes-espera"),
        atendimentosAndamento: $("#numero-atendimentos-andamento"),
        tempoEspera: $("#numero-tempo-espera"),
        nomeCliente: $(".nome-cliente"),
        nomeAtendenteOnline: $(".nome-atendente-online")

    }
}

export function nomeClienteMetricas(dados){

    console.log(dados)
    DOM.Painel.nomeCliente.textContent = dados.nome
}

export function atualizacaoMetricas(dados){

    console.log("Dados atualização métricas")

    console.log(dados)

    DOM.Painel.atendentesOnline.textContent = dados.metricas.totalAtendentes
    DOM.Painel.clientesAguardando.textContent = dados.metricas.clientesAguardando
    DOM.Painel.atendimentosAndamento.textContent = dados.metricas.atendimentosAndamento
    DOM.Painel.tempoEspera.textContent = dados.metricas.tempoEspera

    DOM.Painel.nomeAtendenteOnline.textContent = dados.nome

}

export function msgAviso(dados, idAlterarStatus, nomeAten){

    const linhaMensagemPrincipal = document.createElement("span")
    const linhaMensagemSecundaria = document.createElement("span")
    const paragrafoAviso = DOM.Chat.msgAviso
    const iconeAviso = document.createElement("img")
    const nomeAtendente = DOM.Chat.nomeAtendente
    const statusAtendente = DOM.Chat.status

    iconeAviso.src = "../imagens/icones/warning-filled-svgrepo-com.png"

    if(dados.status !== undefined){

        alterarStatusAtendimento(dados.status, idAlterarStatus, nomeAten)
    }

    if(dados.posicao > 1){

        linhaMensagemPrincipal.textContent = `Atendentes Ocupados. Sua posição na fila é ${dados.posicao}. Aguarde!`
        
    }else if(dados.listaVazia){
        linhaMensagemPrincipal.textContent = dados.mensagem
        linhaMensagemSecundaria.textContent = "Aguarde, Uma mensagem Será Enviada Quando Um Atendente Entrar."

        linhaMensagemPrincipal.classList.add("aviso-principal")
        linhaMensagemSecundaria.classList.add("aviso-secundario")

    }else if(!dados.listaVazia){

        linhaMensagemPrincipal.textContent = dados.mensagem
        linhaMensagemSecundaria.textContent = "Mande Sua Mensagem!"

        linhaMensagemPrincipal.classList.add("aviso-principal")
        linhaMensagemSecundaria.classList.add("aviso-secundario")

    }
    if(dados.desligado && dados.tipo === "Atendente"){

        linhaMensagemPrincipal.textContent = "Atendente Desconectado."

        linhaMensagemPrincipal.classList.add("aviso-principal")

        alterarStatusAtendimento("Offline", idAlterarStatus, nomeAten)

    }else if(dados.desligado && dados.tipo === "Cliente"){

        linhaMensagemPrincipal.textContent = "Cliente Desconectado."

        linhaMensagemPrincipal.classList.add("aviso-principal")
    }

    iconeAviso.classList.add("aviso-icone")
    paragrafoAviso.appendChild(iconeAviso)

    if(dados.listaVazia || !dados.listaVazia && dados.desligado === undefined){

        paragrafoAviso.appendChild(linhaMensagemPrincipal)
        paragrafoAviso.appendChild(linhaMensagemSecundaria)
        
    }else if(dados.desligado || !dados.desligado || dados.posicao !== undefined){

        paragrafoAviso.appendChild(linhaMensagemPrincipal)
    }

    paragrafoAviso.classList.add("msg-aviso")
    paragrafoAviso.style.display = "flex"
    
    setTimeout(() => {
        paragrafoAviso.style.top = "2px"
        paragrafoAviso.classList.add("fade-out")

        setTimeout(() => {
            paragrafoAviso.textContent = ""
            paragrafoAviso.style.display = "none"
            paragrafoAviso.classList.remove("fade-out")
        }, 1000)
    }, 3000)
}

export function criarMensagem(dados, imagem){

    const ConteudoCompletoMsg = DOM.Variaveis.chat
    const criarLinhaLista = document.createElement("li")
    const agruparConteudo = document.createElement("div")
    const linhaNome = document.createElement("span")
    const pularLinha = document.createElement("br")
    const linhaConteudoMensagem = document.createElement("span")

    
    linhaNome.textContent = `${dados.nome}`
    linhaConteudoMensagem.textContent = dados.mensagem


    linhaNome.classList.add("nome-pessoa")

    console.log(dados.corEnvio)

    if(dados.corEnvio !== "azul"){

        criarLinhaLista.appendChild(imagem)
    }

    agruparConteudo.appendChild(linhaNome)
    agruparConteudo.appendChild(pularLinha)
    agruparConteudo.appendChild(linhaConteudoMensagem)

    criarLinhaLista.appendChild(agruparConteudo)

    if(dados.corEnvio === "azul"){

        criarLinhaLista.appendChild(imagem)
    }

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

export function enviarMensagemNoProprioChat(dados){

    let imagem

    if(dados.tipoPessoa === "Atendente"){

        imagem = document.createElement("img")
        imagem.src = "../imagens/icones/telemarketer-headset-svgrepo-com.png"
        imagem.classList.add("imagem-atendente")

        criarMensagem(dados, imagem)

           

    }else if(dados.tipoPessoa === "Cliente"){

        imagem = document.createElement("img")
        imagem.src = "../imagens/icones/person-svgrepo-com.png"
        imagem.classList.add("imagem-cliente")
            
        criarMensagem(dados, imagem)
    }

}

export function enviarMensagemParaOutro(dados){

    let imagem

    if(dados.enviado === "Atendente"){

        imagem = document.createElement("img")
        imagem.src = "../imagens/icones/telemarketer-headset-svgrepo-com.png"
        imagem.classList.add("imagem-atendente")

        criarMensagem(dados, imagem)

           

    }else if(dados.enviado === "Cliente"){

        imagem = document.createElement("img")
        imagem.src = "../imagens/icones/person-svgrepo-com.png"
        imagem.classList.add("imagem-cliente")
            
        criarMensagem(dados, imagem)
    }

}

export function criarStatusAtendimento(status){

    const linhaStatus = document.createElement("span")
    const addStatusChat = DOM.Chat.nomeAtendente

    linhaStatus.textContent = ""

    if(status === "online"){

        linhaStatus.textContent = "Online"
        linhaStatus.classList.add("status-online")
        linhaStatus.id = "statusConexao"
    }

    addStatusChat.appendChild(linhaStatus)

    const idStatus = "statusConexao"

    return idStatus

}

export function alterarStatusAtendimento(status, id, nomeAten){

    const span = document.getElementById(id)

    if(status === "Offline"){

        if(nomeAten === "" || nomeAten === undefined){

            span.textContent = "Offline"
        }else{

            span.textContent = `${nomeAten} - Offline`
        }

        span.classList.remove("status-online")
        span.classList.add("status-offline")

        return nomeAten = ""

    }
    
    if(status === "Online"){

        if(nomeAten === "" || nomeAten === undefined){

            span.textContent = "Online"
        }else{

            span.textContent = `${nomeAten} - Online`
        }

        span.classList.remove("status-offline")
        span.classList.add("status-online")

    }

}