const fs = require('fs');
const { exec } = require('child_process');
const ProgressBar = require('progress');
const assParser = require('./util/assParser');

const downloadVideoName = 'download.mp4';
const downloadSubtitileName = 'download.ja.ass';
const burnedVideoName = 'burnedVideo.mp4';
const deleteFiles = [downloadVideoName, downloadSubtitileName, burnedVideoName];

const assStyle = [
  'Fontname=HiraginoSans-W6',
  'BorderStyle=4',
  'BackColour=&H40000000',
  'Outline=0',
];

const COMMANDS = {
  downloadVideo: url => `youtube-dl --no-continue --write-auto-sub --sub-lang ja --convert-subs ass -f "mp4" -o ${downloadVideoName} ${url}`,
  burnSubtitle: () => `ffmpeg -y -i ${downloadVideoName} -vf "scale=640:-1,subtitles=${downloadSubtitileName}:force_style='${assStyle.join()}'" ${burnedVideoName}`,
  createThumbnail: (time, filename) => `ffmpeg -y -ss ${time} -i ${burnedVideoName} -vframes 1 thumbnails/${filename}.png`,
};

console.log('0/3 start process.');

const errorHandler = () => {
  deleteFile();
  process.exit(1);
};

const deleteFile = () => {
  const del = (filepath) => {
    fs.unlink(filepath, (error, stdout, stderr) => {
      if (error || stderr) {
        console.log(`Error:${error}`);
        console.log(`StdErr:${stderr}`);
      }
    });
  };

  deleteFiles.forEach(del);
};

const downloadVideo = url => new Promise((resolve, reject) => {
  exec(
    COMMANDS.downloadVideo(url),
    (error, stdout, stderr) => {
      if (error || stderr) {
        console.log(`Error:${error}`);
        console.log(`StdErr:${stderr}`);
        reject(error || stderr);
      }
      console.log('1/3 download complete.');
      resolve();
    },
  );
});

const createThumbnails = (time, filename) => new Promise((resolve, reject) => {
  exec(
    COMMANDS.createThumbnail(time, filename),
    (error, stdout, stderr) => {
      if (error) {
        console.log(`Error:${error}`);
        console.log(`StdErr:${stderr}`);
        reject();
      }
      resolve();
    },
  );
});

const burnSubtitle = () => new Promise((resolve, reject) => {
  exec(
    COMMANDS.burnSubtitle(),
    (error, stdout, stderr) => {
      if (error) {
        console.log(`Error:${error}`);
        reject();
      }
      console.log('2/3 burn subtitle complete.');
      resolve();
    },
  );
});

const main = async (url) => {
  await downloadVideo(url).catch(errorHandler);
  await burnSubtitle().catch(errorHandler);

  const ass = fs.readFileSync(downloadSubtitileName, 'utf-8');
  const subtitles = assParser(ass);
  const bar = new ProgressBar('[:bar] :current/:total :percent ', subtitles.length - 1);

  await subtitles.reduce(
    (promise, subtitle, index) => promise.then(() => createThumbnails(subtitle.start, index).then(() => bar.tick())),
    Promise.resolve(),
  );

  console.log('3/3 complete.');
  deleteFile();
};
