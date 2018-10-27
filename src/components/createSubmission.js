import moment from "moment";
import { Submission } from "fast-fastjs";
let createSubmission = (() => {
  const withData = async ({ email, appUrl, path, parent, data, _id }) => {
    if (_id) {
      const r = {
        name: "formio_submission_update",
        params: {
          idForm: path,
          idSubmission: _id
        },
        query: {
          parent: parent,
          scouting: btoa(JSON.stringify(data))
        }
      };
      return r;
    }
    let date = moment().unix();
    let formSubmission = {
      data: data,
      draft: true,
      sync: false,
      trigger: "createLocalDraft",
      user_email: email,
      path: path,
      baseUrl: appUrl,
      created: date,
      modified: date
    };

    let submission = await Submission()
      .local()
      .insert(formSubmission);

    let route = {
      name: "formio_submission_update",
      params: {
        idForm: path,
        idSubmission: submission._id
      },
      query: {
        parent: parent
      }
    };
    return route;
  };
  return Object.freeze({
    withData
  });
})();
export default createSubmission;
