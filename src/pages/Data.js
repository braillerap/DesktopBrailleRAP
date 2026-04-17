/**
 * \file            data.js
 * \brief           Document data structure display form
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
import { useContext, useState} from 'react'
import AppContext from "../components/AppContext";
import TreeView, { flattenTree } from 'react-accessible-treeview';
import cx from "classnames";
import { IoMdArrowDropright } from "react-icons/io";

const ArrowIcon = ({ isOpen, className }) => {
  const baseClass = "arrow";
  const classes = cx(
    baseClass,
    { [`${baseClass}--closed`]: !isOpen },
    { [`${baseClass}--open`]: isOpen },
    className
  );
  return <IoMdArrowDropright className={classes} />;
};

const Data = () => {
  const { GetPaper } = useContext(AppContext);
  const [expandedIds, setExpandedIds] = useState();
  let paper = GetPaper();
  

  
  const buildchild = (prefix, parent, childlist) => {
    let childs = parent.children;
    for (let i = 0; i < childs.length; i++) {
      let str = prefix + " ";
      str = str + " class: " + childs[i].className;
      str = str + " locked: " + childs[i].locked;
      if (childs[i].children)
        str = str + " children: " + childs[i].children.length;
      if (childs[i].name)
        str = str + " name: " + childs[i].name;
      if (childs[i].matrix)
        str = str + " matrix : " + childs[i].matrix;
      childlist.push(str);
      if (childs[i].children) {
        if (childs[i].children.length > 0)
          buildchild(prefix + "+", childs[i], childlist);
      }
    }
    return childlist;
  }

  const buildchildtree = (paperelem, parent, childlist) => {
    let childs = paperelem.children;
    
    for (let i = 0; i < childs.length; i++) {

      if (childs[i].locked === true)
        continue;

      let elemchild = {};
      let str = childs[i].className;
      if (str === 'PointText')
          str += ' : ' + childs[i].content
      else 
      {
        if (childs[i].name)
          str += " " + childs[i].name;
      }
      //str += ' ' + childs[i].matrix.values.toString ()    
      if (childs[i].matrix)
        str = str + " m : " + childs[i].matrix;

      elemchild['name'] = str ;
       
      let idlist = [];
      if (childs[i].children) 
      {
          let gchildlist = [];    
                           
          if (childs[i].children)
          {
            gchildlist =  buildchildtree(childs[i], childs[i].id, gchildlist);
            elemchild['children'] = gchildlist;
          }
      }
      
      childlist.push (elemchild);
 
      
    }
    return childlist;
  }

  let paperdata = [];
  buildchildtree(paper.project.activeLayer, null, paperdata);

  let datatmp = {name:"document", children:paperdata};

  let data = flattenTree (datatmp);
  
  return (
    <>

      <h1>Data</h1>

      
      <div className='datatree'>
      <TreeView
        data={data} 
        aria-label="Controlled expanded node tree"
        expandedIds={expandedIds}
        defaultExpandedIds={[1]}
        nodeRenderer={({
          element,
          isBranch,
          isExpanded,
          isDisabled,
          getNodeProps,
          level,
          handleExpand,
        }) => {
          return (
            <div
              {...getNodeProps({ onClick: handleExpand })}
              style={{
                marginLeft: 40 * (level - 1),
                opacity: isDisabled ? 0.5 : 1,
              }}
            >
              {isBranch && <ArrowIcon isOpen={isExpanded} />}
              <span className="name">
              {element.name}   
              </span>
            </div>
          );
        }}
      />
      </div>

      

    </>
  );

};

export default Data;