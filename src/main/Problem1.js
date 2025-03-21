var fs = require('fs');
var path = require('path');

var outputDir = "C:\\Users\\saray\\OneDrive - Worcester Polytechnic Institute (wpi.edu)\\Year 3\\C Term\\CS 4433 - Big Data Management and Analytics\\Projects\\Project_4\\output\\problem1";
function prepareOutputDirectory(dir) {
    if (fs.existsSync(dir)) {
        // delete all files in output directory
        fs.readdirSync(dir).forEach(function(file) {
            var filePath = path.join(dir, file);
            fs.unlinkSync(filePath);
        });
    } else {
        // create output directory if it doesn't exist
        fs.mkdirSync(dir, { recursive: true });
    }
}

prepareOutputDirectory(outputDir);

// write output to a file
function writeToFile(filename, data) {
    var outputPath = path.join(outputDir, filename);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2) + '\n');
}


// Query 1: Change the _id of "Grace Hopper" to 333
var graceHopperDoc = db['famous-people'].findOne({ "name.first": "Grace", "name.last": "Hopper" });

if (graceHopperDoc) {
    graceHopperDoc._id = 333;
    db['famous-people'].insertOne(graceHopperDoc);
    db['famous-people'].deleteOne({ "_id": graceHopperDoc._id });

    writeToFile('query1.txt', { success: true, message: "Updated _id of Grace Hopper to 333." });
} else {
    writeToFile('query1.txt', { success: false, message: "Grace Hopper Doc not found." });
}


// Query 2: Update/insert new records into the collection
var query2Result = [];
var updateResult1 = db['famous-people'].updateOne(
    { "_id": 222 },
    {
        $set: {
            "name": {
                "first": "Mary",
                "last": "Sally"
            },
            "birth": ISODate("1933-08-27T04:00:00Z"),
            "death": ISODate("1984-11-07T04:00:00Z"),
            "contribs": [
                "C++",
                "Simula"
            ],
            "awards": [
                {
                    "award": "WPI Award",
                    "year": 1999,
                    "by": "WPI"
                }
            ]
        }
    },
    { upsert: true } // insert document if it doesn't exist
);
query2Result.push(updateResult1);

var updateResult2 = db['famous-people'].updateOne(
    { "_id": 333 },
    {
        $set: {
            "name": {
                "first": "Ming",
                "last": "Zhang"
            },
            "birth": ISODate("1911-04-12T04:00:00Z"),
            "death": ISODate("2000-11-07T04:00:00Z"),
            "contribs": [
                "C++",
                "FP",
                "Python",
                "Simula"
            ],
            "awards": [
                {
                    "award": "WPI Award",
                    "year": 1960,
                    "by": "WPI"
                },
                {
                    "award": "Turing Award",
                    "year": 1960,
                    "by": "ACM"
                }
            ]
        }
    },
    // insert document if it doesn't exist
    { upsert: true }
);
query2Result.push(updateResult2);

writeToFile('query2.txt', { success: true, message: "Updated/inserted documents with _id: 222 and _id: 333.", result: query2Result });


// Query 3: Report all documents of people who got at least one Turing Award after 1940
var query3Result = db['famous-people'].find({
    "awards": {
        $elemMatch: {
            "award": "Turing Award",
            "year": { $gt: 1940 }
        }
    }
}).toArray();

if (query3Result.length > 0) {
    writeToFile('query3.txt', { success: true, message: "Found documents with at least one Turing Award after 1940.", result: query3Result });
} else {
    writeToFile('query3.txt', { success: false, message: "No documents found with at least one Turing Award after 1940." });
}


// Query 4: Report all people who got more than one Turing Award
var query4Result = db['famous-people'].aggregate([
    {
        $project: {
            name: 1,
            awards: {
                $filter: {
                    input: "$awards",
                    as: "award",
                    cond: { $eq: ["$$award.award", "Turing Award"] }
                }
            }
        }
    },
    {
        $match: {
            // check if there are at least 2 Turing Awards
            "awards.1": { $exists: true }
        }
    }
]).toArray();

if (query4Result.length > 0) {
    writeToFile('query4.txt', { success: true, message: "Found people with more than one Turing Award.", result: query4Result });
} else {
    writeToFile('query4.txt', { success: false, message: "No people found with more than one Turing Award." });
}


