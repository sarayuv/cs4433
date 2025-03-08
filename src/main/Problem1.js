// Query 1: Change the _id of "Grace Hopper" to 333
    // Since _id is immutable, we need to:
    // 1. Find the document for Grace Hopper
    // 2. Insert a new document with the updated _id
    // 3. Delete the old document

// Step 1: Find the document for Grace Hopper
const graceHopper = db.getCollection("famous-people").findOne({ "name.first": "Grace", "name.last": "Hopper" });

// Step 2: Insert a new document with the updated _id
graceHopper._id = 333;
db.getCollection("famous-people").insertOne(graceHopper);

// Step 3: Delete the old document
db.getCollection("famous-people").deleteOne({ "_id": graceHopper._id });

// Query 2: Insert new records into the collection
db.getCollection("famous-people").insertMany([
    {
        "_id": 222,
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
    },
    {
        "_id": 333,
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
]);

// Query 3: Report all documents of people who got at least one "Turing Award" after 1940
const turingAwardeesAfter1940 = db.getCollection("famous-people").find({
    "awards": {
        $elemMatch: {
            award: "Turing Award",
            year: { $gt: 1940 }
        }
    }
});
print("People who got at least one Turing Award after 1940:");
turingAwardeesAfter1940.forEach(printjson);

// Query 4: Report all people who got more than one "Turing Award"
const multipleTuringAwardees = db.getCollection("famous-people").aggregate([
    {
        $match: {
            "awards.award": "Turing Award"
        }
    },
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
            "awards.1": { $exists: true } // Check if there are at least 2 Turing Awards
        }
    }
]);
print("People who got more than one Turing Award:");
multipleTuringAwardees.forEach(printjson);