import React, { useState, useContext} from 'react';
import Modal from 'react-modal'
import AppContext from "../components/AppContext";


const ModalUsablePrint = ({show, handleOK, handleCancel, paperusablesize}) =>
{
    const {GetLocaleString} = useContext(AppContext);
    const [SelectedSize, setSelectedSize] = useState(0);
    const [usableWidth, setUsableWidth] = useState(210);
    const [usableHeight, setUsableHeight] = useState(297-45);    

    const render_lock = (locked) => {
        
        return locked ? String.fromCodePoint(0x1f512) : " "; 
        if (locked)
            return String.fromCodePoint(0x1f512);
      //return "🔒";
      //return "&#x1F512;";
        else
            return " ";
    }

    const onOk = () =>
    {
        if (handleOK)
            handleOK();
    }
    const onCancel = () =>
    {
        if (handleCancel)
            handleCancel();
    }
    const onAdd = () => {

    }
    const onDelete = () => {

    }

    return (

    <>
            <Modal
              isOpen={show}
              contentLabel=""
              aria={{ hidden: false, label: ' ' }}
            >
              <select
                id="usablepaper"
                name="usablepaper"
                className='select_param'
                size="6"
              >
                {paperusablesize.map((item, index) => {
                  if (SelectedSize === index)
                    return (<option aria-selected={true} key={item.name} value={index}>{render_lock(item.lock)} {item.name} [{item.usablewidth}mm x {item.usableheight}mm]</option>);
                  else
                    return (<option aria-selected={false} key={item.name} value={index}>{render_lock(item.lock)} {item.name} [{item.usablewidth}mm x {item.usableheight}mm]</option>);
                })
                }
              </select>
              <label for='myInputWUDiag'>
                {GetLocaleString("param.usable.diag.name")}:
              </label>
              <input type="text"
                defaultValue="New"
                name="myInputNameDiag"
                id="myInputNameDiag"
    
                onChange={(e) => {
                  //this.handleChangePaper('usablewidth', e.target.value);
                }}
                style={{ width: "12em" }}
              />
              <label for='myInputWUDiag'>
                {GetLocaleString("param.usable.diag.width")}:
              </label>
              <input type="number"
                min={100}
                max={420}
                defaultValue={usableWidth}
                name="myInputWUDiag"
                id="myInputWUDiag"
    
                onChange={(e) => {
                  //this.handleChangePaper('usablewidth', e.target.value);
                }}
                style={{ width: "5em" }}
              />
    
    
    
              <label for="myInputHUDiag">
                {GetLocaleString("param.usable_height")}:
              </label>
    
              <input type="number"
                min={100}
                max={550}
                defaultValue={usableHeight}
                id="myInputHUDiag"
                name="myInputHUDiag"
                onChange={(e) => {
                  //this.handleChangePaper('usableheight', e.target.value);
                }}
                style={{ width: "5em" }}
              />
                  
    
              <button className="pad-button pure-button"
                onClick={() => { onOk () }}
              >
                Ok
    
              </button>
              <button className="pad-button pure-button"
                onClick={() => { onCancel () }}
              >
                Cancel
    
              </button>
              <button className="pad-button pure-button"
                onClick={() => { onAdd()}}
              >
                Add
              </button>
              <button className="pad-button pure-button"
                onClick={() => { onDelete()}}
              >
                Delete
              </button>
            </Modal>
          </>
    );
}
export default ModalUsablePrint;