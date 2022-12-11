

// SAMPLE STRUCTURE
// 1.  Check inspector console to see if each function is running on page load


// function that contains instructions at page load/refresh
// function does not run until called
function init() {
    const aws = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
    // code that runs once (only on page load or refresh)
    d3.json(aws).then(data => {
        console.log(data);
        console.log(data.names[0]);

        // create dropdown/select
        const names = data.names;

        names.forEach((name) => {
            d3.select('#selDataset').append("option").text(name);
        });
        // run functions to generate plots
        let nineForty = names[0]
        createScatter(nineForty)
        createBar(nineForty)
        createSummary(nineForty)
        createGauge(nineForty)

        // this checks that our initial function runs.
        console.log("The Init() function ran")

    })
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
    createGauge(newID)

}

function createBar(id) {
    const aws = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
    d3.json(aws).then(data => {
        let samples = data.samples;
        for (let v = 0; v < samples.length; v++) {
            if (samples[v]['id'] == id) {
                info = samples[v]
            }
        }

        let dataValue = info.sample_values;
        let dataLabel = info.otu_labels;
        let dataIDs = info.otu_ids;
        console.log(dataIDs);
        //Top 10 OTU's for individual
        let top10value = dataValue.slice(0, 10).reverse();
        let top10label = dataLabel.slice(0, 10).reverse();
        let top10ids = dataIDs.slice(0, 10).reverse();
        console.log(top10ids);

        let OTUids = top10ids.map(e => "OTU " + e);
        console.log(`OTU IDs: ${OTUids}`);

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


        // checking to see if function is running
        console.log(`This function generates bar chart of ${id} `)
    });
}

function createScatter(id) {
    const aws = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
    d3.json(aws).then(data => {
        let samples = data.samples;
        for (let v = 0; v < samples.length; v++) {
            if (samples[v]['id'] == id) {
                info = samples[v]
            }
        }
        // code that makes bar chart at id='bubble'
        //sample variables
        let dataValue = info.sample_values;
        let dataLabel = info.otu_labels;
        let dataIDs = info.otu_ids;
        console.log(dataIDs);

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


        // checking to see if function is running
        console.log(`This function generates scatter plot of ${id} `)

    })
}

function createSummary(id) {
    const aws = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

    d3.json(aws).then(data => {
        console.log(data);
        let metaData = data.metadata;
        // code that makes list, paragraph, text/linebreaks at id='sample-meta'
        let panelData = metaData.filter(e => e.id == id)[0];
        console.log(panelData);
        let demoPanel = d3.select(`#sample-metadata`);
        demoPanel.html("");
        Object.entries(panelData).forEach((key) => {
            demoPanel.append('p').text(key[0] + " : " + key[1] + "\n");
        });

        // checking to see if function is running
        console.log(`This function generates summary info of ${id} `)
    })
}

function createGauge(id) {
    const aws = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

    d3.json(aws).then(data => {
        console.log(data);

        let panelData = data.metadata.filter(e => e.id == id)[0];
        let wfreqDef = panelData.wfreq;
        var guageData = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: wfreqDef,
                title: { text: "Belly Button Washing Frequency <br> Scrubs per Week", font: { size: 24 } },
                type: "indicator",
                mode: "gauge+number",
                delta: { reference: 380 },
                gauge: {
                    axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
                    bar: { color: 'rgb(255, 102, 0)'},
                    steps: [
                        { range: [0, 2], color: "rgb(0, 128, 64)" },
                        { range: [2, 4], color: "rgb(0, 128, 96)" },
                        { range: [4, 6], color: "rgb(0, 128, 128)" },
                        { range: [6, 8], color: "rgb(0, 96, 128)" },
                        { range: [8, 10], color: "rgb(0, 64, 128)" }
                    ],
                    threshold: {
                        line: { color: "rgb(255, 255, 255)", width: 4 },
                        thickness: 0.75,
                        value: 490
                    }
                }
            }
        ];

        var guageLayout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', guageData, guageLayout);
        // checking to see if function is running
        console.log(`This function generates guage view of ${id} `)


    })
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