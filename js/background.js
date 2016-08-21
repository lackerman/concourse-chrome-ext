const DEFAULT_QUERY_INTERVAL = 30000; // milliseconds

/**
 * Background page startup
 */
(function() {
  console.log('Starting Concourse Job Status Listener');

  let handle = null;
  const resetTimer = (newInterval) => {
    clearInterval(handle); // Stop the timer so that a new interval can be set
    handle = setInterval(processPipelines, newInterval);
  }
  handle = setInterval(processPipelines, DEFAULT_QUERY_INTERVAL);

  // Lifecycle method for when the App is closed down
  chrome.runtime.onSuspend.addListener(() => {
    console.log('Cleaning up Concourse Listener');
  });
  // Reset the timer when the user clicks save
  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (key in changes) {
      if (key === 'queryInterval' && changes[key].newValue) {
        resetTimer(+changes[key].newValue * 1000);
      }
    }
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
