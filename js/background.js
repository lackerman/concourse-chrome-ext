var QUERY_INTERVAL = 60000; // milliseconds

/**
 * Background page startup
 */
(function() {
  console.log('Starting Concourse Job Status Listener');
  processPipelines();
  setInterval(() => {
    processPipelines();
  }, QUERY_INTERVAL);

  // Lifecycle method for when the App is closed down
  chrome.runtime.onSuspend.addListener(() => {
    console.log('Cleaning up Concourse Listener');
  });
})();

function processPipelines() {
  // Retrieve the save information from local storage
  chrome.storage.local.get((data) => {
    // Only attempt to query if there is actually saved information
    if (data && data.url && data.pipelines) {
      querySelectedPipelineJobs(data.url, data.authorisation, data.pipelines);
    }
  });
}
