const express = require('express');
const app = express();
const routes = require('./routes/index');

app.use(express.json());
app.use('/api', routes);

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});