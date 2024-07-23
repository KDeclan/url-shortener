require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let urlDatabase = {};
let urlCounter = 1;

function isValidUrl(url) {
  const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate the protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!urlPattern.test(url);
}

app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;
  
  if (!isValidUrl(url)) {
    return res.json({ error: 'invalid url' });
  }

  const shortUrl = urlCounter++;
  urlDatabase[shortUrl] = url;

  res.json({ original_url: url, short_url: shortUrl });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = req.params.short_url;
  const originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
    return res.redirect(originalUrl);
  } else {
    return res.json({ error: 'invalid url' });
  }
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
