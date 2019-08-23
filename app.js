const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

var usersAPI = require('./controller/UserAPI');

app.set('port', (process.env.PORT || 8080));



app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));


app.use('/user', usersAPI);

app.listen(app.get('port'), () => console.log(`App listening on port ${app.get('port')}`));