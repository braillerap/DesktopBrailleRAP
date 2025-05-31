import React from 'react';
import AppContext from "../components/AppContext";
import ColorMarker from "../components/ColorMarker";
import DashMarker from "../components/DashMarker"
import patterns from "../patterns/patterns.js"
import dashstroke from "../patterns/dashstroke.js"
import FileSaver from 'file-saver';
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
      console.log ("assoc" + JSON.stringify(assoc));
      console.log ("pattern assoc" + patternindex);
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

/**
 * Saves the current state of patterns and associations into a JSON string.
 * This includes the fill color list, stroke color list, and pattern associations.
 * The resulting JSON can be used to restore the state later.
 *
 * @returns {string} A JSON string containing the state and associations.
 */
  savePatterns() {
    //console.log ("save patterns");
    let canv = this.context.GetPaperCanvas();
    let jsonString =""
    if (canv) {
      // Get the fill and stroke color lists from the canvas
      let fillcolorlist = canv.getFillColorList();
      let strokecolorlist = canv.getStrokeColorList();
      this.setState({ fillcolorlist: fillcolorlist });
      this.setState({ strokecolorlist: strokecolorlist });
      let jsonPatterns = JSON.stringify(this.state)
      // Get the pattern associations from the context
      let assoc = {
        PatternAssoc: this.context.PatternAssoc,
        PatternStrokeAssoc: this.context.PatternStrokeAssoc,
        DashStrokeStyleAssoc: this.context.DashStrokeStyleAssoc
      };
      // Buttons status
      let status = {
        PatternFillRule: this.context.PatternFillRule,
        ForceEdgeRule: this.context.ForceEdgeRule
      };
      // Combine the state and associations into a single object
      jsonPatterns = {
        state: this.state,
        assoc: assoc,
        status: status
      };
      // Convert the object to a JSON string
      jsonString = JSON.stringify(jsonPatterns, null, 2);
    }
    return jsonString;
  }

 /** 
  * Handles the file change event when a new file is selected.  
  * Reads the file content and updates the canvas with the new data.
  * @param {Event} e - The file change event.
  */
  handleSave = async (e) => {
          e.stopPropagation();
          
          let canv = this.context.GetPaperCanvas();
          if (canv) {
             let json_patterns = this.savePatterns();
              if (this.context.PyWebViewReady === false) {
                  let blob = new Blob([json_patterns ], { type: "application/json;charset=utf-8" });
                  FileSaver.saveAs(blob, "page.json");
              }
              else {
                  e.preventDefault();
  
                  //console.log(window.pywebview);
                  //window.pywebview.api.fullscreen();  
                  let dialogtitle = this.context.GetLocaleString("file.save"); //"Enregistrer";
                  let filter = [
                    this.context.GetLocaleString("file.desktopfile"),     //"Fichier json",
                    this.context.GetLocaleString("file.all")              //"Tous"
                  ]
  
                  await window.pywebview.api.save_file(json_patterns , dialogtitle, filter, ["(*.json)", "(*.*)"]);
                  // TODO: dsplay error to user
              }
  
          }
      };
      /**
       *  Handles the file change event when a new file is selected.
       *  Reads the file content and updates the canvas with the new data.
       *  @param {Event} e - The file change event
       */
      handleSaveAs = async (e) => {
        e.stopPropagation();
        
        let canv = this.context.GetPaperCanvas();
        if (canv && this.context.PyWebViewReady) {
            let json_patterns = this.savePatterns();
            e.preventDefault();
            
            let dialogtitle = this.context.GetLocaleString("file.saveas"); //"Enregistrer sous...";
            let filter = [
                this.context.GetLocaleString("file.desktopfile"), //"Fichier json",
                this.context.GetLocaleString("file.all") //"Tous"
            ]

            window.pywebview.api.saveas_file(json_patterns, dialogtitle, filter, ["(*.json)", "(*.*)"]);
            // TODO: display error to the user
        }
    };

    /**
     * Handles the file change event when a new file is selected.
     * Reads the file content and updates the canvas with the new data.
     * @param {Event} e - The file change event.
     */
    handleLoad = async (e) => {
        e.stopPropagation();
        
        let canv = this.context.GetPaperCanvas();
        if (canv && this.context.PyWebViewReady) {
            e.preventDefault();

            let dialogtitle = this.context.GetLocaleString("file.open"); //"Ouvrir"
            let filter = [
                this.context.GetLocaleString("file.desktopfile"), //"Fichier json",
                this.context.GetLocaleString("file.all")//Tous"
            ]
            let ret = await window.pywebview.api.load_file(dialogtitle, filter, ["(*.json)", "all (*.*)"]);
            console.log ("LOAD");
            if (ret.length > 0) {
                let data_string = JSON.parse(ret); 
                let data = JSON.parse(data_string.data);
                console.log ("data" + JSON.stringify(data));
                if (data) {
                  this.setState({fillcolorlist:data.state.fillcolorlist});
                  this.setState({strokecolorlist:data.state.strokecolorlist});
                  this.context.setPatternAssoc(data.assoc.PatternAssoc);
                  this.context.setPatternStrokeAssoc(data.assoc.PatternStrokeAssoc);
                  this.context.setDashStrokeStyleAssoc(data.assoc.DashStrokeStyleAssoc);
                  this.context.setPatternFillRule(data.status.PatternFillRule);
                  this.context.setForceEdgeRule(data.status.ForceEdgeRule);
                  //this.context.GetPaperCanvas().importJSON(data.data);
                  //this.context.GetPaperCanvas().update();
                }
            }
        }
    };

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
    this.condclass = this.context.PyWebViewReady === true ? "" : "pure-button-disabled";
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
        <div className='div_column'>
                <div className="Group">
                    <h3>{this.context.GetLocaleString("file.save")}</h3>
                    <button onClick={this.handleSave} className={`pure-button    `}>{this.context.GetLocaleString("file.save")}...</button>
                    &nbsp;&nbsp;
                    <button onClick={this.handleSaveAs} className={`pure-button ${this.condclass}`}>{this.context.GetLocaleString("file.saveas")}...</button>
                </div> 
                <div className="Group">
                    <h3>{this.context.GetLocaleString("file.open")}</h3>
                    <button onClick={this.handleLoad} className={`pure-button ${this.condclass}`}>{this.context.GetLocaleString("file.open")}...</button>
                    {this.context.PyWebViewReady === false && <input type="file" onChange={this.handleFileChange} className='pure-button' />}
                </div>
            </div>
      </>

    );
  }
};

export default Patterns;