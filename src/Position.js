import { useState, useContext} from 'react';
import AppContext from "./AppContext";

const Position = () => {

    const { Size, Position , Angle, GetPaperCanvas} = useContext(AppContext);
    const [NewX, setNewX] = useState(0);
    const [NewY, setNewY] = useState(0);
    const [NewAngle, setNewAngle] = useState(0);
    const [NewScale, setNewScale] = useState(1);

    const handleSetPosition = (e) => {
        e.stopPropagation();
        
        let canv = GetPaperCanvas();
        if (canv)
        {
            canv.setPositionCurrent(NewX, NewY);
        }   
    };
    const handleSetAngle = (e) => {
        e.stopPropagation();
        
        let canv = GetPaperCanvas();
        if (canv)
        {
            canv.setAngleCurrent(NewAngle);
        }   
    };
    const handleSetScale = (e) => {
        e.stopPropagation();
        
        let canv = GetPaperCanvas();
        if (canv)
        {
            canv.setScaleCurrent(NewScale);
        }   
    };
    return (
        <>
            

                <div className='div_column'>
                    <div className="Group">
                        <h3>Position (mm)</h3>
                        <p>{Position[0].toFixed(2)} - {Position[1].toFixed(2)}</p>
                        <h3>Dimensions (mm)</h3>
                        <p>{Size[0].toFixed(2)} - {Size[1].toFixed(2)}</p>
                    </div>
                    <div className="Group">
                        <h3>Angle (deg)</h3>
                        <p>{Angle.toFixed(2)} </p>
                    </div>
                    <div className="Group">
                        <h3>Echelle </h3>
                        <p>{Angle.toFixed(2)} </p>
                    </div>
                </div>
                <div className='div_column'>
                    <div className="Group">
                        <p>
                            <label>
                                X: <input type="number"  name="myInputX" style={{ width: "5em" }} onChange={(e) => { setNewX(e.target.value) }} />
                            </label>
                        </p>
                        <p>
                            <label>
                                Y: <input type="number"  name="myInputY" style={{ width: "5em" }} onChange={(e) => { setNewY(e.target.value) }} />
                            </label>
                        </p>
                        <button onClick={handleSetPosition} className='pure-button'>Fixer la position</button>
                    </div>
                    <div className="Group">
                        <p>
                            <label>
                                Angle: <input type="number"  name="myInputA" style={{ width: "3em" }} onChange={(e) => { setNewAngle(e.target.value) }} />
                            </label>
                        </p>
                        
                        <button onClick={handleSetAngle} className='pure-button'>Fixer l'angle</button>
                    </div>
                    <div className="Group">
                        <p>
                            <label>
                                Echelle: <input type="number"  name="myInputS" style={{ width: "3em" }} onChange={(e) => { setNewScale(e.target.value) }} />
                            </label>
                        </p>
                        
                        <button onClick={handleSetScale} className='pure-button'>Fixer l'echelle</button>
                    </div>
                </div>
        </>
    );
};

export default Position;