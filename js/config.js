const BASE_URL = "/GEBTI-SEM05/";

function api(path) {
  return fetch(BASE_URL + path);
}