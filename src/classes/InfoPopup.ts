import { PopupWindow } from "./PopupWindow";

export class InfoPopup extends PopupWindow
{
    type = 'info';
    constructor(standartMessage: string, standertButton: string | undefined){
        super();
        this.variables = {'selector': 'popup', 'message': standartMessage, 'button': standertButton};

        this.layoutPattern = `<div class="{selector} popupInfo">
                                <div class="popupMessage">{message}</div>
                                <div class="popupFooter">
                                  <button class="popupButton" data-button="0">{button}</button>
                                </div>
                              </div>`;
        return this;
    }
}