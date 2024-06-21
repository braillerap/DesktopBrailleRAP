
const DEFAULT_SPEED = 6000;			// Braillerap default speed
const DISTANCE_EJECT_PAGE = 20;		// distance to eject page from brailerap
class GeomToGCode
{
	

    constructor (speed=6000, accel=1500)
    {
        this.speed = speed;
		this.accel = accel;
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
	SetAccel = function (accel)
	{
		return 'M204 T' + accel + ';\r\n'
	}
    
    MoveTo (X, Y) {
		return 'G1' + this.gcodePosition(X, Y)
	}
    PrintDot = function () {
		let s = 'M3 S1;\r\n';
		s += 'M3 S0;\r\n';

		return (s);
	}

    GeomToGCode (pts, height)
    {
        this.gcode = [];
        this.gcode += this.Home ();
		this.gcode += this.SetAccel (this.accel);
        this.gcode += this.SetSpeed (this.speed);
        this.gcode += this.MoveTo(0,0);

        for (let p = 0; p < pts.length; p++)
        {
            this.gcode += this.MoveTo(pts[p].x, pts[p].y)
            this.gcode += this.PrintDot ();
        }
		// eject page at default speed
		this.gcode += this.SetSpeed (this.speed > DEFAULT_SPEED ? DEFAULT_SPEED : this.speed);
        
		// eject page
		this.gcode += this.MoveTo (0,height + DISTANCE_EJECT_PAGE);
        
		// shutdown motors
		this.gcode += this.MotorOff ();
    }

    GetGcode ()
    {
        return this.gcode;
    }
}

export default GeomToGCode;