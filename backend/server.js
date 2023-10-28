const express = require('express');
const { getSubtitles, getVideoDetails } = require('youtube-caption-extractor');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const app = express();
const port = process.env.PORT || 5000; 

app.get('/api/captions', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CHROME_EXT);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const { videoID, lang } = req.query;

  try {
    const subtitles = await getSubtitles({ videoID, lang });
    const videoDetails = await getVideoDetails({ videoID, lang });

    res.status(200).json({ subtitles, videoDetails });
  } catch (error) {
    res.status(500).json({ error: error.message || "An Error Occured in the Server" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
