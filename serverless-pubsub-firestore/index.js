'use strict';

// Initialising Firestore
const Firestore = require('@google-cloud/firestore');
const settings = {timestampsInSnapshots: true};
const db = new Firestore({
    projectId: 'name_of_project_id',
    keyFilename: 'key_file_name.json'
});
db.settings(settings);

const moment = require('moment');

// Function pubSub -- taking data from Google Pub/Sub
exports.pubSub = (event, callback) => {
    const message = event.data;
    const date = new Date();

    if (message.data) {
        // reading data from a json file
        const jsonData = JSON.parse(Buffer.from(message.data, 'base64').toString());
        // use console log to test if the data coming from the json file is right
        //console.log(jsonData);

        const valueFromJSONFile = jsonData.variableFromJSONFile;
        const timestamp = jsonData.timestamp;

        // converting your timestamp in ISO format to epochtime in seconds
        const epochTime = moment(timestamp).unix();

        /*
         *   problem with Pub/Sub is that they might post multiple of the same data set
         *   reading data from the database costs money
         *   1) check if the timestamp of data sent is near to current timestamp
         *   2) if the timestamp is not near the data set, check the previous data value
         *   3) in the case of the first data sent in and is delayed, publish it
         */

        // 1) Check if data that is coming in is near the current time
        if (moment(date).unix() - moment(timestamp).unix() < 30) {
            console.log('1');

            // sending the data to Google Firestore
            return [
                db.collection(name_of_collection).doc(name_of_document).collection(name_of_sub_collection).add({
                    valueFromJSONFile: variableFromJSONFile,
                    Timestamp: timestamp,
                    epochTime: epochTime
                })
            ];
        }

        // if it is not 30s within the sending of information, check previous entry
        // if previous entry is within 1min of incoming entry, publish it
        else {
            const uniqueRef = db.collection(name_of_collection).doc(name_of_document).collection(name_of_sub_collection);

            // ordering the data by timestamp in descending order and limiting to the latest value
            const refLimit = uniqueRef.orderBy('Timestamp', 'desc').limit(1);
            refLimit.get().then(function(querySnapshot) {
                if (!querySnapshot.empty && querySnapshot.size > 0) {

                    // check for data present but only take last data
                    querySnapshot.forEach(function(documentSnapshot) {

                        // Read through the data
                        const data = documentSnapshot.data();

                        // Look for Timestamp value
                        const timeCheck = data.Timestamp;

                        if (moment(timestamp).unix() - moment(timeCheck).unix() <100 && moment(timestamp).unix() - moment(timeCheck).unix() >50) {
                            // Check if the latest data time coming in is near the last recorded time
                            // If it is near means that the data was missed in Pub/Sub
                            console.log('2');
                            return [
                                db.collection(name_of_collection).doc(name_of_document).collection(name_of_sub_collection).add({
                                    valueFromJSONFile: variableFromJSONFile,
                                    Timestamp: timestamp,
                                    epochTime: epochTime
                                })
                            ];
                        }
                    })
                } else {
                    // If there are no prior entries then just post
                    console.log('3');
                    return [
                        db.collection(name_of_collection).doc(name_of_document).collection(name_of_sub_collection).add({
                            valueFromJSONFile: variableFromJSONFile,
                            Timestamp: timestamp,
                            epochTime: epochTime
                        })
                    ];
                }
            })
        }
        // use set to record 1 data only
        // use add to record all data
    }
};


