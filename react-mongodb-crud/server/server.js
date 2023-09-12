// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Database connection
mongoose.connect('mongodb://localhost:27017/dataSekolah', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => console.error('Connection error:', error));
db.once('open', () => console.log('Connected to database'));

// Define DataSiswa model
const dataSiswaSchema = new mongoose.Schema({
  name: String,
  age: Number,
  grade: String,
});

const DataSiswa = mongoose.model('DataSiswa', dataSiswaSchema);

// API routes
app.get('/api/siswa', async (req, res) => {
  try {
    const students = await DataSiswa.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan dalam mengambil data siswa' });
  }
});

app.post('/api/siswa', async (req, res) => {
  const { name, age, grade } = req.body;

  try {
    const siswa = new DataSiswa({ name, age, grade });
    const savedSiswa = await siswa.save();
    res.status(201).json(savedSiswa);
  } catch (error) {
    res.status(500).json({ error: 'Gagal menambahkan data siswa' });
  }
});

app.delete('/api/siswa/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await DataSiswa.findByIdAndRemove(id);
    res.json({ message: 'Data siswa dihapus dengan sukses' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus data siswa' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
