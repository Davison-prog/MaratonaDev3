//configurando o servidor
const express = require("express")
const server = express()

//configurar o servidor pra apresentar arquivos extras
server.use(express.static('public'))

//habilitar body
server.use(express.urlencoded({extended: true}))

//configurar a conexao com banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})



//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./",{
    express: server,
    noCache: true,
})








// configurar a apresentação da página
server.get("/",function(req,res){
    db.query("SELECT * FROM donors",function(erro,result){
        if (erro) return res.send("Erro de banco de dados.")
        const donors = result.rows
        res.render('src/index.html',{ donors })        
    })
    
})
//pegar dados do formulario
server.post("/",function(req,res){
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood 
    
    if(name =="" || email == "" || blood ==""){
        return res.send("Todos os campos são obrigatórios.")
    }

    //colocar valores dentro do banco
    const query = `
    INSERT INTO donors ("name","email","blood") 
    VALUES ($1,$2,$3)`
    const values = [name,email,blood]
    db.query(query,values,function(erro){
        if(erro) return res.send("erro no banco de dados")
        return res.redirect("/")
    })



})



//ligar o servidor e permitir o acesso na porta 3000
server.listen(3000,function(){
    console.log("Iniciei o servidor.")
})
