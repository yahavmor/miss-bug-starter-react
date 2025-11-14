import axios from 'axios';

const BASE_URL = 'http://localhost:3030/api/bug';

export const bugService = {
  query,
  getById,
  remove,
  save,
  getDefaultFilter,
  getBugfromUser
};

function query(filterBy = {}) {
  return axios.get(BASE_URL, { params: filterBy })
    .then(res => res.data)
    .catch(err => {  
      throw err;
    });
}

function getById(id) {
  return axios.get(`${BASE_URL}/${id}`)
    .then(res => res.data)
    .catch(err => {
      if (err.response && err.response.status === 429) {
        alert('You have visited too many bugs. Please wait 7 seconds.');
      }
      console.error(`Error getting bug ${id}:`, err);
      throw err;
    });
}

function remove(id) {
  return axios.delete(`${BASE_URL}/${id}`)
    .then(res => res.data)
    .catch(err => {
      console.error(`Error removing bug ${id}:`, err);
      throw err;
    });
}

function save(bug) {
  if (bug._id) {
    return axios.put(`${BASE_URL}/${bug._id}`, bug)
      .then(res => res.data)
      .catch(err => {
        console.error('Error updating bug:', err);
        throw err;
      });
  } else {    
    return axios.post(BASE_URL, bug)
      .then(res => res.data)
      .catch(err => {
        console.error('Error creating bug:', err);
        throw err;
      });
  }
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0, sortBy: 'severity', sortDir: 'asc' , page:0}
}

function getBugfromUser() {
    const title = prompt('Bug title?', 'Bug ' + Date.now());
    let severity = +prompt('Bug severity? (0 or higher)', 3);
    if (isNaN(severity) || severity < 0) severity = 0;
    const description = prompt('Bug description?', 'Describe the bug here');
    const labels = ['critical', 'need-CR', 'bugfix'];
    const bug = {
        title: title || 'Untitled Bug',
        severity,
        description: description || '',
        labels: labels, 
        createdAt: Date.now()
    };

    return bug;
}
