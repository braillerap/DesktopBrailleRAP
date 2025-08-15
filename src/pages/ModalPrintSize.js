import React, { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal'
import AppContext from "../components/AppContext";

const ModalPrintSize = ({ show, handleOK, handleCancel, paperusablesize, title}) => {
    const { GetLocaleString } = useContext(AppContext);
    const [SelectedSize, setSelectedSize] = useState(0);
    const [Name, setName] = useState('New');
    const [usableWidth, setUsableWidth] = useState(210);
    const [usableHeight, setUsableHeight] = useState(297 - 45);
    const [usableSize, setUsableSize] = useState([...paperusablesize] || []);
    const [Message, setMessage] =useState("");
    
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
        return locked ? String.fromCodePoint(0x1f512): " ";
        
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
        if (! option[index].lock)
        {
            option[index] = data;
            setUsableSize(option);
        }
        else{
            setMessage (GetLocaleString("param.modal.updatelocked"));
        }
        
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
        if (SelectedSize >= 0) {
            let data = [...usableSize];
            let elem = { ...data[SelectedSize] };
            elem.name += " Copy";
            elem.lock = false;
            data.push(elem);
            setUsableSize(data);

        }
    }
    
    const render_message = () => {
        if (Message.length > 0)
            return (<div className='content'>
                <div class="alert alert-danger alert-white rounded">
                    {Message}
                    <button type="button" class="close"
                        data-dismiss="alert"
                        aria-hidden="true"
                        onClick={() => { setMessage("") }}>×</button>
                    <div class="icon"><i class="fa fa-check"></i></div>
                </div>

            </div>);
        return (<div className='content'>

            <div class="rounded">
                &nbsp;

                <div class="icon"><i class="fa fa-check"></i></div>
            </div>
        </div>)
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
                contentLabel="Toto"
                aria={{ hidden: false, label: ' ' }}
                onRequestClose={()=>{onCancel()}}
            >
                
                <div className='MakeColumn100' >
                    
                    <div>
                        <h2>{title ? title : ""}</h2>
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
                            className='select_modal'
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
                            {render_message()}
                            <div className='pure-control-group'>
                                <legend>{GetLocaleString("param.modal.details")}</legend>
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
                                        {GetLocaleString("param.modal.add")}
                                    </button>&nbsp;
                                    <button className="pad-button pure-button"
                                        onClick={() => { onDelete() }}
                                    >
                                        {GetLocaleString("param.modal.delete")}
                                    </button>&nbsp;
                                    <button className="pad-button pure-button"
                                        onClick={() => { onUpdate() }}
                                    >
                                        {GetLocaleString("param.modal.update")}
                                    </button>&nbsp;
                                    <button className="pad-button pure-button"
                                        onClick={() => { onDuplicate() }}
                                    >
                                        {GetLocaleString("param.modal.duplicate")}
                                    </button>&nbsp;
                                </fieldset>
                                <fieldset>
                                    <button className="pad-button pure-button"
                                        onClick={() => { onOk() }}
                                    >
                                        {GetLocaleString("param.modal.ok")}

                                    </button>&nbsp;
                                    <button className="pad-button pure-button"
                                        onClick={() => { onCancel() }}
                                    >
                                        {GetLocaleString("param.modal.cancel")}

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