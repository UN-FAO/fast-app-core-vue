var Promise = require('bluebird')
var rp = require('request-promise')
var _ = require('lodash')
/* Implementing this function
    Fds.getUsers(ctx.req.body)
       .then((users)=>{
               dd(users)
       })
       .catch((error)=>{
               console.log(error)
       })
 */
class Fsd {
  /**
   * Gets user information from email
   * or lastname
   * @param  {Object} params [description]
   * @return {Promise}        [description]
   */
  static getUsers(params) {
    var localQs = {
      active: true,
      informationFetchMode: 'COMPLETE',
      organization: 'FAO',
      maxResults: '10',
      operator: 'AND'
    }
    if (params.lastName != undefined) {
      localQs.lastName = params.lastName
    }
    if (params.email != undefined) {
      localQs.email = params.email
    }


    var options = {
      uri: 'https://ssl.fao.org/fsd/api/people/fao/employees',
      method: 'GET',
      qs: localQs,
      headers: {
        'User-Agent': 'Request-Promise',
        'Accept': 'application/json',
        'fsd-api-key': 'D4F2560DDB62E8B3BB853C03F19770DB86795C49EB8996056E8FA5C42180B41D2E76F0982A338A5A171039CF675BD3137E03D240D9CE921BC98A3BC71BCE3AA1'
      },
      json: true // Automatically parses the JSON string in the response
    }
    return rp(options).then(function (obj) {
      // console.log('User has %d obj', obj.length);
      var jsonResult = []
      for (var i in obj) {
        if (obj[i].emailAddress != null) {
          jsonResult.push({
            'first_name': obj[i].firstName,
            'last_name': obj[i].lastName,
            'title': obj[i].title,
            'display_name': obj[i].fullName,
            'email': _.toUpper(obj[i].emailAddress),
            'phone': obj[i].contactsDirect,
            'division': obj[i].assignmentTechnicalDiv,
            'image_url': obj[i].contactsPhoto,
            'index_number': obj[i].indexNumber,
            'username': _.toUpper(obj[i].account.substring(obj[i].account.lastIndexOf('\\') + 1, obj[i].account.length)),
            'password': 'password'
          })
        }
      }
      return jsonResult
    }).catch(function (err) {
      // API call failed...
      return new Error('Internal Server API Call Failed while trying to Fetch User from Fsd')
    })
  }
}
module.exports = Fsd
