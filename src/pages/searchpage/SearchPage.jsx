import { notification, Select, List } from 'antd'
import React, { useState, useEffect } from 'react'
import { searchData } from './dummyData'
import { SearchOutlined } from '@ant-design/icons'
import styles from './SeachPage.module.css'
import c from 'classnames/bind'
import Search from 'antd/lib/input/Search'
import { Table } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { Auth } from 'aws-amplify'
import axios, { Routes } from '../../services/axios'
import SentimentBarGraph from '../../components/sentiment-bar-graph/SentimentBarGraph'
import AnalysisPage from '../analysispage/AnalysisPage'
import moment from 'moment'

const cx = c.bind(styles)

const { Option } = Select

const SearchPage = () => {
  const [recentSearchList, setRecentSearchList] = useState(searchData)
  const [searchValue, setSearchValue] = useState(null)
  const [userId, setUserId] = useState(null)
  const [tableData, setTableData] = useState([])

  const history = useHistory()

  useEffect(async () => {
    fetchUserInfo()
    const { url, method } = Routes.api.getRecentSearches(userId)
    const { data } = await axios[method](url)
    setTableData(data.data)
  }, [tableData])

  const fetchUserInfo = async () => {
    const userInfo = await Auth.currentUserPoolUser()
    setUserId(userInfo.attributes.sub)
  }

  const tableRowClickHandler = (id) => {
    console.log('Clicked')
    history.push(`/analysis/${id}`)
  }

  const handleChange = (value) => {
    if (value === null || value.replace(' ', '') === '') {
      notification.error({
        message: 'Please enter non empty string',
      })
      return
    }
    if (recentSearchList.indexOf(value) === -1) {
      const list = [value, ...recentSearchList]
      setRecentSearchList(list)
    }
    triggerAnalysis(value)
  }

  const triggerAnalysis = async (searchWord) => {
    try {
      const { url, method } = Routes.api.startAnalysis()
      await axios[method](url, {
        uid: userId,
        searchKeyword: searchWord,
      })
      notification.success({
        message: 'Analysis Started, will update on shortly',
      })
      const res = Routes.api.getRecentSearches(userId)
      const { data } = await axios[res.method](res.url)
      setTableData(data.data)
    } catch (err) {
      notification.error({ message: 'Trigger Analysis Failed!!' })
    }
  }

  return (
    <div className={cx('container')}>
      <Search
        value={searchValue}
        className={cx('search-box')}
        placeholder='input search text'
        onSearch={handleChange}
        onChange={(e) => setSearchValue(e.target.value)}
        style={{ width: 200 }}
      />
      <div>
        <Table
          striped
          bordered
          hover
          variant='dark'
          style={{ fontSize: '18px' }}
        >
          <thead className='my-4'>
            <tr>
              <th>Analysis Status</th>
              <th>Date</th>
              <th>Search Keyword</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((d) => (
              <tr key={d.analysis_id}>
                <td onClick={() => tableRowClickHandler(d.analysis_id)}>
                  {d.analysis_status}
                </td>
                <td onClick={() => tableRowClickHandler(d.analysis_id)}>
                  {moment.unix(d.date).format('LLL')}
                </td>
                <td onClick={() => tableRowClickHandler(d.analysis_id)}>
                  {d.searchKeyword}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

export default SearchPage

// {data.map((d) => (
//   <tr key={d.analysis_id}>
//     <td onClick={tableRowClickHandler}>{d.analysis_status}</td>
//     <td onClick={tableRowClickHandler}>{d.date}</td>
//     <td onClick={tableRowClickHandler}>{d.searchKeyword}</td>
//   </tr>
// ))}
