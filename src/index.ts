if (process.env.NODE_ENV !== 'production') require('dotenv').config();

import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_, res) => res.send({ message: 'Hello World' }));

app.listen(process.env.PORT || 3000, () => console.log('Server up!'));
