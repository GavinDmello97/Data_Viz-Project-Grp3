// import * as fs from 'fs';
// import * as fs from 'fs/promises';
 
// import * as d3 from 'd3'

const express=require('express');  // importing express using require
const app = express(); //Creating an instance of express
const fs = require('fs')
const cors = require('cors');

//const d3 = require("d3");

app.get('/',(req,res)=>{
    res.send('<h2 style="margin:2rem"> Welcome to Homepage</h2>');
})

app.get('/about',(req,res)=>{
    res.send('<h2 style="margin:2rem"> Welcome to About us page</h2>');
})

app.get('/data',(req,res)=>{
    res.send(data);
})

app.get("/co2-emission", cors(),(req, res) => {
    let customArray = []

    fs.readFile(__dirname + '/' + 'CO2_EmissionClean.json',"utf8",  (err, data) => {
        let mainDataSet  = JSON.parse(data)
        // console.log(mainDataSet[0]["Year"])
        var unique = (src, fn) => src.filter((s => o => !s.has(fn(o)) && s.add(fn(o)))(new Set));
        let filteredYears = unique(mainDataSet, (data) => data.Year)

        let abc = []
        
        for (let i = 0; i< filteredYears.length; i++) {
            if(filteredYears[i].Year !== null) {
                abc.push( filteredYears[i].Year)
            }
        }
        abc.map(elementDate => {
            var filteredEvents = mainDataSet.filter(function(event){
                return event.Year == elementDate;
            });
            // console.log("DATASET OF "+ elementDate, filteredEvents)
            customArray.push({date: elementDate, countryList:filteredEvents})

            
        })
        console.log(customArray)

        res.send(customArray);

})


});

/*
var myJson = {'key' : 'value'}
for(var myKey in myJson){
    console.log("key: " + myKey + ", value: " + myJson[myKey]);
}
*/

const port = process.env.PORT || 3000 //First inititalizing the port

app.listen(port,()=>{
    console.log(`Express is listening on port:${port}`)
    
})//Second we are going to listen to that port 

//Route the user to the page that user wants to visit

//Attempt to load and filter JSON file/object
const jsonData = JSON.parse(fs.readFileSync('CO2_EmissionClean.json','utf-8'))
function where(){
    lodash.where;
} 
var filtered = where(jsonData,{"Year" : "1995"});
console.log(filtered);