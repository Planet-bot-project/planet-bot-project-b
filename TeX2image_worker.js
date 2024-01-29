const fs = require("fs");
const sharp = require("sharp");
const mathjax = require("mathjax");
const { parentPort } = require("worker_threads");

function option(flag) {
  if (flag === true) return "source";
  else return "over";
}

async function make_file(obj) {
  let error_msg = "";
  let name = obj.name.substring(0, obj.name.indexOf("."));
  await mathjax
    .init({
      loader: { load: ["input/tex", "output/svg"] },
    })
    .then(async (MathJax) => {
      const svg = MathJax.tex2svg(obj.str, { display: true });
      let str = MathJax.startup.adaptor
        .outerHTML(svg)
        .replace(/<mjx-container class="MathJax" jax="SVG" display="true">/, "")
        .replace(/<\/mjx-container>/, "");

      if (obj.type === "png") name += ".png";
      else if (obj.type === "jpeg") name += ".jpeg";
      else if (obj.type === "webp") name += ".webp";
      else name += ".svg";

      if (obj.type === "svg") fs.writeFileSync(name, str);
      else {
        let input = Buffer.from(str);
        const metadata = await sharp(input)
          .metadata()
          .catch((err) => {
            error_msg = "sharp error 0\n" + err;
          });
        let { data, info } = await sharp({
          create: {
            width: metadata.width,
            height: metadata.height,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 },
          },
        })
          .composite([{ input: input, blend: option(obj.option) }])
          .toFormat(obj.type)
          .toBuffer({ resolveWithObject: true })
          .catch((err) => {
            error_msg = "sharp error 1\n" + err;
          });
        fs.writeFileSync(name, data);
      }
    })
    .catch((err) => {
      error_msg = "TeX error\n" + err;
    });

  parentPort.postMessage({ msg: error_msg, name: name });
}

parentPort.on("message", async (obj) => {
  make_file(obj);
});
