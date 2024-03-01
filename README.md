
# FFMPEG EXPERIMENT

Get metadata & thumbnail from video file using nodejs & ffmpeg library.

## Installation

Install /server with npm

```bash
  cd server
  npm install
```
That's it. !!

## Please note !!

```bash
  const ffmpeg = require('fluent-ffmpeg')
  const pathToFfmpeg = require('ffmpeg-static')
  const pathToFfprobe = require('ffprobe-static')

  ffmpeg.setFfmpegPath(pathToFfmpeg);
  ffmpeg.setFfprobePath(pathToFfprobe.path);
```

setFfmpegPath & setFfprobePath should pointer to execution file.

Example: node_modules\ffmpeg-static\ffmpeg.exe (winOS)

## Tech Stack

**Client:** Vanilla HTML+JS 

**Server:** Node, Express, ffmpeg, ffprobe

