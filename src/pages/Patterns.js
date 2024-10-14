import React from 'react';
import AppContext from "../components/AppContext";
import ColorMarker from "../components/ColorMarker";
import patterns from "../patterns/patterns.js"

class Patterns extends React.Component {
  static contextType = AppContext;
  
  constructor(props) {
    super(props);
    this.state = {
      falsestateforwarning: false,
      fillcolorlist:[],
      patternassoc:{},
    };
  }

  componentDidMount() {
    this.updatefillcolor ();
    
  }

  updatefillcolor () 
  {
    let canv = this.context.GetPaperCanvas ();
    
    if (canv)
    { 
      let fillcolorlist = canv.getFillColorList();
      this.setState({fillcolorlist:fillcolorlist});
    }
    
  }
  onFillPatternChange (event, fillcolor, index)
  {
    
      let patternindex = event.target.value;
      /*
      let assoc = this.context.PatternAssoc;
      assoc[fillcolor] = patternindex;
      this.context.setPatternAssoc(assoc);
      */
      let assoc = {
        ...this.context.PatternAssoc
        
      };
      assoc[fillcolor] = patternindex;
      this.context.setPatternAssoc(assoc);
    
  }
  renderColorMap ()
  {
    return this.state.fillcolorlist.map((fillcolor, index) => {
      let selected = -1;
      console.log ("assoc" + this.context.PatternAssoc);
      if (this.context.PatternAssoc[fillcolor] !== undefined)
        selected = this.context.PatternAssoc[fillcolor];
      return (
        <div className='patternitem'>
          <ColorMarker fillcolor={fillcolor} size="3rem"/>
          <select 
            onChange={(event) => this.onFillPatternChange(event, fillcolor)}
            
            value={selected}
            
          >
            <option value={-1}>{this.context.GetLocaleString("pattern.selectempy")}</option>
            { patterns.map((pattern, index) =>
            {
              return (<option value={index}>{pattern.fname}</option>);
            } )}
          </select>
        </div>
      );  
    })
  }
  
  render() {
    return (
      <>
        <div >
          
          <h1>{this.context.GetLocaleString("pattern.title")}</h1>
          
          <h2>{this.context.GetLocaleString("pattern.fillselect")}</h2>
          <div className='patternlist'>
           
          
            {this.renderColorMap ()}
          </div>
        </div>
      </>

    );
  }
};

export default Patterns;