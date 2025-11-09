import axios from 'axios';

const BASE_URL = 'http://localhost:3030/api/bug';

export const bugService = {
  query,
  getById,
  remove,
  save,
  getDefaultFilter
};

function query(filterBy = {}) {
  return axios.get(BASE_URL, { params: filterBy })
    .then(res => res.data)
    .catch(err => {
      console.error('Error loading bugs:', err);
      throw err;
    });
}

function getById(id) {
  return axios.get(`${BASE_URL}/${id}`)
    .then(res => res.data)
    .catch(err => {
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
  return { txt: '', minSeverity: 0 };
}
