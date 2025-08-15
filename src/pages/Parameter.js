import React from 'react';

import AppContext from "../components/AppContext";
import ModalPrintSize from "./ModalPrintSize";
import { FaGear } from 'react-icons/fa6';

function braille_info(fname, desc, lang, region, flags) {
  this.fname = fname;
  this.desc = desc;
  this.lang = lang;
  this.region = region;
  this.flags = flags;
}
class Parameters extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {


      brailleinfo: [],
      data: [],
      localedata: [],
      optimchoice: [],
      papersize: [],
      paperusable:[],
      showModalUsable: false,
      showModalPrintable: false
    }
    this.handleChangePort = this.handleChangePort.bind(this);
    this.handleChangeBraille = this.handleChangeBraille.bind(this);
    this.handleChangePaper = this.handleChangePaper.bind(this);
    this.render_braille_lang = this.render_braille_lang.bind(this);
    this.render_comport = this.render_comport.bind(this);
    this.handleChangeGeneral = this.handleChangeGeneral.bind(this);
    this.handleChangeNumeric = this.handleChangeNumeric.bind(this);
    this.handleRefreshPort = this.handleRefreshPort.bind(this);
    this.handleChangeLanguage = this.handleChangeLanguage.bind(this);
    this.handleChangeOptimLevel = this.handleChangeOptimLevel.bind(this);
    this.render_usable_dialog = this.render_usable_dialog.bind(this);
    this.display_usable_dialog = this.display_usable_dialog.bind(this);
    this.display_printable_dialog = this.display_printable_dialog.bind (this);
  }

  async componentDidMount() {
    // TODO get backend from context not prop

    console.log("componentdidmount parameter");
    if (this.context.PyWebViewReady) {
      let list = await window.pywebview.api.gcode_get_serial();
      console.log("gcode_get_serial" + list)
      let portinfo = JSON.parse(list);
      this.setState({ data: portinfo })
    }
    if (this.props.glouis) {
      let brtable = [];
      let louis = this.props.glouis;
      let nbr = this.props.glouis.get_table_nbr();
      for (let i = 0; i < nbr; i++) {
        let description = louis.get_table_description(i);

        //console.log (description + " " + typeof(flags) + " " + flags.toString(16));
        let br = new braille_info(
          louis.get_table_fname(i),
          description,
          louis.get_table_lang(i),
          louis.get_table_region(i),
          louis.get_table_flags(i)
        );
        brtable.push(
          br
        );

      }
      this.setState({ brailleinfo: brtable });

      let localedata = this.context.GetLocaleData().getLocaleList();
      //console.log ("localedata=" + localedata + " " + this.context.Locale);
      this.setState({ localedata: localedata });
      let optim = [

        this.context.GetLocaleString("param.path_no_optim"),
        this.context.GetLocaleString("param.path_optim_1"),
        this.context.GetLocaleString("param.path_optim_2")
      ];
      this.setState({ optimchoice: optim });

      let papersizes = this.context.Params.PaperSize;
      this.setState({ papersize: papersizes })

      let paperusables = this.context.Params.PaperUsableSize;
      this.setState ({paperusable:paperusables});

    }
    this.context.ForceResize();
  }
  handleRefreshPort() {
    if (this.context.PyWebViewReady) {
      let msg = this.context.GetLocaleString("app.wait");
      this.setState({ comevent: msg })
      window.pywebview.api.gcode_get_serial().then(list => {
        let portinfo = JSON.parse(list);
        let success = this.context.GetLocaleString("param.comportrefreshed");
        this.setState({ data: portinfo, comevent: success })
      }
      );
    }
  }
  handleChangePort(event) {
    let option = {
      ...this.context.Params,
      comport: event.target.value
    };
    this.context.SetOption(option);
  }

  handleChangeBraille(event) {
    let option = {
      ...this.context.Params,
      brailletbl: event.target.value
    };
    this.context.SetOption(option);
  }
  handleChangeLanguage(event) {

    let option = {
      ...this.context.Params,
      lang: event.target.value
    };
    this.context.SetOption(option);
    this.context.SetAppLocale(event.target.value);
  }
  handleChangeOptimLevel(event) {

    let option = {
      ...this.context.Params
    };
   
    option.OptimLevel = parseInt(event.target.value);
    this.context.SetOption(option);

  }
  handleChangePaper(key, value) {

    let option = {
      ...this.context.Params
    };

    option.Paper[key] = parseInt(value);
    this.context.SetOption(option);

    let canv = this.context.GetPaperCanvas();
    if (canv) {
      canv.OnPaperParamChange();
    }


  }
  handleChangeInteger (key, value)
  {
    let option = {
      ...this.context.Params
    };
    console.log (key +" "+ String(value));
    option[key] = parseInt(value);
    console.log (option);
    this.context.SetOption(option);
  }

  handleChangeNumeric(key, value) {
    let option = {
      ...this.context.Params
    };

    option[key] = parseFloat(value);
    this.context.SetOption(option);

  }
  handleChangeGeneral(key, value) {

    let option = {
      ...this.context.Params
    };
    option[key] = value;

    this.context.SetOption(option);
  }

  display_usable_dialog(show) {
    this.setState({ showModalUsable: show });
  }
  display_printable_dialog(show) {
    this.setState({showModalPrintable: show});
  }

  render_lock (locked)
  {
    //console.log (locked);
    if (locked)
      return String.fromCodePoint(0x1f512);
      //return "🔒";
      //return "&#x1F512;";
    else
      return " ";
  }
  render_device_dialog ()
  {
    return (
      <ModalPrintSize 
        show={this.state.showModalPrintable}
        handleOK = {(newlist)=>{
          this.display_printable_dialog(false);
          this.setState ({papersize:newlist});
          
          // set change in global options
          let options = {...this.context.Params};
          options.PaperSize = newlist;
          this.context.SetOption (options); // todo : clarify save option
        }}
        handleCancel = {()=>{this.display_printable_dialog(false)}}
        
        paperusablesize = {this.state.papersize}
        title = {this.context.GetLocaleString("param.modal.title.devicesize")}
        ></ModalPrintSize>);
  }
  render_usable_dialog() {
    return (
      <ModalPrintSize 
        show={this.state.showModalUsable}
        handleOK = {(newlist)=>{
          this.display_usable_dialog(false);
          this.setState ({paperusable:newlist});
          console.log (newlist);
          // set change in global options
          
          let options = {...this.context.Params};
          options.PaperUsableSize = newlist;
          this.context.SetOption (options); // todo : clarify save option
          
        }}
        handleCancel = {()=>{this.display_usable_dialog(false)}}
        
        paperusablesize = {this.state.paperusable}
        title = {this.context.GetLocaleString("param.modal.title.printsize")}
        ></ModalPrintSize>
    );
  }

  render_comport() {
    if (this.state.data === null)
      return (
        <p>{this.context.GetLocaleString("param.nocomport")}</p>
      );
    else if (this.state.data.length === 0)
      return (
        <p>{this.context.GetLocaleString("param.nocomport")}</p>
      );
    else {

      return (
        <>
          <p>
            {this.context.GetLocaleString("param.labelport")}&nbsp;
            <b>{this.context.Params.comport}</b>
          </p>
          <label htmlFor='selectport'>
            {this.context.GetLocaleString("param.labelport")}
          </label>
          <select
            className='select_param'
            onChange={this.handleChangePort}
            value={this.context.Params.comport}
            id="selectport"
            name="selectport">

            {this.state.data.map((line, index) => {
              if (line.device === this.context.Params.comport)
                return (<option key={line.device} value={line.device}>{line.device} {line.description} </option>);
              else
                return (<option key={line.device} value={line.device}>{line.device} {line.description} </option>);
            })
            }
          </select>
        </>
      );
    }
  }
  render_braille_lang() {
    if (this.state.brailleinfo.length === 0) {
      return (<p> {this.context.GetLocaleString("param.nobrailletable")}</p>)
    }
    let selectedtable = "";
    if (this.context.Params.brailletbl < this.state.brailleinfo.length)
      selectedtable = this.state.brailleinfo[this.context.Params.brailletbl].desc;
    return (
      <>

        <p>
          {this.context.GetLocaleString("param.brailletable")}&nbsp;
          <b>{selectedtable}</b>
        </p>

        <label for="combobraille">
          {this.context.GetLocaleString("param.brailleselectlabel")}
        </label>
        <select className='select_param'
          onChange={this.handleChangeBraille}
          value={this.context.Params.brailletbl}
          name="combobraille"
          id="combobraille"

        >


          {this.state.brailleinfo.map((item, index) => {
            if (index === this.context.Params.brailletbl)
              return (<option key={index} value={index}>{item.lang + " - " + item.desc}</option>);
            else
              return (<option key={index} value={index}>{item.lang + " - " + item.desc}</option>);
          })
          }

        </select>

      </>
    );

  }
  render() {


    return (
      <div>
        {this.render_device_dialog()}
        {this.render_usable_dialog()}
        <h2>{this.context.GetLocaleString("param.formtitle")}</h2>

        <div className="pure-form pure-form-aligned">
          <div className="pure-control-group">

            <fieldset>
              <label for="papersize">
                {this.context.GetLocaleString ("param.device_size")}
              </label>
              <button className="pure-button button-xlarge"
                  aria-label={this.context.GetLocaleString ("param.custom.device_size.aria")}
                  onClick={() => { this.setState({ showModalPrintable: true }) }}>
                  <FaGear/>
                  
              </button>
              <select id="papersize"

                className='select_param'
                value={this.context.Params.SizeIndex}
                onChange={(e)=>{
                  console.log (e);
                  let index = parseInt(e.target.value);
                  console.log (index);

                  let option = {
                    ...this.context.Params
                  };
                  
                  option.SizeIndex = index;
                  option.Paper.width = this.state.papersize[index].width;
                  option.Paper.height = this.state.papersize[index].height;
                  console.log(option);
                  this.context.SetOption(option);
                  
                  let canv = this.context.GetPaperCanvas();
                  if (canv) {
                    canv.OnPaperParamChange();
                  }
                }}
              >
                {this.state.papersize.map((item, index) => {
                  if (this.context.Params.SizeIndex === index)
                    return (<option aria-selected={true} key={item} value={index}>{this.render_lock(item.lock)} {item.name} [{item.width}mm x {item.height}mm]</option>);
                  else
                    return (<option aria-selected={false} key={item} value={index}>{this.render_lock(item.lock)} {item.name} [{item.width}mm x {item.height}mm]</option>);
                })
                }
                

              </select>
                
              <br/>
              <label for="usablepaper">
                {this.context.GetLocaleString ("param.usable_size")}
                 </label>
                 <button className="button-small pure-button" 
                 aria-label={this.context.GetLocaleString ("param.custom.usable_size.aria")}
                onClick={() => { this.setState({ showModalUsable: true }) }}
              >
                <FaGear/>
              </button>
              <select id="usablepaper"
                value={this.context.Params.UsableSizeIndex}
                onChange={(e)=>{
                  let index = parseInt(e.target.value);
                  //this.handleChangeInteger ("UsableSizeIndex", e.target.value);
                  //this.handleChangePaper ('usablewidth', this.state.paperusable[index].width);
                  //this.handleChangePaper ('usableheight', this.state.paperusable[index].height);
                  
                  //let index = parseInt(e.target.value);
                  console.log (index);

                  let option = {
                    ...this.context.Params
                  };
                  
                  option.UsableSizeIndex = index;
                  option.Paper.usablewidth = this.state.paperusable[index].width;
                  option.Paper.usableheight = this.state.paperusable[index].height;
                  console.log(option);
                  this.context.SetOption(option);
                  //this.handleChangeInteger ("SizeIndex", e.target.value);
                  //this.handleChangePaper ('width', this.state.papersize[index].width);
                  //this.handleChangePaper ('height', this.state.papersize[index].height);

                  let canv = this.context.GetPaperCanvas();
                  if (canv) {
                    canv.OnPaperParamChange();
                  }
                }}
                className='select_param'
              >
                {this.state.paperusable.map((item, index) => {
                  if (this.context.Params.UsableSizeIndex === index)
                    return (<option aria-selected={true} key={item} value={index}>{this.render_lock(item.lock)} {item.name} [{item.width}mm x {item.height}mm]</option>);
                  else
                    return (<option aria-selected={false} key={item} value={index}>{this.render_lock(item.lock)} {item.name} [{item.width}mm x {item.height}mm]</option>);
                })
                }
                

              </select>
             
              
              
            </fieldset>

          </div>

          <div className="pure-control-group">
            <fieldset>
              <legend>BrailleRAP</legend>
              <div className="pure-control-group">



                <label for="myInputStep">

                  {this.context.GetLocaleString("param.path_step")}:
                </label>
                <input type="number"
                  min={1}
                  max={25}
                  step={0.1}
                  defaultValue={this.context.Params.stepvectormm}
                  id="myInputStep"
                  name="myInputStep"
                  onChange={(e) => {
                    this.handleChangeNumeric('stepvectormm', e.target.value);
                  }}
                  style={{ width: "5em" }}
                />

                <label htmlFor='optimid' aria-label={this.context.GetLocaleString("param.optim_aria")} >
                  {this.context.GetLocaleString("param.path_optimbloc")}
                </label>


                <select id="optimid"
                  value={this.context.Params.OptimLevel}
                  onChange={this.handleChangeOptimLevel}
                  className='select_param'
                >
                  {this.state.optimchoice.map((item, index) => {
                    if (this.context.Params.OptimLevel === index)
                      return (<option aria-selected={true} key={item} value={index}>{item}</option>);
                    else
                      return (<option aria-selected={false} key={item} value={index}>{item}</option>);
                  })
                  }


                </select>

              </div>




              <div className='pure-control-group'>

                <label for="mySpeed">
                  {this.context.GetLocaleString("param.speed")}:
                </label>
                <input type="number"
                  min={3000}
                  max={12000}
                  defaultValue={this.context.Params.Speed}
                  id="mySpeed"
                  name="mySpeed"
                  onChange={(e) => {
                    this.handleChangeNumeric('Speed', e.target.value);
                  }}
                  style={{ width: "5em" }}
                />


                <label for="myAccel">
                  {this.context.GetLocaleString("param.accel")}:
                </label>
                <input type="number"
                  min={500}
                  max={5000}
                  defaultValue={this.context.Params.Accel}
                  id="myAccel"
                  name="myAccel"
                  onChange={(e) => {
                    this.handleChangeNumeric('Accel', e.target.value);
                  }}
                  style={{ width: "5em" }}
                />


              </div>
              {this.render_comport()}
              <button
                className="pure-button pad-button"
                onClick={this.handleRefreshPort}
              >
                {this.context.GetLocaleString("param.buttonrefresh")}
              </button>
            </fieldset>
          </div>

          <div className='pure-control-group'>
            <fieldset>
              <legend>Braille</legend>
              {this.render_braille_lang()}
            </fieldset>
          </div>

          <div className='pure-control-group'>
            <fieldset>
              <legend>Application</legend>
              <p>
                {this.context.GetLocaleString("param.locale")}&nbsp;
                <b>{this.context.Params.lang}</b>
              </p>
              <label htmlFor='langid' aria-label="param.language_aria" >
                {this.context.GetLocaleString("param.locale")}
              </label>


              <select id="langid"
                value={this.context.Locale}
                onChange={this.handleChangeLanguage}
                className='select_param'
              >
                {this.state.localedata.map((item, index) => {
                  if (this.context.Locale === item.lang)
                    return (<option aria-selected={true} key={item.lang} value={item.lang}>{item.desc}</option>);
                  else
                    return (<option aria-selected={false} key={item.lang} value={item.lang}>{item.desc}</option>);
                })
                }


              </select>
            </fieldset>
          </div>
        </div >

      </div >
    );
  }
};

export default Parameters;