function CAreYouSurePanel(oParentContainer) {
    var _oMsg;
    var _oButYes;
    var _oButNo;
    var _oBg;
    var _oContainer;
    var _oParentContainer;

    this._init = function () {
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oParentContainer.addChild(_oContainer);

        var oMsgBox = s_oSpriteLibrary.getSprite('msg_box');
        _oBg = createBitmap(oMsgBox);
        _oBg.x = CANVAS_WIDTH/2;
        _oBg.y = CANVAS_HEIGHT/2;
        _oBg.regX = oMsgBox.width * 0.5;
        _oBg.regY = oMsgBox.height * 0.5;
        _oContainer.addChild(_oBg);

        _oBg.on("click", function () {});

        _oMsg = new createjs.Text(TEXT_ARE_SURE, "60px " + FONT1, "#fff");
        _oMsg.x = CANVAS_WIDTH / 2;
        _oMsg.y = CANVAS_HEIGHT * 0.5-40;
        _oMsg.textAlign = "center";
        _oMsg.textBaseline = "middle";
        _oContainer.addChild(_oMsg);

        _oButYes = new CGfxButton(CANVAS_WIDTH / 2 + 186, _oMsg.y + 140, s_oSpriteLibrary.getSprite('but_yes'), _oContainer);
        _oButYes.addEventListener(ON_MOUSE_UP, this._onButYes, this);

        _oButNo = new CGfxButton(CANVAS_WIDTH / 2 - 186, _oMsg.y + 140, s_oSpriteLibrary.getSprite('but_not'), _oContainer);
        _oButNo.addEventListener(ON_MOUSE_UP, this._onButNo, this);
    };


    this.show = function () {
        _oContainer.visible = true;
    };

    this.unload = function () {
        _oButNo.unload();
        _oButYes.unload();
        _oBg.off("click", function () {});
    };

    this._onButYes = function () {
        this.unload();

        playSound("click", 1, 0);
        s_oGame.onConfirmExit();
    };

    this._onButNo = function () {
        playSound("click", 1, 0);
        _oContainer.visible = false;
    };

    _oParentContainer = oParentContainer;

    this._init();
}