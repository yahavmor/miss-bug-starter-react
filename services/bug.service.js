import { utilService } from '../public/services/util.service.js';
import fs from 'fs'

export const bugService = {
  query,
  getById,
  remove,
  save,
  readJsonFile,
  writeJsonFile,
  getUserBugs
};

const bugs = readJsonFile('bug.json');


function query(filterBy = {}) {
  let filteredBugs = bugs;
  if (filterBy.txt) {
    const regex = new RegExp(filterBy.txt, 'i');
    filteredBugs = filteredBugs.filter(bug => regex.test(bug.title));
  }

  if (filterBy.minSeverity) {
    filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.minSeverity);
  }
  if (filterBy.label) {
      filteredBugs = filteredBugs.filter(bug =>
          bug.labels && bug.labels.includes(filterBy.label)
      )
  }
  if (filterBy.sortBy) {
    const sortDir = filterBy.sortDir === 'desc' ? -1 : 1;
    filteredBugs.sort((a, b) => {
      if (a[filterBy.sortBy] < b[filterBy.sortBy]) return -1 * sortDir;
      if (a[filterBy.sortBy] > b[filterBy.sortBy]) return 1 * sortDir;
      return 0;
  });
  }
  const pageSize = 7;
  const page = filterBy.page ;
  const startIdx = page * pageSize;
  const slicedBugs = filteredBugs.slice(startIdx, startIdx + pageSize);

return Promise.resolve({
slicedBugs,
totalPages: Math.ceil(filteredBugs.length / pageSize)
});
}

function getById(id) {
  const bug = bugs.find(b => b._id === id);
  return Promise.resolve(bug);
}

function remove(id) {
  const bugIdx = bugs.findIndex(b => b._id === id);
  if (bugIdx === -1) return Promise.reject('Bug not found');
  
  const removedBug = bugs.splice(bugIdx, 1)[0];
  writeJsonFile('bug.json', bugs);
  return Promise.resolve(removedBug);
}
function getUserBugs(userId) {
  const bugsOfUser = bugs.filter(bug => bug.creator._id === userId)
  return Promise.resolve(bugsOfUser)
}



function save(bug) {
  if (bug._id) {
    const idx = bugs.findIndex(b => b._id === bug._id);
    if (idx !== -1) {
      bugs[idx] = bug;
    } else {
      return Promise.reject('Bug not found for update');
    }
  } else {
    bug._id = utilService.makeId(); 
    bugs.push(bug);
  }

  writeJsonFile('bug.json', bugs);
  return Promise.resolve(bug);
}

function readJsonFile(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}     

function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
} 


