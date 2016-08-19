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
