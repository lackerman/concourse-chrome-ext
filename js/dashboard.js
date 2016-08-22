/*
 * Lifecycle event: When the dashboard page is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get((data) => {
    const pipelines = getSavedPipelines(data);
    if (pipelines) {
      buildPipelineSelectors(data.pipelines.filter(p => p.selected), true);
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
