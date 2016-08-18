document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.local.get(function (data) {
    if (data && data.url && data.selection) {
      document.getElementById('serverUrl').value = data.url;
      buildPipelineSelectors(data.selection);
      document.getElementById('results').style.display = 'block';
    }
  });

  document
    .getElementById('queryServer')
    .addEventListener('click', function () {
      clearError();
      var url = document.getElementById('serverUrl').value; // http://localhost:9080/data.json
      processConcourseUrl(url);
    });

  document
    .getElementById('saveSelection')
    .addEventListener('click', function () {
      saveSelection();
    });
});

function processConcourseUrl(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      contentHandler(xhr.status, xhr.responseText);
    }
  };
  xhr.send();
}

function contentHandler(statusCode, data) {
  if (statusCode === 200) {
    var pipelines = JSON.parse(data);
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
    selection: []
  };
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].type == 'checkbox') {
      toSave.selection.push({ name: inputs[i].value, checked: inputs[i].checked });
    }
  }
  chrome.storage.local.set(toSave, function () {
    console.log('Saved Pipeline Selection');
    console.log(toSave);
  });
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
  checkbox.checked = pipeline.checked;

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
