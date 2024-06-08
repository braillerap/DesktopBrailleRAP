import { useContext } from 'react';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AppContext from "./AppContext";

const Toolbar = () => {
  // TODO : clarify use of state or context call
    const {MouseMode, setMouseMode,GetPaperCanvas} = useContext(AppContext);

    let classrotate = MouseMode ? "toolbar_active" : "";
    let classmove = MouseMode ? "" : "toolbar_active";

    // 
    // set mode to positionning
    //
    const handleSetMove = () => {
        let canv = GetPaperCanvas ();
        if (canv)
        {
          setMouseMode(false);
          canv.setMouseMode(false);
        }
    }
    // 
    // set mode to rotate
    //
    const handleSetRotate = () => {
      let canv = GetPaperCanvas ();
      if (canv)
      {
        setMouseMode(true);
        canv.setMouseMode(true);
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
    const handleDeleteAll = () => {
      let canv = GetPaperCanvas ();
      if (canv)
      {
        if (window.confirm("Etes vous sur de vouloir effacer ce document") === true) 
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
            <FontAwesomeIcon icon={icon({name: 'up-down-left-right', family: 'classic', style: 'solid'})} className ={classmove}/>
            </button>

            <button className ="pure-button " onClick={handleSetRotate}>
            <FontAwesomeIcon icon={icon({name: 'rotate', family: 'classic', style: 'solid'})} className ={classrotate}/>
            </button>
            &nbsp;
            
            <button className ="pure-button " onClick={handleDelete}>
            <FontAwesomeIcon icon={icon({name: 'eraser', family: 'classic', style: 'solid'})} />
            </button>
            &nbsp;
            <button className ="pure-button " onClick={handleDeleteAll}>
            <FontAwesomeIcon icon={icon({name: 'trash-can', family: 'classic', style: 'regular'})} />
            </button>
            &nbsp;
            <button className ="pure-button " onClick={handleUp}>
            <FontAwesomeIcon icon={icon({name: 'arrow-up-wide-short', family: 'classic', style: 'solid'})} />
            </button>
            <button className ="pure-button " onClick={handleDown}>
            <FontAwesomeIcon icon={icon({name: 'arrow-down-short-wide', family: 'classic', style: 'solid'})} />
            </button>

        </div>

    </>
    );
  };
  
  export default Toolbar;