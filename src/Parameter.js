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
      Paper: { width: 210, height: 297, usablewidth: 190, usableheight: 250 },
      SvgInterpol: false,
      brailleinfo: [],
      data: [],
      options: props.params
    }
    this.handleChangePort = this.handleChangePort.bind(this);
    this.handleChangeBraille = this.handleChangeBraille.bind(this);
    this.render_braille_lang = this.render_braille_lang.bind(this);
    this.render_comport = this.render_comport.bind(this);
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
    let option = this.props.params;
    console.log ("option " + option);
    option.comport = event.target.value;

    if (this.props.optioncb)
      this.props.optioncb(option);
    else
      this.setState({ options: option });
  }

  handleChangeBraille(event) {
    let option = this.props.params;
    option.brailletbl = event.target.value;

    if (this.props.optioncb)
      this.props.optioncb(option);
    else
      this.setState({ options: option });
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
            <b>{this.state.options.comport}</b>
          </p>
          <label htmlFor='selectport'>
            Port de communication
          </label>
          <select
            className='selectbraille'
            onChange={this.handleChangePort}
            value={this.state.options.comport}
            id="selectport"
            name="selectport">

            {this.state.data.map((line, index) => {
              if (line.device === this.state.options.comport)
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
    if (this.state.options.brailletbl < this.state.brailleinfo.length)
      selectedtable = this.state.brailleinfo[this.state.options.brailletbl].desc;
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
          value={this.state.options.brailletbl}
          name="combobraille"
          id="combobraille"

        >


          {this.state.brailleinfo.map((item, index) => {
            if (index === this.state.options.brailletbl)
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
                  defaultValue={this.state.Paper.width}
                  name="myInputW"
                  id="myInputW"
                  onChange={(e) => { this.setState({ Paper: { width: e.target.value } }); }}
                  style={{ width: "4em" }}
                />
              </label>
            </p>
            <p>
              <label>
                Hauteur Papier: <input type="number"
                  min={100}
                  max={550}
                  defaultValue={this.state.Paper.height}
                  name="myInputH"
                  id="myInputH"
                  onChange={(e) => { this.setState({ Paper: { height: e.target.value } }); }}
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
                  defaultValue={this.state.Paper.usablewidth}
                  name="myInputWU"
                  onChange={(e) => { this.setState({ Paper: { usablewidth: e.target.value } }); }}
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
                  defaultValue={this.state.Paper.usableheight}
                  id="myInputHU"
                  name="myInputHU"
                  onChange={(e) => { this.setState({ Paper: { usableheight: e.target.value } }); }}
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
                checked={this.state.SvgInterpol}
                onChange={(e) => { this.setState({ SvgInterpol: e.target.checked }) }}
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