import Range = GoogleAppsScript.Spreadsheet.Range;

type Content = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const main = () => {
  const content = getContent();
  Logger.log(content.id);
  Logger.log(content.userId);
  Logger.log(content.title);
  Logger.log(content.body);

  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getRange(3, 2, 4);
  const total = pipe(range, arrayFromRange, sum);
  Logger.log(`total: ${total}`);
};

const getContent = (): Content => {
  const contentAsString = UrlFetchApp.fetch("https://jsonplaceholder.typicode.com/posts/1", {
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
