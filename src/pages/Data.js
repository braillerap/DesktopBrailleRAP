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
  const { message, GetPaper } = useContext(AppContext);
  const [expandedIds, setExpandedIds] = useState();
  let paper = GetPaper();
  let size = -1;
  let list = [];

  
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
    //let tmpchild = [];
    console.log ("childs.length" + childs.length);
    for (let i = 0; i < childs.length; i++) {

      if (childs[i].locked === true)
        continue;

      let elemchild = {};
      
      console.log ("name");
      let str = childs[i].className;
      if (str === 'PointText')
          str += ' : ' + childs[i].content
      
      //str += ' ' + childs[i].matrix.values.toString ()    
      if (childs[i].matrix)
        str = str + " m : " + childs[i].matrix;

      elemchild['name'] = str ;
       
      let idlist = [];
      if (childs[i].children) 
      {
          console.log ("buildchildren list");
          console.log (childs[i]);
          console.log (Object.keys(childs[i]));
          console.log (childs[i].children);
          console.log (childs[i].children.length);
          console.log ("loop");

          let gchildlist = [];    
                           
          if (childs[i].children)
          {
            gchildlist =  buildchildtree(childs[i], childs[i].id, gchildlist);
            elemchild['children'] = gchildlist;
          }
      }
      
      childlist.push (elemchild);
 
      
    }console.log ("childlist length :" + childlist.length);
    return childlist;
  }

  size = paper.settings.handleSize;
  list = buildchild("", paper.project.activeLayer, list);
  let paperdata = [];
  buildchildtree(paper.project.activeLayer, null, paperdata);

  console.log ("data build");
  console.log (paperdata);
  let datatmp = {name:"document", children:paperdata};

  let data = flattenTree (datatmp);
  console.log ("data flatten");
  console.log (data);

  const arrayDataItems = list.map((elm) => <li>{elm}</li>);
  const layernbr = paper.project.layers.length;

  const getAndSetIds = () => {
    setExpandedIds(
      document
        .querySelector("#txtIdsToExpand")
        .value.split(",")
        .filter(val => !!val.trim())
        .map((x) => {
          if (isNaN(parseInt(x.trim()))) {
            return x;
          }
          return parseInt(x.trim());
        })
    );
  };
  
  /*
  <div className="container">
        <ul>{arrayDataItems}</ul>
        
        <p>Layer number :{layernbr}</p>

      </div>
      */
  
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