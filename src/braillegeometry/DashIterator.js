
class DashIterator 
{

    // constructor
    // dash: an array of dash definition
    // step: distance in mm of two consecutive points
    // each dash definition is a couple value in a array
    // the first value is the number of dot to draw
    // the second value is the number of dot to skip
    // "dash":[
    //     [1,1],
    //     [3,1],
    //     ]
    constructor (dash, step) 
    {
        this.step = step;
        this.dash = dash;
        this.didx = 0;  // dash index
        this.idx = 0;   // index in dash
    }

    reset ()
    {
        this.didx = 0;
        this.idx = 0;
        return 0;
    }

    isempty ()
    {
        if (! this.dash)
            return true;
        if (this.dash.length < 1)
            return true;
        if (this.dash[0].length < 2)
            return true;
        if (this.dash[0][0] == 0 && this.dash[0][1] == 0)
            return true;
        return false;
    }
    next ()
    {
        let ret = this.step;
        this.idx +=1;
        if (this.idx < this.dash[this.didx][0])
            return ret;
        
        this.idx = 0;
        ret = (this.dash[this.didx][1] + 1) * this.step;
        
        this.didx +=1;
        if (this.didx >= this.dash.length)
            this.didx = 0;
        return ret;
    }
    
}

export default DashIterator;