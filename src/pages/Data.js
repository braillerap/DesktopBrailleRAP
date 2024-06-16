import { useContext } from 'react'
import AppContext from "../components/AppContext";

const Data = () => {
  const { message, GetPaper } = useContext(AppContext);
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

  size = paper.settings.handleSize;
  list = buildchild("", paper.project.activeLayer, list);


  const arrayDataItems = list.map((elm) => <li>{elm}</li>);
  const layernbr = paper.project.layers.length;
  return (
    <>

      <h1>Data</h1>

      <div className="container">
        <ul>{arrayDataItems}</ul>
        <p>
          {message}
        </p>
        <p>Paper handle size:{size}</p>
        <p>Layer number :{layernbr}</p>

      </div>

    </>
  );

};

export default Data;