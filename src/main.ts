import Range = GoogleAppsScript.Spreadsheet.Range;
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;

type Content = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const main = () => {
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getRange(3, 2, 4);
  const total = pipe(range, arrayFromRange, sum);
  Logger.log(`total: ${total}`);

  const { id, userId, title, body } = getContentById(1);
  sheet.getRange("A105:B109").setValues([
    ["id", id],
    ["userId", userId],
    ["title", title],
    ["body", body],
    ["total", total],
  ]);
};

const getContentById = (id: number): Content => {
  const contentAsString = UrlFetchApp.fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: "get",
  }).getContentText();
  return JsonConverter.toJson(contentAsString);
};

const arrayFromRange = (range: Range) => {
  return range.getValues().flat() as number[];
};

function pipe<T, U>(source: T, effect1: (v: T) => U): U;
function pipe<T, U, V>(source: T, effect1: (v: T) => U, effect2: (v: U) => V): V;
function pipe<T, U, V, W>(source: T, effect1: (v: T) => U, effect2: (v: U) => V, effect3: (v: V) => W): W;

function pipe<T, U, V, W>(source: T, effect1: (v: T) => U, effect2?: (v: U) => V, effect3?: (v: V) => W) {
  if (effect3 && effect2) {
    return effect3(effect2(effect1(source)));
  }

  if (effect2) {
    return effect2(effect1(source));
  }

  return effect1(source);
}

const sum = (numbers: number[]): number => numbers.reduce((acc, current) => acc + current, 0);

const JsonConverter = {
  toJson<T>(rawContent: string): T {
    return JSON.parse(rawContent);
  },
};
