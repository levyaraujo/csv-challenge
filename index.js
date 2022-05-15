import { createReadStream, createWriteStream } from "fs";
import { parse } from "csv";
import phone from "google-libphonenumber";
const { PhoneNumberUtil, PhoneNumberFormat } = phone;
const phoneUtil = PhoneNumberUtil.getInstance();

function dataProcess() {
  const name = [];
  const id = [];
  const groups = [];
  const output = [];
  const email = [];
  const pedagogical = [];
  let pedagogicalPhone = [];
  const financialEmail = [];
  let financialPhone = [];
  let studentPhone = [];
  const invisible = [];
  const see_all = [];

  createReadStream("./input.csv")
    .pipe(parse({ delimiter: "," }))

    .on("data", (row) => {
      name.push(row[0]);
      id.push(row[1]);
      groups.push(row[8] + row[9]);
      email.push(row[2]);
      pedagogical.push(row[4]);
      pedagogicalPhone.push(row[5]);
      financialEmail.push(row[6]);
      financialPhone.push(row[7]);
      studentPhone.push(row[3]);
      invisible.push(row[10]);
      see_all.push(row[11]);
    })

    .on("end", () => {
      const emailHeader = email[0].split(" ")[0];
      const phoneHeader = pedagogicalPhone[0].split(" ")[0];
      const pedagogicalTag = pedagogical[0].split(" ").slice(1);
      financialPhone = financialPhone.splice(1);

      try {
        for (let i = 1; i < name.length; i++) {
          const studentNumber = phoneUtil.parseAndKeepRawInput(
            studentPhone.slice(1)[i],
            "BR"
          );
          output.push({
            fullname: name[i],
            eid: id[i],
            groups: groups[i],
            addresses: [
              {
                type: emailHeader,
                tags: email[0].split(" ").slice(1),
                address: email[i],
              },
              {
                type: emailHeader,
                tags: pedagogicalTag,
                address: pedagogical[i],
              },
              {
                type: phoneHeader,
                tags: pedagogicalTag,
                address: pedagogicalPhone[i],
              },
              {
                type: emailHeader,
                tags: financialEmail[0].split(" ").slice(1),
                address: financialEmail[i],
              },
              {
                type: phoneHeader,
                tags: financialEmail[0].split(" ").slice(1),
                address: financialPhone[i - 1],
              },
              {
                type: phoneHeader,
                tags: studentPhone[0].split(" ").slice(1),
                address: phoneUtil.format(
                  studentNumber,
                  PhoneNumberFormat.NATIONAL
                ),
              },
            ],
            invisible: invisible[i],
            see_all: see_all.slice(1)[i],
          });
        }
      } catch {}
    })

    .on("close", () => {
      output.splice(0, 1);
      const writer = createWriteStream("./agoravai.json", {
        encoding: "utf-8",
      });
      writer.write(JSON.stringify(output));
    });
}

dataProcess();
