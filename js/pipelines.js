/**
 * Iterates through the list of pipelines and reports which 'failed'
 *
 * .../api/v1/pipelines
 * .../api/v1/pipelines/<pipeline>/jobs
 */
function querySelectedPipelineJobs(url, authorisation, pipelines, callback) {
  pipelines
    .forEach(p => {
      if (p.selected) {
        requestGet(`${url}/${p.name}/jobs`, authorisation, (statusCode, data) => {
          if (statusCode == 200) {
            callback(parsePipelineJobs(url, p, data));
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

function getActiveStatus(jobs) {
  const activeList = jobs
    .map(job => job.next_build && job.next_build.status)
    .filter(x => x)
    .filter(onlyUnique)
    .sort((a, b) => activeOrder.indexOf(a) < activeOrder.indexOf(b));
  if (activeList.length) {
    return activeList[0];
  }
  return null;
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
  const status = firstNonSuccess || (hasSuccess ? 'succeeded' : 'never-built');

  const activeOrder = ['pending', 'started'];
  const activeStatus = getActiveStatus(jobs);
  const activeJobs = jobs.filter(job => job.next_build && job.next_build.status);

  const urlParser = document.createElement('a');
  urlParser.href = url;

  return Object.assign(pipeline, {
    url: `${urlParser.protocol}//${urlParser.host}/pipelines/${pipeline.name}`,
    status: status,
    activeJobs,
    activeStatus
  });
}
