var fs = require('fs');
var path = require('path');

var outputDir = "C:\\Users\\saray\\OneDrive - Worcester Polytechnic Institute (wpi.edu)\\Year 3\\C Term\\CS 4433 - Big Data Management and Analytics\\Projects\\Project_4\\output\\problem3";

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
    let outputString;

    if (filename === 'query1.txt') {
        outputString = data[0].ancestors.map(a => `Name: ${a.Name}, Level: ${a.Level}`).join('\n');
    } else if (filename === 'query2.txt') {
        outputString = `Tree Height: ${data[0].treeHeight}`;
    } else if (filename === 'query3.txt') {
        if (data.length > 0) {
            outputString = `Parent of MongoDB: ${data[0].parent}`;
        } else {
            outputString = "No parent found for MongoDB";
        }
    } else if (filename === 'query4.txt') {
        if (data.length > 0 && data[0].descendants) {
            outputString = `Descendants of Programming:\n${data[0].descendants.join('\n')}`;
        } else {
            outputString = "No descendants found for Programming";
        }
    } else if (filename === 'query5.txt') {
        if (data.length > 0 && data[0].siblings) {
            outputString = `Siblings of Languages:\n${data[0].siblings.join('\n')}`;
        } else {
            outputString = "No siblings found for Languages";
        }
    }
    fs.writeFileSync(outputPath, outputString + '\n');
}


// Query 1: Report the ancestors of "MongoDB"
var ancestorsResult = db.categories.aggregate([
    { $match: { _id: "MongoDB" } },
    {
        $graphLookup: {
            from: "categories",
            startWith: "$parent",
            connectFromField: "parent",
            connectToField: "_id",
            as: "ancestors",
            depthField: "level"
        }
    },
    { $unwind: "$ancestors" },
    {
        $project: {
            _id: 0,
            Name: "$ancestors._id",
            Level: { $add: ["$ancestors.level", 1] }
        }
    },
    { $sort: { Level: 1 } },
    {
        $group: {
            _id: null,
            ancestors: { $push: "$$ROOT" }
        }
    },
    {
        $project: {
            _id: 0,
            ancestors: 1
        }
    }
]).toArray();

writeToFile("query1.txt", ancestorsResult);

// Query 2: Find Tree Height
var heightResult = db.categories.aggregate([
    { $match: { _id: "Books" } },
    {
        $graphLookup: {
            from: "categories",
            startWith: "$_id",
            connectFromField: "_id",
            connectToField: "parent",
            as: "descendants",
            depthField: "depth"
        }
    },
    { $unwind: "$descendants" },
    {
        $group: {
            _id: null,
            maxDepth: { $max: "$descendants.depth" }
        }
    },
    {
        $project: {
            _id: 0,
            treeHeight: { $add: ["$maxDepth", 1] }
        }
    }
]).toArray();

writeToFile("query2.txt", heightResult);


// Query 3: Report the Parent of "MongoDB"
var parentResult = db.categories.aggregate([
    {
        $match: {
            children: { $in: ["MongoDB"] }
        }
    },
    {
        $project: {
            _id: 0,
            parent: "$_id"
        }
    }
]).toArray();

writeToFile("query3.txt", parentResult);


// Query 4: Report the Descendants of "Programming"
var descendantsResult = db.categories.aggregate([
    {
        $match: { _id: "Programming" }
    },
    {
        $graphLookup: {
            from: "categories",
            startWith: "$children",
            connectFromField: "children",
            connectToField: "_id",
            as: "allDescendants",
            depthField: "depth"
        }
    },
    {
        $project: {
            _id: 0,
            descendants: {
                $setUnion: [
                    "$children",
                    "$allDescendants._id"
                ]
            }
        }
    },
    {
        $project: {
            descendants: {
                $sortArray: {
                    input: "$descendants",
                    sortBy: 1
                }
            }
        }
    }
]).toArray();

writeToFile("query4.txt", descendantsResult);


// Query 5: Report the Siblings of "Languages"
var siblingsResult = db.categories.aggregate([
    {
        $match: { _id: "Languages" }
    },
    {
        $lookup: {
            from: "categories",
            localField: "parent",
            foreignField: "_id",
            as: "parentData"
        }
    },
    {
        $unwind: "$parentData"
    },
    {
        $lookup: {
            from: "categories",
            localField: "parentData.children",
            foreignField: "_id",
            as: "siblings"
        }
    },
    {
        $project: {
            _id: 0,
            siblings: {
                $filter: {
                    input: "$siblings._id",
                    as: "sibling",
                    cond: { $ne: ["$$sibling", "Languages"] }
                }
            }
        }
    }
]).toArray();

writeToFile("query5.txt", siblingsResult);
