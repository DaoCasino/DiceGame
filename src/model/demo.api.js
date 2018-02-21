/*
 * jsonplaceholder.typicode.com
 * Fake Online REST API for Testing and Prototyping
 */
/* global fetch */

const demoApiUrl = 'https://jsonplaceholder.typicode.com/'

export default new class API {
  constructor () {
    this.api_url = demoApiUrl
  }

  get (methodName = false, params = {}) {
    if (!methodName) return

    let query = Object.keys(params)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
      .join('&')

    return fetch(this.api_url + methodName + '?' + query).then(r => {
      return r.json()
    })
  }
}()
