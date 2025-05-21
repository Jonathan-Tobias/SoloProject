let maxDataPoints = 200; 
let xyValues = [];

let currentNewsImpact = 0; 
let impactDurationLeft = 0; 
let bankruptcyThreshold = 20;

let money = 1000;
let shares = 0;

document.getElementById("buy").addEventListener("click", buyShares);
document.getElementById("sell").addEventListener("click", sellShares);

const newsList = [
  { 
    text: "Rumors of a Major Merger Circulating", 
    impact: 3,     
    duration: 10  
  },
  {
    text: "Insider Trading Investigation Launched", 
    impact: -4, 
    duration: 8
  },
  {
    text: "New Regulation Proposal Under Review",
    impact: -2,         
    duration: 12
  },
  {
    text: "Unexpected CEO Resignation",
    impact: -5,
    duration: 6
  },
  {
    text: "Patent Dispute Settled Out of Court",
    impact: 2,
    duration: 5
  },
  {
    text: "Supply Chain Issues Reported", 
    impact: -3,
    duration: 7
  },
  {
    text: "Strong Quarterly Earnings Forecast",
    impact: 4,
    duration: 5
  },
  {
    text: "New Competitor Enters the Market",
    impact: -3,
    duration: 10
  },
  {
    text: "Analyst Downgrade Issued",
    impact: -6,
    duration: 5
  },
  {
    text: "Analyst Upgrade Issued",
    impact: 6,
    duration: 5
  },
  {
    text: "Geopolitical Tensions Rise in Key Market Region",
    impact: -4,
    duration: 8
  },
  {
    text: "Unexpected Rise in Commodity Prices",
    impact: -3,
    duration: 7
  },
  {
    text: "Tech Breakthrough Announced, Impact Unclear",
    impact: 2,
    duration: 10
  },
];

const chart = new Chart("myChart", {
    type: "line",
    data: {
        datasets: [
            {
                borderColor: "rgb(0,0,255)",
                borderWidth: 2,
                fill: false,
                data: xyValues,
                pointRadius: 0
            },
            {
                label: "Bankruptcy Threshold",
                borderColor: "red",
                borderWidth: 2,
                borderDash: [5, 5],  // dashed line
                fill: false,
                data: [ 
                    { x: 0, y: bankruptcyThreshold },
                    { x: maxDataPoints, y: bankruptcyThreshold }
                ],
                pointRadius: 0,
                tension: 0 // straight line
            }
        ]
    },
    options: {
        legend: {display: true},
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom',
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 20
                }
            }],
            yAxes: [{
                ticks: {
                    min: 0,
                    max: 300
                }
            }],
        },
        animation: {
            duration: 0 
        }
    }
});

function buyShares() {
    if (money > xyValues[xyValues.length - 1].y) {
        money -= xyValues[xyValues.length - 1].y;
        shares++;
    }
}



function sellShares() {
    if (shares > 0) {
        money += xyValues[xyValues.length - 1].y;
        shares--;
    }
}

let tick = 0;

setInterval(() => {
    let lastY = xyValues.length > 0 ? xyValues[xyValues.length - 1].y : 100; 

    // Adjust random offset range by currentNewsImpact
    let minOffset = -9 + currentNewsImpact;
    let maxOffset = 10 + currentNewsImpact;

    let offset = Math.floor(Math.random() * (maxOffset - minOffset + 1)) + minOffset;

    if (impactDurationLeft > 0) {
        impactDurationLeft--;
    } else {
        currentNewsImpact = 0; // reset impact after duration
    }

    let newPrice = lastY + offset;
    newPrice = Math.min(250, Math.max(0, newPrice));

    xyValues.push({x: tick, y: newPrice});
    tick++;

    if(xyValues.length > maxDataPoints) {
        xyValues.shift();
    }

    chart.options.scales.xAxes[0].ticks.min = tick - maxDataPoints;
    chart.options.scales.xAxes[0].ticks.max = tick;

    chart.update();

    if (tick % 15 === 0) {
        const randomNews = newsList[Math.floor(Math.random() * newsList.length)];

        const newsItem = document.createElement("p");
        newsItem.textContent = randomNews.text;
        newsItem.className = "news-item";
        document.getElementById("newsFeed").appendChild(newsItem);

        currentNewsImpact = randomNews.impact;
        impactDurationLeft = randomNews.duration;


    }

    if (newPrice < bankruptcyThreshold) {
        shares = 0;
        
    }

    document.getElementById("money").textContent = `Money: $${money.toFixed(2)}`;
    document.getElementById("shares").textContent = `Shares: ${shares} ($${(shares * newPrice).toFixed(2)})`;
}, 1000);

