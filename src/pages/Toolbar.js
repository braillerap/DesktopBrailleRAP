import { useContext } from 'react';
import { FaArrowsUpDownLeftRight } from "react-icons/fa6";
import { FaArrowRotateRight } from "react-icons/fa6";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaEraser } from "react-icons/fa6";
import { FaArrowUpWideShort } from "react-icons/fa6";
import { FaArrowDownShortWide } from "react-icons/fa6";
import mouseMode from '../mouseMode';
import AppContext from "../components/AppContext";


const Toolbar = () => {
  // TODO : clarify use of state or context call
    const {MouseMode, setMouseMode,GetPaperCanvas, GetLocaleString, GetBackend} = useContext(AppContext);

    let classrotate = MouseMode === mouseMode.ROTATE ? "toolbar_active" : "";
    let classmove = MouseMode === mouseMode.MOVE ? "toolbar_active" : "";
    let classscale = MouseMode === mouseMode.SCALE ? "toolbar_active" : "";
    
    //console.log ("Toolbar render :" + MouseMode + " rotate=" + classrotate + " move=" + classmove + " scale=" + classscale);
    // 
    // set mode to positionning
    //
    const handleSetMove = () => {
        let canv = GetPaperCanvas ();
        if (canv)
        {
          setMouseMode(mouseMode.MOVE);
          canv.setMouseMode(mouseMode.MOVE);
        }
    }
    // 
    // set mode to rotate
    //
    const handleSetRotate = () => {
      let canv = GetPaperCanvas ();
      if (canv)
      {
        setMouseMode(mouseMode.ROTATE);
        canv.setMouseMode(mouseMode.ROTATE);
      }
    }

    // 
    // set mode to rotate
    //
    const handleSetScale = () => {
      
      let canv = GetPaperCanvas ();
      if (canv)
      {
        setMouseMode(mouseMode.SCALE);
        canv.setMouseMode(mouseMode.SCALE);
      }
    }
    //
    // delete selected object
    //
    const handleDelete = () => {
      let canv = GetPaperCanvas ();
      if (canv)
      {
        canv.SelectedDelete ();
      }
    }

    // 
    // clear the project
    //
    const handleDeleteAll = async () => {
      let canv = GetPaperCanvas ();
      if (canv)
      {
        if (GetBackend().isbackendready())
        {
          let test = await GetBackend ().confirm_dialog ("DesktopBrailleRAP", GetLocaleString("toolbar.confirm.deleteall"));
          console.log (test);
          if (test === true)
          {
            canv.DeleteAll ();
          }  
        }
        else if (window.confirm(GetLocaleString("toolbar.confirm.deleteall")) === true) 
        {
          canv.DeleteAll ();
        }
      }
    }
    //
    // move selected object up in Z order
    //
    const handleUp = () => {
      let canv = GetPaperCanvas ();
      if (canv)
      {
        canv.SelectedUp ();
      }
    }
    //
    // move selected object down in Z order
    //
    const handleDown = () => {
      
      let canv = GetPaperCanvas ();
      if (canv)
      {
        canv.SelectedDown ();
      }
    }

    return (
    <>
        <div className="toolbar">
            
            <button className ="pure-button " onClick={handleSetMove}>
            <FaArrowsUpDownLeftRight className={classmove}/>
            </button>

            <button className ="pure-button " onClick={handleSetRotate}>
              <FaArrowRotateRight className={classrotate}/>
            </button>

            <button className ="pure-button " onClick={handleSetScale}>
              <FaArrowUpRightFromSquare className={classscale}/>
            </button>
            &nbsp;
            
            <button className ="pure-button " onClick={handleDelete}>
            <FaEraser />
            
            
            </button>
            &nbsp;
            <button className ="pure-button " onClick={handleDeleteAll}>
            <FaRegTrashCan />
            
            </button>
            &nbsp;
            <button className ="pure-button " onClick={handleUp}>
            <FaArrowUpWideShort />
            
            </button>
            <button className ="pure-button " onClick={handleDown}>
            <FaArrowDownShortWide />
            
            </button>

        </div>

    </>
    );
  };
  
  export default Toolbar;