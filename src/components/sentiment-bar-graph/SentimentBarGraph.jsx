import React from "react";
import CreateChart from "../CreateChart/CreateChart";

const SentimentBarGraph = ({ tweetNumber, sentimentScore, sentiment }) => {
  const options = {
    title: {
      display: true,
      text: [`Tweet Number: ${tweetNumber}`, `Overall Sentiment: ${sentiment}`],
    },
    aspectRatio: 1,
    legend: {
      position: "bottom",
    },
    scales: {
      yAxes: [
        {
          display: true,
          ticks: {
            suggestedMin: 0, // minimum will be 0, unless there is a lower value.
            suggestedMax: 1,
          },
        },
      ],
    },
  };

  const data = {
    datasets: [
      {
        label: "POSITIVE",
        data: [sentimentScore.Positive],
        borderColor: "green",
        backgroundColor: "green",
      },
      {
        label: "NEUTRAL",
        data: [sentimentScore.Negative],
        borderColor: "blue",
        backgroundColor: "blue",
      },
      {
        label: "NEGATIVE",
        data: [sentimentScore.Neutral],
        borderColor: "red",
        backgroundColor: "red",
      },
      {
        label: "MIXED",
        data: [sentimentScore.Mixed],
        borderColor: "orange",
        backgroundColor: "orange",
      },
    ],
  };

  return (
    <div style={{ height: 300, width: 300, margin: "auto" }}>
      <CreateChart type="bar" data={data} options={options} />
    </div>
  );
};

export default SentimentBarGraph;
