import express from 'express';
import { db } from './db.js';
import user from './controllers/usercontroller.js';
import gameController from './controllers/gamecontroller.js';
import { validateSession } from './middleware/validate-session.js';
import { config } from './common/config.js';


const app = express();
const { PORT } = config;

db.sync();
app.use(express.json());
app.use('/api/auth', user);
app.use(validateSession);
app.use('/api/game', gameController);

app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`);
});