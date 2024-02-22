import React from 'react';
import { useContext, useEffect } from 'react';
import AppContext from "./AppContext";

class Home extends React.Component {
  static contextType = AppContext;
  //const {setParams, setPyWebViewReady} = useContext(AppContext);
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.params) {
      console.log("Home componentDidMount " + this.props.params + " " + this.props.params.Paper.width);
      if (this.props.params) {
        console.log("setting up params")
        this.context.setParams(this.props.params);
      }
    }

    if (this.props.webviewready)
      this.context.setPyWebViewReady(this.props.webviewready);
    return () => {
      console.log("Home Cleaning up");
    };
  }

  render() {
    return (
      <>
        <div className="Home">
          <h1>DesktopBrailleRAP</h1>

          <img src="./braillerap_logo.svg" width='25%' alt="BrailleRAP logo" />
        </div>
      </>

    );
  }
};

export default Home;