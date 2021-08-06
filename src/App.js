import React, { Component } from "react";
import "antd/dist/antd.css";
import SearchPage from "./pages/searchpage/SearchPage";
import AnalysisPage from "./pages/analysispage/AnalysisPage";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import SentimentGraph from "./components/sentiment-graph/SentimentGraph";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route path="/analysis/:id" component={AnalysisPage} />
            <Route path="/" component={SearchPage} exact />
          </Switch>
        </Router>
        <div className="d-flex justify-content-center m-4">
          <AmplifySignOut />
        </div>
      </div>
    );
  }
}

export default withAuthenticator(App);
