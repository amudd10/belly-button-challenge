//OUTLINE
// 1.  Webpage will have the following:
//     *  Dropdown that will allow selection of a name/id
//     *  Horizontal bar chart that shows data related to only the id
//     *  Bubble chart shows data related only to id
//     *  Summary section that only shows data related to id
// 2.  So every graphic needs the id and the only part that is independent is the dropdown
// 3.  The dropdown has many options so it needs created dynamically based on what is in the data file
// 4.  The page will load with a default selected id but needs to update based on the dropdown selection
//     *  This tells me that I need to run code once and then same code again with only an id change.
//     *  This sounds like a good time to use a function like  `createPlot(id)`
// 5.  Note:  The html already has several things built-in:
//     a.  you are given empty divs with ids called:
//         *  `selDataset` ==> used for the dropdown
//         *  `sample-metadata` ==> used for the summary data section
//         *  `bar` ==> used for the horizontal bar chrt
//         *  `gauge` ==> (optional) used for gauge chart
//         *  `bubble` ==> used for bubble chart
//     b.  There is an inline event handler in the html.  It looks like this:
//         `<select id="selDataset" onchange="optionChanged(this.value)"></select>`
//         This line of code is part of the dropdown, aka in html terms a `select`
//         If you look up the code for a select it is made up of options (dropdown entries)
//         and values associated with each option.  The value for the select is based on what option is selected.
//         i.e.  Dropdown has selected 'Subject 940' and maybe the value associated with this is `940`.
//               The '940' is captured by using 'this.value'... So 'this.value' captures the current selection value.
//               The 'optionChanged()' is a function that you need to make in your app.js that updates
//               some type of data filter that filters the data only related to '940' and then that 
//               data is used in all the charts.
//     c.  On Day 3 we will cover event handlers from the js file but we do not cover inline event handlers in the html.  
//         The only differene is where we call them but otherwise they work the same.
//     d.  You already have the data connected - notice the names list matches the id's used in the 
//         other data structures below.  Inspect the data - there are several sections - which one would 
//         be used for each chart?  Look at the images in the readme and matchup the data.  There is not
//         much that needs done except filtering and ordering of the existing data.



// SAMPLE STRUCTURE
// 1.  Check inspector console to see if each function is running on page load
//Cast URL to variable(constant)


// function that contains instructions at page load/refresh
// function does not run until called

// code that runs once (only on page load or refresh)
//Cast URL to variable(constant)
const aws = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

function init() {
    // Fetch the json Data and console log it
    d3.json(aws).then(data => {
        console.log(data);
        console.log(data.names[0]);

        let names = data.names;

        names.forEach((name) => {
            d3.select('#selDataset').append("option").text(name);
        })
        //sample variables
        let dataValue = data.samples[0].sample_values;
        let dataLabel = data.samples[0].otu_labels;
        let dataIDs = data.samples[0].otu_ids;
        //Top 10 OTU's for individual
        let top10value = dataValue.slice(0, 10).reverse();
        let top10label = dataLabel.slice(0, 10).reverse();
        let top10ids = dataIDs.slice(0, 10).reverse();

        let OTUids = top10ids.map(e => "OTU " + e);
        console.log(`OTU IDs: ${OTUids}`)

        let trace1 = {
            x: top10value,
            y: OTUids,
            text: top10label,
            type: 'bar',
            orientation: 'h'
        };
        let barData = [trace1];

        let layout = {
            title: "Top 10 Bacteria Cultures Found ",
        };
        //Plot
        Plotly.newPlot("bar", barData, layout);
        //Bubble Scatter
        let trace2 = {
            x: dataIDs,
            y: dataValue,
            text: dataLabel,
            mode: 'markers',
            marker: {
                color: dataIDs,
                size: dataValue
            }

        };
        let bubbleData = [trace2];

        let bubbleLayout = {
            title: 'Bacteria Cultures Per Sample',
        };
        //Plot Bubble Scatter
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);

        // Demographic Panel
        // d3.json(aws).then(data => {
        let panelData = data.metadata.filter(e => e.id === 940)[0];
        console.log(panelData);
        let demoPanel = d3.select(`#sample-metadata`);
        demoPanel.html("");
        Object.entries(panelData).forEach((key) => {
            // console.log(key, panelData[key]);
            demoPanel.append('p').text(key[0] + " : " + key[1] + "\n");
            // (key,panelData) => d3.select(`#sample-metadata``)
        });



        // });
        //Gauge 
        let wfreqDef = panelData.wfreq;
        var guageData = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: wfreqDef,
                title: { text: "Belly Button Washing Frequency <br> Scrubs per Week", font: { size: 24 } },
                type: "indicator",
                mode: "gauge+number+delta",
                delta: { reference: 380 },
                gauge: {
                    axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
                    steps: [
                        { range: [0, 2], color: "rgb(0, 128, 64)" },
                        { range: [2, 4], color: "rgb(0, 128, 96)" },
                        { range: [4, 6], color: "rgb(0, 128, 128)" },
                        { range: [6, 8], color: "rgb(0, 96, 128)" },
                        {range: [8, 10], color: "rgb(0, 64, 128)" }
                    ],
                    threshold: {
                        line: { color: "rgb(255, 102, 0)", width: 4 },
                        thickness: 0.75,
                        value: 490
                    }
                }
            }
        ];

        var guageLayout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', guageData, guageLayout);

        // });


        // this checks that our initial function runs.
        console.log("The Init() function ran")

        // create dropdown/select


        // run functions to generate plots
        createScatter('940')
        createBar('940')
        createSummary('940')

    });
}
// function that runs whenever the dropdown is changed
// this function is in the HTML and is called with an input called 'this.value'
// that comes from the select element (dropdown)
function optionChanged(newID) {
    // code that updates graphics
    // one way is to recall each function
    createScatter(newID)
    createBar(newID)
    createSummary(newID)

}

function createScatter(id) {
    // code that makes scatter plot at id='bubble'

    // checking to see if function is running
    console.log(`This function generates scatter plot of ${id} `)
}

function createBar(id) {
    // code that makes bar chart at id='bar'

    // checking to see if function is running
    console.log(`This function generates bar chart of ${id} `)

}

function createSummary(id) {
    // code that makes list, paragraph, text/linebreaks at id='sample-meta'

    // checking to see if function is running
    console.log(`This function generates summary info of ${id} `)
}


// function called, runs init instructions
// runs only on load and refresh of browser page
init();





// STRATEGIES
// 1.  Inside-Out:  Generate each chart by assuming an ID/name then refactor the code to 
//                  work for any ID/name coming from the function.  I typically do this practice.
// 2.  Outside-In:  Generate the control (dropdown) and how the control interacts with the other parts.
//                  I gave you the basics of how it interacts above.  You could generate the dropdown
//                  and then see in the console the ID/names update as you make a change.  Then you could
//                  make your chart code.

// Overall, the above are the two steps you need to do (1.  Make plots with data, 2. make dropdown that passes id to functions)
// You could do it in either order.