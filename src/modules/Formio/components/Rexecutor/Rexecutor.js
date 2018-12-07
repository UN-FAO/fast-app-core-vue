import axios from 'axios';
import RLibrary from './Rlibrary';

export default {
  getRLibrary() {
    return RLibrary;
  },

  async executeScript({fullScript, openCpuUrl}) {
    var bodyFormData = new FormData();
    bodyFormData.set('x', fullScript);
    let url = '';
    let stdout = '';
    let valout = '';
    let consoleout = '';

    try {
      const response = await axios({
        method: "post",
        url: openCpuUrl + "/ocpu/library/base/R/identity",
        data: bodyFormData,
        config: { headers: { "Content-Type": "multipart/form-data" } }
      });

      url = response.data.split("/ocpu/").map(r => {
        r = r.replace(/\n/g, "");
        return r;
      });

      let stdoutUrl = url.find(o => {
        return o.indexOf("/stdout") > -1;
      });
      let valUrl = url.find(o => {
        return o.indexOf("/.val") > -1;
      });

      let consoleUrl = url.find(o => {
        return o.indexOf("/.val") > -1;
      });

      const promiseArray = [];

      if (stdoutUrl && stdoutUrl !== undefined) {
        promiseArray.push(
          axios.get(openCpuUrl + "/ocpu/" + stdoutUrl + "/text")
        );
      } else {
        promiseArray.push(new Promise(resolve => resolve('')));
      }

      if (valUrl && valUrl !== undefined) {
        promiseArray.push(
          axios.get(openCpuUrl + "/ocpu/" + valUrl)
        );
      } else {
        promiseArray.push(new Promise(resolve => resolve('')));
      }

      if (consoleUrl && consoleUrl !== undefined) {
        promiseArray.push(
          axios.get(openCpuUrl + "/ocpu/" + consoleUrl)
        );
      } else {
        promiseArray.push(new Promise(resolve => resolve('')));
      }

      const result = await Promise.all(promiseArray);

      return { stdout: result[0].data, valout: result[1].data, consoleout: result[2].data };
    } catch (error) {
      const err = error.response.data ? error.response.data : error.response;
      valout = JSON.stringify(err);
      stdout = JSON.stringify(err);
      consoleout = JSON.stringify(err);

      return { stdout, valout, consoleout };
    }
  },

  getFullScript({token, submission, formioUrl, content}) {
    let fullScript = "token <- '" + token + "' ; \n";
    fullScript = fullScript + this.getRLibrary() + "; \n";
    let classInit = "";
    let sub;

    if (submission.hasOwnProperty('data')) {
      sub = submission.data;
    } else {
      sub = JSON.parse(submission);
    }

    sub.variables.forEach(variable => {
      if (variable.name && variable.path && variable.name !== "") {
        classInit =
          classInit +
          variable.name +
          ' <- Formior$new("' +
          formioUrl +
          '/", "' +
          variable.path +
          '", token); \n';
      }
    });

    if (content) {
      fullScript = fullScript + classInit + content;
    } else {
      fullScript = fullScript + classInit + sub.script;
    }

    return fullScript;
  },

  getInitialText() {
    return `#################################################################
      #
      # The "token" variable will contain your Formio x-token
      #
      # You can use these URLs to request data from the DB
      # \n`;
  },

  getExampleText() {
    return `# Direct call Example: Replace <myVariable> with your variable Name
      #
      # httpCall <- httr::GET(<myVariable>_url, httr::add_headers('x-jwt-token' = token), httr::accept_json())
      # text_result <- httr::content(httpCall, as = "text", encoding = "UTF-8")
      # json_result <- jsonlite::fromJSON(text_result, flatten = TRUE)
      #
      # Fast Library Example: Replace <myVariable> with your variable Name
      #
      # filter <- list(list('_id','!=','5a65acec16987c0001f3d246'), list('owner','!=','2342342344'))
      # select <- list('data.a', 'owner', '_id')
      # chunk_size <- 15
      # limit <- 150
      # populate <- list('owner')
      # <myVariable>$select(select)$filter(filter)$limit(limit)$populate(populate)$chunks(chunk_size)
      # data <- <myVariable>$get()
      ################################################################!!#\n`;
  }
}
