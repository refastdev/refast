import { utils } from '@refastdev/i18n';
import fs from 'fs';
import path from 'path';

export type Options = {
  sourcePath: string;
  outputPath?: string;
};

export type ResultData = {
  key: string;
  message: string;
};

const regex = /(?:i18n\s*\.\s*(t|tk))\s*\(\s*(['"])(.*?)\2\s*(?:,\s*([^]*?(?=\)|$)))?\s*\)/g;
const regex2 = /(['"])((?:(?!\1)[\s\S])*?)\1(?=[,\r\n]*$)/g;

function processFile(filePath: string): ResultData[] {
  // utils.generateTextId()
  const messages: ResultData[] = [];
  console.log('processing file: ', filePath);
  const content = fs.readFileSync(filePath, 'utf-8').toString();

  const matches: (string | undefined)[][] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    const methodName = match[1];
    const firstParam = match[3];
    const otherParam = match[4];
    let threeParam: string | undefined = undefined;
    if (otherParam) {
      const match2 = otherParam.trim().match(regex2);
      if (match2) {
        threeParam = match2.pop()?.replace(/['"]/g, '');
      }
    }
    matches.push([methodName, firstParam, threeParam]);
  }
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    if (match === undefined) continue;
    const type = match[0];
    if (type === undefined) continue;
    if (type === 't') {
      const defaultValue = match[1];
      const customKey = match[2];
      if (defaultValue !== undefined && defaultValue !== '') {
        if (customKey !== undefined && customKey !== '') {
          messages.push({
            key: customKey,
            message: defaultValue,
          });
        } else {
          const key = utils.generateTextId(defaultValue);
          messages.push({
            key,
            message: defaultValue,
          });
        }
      }
    } else if (match[0] === 'tk') {
      const defaultValue = match[2];
      const customKey = match[1];
      if (
        customKey !== undefined &&
        customKey !== '' &&
        defaultValue !== undefined &&
        defaultValue !== ''
      ) {
        messages.push({
          key: customKey,
          message: defaultValue,
        });
      }
    }
  }
  return messages;
}

function scanFiles(
  dirPath: string,
  extensions: string[],
  isIgnore?: (file: string) => boolean,
): ResultData[] {
  const files = fs.readdirSync(dirPath);
  let messages: ResultData[] = [];
  for (let i = 0, len = files.length; i < len; i += 1) {
    const file = files[i];
    if (file === undefined) continue;
    if (isIgnore === undefined || !isIgnore(file)) {
      const filePath = path.join(dirPath, file);
      const fileExtName = path.extname(filePath);
      const fileStat = fs.lstatSync(filePath);
      if (fileStat.isDirectory()) {
        messages = messages.concat(scanFiles(filePath, extensions, isIgnore));
      } else if (extensions.includes(fileExtName)) {
        messages = messages.concat(processFile(filePath));
      }
    }
  }
  return messages;
}

function mergeMessage(messages: ResultData[]) {
  const data: any = {};
  const conflict: any = {};
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    if (!message) continue;
    if (data[message.key] && data[message.key] !== message.message) {
      if (!conflict[data[message.key]] || !conflict[message.message]) {
        conflict[message.message] = true;
        conflict[data[message.key]] = true;
        console.warn(
          `generate id conflict: "${data[message.key]}", "${message.message}", id: ${message.key}`,
        );
      }
    }
    data[message.key] = message.message;
  }
  return data;
}

const main = async ({ sourcePath, outputPath }: Options): Promise<ResultData[]> => {
  sourcePath = path.resolve(sourcePath);
  if (outputPath) outputPath = path.resolve(outputPath);
  console.log(`start extract files: ${sourcePath}`);
  const messages = scanFiles(sourcePath, ['.ts', '.tsx', '.js', '.jsx']);
  if (outputPath) {
    const data = mergeMessage(messages);
    let oldData: any = undefined;
    if (fs.existsSync(outputPath)) {
      try {
        oldData = JSON.parse(fs.readFileSync(outputPath, { encoding: 'utf8' }));
      } catch (e) {
        /* empty */
      }
    }
    const newData: any = {};

    // keep and update oldData
    if (oldData) {
      const oldKeys = Object.keys(oldData);
      for (let i = 0; i < oldKeys.length; i++) {
        const k = oldKeys[i];
        if (k === undefined) continue;
        if (Object.prototype.hasOwnProperty.call(data, k)) {
          newData[k] = data[k];
        } else {
          newData[k] = oldData[k];
        }
      }
    }

    // sort newData
    const keys = Object.keys(data).sort();
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (k === undefined) continue;
      if (!Object.prototype.hasOwnProperty.call(newData, k)) {
        console.log(k);
        newData[k] = data[k];
      }
    }

    fs.writeFileSync(outputPath, `${JSON.stringify(newData, undefined, 2)}\n`);
    console.log(`write file: ${outputPath}`);
  }
  return messages;
};
export default main;
