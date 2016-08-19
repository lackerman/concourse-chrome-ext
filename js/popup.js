/*
 * Lifecycle event: When the popup page is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get(function(data) {
    if (data && data.url && data.pipelines) {
      buildPipelineSelectors(data.pipelines);
      document.getElementById('results').style.display = 'block';
    }
  });
});

function buildPipelineSelectors(pipelines) {
  var container = document.getElementById('pipelines');
  // First clear out previous nodes
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  for (var i = 0; i < pipelines.length; i++) {
    if (pipelines[i].selected) {
      container.appendChild(createPipelineSelector(pipelines[i]));
    }
  }
}
