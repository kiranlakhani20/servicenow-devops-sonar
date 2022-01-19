const core = require('@actions/core');
const axios = require('axios');


(async function main() {
    const instanceName = core.getInput('instance-name', { required: true });
    const toolId = core.getInput('tool-id', { required: true });
    const username = core.getInput('devops-integration-user-name', { required: true });
    const pass = core.getInput('devops-integration-user-pass', { required: true });
    const projectKey = core.getInput('sonar-project-key', { required: true });
    const orgKey = core.getInput('sonar-org-key', { required: false });
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
        core.setFailed(`Exception parsing github context ${e}`);
    }

    const endpoint = `https://${username}:${pass}@${instanceName}.service-now.com/api/sn_devops/v1/devops/tool/orchestration?toolId=${toolId}`;

    let payload;
    
    try {
        payload = {
            toolId: toolId,
            buildNumber: githubContext.run_number,
            job: `${githubContext.job}`,
            workflow: `${githubContext.workflow}`,
            projectKey: `${projectKey}`,
            orgKey: `${orgKey}`,
            sonarUrl: `${sonarUrl}`,
            repository: `${githubContext.repository}`,
            ref: `${githubContext.ref}`,
            refName: `${githubContext.ref_name}`,
            refType: `${githubContext.ref_type}`
        };
    } catch (e) {
        core.setFailed(`Exception setting the payload ${e}`);
        return;
    }

    if (commits) {
        payload.commits = commits;
    }

    let result;

    try {
        let httpHeaders = { headers: defaultHeaders };
        result = await axios.post(endpoint, JSON.stringify(payload), httpHeaders);
    } catch (e) {
        core.setFailed(`Exception POSTing sonar registration payload to ServiceNow: ${e}\n\n${JSON.stringify(payload)}\n\n${e.toJSON}`);
    }
    
})();