import { notification, Select, List } from "antd";
import React, { useState } from "react";
import { searchData } from "./dummyData";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./SeachPage.module.css";
import c from "classnames/bind";
import Search from "antd/lib/input/Search";
import { useEffect } from "react";
import { Auth } from "aws-amplify";
import axios, { Routes } from "../../services/axios";

const cx = c.bind(styles);

const { Option } = Select;

const SearchPage = () => {
  const [recentSearchList, setRecentSearchList] = useState(searchData);
  const [searchValue, setSearchValue] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    const userInfo = await Auth.currentUserPoolUser();
    setUserId(userInfo.attributes.sub);
  };

  const handleChange = (value) => {
    if (value === null || value.replace(" ", "") === "") {
      notification.error({
        message: "Please enter non empty string",
      });
      return;
    }
    if (recentSearchList.indexOf(value) === -1) {
      const list = [value, ...recentSearchList];
      setRecentSearchList(list);
    }
    triggerAnalysis(value);
  };

  const triggerAnalysis = async (searchWord) => {
    try {
      const { url, method } = Routes.api.startAnalysis();
      const { data } = await axios[method](url, {
        uid: userId,
        searchKeyword: searchWord,
      });
      notification.success({
        message: "Analysis Started, will update on shortly",
      });
    } catch (err) {
      notification.error({ message: "Trigger Analysis Failed!!" });
    }
  };

  console.log("value", searchValue);

  return (
    <div className={cx("container")}>
      <Search
        value={searchValue}
        className={cx("search-box")}
        placeholder="input search text"
        onSearch={handleChange}
        onChange={(e) => setSearchValue(e.target.value)}
        style={{ width: 200 }}
      />
      <div>
        <List
          size="medium"
          className={cx("recent-search")}
          header={<div>Recent Searches</div>}
          bordered
          dataSource={recentSearchList.filter(
            (searchTerm) =>
              searchTerm.replace(" ", "").length !== 0 &&
              searchTerm.match(new RegExp(searchValue, "i")) !== null
          )}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </div>
    </div>
  );
};

export default SearchPage;
