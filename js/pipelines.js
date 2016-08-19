/**
 * Iterates through the list of pipelines and reports which 'failed'
 *
 * .../api/v1/pipelines
 * .../api/v1/pipelines/<pipeline>/jobs
 */
function querySelectedPipelineJobs(url, pipelines) {
  pipelines.forEach(pipeline => {
    if (pipeline.selected) {
      requestGet(`${url}/${pipeline.name}/jobs`, (statusCode, data) => {
        if (statusCode == 200) {
          sendNotification(url, pipeline, parseJobs(pipeline, data));
        } else {
          console.error('Failed to retrieve the Job data for', pipeline.name, '. Status Code:', statusCode);
        }
      });
    }
  });
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function parseJobs(pipeline, data) {
  const jobs = JSON.parse(data);
  const statuses = jobs.map(job => {
    if (job.paused) {
      return 'paused';
    }
    return job.finished_build && job.finished_build.status;
  });
  const hasSuccess = statuses.indexOf('succeeded') >= 0;
  const firstNonSuccess = statuses.filter(x => x && x !== 'succeeded')[0];
  const status = firstNonSuccess || (hasSuccess ? 'succeeded' : 'none');

  return {
    status: status
  };
}

function sendNotification(url, pipeline, jobs) {
  const urlParser = document.createElement('a');
  urlParser.href = url;
  if (jobs.status && jobs.status == 'failed') {
    launchNotification({
      title: pipeline.name,
      message: 'Job failed to complete. ',
      url: `${urlParser.protocol}//${urlParser.host}/pipelines/${pipeline.name}`
    });
  }
}
