const ENV_STAGING = "https://dv-proj.herokuapp.com"
var contributorData;
var timer;
var isPlaying = false;

var margin = { top: 30, right: 30, bottom: 30, left: 60 },
    width = 480 - margin.left - margin.right,
    height = 190 - margin.top - margin.bottom,
    selectedCountry = "Australia";

/*----------SVG 1: Initializer setter for population line chart--------------*/
d3.select("#pause").style("display", "none");

// append the svg object to the body of the page
var svg1 = d3
    .select("#graphContainer1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + 15 + margin.top + margin.bottom)
    .append("g")
    .attr(
        "transform",
        "translate(" + (margin.left) + "," + margin.top + ")"
    );

// Initialise a X axis :
var x1 = d3.scaleTime().range([0, width]);
var xAxis1 = d3.axisBottom().scale(x1);
svg1
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "myXaxis1");
svg1.append("text")
    .attr("transform", "translate(" + (width / 2 - 20) + " ," + (height + margin.top + 5) + ")")
    .style("font-size", "12px")
    .text("Years");


// Initialize an Y axis
var y1 = d3.scaleLinear().range([height, 0]);
var yAxis1 = d3.axisLeft().scale(y1);
svg1.append("g").attr("class", "myYaxis1");
svg1.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 8)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Population(in millions)");




/*----------SVG 2: Initializer setter for GDP line chart--------------*/

// append the svg object to the body of the page
var svg2 = d3
    .select("#graphContainer2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + 20 + margin.top + margin.bottom)
    .append("g")
    .attr(
        "transform",
        "translate(" + margin.left + "," + margin.top + ")"
    );

// Initialise a X axis:
var x2 = d3.scaleTime().range([0, width]);
var xAxis2 = d3.axisBottom().scale(x2);
svg2
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "myXaxis2");
svg2.append("text")
    .attr("transform", "translate(" + (width / 2 - 20) + " ," + (height + margin.top + 5) + ")")
    .style("font-size", "12px")
    .text("Years");

// Initialize an Y axis
var y2 = d3.scaleLinear().range([height, 0]);
var yAxis2 = d3.axisLeft().scale(y2);
svg2.append("g").attr("class", "myYaxis2");
svg2.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 8)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .text("GDP(in 10 billions)")





/*----------SVG 3: Initializer setter for Coal production line chart--------------*/

// append the svg object to the body of the page
var svg3 = d3
    .select("#graphContainer3")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + 15 + margin.top + margin.bottom)
    .append("g")
    .attr(
        "transform",
        "translate(" + margin.left + "," + margin.top + ")"
    );

// Initialise a X axis:
var x3 = d3.scaleTime().range([0, width]);
var xAxis3 = d3.axisBottom().scale(x3);
svg3
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "myXaxis3");
svg3.append("text")
    .attr("transform", "translate(" + (width / 2 - 20) + " ," + (height + margin.top + 5) + ")")
    .style("font-size", "12px")
    .text("Years");


// Initialize an Y axis
var y3 = d3.scaleLinear().range([height, 0]);
var yAxis3 = d3.axisLeft().scale(y3);
svg3.append("g").attr("class", "myYaxis3");
svg3.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 8)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Energy produce(per million tons)");





let geospatialSvg = d3.select("#canvas");




/*------Fetch data from backend from heroku staging server ---------*/
/*------1. Api for CO2 emission geospatial data---------*/
/*------2. Api for contributors of CO2 emission---------*/

