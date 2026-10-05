import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import Fragment from "sap/ui/core/Fragment";
import Dialog from "sap/m/Dialog";
import { Button$PressEvent } from "sap/m/Button";
import { createBingoBoard, checkBingo, ITile } from "../model/bingo";

/**
 * @namespace de.itsfullofstars.buzzwordbingo.de.itsfullofstars.buzzwordbingo.controller
 */
export default class View1 extends Controller {

    private _aBuzzwordPool: string[] = [];
    private _pBingoDialog?: Promise<Dialog>;

    public onInit(): void {
        this.getView()?.setModel(new JSONModel({ tiles: [] }), "bingo");

        void this._loadBuzzwordPool().then((aBuzzwordPool) => {
            this._aBuzzwordPool = aBuzzwordPool;
            this._startNewGame();
        });
    }

    public onTilePress(oEvent: Button$PressEvent): void {
        const oButton = oEvent.getSource();
        const oContext = oButton.getBindingContext("bingo");
        if (!oContext) {
            return;
        }

        if (oContext.getProperty("free") as boolean) {
            return;
        }

        const sMarkedPath = `${oContext.getPath()}/marked`;
        const oModel = oContext.getModel() as JSONModel;
        oModel.setProperty(sMarkedPath, !(oContext.getProperty("marked") as boolean));

        const aTiles = oModel.getProperty("/tiles") as ITile[];
        if (checkBingo(aTiles)) {
            void this._showBingoDialog();
        }
    }

    public onNewGame(): void {
        this._startNewGame();
        void this._pBingoDialog?.then((oDialog) => oDialog.close());
    }

    public onCloseBingo(): void {
        void this._pBingoDialog?.then((oDialog) => oDialog.close());
    }

    private async _loadBuzzwordPool(): Promise<string[]> {
        const sUrl = sap.ui.require.toUrl(
            "de/itsfullofstars/buzzwordbingo/de/itsfullofstars/buzzwordbingo/model/buzzwords.json"
        );
        const oResponse = await fetch(sUrl);
        const oData = await oResponse.json() as { buzzwords: string[] };
        return oData.buzzwords;
    }

    private _startNewGame(): void {
        const aTiles = createBingoBoard(this._aBuzzwordPool);
        const oModel = this.getView()?.getModel("bingo") as JSONModel;
        oModel.setProperty("/tiles", aTiles);
    }

    private async _showBingoDialog(): Promise<void> {
        const oDialog = await this._getBingoDialog();
        oDialog.open();
    }

    private _getBingoDialog(): Promise<Dialog> {
        if (!this._pBingoDialog) {
            this._pBingoDialog = Fragment.load({
                id: this.getView()?.getId(),
                name: "de.itsfullofstars.buzzwordbingo.de.itsfullofstars.buzzwordbingo.view.BingoDialog",
                controller: this
            }).then((oControl) => {
                const oDialog = (Array.isArray(oControl) ? oControl[0] : oControl) as Dialog;
                this.getView()?.addDependent(oDialog);
                return oDialog;
            });
        }
        return this._pBingoDialog;
    }
}
