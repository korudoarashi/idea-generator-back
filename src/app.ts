import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config';
import logger from './utils/logger.utils';
import { baseRouter } from './routes';

const PORT = process.env.PORT;
const app = express();

app.use(cors({}));
process.env.NODE_ENV == 'development' && app.use(morgan('dev'));
app.use(json());
app.use(baseRouter);

export const server = app.listen(PORT, () => {
  logger.info(`Server started on PORT ${PORT}!`);
});

export default app;
