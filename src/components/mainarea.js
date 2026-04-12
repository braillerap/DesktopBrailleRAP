import { useState, useContext} from 'react';
import AppContext from "./AppContext";
import { Outlet, Link, useLocation} from "react-router-dom";
import PaperCanvas from "../PaperCanvas";

const MainArea = () => {
    const {NeedParamCheck} = useContext(AppContext);

    const handleClickParam = () => {
        //if (this.props.focuscb)
        //    this.props.focuscb();
    }

    
    
    if (NeedParamCheck)
    {
        return (
            
        <div>

          <h1 aria-label='Formulaire de saisie du texte'>

          </h1>
          <ul className={this.context.getStyleClass('menu')}>
            <li >
              <Link to="/parametre" 
                onClick={this.handleClickParam}
                ref={this.props.focusref}
              >
                Braille transcription table is not consistent, please check parameters
              </Link>
               <Link to="/parametre" 
                onClick={handleClickParam}
                
              >
                Paramètres
              </Link>
            </li>
          </ul>

        </div>
      );
        
    }
    
    
    return (
        <>
            

                <div className="App-Work">
                    <PaperCanvas Id="canvasid" />
                </div>    
                <div className="App-function">
                    <Outlet />
                </div>
        </>
    );
};

export default MainArea;