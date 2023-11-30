const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());

// Endpoint to handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = path.join(__dirname, req.file.path);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Here you can process the JSON file as needed

  // For demonstration, let's assume you just send back the content
  res.send(fileContent);
});

const port = 3001;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
