//import packages and files
const express = require ('express');
//get the data
const animals = require ('./data/animals.json');

//instantiate the server
const app = express();

//
const PORT = process.env.PORT || 3001;

//creating a route
app.get('/api/animals', (req,res) => {
    let results = animals;
    console.log(req.query);
    results = filterByQuery(req.query, results);
    res.json(results);
})

//function to send specific anaimal using parameters
function filterByQuery(query, animalsArray) {
    let filteredResults = animalsArray;
    //console.log(animalsArray);
    
    if (query.diet)
    {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
        console.log(filteredResults);
    }

    return filteredResults;

    
}

















//listen to the server
app.listen(PORT, () => {
    console.log(`App server now on port ${PORT}`);
});
