/* eslint-disable no-undef */
const sinon = require('sinon');
const deletecontactnumber = require('../testFunctions/deleteContactNumber');
const { UserDetails } = require('../schema');

const sandbox = sinon.createSandbox();
describe('DELETECONTACTNUMBER', () => {
  afterEach(() => {
    sandbox.restore();
  });
  it('DELETENUMBER', async () => {
    sandbox.stub(UserDetails, 'updateOne');
    sandbox.stub(UserDetails, 'findOne').returns({ userData: 'testing success' });
    const value = await deletecontactnumber.deleteContactNumber3('rsanthosh17c@gmail.com');
    expect(value.userData).toEqual('testing success');
  });
  it('ERROR', async () => {
    sandbox.stub(UserDetails, 'updateOne');
    sandbox.stub(UserDetails, 'findOne').returns('error');
    const value = await deletecontactnumber.deleteContactNumber3(undefined);
    expect(value.status).toEqual('error');
  });
});
