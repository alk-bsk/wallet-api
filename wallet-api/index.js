const express = require('express');
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

//import Routes
const walletRoute = require('./routes/wallet');

app.use(cors());
dotenv.config();
app.use(express.json());

//connect db
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Database connected..')
});

app.use('/wallet', walletRoute);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})