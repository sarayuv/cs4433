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
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2) + '\n');
}


// Query 1: Report the ancestors of "MongoDB"
var query1Result = db.categories.aggregate([
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

writeToFile("query1.txt", {
    title: "Ancestors of MongoDB",
    results: query1Result[0]?.ancestors || []
});


// Query 2: Find Tree Height
var query2Result = db.categories.aggregate([
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

writeToFile("query2.txt", {
    title: "Tree Height from Books",
    height: query2Result[0]?.treeHeight || 0
});


// Query 3: Report the Parent of "MongoDB"
var query3Result = db.categories.aggregate([
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

writeToFile("query3.txt", {
    title: "Parent of MongoDB",
    parent: query3Result[0]?.parent || "Not found"
});


// Query 4: Report the Descendants of "Programming"
var query4Result = db.categories.aggregate([
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

writeToFile("query4.txt", {
    title: "Descendants of Programming",
    descendants: query4Result[0]?.descendants || []
});


// Query 5: Report the Siblings of "Languages"
var query5Result = db.categories.aggregate([
    { $match: { _id: "Languages" } },

    {
        $lookup: {
            from: "categories",
            localField: "parent",
            foreignField: "_id",
            as: "parentDoc"
        }
    },
    { $unwind: "$parentDoc" },

    {
        $lookup: {
            from: "categories",
            localField: "parentDoc.children",
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

writeToFile("query5.txt", {
    title: "Siblings of Languages",
    siblings: query5Result[0]?.siblings || []
});