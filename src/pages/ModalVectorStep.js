import React, { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal'
import AppContext from "../components/AppContext";

const ModalVectorStep = ({ show, handleOK, handleCancel, vectorstepmmlist, title}) => {
    const { GetLocaleString } = useContext(AppContext);
    const [SelectedStep, setSelectedStep] = useState(0);
    const [Name, setName] = useState('New');
    const [Stepmm, setStepmm] = useState(2.5);
    
    const [CustomStepmmList, setCustomStepmmList] = useState([...vectorstepmmlist] || []);
    const [Message, setMessage] =useState("");
    
    useEffect(() => {
        console.log (vectorstepmmlist);
        if (CustomStepmmList.length === 0)
        {
            setCustomStepmmList([...vectorstepmmlist] || []);
            if (vectorstepmmlist && vectorstepmmlist.length > 0)
            {
                setName (vectorstepmmlist[0].name);
                setStepmm(vectorstepmmlist[0].step);
            }    
        }

        return (() => { });
    }, [CustomStepmmList]);

    const render_lock = (locked) => {
        return locked ? String.fromCodePoint(0x1f512): " ";
        
    }

    const onOk = () => {
        if (handleOK)
            handleOK(CustomStepmmList);
    }
    const onCancel = () => {
        if (handleCancel)
            handleCancel();
    }
    const onAdd = () => {

        let data = { name: Name, step: Stepmm, lock: false };
        setCustomStepmmList([...CustomStepmmList, data]);

    }
    const onUpdate = () =>
    {
        let index = parseInt(SelectedStep);
        let option = [...CustomStepmmList];
        let data = { name: Name, step: Stepmm, lock: false };
        if (! option[index].lock)
        {
            option[index] = data;
            setCustomStepmmList(option);
        }
        else{
            setMessage (GetLocaleString("param.modal.updatelocked"));
        }
        
    }
    const onDelete = () => {
        if (SelectedStep >= 0) {
            if (CustomStepmmList[SelectedStep].lock === false) {
                let data = [...CustomStepmmList];
                data.splice(SelectedStep, 1);
                setCustomStepmmList(data);
                if (data.length > 0)
                    setSelectedStep(0);
            } 
            else
            {
                setMessage (GetLocaleString("param.modal.updatelocked"));
            }
        }
    }
    const onDuplicate = () => {
        if (SelectedStep >= 0) {
            let data = [...CustomStepmmList];
            let elem = { ...data[SelectedStep] };
            elem.name += " Copy";
            elem.lock = false;
            data.push(elem);
            setCustomStepmmList(data);

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
                                setStepmm (CustomStepmmList[index].step);
                                console.log (CustomStepmmList[index]);
                                setName (CustomStepmmList[index].name);
                                setSelectedStep(index); 
                            }}
                            value={SelectedStep}
                            id="steplist"
                            name="steplist"
                            className='select_modal'
                            size="6"
                        >
                            {CustomStepmmList.map((item, index) => {
                                if (SelectedStep === index)
                                    return (<option aria-selected={true} key={item.name} value={index}>{render_lock(item.lock)} {item.name} ({item.step}mm)</option>);
                                else
                                    return (<option aria-selected={false} key={item.name} value={index}>{render_lock(item.lock)} {item.name} ({item.step}mm)</option>);
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
                                        {GetLocaleString("param.usable.diag.material")}:
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
                                        {GetLocaleString("param.diag.stepmm")}(mm):
                                    </label>
                                    <input type="number"
                                        min={100}
                                        max={420}
                                        defaultValue={Stepmm}
                                        value={Stepmm}
                                        name="myInputWUDiag"
                                        id="myInputWUDiag"

                                        onChange={(e) => {
                                            //this.handleChangePaper('usablewidth', e.target.value);
                                            setStepmm(e.target.value);
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
export default ModalVectorStep;