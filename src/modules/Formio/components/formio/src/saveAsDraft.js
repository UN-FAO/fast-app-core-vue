const SaveAsDraft = class {
  /**
   * [listen description]
   * @param  {[type]} vm [description]
   * @return {[type]}    [description]
   */
  static listen (vm) {
    document.removeEventListener('saveAsDraft', function (e) {}, false)
    document.addEventListener('saveAsDraft', (e) => {
        vm.saveAsDraft(e)
    })
  }
}
export default SaveAsDraft
