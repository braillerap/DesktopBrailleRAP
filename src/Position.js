import { useState, useContext} from 'react';
import AppContext from "./AppContext";

const Position = () => {

    const { Size, Position , GetPaperCanvas} = useContext(AppContext);
    const [NewX, setNewX] = useState(0);
    const [NewY, setNewY] = useState(0);

    const handleSetPosition = (e) => {
        e.stopPropagation();
        
        let canv = GetPaperCanvas();
        if (canv)
        {
            canv.setPositionCurrent(NewX, NewY);
        }   
    };
    return (
        <>
            

            
                <div className="Group">
                <h1>Position (mm)</h1>
                <p>{Position[0].toFixed(2)} - {Position[1].toFixed(2)}</p>
                <h1>Dimensions (mm)</h1>
                <p>{Size[0].toFixed(2)} - {Size[1].toFixed(2)}</p>
                </div>
                <div className="Group">
                    <p>
                        <label>
                            X: <input type="number"  name="myInputX" onChange={(e) => { setNewX(e.target.value) }} />
                        </label>
                    </p>
                    <p>
                        <label>
                            Y: <input type="number"  name="myInputY" onChange={(e) => { setNewY(e.target.value) }} />
                        </label>
                    </p>
                    <button onClick={handleSetPosition} className='pure-button'>Fixer la position</button>
                </div>
            
        </>
    );
};

export default Position;