Promise.all([axios.get(ENV_STAGING + '/co2-emission'), axios.get(ENV_STAGING + "/contributors")])
    .then(async response => {
        //CO2 response of dataset from Api 1
        const { data: CO2Data } = response[0];

        //Contributor response of dataset from Api 2
        const { data: ContributorData } = response[1];

        // Initial load of dataset for year 2017
        var countryList = CO2Data[0].countryList

        // Getting topojson from local
        let topoJson = "data/countries-110m.json";

        //Reading and structuring topoJson data
        await Promise.all([d3.json(topoJson)], d3.autoType()).then(
            // Async for ordered render and execution
            async (data) => {
                contributorData = ContributorData

                // initialize the year slider and pass year data
                yearSliderForGeospatialGraph(data[0], CO2Data)

                // load Geospatial graph 
                await main(data[0], countryList)

                // init setter for selected country label
                d3.select("#selectedCountryText").text("Showing contributors for Australia")

                // line graph root initialization
                await update(ContributorData["Australia"].data, ContributorData["Australia"].data, ContributorData["Australia"].data)
                d3.select("#rootLoader").style("display", "none");
                d3.select("#rootOutput").style("display", "flex");

            }).catch(error => { console.log(error) });
    })
    .catch(error => console.log(error));


/*----------Geospatial Graph ------------------*/
main = (topoData, countryData) => {
    let projection = d3.geoEquirectangular().scale(150).translate([500, 250]);
    // converting topojson to geosjon
    let geoJsonData = topojson.feature(
        topoData,
        topoData.objects.countries
    ).features;

    // geopath generator
    let geoGenerator = d3.geoPath().projection(projection);
    let co2Emission = d3.group(countryData, (d) => d.CountryName);

    // getting range for color codes from CO2 value of a selected year 
    let emissionExtent = d3.extent(countryData, (d) => {
        return parseInt(+d.Value);
    });
    emissionExtent[0] = 1;

    // setting min and max range for the color palette  labels
    d3.select("#minRange").html("Min: " + emissionExtent[0] + "K metric tons")
    d3.select("#maxRange").html("Max: " + emissionExtent[1] + "K metric tons")

    // color code setter
    let colorScale = d3
        .scaleLog()
        .domain(emissionExtent)
        .range(["#ff9d99", "#630500"])
        .interpolate(d3.interpolateCubehelix.gamma(1));


    let mapCanvas = geospatialSvg.append("g");
    mapCanvas
        .selectAll("path")
        .data(geoJsonData)
        .enter()
        .append("path")
        .attr("class", "path_geo")
        .attr("d", geoGenerator)
        // .attr("fill", "white")
        .attr("stroke", "lime")
        .attr("stroke-width", "5px")
        .attr("stroke-linejoin", "round")
        // Display tooltip on mouse hover on a country
        .on("mousemove", (mouseData, d) => {
            var co2ValueForSelectedCountry = co2Emission.get(d.properties.name)[0].Value === "200"
                ? "Not available" :
                parseInt(co2Emission.get(d.properties.name)[0].Value).toString() + "K metric tons";
            d3.select("#tooltip")
                .style("opacity", 0.8)
                .style("left", (mouseData.clientX + 10).toString() + "px")
                .style("top", (mouseData.clientY + 10).toString() + "px")
                .html(
                    "<div class='tooltipData'>Country: " +
                    co2Emission.get(d.properties.name)[0].CountryName +
                    "</div>" +
                    "<div class='tooltipData'>Emission: " +
                    co2ValueForSelectedCountry +
                    "</div>"
                );

            mapCanvas.selectAll("path").style("cursor", "pointer");

        })
        // Update line charts and color of selected country when a particular country is clicked
        .on("mousedown", (mouseData, d) => {

            // Update color of countries in geospatial graph
            mapCanvas.selectAll("path").style("fill", (mydata) => {
                if ((mydata.properties.name === d.properties.name)) return "#FFD700"
                else {
                    try {
                        // fill white for countries with no data
                        if (co2Emission.get(mydata.properties.name)[0].Value === "200") return "white"
                        return colorScale(parseInt(co2Emission.get(mydata.properties.name)[0].Value));
                    } catch (error) { return "white"; }
                }
            })
            // update selected country label
            d3.select("#selectedCountryText").text("Showing contributors for " + d.properties.name.toString())
            // update all line graphs
            update(
                contributorData[d.properties.name.toString()].data,
                contributorData[d.properties.name.toString()].data,
                contributorData[d.properties.name.toString()].data
            )
        })
        .on("mouseout", () => d3.select("#tooltip").style("opacity", 0))
        .transition()
        // .delay((d, i) => {
        //     return i * 5;
        // })
        // .duration(700)
        .style("fill", (d) => {
            try {
                if (co2Emission.get(d.properties.name)[0].Value === "200") return "white"
                return colorScale(
                    parseInt(co2Emission.get(d.properties.name)[0].Value)
                );
            } catch (error) {
                return "white";
            }
        })
};



