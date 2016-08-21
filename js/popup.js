/*
 * Lifecycle event: When the popup page is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get((data) => {
    const pipelines = getSavedPipelines(data);
    if (pipelines) {
      const heading = document.getElementById('heading');
      heading.innerText = 'Selected Pipelines';
      buildPipelineSelectors(data.pipelines.filter(p => p.selected), true);
    } else {
      createEmptyPopup();
    }
  });
});

function getSavedPipelines(data) {
  if (data && data.url && data.pipelines) {
    const pipelines = data.pipelines.filter(p => p.selected);
    return pipelines.length ? pipelines : undefined;
  }
  return undefined;
}
