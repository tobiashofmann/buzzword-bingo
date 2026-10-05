sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/ui/core/Fragment", "../model/bingo"], function (Controller, JSONModel, Fragment, ___model_bingo) {
  "use strict";

  const createBingoBoard = ___model_bingo["createBingoBoard"];
  const checkBingo = ___model_bingo["checkBingo"];
  /**
   * @namespace de.itsfullofstars.buzzwordbingo.de.itsfullofstars.buzzwordbingo.controller
   */
  const View1 = Controller.extend("de.itsfullofstars.buzzwordbingo.de.itsfullofstars.buzzwordbingo.controller.View1", {
    constructor: function constructor() {
      Controller.prototype.constructor.apply(this, arguments);
      this._aBuzzwordPool = [];
    },
    onInit: function _onInit() {
      this.getView()?.setModel(new JSONModel({
        tiles: []
      }), "bingo");
      void this._loadBuzzwordPool().then(aBuzzwordPool => {
        this._aBuzzwordPool = aBuzzwordPool;
        this._startNewGame();
      });
    },
    onTilePress: function _onTilePress(oEvent) {
      const oButton = oEvent.getSource();
      const oContext = oButton.getBindingContext("bingo");
      if (!oContext) {
        return;
      }
      if (oContext.getProperty("free")) {
        return;
      }
      const sMarkedPath = `${oContext.getPath()}/marked`;
      const oModel = oContext.getModel();
      oModel.setProperty(sMarkedPath, !oContext.getProperty("marked"));
      const aTiles = oModel.getProperty("/tiles");
      if (checkBingo(aTiles)) {
        void this._showBingoDialog();
      }
    },
    onNewGame: function _onNewGame() {
      this._startNewGame();
      void this._pBingoDialog?.then(oDialog => oDialog.close());
    },
    onCloseBingo: function _onCloseBingo() {
      void this._pBingoDialog?.then(oDialog => oDialog.close());
    },
    _loadBuzzwordPool: async function _loadBuzzwordPool() {
      const sUrl = sap.ui.require.toUrl("de/itsfullofstars/buzzwordbingo/de/itsfullofstars/buzzwordbingo/model/buzzwords.json");
      const oResponse = await fetch(sUrl);
      const oData = await oResponse.json();
      return oData.buzzwords;
    },
    _startNewGame: function _startNewGame() {
      const aTiles = createBingoBoard(this._aBuzzwordPool);
      const oModel = this.getView()?.getModel("bingo");
      oModel.setProperty("/tiles", aTiles);
    },
    _showBingoDialog: async function _showBingoDialog() {
      const oDialog = await this._getBingoDialog();
      oDialog.open();
    },
    _getBingoDialog: function _getBingoDialog() {
      if (!this._pBingoDialog) {
        this._pBingoDialog = Fragment.load({
          id: this.getView()?.getId(),
          name: "de.itsfullofstars.buzzwordbingo.de.itsfullofstars.buzzwordbingo.view.BingoDialog",
          controller: this
        }).then(oControl => {
          const oDialog = Array.isArray(oControl) ? oControl[0] : oControl;
          this.getView()?.addDependent(oDialog);
          return oDialog;
        });
      }
      return this._pBingoDialog;
    }
  });
  return View1;
});
//# sourceMappingURL=View1-dbg.controller.js.map
