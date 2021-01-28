import dotenv from "dotenv";

dotenv.config();

const MONGO_OPTIONS = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  socketTimeoutMS: 30000,
  keepAlive: true,
  poolSize: 50,
  autoIndex: false,
  retryWrites: false,
};

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/library-management'

const MONGO = {
  options: MONGO_OPTIONS,
  url: MONGO_URL,
};

const SERVER_PORT = process.env.SERVER_PORT || 5000;

const SERVER = {
  port: SERVER_PORT,
};
const SECRET = process.env.TOKEN_SECRET || '7840b29d8046a3f427c1097d77cb939baae4756480fce3e450b74077987c86fab1f29053d2668970ba46b7af4bf469255a17955b95f41480cd8c88787bcd0e20';
const TOKEN_ISSUER = process.env.TOKEN_SECRET_ISSUER || '7fab1f29053d2668970ba46b7af4bf469255a17955b95f41480cd8c88787bcd0e20';

const tokenConfig = {
  secret: SECRET,
  issuer: TOKEN_ISSUER,
  expiration:  1800000,
};

export const config = {
  mongo: MONGO,
  server: SERVER,
  tokenConfig: tokenConfig,
};
