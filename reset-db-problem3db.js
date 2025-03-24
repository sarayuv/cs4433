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