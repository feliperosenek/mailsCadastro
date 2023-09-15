const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const api = express();
api.use(express.json());
api.use(express.urlencoded({
    extended: true
}));
api.use(bodyParser.urlencoded({ extended: false }))
api.use(bodyParser.json())

function removerCaracteresAposBr(email) {
    const novoEmail = email.replace(/\.br.*/, '.br');
    return novoEmail;
}

api.get('/', (req, res) => {
    const form = `<!DOCTYPE html>
    <html>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm" crossorigin="anonymous"></script>
    <body>
        <style>
        body {
            padding: 100px;
        }
        
        h1 {
            margin-bottom: 34px;
        }
        .search{
            display:none
        }
        </style>
        <script>
        function search(){
            console.log("ok")
           document.querySelector("#search").style = "display:block;margin-top:30px; color:red"
           document.querySelector("#btn-search").style = "display:none"
        }
        </script>
        <h1 class="text-center" >Pesquisa E-mails Google</h1>
        <form action="/" method="POST">
        <div class="form-group">
        <textarea class="form-control" name="data" rows="5" cols="5"></textarea>
      </div>
      <div style="margin-top:30px" class="row">
      <div class="col-md-12 text-center">
      <button id="btn-search" type="submit" onclick="search()" class="btn btn-primary btn-lg">Pesquisar</button>
        </div>
        </div>
        </form>
        <h4 id="search" class="text-center search">pesquisando...</h4>
    </body>
    </html>
    `
    res.send(form);
});

api.post('/', async (req, res) => {

    try {
        const searchGoogle = req.body.data;
        const emails = [];
        var search = []
        var results = []
        var emailsSearch = []

        const searchLines = searchGoogle.split('\n');


        var y = 1
        for (const line of searchLines) {

            console.log("TERMO: " + line)
            const formattedLine = line.trim().replace(/\s+/g, '+');

            var i = 1

            while (i < 8) {

                if (i == 1) {
                    var start = "&start=1"
                } else {
                    var start = "&start=" + i + "1"
                }

                await axios.get("https://www.googleapis.com/customsearch/v1?key=AIzaSyDBqhNcbcS0u9sbfdekOT7uWF89cxuqIEo&cx=85c54b05fec9140e1&q=" + formattedLine + start, {
                    method: 'GET',
                    redirect: 'follow'
                })
                    .then(response => response.json())
                    .then(result => {
                        const search = result.items
                        results.push(search)
                        return results
                    })
                    .catch(error => console.log('error', error));

                results.forEach(function (item) {
                    if (item) {
                        item.forEach(function (search, t) {
                            console.log("")
                            console.log(searchLines + " -------- Pesquisa "+y+"  de "+searchLines.length+" -- Página:" + i + " -------- Linha: " + (t + 1) + "  -------------")
                            console.log("SNIPPET:  "+search.snippet)
                            var text = search.snippet
                            const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/g;

                            if (text) {
                                const emailsEncontrados = text.match(emailRegex)
                                console.log(emailsEncontrados)
                                if (emailsEncontrados != null) {
                                    emailsSearch.push(emailsEncontrados)
                                }
                            }
                            console.log("")
                        })
                    }
                })

                i++
                results = []
            }
            y++
        }

        const arraySequencial = emailsSearch.reduce((accumulator, currentArray) => {
            return accumulator.concat(currentArray);
        }, []);


        console.log("TOTAL DE: " + arraySequencial.length + "  EMAILS -----------------------------------------+++")

        var emailsList = await JSON.stringify(arraySequencial)
        emailsList = emailsList.split('"').join()
        emailsList = emailsList.split('[').join()
        emailsList = emailsList.split(']').join()
        emailsList = emailsList.split(',,,').join("<br>")

        res.send(emailsList)
        res.status(200).end();
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro interno do servidor');
    }
});

api.listen(process.env.PORT || 3000, () => {
    console.log('API RUN!');
});
