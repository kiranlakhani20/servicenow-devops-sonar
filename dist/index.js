/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 302:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 342:
/***/ ((module) => {

module.exports = eval("require")("axios");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(302);
const axios = __nccwpck_require__(342);


(async function main() {
    const nameOfInstance = core.getInput('instance-name', { required: true });
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

    const endpoint = `https://${username}:${pass}@${instanceName}.service-now.com/api/sn_devops/v1/devops/tool/orchestration?toolId=${toolId}`;

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
})();

module.exports = __webpack_exports__;
/******/ })()
;