const fetch = require('node-fetch');

module.exports = (req, res) => {
  const body = req.body;

  const url = 'https://api.sendinblue.com/v3/contacts';
  const finalBody = JSON.stringify({
    attributes: { FNAME: body.name },
    updateEnabled: true,
    email: body.email,
  });
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'api-key': process.env.NEWSLETTER_API,
    },
    body: finalBody,
  };

  fetch(url, options)
    .then((res) => {
      console.log(res);
      return res.json({
        statusCode: 200,
      });
    })
    .catch((err) => {
      console.error('error:' + err);
      return res.json({
        statusCode: 500,
      });
    });
};
