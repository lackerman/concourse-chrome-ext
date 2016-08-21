/*
 * Lifecycle event: When the popup page is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get((data) => {
    if (data && data.url && data.pipelines) {
      // Populate the Options fields from local storage
      document.getElementById('serverUrl').value = data.url;
      buildPipelineSelectors(data.pipelines, false);
      document.getElementById('results').style.display = 'block';
    }
  });

  // Add event for when the user clicks the 'Query Server' button
  document
    .getElementById('queryServer')
    .addEventListener('click', () => {
      clearError();
      const url = document.getElementById('serverUrl').value;
      requestGet(url, getAuthorisation(), contentHandler);
    });

  // Add event for when the user saves their pipeline selection
  document
    .getElementById('saveSelection')
    .addEventListener('click', saveSelection);
});

function contentHandler(statusCode, data) {
  if (statusCode === 200) {
    const pipelines = JSON.parse(data);
    pipelines.sort((a, b) => a.name.localeCompare(b.name));
    buildPipelineSelectors(pipelines, false);
    document.getElementById('results').style.display = 'block';
  } else {
    displayError(`[Status Code: ${statusCode}] Failed to retrieve data for specified endpoint. ${data}`);
  }
}

function getSelectedPipelines() {
  const pipelines = [];
  const inputs = document.getElementsByTagName('input');
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    if (input.type == 'checkbox') {
      pipelines.push({ name: input.value, selected: input.checked });
    }
  }
  return pipelines;
}

function saveSelection() {
  chrome.storage.local.set({
    url: document.getElementById('serverUrl').value,
    authorisation: getAuthorisation(),
    queryInterval: document.getElementById('queryInterval').value,
    pipelines: getSelectedPipelines()
  }, () => {});
}

function getAuthorisation() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  return (username || password) ? `Basic ${btoa(`${username}:${password}`)}` : undefined;
}
