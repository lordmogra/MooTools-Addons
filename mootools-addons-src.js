Element.implement({
    getOffsetAtAngle: function(A)
    {
        //angles A,B,C and sides a,b,c are in reference to sides and angles of a right triangle according to traditional trigonometry.
        var a; //Opposite A
        var b; //Adjacent A
        var c; //Hypotenuse
        
        //get the dimensions and coordinates of the Element.
        var coords = this.getCoordinates();
        var xRad = coords.width/2;
        var yRad = coords.height/2;
        
        //select offset based on side. b = offset + diameter/2
        var offset;
        var orientation;
        if ((A >= 315 && A <= 359) || (A >= 0 && A <= 44))
        {
            orientation = "t";
            offset = coords.top;
            b = offset + yRad;
        }
        else if (A >= 45 && A <= 134)
        {
            orientation = "r";
            offset = coords.right;
            b = offset + xRad;
        }
        else if (A >= 135 && A <= 224)
        {
            orientation = "b";
            offset = coords.bottom;
            b = offset + yRad;
        }
        else if (A >= 225 && A <= 314)
        {
            orientation = "l";
            offset = coords.left;
            b = offset + xRad;
        }
        else
        {
            throw angle + "is not a supported Angle, must be between 0 and 359 to be in a circle";    
        }
        
        c = b / Math.cos(A);
        a = c * Math.sin(A);
        
		var result;
        switch (orientation)
        {
            case "t":
                if (A >= 315)
                    result = {'margin-top': b, 'margin-left': a };
				else
                    result = {'margin-top': b, 'margin-right': a };
                break;
                
            case "r":
                if (A >= 90)
                    result = {'margin-bottom': a, 'margin-right': -b };
                else
                    result = {'margin-top': a, 'margin-right': b };
                break;
                
            case "b":
                if (A >= 180)
                    result = {'margin-bottom': b, 'margin-left': a };
                else
                    result = {'margin-bottom': b, 'margin-right': a };
                break;
                
            case "l":
                if (A >= 270)
                    result = {'margin-top': a, 'margin-left': b };
                else
                    result = {'margin-bottom': a, 'margin-left': b };
                break;
                
            default:
                throw "Realistically speaking, 'orientation' should never be '" + orientation + "'";
                break;
        }
		
		return result;
    }
});

if ($defined(LoadFX))
{
	LoadFX.addEffect('offscreen', {
		hide: function(el)
		{
			el.setStyles(el.getOffsetAtAngle($random(0,359)));
			el.setStyle('opacity', 0);
		},
		show: function(el)
		{
			el.setStyles({
				'margin-top': 0,
				'margin-right': 0,
				'margin-bottom': 0,
				'margin-left': 0,
				'opacity': 1
			});
		},
		reveal: function(el)
		{
			el.morph({
				'margin-top': 0,
				'margin-right': 0,
				'margin-bottom': 0,
				'margin-left': 0,
				'opacity': 1
			});
		},
		dissolve: function(el)
		{
			el.morph(el.getOffsetAtAngle($random(0,359)));
			el.tween('opacity', 0);
		}
	});
} 

Element.Events.konami = {
    base: 'keyup',
    condition: function(e){
        $clear(this.retrieve('konami_timeout'));
        var input = this.retrieve('konami_input',[]);
        input.push(e.key);
        if (input.join(',') == "up,up,down,down,left,right,left,right,b,a,enter"){
            this.removeEvents('konami');
            return true;
        }
        this.store('konami_input',input).store('konami_timeout',(function(){this.eliminate('konami_input');}).delay(2000,this));
    }
};