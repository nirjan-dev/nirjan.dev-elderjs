const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const body = req.body;

  const url = 'https://api.sendinblue.com/v3/contacts';
  const finalBody = JSON.stringify({
    attributes: { FIRSTNAME: body.name },
    updateEnabled: true,
    email: body.email,
    listIds: [3],
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

  await fetch(url, options);

  return res.json({
    statusCode: 200,
  });
};
