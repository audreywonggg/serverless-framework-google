# serverless-framework-google

This is a guide to using the Serverless Framework with Google Cloud Platform

Guide 1: Taking data from Google Cloud Pub/Sub and piping it to Firestore
      - Go to https://serverless.com/ and create an account
      - Go to https://serverless.com/framework/docs/providers/google/guide/quick-start/ and follow the instructions to create a new service
      - Copy contents of file in this repository into the respective files of the new service

Guide 2: Sending an API call to Firestore
      - Follow Guide 1
      - Download Google Cloud Emulator: https://dev.to/martyndavies/testing-a-google-cloud-function-locally-4121, https://cloud.google.com/functions/docs/emulator
      - The Google Cloud Emulator allows you to run functions locally, saving you money (but you cannot use this if you are accessing Firestore)
      - Run "functions start"
      - Copy the value of the key "resource" into event - http in yml file
      - In postman, use the same link as 3
      - Deploy the function
      - If there are issues with deploying the function, use "functions stop" to stop the emulator, "serverless deploy" then "functions start" again to start the emulator. Important: emulator must be on for the localhost to work

