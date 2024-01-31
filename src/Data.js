import { useContext } from 'react'
import AppContext from "./AppContext";

const Data = () => {
  const { message, GetPaper } = useContext(AppContext);
  let paper = GetPaper ();
  let size = -1;
  if (paper)
    size = paper.settings.handleSize;

    return (
    <>
    
      <h1>Data</h1>
      <p>Some text</p>
      <div className="container">
        <div className="item">
        item1
        </div>
        <div className="item">
        item2
        <p>
        {message}
          </p>
          <p>Paper handle size:{size}</p>
        </div>
        <div className="item">
        item3
        </div>
      </div>
      
    </>
    );
    
  };
  
  export default Data;