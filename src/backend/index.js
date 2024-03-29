const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { execute } = require("./utils");
const fs = require('fs');
const path = require('path');

const { getWalletBalance, create_wallet, delete_wallet, import_wallet, export_wallet } = require("./wallet");
const { prepare_files } = require("./files");
const { initiate_deal, refresh_deal_status, find_miners, deal_data } = require("./deal");
const { retrieve_files } = require("./retrieve")

const app = express();
app.use(cors())
app.use(morgan('dev'));
const PORT = 8000;

const homeDir = '/mnt/c/Users/ravis/OneDrive'//require('os').homedir();
const folderPath = path.join(homeDir, 'Desktop', 'fildrop');
const stagingFilePath = path.join(folderPath, 'staging');
const carFilePath = path.join(folderPath, 'car');
const downloadPath = path.join(folderPath, 'downloads');

app.get('/health', (req, res) => {
  res.send('Server is running');
});

//file
app.get('/list_staging_files', async(req, res) => {
  const files = await fs.promises.readdir(stagingFilePath);
  res.send(files);
});

app.get('/list_ready_files', async(req, res) => {
  const files = await fs.promises.readdir(carFilePath);
  res.send(files);
});

app.get('/prepare_files', async(req, res) => {
  const prep = await prepare_files(stagingFilePath, carFilePath);
  res.send(prep);
});

//deal
app.get('/find_miners', async(req, res) => {
  const miners = await find_miners();
  res.send(miners);
});

app.get('/initiate_deal', async(req, res) => {
  const dealInfo = await initiate_deal(
    req.query.miner,
    req.query.fileName,
    req.query.commp,
    req.query.carS,
    req.query.pieceS,
    req.query.payloadCid
  );
  res.send(dealInfo);
});

app.get('/refresh_deal', async(req, res) => {
  console.log(req.query.miner, req.query.dealUUID, req.query.payloadCid)
  const status = await refresh_deal_status(req.query.miner, req.query.dealUUID, req.query.payloadCid);
  res.send(status);
});

app.get('/deal_data', async(req, res) => {
  const data = await deal_data();
  console.log(data)
  res.send(data);
});

//retrieve
app.get('/retrieve_file', async(req, res) => {
  const outPath = path.join(downloadPath, req.query.fileName);
  const response = await retrieve_files(req.query.miner, outPath, req.query.payloadCid);
  res.send(response);
});

//download
app.head('/download_file', async(req, res) => {
  const filePath = path.join(carFilePath, req.query.file_name);
  if (fs.existsSync(filePath)) {
    const stats = await fs.promises.stat(filePath);
    res.header('ngrok-skip-browser-warning', true);
    res.header('Content-Length', stats.size);
    res.header('Content-Disposition', `attachment; filename="${req.query.file_name}"`);
    res.status(200).end();
  } else {
    res.status(404).send('File not found');
  }
});

app.get('/download_file', async(req, res) => {
  const filePath = path.join(carFilePath, req.query.file_name);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  const stats = await fs.promises.stat(filePath);
  const fileSize = stats.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
    const chunksize = (end-start)+1;
    const file = fs.createReadStream(filePath, {start, end});
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${req.query.file_name}"`,
      'ngrok-skip-browser-warning': true
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${req.query.file_name}"`,
      'ngrok-skip-browser-warning': true
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

//wallet
app.get('/list_wallet', async(req, res) => {
    const data = await getWalletBalance();
    res.send(data)
});

app.get('/create_wallet', async(req, res) => {
  const data = await create_wallet();
  res.send(data)
});

app.get('/import_wallet', async(req, res) => {
  console.log(req.query.privateKey)
  const data = await import_wallet(req.query.privateKey);
  res.send(data)
});

app.get('/export_wallet', async(req, res) => {
  const data = await export_wallet();
  res.send(data)
});

app.delete('/delete_wallet', async(req, res) => {
  const data = await delete_wallet(req.query.address);
  res.send(data)
});

const testFun = async() =>{

}
// testFun()

if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}
if (!fs.existsSync(stagingFilePath)) {
  fs.mkdirSync(stagingFilePath);
}
if (!fs.existsSync(carFilePath)) {
  fs.mkdirSync(carFilePath);
}
if (!fs.existsSync(downloadPath)) {
  fs.mkdirSync(downloadPath);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
