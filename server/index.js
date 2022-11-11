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
const { UserDetails } = require('./schema');

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

app.post('/userRegister', async (req, res) => {
  const { phoneNumber, name } = req.body;
  try {
    await UserDetails.create({ userName: name, userMobileNumber: phoneNumber });
    return res.json({ status: 'success', phoneNumber });
  } catch (error) {
    return res.json({ error });
  }
});

app.post('/search', async (req, res) => {
  const { TOKEN } = req.body;
  console.log(TOKEN, 22);
  await UserDetails.findOne({ userMobileNumber: TOKEN }, { userMobileNumber: 0 }).then((data) => {
    console.log(data);
    return res.json(data);
  });
});

app.put('/modify', async (req, res) => {
  const { num1, num2, num3 } = req.body;
  if (num1 !== '' && num2 !== '' && num3 !== '') {
    await UserDetails.updateOne(
      {},
      {
        $set: { contactNumber1: num1, contactNumber2: num2, contactNumber3: num3 },
      },
    );
  } else {
    const data = 'Please fill all numbers';
    res.json(data);
  }
});
app.post('/api/registerContact', async (req, res) => {
  const { token, mobileNumber } = req.body;
  // const userPhoneNUmber = tokenDecode(token);
  const number = `91${mobileNumber}`;
  if (mobileNumber !== null) {
    await UserDetails.findOne({ userMobileNumber: token }).then(async (data) => {
      if (data.contactNumber1 === undefined) {
        await UserDetails.updateOne({ userMobileNumber: token }, { $set: { contactNumber1: number } });
        return res.json({ status: 'Successfully added..' });
      } else if (data.contactNumber2 === undefined) {
        await UserDetails.updateOne({ userMobileNumber: token }, { $set: { contactNumber2: number } });
        return res.json({ status: 'Successfully added..' });
      } else if (data.contactNumber3 === undefined) {
        await UserDetails.updateOne({ userMobileNumber: token }, { $set: { contactNumber3: number } });
        return res.json({ status: 'Successfully added..' });
      }
      return res.json({ status: 'Already 3 users have been added' });
    });
  } else {
    return res.json({ status: 'Please enter the details' });
  }
});

// API to View Registered Contact
app.post('/api/ViewContact', async (req, res) => {
  const { token } = req.body;
  await UserDetails.findOne({ userMobileNumber: token }, { userMobileNumber: 0, _id: 0, __v: 0 }).then((data) => {
    res.json(data);
    console.log(data);
  });
});

// API to delete Registered Contact1
app.post('/api/deleteContactNumber1', async (req, res) => {
  const { token } = req.body;
  await UserDetails.updateOne({ userMobileNumber: token }, { $unset: { contactNumber1: '' } });
  await UserDetails.find({}).then((data) => {
    res.json(data);
  });
});

// API to delete Registered Contact2
app.post('/api/deleteContactNumber2', async (req, res) => {
  const { token } = req.body;
  await UserDetails.updateOne({ userMobileNumber: token }, { $unset: { contactNumber2: '' } });
  await UserDetails.find({}).then((data) => {
    res.json(data);
  });
});

// API to delete Registered Contact3
app.post('/api/deleteContactNumber3', async (req, res) => {
  const { token } = req.body;
  await UserDetails.updateOne({ userMobileNumber: token }, { $unset: { contactNumber3: '' } });
  await UserDetails.find({}).then((data) => {
    res.json(data);
  });
});

// API to edit Registered Contact
app.put('/modify', async (req, res) => {
  const { num1, num2, num3 } = req.body;
  if (num1 !== '' && num2 !== '' && num3 !== '') {
    await UserDetails.updateOne(
      {},
      {
        $set: { contactNumber1: num1, contactNumber2: num2, contactNumber3: num3 },
      },
    );
  } else {
    const data = 'Please fill all numbers';
    res.json(data);
  }
});

// API for alert message
app.post('/api/alertMessage', async (req, res) => {
  const { token, location } = req.body;
  // const userPhoneNUmber = tokenDecode(token);
  const details = await UserDetails.findOne({ userMobileNumber: token });
  const locat = location;

  const axios = require('axios');

  if (details.contactNumber1 !== undefined) {
    const a = details.contactNumber1;
    console.log(a, '123');
    console.log(location);
    // const a = +917339437623;
    const data = `{"messaging_product": "whatsapp", "to":${details.contactNumber1}, "type": "template", "template": { "name": "alert_safe_wizards", "language": { "code": "en_US" },"components":[{"type":"body","parameters":[{"type":"text","text":"${details.userName}"},{"type":"text","text":"${locat}"}]}] }}`;
    const config = {
      method: 'POST',
      url: 'https://graph.facebook.com/v15.0/106768935582427/messages',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer EAAP6obW3ZB1oBAMQMdnrHWSjztlDfMvJBhsFirWhAK7AdIA33WJZAUpCZAKsun3pksmxDjgq9SAOgvcU00GlE32bz1ZBDxf8u04QK8O28bcZBZAsuK9DhLAE2VQ2j8PRSO1P8WwT4vrMSmHTuexAdR0j5F1vfvEJT193fVoWJZBrbZCd1BVDodNlxnpL0UR2DTGD8PrWKAnu1dF6nP5R7YTd',
      },
      data,
    };
    axios(config);
  }

  if (details.contactNumber2 !== undefined) {
    const data1 = `{"messaging_product": "whatsapp", "to":${details.contactNumber2}, "type": "template", "template": { "name": "alert_safe_wizards", "language": { "code": "en_US" },"components":[{"type":"body","parameters":[{"type":"text","text":"${details.userName}"},{"type":"text","text":"${locat}"}]}] }}`;
    const config = {
      method: 'POST',
      url: 'https://graph.facebook.com/v15.0/106768935582427/messages',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer EAAP6obW3ZB1oBAA1trZChcOXxyNE4c6tdKY99vnDJGzKrooM45TjFDJRjELDmiFPoV2UIa6yPJmsBYM2NxjwJzFWBiaR6X6AiCqsZBQDiahScq8i7SQxYhcgWMZBdaJagdzZB29xEPZC2534b8Bc0eNk40HuSJ3wtsl9LVjRCVtPw9mEWftVWT',
      },
      data: data1,
    };
    axios(config);
  }

  if (details.contactNumber3 !== undefined) {
    const data1 = `{"messaging_product": "whatsapp", "to":${details.contactNumber3}, "type": "template", "template": { "name": "alert_safe_wizards", "language": { "code": "en_US" },"components":[{"type":"body","parameters":[{"type":"text","text":"${details.userName}"},{"type":"text","text":"${locat}"}]}] }}`;
    const config = {
      method: 'POST',
      url: 'https://graph.facebook.com/v15.0/106768935582427/messages',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer EAAP6obW3ZB1oBAA1trZChcOXxyNE4c6tdKY99vnDJGzKrooM45TjFDJRjELDmiFPoV2UIa6yPJmsBYM2NxjwJzFWBiaR6X6AiCqsZBQDiahScq8i7SQxYhcgWMZBdaJagdzZB29xEPZC2534b8Bc0eNk40HuSJ3wtsl9LVjRCVtPw9mEWftVWT',
      },
      data: data1,
    };
    axios(config);
  }
  return res.json('');
});
// const result = async () => {
//   // await UserDetails.create({ userName: 'Poomathi.K', userMobileNumber: 987654321012 });
//   await UserDetails.find({ userMobileNumber: 9047420795 });
//   // .then(data=> console.log(data));
// };

// result();

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
