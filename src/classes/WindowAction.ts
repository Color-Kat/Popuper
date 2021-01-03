type AnimationAction = 'fade' | 'swipeRight' | 'swipeTop';
type Func = (param?: Element)=>void;

/** Base class implementing window effects. */
export abstract class WindowAction
{
    /** Stores opening action */
    protected openAction: any = 'open_fade';

    /** Stores closing  action */
    protected closeAction: any = 'close_fade';

    /** Stores the action of clicking a button */
    protected buttons: {[key: string]: any} = {};

    /** are there any changes in layout */
    protected changes: boolean = true;

    /** Stores the current open window */
    static _currentElement: Element | null = null;
    get currentElement() { return WindowAction._currentElement; }
    set currentElement(element) { WindowAction._currentElement = element; }

    /** Automatic error output to the console */
    public errorReporting: boolean = true;

    /** Stores the last error */
    private __lastError: string = '';

    get lastError(): string {
        if (this._lastError != '') {
            return this.__lastError;
        }
        return 'no errors';
    }

    /** if error reporting is enabled, then displays errors to the console */
    set _lastError(error: string) {
        if (this.errorReporting) {
            console.trace(error);
        }
        this.__lastError = error;
    } 

    /**
     * sets the effect or function when opened
     * @param action function that will work when opened or the name of the built-in effect
     */

    public onOpen(action: Func| AnimationAction): void {
        // string passed
        if (typeof action === 'string') {
            // on open performs animation
            this.openAction = 'open_' + action;
        }
        //function passed
        else if (typeof action === 'function') {
            // on open performs the user function
            this.openAction = action;
        }
    }

    /**
     * sets the effect or function when closed
     * @param action function that will work when opened or the name of the built-in effect
     */

    public onClose(action: Func | AnimationAction): void {
        // perform custom function
        if (typeof action === 'function') {
            this.closeAction = action;
        }
        // perform standart animation
        if (typeof action === 'string') {
            this.closeAction = 'close_' + action;
        }
    }

    /**
     * sets the effect or function when click on button(-s)
     * @param action function that will work when click or the name of the built-in effect
     */

    public onClick(btnId: string | number, f: Func): void {
        // write action
        if (typeof f === 'function') {
            this.buttons[btnId] = f;
        }
        this.changes = true;
    }

    /** fade animation on open */
    protected open_fade(): void {
        (this.currentElement as HTMLElement).style.opacity = '1';
    }
    /** swipe right animation on open */
    protected open_swipeRight(): void {
        (this.currentElement as HTMLElement).style.right = '0px';
    }
    /** swipe top animation on open */
    protected open_swipeTop(): void {
        (this.currentElement as HTMLElement).style.top = '0px';
    }

    /** fade animation on close */
    protected close_fade(): void {
        (this.currentElement as HTMLElement).style.opacity = '0';
    }
    /** swipe right animation on close */
    protected close_swipeRight(): void {
        (this.currentElement as HTMLElement).style.right = `-${window.outerWidth}px`;
    }
    /** swipe top animation on close */
    protected close_swipeTop(): void {
        (this.currentElement as HTMLElement).style.top = `-${window.outerHeight}px`;
    }

    close() {}
}