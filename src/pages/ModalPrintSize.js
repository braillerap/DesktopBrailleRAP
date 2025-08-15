import React, { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal'
import AppContext from "../components/AppContext";


const ModalPrintSize = ({ show, handleOK, handleCancel, paperusablesize }) => {
    const { GetLocaleString } = useContext(AppContext);
    const [SelectedSize, setSelectedSize] = useState(0);
    const [Name, setName] = useState('New');
    const [usableWidth, setUsableWidth] = useState(210);
    const [usableHeight, setUsableHeight] = useState(297 - 45);
    const [usableSize, setUsableSize] = useState([...paperusablesize] || []);
    
    useEffect(() => {
        
        if (usableSize.length === 0)
        {
            setUsableSize([...paperusablesize] || []);
            if (paperusablesize && paperusablesize.length > 0)
            {
                setName (paperusablesize[0].name);
                setUsableHeight(paperusablesize[0].height);
                setUsableWidth(paperusablesize[0].width);
            }    
        }

        return (() => { });
    }, [usableSize]);

    const render_lock = (locked) => {
        return locked ? String.fromCodePoint(0x1f512) : " ";
    }

    const onOk = () => {
        if (handleOK)
            handleOK(usableSize);
    }
    const onCancel = () => {
        if (handleCancel)
            handleCancel();
    }
    const onAdd = () => {

        let data = { name: Name, width: usableWidth, height: usableHeight, lock: false };
        setUsableSize([...usableSize, data]);

    }
    const onUpdate = () =>
    {
        let index = parseInt(SelectedSize);
        let option = [...usableSize];
        let data = { name: Name, width: usableWidth, height: usableHeight, lock: false };
        option[index] = data;
        setUsableSize(option);
    }
    const onDelete = () => {
        if (SelectedSize) {
            console.log(SelectedSize);
            console.log(usableSize[SelectedSize]);
            if (usableSize[SelectedSize].lock === false) {
                let data = [...usableSize];
                data.splice(SelectedSize, 1);
                setUsableSize(data);
            }
        }
    }
    const onDuplicate = () => {
        if (SelectedSize) {
            let data = [...usableSize];
            let elem = { ...data[SelectedSize] };
            elem.name += " Copy";
            elem.lock = false;
            data.push(elem);
            setUsableSize(data);

        }
    }

    return (

        <div 
            tabIndex={0} 
            onKeyUp={(e) => {
                e.stopPropagation();
                console.log(e);
                if (e.key === "Escape")
                    onCancel()
                else if (e.key === 'Enter')
                    onOk();
            }}>
            <Modal
                isOpen={show}
                contentLabel=""
                aria={{ hidden: false, label: ' ' }}

            >
                <div className='MakeColumn100' >
                    <div>
                        <select
                            onChange={(e) => { 
                                console.log (e);
                                let index = parseInt(e.target.value);
                                setUsableWidth (usableSize[index].width);
                                setUsableHeight (usableSize[index].height);
                                console.log (usableSize[index]);
                                setName (usableSize[index].name);
                                setSelectedSize(index); 
                            }}
                            value={SelectedSize}
                            id="usablepaper"
                            name="usablepaper"
                            className='select_param'
                            size="6"
                        >
                            {usableSize.map((item, index) => {
                                if (SelectedSize === index)
                                    return (<option aria-selected={true} key={item.name} value={index}>{render_lock(item.lock)} {item.name} [{item.width}mm x {item.height}mm]</option>);
                                else
                                    return (<option aria-selected={false} key={item.name} value={index}>{render_lock(item.lock)} {item.name} [{item.width}mm x {item.height}mm]</option>);
                            })
                            }
                        </select>
                    </div>
                    <div>
                        <div className='pure-form pure-form-aligned'>
                            <div className='content'>
                                <div class="alert alert-danger alert-white rounded">
                                    blabla
                                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                                    <div class="icon"><i class="fa fa-check"></i></div>
                                </div>
                                <div class="rounded">
                                    &nbsp;

                                    <div class="icon"><i class="fa fa-check"></i></div>
                                </div>
                            </div>
                            <div className='pure-control-group'>
                                <legend>A legend for size</legend>
                                <fieldset>
                                    <label for='myInputWUDiag'>
                                        {GetLocaleString("param.usable.diag.name")}:
                                    </label>
                                    <input type="text"
                                        defaultValue={Name}
                                        value={Name}
                                        name="myInputNameDiag"
                                        id="myInputNameDiag"

                                        onChange={(e) => {
                                            //this.handleChangePaper('usablewidth', e.target.value);
                                            setName(e.target.value);
                                        }}
                                        style={{ width: "12em" }}
                                    /><br />
                                    <label for='myInputWUDiag'>
                                        {GetLocaleString("param.usable.diag.width")}:
                                    </label>
                                    <input type="number"
                                        min={100}
                                        max={420}
                                        defaultValue={usableWidth}
                                        value={usableWidth}
                                        name="myInputWUDiag"
                                        id="myInputWUDiag"

                                        onChange={(e) => {
                                            //this.handleChangePaper('usablewidth', e.target.value);
                                            setUsableWidth(e.target.value);
                                        }}
                                        style={{ width: "5em" }}
                                    /><br />



                                    <label for="myInputHUDiag">
                                        {GetLocaleString("param.usable_height")}:
                                    </label>

                                    <input type="number"
                                        min={100}
                                        max={550}
                                        defaultValue={usableHeight}
                                        value={usableHeight}
                                        id="myInputHUDiag"
                                        name="myInputHUDiag"
                                        onChange={(e) => {
                                            setUsableHeight(e.target.value);//this.handleChangePaper('usableheight', e.target.value);
                                        }}
                                        style={{ width: "5em" }}
                                    /><br />
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
                                        onClick={() => { onUpdate() }}
                                    >
                                        Update
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
        </div>
    );
}
export default ModalPrintSize;