var fs = require('fs');
var path = require('path');

var outputDir = "C:\\Users\\saray\\OneDrive - Worcester Polytechnic Institute (wpi.edu)\\Year 3\\C Term\\CS 4433 - Big Data Management and Analytics\\Projects\\Project_4\\output\\problem2";
function prepareOutputDirectory(dir) {
    if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach(function(file) {
            var filePath = path.join(dir, file);
            fs.unlinkSync(filePath);
        });
    } else {
        fs.mkdirSync(dir, { recursive: true });
    }
}

prepareOutputDirectory(outputDir);

function writeToFile(filename, data) {
    var outputPath = path.join(outputDir, filename);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2) + '\n');
}


// Query 1: Group by award name and count the number of times each award has been given
var query1Result = db['famous-people'].aggregate([
    { $unwind: "$awards" },

    {
        $group: {
            _id: "$awards.award",
            count: { $sum: 1 }
        }
    },

    { $sort: { _id: 1 } }
]).toArray();

writeToFile('query1.txt', { success: true, message: "Award counts calculated successfully.", result: query1Result });


// Query 2: Group by award name and report an array of years for when each award has been given
var query2Result = db['famous-people'].aggregate([
    { $unwind: "$awards" },

    {
        $group: {
            _id: "$awards.award",
            years: { $push: "$awards.year" }
        }
    },
]).toArray();

writeToFile('query2.txt', { success: true, message: "Award years calculated successfully.", result: query2Result });


// Query 3: Group by birth year and report the count and _ids of people born in that year
var query3Result = db['famous-people'].aggregate([
    {
        $project: {
            birthYear: { $year: "$birth" },
            _id: 1
        }
    },

    {
        $group: {
            _id: "$birthYear",
            count: { $sum: 1 },
            peopleIds: { $push: "$_id" }
        }
    },
]).toArray();

writeToFile('query3.txt', { success: true, message: "Birth year groups calculated successfully.", result: query3Result });


// Query 4: Report the document with the smallest and largest _ids
var smallestIdDoc = db['famous-people'].find().sort({ _id: 1 }).limit(1).toArray()[0];
var largestIdDoc = db['famous-people'].find().sort({ _id: -1 }).limit(1).toArray()[0];

writeToFile('query4.txt', {
    success: true,
    message: "Documents with smallest and largest _ids retrieved successfully.",
    result: {
        smallestIdDocument: smallestIdDoc,
        largestIdDocument: largestIdDoc
    }
});


// Query 5: Search for documents containing "Turing" using $text operator
db['famous-people'].dropIndexes();

db['famous-people'].createIndex({
    "name.first": "text",
    "name.last": "text",
    "contribs": "text",
    "awards.award": "text"
});

var query5Result = db['famous-people'].find({
    $text: { $search: "Turing" }
}).toArray();

writeToFile('query5.txt', {
    success: true,
    message: "Documents containing 'Turing' retrieved successfully.",
    result: query5Result
});


// Query 6: Search for documents containing "Turing" or "National Medal" using $text
db['famous-people'].dropIndexes();

db['famous-people'].createIndex({
    "name.first": "text",
    "name.last": "text",
    "contribs": "text",
    "awards.award": "text"
});

var query6Result = db['famous-people'].find({
    $text: { $search: "Turing \"National Medal\"" }
}).toArray();

writeToFile('query6.txt', {
    success: true,
    message: "Documents containing 'Turing' or 'National Medal' retrieved successfully.",
    result: query6Result
});


// Query 7: Search for documents containing both "Turing" and "National Medal"
db['famous-people'].dropIndexes();

db['famous-people'].createIndex({
    "name.first": "text",
    "name.last": "text",
    "contribs": "text",
    "awards.award": "text"
});

var query7Result = db['famous-people'].find({
    $text: { $search: "Turing" },  // Search for "Turing"
    awards: { $elemMatch: { award: { $regex: "National Medal", $options: "i" } } }
}).toArray();

writeToFile('query7.txt', {
    success: true,
    message: "Documents containing both 'Turing' and 'National Medal' retrieved successfully.",
    result: query7Result
});
