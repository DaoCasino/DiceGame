var TYPE_LINEAR    = 0;	
var TYPE_OUT_CUBIC = 1;	
var TYPE_IN_CUBIC  = 2;
var TYPE_OUT_BACK  = 3;				
var TYPE_IN_BACK   = 4;				
		
		
function ease( iTypeFunc, t, b, c, d, s){
    var fLerp;
    switch(iTypeFunc){
        case TYPE_LINEAR:{
                fLerp = easeLinear(t, b, c, d, s);
        }break;
        case TYPE_IN_CUBIC:{
                fLerp = easeInCubic(t, b, c, d, s);
        }break;
        case TYPE_OUT_CUBIC:{
                fLerp = easeOutCubic(t, b, c, d, s);
        }break;
        case TYPE_IN_BACK:{
                fLerp = easeInBack(t, b, c, d, s);
        }break;		
        case TYPE_OUT_BACK:{
                fLerp = easeInBack(t, b, c, d, s);
        }break;	
    }
    return fLerp;
}
		
//----------------------
// Bounce

/**
 * BOUNCE EASING OUT: exponentially decaying parabolic bounce, Interpolates a value between b and c parameters
 * </br><b>Note:</b></br>
 * &#38;nbsp;&#38;nbsp;&#38;nbsp;t and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */	
function easeOutBounce (t, b, c, d) {
    if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
    } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
    } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
    } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
    }
}
/**
 * BOUNCE EASING IN: exponentially decaying parabolic bounce, Interpolates a value between b and c parameters
 * </br><b>Note:</b></br>
 * &#38;nbsp;&#38;nbsp;&#38;nbsp;t and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */	
function easeInBounce (t, b, c, d) {
    return c - easeOutBounce (d-t, 0, c, d) + b;
}
/**
 * BOUNCE EASING IN/OUT: exponentially decaying parabolic bounce, Interpolates a value between b and c parameters
 * </br><b>Note:</b></br>
 * &#38;nbsp;&#38;nbsp;&#38;nbsp;t and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */	
function easeInOutBounce (t, b, c, d) {
    if (t < d/2) return easeInBounce (t*2, 0, c, d) * .5 + b;
    else return easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
}
		
//----------------------
// Circ

/**
 * Interpolates a value between b and c parameters
 * </br><b>Note:</b></br>
 * &#38;nbsp;&#38;nbsp;&#38;nbsp;t and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */	
function easeInCirc (t, b, c, d) {
        return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
}
/**
 * Interpolates a value between b and c parameters
 * </br><b>Note:</b></br>
 * &#38;nbsp;&#38;nbsp;&#38;nbsp;t and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */	
function easeOutCirc (t, b, c, d) {
        return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
}
/**
 * Interpolates a value between b and c parameters
 * </br><b>Note:</b></br>
 * &#38;nbsp;&#38;nbsp;&#38;nbsp;t and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */	
function easeInOutCirc (t, b, c, d) {
    if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
    return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
}
		
//----------------------
// Cubic
function easeInCubic (t, b, c, d, s) {
        return c*(t/=d)*t*t + b;
}
function easeOutCubic (t, b, c, d, s) {
        return c*((t=t/d-1)*t*t + 1) + b;
}
function easeInOutCubic (t, b, c, d, s) {
        if ((t/=d/2) < 1) return c/2*t*t*t + b;
        return c/2*((t-=2)*t*t + 2) + b;
}
		
//----------------------
// Elastic
function easeInElastic (t, b, c, d, s, a, p) {
        if (t == 0) {
                return b;
        }
        if ((t /= d) == 1) {
                return b + c;  
        }
        if (!p) {
                p=d*.3;
        }
        if (!a || a < Math.abs(c)) {
                a = c; 
                s = p / 4; 
        }else {
                s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
}

function easeOutElastic (t, b, c, d, s, a, p) {
    if (t == 0) {
            return b;
    }
    if ((t /= d) == 1) {
            return b + c;  
    }
    if (!p) {
            p=d*.3;
    }
    if (!a || a < Math.abs(c)) {
            a = c; 
            s = p / 4; 
    }else {
            s = p/(2*Math.PI) * Math.asin (c/a);
    }
    return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
}

function easeInOutElastic (t, b, c, d, s, a, p) {
    if (t == 0) {
            return b;
    }
    if ((t /= d) == 1) {
            return b + c;  
    }
    if (!p) {
            p=d*.3;
    }
    if (!a || a < Math.abs(c)) {
            a = c; 
            s = p / 4; 
    }else {
            s = p/(2*Math.PI) * Math.asin (c/a);
    }
    if (t < 1) {
            return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin( (t * d - s) * (2 * Math.PI) / p )) + b;
    }
    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
}	
		
