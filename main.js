import { createReadStream, createWriteStream } from "fs";
import pkg from "csv-parser";
import phone from "google-libphonenumber";
const { PhoneNumberUtil, PhoneNumberFormat } = phone;
const phoneUtil = PhoneNumberUtil.getInstance();
const PNF = PhoneNumberFormat;

function inputFiles() {
  const headers = [];
  const infos = [];
  const outputJson = [];

  createReadStream("./input.csv", { encoding: "utf-8" }) // lendo os "chunks" de dados
    .pipe(pkg()) // os chunks serão formatados ao passarem pelo pipe

    .on("data", (chunk) => {
      const header = [...Object.keys(chunk)].toString().split(",");
      const files = [...Object.values(chunk)].toString().split("\r\n");

      headers.push(...header);
      infos.push(...files);
      headers.splice(11, Number.MAX_VALUE);
    })

    .on("end", () => {
      for (let i of infos) {
        const splitFile = i.split(",");
        const emailHeader = headers[2].split(" ")[0];
        const pedagogicalPhone = splitFile[5];
        const phoneHeader = headers[3].split(" ")[0];
        const studentTags = headers[3].split(" ").slice(1);
        const pedagogicalTags = headers[5].split(" ").slice(1);
        const studentPhone = splitFile[3];
        const financialTags = headers[6].split(" ").slice(1);

        try {
          const number = phoneUtil.parseAndKeepRawInput(studentPhone, "BR");
          outputJson.push({
            fullname: splitFile[0],
            eid: splitFile[1],
            groups: splitFile[8].split("/, \r"[0]),
            addresses: [
              {
                type: emailHeader,
                tags: studentTags,
                address: splitFile[2],
              },
              {
                type: phoneHeader,
                tags: studentTags,
                address: phoneUtil.format(number, PNF.NATIONAL),
              },
              {
                type: emailHeader,
                tags: pedagogicalTags,
                address: splitFile[4],
              },
              {
                type: phoneHeader,
                tags: pedagogicalTags,
                address: pedagogicalPhone,
              },
              {
                type: emailHeader,
                tags: financialTags,
                address: splitFile[6],
              },
              {
                type: phoneHeader,
                tags: financialTags,
                address: splitFile[7],
              },
            ],
          });
        } catch {}
      }
    })

    .on("close", () => {
      const writer = createWriteStream("./output.json", {
        encoding: "utf-8",
      });
      writer.write(JSON.stringify(outputJson));
      console.log("CSV SUCCESSFULLY EXPORTED");
    });
}

inputFiles();
