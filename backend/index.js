const express = require("express");
const PORT = process.env.PORT || 3001;
const cors = require('cors');

const app = express();

// app.use(cors({ origin: 'http://localhost:3000' }));
app.use(cors({ origin: 'http://frontend-bdproyecto.s3-website-us-east-1.amazonaws.com' }));

app.use(express.json());
app.use(require('../backend/api_proyecto'));
app.use(require('../backend/api_varios'));
app.use(require('../backend/api_carpeta'));
app.use(require('../backend/api_usuario'));
app.use(require('../backend/api_archivo'));


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});