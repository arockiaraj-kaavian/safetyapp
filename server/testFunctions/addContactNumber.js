/* eslint-disable no-console */
/* eslint-disable no-else-return */
/* eslint-disable no-promise-executor-return */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
// const { UserDetails } = require('../schema');

// const addContactNumber = (token, number) => {
//   if (number !== null) {
//     UserDetails.findOne({ userEmail: token }).then(async (data) => {
//       if (data.contactNumber1 === undefined) {
//         await UserDetails.updateOne({ userEmail: token }, { $set: { contactNumber1: number } })
//           .then(() => (({ status: 'Successfully added..' })))
//           .catch((error) => ({ status: 'User Not added..', error }));
//       } else if (data.contactNumber2 === undefined) {
//         await UserDetails.updateOne({ userEmail: token }, { $set: { contactNumber2: number } })
//           .then(() => ({ status: 'Successfully added..' }))
//           .catch((error) => ({ status: 'User Not added..', error }));
//       } else if (data.contactNumber3 === undefined) {
//         await UserDetails.updateOne({ userEmail: token }, { $set: { contactNumber3: number } })
//           .then(() => ({ status: 'Successfully added..' }))
//           .catch((error) => ({ status: 'User Not added..', error }));
//       }
//       return ({ status: 'Already 3 users have been added' });
//     });
//   } else {
//     return ({ status: 'Please enter the details' });
//   }
// };

// module.exports = { addContactNumber };

/* eslint-disable no-else-return */
/* eslint-disable no-promise-executor-return */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
const { UserDetails } = require('../schema');

async function updateFunction1(token, name, number) {
  await UserDetails.updateOne({ userEmail: token }, { $set: { contactNumber1: number, contactName1: name } });
  return ({ status: 'success', token });
}

async function updateFunction2(token, name, number) {
  await UserDetails.updateOne({ userEmail: token }, { $set: { contactNumber2: number, contactName2: name } });
  return ({ status: 'success', token });
}

async function updateFunction3(token, name, number) {
  await UserDetails.updateOne({ userEmail: token }, { $set: { contactNumber3: number, contactName3: name } });
  return ({ status: 'success', token });
}

const addContactNumbers = async (token, name, number, data) => {
  if (data.contactNumber1 === undefined) {
    const status = await updateFunction1(token, name, number);
    return status;
  } else if (data.contactNumber1 !== undefined && data.contactNumber2 === undefined) {
    const status = await updateFunction2(token, name, number);
    return status;
  } else if (data.contactNumber1 !== undefined && data.contactNumber2 !== undefined && data.contactNumber3 === undefined) {
    const status = await updateFunction3(token, name, number);
    return status;
  } else if (number !== '91undefined' && data.contactNumber1 !== undefined && data.contactNumber2 !== undefined && data.contactNumber3 !== undefined) {
    return ({ status: 'Already 3 users have been added' });
  } else {
    return ({ status: 'Please Enter all fields..' });
  }
};

const addContactNumber = async (token, name, number) => {
  if (number !== null && number !== '91undefined' && number !== undefined && name !== undefined && name !== null && name !== '') {
    const data = await UserDetails.findOne({ userEmail: token }, { _id: 0 });
    const status = await addContactNumbers(token, name, number, data);
    return status;
  } else {
    return ({ status: 'Please enter the details..' });
  }
};

module.exports = {
  addContactNumber, addContactNumbers, updateFunction1, updateFunction2, updateFunction3,
};
