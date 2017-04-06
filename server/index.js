import path from 'path';
import express from 'express';
import appRootDir from 'app-root-dir';

const app = express();
const PORT = 3000;

app.use('/static', express.static('build'));

app.get('*', (req, res) => {
  res.sendFile(`${appRootDir.get()}/index.html`)
});

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

export default server;
