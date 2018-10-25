const fs = require("fs");
const assParser = require("./util/assParser");
const exec = require("child_process").exec;
//let execSync = require("child_process").execSync;
const ProgressBar = require("progress");
const deleteFiles = [ "download.mp4", "download.ja.ass", "burnedsubtitle.mp4" ];

const url = process.argv[2];

const workURL = `youtube-dl --write-auto-sub --sub-lang ja --convert-subs ass -f "mp4" -o download.mp4 ${url}`;
const workJimaku = 'ffmpeg -y -i download.mp4 -vf ass=download.ja.ass burnedsubtitle.mp4';

console.log("0/3 start process.");

exec(
  workURL,
  function(error, stdout, stderr) {
    if (error || stderr) {
      console.log("Error:" + error);
      console.log("StdErr:" + stderr);
      deleteFile();
      process.exit(1);
    }
    console.log("1/3 download complete.");

    exec(
      workJimaku,
      function(error, stdout, stderr) {
        if (error) {
          console.log("Error:" + error);
          deleteFile();
          process.exit(1);
        }
        console.log("2/3 burn subtitle complete.");

        try {
          const readAss = fs.readFileSync("download.ja.ass", "utf-8");
          const subTitles = assParser(readAss);
          let workString;
          var bar = new ProgressBar("[:bar] :current/:total :percent ", subTitles.length - 1);
          let countOutputImage = 0;
          subTitles.forEach(
            function(obj, index) {
              if (index == 0) return;
              workString = `ffmpeg -y -i burnedsubtitle.mp4 -ss ${obj.start} -vframes 1 thumbnails/${index}.png`;
              //   同期処理の場合は execSync(workString);
              exec(
                workString,
                function(error, stdout, stderr) {
                  if (error) {
                    console.log("Error:" + error);
                    console.log("StdErr:" + stderr);
                    deleteFile();
                    process.exit(1);
                  }
                  bar.tick();
                  countOutputImage += 1;
                  // console.log(countOutputImage, subTitles.length);
                  if (countOutputImage >= subTitles.length - 1) {
                    console.log("3/3 all complete.")
                    deleteFile();
                  }
                }
              );
            }
          );
        } catch(e) {
          console.log(e);
          deleteFile();
          process.exit(1);
        }
      }
    );
  }
);

function deleteFile() {
  deleteFiles.forEach(
    function (url) {
      fs.unlink(
        url,
        function(error, stdout, stderr) {
          if (error || stderr) {
            console.log("Error:" + error);
            console.log("StdErr:" + stderr);
          }
        }
      );
    }
  );
}
