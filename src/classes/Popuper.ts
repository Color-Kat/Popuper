/**
 * @fileOverview creation of pop-up objects of various types.
 * @author ColorKat
 * @version 1.0.0
 */

import {ErrorPopup} from './errorPopup';
import {InfoPopup} from './InfoPopup';
import {SuccssesPopup} from './SuccssesPopup';
import {PopupWindow} from './PopupWindow';

export class Popuper
{
    /**
     * creates a popup object
     * 
     * @param standartMessage standart message
     * @param standartButton standart button text
     */
    private static instance: Popuper;

    constructor(public standartMessage: string, public standartButton? : string){
        if (Popuper.instance !== undefined) return Popuper.instance;
        Popuper.instance = this;

        this.standartMessage = standartMessage;
        this.standartButton = standartButton;
    }

    /**
     * creates a popup object
     * 
     * @param type type of popup
     * @returns popup window object 
     */

    create(type: 'error' | 'info' | 'succsses'): PopupWindow{
        let typeWindow: any = null;
        let popup: {[key: string]: any} = {};

        switch (type) {
            case 'error':
                return new ErrorPopup(this.standartMessage, this.standartButton);

            case 'info':
                return new InfoPopup(this.standartMessage, this.standartButton);

            case 'succsses':
                return new SuccssesPopup(this.standartMessage, this.standartButton);
        }
    }
}