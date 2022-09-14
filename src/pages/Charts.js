import React, { Component } from "react";
import Chart from "chart.js/auto";
let colors = [
  "rgba(255, 99, 132, 0.5)",
  "rgba(53, 162, 235, 0.5)",
  "rgba(249, 99, 5, 0.5)",
];

export default class Charts extends Component {
  constructor(props) {
    super(props);
    this.myChart = null;
  }
  chartRef = React.createRef();
  state = {
    filter: "",
    type: "bar",
    data: { ...apiData },
    data2: {
      type: this.props.type || "bar",
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
          title: {
            display: true,
            text: "Title",
            font: {
              size: 24,
            },
          },
        },
        scales: {
          // xAxes: [{ gridLines: { drawBorder: false } }],
          // yAxes: [{ gridLines: { drawBorder: false } }],
          x: {
            grid: {
              display: false,
            },
            ticks: {
              display: true, // remove y label
              font: {
                family: "Poppins", // Your font family
                size: 14,
              },
            },
          },
          y: {
            stepSize: 1,
            beginAtZero: true,
            grid: {
              display: false,
              drawBorder: false, // remove y-axis border
              color: "gray", //grid line
            },
            ticks: {
              fixedStepSize: 1,
              display: true, // remove y label
              font: {
                family: "Poppins", // Your font family
                size: 14,
              },
              // Include a dollar sign in the ticks
              callback: function (value, index, values) {
                // return "$" + value;
                return value;
              },
            },
          },
        },
      },
    },
    selectedOption: {
      name: "Day",
      id: "hrs_wise",
    },
  };
  setData = (reff) => {
    this.myChart = new Chart(reff, {
      data: { ...apiData[this.state.filter] },
      type: this.state.type,
      responsive: false,
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  };

  componentDidMount() {
    let keys = Object.keys(this.state.data);
    this.setState({ filter: keys[0] }, () => {
      const myChartRef = this.chartRef.current.getContext("2d");
      this.setData(myChartRef);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // if (prevState.filter !== this.state.filter) {
    // }
    // if (prevState.filter !== this.state.filter) {
    //   let chartStatus = Chart.getChart("thispropsid"); // <canvas> id
    //   console.log(chartStatus);
    //   if (chartStatus != undefined) {
    //     // chartStatus.destroy();
    //     this.myChart?.destroy();
    //   }
    //   console.log("first123");
    //   const myChartRef = this.chartRef.current.getContext("2d");
    //   this.setData(myChartRef);
    // }
  }

  render() {
    return (
      <div className="chart">
        {console.log(this.state)}
        <div className="filters">
          {Object.keys(this.state.data).map((item) => (
            <button
              onClick={() => {
                this.setState({ filter: item }, () => {
                  this.myChart.destroy();
                  const myChartRef = this.chartRef.current.getContext("2d");
                  this.setData(myChartRef);
                });
              }}
              key={item}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="type filters">
          <button
            onClick={() => {
              this.setState({ type: "bar" }, () => {
                this.myChart.destroy();
                const myChartRef = this.chartRef.current.getContext("2d");
                this.setData(myChartRef);
              });
            }}
          >
            Bar
          </button>
          <button
            onClick={() => {
              this.setState({ type: "line" }, () => {
                this.myChart.destroy();
                const myChartRef = this.chartRef.current.getContext("2d");
                this.setData(myChartRef);
              });
            }}
          >
            Line
          </button>
        </div>
        <canvas id={"thispropsid"} ref={this.chartRef} />
      </div>
    );
  }
}

const apiData = {
  week: {
    labels: [
      "Sunday",
      "Monday",
      "Teusday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    datasets: [
      {
        label: "Dataset 1",
        data: [217594, 181045, 15060, 106519, 105162, 95072, 89744],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      // {
      //   label: "Dataset 1",
      //   data: [217594, 181045, 15060, 106519, 105162, 95072, 89744],
      //   backgroundColor: "rgba(255, 99, 132, 0.5)",
      // },
    ],
  },
  month: {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Dataset 1",
        data: [
          317594, 181045, 153060, 106519, 105162, 95072, 89744, 153060, 106519,
          105162, 181045, 153060,
        ],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  },
  year: {
    labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
    datasets: [
      {
        label: "Dataset 1",
        data: [117594, 217594, 181045, 15060, 1080, 105162, 95072, 89744],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  },
};

const data = {
  type: "bar",
  data: {
    ...apiData.year,
  },
  responsive: false,
  options: {
    plugins: {
      legend: {
        display: false,
      },
    },
  },
};
