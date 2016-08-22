function createEmptyPopup() {
  const heading = document.getElementById('heading');
  heading.innerText = 'No Pipelines';
  const pipelines = document.getElementById('pipelines');
  pipelines.innerHTML = 'No pipelines configured. Go to the <a target="_blank" href="options.html">Options</a> page to select your pipelines.';
}

function buildPipelineSelectors(pipelines, disabled) {
  const container = document.getElementById('pipelines');
  // First clear out previous nodes
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  pipelines.forEach(p => {
    container.appendChild(createPipelineSelector(p, disabled))
  });
}

function createPipelineSelector(pipeline, disabled) {
  const container = document.createElement('div');
  container.className = 'pipeline';
  createCheckbox(container, pipeline, disabled);
  return container;
}

function createCheckbox(container, pipeline, disabled) {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.name = pipeline.name;
  checkbox.value = pipeline.name;
  checkbox.id = pipeline.name;
  checkbox.className = 'filled-in';
  checkbox.checked = (pipeline.checked || pipeline.selected);
  if (disabled) checkbox.disabled = 'disabled';

  const label = document.createElement('label')
  label.htmlFor = pipeline.name;
  label.appendChild(document.createTextNode(pipeline.name));

  container.appendChild(checkbox);
  container.appendChild(label);
}

function displayError(errorMessage) {
  const errorBox = document.getElementById('error');
  errorBox.style.display = 'block';
  errorBox.innerHTML = errorMessage || 'There was a problem with the request.';
}

function clearError() {
  const errorBox = document.getElementById('error');
  errorBox.style.display = 'none';
  errorBox.innerHTML = '';
}
