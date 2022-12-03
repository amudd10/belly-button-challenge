//Cast URL to variable(constant)
const aws = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Promise Pending
const dataPromise = d3.json(aws);
console.log("Data Promise: ", dataPromise);

// Fetch the json Data and console log it
d3.json(aws).then(data => {
    console.log(data);
    console.log(data.names[0]);

    let names = data.names;

    names.forEach((name) => {
        d3.select('#selDataset').append("option").text(name);
    });
});