import React, { Component } from "react";
import "antd/dist/antd.css";
import SearchPage from "./pages/searchpage/SearchPage";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

class App extends Component {
  render() {
    return (
      <div>
        <SearchPage />
        <AmplifySignOut />
      </div>
    );
  }
}

export default withAuthenticator(App);
