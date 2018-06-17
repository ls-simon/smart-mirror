# Smart Mirror

Smart mirror is a voice chatbot who can tell which cloth item the user is wearing and suggest an additional cloth item that fits.

## Hardware
There are many examples on how to build your own smart mirror. The hardware requirements for this project are:
- Raspberry Pi
- Camera compenent
- USB microphone
- Monitor
- Speaker or sound through HDMI.

# Installation

To install all required libraries, run `npm install`

To try out the app, run `npm start`. Next, open up a browser and go to `localhost:6005`

**Notes**:
- The app only works after setting up the IBM Watson service environment (see _IBM Watson_)
- If the project does _not_ run, try installing nodemon globally by running `npm install -g nodemon` or simply run 
`npm run index.js`

# Unit test
[Chai](https://github.com/chaijs/chai) is the testing framework used for this project.

All tests are found in `/test`

To see the test results, run `npm test`

# IBM Watson
Smart Mirror is relying on [IBM Watson services](https://github.com/watson-developer-cloud/node-sdk) for chatbot, text and speech translation, tone analyzation and visual recognition functionality.

## Bluemix console
To connect the app with the services, make an account at [IBM](https://www.ibm.com/watson/developer/) and go to the Bluemix developer console. 

Create a Bluemix app and tie instances of the following services to it:
- Text-to-Speech
- Speech-to-Text
- Tone Analyzer
- Cloud Storage (optional if other database will be provided for the classification model)
- Conversation
- Visual Recognition

## Smart mirror app
Copy all the credentials provided with each instance and paste them into  
`controller/watson_environment.json`

## Conversation API
Make a workspace with cURL or the Watson Assistant tool. The flow should consist of nodes with sets of clothes that match, and associated child nodes with the result cases. 

[Example](https://imgur.com/j7onTqY)

## Intents
The conversation flow and behaviour of the app is relying heavily on intents for user messages and communication between Conversation and Visual Recognition API. All classification results are sent  to Conversation with an intent that tells Conversation whether it was the first or second picture. This is in order to customize a response to a given classification. 

Main intents in Conversation for _critical functionality_ are:

- **#pictureAnalyzeRequest**: the user wishes to take a picture.

- **#suggestClothing**: an intent sent with one classification result from the app. This will be targeted to an entry node.

-  **#takeSecondPicture**: the user wishes to take a second and final picture to evaluate the first and second cloth choice.

- **#clothResult**: an intent sent with two classification results. This intent is targeted at a child node of a given cloth item node. 

## Error handling in Conversation
The app is set up to handling certain errors with a customized response in Conversation. To catch these errors, make separate nodes catching the intents: 

- **#ERRORINCLASSIFICATION**: response from Visual Recognition is empty.

- **#ERRORTRANSCRIBING** response from Speech-to-Text is empty.

## Visual Recognition
Make a model within a project and paste the model ID into `controller/watson_environment.json`

**Note:** be sure to name the classes identical to your targeted entities in the Conversation workspace.
 
