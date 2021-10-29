// import * as fs from 'fs';
// import * as fs from 'fs/promises';
 
// import * as d3 from 'd3'

const express=require('express');  // importing express using require
const app = express(); //Creating an instance of express
const fs = require('fs')
const lodash = require('lodash')
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

app.get("/co2-emission", (req, res) => {
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
        console.log(abc)
        abc.map(elementDate => {
            var filteredEvents = mainDataSet.filter(function(event){
                return event.Year == elementDate;
            });
            // console.log("DATASET OF "+ elementDate, filteredEvents)
            customArray.push({date: elementDate, countryList:filteredEvents})

            
        })
        res.send(customArray);

})


});

/*
var myJson = {'key' : 'value'}
for(var myKey in myJson){
    console.log("key: " + myKey + ", value: " + myJson[myKey]);
}
*/

/*
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
/*
//Attempt to load and filter JSON file/object
const jsonData = JSON.parse(fs.readFileSync('CO2_EmissionClean.json','utf-8'))
function where(){
    lodash.where;
} 
var filtered = where(jsonData,{"Year" : "1995"});
console.log(filtered);
*/

let svg = d3.select('svg');
let co2JSON = "https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.json";

Promise.all(
    [
        d3.json(co2JSON)
    ]
    //<script>
    let X = d3.range(0,1000,100)


    function plot(X,Y,container=svg,c='black',lw='1px')
    {
        let dataSet = d3.map(X,function (d,i){
            return {x:d,y:Y[i]}
        })
        let line = d3.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; });

        container.append("path")
            .data([dataSet])
            .attr("d",line)
            .attr("fill",'none')
            .style("stroke",c)
            .style("stroke-width",lw.toString()+"px")
    }
    plot(X,X,svg,c='red',lw=2) 
    //</script>   
)

    
