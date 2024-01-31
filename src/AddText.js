import {useState, useContext } from 'react';
import AppContext from "./AppContext";

const AddText = () => {
    const [Message, setMessage] = useState("Nouveau");
    const {GetImportText} = useContext(AppContext);

    const handleMessageChange = (e) => {
        if (e.target.value)
        {
            setMessage (e.target.value);
        }
        
      };
     const handleAddButton = () => {
        let f = GetImportText ();
        if (f)
        {
            f(Message);
        }
     }
    return (
    <>
        <h1>Ajout d'une ligne de texte</h1>
        
        <div>
        <label>
        Texte: <input name="myInput" onChange={handleMessageChange} maxLength="31" size="31"/>
        </label>
        <p>{Message}</p>
        <button onClick={handleAddButton} className='pure-button'>
          Ajouter
        </button>
        </div>
    </>
    );
  };
  
  export default AddText;