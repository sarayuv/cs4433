1. Start the MongoDB server
    * open command prompt in administrator mode
    * Navigate to this directory: "C:\Program Files\MongoDB\bin"
        * mongod --dbpath "C:\tools\mongodb-data"
2. Open two command prompt terminals in IntelliJ IDEA
    * one for resetting dbs
    * one for running the queries
3. Run Problem1.js
    * Navigate to this directory:
        "C:\Users\saray\OneDrive - Worcester Polytechnic Institute (wpi.edu)\Year 3\C Term\CS 4433 - Big Data Management and Analytics\Projects\Project_4"
        * mongosh reset-db-famous-people.js
    * Navigate to this directory: "C:\Program Files\MongoDB\bin"
        * mongosh
        * use famous-people;
        * load("C:\\Users\\saray\\OneDrive - Worcester Polytechnic Institute (wpi.edu)\\Year 3\\C Term\\CS 4433 - Big Data Management and Analytics\\Projects\\Project_4\\src\\main\\Problem1.js");
4. Run Problem2.js
    * Navigate to this directory:
            "C:\Users\saray\OneDrive - Worcester Polytechnic Institute (wpi.edu)\Year 3\C Term\CS 4433 - Big Data Management and Analytics\Projects\Project_4"
            * mongosh reset-db-famous-people.js
    * load("C:\\Users\\saray\\OneDrive - Worcester Polytechnic Institute (wpi.edu)\\Year 3\\C Term\\CS 4433 - Big Data Management and Analytics\\Projects\\Project_4\\src\\main\\Problem2.js");
5. Run Problem3.js
    * Navigate to this directory:
        "C:\Users\saray\OneDrive - Worcester Polytechnic Institute (wpi.edu)\Year 3\C Term\CS 4433 - Big Data Management and Analytics\Projects\Project_4"
        * mongosh reset-db-problem3db.js
    * Navigate to this directory: "C:\Program Files\MongoDB\bin"
        * mongosh
        * use problem3db;
        * load("C:\\Users\\saray\\OneDrive - Worcester Polytechnic Institute (wpi.edu)\\Year 3\\C Term\\CS 4433 - Big Data Management and Analytics\\Projects\\Project_4\\src\\main\\Problem3.js");
