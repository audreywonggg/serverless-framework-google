'use strict';

// Initialising Firestore
const Firestore = require('@google-cloud/firestore');
const settings = {timestampsInSnapshots: true};
const db = new Firestore({
    projectId: 'name_of_project_id',
    keyFilename: 'key_file_name.json'
});
db.settings(settings);

exports.http = (request, response) => {

    // reading string and int variables
    const variableName = request.query.variableFromAPICall;
    const variableName_int = parseInt(request.query.variableFromAPICall_int);

    const numberOfDataSets = 1;
    const searchRef = db.collection(name_of_collection).doc(name_of_document).collection(name_of_sub_collection);
    const dateSelectedRef = searchRef.orderBy('epochTime', 'desc').where('epochTime', '>=', epochTime);
    const limitToRef = dateSelectedRef.limit(numberOfDataSets);
    // inequality filter property and first sort order must be the same

    limitToRef.get().then(function(querySnapshot) {
        if (!querySnapshot.empty && querySnapshot.size > 0) {
            // initialize an array to put the values in
            const arrayCheck = [];
            querySnapshot.forEach(function(documentSnapshot) {
                const data = documentSnapshot.data();
                const dataName = data.variableFromDatabase;
                console.log(data);
                console.log(dataName);
                arrayCheck.push(dataName);
            });
            response.status(200).json(arrayCheck);
        }
    });
};

