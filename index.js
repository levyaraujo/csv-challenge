import { readFile, writeFile, } from 'fs/promises' // importando o módulo filesystem

async function csvFormatter() {
  const readingFile = (await readFile("./input.csv")).toString();
  const splitFile = readingFile.split("\r\n");
  let informationList = [];
  let [header, ...files] = splitFile;
  header = header.split(",") // separando a string header por virgula
  Array(header); // convertendo string header para um array



  { // Main algorithm
    header = formattedHeader();
    for (let i of files) {
      let splitFile = i.split(",")
      informationList.push({
        fullname: splitFile[0],
        id: splitFile[1],
        groups: [
          splitFile[8].split("/ ,"[0])
        ],
        addresses: [
          {
            type: header[2].split(" ")[0],
            tags: [
              header[2].split(" ")[1]
            ],
            address: splitFile[2]
          },
          {
            type: header[4].split(" ")[0],
            tags: [
              header[4].split(" "[0])[1], header[4].split(" "[0])[2]
            ],
            address: splitFile[4]
          }
        ]
      })
    }
  }
  await writeFile("./output.json", JSON.stringify(informationList));
  console.table(informationList);

  // função para remover caracteres indesejados dos headers
  function formattedHeader() {
    for (let i = 0; i < header.length; i++) {
      if (header[i].split(" ").length > 1) {
        if (header[i].includes("\"")) {
          const newHeader = (header[i], header[i].replace(/[\\"]/g, ""));
          header[i] = newHeader
        }
      }
    }
    return header;
  }
}

csvFormatter();