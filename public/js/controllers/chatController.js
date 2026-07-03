import socket from "../services/WebSocketService.js"
import { DOM } from "../ui/chatUI.js"


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