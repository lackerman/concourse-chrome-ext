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
      request(url, contentHandler);
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

function saveSelection() {
  var inputs = document.getElementsByTagName('input');
  var toSave = {
    url: document.getElementById('serverUrl').value,
    pipelines: []
  };
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

function createPipelineSelector(pipeline) {
  var container = document.createElement('p');
  createCheckbox(container, pipeline);
  return container;
}

function createCheckbox(container, pipeline) {
  var checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.name = pipeline.name;
  checkbox.value = pipeline.name;
  checkbox.id = pipeline.name;
  checkbox.className = 'filled-in';
  checkbox.checked = (pipeline.checked || pipeline.selected);

  var label = document.createElement('label')
  label.htmlFor = pipeline.name;
  label.appendChild(document.createTextNode(pipeline.name));

  container.appendChild(checkbox);
  container.appendChild(label);
}

function displayError(errorMessage) {
  var errorBox = document.getElementById('error');
  errorBox.style.display = 'block';
  errorBox.innerHTML = errorMessage || 'There was a problem with the request.';
}

function clearError() {
  var errorBox = document.getElementById('error');
  errorBox.style.display = 'none';
  errorBox.innerHTML = '';
}
