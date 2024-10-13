import React from 'react';
import AppContext from "../components/AppContext";
import ColorMarker from "../components/ColorMarker";

class Patterns extends React.Component {
  static contextType = AppContext;
  
  constructor(props) {
    super(props);
    this.state = {
      falsestateforwarning: false
    };
  }

  componentDidMount() {
    
    
  }

  render() {
    return (
      <>
        <div >
          
          <h1>Selection de motif</h1>
          <div className='patternlist'>
            <div>
                <ColorMarker fillcolor="green" size="2rem"/>
                <select >
                    <option value="0">hrz6</option>
                    <option value="1">vert6</option>
                </select>
            </div>
            <div>
                <ColorMarker fillcolor="red" size="64px"/>  
                <select >
                    <option value="0">hrz6</option>
                    <option value="1">vert6</option>
                </select>
            </div>
          
          <ColorMarker fillcolor="yellow" size="2em"/>
          <ColorMarker fillcolor="yellow" size="4em"/>
          <ColorMarker fillcolor="yellow" size="8em"/>
          </div>
        </div>
      </>

    );
  }
};

export default Patterns;