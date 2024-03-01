const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const app = express()
const { getMetadata, getVDOInfomation, getThumbnails } = require("./vdo_processor");

app.use(fileUpload());
app.use(cors())

console.log(__dirname);

app.post('/upload', (req, res) => {

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const vdo_file = req.files.vdo_file;
  const uploadPath = __dirname + '/assets/upload/' + vdo_file.name;

  console.log('UPLOAD FILE: ', vdo_file);

  vdo_file.mv(uploadPath, async function(err) {
    if (err) return res.status(500).send(err);

    const metadata = await getMetadata(uploadPath)
    const output = getVDOInfomation(metadata)
    const thumbnailB64 = await getThumbnails(uploadPath, output.duration, output.resolution)
    output.thumbnail = thumbnailB64;
    console.log(output);
    res.status(200).send(output);

  });

})

app.listen(3000, () => {
  console.log('Start server at port 3000.')
})