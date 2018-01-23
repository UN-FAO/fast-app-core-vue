exports.handler = function (context, event, callback) {
  let twiml = new Twilio.twiml.MessagingResponse();

  let crops = ['Maize', 'Cereals', 'Fruits', 'Grasses', 'Vegetables']
  let stages = ['Egg', 'Larvae', 'Pupae', 'Adult']

  let selectedCrop = event && event.q1 && crops[event.q1 - 1] ? crops[event.q1 - 1] : ''
  let fawScouting = event.q2 ? event.q2.split(/(?:,| )+/) : [];
  let selectedStage = fawScouting[2] && stages[fawScouting[2] - 1] ? stages[fawScouting[2] - 1] : ''

  let message = "Thank you for taking the survey, your data was: \n\n";
  message = message + "Crop: " + selectedCrop + '\n\n';
  message = message + "Plants Checked: " + fawScouting[0] + '\n\n';
  message = message + "Plants Infested: " + fawScouting[1] + '\n\n';
  message = message + "FAW Stage: " + selectedStage + '\n\n';


  var requestPayload = {
    data: {
      cropMain: selectedCrop,
      fawStage: selectedStage,
      fawPlantsInfested: parseInt(fawScouting[1]),
      fawPlantsChecked: parseInt(fawScouting[0])
    }
  };
  var request = require("request");

  request.post({
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    url: 'https://efqbsqrkscuzlpi.form.io/smsscouting/submission',
    form: requestPayload
  }, function (error, response, body) {
    if (error) {
      twiml.message('Could not store your submission, try again later');
      callback(null, twiml);
    } else {
      console.log(response.body)
      twiml.message(message);
      callback(null, twiml);
    }
  });
};
