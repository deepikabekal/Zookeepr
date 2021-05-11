//import packages and files
const express = require ('express');
const fs = require ('fs');
const path = require ('path');
//get the data
const { animals } = require ('./data/animals.json');

//instantiate the server
const app = express();

//every server whihc has post request should have the below 2 statements
//parse incoming string or array data to key value pairs which can be accessed in req.body
app.use(express.urlencoded({extended : true}));

//takes incoming JSON data and parses it into the req.body
app.use(express.json());

//tells the server to keep the files ready and not to gate it behind the endpoint
app.use(express.static('public'));

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


//creating a route to get a specific animal
app.get('/api/animals/:id', (req, res) => {    
    const result = findById(req.params.id, animals);    

    //if the user enters an id that exists then rerurn the data related to the id.
    //else return 404 error code whihc will inform the user that the requested resource could not be found.
    if (result)
    {
        res.json(result);
    }
    else
    {
        res.send(404);
    }
    res.json(result);
});

//function to get individual animals
function findById (id, animalsArray) {
    //if the [0] is ommitted then the output will be an array of single item
    //[0] removes the item (which is an object) from the array
    const result = animalsArray.filter( animal => animal.id === id)[0];
    return result;
};


//create a route that accepts data from the client
app.post('/api/animals', (req, res) => {
    //req.body is where our incoming content will be
    //console.log(req.body);
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
    //console.log("name", req.body.example = "ting");

    //const animal = createNewAnimal(req.body, animals);
    //res.json(animal);

    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }

});

//funtion to take data from req.body and add it to aminals.jsson file
function createNewAnimal (body, animalsArray) {
    //console.log(body);
    const animal = body;
    animalsArray.push(animal);

    //the new animal only gets added to the copy of the animals array in this file but not to the animals.json file
    //hence we have to write this data to the animals.json file.
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals : animalsArray }, null, 2)
    );
        //console.log (path.join(__dirname, './data/animals.json' ));
    //return the finished code to the POST route for response
    return (animal);

};

//validation of the data
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
      return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
      return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
      return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
      return false;
    }
    return true;
  };

//html routes
//index
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//animals page
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

//zookeepers page
app.get('/zookeepers', (req,res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

//wildcard routes to redirect the user if entered wrong route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})



//listen to the server
app.listen(PORT, () => {
    console.log(`App server now on port ${PORT}`);
});
