function CMain(oData){
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    
    var _oData;
    var _oPreloader;
    var _oMenu;
    var _oHelp;
    var _oGame;

    this.initContainer = function(){
        var canvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(canvas);       
        createjs.Touch.enable(s_oStage);
        
        s_bMobile = jQuery.browser.mobile;
        if(s_bMobile === false){
            s_oStage.enableMouseOver(20);  
        }
        
        
        s_iPrevTime = new Date().getTime();

        createjs.Ticker.setFPS(FPS);
	createjs.Ticker.addEventListener("tick", this._update);
		
        if(navigator.userAgent.match(/Windows Phone/i)){
                DISABLE_SOUND_MOBILE = true;
        }
		
        s_oSpriteLibrary  = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();
    };

    this.soundLoaded = function(){
         _iCurResource++;

         if(_iCurResource === RESOURCE_TO_LOAD){
            _oPreloader.unload();
            
            this.gotoMenu();
         }
    };
    
    this._initSounds = function(){
         if (!createjs.Sound.initializeDefaultPlugins()) {
             return;
         }
	
        if(navigator.userAgent.indexOf("Opera")>0 || navigator.userAgent.indexOf("OPR")>0){
                createjs.Sound.alternateExtensions = ["mp3"];
                createjs.Sound.addEventListener("fileload", createjs.proxy(this.soundLoaded, this));

                createjs.Sound.registerSound("./sounds/chip.ogg", "chip");
                createjs.Sound.registerSound("./sounds/click.ogg", "click");
                createjs.Sound.registerSound("./sounds/fiche_collect.ogg", "fiche_collect");
                createjs.Sound.registerSound("./sounds/fiche_select.ogg", "fiche_select");
                createjs.Sound.registerSound("./sounds/dice_rolling.ogg", "dice_rolling");
                createjs.Sound.registerSound("./sounds/win.ogg", "win");
                createjs.Sound.registerSound("./sounds/lose.ogg", "lose");
        }else{
                createjs.Sound.alternateExtensions = ["ogg"];
                createjs.Sound.addEventListener("fileload", createjs.proxy(this.soundLoaded, this));

                createjs.Sound.registerSound("./sounds/chip.mp3", "chip");
                createjs.Sound.registerSound("./sounds/click.mp3", "click");
                createjs.Sound.registerSound("./sounds/fiche_collect.mp3", "fiche_collect");
                createjs.Sound.registerSound("./sounds/fiche_select.mp3", "fiche_select");
                createjs.Sound.registerSound("./sounds/dice_rolling.mp3", "dice_rolling");
                createjs.Sound.registerSound("./sounds/win.mp3", "win");
                createjs.Sound.registerSound("./sounds/lose.mp3", "lose");
        }
        
        RESOURCE_TO_LOAD += 5;
    };
    
    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );

	s_oSpriteLibrary.addSprite("bg_menu","./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("msg_box","./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("chip_box","./sprites/chip_box.png");
        s_oSpriteLibrary.addSprite("but_bets","./sprites/but_bets.png");
        s_oSpriteLibrary.addSprite("but_bg","./sprites/but_bg.png");
        s_oSpriteLibrary.addSprite("but_clear_all","./sprites/but_clear_all.png");
        s_oSpriteLibrary.addSprite("but_play","./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("logo_credits","./sprites/logo_credits.png");
        s_oSpriteLibrary.addSprite("but_credits","./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("ball","./sprites/ball.png");
        s_oSpriteLibrary.addSprite("enlight_any_craps","./sprites/enlight_any_craps.png");
        s_oSpriteLibrary.addSprite("enlight_big_6","./sprites/enlight_big_6.png");
        s_oSpriteLibrary.addSprite("enlight_big_8","./sprites/enlight_big_8.png");
        s_oSpriteLibrary.addSprite("enlight_circle","./sprites/enlight_circle.png");
        s_oSpriteLibrary.addSprite("enlight_come","./sprites/enlight_come.png");
        s_oSpriteLibrary.addSprite("enlight_dont_come","./sprites/enlight_dont_come.png");
        s_oSpriteLibrary.addSprite("enlight_dont_pass1","./sprites/enlight_dont_pass1.png");
        s_oSpriteLibrary.addSprite("enlight_dont_pass2","./sprites/enlight_dont_pass2.png");
        s_oSpriteLibrary.addSprite("enlight_field","./sprites/enlight_field.png");
        s_oSpriteLibrary.addSprite("enlight_lay_bet","./sprites/enlight_lay_bet.png");
        s_oSpriteLibrary.addSprite("enlight_lose_bet","./sprites/enlight_lose_bet.png");
        s_oSpriteLibrary.addSprite("enlight_number","./sprites/enlight_number.png");
        s_oSpriteLibrary.addSprite("enlight_pass_line","./sprites/enlight_pass_line.png");
        s_oSpriteLibrary.addSprite("enlight_proposition1","./sprites/enlight_proposition1.png");
        s_oSpriteLibrary.addSprite("enlight_proposition2","./sprites/enlight_proposition2.png");
        s_oSpriteLibrary.addSprite("enlight_seven","./sprites/enlight_seven.png");
        s_oSpriteLibrary.addSprite("enlight_any11","./sprites/enlight_any11.png");
        
        s_oSpriteLibrary.addSprite("hit_area_any_craps","./sprites/hit_area_any_craps.png");
        s_oSpriteLibrary.addSprite("hit_area_big_8","./sprites/hit_area_big_8.png");
        s_oSpriteLibrary.addSprite("hit_area_big_6","./sprites/hit_area_big_6.png");
        s_oSpriteLibrary.addSprite("hit_area_circle","./sprites/hit_area_circle.png");
        s_oSpriteLibrary.addSprite("hit_area_come","./sprites/hit_area_come.png");
        s_oSpriteLibrary.addSprite("hit_area_dont_come","./sprites/hit_area_dont_come.png");
        s_oSpriteLibrary.addSprite("hit_area_dont_pass1","./sprites/hit_area_dont_pass1.png");
        s_oSpriteLibrary.addSprite("hit_area_dont_pass2","./sprites/hit_area_dont_pass2.png");
        s_oSpriteLibrary.addSprite("hit_area_field","./sprites/hit_area_field.png");
        s_oSpriteLibrary.addSprite("hit_area_lay_bet","./sprites/hit_area_lay_bet.png");
        s_oSpriteLibrary.addSprite("hit_area_lose_bet","./sprites/hit_area_lose_bet.png");
        s_oSpriteLibrary.addSprite("hit_area_number","./sprites/hit_area_number.png");
        s_oSpriteLibrary.addSprite("hit_area_pass_line","./sprites/hit_area_pass_line.png");
        s_oSpriteLibrary.addSprite("hit_area_proposition1","./sprites/hit_area_proposition1.png");
        s_oSpriteLibrary.addSprite("hit_area_proposition2","./sprites/hit_area_proposition2.png");
        s_oSpriteLibrary.addSprite("hit_area_seven","./sprites/hit_area_seven.png");
        s_oSpriteLibrary.addSprite("hit_area_any11","./sprites/hit_area_any11.png");
        s_oSpriteLibrary.addSprite("select_fiche","./sprites/select_fiche.png");
        s_oSpriteLibrary.addSprite("roll_but","./sprites/roll_but.png");
        s_oSpriteLibrary.addSprite("dices_screen_bg","./sprites/dices_screen_bg.jpg");
        s_oSpriteLibrary.addSprite("logo_game_0","./sprites/logo_game_0.png");
        s_oSpriteLibrary.addSprite("board_table","./sprites/board_table.jpg");
        s_oSpriteLibrary.addSprite("display_bg","./sprites/display_bg.png");
        s_oSpriteLibrary.addSprite("puck","./sprites/puck.png");
        s_oSpriteLibrary.addSprite("dice_topdown1","./sprites/dice_topdown1.png");
        s_oSpriteLibrary.addSprite("dice_topdown2","./sprites/dice_topdown2.png");
        s_oSpriteLibrary.addSprite("but_not","./sprites/but_not.png");
        s_oSpriteLibrary.addSprite("but_yes","./sprites/but_yes.png");
        s_oSpriteLibrary.addSprite("dice_a","./sprites/dice_a.png");
        s_oSpriteLibrary.addSprite("dice_b","./sprites/dice_b.png");
        s_oSpriteLibrary.addSprite("dices_box","./sprites/dices_box.png");
        
        for(var i=0;i<NUM_FICHES;i++){
            s_oSpriteLibrary.addSprite("fiche_"+i,"./sprites/fiche_"+i+".png");
        }
        
        for(var j=0;j<NUM_DICE_ROLLING_FRAMES;j++){
            s_oSpriteLibrary.addSprite("launch_dices_"+j,"./sprites/launch_dice_anim/launch_dices_"+j+".png");
        }

        
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();

        s_oSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;

        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);

        _oPreloader.refreshLoader(iPerc);
        
        if(_iCurResource === RESOURCE_TO_LOAD){
            _oPreloader.unload();
            
            this.gotoMenu();
        }
    };
    
    this._onAllImagesLoaded = function(){
        
    };
    
    this.onAllPreloaderImagesLoaded = function(){
        this._loadImages();
    };
    
    this.onImageLoadError = function(szText){
        
    };
	
    this.preloaderReady = function(){
        this._loadImages();
		
	if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            this._initSounds();
        }
        
        _bUpdate = true;
    };
    
    this.gotoMenu = function(){
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };
    
    this.gotoGame = function(){
        _oGame = new CGame(_oData);   
							
        _iState = STATE_GAME;
    };
    
    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };
    
    this.stopUpdate = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");
    };

    this.startUpdate = function(){
        
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");
    };
    
    this._update = function(event){
        if(_bUpdate === false){
                return;
        }
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;
        
        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }
                
        if(_iState === STATE_GAME){
            _oGame.update();
        }
        
        s_oStage.update(event);

    };
    
    s_oMain = this;
    _oData = oData;

    this.initContainer();
}

var s_bMobile;
var s_bAudioActive = true;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_oDrawLayer;
var s_oStage;
var s_oMain = null;
var s_oSpriteLibrary;