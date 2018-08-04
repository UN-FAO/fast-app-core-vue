## What is FAST?

> FAST - FAO SURVEY TECHNOLOGY

FAO SURVEY TECHNOLGY (FAST) is the Food and Agriculture Organization's approach to handle corporate Data Collection and Data Management projects in a scalable and reusable fashion. Rather than just going for a single provider approach, we separated every step of the Data Collection process to allow the use of pluggable/interchangeable Open Source solutions that will work the same way whether you are using them on a Cloud or On-premise environment (No internet access)

## What moves us

The complexity of data collection projects is often underestimated. Even when the problematics faced on those projects can be very similar from one and other, there is no consensus on the best approach to cover them all. Managing multiple tools or customize solutions for every project will only increase the burden of developing and maintaining them over time, therefore a common platform that defines a standard approach to face this scenario could substantially benefit the organization through the use of a secure, highly available, reliable and replicable solution that could speed up the projects and therefore, the decision making.

#### Reducing corporate data collection complexity

In some cases, the required data to be collected may seem simple, as a single online form that could potentially be easily handled by a custom development or using online tools, but even when those approaches could solve the current problem, there is no certainty of the repercussions that these solutions could bring in the future in terms of data segregation and software standardization.

Before starting any type of development, there are underlying technology related decisions that have to be considered that could potentially affect the entire organization.

1.  Survey and data collection tools.

Currently there is a wide range of possible solutions to choose from. From Google Docs, Survey Monkey, Survey Solutions, EPI Collect, Smart Forms or CommCare, the variety of alternatives can be overwhelming.
Even when it’s feasible to use any of this providers, there is still the option to create custom developments, generating more questions:

*a. Which front end and backend framework should be used?
*b. Which front end and backend library for validation should be used?
*c. Which type of database should use?
*d. How should the schema of our database be?
*e. How is going to be the API structured?
*f. Where is the project going to be deployed?
*g. Is the project going to have Dev and QA environments?
*h. Who is going to maintain all the project in the long term?

## ARCHITECTURE (roadmap)

![alt text](https://dl.dropboxusercontent.com/s/ur9dmyklt9hi0jc/FAST%20-%20ARCHITECTUREv2.png?dl=1 'THE FULL PICTURE')

## Environment Configuration

The file `env-example` is provided as template for setting up the environment variables. Once ready, save it as `.env` to start the full stack
FAST consist of two main componets.

1.  Form.io
2.  Mobile Application

Form.io is used as the main API and form builder resource. It takes care
of handeling all form submissions and storing the data.

The mobile application is a Vue.js mobile/offline first application
that connects to Form.io and pulls the form's definition to later
be used for data collection in the field.
