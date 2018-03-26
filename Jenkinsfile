node {
    def app

    stage('Clone repository') {
        /* Let's make sure we have the repository cloned to our workspace */

        checkout scm
    }

    stage('Build awx images') {
        ansiblePlaybook([
            colorized: true,
            inventory: 'installer/inventory',
            playbook: 'installer/build.yml',
             extras: "--extra-vars 'docker_registry_password=q2VtgNSsp5J74ypP'"
        ])
    }
}
