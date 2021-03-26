const { User } = require('../../../models/User');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');

describe('auth middleware', () => {
  test('should populate req.user with the payload of a valid JWT', () => {
    const payload = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true };
    const token = new User(payload).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();

    auth(req, res, next);

    expect(req.user).toMatchObject(payload);
  });
});
