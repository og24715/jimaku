const fs = require("fs");
const assParser = require("./util/assParser");
const exec = require("child_process").exec;
//let execSync = require("child_process").execSync;
const ProgressBar = require("progress");

const url = process.argv[2];

const workURL = `youtube-dl --write-auto-sub --sub-lang ja --convert-subs ass -f "mp4" -o download.mp4 ${url}`;
const workJimaku = `ffmpeg -i download.mp4 -vf ass=download.ja.ass burnedsubtitle.mp4`;

exec(
  workURL,
  function(error) {
    if (error != null) {
      console.log("Error:" + error);
      process.exit(1);
    }
    console.log("1/3 download complete.")
    exec(
      workJimaku,
      function(error) {
        if (error != null) {
          console.log("Error:" + error);
          process.exit(1);
        }
        console.log("2/3 burn subtitle complete.")
        try {
          const readAss = fs.readFileSync("download.ja.ass", "utf-8");
          const subTitles = assParser(readAss);
          let workString;
          var bar = new ProgressBar(":bar", subTitles.length - 1);
          subTitles.forEach( function(obj, index) {
            if (index == 0) return;
            workString = `ffmpeg -i ../../x2.mp4 -ss ${obj.start} -vframes 1 ../thumbnails/${index}.png`;
        //   execSync(workString);
            exec(
              workString,
              function(error, stdout, stderr) {
                if (error != null) {
                  console.log("Error:" + error);
                }
                bar.tick();
              }
            );
          });
        } catch(e) {
          console.log(e);
          process.exit(1);
        }
        console.log("3/3 all complete.")
      }
    );
  }
);
