'use strict';

let benchResultsData;

// retrieve json from github
const getBenchResults = () =>
    fetch('https://raw.githubusercontent.com/vincentserpoul/playwithsql/master/bench/status/kubernetes/lateststatus/results.log')
    .then((response) => {
        if(response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .catch((error) =>  {
        console.log('There has been a problem with your fetch operation: ' + error.message);
    });

const displaySelectGraph = (measurementType) => {
    const graph = document.getElementById("selectGraph");

    // Remove previous existinf nodes
    graph.childNodes.forEach((node) => {
        if(node.tagName == 'CANVAS') {
            node.parentNode.removeChild(node);
        }
    });

    const ctx = document.createElement("canvas");
    graph.appendChild(ctx);

    const benchResultsSelectChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["selectEntityoneByStatus", "selectEntityoneOneByPK"],
            datasets: extractDatasets(benchResultsData, measurementType, "select"),
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            },
            title: {
                display: true,
                text: 'Select statements'
            }
        }
    });
}

const displayCRUDGraph = (measurementType) => {
    const graph = document.getElementById("CRUDGraph");

    // Remove previous existinf nodes
    graph.childNodes.forEach((node) => {
        if(node.tagName == 'CANVAS') {
            node.parentNode.removeChild(node);
        }
    });

    const ctx = document.createElement("canvas");
    graph.appendChild(ctx);

    const benchResultsCRUDChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["create", "updateStatus"],
            datasets: extractDatasets(benchResultsData, measurementType, "CRUD"),
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            },
            title: {
                display: true,
                text: 'CRUD statements'
            }
        }
    });
}

const extractDatasets = (benchResultsData, measurementType, statementType) => {
    const extractedDatasets = [];
    const backgroundColor =   'rgba(255, 99, 132, 0.2)';
    const borderColor = '#efefef';
    const borderWidth = 1;

    benchResultsData.map((data) => {
        const dbDataset = {};
        dbDataset["label"] = data.DBType;
        dbDataset["data"] = [];
        data.BenchResults
            .filter((res) => getStatementTypeFromAction(res.Action) == statementType )
            .map((res) => {
                dbDataset["data"].push(res[measurementType]);
            }
        );
        dbDataset["backgroundColor"] = stringToColour(data.DBType);
        dbDataset["borderColor"] = borderColor;
        dbDataset["borderWidth"] = borderWidth;
        extractedDatasets.push(dbDataset);
    });

    return extractedDatasets;
}

const getStatementTypeFromAction = (action) => {
    if(action == "create" || action == "updateStatus"){
        return "CRUD";
    }
    if(action == "selectEntityoneOneByPK" || action == "selectEntityoneByStatus"){
        return "select";
    }
}

const displayGraph = (measurementType) => {
    displayCRUDGraph(measurementType);
    displaySelectGraph(measurementType);
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