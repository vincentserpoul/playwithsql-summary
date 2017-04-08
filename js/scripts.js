'use strict';

// retrieve json from github
const getBenchResults = () => 
    fetch('https://raw.githubusercontent.com/vincentserpoul/playwithsql/master/bench/status/swarm/results.log')
    .then((response) => {
        if(response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .catch((error) =>  {
        console.log('There has been a problem with your fetch operation: ' + error.message);
    });

const displayGraph = (benchResultsObj) => {
    const ctx = document.getElementById("benchResultsChart");
    const benchResultsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
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

getBenchResults()
.then((response) => displayGraph(response));