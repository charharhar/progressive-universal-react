import path from 'path';
import express from 'express';
import appRootDir from 'app-root-dir';

import App from '../shared/App';
import renderApp from './middleware/renderApp';

const app = express();
const PORT = 3000;

app.use('/static', express.static('build'));
app.use(renderApp);

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

export default server;
