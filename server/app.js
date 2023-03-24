const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.get('/', (req, res) => {
    console.log('works')
})

app.listen(3000, () => {
    console.log('listening on port 3000')
})