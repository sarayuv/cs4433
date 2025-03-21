var fs = require('fs');
var path = require('path');

var outputDir = "C:\\Users\\saray\\OneDrive - Worcester Polytechnic Institute (wpi.edu)\\Year 3\\C Term\\CS 4433 - Big Data Management and Analytics\\Projects\\Project_4\\output\\problem2";
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


// Query 1: Group by award name and count the number of times each award has been given
var query1Result = db['famous-people'].aggregate([
    // Step 1: Unwind the awards array
    { $unwind: "$awards" },

    // Step 2: Group by the award name and count occurrences
    {
        $group: {
            _id: "$awards.award", // Group by the award name
            count: { $sum: 1 }    // Count the number of occurrences
        }
    },

    // Step 3: Sort by the award name (optional)
    { $sort: { _id: 1 } }
]).toArray();

// Write the result to a file
writeToFile('query1.txt', { success: true, message: "Award counts calculated successfully.", result: query1Result });


// Query 2: Group by award name and report an array of years for when each award has been given
var query2Result = db['famous-people'].aggregate([
    // Step 1: Unwind the awards array
    { $unwind: "$awards" },

    // Step 2: Group by the award name and collect the years
    {
        $group: {
            _id: "$awards.award", // Group by the award name
            years: { $push: "$awards.year" } // Collect the years into an array
        }
    },

    // Step 3: Sort by the award name (optional)
    { $sort: { _id: 1 } }
]).toArray();

// Write the result to a file
writeToFile('query2.txt', { success: true, message: "Award years calculated successfully.", result: query2Result });


// Query 3: Group by birth year and report the count and _ids of people born in that year
var query3Result = db['famous-people'].aggregate([
    // Step 1: Extract the year from the "birth" field
    {
        $project: {
            birthYear: { $year: "$birth" }, // Extract the year from the "birth" field
            _id: 1 // Include the _id field
        }
    },

    // Step 2: Group by the birth year
    {
        $group: {
            _id: "$birthYear", // Group by the birth year
            count: { $sum: 1 }, // Count the number of people born in that year
            peopleIds: { $push: "$_id" } // Collect the _ids into an array
        }
    },

    // Step 3: Sort by the birth year (optional)
    { $sort: { _id: 1 } }
]).toArray();

// Write the result to a file
writeToFile('query3.txt', { success: true, message: "Birth year groups calculated successfully.", result: query3Result });


// Query 4: Report the document with the smallest and largest _ids
var smallestIdDoc = db['famous-people'].find().sort({ _id: 1 }).limit(1).toArray()[0];
var largestIdDoc = db['famous-people'].find().sort({ _id: -1 }).limit(1).toArray()[0];

// Write the result to a file
writeToFile('query4.txt', {
    success: true,
    message: "Documents with smallest and largest _ids retrieved successfully.",
    result: {
        smallestIdDocument: smallestIdDoc,
        largestIdDocument: largestIdDoc
    }
});


