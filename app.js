const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');

const path = require('path');
const filePath = path.resolve(__dirname, 'emails.txt');

const api = express();
api.use(express.json());
api.use(express.urlencoded({
    extended: true
}));
api.use(bodyParser.urlencoded({ extended: false }))
api.use(bodyParser.json())




api.get('/g1', (req, res) => {
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
        <form action="/g1" method="POST">
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

api.post('/g1', async (req, res) => {

    fs.writeFile(filePath, " ", (err) => {
        if (err) {
          console.error('Erro ao escrever no arquivo:', err);
        } else {
          console.log('Arquivo foi escrito com sucesso.');
        }
      });

    console.log("  ")
    console.log("  ")
    console.log("  ")
    console.log("  ")
    console.log("  ")
    console.log("------------------------------------ INICIO NOVA BUSCA --------------------------------------------")
    console.log("  ")
    console.log("  ")
    console.log("  ")
    console.log("  ")
    console.log("  ")

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

                const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

                await delay(350)

                await axios.get("https://www.googleapis.com/customsearch/v1?key=AIzaSyD-wVlr8g3M-bZgX5WLIEYovl-4favNzRY&cx=e6e261a12239643b2&q=" + formattedLine + start, {
                    method: 'GET',
                    redirect: 'follow'
                })
                    .then(response => {
                        const search = response.data
                        results.push(search.items)
                        return results
                    })
                    .catch(error => console.log('error', error));

                results.forEach(function (item) {
                    if (item) {
                        item.forEach(function (search, t) {
                            console.log("  ")
                            console.log("PESQUISA -> "+line + " -------- Pesquisa "+y+"  de "+searchLines.length+" -- Página:" + i + " -------- Linha: " + (t + 1) + "  -------------")
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
                            console.log("  ")
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
        emailsList = emailsList.split(',,,').join("\n")

        fs.writeFile(filePath, emailsList, (err) => {
            if (err) {
              console.error('Erro ao escrever no arquivo:', err);
            } else {
              console.log('Arquivo foi escrito com sucesso.');
            }
          });

          res.redirect("/download")
        res.status(200).end();
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro interno do servidor');
    }
});

api.get('/g2', (req, res) => {
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
        <form action="/g2" method="POST">
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

api.post('/g2', async (req, res) => {

    fs.writeFile(filePath, " ", (err) => {
        if (err) {
          console.error('Erro ao escrever no arquivo:', err);
        } else {
          console.log('Arquivo foi escrito com sucesso.');
        }
      });
      
    console.log("  ")
    console.log("  ")
    console.log("  ")
    console.log("  ")
    console.log("  ")
    console.log("------------------------------------ INICIO NOVA BUSCA --------------------------------------------")
    console.log("  ")
    console.log("  ")
    console.log("  ")
    console.log("  ")
    console.log("  ")

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

                const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

                await delay(350)

                await axios.get("https://www.googleapis.com/customsearch/v1?key=AIzaSyDhocifP74w6uxNaKZLG9OxsGG33kSTMag&cx=50fb58b92361942aa&q=" + formattedLine + start, {
                    method: 'GET',
                    redirect: 'follow'
                })
                    .then(response => {
                        const search = response.data
                        results.push(search.items)
                        return results
                    })
                    .catch(error => console.log('error', error));

                results.forEach(function (item) {
                    if (item) {
                        item.forEach(function (search, t) {
                            console.log("  ")
                            console.log("PESQUISA -> "+line + " -------- Pesquisa "+y+"  de "+searchLines.length+" -- Página:" + i + " -------- Linha: " + (t + 1) + "  -------------")
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
                            console.log("  ")
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
        emailsList = emailsList.split(',,,').join("\n")

        fs.writeFile(filePath, emailsList, (err) => {
            if (err) {
              console.error('Erro ao escrever no arquivo:', err);
            } else {
              console.log('Arquivo foi escrito com sucesso.');
            }
          });

          res.redirect("/download")

        res.status(200).end();
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro interno do servidor');
    }
});

api.get('/g3', (req, res) => {
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
        <form action="/g3" method="POST">
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

api.post('/g3', async (req, res) => {

    fs.writeFile(filePath, " ", (err) => {
        if (err) {
          console.error('Erro ao escrever no arquivo:', err);
        } else {
          console.log('Arquivo foi escrito com sucesso.');
        }
      });

    fs.writeFile(filePath, " ", (err) => {
        if (err) {
          console.error('Erro ao escrever no arquivo:', err);
        } else {
          console.log('Arquivo foi escrito com sucesso.');
        }
      });

    console.log("  ")
    console.log("  ")
    console.log("  ")
    console.log("  ")
    console.log("  ")
    console.log("------------------------------------ INICIO NOVA BUSCA --------------------------------------------")
    console.log("  ")
    console.log("  ")
    console.log("  ")
    console.log("  ")
    console.log("  ")

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

                const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

                await delay(350)

                await axios.get("https://www.googleapis.com/customsearch/v1?key=AIzaSyBMFCmroXLfhzYl9zHgVxL8tiIpqUPjZAE&cx=b1f6ed5a078e64189&q=" + formattedLine + start, {
                    method: 'GET',
                    redirect: 'follow'
                })
                    .then(response => {
                        const search = response.data
                        results.push(search.items)
                        return results
                    })
                    .catch(error => console.log('error', error));

                results.forEach(function (item) {
                    if (item) {
                        item.forEach(function (search, t) {
                            console.log("  ")
                            console.log("PESQUISA -> "+line + " -------- Pesquisa "+y+"  de "+searchLines.length+" -- Página:" + i + " -------- Linha: " + (t + 1) + "  -------------")
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
                            console.log("  ")
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
        emailsList = emailsList.split(',,,').join("\n")

        fs.writeFile(filePath, emailsList, (err) => {
            if (err) {
              console.error('Erro ao escrever no arquivo:', err);
            } else {
              console.log('Arquivo foi escrito com sucesso.');
            }
          });

          res.redirect("/download")


        res.status(200).end();
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro interno do servidor');
    }
});

api.get('/download', async (req, res) => {
    res.download("emails.txt")
})

api.listen(process.env.PORT || 3000, () => {
    console.log('Sistema pronto para começar a buscar e-mails!!!');
});
