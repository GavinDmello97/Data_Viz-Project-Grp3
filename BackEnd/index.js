// import * as fs from 'fs';
// import * as fs from 'fs/promises';
 
// import * as d3 from 'd3'

const { default: axios } = require('axios');
const express=require('express');  // importing express using require
const app = express(); //Creating an instance of express
const fs = require('fs')


url = "https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.json"
const getAll = ()=> { axios.get(url).then((response)=>{
   // return response.data
   const allValues= response.data;
   return (response.data)
    //console.log(response.data)
})
}

console.log(getAll)
//.catch(error=>{console.log( )})



app.get('/',(req,res)=>{
    res.send('<h2 style="margin:2rem"> Welcome to Homepage</h2>');
})

app.get('/about',(req,res)=>{
    res.send('<h2 style="margin:2rem"> Welcome to About us page</h2>');
})

app.get('/data',(req,res)=>{
    res.send(data);
})

app.get("/list_movies", (req, res) => {
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
            console.log("DATASET OF "+ elementDate, filteredEvents)
            customArray.push({date: elementDate, countryList:filteredEvents})

            
        })
        res.send(customArray);

})


});




var data = fs.readFileSync("C02_EmissionCleaned.csv", "utf8")
//z= function (data) {return {xyz :data}}
// console.log(data)

// d3.csv('C02_EmissionCleaned.csv').then(data=>{
//     console.log("hello")
// })

const port = process.env.PORT || 3000 //First inititalizing the port

app.listen(port,()=>{
    console.log(`Express is listening on port:${port}`)
    fs.readFile(__dirname + '/' + 'CO2_EmissionClean.json',  (err, data) => {
        // console.log(data)
    });
})//Second we are going to listen to that port 

//Route the user to the page that user wants to visit