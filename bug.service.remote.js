import { utilService } from './public/services/util.service.js'


export const bugService ={
      query,
      getById,
      remove,
      save
}

const bugs = utilService.readJsonFile('bug.json')

function query(){
      return Promise.resolve(bugs)
}
function getById(id){
      const bug = bugs.find(b => b._id === id)
      return Promise.resolve(bug)
}
function remove(id){
    const bugIdx = bugs.findIndex(b => b._id === id)
    if (bugIdx === -1) return Promise.resolve(bugs)
    bugs.splice(bugIdx, 1)
    utilService.writeJsonFile('bug.json', bugs) 
    return Promise.resolve(bugs)
}

function save(bug) {
  const idx = bugs.findIndex(b => b.id === bug.id);
  if (idx !== -1) {
    bugs[idx] = bug; // עדכון
  } else {
    bugs.push(bug); // יצירה חדשה
  }
  utilService.writeJsonFile('bug.json', bugs);
  return Promise.resolve(bugs);
}
