const fs = require('fs');

//import fs from 'fs';

//import colors from 'colors';
require('colors');

//import dotenv from 'dotenv';
require('../../config/configDb');
(
    async () => {
        try {
            await require('../../config/configDb');
            console.log(`connected successfully to DB: ${process.env.DB_NAME}`)
        } catch (err) {
            console.log(err)
        }
    }
)
const User = require('../../src/Models/User');


//import { Trip } from '../../../dist/models/trip.model';



// Read data
//const data = JSON.parse(fs.readFileSync('./data.json'));
const data = {
    name: "mohyware",
    email: "mohy@gmail.com",
    password: "secret",
};

// Insert data into DB
const insertData = async () => {
    try {
        await User.create(data);

        console.log('Data Inserted');
        process.exit();
    } catch (error) {
        console.log(error);
    }
};

// Delete data from DB
const destroyData = async () => {
    try {
        const users = await User.find({});
        console.log(users)
        await User.deleteMany();
        console.log('Data Destroyed');
        process.exit();
    } catch (error) {
        console.log(error);
    }
};

// node seeder.js -d
if (process.argv[2] === '-i') {
    insertData();
} else if (process.argv[2] === '-d') {
    destroyData();
}