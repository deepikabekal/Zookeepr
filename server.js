//import packages and files
const { query } = require('express');
const express = require ('express');
//get the data
const { animals } = require ('./data/animals.json');

//instantiate the server
const app = express();

//
const PORT = process.env.PORT || 3001;

//creating a route
app.get('/api/animals', (req,res) => {
    let results = animals;
    //console.log(req.query);
    if (req.query)
    {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
})

//function to filter data based on the query parameters
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];

    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    //console.log(animalsArray);

    if(query.personalityTraits)
    {
        // Save personalityTraits as a dedicated array.
        // If personalityTraits is a string, place it into a new array and save.
        if(typeof query.personalityTraits === 'string')
        {
            personalityTraitsArray = [query.personalityTraits];
        }
        else
        {
            personalityTraitsArray = query.personalityTraits;
        }

        //if personalityTraits is an array the loop through each traits in personalityTraitsArray

       // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait (!== -1),
      // so at the end we'll have an array of animals that have every one 
      // of the traits when the .forEach() loop is finished.
        personalityTraitsArray.forEach(trait => {
            filteredResults = filteredResults.filter(animal => animal.personalityTraits.indexOf(trait) !== -1);            
        });

    }
       
    if (query.diet)
    {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
        //console.log(filteredResults);
    }

    if (query.species)
    {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }

    if (query.name)
    {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }

    return filteredResults;    
}

















//listen to the server
app.listen(PORT, () => {
    console.log(`App server now on port ${PORT}`);
});
