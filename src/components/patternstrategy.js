import patterns from '../pat'

class PatternStrategy
{
    consructor ()
    {
        this.pattern_association = {};
    }
    

    getPattern (fillcolor, linecolor)
    {
        if (this.patterns.hasOwnProperty(fillcolor))
            return this.patterns[fillcolor];
        else
            return -1;
    }

    clearPatternAssociation ()
    {
        this.pattern_association = {};
    }

    setPatternAssociation (rgbcolor, patternid)
    {
        this.pattern_association[rgbcolor] = patternid;
    }
}