const ffmpeg = require('fluent-ffmpeg')
const pathToFfmpeg = require('ffmpeg-static')
const pathToFfprobe = require('ffprobe-static')
const fs = require('fs')

console.log(pathToFfmpeg)
console.log(pathToFfprobe.path)

ffmpeg.setFfmpegPath(pathToFfmpeg);
ffmpeg.setFfprobePath(pathToFfprobe.path);

function getVDOInfomation(metadata) {

  const format = metadata.format
  const vdo = metadata.streams[0]
  const audio = metadata.streams[1]
  console.log(getFilename(format.filename), format.format_name, format.duration, format.size);

  const name = getFilename(format.filename);
  const extension = getFileExtension(name)
  const duration = convertDuration(format.duration)
  const size = convertSizeToMB(format.size)

  const output = {
    name: name,
    extension: extension,
    alternative_format: format.format_name,
    duration: {
      minute: duration.minute,
      second: duration.second,
    },
    size: size +" MB",
    resolution: {
      width: vdo.width, 
      height: vdo.height
    }
  }

  return output
}

function getMetadata(src) {

  return new Promise((resolve, reject) => {

    ffmpeg.ffprobe(src, function(err, metadata) {

      if (err) {
        console.log(err)
        reject(err)
        return
      }
  
      console.log(metadata)
  
      resolve(metadata)
  
    });

  })

  
}

function getFilename(fullPath) {
  return fullPath.replace(/^.*[\\\/]/, '')
}

function getFileExtension(filename) {
  return filename.split(".").pop()
}

function convertDuration(duration) {
  
  const durationM = duration / 60 // minute
  const durationS = ( durationM - Math.trunc(durationM) ) * 60 // second
  // const actual_duration = Math.trunc(durationM) + (Math.trunc(durationS) * 0.1) // merge minute+second

  return {
    minute: Math.trunc(durationM),
    second: Math.trunc(durationS)
  }

}

function convertSizeToMB(size) {
  return (Math.round(size / 1024) / 1024).toFixed(2)
}

function getThumbnails(uploadPath, duration, resolution) {

  console.log('getThumbnails', uploadPath, duration, resolution);

  return new Promise((resolve, reject) => {

    const half_duration_in_second = ((duration.minute * 60) + duration.second) / 2

    ffmpeg(uploadPath)
    // setup event handlers
    .on('filenames', function(filenames) {
      console.log('screenshots are ' + filenames.join(', '))
    })
    .on('end', function() {
      console.log('screenshots were saved')
      const b64 = localToBase64('assets/thumbnail/', 'tn')
      resolve(b64)
    })
    .on('error', function(err) {
      console.log('an error happened: ' + err.message)
    })
    // take 1 screenshots at center of vdo
    .takeScreenshots({ count: 1, timemarks: [ half_duration_in_second ], size: resolution.width+'x'+resolution.height }, 'assets/thumbnail/')

  })
}

function localToBase64(dir, filename) {

  try {
    const imgSrc = dir+"/"+filename+".png"
    const img_base64 = fs.readFileSync(imgSrc, {encoding: 'base64'})
    return img_base64
  } catch (error) {
    console.log('localToBase64 ERROR', error);
  }
}

function removeProcessAssets(filename) {

  fs.unlinkSync('assets/upload/'+filename)
  fs.unlinkSync('assets/thumbnail/tn.png')
}

module.exports = { getMetadata, getVDOInfomation, getThumbnails, removeProcessAssets };