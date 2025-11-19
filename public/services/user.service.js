const BASE_URL = '/api/user/'

export const userService = {
query,
getById,
getEmptyCredentials,
getUserBugs
}

function query() {
return axios.get(BASE_URL)
.then(res => res.data)
}

function getUserBugs(userId) {
  return axios.get(`/api/user/${userId}/bugs`)
    .then(res => res.data)
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