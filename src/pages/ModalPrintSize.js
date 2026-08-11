/**
 * \file            ModalPrintSize.js
 * \brief           Print area configuration form
 */

/*
 * GNU GENERAL PUBLIC LICENSE
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS LICENSED UNDER
 *                  GNU GENERAL PUBLIC LICENSE
 *                   Version 3, 29 June 2007
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
 * AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * This file is part of DesktopBrailleRAP software.
 *
 * SPDX-FileCopyrightText: 2025-2026 Stephane GODIN <stephane@braillerap.org>
 * 
 * SPDX-License-Identifier: GPL-3.0 
 */

import React, { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal'
import AppContext from "../components/AppContext";

const ModalPrintSize = ({ show, handleOK, handleCancel, paperusablesize, title }) => {
    const { GetLocaleString } = useContext(AppContext);
    const [SelectedSize, setSelectedSize] = useState(0);
    const [Name, setName] = useState('New');
    const [usableWidth, setUsableWidth] = useState(210);
    const [usableHeight, setUsableHeight] = useState(297 - 45);
    const [usableSize, setUsableSize] = useState([...paperusablesize] || []);
    const [Message, setMessage] = useState("");

    useEffect(() => {

        if (usableSize.length === 0) {
            setUsableSize([...paperusablesize] || []);
            if (paperusablesize && paperusablesize.length > 0) {
                setName(paperusablesize[0].name);
                setUsableHeight(paperusablesize[0].height);
                setUsableWidth(paperusablesize[0].width);
            }
        }

        return (() => { });
    }, [usableSize, paperusablesize]);

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
    const onUpdate = () => {
        let index = parseInt(SelectedSize);
        let option = [...usableSize];
        let data = { name: Name, width: usableWidth, height: usableHeight, lock: false };
        if (!option[index].lock) {
            option[index] = data;
            setUsableSize(option);
        }
        else {
            setMessage(GetLocaleString("param.modal.updatelocked"));
        }

    }
    const onDelete = () => {
        if (SelectedSize >= 0) {
            //console.log(SelectedSize);
            //console.log(usableSize[SelectedSize]);
            if (usableSize[SelectedSize].lock === false) {
                let data = [...usableSize];
                data.splice(SelectedSize, 1);
                setUsableSize(data);
                if (data.length > 0)
                    setSelectedSize(0);
            }
            else {
                setMessage(GetLocaleString("param.modal.updatelocked"));
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
            return (
                <div className='p-0 m-8'>
                    <div class="alert alert-danger alert-white rounded">
                        {Message}
                        <button type="button" class="btn btn-blue"
                            data-dismiss="alert"
                            aria-hidden="true"
                            onClick={() => { setMessage("") }}>×</button>
                        <div class="icon"><i class="fa fa-check"></i></div>
                    </div>

                </div>
            );
        return (<div className='p-0 m-8'>

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
                contentLabel=""
                aria={{ hidden: false, label: ' ' }}
                onRequestClose={() => { onCancel() }}
                className='ModalView'
            >

                <div className='MakeColumn100' >

                    <div className='flex flex-col items-start mx-4'>
                        <h2 className='text-xl font-bold mt-8 mx-0 mb-4' >{title ? title : ""}</h2>
                        <select
                            onChange={(e) => {
                                console.log(e);
                                let index = parseInt(e.target.value);
                                setUsableWidth(usableSize[index].width);
                                setUsableHeight(usableSize[index].height);
                                //console.log (usableSize[index]);
                                setName(usableSize[index].name);
                                setSelectedSize(index);
                            }}
                            value={SelectedSize}
                            id="usablepaper"
                            name="usablepaper"
                            className='border whitespace-pre-line mx-4  max-w-lg min-h-48 max-h-48 overflow-y-scroll'
                            size={64}
                        >
                            {usableSize.map((item, index) => {
                                if (SelectedSize === index)
                                    return (
                                        <option aria-selected={true} key={item.name} value={index}>
                                            {render_lock(item.lock)} {item.name} [{item.width}mm x {item.height}mm]
                                        </option>
                                    );
                                else
                                    return (
                                        <option aria-selected={false} key={item.name} value={index}>
                                            {render_lock(item.lock)} {item.name} [{item.width}mm x {item.height}mm]
                                        </option>);
                            })
                            }
                        </select>
                    </div>
                    <div>
                        <div className='flex flex-col items-start text-left'>
                            {render_message()}
                            <div className='Group'>
                                <legend className='text-xl font-bold'>{GetLocaleString("param.modal.details")}</legend>
                                <fieldset className='border-1 border-btnborder rounded-md'>
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
                                        className='textedit w-64'
                                    />
                                    <label for='myInputWUDiag'>
                                        {GetLocaleString("param.usable.diag.width")}(mm):
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
                                        className='textedit w-24'
                                    />



                                    <label for="myInputHUDiag">
                                        {GetLocaleString("param.usable.diag.height")} (mm):
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
                                        className='textedit w-24'
                                    />
                                </fieldset>

                                <fieldset className='mt-8'>
                                    <button className="btn btn-blue lg:min-w-48"
                                        onClick={() => { onAdd() }}
                                    >
                                        {GetLocaleString("param.modal.add")}
                                    </button>&nbsp;
                                    <button className="btn btn-blue lg:min-w-48"
                                        onClick={() => { onDelete() }}
                                    >
                                        {GetLocaleString("param.modal.delete")}
                                    </button>&nbsp;
                                    <button className="btn btn-blue lg:min-w-48"
                                        onClick={() => { onUpdate() }}
                                    >
                                        {GetLocaleString("param.modal.update")}
                                    </button>&nbsp;
                                    <button className="btn btn-blue lg:min-w-48"
                                        onClick={() => { onDuplicate() }}
                                    >
                                        {GetLocaleString("param.modal.duplicate")}
                                    </button>&nbsp;
                                </fieldset>
                                <fieldset>
                                    <button className="btn btn-blue lg:min-w-48"
                                        onClick={() => { onOk() }}
                                    >
                                        {GetLocaleString("param.modal.ok")}

                                    </button>&nbsp;
                                    <button className="btn btn-blue lg:min-w-48"
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