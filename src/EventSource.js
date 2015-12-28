
/**
 * EventSource is an api for event generators.
 * @interface
 */
class EventSource {

  /**
   * on registers a callback for a specific event.
   * @param {string} event 
   * @param {function} cb 
   * @returns {EventSource}
   */
  on(event, cb) {
    
  }

  /**
   * once registers a callback for a specific event.
   * It will be removed once it has fired
   * @param {string} event 
   * @param {function} cb 
   *  @return EventSourcee}
   */
  once(event, cb) {
    
  }

/**
 * emit an event
 * @param {string} event 
 * @param {...*} args 
 */
emit(event) {
  
}

}
export default EventSource

