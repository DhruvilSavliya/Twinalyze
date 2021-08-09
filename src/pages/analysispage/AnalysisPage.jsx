import { Col, notification, Row } from "antd";
import React from "react";
import { useState } from "react";
import { Fragment } from "react";
import { useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import SentimentBarGraph from "../../components/sentiment-bar-graph/SentimentBarGraph";
import NamedEntities from "../../components/WordCloud";
import SentimentGraph from "../../components/sentiment-graph/SentimentGraph";
import axios, { Routes } from "../../services/axios";

const AnalysisPage = () => {
  const { id } = useParams();
  const [sentimentArray, setSentimentArray] = useState([]);
  const [tweetList, setTweetList] = useState([]);
  const [tempwords, setTempWords] = useState([]);
  const history = useHistory();

  useEffect(() => {
    loadTweetData(id);
    console.log(id);
  }, [id]);

  const loadTweetData = async (id) => {
    const { url, method } = Routes.api.getTweetReportByAnalysisId(id);
    try {
      const { data } = await axios[method](url);
      console.log(data);
      if (data.data.length > 0) {
        const tempArr = [];
        const tweetListArr = [];
        data.data.map((tweetInfo, index) => {
          const sentiment = JSON.parse(tweetInfo.sentiment);
          tempArr.push(sentiment);
          tweetListArr.push({
            tweetNumber: tweetInfo.tweetNumber,
            sentiment: JSON.parse(tweetInfo.sentiment),
            text: tweetInfo.text,
          });
        });
        setSentimentArray(tempArr);
        setTweetList(tweetListArr);
      }
    } catch (err) {
      notification.error({
        message: "Error in fetching data",
      });
    }
  };

  console.log("Sentiment Array", sentimentArray);

  return (
    <Container>
      <div>
        <Button onClick={() => history.push("/")} variant="success">
          Go Back
        </Button>
        <NamedEntities />
        <Fragment>
          {tweetList &&
            tweetList
              .sort((a, b) => a.tweetNumber - b.tweetNumber)
              .map((tweet, index) => {
                return (
                  <div
                    key={index}
                    className="mt-3"
                    style={{ border: "2px solid black" }}
                  >
                    <Row className="w-100">
                      <Col className="d-flex flex-column justify-content-center w-100">
                        <div className="text-center py-2">
                          Tweet: {tweet.text}
                          <hr />
                        </div>
                        <SentimentBarGraph
                          key={index}
                          sentimentScore={tweet.sentiment.SentimentScore}
                          sentiment={tweet.sentiment.Sentiment}
                          tweetNumber={tweet.tweetNumber}
                          className="py-2"
                        />
                      </Col>
                    </Row>
                  </div>
                );
              })}
        </Fragment>
        <Fragment>
          {sentimentArray && (
            <div className="mt-3">
              <SentimentGraph sentimentAnalysis={sentimentArray} />
            </div>
          )}
        </Fragment>
      </div>
    </Container>
  );
};

export default AnalysisPage;
