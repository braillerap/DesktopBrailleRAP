import patternssvg from '../patterns/packagesvg.json'

class PatternStrategy
{
    constructor ()
    {
        this.pattern_association = {};
    }
    

    getPatternId (fillcolor, linecolor)
    {
        let csscolor ='';
        if (fillcolor)
        {
            if (fillcolor.hasOwnProperty('alpha'))
            {
                csscolor = 'rgb(' + Math.round(fillcolor.red * 255) + ',' 
                + Math.round(fillcolor.green * 255) + ',' 
                + Math.round(fillcolor.blue * 255) + ','
                + Math.round(fillcolor.alpha * 255) + ')';
            }
            else
                csscolor = 'rgb(' + Math.round(fillcolor.red * 255) + ',' 
                + Math.round(fillcolor.green * 255) + ',' 
                + Math.round(fillcolor.blue * 255) + ')';
            
        }    
        //console.log ("search strategy " + fillcolor + " " + csscolor + " " + typeof(fillcolor));
        if (this.pattern_association.hasOwnProperty(fillcolor))
        {
            //console.group ("returned pattern " );
            //console.table(this.pattern_association[fillcolor]);
            //console.groupEnd ();            
            return this.pattern_association[fillcolor];
        }
        else
        {

            if (this.pattern_association.hasOwnProperty(csscolor))
            {
                //console.group ("returned pattern " );
                //console.table (this.pattern_association[csscolor]);
                //console.groupEnd ();            
                return this.pattern_association[csscolor];
            }
            else 
            {
                //console.log ("pattern not found " + fillcolor);
                return -1;
            }
        }
    }

    clearPatternAssociation ()
    {
        this.pattern_association = {};
    }

    setPatternAssociation (rgbcolor, patternid)
    {
        this.pattern_association[rgbcolor] = patternid;
    }

    setPatternAssociationDict (dict)
    {
        this.pattern_association = dict;
    }

    isStrategyValid ()
    {
        let valid = false;
        for (const assoc in this.pattern_association)
        {
            if (this.pattern_association[assoc] != -1)
            {
                console.log ("strategy valided");
                valid = true;
                break;
            }
        }
        return valid;
    }
}

export default PatternStrategy;