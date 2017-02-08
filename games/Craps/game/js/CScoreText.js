function CScoreText (iScore,x,y){
    
    var _oScoreText;
    
    
    this._init = function(iScore,x,y){

        _oScoreText = new createjs.Text("+"+iScore," 30px "+FONT1, "#ffffff");
        _oScoreText.textAlign="center";
        _oScoreText.x = x;
        _oScoreText.y = y - 10;
        _oScoreText.alpha = 0;
        _oScoreText.shadow = new createjs.Shadow("#000000", 2, 2, 2);
        s_oStage.addChild(_oScoreText);

        createjs.Tween.get(_oScoreText).to({alpha:1}, 500, createjs.Ease.quadIn).call(function(){createjs.Tween.get(_oScoreText).wait(1000).to({alpha:0}, 500);});
        this.moveUp();
    };
	
    this.moveUp = function(){
        var iNewY = _oScoreText.y-40;
        var oParent = this;
        createjs.Tween.get(_oScoreText).to({y:iNewY}, 2000, createjs.Ease.sineIn).call(function(){oParent.unload();});
        
    };
	
    this.unload = function(){
        s_oStage.removeChild(_oScoreText);
    };
	
    this._init(iScore,x,y);
    
}