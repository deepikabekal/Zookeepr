//import the packages and files
const express = require ('express');
//Instantiate the server
const app = express();
//creating a route that the front-end can request data from
const { animals } = require('./data/animals.json');
//add route
app.get('/api/animals', (req,res) => {
    res.json(animals);
} );

//query 
app.get('/api/animals', (req ,res) => {
    let results = animals;
    console.log(req.query);
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
})

function filterByQuery(query, animalsArray) {
    let filteredResults = animalsArray;
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }     
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter (animal => animal.name === query.name);
    }

    return filteredResults;
}

//method to make the server listen
app.listen(3001, () => {
    console.log("API server now on port 3001!");
})

