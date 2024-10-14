import patternssvg from '../patterns/packagesvg.json'

class PatternStrategy
{
    consructor ()
    {
        this.pattern_association = {};
    }
    

    getPatternId (fillcolor, linecolor)
    {
        let csscolor = 'rgb(' + Math.round(fillcolor.red * 255) + ',' 
                + Math.round(fillcolor.green * 255) + ',' 
                + Math.round(fillcolor.blue * 255) + ')';
        
        console.log ("search strategy " + fillcolor + " " + csscolor);
        if (this.pattern_association.hasOwnProperty(fillcolor))
        {
            console.log ("returned pattern " + fillcolor);
            return this.pattern_association[fillcolor];
        }
        else
        {

            if (this.pattern_association.hasOwnProperty(csscolor))
            {
                console.log ("returned pattern " + csscolor);
                return this.pattern_association[csscolor];
            }
            else 
                return -1;
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
}

export default PatternStrategy;