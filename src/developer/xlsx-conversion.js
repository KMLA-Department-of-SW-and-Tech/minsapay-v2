import { read, utils, writeFile } from "xlsx";

const readXlOfEachSheet = (file) => {
  return new Promise((resolve) => {
    let finalData = {};
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      if (!e.target) return;
      const bufferArray = e.target.result;
      const fileInformation = read(bufferArray, {
        type: "buffer",
        cellText: false,
        cellDates: true,
      });
      for (const sheetName of fileInformation.SheetNames) {
        const rawData = fileInformation.Sheets[sheetName];
        finalData[sheetName] = utils.sheet_to_json(rawData);
      }
      resolve(finalData);
    };
  });
};
const writeXlFromData = (fileName, subData) => {
  return new Promise((resolve) => {
    const wb = utils.book_new();
    for (let key of Object.keys(subData)) {
      let writeData = [];
      for (let user of Object.keys(subData[key])) {
        let tmp = { user_id: user };
        for (let prop of Object.keys(subData[key][user]))
          tmp[prop] = subData[key][user][prop];
        writeData.push(tmp);
      }
      const ws = utils.json_to_sheet(writeData);
      utils.book_append_sheet(wb, ws, key);
    }
    writeFile(wb, fileName);
    resolve();
  });
};

const getLogXl = (logData) => {
  return new Promise((resolve) => {
    const wb = utils.book_new();
    // data is a array
    {
      const ws = utils.json_to_sheet(data);
      utils.book_append_sheet(wb, ws, key);
    }
    writeFile(wb, fileName);
    resolve();
  })
}

export { readXlOfEachSheet, writeXlFromData };
