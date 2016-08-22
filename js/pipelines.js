/**
 * Iterates through the list of pipelines and reports which 'failed'
 *
 * .../api/v1/pipelines
 * .../api/v1/pipelines/<pipeline>/jobs
 */
function querySelectedPipelineJobs(url, authorisation, pipelines) {
  pipelines
    .forEach(p => {
      if (p.selected) {
        requestGet(`${url}/${p.name}/jobs`, authorisation, (statusCode, data) => {
          if (statusCode == 200) {
            sendNotification(parsePipelineJobs(url, p, data));
          } else {
            console.error('Failed to retrieve the Job data for', p.name, '. Status Code:', statusCode);
          }
        });
      }
    });
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function parsePipelineJobs(url, pipeline, data) {
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

  const urlParser = document.createElement('a');
  urlParser.href = url;

  return {
    name: pipeline.name,
    url: `${urlParser.protocol}//${urlParser.host}/pipelines/${pipeline.name}`,
    status: status
  };
}

function sendNotification({ url, name, status }) {
  if (status && status == 'failed') {
    launchNotification({ url, title: name, message: 'Job failed to complete.' });
  }
}
