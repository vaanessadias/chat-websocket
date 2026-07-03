const $ = (select) => document.querySelector(select)

const DOM = {

    login:{

        tipoPessoa: $(".pessoa"),
        senha: $("#senha"),
        btnEnviar: $("#btn-enviar")
    },

    Erro:{

        section: $("form")
    }
}

DOM.login.btnEnviar.addEventListener("click", () => {

    autenticacao()
})

async function autenticacao(){

    const tipoPessoa = DOM.login.tipoPessoa.value
    let senha = ""

    console.log(tipoPessoa)

    if(tipoPessoa === "Atendente"){

        senha = DOM.login.senha.value.trim()
    }

    const requisicao = await fetch('/login', {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({

            tipoPessoa: DOM.login.tipoPessoa.value,
            senha: senha
        })
    })

    const resposta = await requisicao.json()
    console.log(resposta)

    if(resposta.estadoLogin === true){
        
        localStorage.setItem("tipoPessoa", resposta.pessoa)
        localStorage.setItem("pessoaLogada", resposta.estadoLogin)
        window.location.href = "chat.html"
        return
    }else{

        const erro = document.createElement("h1")
        erro.textContent = "Erro"

        erro.style.color = "red"

        DOM.Erro.section.appendChild(erro)
    }
    

}