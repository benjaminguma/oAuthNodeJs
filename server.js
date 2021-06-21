require ('dotenv').config ();
const express = require ('express');
const utils = require ('./utils');
const port = 4000;
const app = express ();

app.get ('/auth', async (req, res) => {
  try {
    res.redirect (utils.request_get_auth_code_url);
  } catch (error) {
    res.sendStatus (500);
    console.log (error.message);
  }
});

app.get (process.env.REDIRECT_URI, async (req, res) => {
  const authorization_token = req.query.code;
  try {
    // ! GET ACCESS TOKEN USING AUTHORIZATION TOKEN
    const response = await utils.get_access_token (authorization_token.code);
    const {access_token} = response.data;
    // !GET USER DATA
    const user = await utils.get_profile_data (access_token);
    const user_data = user.data;
    res.send (`
      <h1> welcome ${user_data.name}</h1>
      <img src="${user_data.picture}" alt="user_image" />
    `);
  } catch (error) {
    console.log (error.message);
    res.sendStatus (500);
  }
});

app.listen (port);
