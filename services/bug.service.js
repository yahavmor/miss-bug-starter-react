import { utilService } from '../public/services/util.service.js';

export const bugService = {
  query,
  getById,
  remove,
  save,
  getDefaultFilter
};

const bugs = utilService.readJsonFile('bug.json');

function query(filterBy = {}) {
  let filteredBugs = bugs;

  if (filterBy.txt) {
    const regex = new RegExp(filterBy.txt, 'i');
    filteredBugs = filteredBugs.filter(bug => regex.test(bug.title));
  }

  if (filterBy.minSeverity) {
    filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.minSeverity);
  }

  return Promise.resolve(filteredBugs);
}

function getById(id) {
  const bug = bugs.find(b => b._id === id);
  return Promise.resolve(bug);
}

function remove(id) {
  const bugIdx = bugs.findIndex(b => b._id === id);
  if (bugIdx === -1) return Promise.reject('Bug not found');

  const removedBug = bugs.splice(bugIdx, 1)[0];
  utilService.writeJsonFile('bug.json', bugs);
  return Promise.resolve(removedBug);
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

  utilService.writeJsonFile('bug.json', bugs);
  return Promise.resolve(bug);
}


function getDefaultFilter() {
  return { txt: '', minSeverity: 0 };
}
