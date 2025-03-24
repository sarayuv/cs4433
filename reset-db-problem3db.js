// Step 1: Delete the database
var db = db.getSiblingDB('problem3db');
db.dropDatabase();
print("Deleted the 'problem3db' database.");

// Step 2: Create the database again
db = db.getSiblingDB('problem3db');
print("Created the 'problem3db' database.");

// Step 3: Insert documents into the collection using CHILD-REFERENCING model
db.categories.insertMany([
    {
        _id: "Books",
        children: ["Programming"]
    },
    {
        _id: "Programming",
        children: ["Languages", "Databases"],
        parent: "Books"
    },
    {
        _id: "Databases",
        children: ["MongoDB", "dbm"],
        parent: "Programming"
    },
    {
        _id: "MongoDB",
        parent: "Databases"
    },
    {
        _id: "dbm",
        parent: "Databases"
    },
    {
        _id: "Languages",
        parent: "Programming"
    }
]);
print("Inserted documents into the 'categories' collection using child-referencing model.");

// Step 4: Verify the documents
print("Documents in the 'categories' collection:");
db.categories.find().forEach(printjson);

// Step 5: Query to find parent of "MongoDB" (Problem 3 solution)
print("\nQuery to find parent of MongoDB:");
var parentResult = db.categories.aggregate([
    {
        $match: {
            _id: "MongoDB"
        }
    },
    {
        $lookup: {
            from: "categories",
            localField: "parent",
            foreignField: "_id",
            as: "parentInfo"
        }
    },
    {
        $unwind: "$parentInfo"
    },
    {
        $project: {
            _id: 0,
            child: "$_id",
            parent: "$parentInfo._id"
        }
    }
]).toArray();

printjson(parentResult);