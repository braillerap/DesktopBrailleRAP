import React from 'react';

import AppContext from "./AppContext";

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

    }
    this.handleChangePort = this.handleChangePort.bind(this);
    this.handleChangeBraille = this.handleChangeBraille.bind(this);
    this.handleChangePaper = this.handleChangePaper.bind(this);
    this.render_braille_lang = this.render_braille_lang.bind(this);
    this.render_comport = this.render_comport.bind(this);
    this.handleChangeGeneral = this.handleChangeGeneral.bind(this);
  }

  async componentDidMount() {
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
        let flags = louis.get_table_flags(i);
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
      this.setState({ brailleinfo: brtable })
    }
  }
  handleRefreshPort() {
    if (this.props.webviewready) {
      let msg = "Patientez";
      this.setState({ comevent: msg })
      window.pywebview.api.gcode_get_serial().then(list => {
        let portinfo = JSON.parse(list);
        let success = "Ports de communications actualisés";
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

  handleChangePaper(key, value) {

    let option = {
      ...this.context.Params
    };

    option.Paper[key] = parseInt(value);
    this.context.SetOption(option);

  }
  handleChangeGeneral(key, value) {
    /*
    let option = this.context.Params;
    option[key] =value;
    this.context.SetOption(option);*/
    let option = {
      ...this.context.Params
    };
    option[key] = value;

    this.context.SetOption(option);
  }
  render_comport() {
    if (this.state.data === null)
      return (
        <p>Aucun port de communication</p>
      );
    else if (this.state.data.length === 0)
      return (
        <p>Aucun port de communication</p>
      );
    else {

      return (
        <>
          <p>
            Port de communication&nbsp;
            <b>{this.context.Params.comport}</b>
          </p>
          <label htmlFor='selectport'>
            Port de communication
          </label>
          <select
            className='selectbraille'
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
      return (<p>Aucune table de transcription </p>)
    }
    let selectedtable = "vide";
    if (this.context.Params.brailletbl < this.state.brailleinfo.length)
      selectedtable = this.state.brailleinfo[this.context.Params.brailletbl].desc;
    return (
      <>
        <p>
          Table de transcription&nbsp;
          <b>{selectedtable}</b>
        </p>
        <label htmlFor='combobraille'>
          Table Braille
        </label>
        <select className='selectbraille'
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
      <>

        <h3>Paramètres</h3>

        <div className="container">
          <div className="Group">
            <h3>Taille du papier (mm)</h3>
            <p>
              <label>
                Largeur Papier:&nbsp;
                <input type="number"
                  min={100}
                  max={420}
                  defaultValue={this.context.Params.Paper.width}
                  name="myInputW"
                  id="myInputW"
                  onChange={(e) => {
                    this.handleChangePaper('width', e.target.value);
                  }}
                  style={{ width: "4em" }}
                />
              </label>
            </p>
            <p>
              <label>
                Hauteur Papier: <input type="number"
                  min={100}
                  max={550}
                  defaultValue={this.context.Params.Paper.height}
                  name="myInputH"
                  id="myInputH"
                  onChange={(e) => {
                    this.handleChangePaper('height', e.target.value);
                  }}
                  style={{ width: "4em" }}
                />
              </label>
            </p>
            <p>
              <label>
                Largeur Utile:&nbsp;
                <input type="number"
                  min={100}
                  max={420}
                  defaultValue={this.context.Params.Paper.usablewidth}
                  name="myInputWU"
                  onChange={(e) => {
                    this.handleChangePaper('usablewidth', e.target.value);
                  }}
                  style={{ width: "4em" }}
                />
              </label>
            </p>
            <p>
              <label>
                Hauteur Utile:&nbsp;
                <input type="number"
                  min={100}
                  max={550}
                  defaultValue={this.context.Params.Paper.usableheight}
                  id="myInputHU"
                  name="myInputHU"
                  onChange={(e) => {
                    this.handleChangePaper('usableheight', e.target.value);
                  }}
                  style={{ width: "4em" }}
                />
              </label>
            </p>

          </div>
          <div className="Group">
            <label>
              Interpolation Chemin (Path):&nbsp;
              <input type="checkbox"
                id="svginterpol"
                label="Interpolation des chemins SVG "
                checked={this.context.Params.SvgInterpol}
                onChange={(e) => {
                  this.handleChangeGeneral('SvgInterpol', e.target.checked);
                }}
                key="svginterpol"
              />
            </label>
          </div>

          <div className='Group'>
            {this.render_braille_lang()}

          </div>
          <div className='Group'>

            {this.render_comport()}
          </div>
        </div>

      </>
    );
  }
};

export default Parameters;