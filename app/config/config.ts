import dotenv from 'dotenv'

dotenv.config();

const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    poolSize: 50,
    autoIndex: false,
    retryWrites: false
};

const MONGO_URL = process.env.MONGO_URL || `mongodb://localhost:2717/`;

const MONGO = {
    options: MONGO_OPTIONS,
    url: MONGO_URL
};

const SERVER_PORT = process.env.SERVER_PORT || 5000;

const SERVER ={
    port:SERVER_PORT
}

export const config = {
    mongo: MONGO,
    server:SERVER
}