/* Year slider init and updation function */
yearSliderForGeospatialGraph = (topoData, CO2Data) => {
    mobiscroll.settings = {
        theme: 'ios',
        themeVariant: 'light',
        lang: 'en'
    };

    // define years for scroll user for labels and data updation
    var dayNames = [
        '1975', '1985',
        '1995', '2005',
        '2010', '2015',
        '2016', '2017'
    ]

    // setting slider step
    slider = document.getElementById('slider'),
        slider.step = 1

    // Event listener for slider on value changed
    slider
        .addEventListener('change', function (ev) {
            // console.log("Called", ev, this.value)
            if (ev.bubbles === true) {
                clearInterval(timer);
                isPlaying = false;
                d3.select("#pause").style("display", "none");
                d3.select("#play").style("display", "block");
            }
            main(topoData, CO2Data[Math.round(this.value)].countryList)
        });



    mobiscroll.slider('#slider', {
        theme: 'ios',                     // Specify theme like: theme: 'ios' or omit setting to use default
        themeVariant: 'light',            // More info about themeVariant: https://docs.mobiscroll.com/4-10-9/javascript/forms#opt-themeVariant
        lang: 'en',                       // Specify language like: lang: 'pl' or omit setting to use default
        onInit: function (event, inst) {  // More info about onInit: https://docs.mobiscroll.com/4-10-9/javascript/forms#event-onInit
            var labels = slider.parentNode.querySelectorAll('.mbsc-progress-step-label');
            for (var i = 0; i < dayNames.length; ++i) {
                labels[i].innerHTML = dayNames[i];
            }
        },
    });

    // style config for year slider
    mobiscroll.form('#demo', {
        lang: 'en',                       // Specify language like: lang: 'pl' or omit setting to use default
        theme: 'ios',                     // Specify theme like: theme: 'ios' or omit setting to use default
        themeVariant: 'light'             // More info about themeVariant: https://docs.mobiscroll.com/4-10-9/javascript/forms#opt-themeVariant
    });

}


// main update fuction for all 3 line graphs
update = (data1, data2, data3) => {


    updateContributer1(data1)
    updateContributer2(data2)
    updateContributer3(data3)

}

/* Setter function for population line graph */
updateContributer1 = (data) => {

    // Create the X axis:
    x1.domain(
        d3.extent(data, function (d) {
            return new Date(d.year.toString());
        })
    );
    svg1.selectAll(".myXaxis1").transition().duration(3000).call(xAxis1);

    // create the Y axis
    y1.domain(
        [0, d3.extent(data, function (d) {
            return Number(d.population) / 1000000;
        })[1]]
    );
    svg1.selectAll(".myYaxis1").transition().duration(3000).call(yAxis1);

    // Create a update selection: bind to the new data
    var u = svg1.selectAll(".lineTest1").data([data], function (d) {
        // return new Date(d.year.toString());
    });

    // Updata the line
    u.enter()
        .append("path")
        .attr("class", "lineTest1")
        .merge(u)
        .transition()
        .duration(3000)
        .attr(
            "d",
            d3
                .line()
                .x(function (d) {
                    return x1(new Date(d.year.toString()));
                })
                .y(function (d) {
                    return y1(d.population / 1000000);
                })
        )
        .attr("fill", "none")
        .attr("stroke", "#0b84a5")
        .attr("stroke-width", 2.5);
};