//----------------------
// Expo
/**
 * Interpolates a value between b and c parameters
 * </br><b>Note:</b></br>
 * &#38;nbsp;&#38;nbsp;&#38;nbsp;t and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */	
function easeInExpo (t, b, c, d) {
    return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
}
/**
 * Interpolates a value between b and c parameters
 * </br><b>Note:</b></br>
 * &#38;nbsp;&#38;nbsp;&#38;nbsp;t and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */	
function easeOutExpo (t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
}
/**
 * Interpolates a value between b and c parameters
 * </br><b>Note:</b></br>
 * &#38;nbsp;&#38;nbsp;&#38;nbsp;t and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */	
function easeInOutExpo (t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
}	
		
//----------------------
// Linear	
/**
 * Interpolates a value between b and c parameters
 * </br><b>Note:</b></br>
 * &#38;nbsp;&#38;nbsp;&#38;nbsp;t and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */
function easeLinear (t, b, c, d) {
        return c*t/d + b;
}
		
//----------------------
// Quad		
/**
 * Interpolates a value between b and c parameters
 * </br><b>Note:</b></br>
 * &#38;nbsp;&#38;nbsp;&#38;nbsp;t and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */	
function easeInQuad (t, b, c, d) {
        return c*(t/=d)*t + b;
}
/**
 * Interpolates a value between b and c parameters
 * </br><b>Note:</b></br>
 * &#38;nbsp;&#38;nbsp;&#38;nbsp;t and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */	
function easeOutQuad (t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
}
/**
 * Interpolates a value between b and c parameters
 * </br><b>Note:</b></br>
 * &#38;nbsp;&#38;nbsp;&#38;nbsp;t and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */	
function easeInOutQuad (t, b, c, d) {
        if ((t /= (d/2)) < 1) return c/2*t*t + b;
        return -c/2 * ((--t)*(t-2) - 1) + b;
}
		
//----------------------
// Quart
/**
 * Interpolates a value between b and c parameters
 * </br><b>Note:</b></br>
 * &#38;nbsp;&#38;nbsp;&#38;nbsp;t and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */	
function easeInQuart (t, b, c, d) {
        return c*(t/=d)*t*t*t + b;
}
/**
 * Interpolates a value between b and c parameters
 * </br><b>Note:</b></br>
 * &#38;nbsp;&#38;nbsp;&#38;nbsp;t and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */	
function easeOutQuart (t, b, c, d) {
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
}
/**
 * Interpolates a value between b and c parameters
 * </br><b>Note:</b></br>
 * &#38;nbsp;&#38;nbsp;&#38;nbsp;t and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */	
function easeInOutQuart (t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
}	
		
//----------------------
// Quint		
/**
 * Interpolates a value between b and c parameters
 * </br><b>Note:</b></br>
 * &#38;nbsp;&#38;nbsp;&#38;nbsp;t and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */	
function easeInQuint (t, b, c, d) {
        return c*(t/=d)*t*t*t*t + b;
}
/**
 * Interpolates a value between b and c parameters
 * </br><b>Note:</b></br>
 * &#38;nbsp;&#38;nbsp;&#38;nbsp;t and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */	
function easeOutQuint (t, b, c, d) {
        return c*((t=t/d-1)*t*t*t*t + 1) + b;
}
/**
 * Interpolates a value between b and c parameters
 * </br><b>Note:</b></br>
 * &#38;nbsp;&#38;nbsp;&#38;nbsp;t and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */	
function easeInOutQuint (t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
        return c/2*((t-=2)*t*t*t*t + 2) + b;
}	
		
//----------------------
// Sine	
/**
 * Interpolates a value between b and c parameters
 * </br><b>Note:</b></br>
 * &#38;nbsp;&#38;nbsp;&#38;nbsp;t and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */	
function easeInSine (t, b, c, d) {
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
}
/**
 * Interpolates a value between b and c parameters
 * </br><b>Note:</b></br>
 * &#38;nbsp;&#38;nbsp;&#38;nbsp;t and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */	
function easeOutSine (t, b, c, d) {
        return c * Math.sin(t/d * (Math.PI/2)) + b;
}
/**
 * Interpolates a value between b and c parameters
 * </br><b>Note:</b></br>
 * &#38;nbsp;&#38;nbsp;&#38;nbsp;t and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */	
function easeInOutSine (t, b, c, d) {
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
}	
		
//----------------------
// Back
function easeInBack (t, b, c, d) {
        return c*(t/=d)*t*((1.70158+1)*t - 1.70158) + b;
}
function easeOutBack (t, b, c, d ) {
        return c*((t=t/d-1)*t*((1.70158+1)*t + 1.70158) + 1) + b;
}
	