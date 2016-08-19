var request = requestGet; // requester.js file

/*
 * Lifecycle event: When the popup page is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get(function(data) {
    if (data && data.url && data.pipelines) {
      document.getElementById('serverUrl').value = data.url;
      buildPipelineSelectors(data.pipelines);
      document.getElementById('results').style.display = 'block';
    }
  });

  // Add event for when the user clicks the 'Query Server' button
  document
    .getElementById('queryServer')
    .addEventListener('click', function() {
      clearError();
      var url = document.getElementById('serverUrl').value;
      request(url, getAuthorisation(), contentHandler);
    });

  // Add event for when the user saves their pipeline selection
  document
    .getElementById('saveSelection')
    .addEventListener('click', function() {
      saveSelection();
    });
});

function contentHandler(statusCode, data) {
  if (statusCode === 200) {
    var pipelines = JSON.parse(data);
    pipelines.sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });
    buildPipelineSelectors(pipelines);
    document.getElementById('results').style.display = 'block';
  } else {
    displayError('[Status Code: ' + statusCode + '] Failed to retrieve data for specified endpoint. ' + data);
  }
}

function buildPipelineSelectors(pipelines) {
  var container = document.getElementById('pipelines');
  // First clear out previous nodes
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  for (var i = 0; i < pipelines.length; i++) {
    container.appendChild(createPipelineSelector(pipelines[i]));
  }
}

function saveSelection() {
  var toSave = {
    url: document.getElementById('serverUrl').value,
    authorisation: getAuthorisation(),
    pipelines: []
  };

  var inputs = document.getElementsByTagName('input');
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].type == 'checkbox') {
      toSave.pipelines.push({
        name: inputs[i].value,
        selected: inputs[i].checked
      });
    }
  }

  chrome.storage.local.set(toSave, function() {});
}

function getAuthorisation() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var authorisation = undefined;
  if (username || password) {
    authorisation = 'Basic ' + btoa(`${username}:${password}`);
  }
  return authorisation;
}
