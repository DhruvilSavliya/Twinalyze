import { notification, Select, List } from "antd";
import React, { useState } from "react";
import { searchData } from "./dummyData";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./SeachPage.module.css";
import c from "classnames/bind";
import Search from "antd/lib/input/Search";

const cx = c.bind(styles);

const { Option } = Select;

const SearchPage = () => {
  const [recentSearchList, setRecentSearchList] = useState(searchData);
  const [searchValue, setSearchValue] = useState(null);

  const handleChange = (value) => {
    if (value === null || value.replace(" ", "") === "") {
      notification.error({
        message: "Please enter non empty string",
      });
    }
    if (recentSearchList.indexOf(value) === -1) {
      const list = [value, ...recentSearchList];
      setRecentSearchList(list);
    }
  };

  const options = recentSearchList.map((searchTerm, index) => {
    return <Option key={index}>{searchTerm}</Option>;
  });

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
