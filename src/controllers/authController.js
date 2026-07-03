import dotenv from "dotenv"

dotenv.config()


export function login(req, res){

    const {tipoPessoa, senha} = req.body

    if(tipoPessoa === "Atendente"){
        if(senha === process.env.SENHA_ADM){

            return res.json({pessoa:tipoPessoa, estadoLogin: true})
        }else{

            return res.status(401).json({erro: 'Credencial invalida', estadoLogin: false})

        }
    }else{

        return res.json({pessoa:tipoPessoa, estadoLogin: true})
    }
}

export default {login}