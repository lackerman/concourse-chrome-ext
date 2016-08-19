/*
 * Note that any URL fetched here must be matched by a permission in
 * the manifest.json file!
 */
function requestGet(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  // xhr.setRequestHeader('Authorization', AUTHORIZATION);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      callback(xhr.status, xhr.responseText);
    }
  }
  xhr.send();
}
