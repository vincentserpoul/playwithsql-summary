'use strict';

let benchResultsData;

// retrieve json from github
const getBenchResults = () => 
    fetch('https://raw.githubusercontent.com/vincentserpoul/playwithsql/master/bench/status/kubernetes/results.log')
    .then((response) => {
        if(response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .catch((error) =>  {
        console.log('There has been a problem with your fetch operation: ' + error.message);
    });

const displayGraph = (measurementType) => {
    const graph = document.getElementById("graph");

    // Remove previous existinf nodes
    graph.childNodes.forEach((node) => {
        if(node.tagName == 'CANVAS') {
            node.parentNode.removeChild(node);
        }
    });

    const ctx = document.createElement("canvas");
    graph.appendChild(ctx);

    // const ctx = document.getElementById("benchResultsChart");
    const benchResultsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["create", "updateStatus", "selectEntityoneByStatus", "selectEntityoneOneByPK"],
            datasets: extractDatasets(benchResultsData, measurementType),
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });    
}

const extractDatasets = (benchResultsData, measurementType) => {
    const extractedDatasets = [];
    const backgroundColor =   'rgba(255, 99, 132, 0.2)';
    const borderColor = '#efefef';
    const borderWidth = 1;

    benchResultsData.map((data) => {
        const dbDataset = {};
        dbDataset["label"] = data.DBType;
        dbDataset["data"] = [];
        data.BenchResults.map((res) => {
            dbDataset["data"].push(res[measurementType]);
        });
        dbDataset["backgroundColor"] = stringToColour(data.DBType);
        dbDataset["borderColor"] = borderColor;
        dbDataset["borderWidth"] = borderWidth;
        extractedDatasets.push(dbDataset);
    });

    return extractedDatasets;
}

const stringToColour = (str) => {
    let hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 4) - hash);
    }
    let colour = '#';
    for (var i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}

getBenchResults().then((response) => {
    benchResultsData = response;
    displayGraph('Throughput');
    return;
});