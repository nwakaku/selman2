const express = require('express');
const { getSubtitles, getVideoDetails } = require('youtube-caption-extractor');

const uploadVoice = require('./uploadVoices')

const app = express();
const port = 5000; // Change this to your desired port number

app.get('/api/captions', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'chrome-extension://jdhabhfaijjpgmikaeagicopigokojhi');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // next();
  const { videoID, lang } = req.query;

  try {
    const subtitles = await getSubtitles({ videoID, lang });
    const videoDetails = await getVideoDetails({ videoID, lang });
    res.status(200).json({ subtitles, videoDetails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/uploadVoice', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'chrome-extension://jdhabhfaijjpgmikaeagicopigokojhi');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // next();
  const { videoID, lang } = req.query;

  try {
    const VoiceID = await uploadVoice(videoID);
    res.status(200).json({ VoiceID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
