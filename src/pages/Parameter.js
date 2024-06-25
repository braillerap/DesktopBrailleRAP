import React from 'react';

import AppContext from "../components/AppContext";

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


  }

  async componentDidMount() {
    // TODO get backend from context not prop

    if (this.props.webviewready) {
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

    }
  }
  handleRefreshPort() {
    if (this.props.webviewready) {
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
        
          <label>
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

    let langs = [];
    return (
      <div >

        <h2>{this.context.GetLocaleString("param.formtitle")}</h2>

        <div className="pure-form pure-form-aligned container">
          <div className="pure-control-group">

            <fieldset>
              <legend>{this.context.GetLocaleString("param.paper_size")}</legend>
              <div className="pure-control-group">
                <label for="myInputW">
                  {this.context.GetLocaleString("param.paper_width")}:
                </label>
                <input type="number"
                  min={100}
                  max={420}
                  defaultValue={this.context.Params.Paper.width}
                  name="myInputW"
                  id="myInputW"
                  onChange={(e) => {
                    this.handleChangePaper('width', e.target.value);
                  }}
                  style={{ width: "5em" }}
                />


                <label for="myInputH">
                  {this.context.GetLocaleString("param.paper_height")}:
                </label>
                <input type="number"
                  min={100}
                  max={550}
                  defaultValue={this.context.Params.Paper.height}
                  name="myInputH"
                  id="myInputH"
                  onChange={(e) => {
                    this.handleChangePaper('height', e.target.value);
                  }}
                  style={{ width: "5em" }}
                />

              </div>
              <div className="pure-control-group">
                <label for='myInputWU'>
                  {this.context.GetLocaleString("param.usable_width")}:
                </label>
                <input type="number"
                  min={100}
                  max={420}
                  defaultValue={this.context.Params.Paper.usablewidth}
                  name="myInputWU"
                  id="myInputWU"

                  onChange={(e) => {
                    this.handleChangePaper('usablewidth', e.target.value);
                  }}
                  style={{ width: "5em" }}
                />



                <label for="myInputHU">
                  {this.context.GetLocaleString("param.usable_height")}:
                </label>

                <input type="number"
                  min={100}
                  max={550}
                  defaultValue={this.context.Params.Paper.usableheight}
                  id="myInputHU"
                  name="myInputHU"
                  onChange={(e) => {
                    this.handleChangePaper('usableheight', e.target.value);
                  }}
                  style={{ width: "5em" }}
                />
              </div>
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
                  defaultValue={this.context.Params.stepvectormm}
                  id="myInputStep"
                  name="myInputStep"
                  onChange={(e) => {
                    this.handleChangeNumeric('stepvectormm', e.target.value);
                  }}
                  style={{ width: "5em" }}
                />

                <label for="zigzagbloc">
                  {this.context.GetLocaleString("param.path_optim")}:
                </label>
                <input type="checkbox"
                  id="zigzagbloc"
                  label={this.context.GetLocaleString("param.path_optim")}
                  checked={this.context.Params.ZigZagBloc}
                  onChange={(e) => {
                    this.handleChangeGeneral('ZigZagBloc', e.target.checked);
                  }}
                  key="zigzagbloc"
                />
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