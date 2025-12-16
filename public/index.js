// Import the SDK (adjust relative path from public folder)
import { layout, gameMessage } from './sdk/index.js';
import {
    renderOneButtonZoneLayout,
    renderThreeButtonZoneLayout,
    renderFourButtonZoneLayout,
    renderFourButtonDiamondLayout
} from './utils/render-layouts.utils.js';
import { parseGameMessage } from './utils/game-bridge.utils.js';
import { Joystick } from './components/Joystick/Joystick.js';

layout.lockOrientation('landscape');

layout.beginInit((error, config) => {
    if (error) {
        console.error('Layout init error:', error);
        return;
    }

    // Just render beginner controller scheme by default and user can switch
    // with another menu button or setting or something.
    renderOneButtonZoneLayout();
    const joystick = new Joystick();

    // An event handler for receiving messages from the game -> this controller
    gameMessage.addReceiveHandler((data) => {
        const parsedData = parseGameMessage(data);
        if (parsedData.layoutType === 'oneButton') {
            renderOneButtonLayout(parsedData);
        }
        if (parsedData.layoutType === 'threeButton') {
            renderThreeButtonLayout(parsedData);
        }
        if (parsedData.layoutType === 'fourButton') {
            renderFourButtonLayout(parsedData);
        }
    });

    layout.finishInit(() => {
        console.log('Layout initialization finished - Controller App ready to go!');
    });
});

// FOR TESTING ON A WEB BROWSER WHERE THERE IS NO SDK ACCESS:
// renderOneButtonZoneLayout();
renderThreeButtonZoneLayout();
// renderFourButtonZoneLayout();
// renderFourButtonDiamondLayout();
const joystick = new Joystick();