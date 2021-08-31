import React from "react";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import GaugeChart from "react-gauge-chart";
const data = {
  labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};
const arbitraryStackKey = "stack1";
const stackData = {
  labels: ["1", "2", "3", "4", "5", "6"],
  datasets: [
    {
      label: "# of Red Votes",
      stack: arbitraryStackKey,
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: "rgb(255, 99, 132)",
    },
    {
      label: "# of Blue Votes",
      stack: arbitraryStackKey,
      data: [2, 3, 20, 5, 1, 4],
      backgroundColor: "rgb(54, 162, 235)",
    },
    {
      label: "# of Green Votes",
      stack: arbitraryStackKey,
      data: [3, 10, 13, 15, 22, 30],
      backgroundColor: "rgb(75, 192, 192)",
    },
  ],
};
//same as stack excluding STACK:arbitraryStackKey;
const groupData = {
  labels: ["1", "2", "3", "4", "5", "6"],
  datasets: [
    {
      label: "# of Red Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: "rgb(255, 99, 132)",
    },
    {
      label: "# of Blue Votes",
      data: [2, 3, 20, 5, 1, 4],
      backgroundColor: "rgb(54, 162, 235)",
    },
    {
      label: "# of Green Votes",
      data: [3, 10, 13, 15, 22, 30],
      backgroundColor: "rgb(75, 192, 192)",
    },
  ],
};

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

export const VerticalBar = () => (
  <div style={{ width: "40vw" }}>
    <div className="header">
      <h1 className="title">Vertical Bar Chart</h1>
    </div>
    <Bar data={data} options={options} />
  </div>
);

export const PieChart = () => (
  <div style={{ width: "40vw" }}>
    <div className="header">
      <h1 className="title">Pie Chart</h1>
    </div>
    <Pie data={data} options={options} />
  </div>
);

export const DoughnutChart = () => (
  <div style={{ width: "40vw" }}>
    <div className="header">
      <h1 className="title">Doughnut Chart</h1>
    </div>
    <Doughnut data={data} options={options} />
  </div>
);

export const StackedBarChart = () => (
  <div style={{ width: "40vw" }}>
    <div className="header">
      <h1 className="title">Stacked Bar Chart</h1>
    </div>
    <Bar data={stackData} options={options} />
  </div>
);

export const GroupedBarChart = () => (
  <div style={{ width: "40vw" }}>
    <div className="header">
      <h1 className="title">Grouped Bar Chart</h1>
    </div>
    <Bar data={groupData} options={options} />
  </div>
);

export const Gauge = () => (
  <div style={{ width: "40vw" }}>
    <div className="header">
      <h1 className="title">Gauge Chart</h1>
    </div>
    <GaugeChart
      id="gauge-chart4"
      nrOfLevels={10}
      arcPadding={0.1}
      cornerRadius={3}
      percent={0.78}
      textColor="black"
    />
  </div>
);
