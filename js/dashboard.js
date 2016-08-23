/*
 * Lifecycle event: When the dashboard page is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get((data) => {
    if (data && data.url && data.pipelines) {
      buildPipelineStatuses(data.url, data.authorisation, data.pipelines);
    }
  });
});

function buildPipelineStatuses(url, authorisation, pipelines) {
  const container = document.getElementById('pipelines');
  pipelines
    .forEach(p => {
      if (p.selected) {
        requestGet(`${url}/${p.name}/jobs`, authorisation, (statusCode, data) => {
          if (statusCode == 200) {
            container.appendChild(createPipelineCard(parsePipelineJobs(url, p, data)));
          } else {
            throw new Error(`Failed to retrieve the Job data for ${p.name}. Status Code ${statusCode}`);
          }
        });
      }
    });
}

function createPipelineCard(pipelineJob) {
  const anchor = document.createElement('a');
  anchor.className = 'col s3';
  anchor.href = pipelineJob.url;

  const card = document.createElement('div');
  card.className = `card ${pipelineJob.status} ${pipelineJob.activeStatus}`;

  const content = document.createElement('div');
  content.className = 'card-content white-text';

  const span = document.createElement('span');
  span.className = 'card-title';
  span.innerText = pipelineJob.name;

  content.appendChild(span);
  card.appendChild(content);
  anchor.appendChild(card);

  return anchor;
}
