import React from 'react';
import AppContext from "../components/AppContext";
import { Link} from "react-router-dom";
import { FaWrench } from "react-icons/fa6";

class Home extends React.Component {
  static contextType = AppContext;
  
  constructor(props) {
    super(props);
    this.state = {
      falsestateforwarning: false
    };
    this.handleClickparam = this.handleClickparam.bind(this);
  }

  componentDidMount() {
    if (this.props.params) {
      console.log("setting up params")
      this.context.setParams(this.props.params);
    }
    
    //if (this.props.webviewready)
    //  this.context.setPyWebViewReady(this.props.webviewready);
    this.context.ForceResize ();    
  }

  handleClickparam ()
  {
    console.log ("click go to param");
  }

  render() {
    if (this.context.NeedParamCheck)
    {
      return (
                  
              <div>
      
                <h1 aria-label='Formulaire de saisie du texte'>
      
                </h1>
                <Link className="HiddenLink" to="/parameter" onClick={this.handleClickParam}>
                <h2 className="WarningTitle"><FaWrench /> {this.context.GetLocaleString("param.checkliblouis")}</h2>
                </Link>
                <Link to="/parameter" 
                      onClick={this.handleClickParam}
                    >
                      {this.context.GetLocaleString ("menu.param")}
                </Link>
                
              </div>
            );
    }
    return (
      <>
        <div className="Home">
          
          <a href="https://www.braillerap.org" target="_blank" rel="noreferrer">
            <img src="./braillerap_logo.svg" width='25%' alt="BrailleRAP logo"  />
          </a>
          <h1>DesktopBrailleRAP</h1>
          <h2>Version:{`${process.env.REACT_APP_VERSION}`}</h2>

          <h2 className='h2home'></h2>
          <a href="https://www.nlnet.nl" target="_blank" rel="noreferrer">
            <img src="./logo-sh.svg" width='25%' alt="NLnet fundation logo"  />
          </a>
          
        </div>
      </>

    );
  }
};

export default Home;