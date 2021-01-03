import {WindowAction} from './WindowAction';
type insertMethod = 'add' | 'replace' | 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend';

export class PopupWindow extends WindowAction{
    /** type of popup */
    public type: string = '';
    /** select window selector */
    public _selector = 'popup';

    set selector (selector: string) {
        this.variables.selector = selector;
        this.changes = true;
    }
    get selector () {
        return this.variables.selector;
    }

    /** layout template 
     * {key} : value
     * @example popup.layout = '<div>{myValue}</div>'
    */
    protected layoutPattern: string = '';

    private _variables: {[key: string]: any} = {};

    /** stores variables to be inserted into the popup
     * @tutorial 
     * markup marked {key}
     * the value with the key key is inserted
     * @example popup.variables = {"myValue" : 'my message!!'}
    */

    set variables(vars: {[key: string]: any}) {
        this._variables = vars;
        this.changes = true;
    }
    get variables() {
        return this._variables;
    }
    
    buttons: {[key: string]: any} = {'0': ()=>{this.close()}};
    
    /** layout container */
    private _layout: string = '';

    /** 
     * set your layout
     */
    set layout(layout: string) {
        this.layoutPattern = layout;
        this._layout = layout
        this.changes = true;
    }
    get layout() {
        return this._layout;
    }

    set message(message: string) {
        this.variables.message = message;
        this.changes = true;
    }
    set button(button: string) {
        this.variables.button = button;
        this.changes = true;
    }

    /** inserts a window in html in the selected method
     * @param out element to insert
     * @param insertMethod insertion method
     */

    insert (out: Element, insertMethod: insertMethod): void{
        switch (insertMethod) {
            case 'add':
                out.innerHTML += this.layout;
                break;
            case 'replace':
                out.innerHTML = this.layout;
                break;
            case 'beforebegin':
            case 'afterbegin':
            case 'beforeend':
            case 'afterend':
                out.insertAdjacentHTML(insertMethod, this.layout);
                break;
        }
    }

    /**
     * displays a popup on a page
     * @param outElement element to insert
     * @param insertMethod insertion method
     */

    alert (outElement: string | Element | null, insertMethod: insertMethod = 'add'): Boolean{
        // close window if open
        if (this.currentElement !== null) {
            this.currentElement.remove();
        }

        // if there is a change in layout, update the layout template
        if (this.changes) {
            this.buildLayout();
            this.changes = false;
        }
        
        if (typeof outElement === 'string') {
            // get out element by string
            const out: Element | null = document.querySelector(outElement);
            if (out) {
                // insert popup in html
                this.insert(out, insertMethod);

                // get corrent element
                this.currentElement = document.querySelector(`${outElement} .${this.selector}`);
            }
            // print error
            else {
                this._lastError = `such an element does not exist (${outElement})`;
                return false;
            }
        }
        
        else if (outElement instanceof Element) {
            // insert popup in html
            this.insert(outElement, insertMethod);
            
            // get corrent element
            this.currentElement = outElement.querySelector('.'+this.selector);
        } 

        // no element
        else {
            this._lastError = `such an element does not exist`;
            return false;
        }

        // protection against current element == null
        if (this.currentElement === null) return false;

        // execute function when open
        if (typeof this.openAction === 'function') {
            // perform custom function (param is current element)
            this.openAction(this.currentElement);
        }
        // perform standart animation
        if (typeof this.openAction === 'string' ) {

            // start styles for fade effect
            if (this.openAction == 'open_fade') {
                (this.currentElement as HTMLElement).style.opacity = '0';
            }
            // start style for swipe right effect
            else if (this.openAction == 'open_swipeRight') {
                (this.currentElement as HTMLElement).style.right = `${window.outerWidth}px`;
            }
            // start style for swipe top effect
            else if (this.openAction == 'open_swipeTop') {
                (this.currentElement as HTMLElement).style.top = `-${window.outerHeight}px`;
            }

            // animation speed
            (this.currentElement as HTMLElement).style.transition = 'all ease-in-out .4s';

            // delayed animation
            setTimeout(() => {
                (this as any)[this.openAction]();
            });
        }

        // hang the event on the buttons
        if (this.currentElement !== null) {
            for(let button in this.buttons) {
                // get button by id from data-button
                let elem = this.currentElement.querySelector(`button[data-button="${button}"]`);
                if (elem !== null) {
                    // on click perform a user-defined function
                    elem.addEventListener('click', ()=> {
                        // custom function for this button
                        this.buttons[button](this.currentElement);
                    });
                }
                // button does not exist
                else{
                    // print error
                    this._lastError = 'the button does not have an identifier (data-button = "'+button+'") or the button does not exist';
                }
            }
        }

        return true;
    }

    /**
     * closes an open window
    */

    close(): boolean{
        // if there is an open window 
        if (this.currentElement !== null) {
            // execute function when open
            if (typeof this.openAction === 'function') {
                // perform custom function (param is current element)
                this.closeAction(this.currentElement);

                // close current window
                this.currentElement.remove();
                this.currentElement = null;

                return true;
            }
            // perform standart animation
            if (typeof this.closeAction === 'string' ) {
                // start styles for fade effect
                if (this.closeAction == 'close_fade') {
                    (this.currentElement as HTMLElement).style.opacity = '1';
                }
                // start style for swipe right effect
                else if (this.closeAction == 'close_swipeRight') {
                    (this.currentElement as HTMLElement).style.right = `0px`;
                }
                // start style for swipe top effect
                else if (this.closeAction == 'close_swipeTop') {
                    (this.currentElement as HTMLElement).style.top = `-0px`;
                }

                // animation speed
                (this.currentElement as HTMLElement).style.transition = 'all ease-in-out .4s';
            }

            // waiting for the starting styles to be applied
            setTimeout(() => {
                // perform animation
                (this as any)[this.closeAction]();

                // close the current window when the animation ends
                setTimeout(() => {
                    (this.currentElement as Element).remove();
                    this.currentElement = null;
                }, 400);
            });
            
            return true;
        }

        // if there is not an open window 
        this._lastError = 'no popups open';
        return false
    }

    /**
     * places ready layout in this.layoyt
     */
    private buildLayout(): void {
        // replace {key} in the layout with the values ​​from variables
        this.layout = this.layoutPattern;
        for (let variable in this._variables){
            this.layout = this.layout.replace(`{${variable}}`, this._variables[variable]);
        }
        // standert selector
        if (this.variables.selector === undefined) this.variables.selector = 'popup';
    }
}