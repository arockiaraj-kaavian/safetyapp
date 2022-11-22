/* eslint-disable new-cap */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable object-shorthand */
/* eslint-disable consistent-return */
/* eslint-disable global-require */
/* eslint-disable no-else-return */
/* eslint-disable max-len */
/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
// const uploadPicture = require('./sample');
// eslint-disable-next-line import/no-unresolved
// const { UserDetails } = require('./schema');
const { addContactNumber } = require('./testFunctions/addContactNumber');
const {
  updateContactNumber1, updateContactNumber2, updateContactNumber3, updateCallNumber,
} = require('./testFunctions/updateContactNumber');
const {
  deleteContactNumber2, deleteContactNumber1, deleteContactNumber3, deleteCallNumber,
} = require('./testFunctions/deleteContactNumber');
const { getUserDetails } = require('./testFunctions/gettingUserDetails-alertMessage');
const { callContactNumberAPI } = require('./API-Test-Functions/callContactNumberAPI');
const { alertMessage } = require('./testFunctions/alertMessage');
const { userRegisterAPI } = require('./API-Test-Functions/userRegisterAPI');
const { viewContactAPI } = require('./API-Test-Functions/viewContactNumberAPI');

const NODE_ENV = process.env.NODE_ENV || 'DEV';

const app = express();
// mogoose connection
mongoose.connect(
  'mongodb+srv://viruteam:437t1Ko6SW05F2TE@kaavian-systems-blr-db-6a06161d.mongo.ondigitalocean.com/hackathonDB?tls=true&authSource=admin&replicaSet=kaavian-systems-blr-db',
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('DB Connected successfully');
});

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: 'http://localhost:3000' }));

// for serving built static js/css files
app.use('/static', express.static(path.join(__dirname, '/../client/build/static')));
app.use('/images', express.static(path.join(__dirname, '/../client/build/images')));

// API for User Register..
app.post('/userRegister', userRegisterAPI);

app.post('/api/addContact', async (req, res) => {
  const { token, userName, mobileNumber } = req.body;
  const number = `91${mobileNumber}`;
  const data = await addContactNumber(token, userName, number);
  res.json(data);
});

// API for call number
app.post('/api/callNumbers', callContactNumberAPI);

// API to View Registered Contact
app.post('/api/ViewContact', viewContactAPI);

// API to delete Registered Contact1
app.post('/api/deleteContactNumber1', async (req, res) => {
  const { token } = req.body;
  const data = await deleteContactNumber1(token);
  res.json(data);
});

// API to delete Registered Contact2
app.post('/api/deleteContactNumber2', async (req, res) => {
  const { token } = req.body;
  const data = await deleteContactNumber2(token);
  res.json(data);
});

// API to delete Registered Contact3
app.post('/api/deleteContactNumber3', async (req, res) => {
  const { token } = req.body;
  const data = await deleteContactNumber3(token);
  res.json(data);
});

// API to delete Registered call number
app.post('/api/deleteCallNumber', async (req, res) => {
  const { token } = req.body;
  const data = await deleteCallNumber(token);
  res.json(data);
});

// API to edit Registered Contact
app.put('/modify1', async (req, res) => {
  const {
    token, contactNumber1,
  } = req.body;

  const data = await updateContactNumber1(token, contactNumber1);
  res.json(data);
});

// API to edit Registered Contact
app.put('/modify2', async (req, res) => {
  const {
    token, contactNumber2,
  } = req.body;
  const data = await updateContactNumber2(token, contactNumber2);
  console.log(data, 452);
  res.json(data);
});

// API to edit Registered Contact
app.put('/modify3', async (req, res) => {
  const {
    token, contactNumber3,
  } = req.body;
  const data = await updateContactNumber3(token, contactNumber3);
  console.log(data, 452);
  res.json(data);
});

// API to edit Registered Contact
app.put('/updateCallNumber', async (req, res) => {
  const {
    token, contactNumber3,
  } = req.body;
  const data = await updateCallNumber(token, contactNumber3);
  console.log(data, 452);
  res.json(data);
});

// API for alert message
// API for alert message
app.post('/api/alertMessage', async (req, res) => {
  const { token, location } = req.body;
  // const userPhoneNUmber = tokenDecode(token);
  const details = await getUserDetails(token);
  const locat = location;
  console.log(locat, 567890);
  console.log(details, 123);
  const data1 = await alertMessage(details.contactNumber1, details.userName, locat);
  await alertMessage(details.contactNumber2, details.userName, locat);
  await alertMessage(details.contactNumber3, details.userName, locat);
  return res.json(data1);
});

app.post('/image', async (req, res) => {
  const { picture } = req.body;
  console.log(picture);
  console.log(typeof (picture));
  const imagebuffer = picture.substring(23);
  const finalImg = new Buffer.from(imagebuffer, 'base64');
  fs.writeFileSync('myImg.png', finalImg);
  res.json(picture);
});

app.post('/otp', (req, res) => {
  const { email } = req.body;
  let otp = '';

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  res.json(otp);

  const mailOptions = {
    from: 'kaavianlibraryvnr@gmail.com',
    to: `${email}`,
    subject: 'Safety App',
    text: `${otp} is your verification code for SOS`,
  };

  // Mail transport configuration
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kaavianlibraryvnr@gmail.com',
      pass: 'nhadtxippjbkcube',
    },
  });

  // Delivering mail with sendMail method
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    else console.log(`Email sent: ${info.response}`);
  });
});

// for any other request, serve HTML in DIT environment (cloud env)
if (NODE_ENV === 'DIT') {
  const indexHTMLContent = fs.readFileSync(
    path.join(`${__dirname}/../client/build/index.html`),
    'utf8',
  );
  app.all('*', (req, res) => {
    res.send(indexHTMLContent);
  });
}

app.listen(3001, () => {
  console.log('server Running');
});
