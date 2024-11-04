import React from 'react';
import AppContext from "../components/AppContext";
import ColorMarker from "../components/ColorMarker";
import DashMarker from "../components/DashMarker"
import patterns from "../patterns/patterns.js"
import dashstroke from "../patterns/dashstroke.js"

class Patterns extends React.Component {
  static contextType = AppContext;
  
  constructor(props) {
    super(props);
    this.state = {
      
      fillcolorlist:[],
      strokecolorlist:[],

    };

    this.onStrokePatternChange = this.onStrokePatternChange.bind(this);
    this.onFillPatternChange = this.onFillPatternChange.bind(this);
    this.handleRuleChange = this.handleRuleChange.bind(this);
    this.handleEdgeRuleChange = this.handleEdgeRuleChange.bind (this);
  }

  componentDidMount() {
    this.updatefillcolor ();
    this.updatestrokecolor ();
    
  }

  updatestrokecolor ()
  {
    let canv = this.context.GetPaperCanvas ();
    
    if (canv)
    { 
      let strokecolorlist = canv.getStrokeColorList();
      this.setState({strokecolorlist:strokecolorlist});
    }
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

  handleRuleChange (rule)
  {
    this.context.setPatternFillRule(rule);
  }
  handleEdgeRuleChange (rule)
  {
    //console.log ("change rule");
    //console.log (rule);
    let val = this.context.ForceEdgeRule;
    //console.log (val);
    this.context.setForceEdgeRule (rule );
  }
  
  onFillPatternChange (event, fillcolor, index)
  {
    
      let patternindex = event.target.value;
      let assoc = {
        ...this.context.PatternAssoc
        
      };
      assoc[fillcolor] = patternindex;
      this.context.setPatternAssoc(assoc);
    
  }
  onStrokePatternChange (event, strokeColor, index)
  {
    
      let patternindex = event.target.value;
      let assoc = {
        ...this.context.PatternStrokeAssoc
        
      };
      assoc[strokeColor] = patternindex;
      this.context.setPatternStrokeAssoc(assoc);
    
  }
  onStrokeStyleChange (event, strokeColor, index)
  {
    
      let patternindex = event.target.value;
      let assoc = {
        ...this.context.DashStrokeStyleAssoc
        
      };
      assoc[strokeColor] = patternindex;
      this.context.setDashStrokeStyleAssoc(assoc);
    
  }

  
  renderStyle (patternid)
  {
    if (patternid >= 0 && patternid < dashstroke.length)
    {
      
      return (<
        DashMarker dashstyle={dashstroke[patternid].dash} size="128" unit="8"
        />);
    }
    else if (patternid === -1 || patternid === "-1")
    {
      return (<
        DashMarker dashstyle={[[8,0]]} size="128" unit="8"
        />);
    }
    //console.log (typeof(patternid));
    //console.log (patternid);
    return (<></>);
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
  renderColorStrokeStyle ()
  {
    return this.state.strokecolorlist.map((strokecolor, index) => {
      let selected = -1;
      
      //console.log ("stroke assoc" + JSON.stringify(this.context.DashStrokeStyleAssoc));
      
      
      if (this.context.DashStrokeStyleAssoc[strokecolor.color] !== undefined)
      {
        selected = this.context.DashStrokeStyleAssoc[strokecolor.color];
        
      }
      return (
        <div className='patternitem'>
          <ColorMarker fillcolor={strokecolor.csscolor} size="4rem"/>

          <select 
            onChange={(event) => this.onStrokeStyleChange(event, strokecolor.color)}
            value={selected}
          >
            <option value={-1}>{this.context.GetLocaleString("pattern.selectfull")}</option>
            { dashstroke.map((dash, index) =>
            {
              return (
                <option value={index} >
                  {dash.description} 
                </option>);
            } )}
          </select>
          {this.renderStyle(selected)}
        </div>
      );  
    })

  }
  renderColorStrokeMap ()
  {
    return this.state.strokecolorlist.map((strokecolor, index) => {
      let selected = -1;
      
      //console.log ("stroke assoc" + JSON.stringify(this.context.PatternStrokeAssoc));
      
      if (this.context.PatternFillRule === 0)
        return (<></>);

      if (this.context.PatternStrokeAssoc[strokecolor.color] !== undefined)
      {
        selected = this.context.PatternStrokeAssoc[strokecolor.color];
        
      }
      return (
        <div className='patternitem'>
          <ColorMarker fillcolor={strokecolor.csscolor} size="4rem"/>
         
          <select 
            onChange={(event) => this.onStrokePatternChange(event, strokecolor.color)}
            
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

  renderColorFillMap ()
  {
    return this.state.fillcolorlist.map((fillcolor, index) => {
      let selected = -1;
      
      //console.log ("fill assoc" + JSON.stringify(this.context.PatternAssoc));
      
      if (this.context.PatternFillRule === 1)
        return (<></>);

      if (this.context.PatternAssoc[fillcolor.color] !== undefined)
      {
        selected = this.context.PatternAssoc[fillcolor.color];
        
      }
      return (
        <div className='patternitem'>
          <ColorMarker fillcolor={fillcolor.csscolor} size="4rem"/>
         
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
        <div className="patterncontainer">
          
          <h1>{this.context.GetLocaleString("pattern.title")}</h1>
          
          
          <label>

          <input
                            type="radio"
                            id="patternfill"
                            value={0}
                            checked={
                                this.context.PatternFillRule ===
                                0
                            }
                            onChange={() =>
                                this.handleRuleChange(
                                    0
                                )
                            }
                        />
                        {this.context.GetLocaleString("pattern.fillselect")}
          </label>
          <label>

          <input
                            type="radio"
                            id="patternstroke"
                            value={1}
                            checked={
                                this.context.PatternFillRule ===
                                1
                            }
                            onChange={() =>
                                this.handleRuleChange(
                                    1
                                )
                            }
                        />
                        {this.context.GetLocaleString("pattern.strokeselect")}
          </label>
          <div className='patternlist'>
           
          
            {this.renderColorFillMap ()}
          </div>
          
          <div className='patternlist'>
           
          
            {this.renderColorStrokeMap ()}
          </div>
          
          <h1>{this.context.GetLocaleString("pattern.styletitle")}</h1>
          
          <label>
          <input type="checkbox" 
            checked={this.context.ForceEdgeRule === true}
            onChange={e => this.context.setForceEdgeRule(e.target.checked)}

            />
            {this.context.GetLocaleString("pattern.forcedge")}
          </label>

          <div className='patternlist'>
            {this.renderColorStrokeStyle ()}
          </div>
        </div>
      </>

    );
  }
};

export default Patterns;