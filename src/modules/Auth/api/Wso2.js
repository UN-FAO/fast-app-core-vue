var rp = require('request-promise');
var xmldoc = require('xmldoc');
class Wso2 {
  /**
   * [login description]
   * @param  {[type]} credentials [description]
   * @return {[type]}             [description]
   */
  static login(credentials) {
    var body = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ser=\"http://service.ws.um.carbon.wso2.org\">" + "<soapenv:Header/>" + "<soapenv:Body>" + "<ser:authenticate>" + "<ser:userName>" + credentials.username + "</ser:userName>" + "<ser:credential>" + credentials.password + "</ser:credential>" + "</ser:authenticate>" + "</soapenv:Body>" + "</soapenv:Envelope>";
    var options = {
      uri: 'https://accounts.fao.org/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/',
      method: 'POST',
      body: body,
      headers: {
        'Accept-Encoding': 'gzip,deflate',
        "Content-Type": "text/xml;charset=UTF-8",
        "SOAPAction": "urn:authenticate",
        "Authorization": "Basic " + new Buffer('FAOEXT/DG_followup_user' + ":" + 'x25QDDvQ').toString("base64"),
        "Host": "accounts.fao.org",
        "Connection": "Keep-Alive"
      },
      json: false // Automatically parses the JSON string in the response
    };
    return rp(options).then(function (obj) {
      var document = new xmldoc.XmlDocument(obj);
      if (document.valueWithPath("soapenv:Body.ns:authenticateResponse.ns:return") == "true") {
        return true;
      } else {
        let error = new Error();
        error.status = 403;
        error.name = "Error";
        error.message = "Wrong credentials";
        error.code = "LOGIN_FAILED";
        return error;
      }
    }).catch(function (err) {
      let error = new Error();
      error.status = 501;
      error.name = "Error";
      error.message = "WSo2 service is not responding";
      error.code = "LOGIN_FAILED"
      return error;
    });
  }
}
module.exports = Wso2;
