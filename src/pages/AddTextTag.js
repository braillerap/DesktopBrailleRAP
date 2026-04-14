import React from 'react';
import { useState, useContext } from 'react';
import AppContext from "../components/AppContext";



let key = 0;
class InputTextTag extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      Message: props.initialvalue,
    };
    this.handleClickButton = this.handleClickButton.bind(this);
  }


  handleClickButton() {
    if (this.props.callback)
      this.props.callback(this.state.Message);
  }

  render() {
    return (
      <>

        <input type="text" defaultValue={this.props.initialvalue}
          onChange={(e) => this.setState({ Message: e.target.value })}
          key={this.props.vkey}
          id={this.props.id} />
        <p>&nbsp;</p>
        <p>{this.props.initialvalue}</p>
        <p>{this.state.Message} {this.props.vkey}</p>
        <button onClick={this.handleClickButton} className='pure-button'>
          {this.props.label}
        </button>
      </>
    );
  }
}

class AddTextTag extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      Message: this.props.initialvalue,
      NewMessage: "Nouveau"
    };
    this.handleAddButton = this.handleAddButton.bind(this);
    this.handleEditButton = this.handleEditButton.bind(this);
  }

  handleAddButton(val) {

    let p = this.context.GetPaperCanvas();

    if (p) {

      p.addTxt(val);
    }

  }
  handleEditButton(val) {

    if (this.context.Selected) {
      if (this.context.Selected.className === 'PointText') {
        this.context.Selected.content = val;
      }
    }
  }
  render() {
    let f = this.context.GetPaperCanvas();
    key = key + 1;
    if (f) {
      let selected = this.context.Selected;

      if (selected && selected.className === "PointText") {


        return (
          <>
            <h3>{this.context.GetLocaleString("text.update")}</h3>
            <div>
              <InputTextTag
                initialvalue={selected.content}
                callback={this.handleEditButton}
                label={this.context.GetLocaleString("text.updatebtn")}
                vkey={key} />
            </div>
          </>
        );
      }
    }
    return (
      <>
        <h1>{this.context.GetLocaleString("text.add")}</h1>

        <div>
          <InputTextTag
            initialvalue={this.state.NewMessage}
            callback={this.handleAddButton}
            label={this.context.GetLocaleString("text.addbtn")}
            vkey={key}
            id='TextInput' />
        </div>
      </>
    );
  }
};

export default AddTextTag;