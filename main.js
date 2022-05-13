import { createReadStream, createWriteStream } from "fs";
import pkg from "csv-parser";
let headers = [];
let infos = [];

function inputFiles() {
  // função principal que irá receber a stream de dados do arquivo
  createReadStream("./input.csv", { encoding: "utf-8" }) // lendo os "chunks" de dados
    .pipe(pkg({ separator: ",", quote: '"' }))
    .on("data", (chunk) => {
      // os chunks serão formatados depois de passarem pelo pipe
      {
        let header = [...Object.keys(chunk)].toString();
        let files = [...Object.values(chunk)].toString();
        header = header.split(",");
        files = files.split("\r\n");

        headers.push(...header);
        infos.push(...files);
        headers.splice(11, Number.MAX_VALUE);
      }
    })
    .on("end", () => {
      let outputJson = [];
      for (let i of infos) {
        let splitFile = i.split(",");
        outputJson.push({
          fullname: splitFile[0],
          eid: splitFile[1],
          groups: splitFile[8].split("/,\r"[0]),
          addresses: [
            {
              type: headers[2].split(" ")[0],
              tags: headers[2].split(" ").slice(1),
              address: splitFile[2],
            },
          ],
        });
      }

      const writer = createWriteStream("./test.json", {
        encoding: "utf-8",
        flags: "w",
      });
      writer.write(JSON.stringify(outputJson));
    });
}

inputFiles();
