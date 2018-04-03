import baseModel from './baseModelFactory'

let Role = (args) => {
  var baseModel = args.baseModel;
  /**
   * [getOwnName description]
   * @return {[type]} [description]
   */
  /* eslint-disable no-unused-vars */
  function getOwnName() {
    return 'Role'
  }

  function getFormPath() {
    return undefined
  }

  async function getJsonRoles() {
    var roles = require('modules/Formio/api/roles.json');
    return roles
  }

  return Object.freeze(Object.assign({}, baseModel, {
    getOwnName,
    getFormPath,
    getJsonRoles
  }));
}
Role = Role({
  baseModel: baseModel()
});
export default Role
