import React from "react";
import { notification } from "antd";
import ReactWordcloud from "react-wordcloud";
import { useState } from "react";

import { useEffect } from "react";

import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import axios, { Routes } from "../services/axios";

const NamedEntities = () => {
  const { id } = useParams();
  const [words, setWords] = useState([]);
  const history = useHistory();
  const [tempwords, setTempWords] = useState([]);

  useEffect(() => {
    wordCloudData(id);
    console.log(id);
  }, [id]);

  const wordCloudData = async (id) => {
    const { url, method } = Routes.api.getTweetReportByAnalysisId(id);
    try {
      const { data } = await axios[method](url);
      for (var i = 0; i < data.data.length; i++) {
        let x = JSON.parse(data.data[i]["key_phrases"]);
        x.forEach(function (arrayItem) {
          let word = {};
          word["text"] = arrayItem.Text;
          word["value"] = arrayItem.Score * 30;
          words.push(word);
        });
        console.log(words);
      }
    } catch (err) {
      notification.error({
        message: "Error in fetching data",
      });
    }
  };

  return (
    <div className="word-cloud">
      <h1>Word Cloud</h1>
      <ReactWordcloud
        words={words}
        options={{
          colors: [
            "#1f77b4",
            "#ff7f0e",
            "#2ca02c",
            "#d62728",
            "#9467bd",
            "#8c564b",
          ],
          enableTooltip: true,
          deterministic: false,
          fontFamily: "impact",
          fontSizes: [20, 40],
          // fontSizes: [20, 60],
          fontStyle: "normal",
          fontWeight: "bold",
          // padding: 1,
          rotations: 2,
          rotationAngles: [90, 0],
          scale: "linear",
          spiral: "rectangular",
          transitionDuration: 10,
        }}
      />
    </div>
  );
};

export default NamedEntities;
