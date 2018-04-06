import Local from './baseModel/local'
import Remote from './baseModel/remote'
const baseModel = () => {
  /* eslint-disable no-unused-vars */
  let getFrom = 'remote-local'
  /**
   * [getOwnName description]
   * @return {[type]} [description]
   */
  function getOwnName() {
    return 'baseModel'
  }

  function getFormPath() {
    return undefined
  }
  /**
   * [remote description]
   * @return {[type]} [description]
   */
  function remote() {
    getFrom = 'remote'
    return this
  }
  /**
   * [local description]
   * @return {[type]} [description]
   */
  function local() {
    getFrom = 'local'
    return this
  }

  function merged() {
    getFrom = 'remote-local'
    return this
  }
  /**
   * [find description]
   * @param  {[type]} filter [description]
   * @return {[type]}        [description]
   */
  async function find({ filter, limit = 30, select, pagination, form } = {}) {
    switch (getFrom) {
      case 'local':
        return Local.find({ modelName: this.getOwnName(), filter, limit, select, pagination })
        break;
      case 'remote':
        if (this.getFormPath() === 'custom') {
          return this.rFind({ formPath: this.getFormPath(), filter, limit, select, pagination, form })
        }
        return Remote.find({ formPath: form || this.getFormPath(), filter, limit, select, pagination })
        break;
      case 'remote-local':
        let local = await Local.find({ modelName: this.getOwnName(), filter, limit, select, pagination })
        let remote
        if (this.getFormPath() === 'custom') {
          remote = await this.rFind({ formPath: this.getFormPath(), filter, limit, select, pagination, form })
        } else {
          remote = await Remote.find({ formPath: form || this.getFormPath(), filter, limit, select, pagination })
        }
        return remote.concat(local)
        break;
    }
  }
  /**
   * [findOne description]
   * @param  {[type]} filter [description]
   * @return {[type]}        [description]
   */
  async function findOne(filter) {
    switch (getFrom) {
      case 'local':
        return Local.findOne({ modelName: this.getOwnName(), filter: filter })
        break;
      case 'remote':
        return
        break;
      case 'remote-local':
        return
        break;
    }
  }
  /**
   * [remove description]
   * @param  {[type]} document [description]
   * @return {[type]}          [description]
   */
  async function remove(document) {
    switch (getFrom) {
      case 'local':
        return Local.remove({ modelName: this.getOwnName(), document: document })
        break;
      case 'remote':
        return
        break;
      case 'remote-local':
        return
        break;
    }
  }
  /**
   * [insert description]
   * @param  {[type]} element [description]
   * @return {[type]}         [description]
   */
  async function insert(element) {
    switch (getFrom) {
      case 'local':
        return Local.insert({ modelName: this.getOwnName(), element: element })
        break;
      case 'remote':
        return
        break;
      case 'remote-local':
        return
        break;
    }
  }
  /**
   * [update description]
   * @param  {[type]} document [description]
   * @return {[type]}          [description]
   */
  async function update(document) {
    switch (getFrom) {
      case 'local':
        return Local.update({ modelName: this.getOwnName(), document: document })
        break;
      case 'remote':
        return
        break;
      case 'remote-local':
        return
        break;
    }
  }

  async function updateOrCreate(document) {
    switch (getFrom) {
      case 'local':
        return Local.updateOrCreate({ modelName: this.getOwnName(), document: document })
        break;
      case 'remote':
        return
        break;
      case 'remote-local':
        return
        break;
    }
  }

  async function findAndRemove(filter) {
    switch (getFrom) {
      case 'local':
        return Local.findAndRemove({ modelName: this.getOwnName(), filter: filter })
        break;
      case 'remote':
        return
        break;
      case 'remote-local':
        return
        break;
    }
  }

  return Object.freeze({
    getOwnName,
    remote,
    local,
    merged,
    find,
    findOne,
    remove,
    insert,
    update,
    updateOrCreate,
    findAndRemove
  });
}
export default baseModel
