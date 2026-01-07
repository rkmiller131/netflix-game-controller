// Import the SDK (adjust relative path from public folder)
import { layout, gameMessage, input, GamepadAxis } from './sdk/index.js';
import {
    updateButtonPosition,
    renderBeginnerSwipeLayout,
    renderAdvancedSwipeLayout,
    renderOneButtonLayout,
    renderTwoButtonLayout
} from './utils/render-layouts.utils.js';
import { parseGameMessage } from './utils/game-bridge.utils.js';
import { Joystick } from './Components/Joystick/Joystick.js';

layout.lockOrientation('landscape');

layout.beginInit((error, config) => {
    if (error) {
        console.error('Layout init error:', error);
        return;
    }

    // Safe areas from config (note they had a name change from docs)
    // Also... netflix does this automatically in their beginInit fn -
    // beginInit calls injectSafeArea() which makes them available in CSS as --safe-area-inset-*
    // const safeAreas = {
    //     top: config.safeAreaInsetTop,
    //     bottom: config.safeAreaInsetBottom,
    //     left: config.safeAreaInsetLeft,
    //     right: config.safeAreaInsetRight,
    // };

    // Just render beginner controller scheme by default and user can switch
    // with another menu button or setting or something.
    renderOneButtonLayout();
    const joystick = new Joystick();

    // An event handler for receiving messages from the game -> this controller
    gameMessage.addReceiveHandler((data) => {
        const parsedData = parseGameMessage(data);
        /*
            If we were using typescript here would be the shape of incoming data:

            type TPosition = 'offense' | 'defense'; // string value that can only be one of the following
            type TLayoutType = 'beginner' | 'advanced' | 'oneButton' | 'twoButton'

            interface data {
            position?: TPosition;
            layoutType?: TLayoutType
            }
        */
       // Don't pass in layoutType if you're just updating position
        if (parsedData.position && !parsedData.layoutType) {
            updateButtonPosition(parsedData);
        }
        if (parsedData.layoutType === 'oneButton') {
            renderOneButtonLayout(parsedData);
        }
        if (parsedData.layoutType === 'twoButton') {
            renderTwoButtonLayout(parsedData);
        }
        if (parsedData.layoutType === 'beginner') {
            renderBeginnerSwipeLayout(parsedData);
        }
        if (parsedData.layoutType === 'advanced') {
            renderAdvancedSwipeLayout(parsedData);
        }
    });

    // Signal the controller app we are ready
    layout.finishInit(() => {
        console.log('Layout initialization finished');
    });
});

// FOR TESTING ON A WEB BROWSER WHERE THERE IS NO SDK ACCESS:
// renderOneButtonLayout();
// updateButtonPosition({ position: 'defense' });
// const joystick = new Joystick();