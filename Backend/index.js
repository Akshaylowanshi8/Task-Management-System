const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB(process.env.MONGO_URI);
;
app.use('/api', require('./routes/index'));

app.get('/', (req, res) => {
  res.send('Server is running...');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port http://localhost:${PORT}`));