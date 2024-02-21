import { useContext, useEffect } from 'react';
import AppContext from "./AppContext";

const Home = (props) => {
    const {setParams, setPyWebViewReady} = useContext(AppContext);

    useEffect(() => {
      if (props.params)
      {
        console.log ("Home useEffect " + props.params + " " + props.params.Paper.width);
        if (props.params)
        {
          console.log ("setting up params")
          setParams(props.params);
        }
        

      }
      if (props.webviewready)
          setPyWebViewReady(props.webviewready);
      return () => {
        console.log("Home Cleaning up");
      };
    }, [props.params, setParams, setPyWebViewReady, props.webviewready]);

    return (
    <>
    <div className="Home">
      <h1>DesktopBrailleRAP</h1>
      
      <img src="./braillerap_logo.svg" width='25%' alt="BrailleRAP logo"/>
      </div>
    </>

    );
  };
  
  export default Home;