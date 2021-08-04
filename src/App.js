import React, { Component } from "react";
import "antd/dist/antd.css";
import SearchPage from "./pages/searchpage/SearchPage";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import SentimentGraph from "./components/sentiment-graph/SentimentGraph";

class App extends Component {
  render() {
    console.log(Auth.currentAuthenticatedUser());
    return (
      <div>
        <SentimentGraph />
        <SearchPage />
        <AmplifySignOut />
      </div>
    );
  }
}

export default withAuthenticator(App);
