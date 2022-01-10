const core = require('@actions/core');
const axios = require('axios');


(async function main() {
    const instance = core.getInput('instance-name', { required: true });
    const orchToolId = core.getInput('tool-id', { required: true });
    const username = core.getInput('devops-integration-user-name', { required: true });
    const pass = core.getInput('devops-integration-user-pass', { required: true });
    const projectKey = core.getInput('sonar-project-key', { required: true });
    const sonarUrl = core.getInput('sonar-host-url', { required: true });
    let commits;

    const defaultHeaders = {
        'Content-Type': 'application/json'
    };

    if (!!core.getInput('commits')) {
        try {
            commits = JSON.parse(core.getInput('commits'));
        } catch (e) {
            core.setFailed(`Failed parsing commits string value ${e}`);
        }
    }

    let githubContext = core.getInput('context-github', { required: true });

    try {
        githubContext = JSON.parse(githubContext);
    } catch (e) {
        core.setFailed(`exception parsing github context ${e}`);
    }

    const endpoint = `https://${username}:${pass}@${instance}.service-now.com/api/sn_devops/v1/devops/tool/orchestration?toolId=${toolId}`;

    let eventPayload;
    
    try {
        eventPayload = {
            orchToolId: orchToolId,
            buildNumber: githubContext.run_number,
            job: `${githubContext.job}`,
            workflow: `${githubContext.workflow}`,
            projectKey: `${projectKey}`,
            sonarUrl: `${sonarUrl}`,
            repository: `${githubContext.repository}`,
            ref: `${githubContext.ref}`,
            refName: `${githubContext.ref_name}`,
            refType: `${githubContext.ref_type}`
        };
    } catch (e) {
        core.setFailed(`exception setting event payload ${e}`);
        return;
    }

    if (commits) {
        eventPayload.commits = commits;
    }

    let result;

    try {
        let httpHeaders = { headers: defaultHeaders };
        result = await axios.post(endpoint, JSON.stringify(eventPayload), httpHeaders);
    } catch (e) {
        core.setFailed(`exception POSTing event payload to ServiceNow: ${e}\n\n${JSON.stringify(eventPayload)}\n\n${e.toJSON}`);
    }
})();