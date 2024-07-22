
class BackendPyWebview {
    async confirm_dialog (title, message)
    {
        let ret = await window.pywebview.api.confirm_dialog(title,message);
        console.log ("return from pywebview confirm_dialog: ", ret)
        if (ret)
            return true;
        else
            return false;
    }
};

class Backend {
    constructor() {
        this.backendready = false;   
        this.backend = new BackendPyWebview();
    }

    isbackendready() 
    { 
        return this.backendready; 
    }

    setbackendready (status)
    {
        this.backendready = status;
    }

    async confirm_dialog (title, message)
    {
        if (this.backendready)
        {
            let ret = await this.backend.confirm_dialog(title, message);
            console.log ("return from backend confirm_dialog: ", ret)
            return ret;
            
        }
    }
}

export default Backend;