/* Setter function for GDP line graph */
updateContributer2 = (data) => {
    // Create the X axis:
    x2.domain(
        d3.extent(data, function (d) {
            return new Date(d.year.toString());
        })
    );

    svg2.selectAll(".myXaxis2").transition().duration(3000).call(xAxis2);

    // create the Y axis
    y2.domain(
        [0, d3.extent(data, function (d) {
            return Number(d.gdp) / 10000000000;
        })[1]]

    );
    svg2.selectAll(".myYaxis2").transition().duration(3000).call(yAxis2);

    // Create a update selection: bind to the new data
    var u = svg2.selectAll(".lineTest2").data([data], function (d) {
        // return new Date(d.year.toString());
    });

    // Updata the line
    u.enter()
        .append("path")
        .attr("class", "lineTest2")
        .merge(u)
        .transition()
        .duration(3000)
        .attr(
            "d",
            d3
                .line()
                .x(function (d) {
                    return x2(new Date(d.year.toString()));
                })
                .y(function (d) {
                    return y2(d.gdp / 10000000000);
                })
        )
        .attr("fill", "none")
        .attr("stroke", "#f6c85f")
        .attr("stroke-width", 2.5);
};

/* Setter function for coal line graph */
updateContributer3 = (data) => {
    // Create the X axis:
    x3.domain(
        d3.extent(data, function (d) {
            return new Date(d.year.toString());
        })
    );
    svg3.selectAll(".myXaxis3").transition().duration(3000).call(xAxis3);

    // create the Y axis
    y3.domain(
        [0, d3.extent(data, function (d) {
            return d.coal_co2;
        })[1]]

    );
    svg3.selectAll(".myYaxis3").transition().duration(3000).call(yAxis3);

    // Create a update selection: bind to the new data
    var u = svg3.selectAll(".lineTest3").data([data], function (d) {
        // return new Date(d.year.toString());
    });

    // Updata the line
    u.enter()
        .append("path")
        .attr("class", "lineTest3")
        .merge(u)
        .transition()
        .duration(3000)
        .attr(
            "d",
            d3
                .line()
                .x(function (d) {
                    return x3(new Date(d.year.toString()));
                })
                .y(function (d) {
                    return y3(d.coal_co2);
                })
        )
        .attr("fill", "none")
        .attr("stroke", "#d0620d")
        .attr("stroke-width", 2.5);
};


playPress = () => {
    if (isPlaying === true) {
        d3.select("#pause").style("display", "none");
        d3.select("#play").style("display", "block");
    } else {
        d3.select("#pause").style("display", "block");
        d3.select("#play").style("display", "none");
    }
    // if (parseInt(slider.value) >= 7 && isPlaying) {

    // }

    if (isPlaying === true) {
        clearInterval(timer)
    } else {
        var slider = document.getElementById('slider')

        slider.value = (parseInt(slider.value) + 1).toString()
        slider.dispatchEvent(new Event('change'));
        timer = setInterval(() => {
            slider = document.getElementById('slider')
            if (parseInt(slider.value) >= 7) {
                clearInterval(timer)
                isPlaying = false;
                d3.select("#pause").style("display", "none");
                d3.select("#play").style("display", "block");
            }
            else {
                slider.value = (parseInt(slider.value) + 1).toString()
                slider.dispatchEvent(new Event('change'));
            }

        }, 2000);
    }


    isPlaying = !isPlaying
}

stop = () => {
    isPlaying = false
    d3.select("#pause").style("display", "none");
    d3.select("#play").style("display", "flex");
    clearInterval(timer)
    var slider = document.getElementById('slider')
    slider.value = "0"
    slider.dispatchEvent(new Event('change'));


}



