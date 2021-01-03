# Popuper

Create your own pop-up window with your layout and your styles!

### Getting Started

Using npm:

```
npm install --save-dev popuper
```

## Installing

1. Сreate a window manager for creating windows
```
let popupManager = new Popuper('myMessage', 'ok);
```
2. Сreate the window itself using the create()
```
let popuperError = popupManager.create('error');
let popuperSuc = popupManager.create('succsses');
let popuperInfo = popupManager.create('info');
```
3. Сonfigure the parameters for opening, closing, and clicking on buttons
You can set both standard window opening and closing effects, as well as your own
```
        /* open effects */
popuperInfo.onOpen((element)=>{console.log(element);})  // your function on close window
popuperInfo.onOpen('swipeRight')                        // select standart function (swipe right)
popuperInfo.onOpen('fade')                              // select standart function (fade)
popuperInfo.onOpen('swipeTop')                          // select standart function (swipeTop)     
        /* close effects */
popuperInfo.onClose(()=>{console.log('clooose');})      // your function on close window
popuperInfo.onClose('swipeRight')                       // select standart function
popuperInfo.onClose('fade')                             // select standart function
popuperInfo.onClose('swipeTop')                         // select standart function
```
To assign a click action, your layout should have id for buttons (data-button)

onClick(buttonId, your function)
```
        /* action on click */
//action on click button[data-button = "0"]
popuperInfo.onClick(0, (elem)=>{console.log('ok'); popuperInfo.close();})
//button[data-button = "myId"]
popuperInfo.onClick('myId', (elem)=>{console.log('cancel'); elem?.remove();})
```
4. You can do your layout by substituting your variables when outputting
```
// my layout with key for my variables
let myLayout: string = `<div class="{selector} popupSuccsses">
                            <div class="popupMessage">{myCustomVriableMessage}</div>
                            <div class="popupFooter">
                                <button class="popupButton btnClass" data-button="0">{myCustomVriableButton1}</button>
                                <button class="popupButton btnClass" data-button="myId">{myCustomVriableButton2}</button>
                            </div>
                        </div>`
// set layout
popuperInfo.layout = myLayout;
// set variables
popuperInfo.variables = {'selector': 'popup',
                         'myCustomVriableMessage': 'mess',
                         'myCustomVriableButton1': 'cancel',
                         'myCustomVriableButton2': 'oK'}
```
Еhe values ​​in the layout, which are taken in curly brackets, will be replaced by the values ​​from the popup.variables object with the same keys

({myVar} => popuperInfo.variables = {'myVar': value})

5. Шt remains only to bring the window to the page!
There are 5 ways to choose from.
```
popuperInfo.alert('body'); // innerHTML +=
popuperInfo.alert(document.querySelector('#inBlock'), 'replace') // innerHTML =
popuperInfo.alert(document.querySelector('#inBlock'), 'afterbegin') // insertAdjacentHTML
popuperInfo.alert(document.querySelector('#inBlock'), 'beforeend') // insertAdjacentHTML
popuperInfo.alert(document.querySelector('#inBlock'), 'replace') // insertAdjacentHTML
```
