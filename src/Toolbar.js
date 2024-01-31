import { useContext } from 'react';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AppContext from "./AppContext";

const Toolbar = () => {
    const {Rotate, setRotate,GetPaperCanvas} = useContext(AppContext);

    let classrotate = Rotate ? "toolbar_active" : "";
    let classmove = Rotate ? "" : "toolbar_active";

    const handleSetMove = () => {
        let canv = GetPaperCanvas ();
        if (canv)
        {
          setRotate(false);
          canv.setRotate(false);
        }
    }
    const handleSetRotate = () => {
      let canv = GetPaperCanvas ();
      if (canv)
      {
        setRotate(true);
        canv.setRotate(true);
      }
    }

    const handleDelete = () => {
      let canv = GetPaperCanvas ();
      if (canv)
      {
        canv.SelectedDelete ();
      }
    }

    const handleUp = () => {
      let canv = GetPaperCanvas ();
      if (canv)
      {
        canv.SelectedUp ();
      }
    }

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