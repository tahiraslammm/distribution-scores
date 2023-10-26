import fs from 'fs';
import path from 'path';

function readCSV(fileName) {
  const __dirname = path.dirname(fileName);
  const filePath = path.resolve(__dirname, fileName);
  return fs.readFileSync(filePath, 'utf8').split('\n');
}

function convertToJSON(csvArray) {
  return csvArray.map((element) => {
    const [index, id, score, author] = element.split(',');
    return { index, id, score, author };
  });
}

function removeCSVHeaders(allJSONs) {
  return allJSONs.filter((json) => json.author !== 'author');
}

function listOfUniqueAuthors(allJSONs) {
  return [...new Set(allJSONs.map((json) => json.author))].filter(Boolean);
}

function findTotalScore(userScores, author) {
  return userScores
    .filter((element) => element.author === author)
    .reduce((total, current) => total + parseInt(current.score), 0);
}

function getUserScores(type, userScores, listOfAuthors) {
  return listOfAuthors.map((author) => ({
    user: author,
    [`${type}Score`]: findTotalScore(userScores, author),
  }));
}

function scores(type) {
  const allJSONs = [];
  for (let i = 1; i <= 23; i++) {
    const JSONs = convertToJSON(readCSV(`${type}_202310${i}`));
    allJSONs.push(...JSONs);
  }

  const cleanedJSONs = removeCSVHeaders(allJSONs);
  const listOfAuthors = listOfUniqueAuthors(cleanedJSONs);
  const scores = getUserScores(type, cleanedJSONs, listOfAuthors);
  console.log(scores);
}

// Call the function with the desired type ('posts', 'comments', or 'daily')
scores('daily');
