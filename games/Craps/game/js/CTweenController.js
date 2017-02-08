
function CTweenController(){
    
    this.tweenValue = function( fStart, fEnd, fLerp ){
        return fStart + fLerp *( fEnd-fStart);     
    };
    
    this.easeLinear = function(t, b, c, d) {
            return c*t/d + b;
    };
    
    this.easeInCubic = function(t, b, c, d) {
	var tc=(t/=d)*t*t;
	return b+c*(tc);
    };


    this.easeBackInQuart =  function(t, b, c, d) {
	var ts=(t/=d)*t;
	var tc=ts*t;
	return b+c*(2*ts*ts + 2*tc + -3*ts);
    };
    
    this.easeInBack = function(t, b, c, d ) {
        return c*(t/=d)*t*((1.70158+1)*t - 1.70158) + b;
    };
    
    this.easeOutCubic = function(t, b, c, d){
        return c*((t=t/d-1)*t*t + 1) + b;
    };
    
    this.easeInOutCubic = function(t, b, c, d) {
        if ((t /= (d/2) ) < 1) return c/2*t*t*t + b;
        return c/2*((t-=2)*t*t + 2) + b;
    };
    
    this.tweenVectors = function( vStart, vEnd, iLerp,vOut ){
        vOut.x = vStart.x + iLerp *( vEnd.x-vStart.x);
        vOut.y = vStart.y + iLerp *( vEnd.y - vStart.y);
        return vOut;
    };
}