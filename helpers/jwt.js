const { expressjwt } = require('express-jwt');

function authJwt() {
  const secret = process.env.SECRET;
  const api = process.env.API_URL;
  return expressjwt({
    secret,
    algorithms: ['HS256'],
  }).unless({
    path: [
      `${api}/users/login`,
      `${api}/users/register`,
      'http://localhost:3000',
    ],
  });
}

module.exports = authJwt;
