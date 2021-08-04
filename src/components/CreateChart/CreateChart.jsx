import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./chart.css";

const CreateChart = ({ options, data, type, plugins, keyInfo }) => {
  const myChart = useRef();
  const [chartInstance, setChartInstance] = useState(null);
  useEffect(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }
    console.log("Chart Initiate=", keyInfo, data);
    Chart.plugins.unregister(ChartDataLabels);
    const chartInstanceTemp = new Chart(myChart.current.getContext("2d"), {
      type: type,
      data: data,
      options: options,
      plugins: plugins ? [ChartDataLabels] : null,
    });
    setChartInstance(chartInstanceTemp);
  }, [options, data, type, plugins]);
  return <canvas ref={myChart}></canvas>;
};

export default CreateChart;

//https://www.chartjs.org/docs/latest/getting-started/usage.html
//Props to be passed can be viewed from the documentation link of chart.js given above
