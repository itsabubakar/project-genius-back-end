import express from 'express';
import router from './route/index'

const app = express();

app.use(express.json());
app.use('/', router);
app.listen(1245);
