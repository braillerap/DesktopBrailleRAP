class GeomToGCode
{
    constructor ()
    {
        this.speed = 6000;
        this.gcode = [];
    	
    }

    MotorOff ()
	{
		return 'M84;\r\n';
	}

	Home ()
	{
		let str = 'G28 X;\r\n';
		str += 'G28 Y;\r\n';

		return str;
	}
    gcodePosition (X, Y) {
		let code = ''
		if(X == null && Y == null) {
			throw new Error("Null position when moving")
		}
		if(X != null) {
			code += ' X' + X.toFixed(2)
		}
		if(Y != null) {
			code += ' Y' + Y.toFixed(2)
		}
		
		code += ';\r\n'
		return code
	}

	gcodeResetPosition (X, Y) {
		return 'G92' + this.gcodePosition(X, Y);
	}

	SetSpeed = function(speed) {
		return 'G1 F' + speed + ';\r\n'
	}
    
    MoveTo (X, Y) {
		return 'G1' + this.gcodePosition(X, Y)
	}
    PrintDot = function () {
		let s = 'M3 S1;\r\n';
		s += 'M3 S0;\r\n';

		return (s);
	}

    GeomToGCode (pts)
    {
        this.gcode = [];
        this.gcode += this.Home ();
        this.gcode += this.SetSpeed (this.speed);
        this.gcode += this.MoveTo(0,0);

        for (let p = 0; p < pts.length; p++)
        {
            //console.log (p);
            //console.log (typeof(pts));
            //console.log (typeof(pts[p]));
            //console.log (pts[p].x, pts[p].y);
            this.gcode += this.MoveTo(pts[p].x, pts[p].y)
            this.gcode += this.PrintDot ();
        }

        this.gcode += this.MoveTo (0,300);
        this.gcode += this.MotorOff ();
    }

    GetGcode ()
    {
        return this.gcode;
    }
}

export default GeomToGCode;