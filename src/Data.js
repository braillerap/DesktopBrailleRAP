import { useContext } from 'react'
import AppContext from "./AppContext";

const Data = () => {
  const { message, GetPaper } = useContext(AppContext);
  let paper = GetPaper();
  let size = -1;
  let list = [];
  if (paper) {
    size = paper.settings.handleSize;
    let childs = paper.project.activeLayer.children;
    for (let i = 0; i < childs.length; i++) {
      let str = "";
      str = str + "class : " + childs[i].className;
      str = str + " locked : " + childs[i].locked;
      if (childs[i].children)
        str = str + " children : " + childs[i].children.length;
      if (childs[i].name)
        str = str + " " + childs[i].name;
      list.push(str);
    }
  }

  const arrayDataItems = list.map((elm) => <li>{elm}</li>);

  return (
    <>

      <h1>Data</h1>
      
      <div className="container">
        <ul>{arrayDataItems}</ul>
        <p>
          {message}
        </p>
        <p>Paper handle size:{size}</p>

        
      </div>

    </>
  );

};

export default Data;