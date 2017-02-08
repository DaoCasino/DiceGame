function CPreloader(){
    var _iMaskWidth;
    var _oLoadingText;
    var _oFakeLoadingText
    var _oProgressBar;
    var _oMaskPreloader;
    var _oContainer;
    
    this._init = function(){
       s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );
       s_oSpriteLibrary.addSprite("bg_menu","./sprites/bg_menu.jpg");
       s_oSpriteLibrary.addSprite("progress_bar","./sprites/progress_bar.png");
       s_oSpriteLibrary.loadSprites();
       
       _oContainer = new createjs.Container();
       s_oStage.addChild(_oContainer); 
    };
    
    this.unload = function(){
	_oContainer.removeAllChildren();
    };
    
    this._onImagesLoaded = function(){

    };
    
    this._onAllImagesLoaded = function(){
        this.attachSprites();
        
        s_oMain.preloaderReady();
    };
    
    this.attachSprites = function(){
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        _oContainer.addChild(oBg);
       
       _oProgressBar  = createBitmap(s_oSpriteLibrary.getSprite('progress_bar'));
       _oProgressBar.x = 400;
       _oProgressBar.y = CANVAS_HEIGHT - 140;
       _oContainer.addChild(_oProgressBar);
       
       _iMaskWidth = 476;
       _oMaskPreloader = new createjs.Shape();
       _oMaskPreloader.graphics.beginFill("rgba(255,0,0,0.01)").drawRect(400, CANVAS_HEIGHT - 140, 1,30);
       _oContainer.addChild(_oMaskPreloader);
       
       _oProgressBar.mask = _oMaskPreloader;
       _oLoadingText = new createjs.Text("0%","30px "+FONT1, "#fff");
       _oLoadingText.x = 450;
       _oLoadingText.y = CANVAS_HEIGHT - 140;
       _oLoadingText.textAlign = "center"; 
       _oLoadingText.textBaseline = "middle";
       _oContainer.addChild(_oLoadingText);
       
       _oFakeLoadingText = new createjs.Text("0%","30px "+FONT2, "#fff");
       _oFakeLoadingText.x = CANVAS_WIDTH + 200;
       _oFakeLoadingText.y = CANVAS_HEIGHT + 140;
       _oFakeLoadingText.textAlign = "center"; 
       _oFakeLoadingText.textBaseline = "middle";
       _oContainer.addChild(_oFakeLoadingText);
    };
    
    this.refreshLoader = function(iPerc){
        _oLoadingText.text = iPerc+"%";
        _oFakeLoadingText.text = iPerc+"%";
        
        var iNewMaskWidth = Math.floor((iPerc*_iMaskWidth)/100);
        _oMaskPreloader.graphics.clear();
        _oMaskPreloader.graphics.beginFill("rgba(255,0,0,0.01)").drawRect(400, CANVAS_HEIGHT - 140, iNewMaskWidth,30);
    };
    
    this._init();   
}