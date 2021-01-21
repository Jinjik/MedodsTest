const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRouter = require('./authRouter');
const PORT = process.env.PORT || 5000;

dotenv.config();


const app = express();

app.use(express.json());
app.use('/auth', authRouter)

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECT, { useFindAndModify: false });
        app.listen(PORT, () => console.log(`server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start();
