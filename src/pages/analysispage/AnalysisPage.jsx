import { notification } from 'antd'
import React from 'react'
import { useState } from 'react'
import { Fragment } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import SentimentBarGraph from '../../components/sentiment-bar-graph/SentimentBarGraph'
import SentimentGraph from '../../components/sentiment-graph/SentimentGraph'
import axios, { Routes } from '../../services/axios'

const AnalysisPage = () => {
  const { id } = useParams()
  const [sentimentArray, setSentimentArray] = useState([])
  const [tweetList, setTweetList] = useState([])

  useEffect(() => {
    loadTweetData(id)
    console.log(id)
  }, [id])

  const loadTweetData = async (id) => {
    const { url, method } = Routes.api.getTweetReportByAnalysisId(id)
    try {
      const { data } = await axios[method](url)
      console.log(data)
      if (data.data.length > 0) {
        const tempArr = []
        const tweetListArr = []
        data.data.map((tweetInfo, index) => {
          const sentiment = JSON.parse(tweetInfo.sentiment)
          tempArr.push(sentiment)
          tweetListArr.push({
            tweetNumber: tweetInfo.tweetNumber,
            sentiment: JSON.parse(tweetInfo.sentiment),
            text: tweetInfo.text,
          })
        })
        setSentimentArray(tempArr)
        setTweetList(tweetListArr)
      }
    } catch (err) {
      notification.error({
        message: 'Error in fetching data',
      })
    }
  }

  return (
    <div>
      {tweetList &&
        tweetList.map((tweet, index) => {
          return (
            <Fragment>
              <div>Tweet: {tweet.text}</div>
              <SentimentBarGraph
                key={index}
                sentimentScore={tweet.sentiment.SentimentScore}
                sentiment={tweet.sentiment.Sentiment}
                tweetNumber={tweet.tweetNumber}
              />
            </Fragment>
          )
        })}
      {sentimentArray && <SentimentGraph sentimentAnalysis={sentimentArray} />}
    </div>
  )
}

export default AnalysisPage
