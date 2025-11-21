import axios from 'axios';

const BASE_URL = '/api/user/'

export const userService = {
query,
getById,
getEmptyCredentials,
getUserBugs,
remove
}

function query() {
return axios.get(BASE_URL)
.then(res => res.data)
}

function getUserBugs(userId) {
  return axios.get(`${BASE_URL}${userId}/bugs`)
  .then(res => res.data)
}

function remove(id) {
  return axios.delete(`${BASE_URL}${id}`)
    .then(res => res.data)
    .catch(err => {
      console.error(`Error removing bug ${id}:`, err);
      throw err;
    });
}

function getById(userId) {

  return axios.get(BASE_URL + userId)
  .then(res => res.data)
}


function getEmptyCredentials() {
return {
username: '',
password: '',
fullname: ''
}
}