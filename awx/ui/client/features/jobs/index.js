import JobsStrings from '~features/jobs/jobs.strings';
import IndexController from '~features/jobs/index.controller';

const indexTemplate = require('~features/jobs/index.view.html');

const MODULE_NAME = 'at.features.jobs';

function JobsRun ($stateExtender, strings) {
    $stateExtender.addState({
        name: 'jobz',
        route: '/jobz',
        ncyBreadcrumb: {
            label: strings.get('state.TITLE')
        },
        data: {
            activityStream: true,
            activityStreamTarget: 'jobs'
        },
        views: {
            '@': {
                templateUrl: indexTemplate,
                controller: IndexController,
                controllerAs: 'vm'
            }
        },
        resolve: {
            resolved: ['JobsModel', Jobs => {
                const jobs = new Jobs();

                return {
                    models: { jobs }
                };
            }]
        }
    });
}

JobsRun.$inject = ['$stateExtender', 'JobsStrings'];

angular
    .module(MODULE_NAME, [])
    .controller('indexController', IndexController)
    .service('JobsStrings', JobsStrings)
    .run(JobsRun);

export default MODULE_NAME;
