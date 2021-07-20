import React, { Component } from "react";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

class App extends Component {
  render() {
    return (
      <div>
        <AmplifySignOut />
        My App
      </div>
    );
  }
}

export default withAuthenticator(App);