// Query 5: Update the document of “Grace Hopper” to add a new contribution
var query5Result = db['famous-people'].updateOne(
    { "_id": 333 },
    { $push: { "contribs": "was an inspiring pioneer overcoming the glass ceiling in computing" } }
);

if (query5Result.modifiedCount > 0) {
    writeToFile('query5.txt', { success: true, message: "Added a new contribution to Grace Hopper's document.", result: query5Result });
} else {
    writeToFile('query5.txt', { success: false, message: "Grace Hopper's document not found or no changes made." });
}


// Query 6: Insert a new field called “comments” into the document of “Mary Sally”
var query6Result = db['famous-people'].updateOne(
    { "_id": 222 },
    { $set: { "comments": [
                "taught at 2 universities",
                "was an inspiring pioneer overcoming the glass ceiling in computing",
                "lived in Worcester."
            ] } }
);

if (query6Result.modifiedCount > 0) {
    writeToFile('query6.txt', { success: true, message: "Added comments to Mary Sally's document.", result: query6Result });
} else {
    writeToFile('query6.txt', { success: false, message: "Mary Sally's document not found or no changes made." });
}


// Query 7: For each contribution by “Mary Sally”, list the people’s first and last names who have the same contribution (excluding Mary Sally)
var marySallyDoc = db['famous-people'].findOne({ "_id": 222 });
var query7Result = [];
if (marySallyDoc && marySallyDoc.contribs) {
    marySallyDoc.contribs.forEach(function(contribution) {
        var people = db['famous-people'].find(
            {
                "contribs": contribution,
                "_id": { $ne: 222 }
            },
            {
                "name.first": 1,
                "name.last": 1,
                "_id": 0
            }
        ).toArray();
        query7Result.push({ Contribution: contribution, People: people });
    });
    writeToFile('query7.txt', { success: true, message: "Found people with the same contributions as Mary Sally.", result: query7Result });
} else {
    writeToFile('query7.txt', { success: false, message: "Mary Sally's document not found or no contributions listed." });
}


// Query 8: Add (copy) all the contributions of document _id = 3 to that of document _id = 6
var doc3 = db['famous-people'].findOne({ "_id": 3 });
var query8Result = { success: false, message: "Document with _id 3 not found." };
if (doc3 && doc3.contribs) {
    query8Result = db['famous-people'].updateOne(
        { "_id": 6 },
        { $push: { "contribs": { $each: doc3.contribs } } }
    );
    if (query8Result.modifiedCount > 0) {
        writeToFile('query8.txt', { success: true, message: "Copied contributions from document _id: 3 to document _id: 6.", result: query8Result });
    } else {
        writeToFile('query8.txt', { success: false, message: "Document _id: 6 not found or no changes made." });
    }
} else {
    writeToFile('query8.txt', query8Result);
}


// Query 9: Report all documents where the first name matches the regular expression “Jo*”, sorted by the last name
var query9Result = db['famous-people'].find({
    "name.first": { $regex: /^Jo/ }
}).sort({ "name.last": 1 }).toArray();

if (query9Result.length > 0) {
    writeToFile('query9.txt', { success: true, message: "Found documents with first names matching 'Jo*'.", result: query9Result });
} else {
    writeToFile('query9.txt', { success: false, message: "No documents found with first names matching 'Jo*'." });
}


// Query 10: Update the award of document _id = 30, which is given by WPI, and set the year to 1999
var doc30 = db['famous-people'].findOne({ "_id": 30 });

if (doc30) {
    // check if document has an award given by WPI
    var wpiAwardIndex = doc30.awards.findIndex(award => award.by === "WPI");

    if (wpiAwardIndex !== -1) {
        // update award year
        var query10Result = db['famous-people'].updateOne(
            { "_id": 30, "awards.by": "WPI" },
            { $set: { "awards.$.year": 1999 } }
        );

        if (query10Result.modifiedCount > 0) {
            writeToFile('query10.txt', { success: true, message: "Updated the award year for document _id: 30.", result: query10Result });
        } else {
            writeToFile('query10.txt', { success: false, message: "No changes made to document _id: 30." });
        }
    } else {
        writeToFile('query10.txt', { success: false, message: "Document _id: 30 does not have an award given by WPI." });
    }
} else {
    writeToFile('query10.txt', { success: false, message: "Document _id: 30 not found." });
}