import React, { useState, useContext,useEffect  } from 'react';
import Modal from 'react-modal'
import AppContext from "../components/AppContext";


const ModalUsablePrint = ({ show, handleOK, handleCancel, paperusablesize }) => {
    const { GetLocaleString } = useContext(AppContext);
    const [SelectedSize, setSelectedSize] = useState(1);
    const [Name, setName] = useState ('New');
    const [usableWidth, setUsableWidth] = useState(210);
    const [usableHeight, setUsableHeight] = useState(297 - 45);
    const [usableSize, setUsableSize] = useState([...paperusablesize] || []);
    console.log("ModalUsablePrint");
    console.log(paperusablesize);
    console.log(usableSize);
    

    useEffect (()=>{
        console.log ("useeffect");
        if (usableSize.length === 0)
            setUsableSize([...paperusablesize] || []);
        
        return (()=>{});
    }, [usableSize]);

    const render_lock = (locked) => {

        return locked ? String.fromCodePoint(0x1f512) : " ";
        if (locked)
            return String.fromCodePoint(0x1f512);
        //return "🔒";
        //return "&#x1F512;";
        else
            return " ";
    }

    const onOk = () => {
        console.log("onOK()");
        console.log(handleOK);
        if (handleOK)
            handleOK(usableSize);
    }
    const onCancel = () => {
        if (handleCancel)
            handleCancel();
    }
    const onAdd = () => {
        
        let data = {name:Name,usablewidth:usableWidth, usableheight:usableHeight,lock:false};
        setUsableSize([...usableSize, data]);

    }
    const onDelete = () => {

    }
    const onDuplicate = () => {

    }

    return (

        <>
            <Modal
                isOpen={show}
                contentLabel=""
                aria={{ hidden: false, label: ' ' }}
            >
                <div className='MakeColumn100'>
                    <div>
                        <select
                            id="usablepaper"
                            name="usablepaper"
                            className='select_param'
                            size="6"
                        >
                            {usableSize.map((item, index) => {
                                console.log (index);
                                if (SelectedSize === index)
                                    return (<option aria-selected={true} key={item.name} value={index}>{render_lock(item.lock)} {item.name} [{item.usablewidth}mm x {item.usableheight}mm]</option>);
                                else
                                    return (<option aria-selected={false} key={item.name} value={index}>{render_lock(item.lock)} {item.name} [{item.usablewidth}mm x {item.usableheight}mm]</option>);
                            })
                            }
                        </select>
                    </div>
                    <div>
                        <div className='pure-form pure-form-aligned'>
                            <div className='pure-control-group'>
                                <legend>A legend for size</legend>
                                <fieldset>
                                    <label for='myInputWUDiag'>
                                        {GetLocaleString("param.usable.diag.name")}:
                                    </label>
                                    <input type="text"
                                        defaultValue={Name}
                                        name="myInputNameDiag"
                                        id="myInputNameDiag"

                                        onChange={(e) => {
                                            //this.handleChangePaper('usablewidth', e.target.value);
                                            setName (e.target.value);
                                        }}
                                        style={{ width: "12em" }}
                                    /><br/>
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
                                            setUsableWidth(e.target.value);
                                        }}
                                        style={{ width: "5em" }}
                                    /><br/>



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
                                            setUsableHeight(e.target.value);//this.handleChangePaper('usableheight', e.target.value);
                                        }}
                                        style={{ width: "5em" }}
                                    /><br/>
                                </fieldset>

                                <fieldset>
                                    <button className="pad-button pure-button"
                                        onClick={() => { onAdd() }}
                                    >
                                        Add
                                    </button>&nbsp;
                                    <button className="pad-button pure-button"
                                        onClick={() => { onDelete() }}
                                    >
                                        Delete
                                    </button>&nbsp;
                                    <button className="pad-button pure-button"
                                        onClick={() => { onDuplicate() }}
                                    >
                                        Duplicate
                                    </button>&nbsp;
                                </fieldset>
                                <fieldset>
                                    <button className="pad-button pure-button"
                                        onClick={() => { onOk() }}
                                    >
                                        Ok

                                    </button>&nbsp;
                                    <button className="pad-button pure-button"
                                        onClick={() => { onCancel() }}
                                    >
                                        Cancel

                                    </button>
                                </fieldset>

                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
export default ModalUsablePrint;