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
  renderPattern (patternid)
  {
    if (patternid >= 0)
    {
      const srcpat = "data:image/png;base64," + patterns[patternid].image;
      return (<img src={srcpat}/>);
    }
    return (<></>);
  }
  renderColorMap ()
  {
    return this.state.fillcolorlist.map((fillcolor, index) => {
      let selected = -1;
      let patimg="";
      console.log ("assoc" + this.context.PatternAssoc);
      if (this.context.PatternAssoc[fillcolor.color] !== undefined)
      {
        selected = this.context.PatternAssoc[fillcolor.color];
        
      }
      return (
        <div className='patternitem'>
          <ColorMarker fillcolor={fillcolor.csscolor} size="3rem"/>
         
          <select 
            onChange={(event) => this.onFillPatternChange(event, fillcolor.color)}
            
            value={selected}
            
          >
            <option value={-1}>{this.context.GetLocaleString("pattern.selectempy")}</option>
            { patterns.map((pattern, index) =>
            {
              
              return (
                <option value={index} >
                  
                  
                  {pattern.fname} 
                </option>);
            } )}
          </select>
          {this.renderPattern(selected)}
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