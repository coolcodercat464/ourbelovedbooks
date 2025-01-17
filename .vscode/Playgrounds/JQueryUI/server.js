const express = require("express")
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname + 'public')))

const options = {
    root: path.join(__dirname, '/public')
};

app.get("/", (req, res) => {
    res.sendFile('index.html', options)
})

app.listen(3000, ()=> {
    console.log("Server started on port 3000");
})