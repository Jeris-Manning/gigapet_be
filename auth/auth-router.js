const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
if (fs.existsSync('config/secrets.js')) {
  var secrets = require('../config/secrets.js');
} else {
  var secrets = { jwtSecret: process.env.JWT_SECRET };
}
const DB = require('../knex-queries/model.js');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
  const creds = req.body;
  if (!(creds.username && creds.password)) {
    res.status(406).json({ error: 'Valid Username and Password Required' });
  } else {
    const hash = bcrypt.hashSync(creds.password, 10);
    creds.password = hash;
    try {
      const userAddSuccess = await DB.add(creds);
      res.status(201).json(userAddSuccess);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

router.post('/login', async (req, res) => {
  try {
    if (!(req.body.username && req.body.password)) {
      res.status(406).json({ error: 'Invalid Username or Password' });
    } else {
      let { username, password } = req.body;

      const user = await DB.findBy({ username }).first();

      bcrypt.compareSync(password, user.password);

      if (user && bcrypt.compareSync(password, user.password)) {
        const token = await genToken(user);
        res.status(202).json({ id: user.id, username: user.username, token });
      } else {
        res.status(406).json({ message: 'Invalid Credentials' });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

async function genToken(user) {
  const payload = await {
    userid: user.id,
    username: user.username
  };

  const options = await { expiresIn: '2h' };
  const token = await jwt.sign(payload, secrets.jwtSecret, options);

  return token;
}
module.exports = router;
