const Lenguage = class {
  /**
   * [listen description]
   * @param  {[type]} vm [description]
   * @return {[type]}    [description]
   */
  static listen(vm) {
    vm.$eventHub.$on('FAST:LANGUAGE:CHANGED', (lenguage) => {
      vm.formIO.language = lenguage.code;
      vm.renderForm();
    });
  }

  /**
   * [off description]
   * @param  {[type]} vm [description]
   * @return {[type]}    [description]
   */
  static off(vm) {
    vm.$eventHub.$off('FAST:LANGUAGE:CHANGED', vm.renderForm);
  }
};
export default Lenguage;
