const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const requestHelper =  require('./requestHelper');
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
    console.log(req.query);
    res.send('Hello World!');
});

app.post('/', (req, res, next) => {
    console.log('Got An Request');
    //console.log(req.body);
    if (req.body.challenge !== undefined) res.send(req.body.challenge);
    else {
        res.sendStatus(200);
        if (req.body.event.client_msg_id !== undefined) {
            requestHelper.handleRequst(req.body);
        }
    }
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

//https://slack.com/oauth/authorize?client_id=1054275065493.1070794908512&scope=users.profile%3Awrite&redirect_uri=https%3A%2F%2F5cb7047e.ngrok.io%2F

//code: '1054275065493.1062753662036.6b45798e17975250af903825bd9a1de05e9718027b510951c770a9dfa0f28aac',

//https://slack.com/api/oauth.access?client_id=1054275065493.1070794908512&client_secret=9f4beb5737e297d11849c123e4e76012&code=1054275065493.1062753662036.6b45798e17975250af903825bd9a1de05e9718027b510951c770a9dfa0f28aac&redirect_uri=https%3A%2F%2F5cb7047e.ngrok.io%2F
//https://slack.com/api/oauth.access?client_id=1054275065493.1070794908512&client_secret=9f4beb5737e297d11849c123e4e76012&code=1054275065493.1054737172914.b76d58888cf5ab024313672172948323bc8ea3bc8a1e10bef5cad355335ea6a6&redirect_uri=https%3A%2F%2F5cb7047e.ngrok.io%2F