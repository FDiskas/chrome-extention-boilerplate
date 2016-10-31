import _ from 'lodash';

class myPlugin {
    constructor() {
        // Išpjaunam pranešimą su plugino pavadinimu. Žinosim kad mūsų pluginas veikia
        alert(chrome.runtime.getManifest().name);
        console.log(_.VERSION);
    }
}

export default new myPlugin();