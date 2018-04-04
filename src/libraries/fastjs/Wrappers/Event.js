let Event = (() => {
  function emit({ name, data, text }) {
    var customEvent = new CustomEvent(name, {
      'detail': {
        'data': data,
        'text': text
      }
    })
    window.dispatchEvent(customEvent)
  }
  function listen({ name, callback }) {
    window.addEventListener(name, callback)
  }
  return Object.freeze({
    emit,
    listen
  });
})()
export default Event
