// Import the SDK (adjust relative path from public folder)
import { layout, gameMessage } from './sdk/index.js';
// import {
//     renderOneButtonZoneLayout,
//     renderThreeButtonZoneLayout,
//     renderFourButtonZoneLayout,
//     renderFourButtonDiamondLayout
// } from './utils/render-layouts.utils.js';
import { parseGameMessage } from './utils/game-bridge.utils.js';
import { Controller } from './components/Controller/Controller.js';

layout.lockOrientation('landscape');

layout.beginInit((error, config) => {
    if (error) {
        console.error('Layout init error:', error);
        return;
    }

    // Starting ngc controller; User can switch to other layouts with game messages.
    const controller = new Controller();

    // An event handler for receiving messages from the game -> this controller
    gameMessage.addReceiveHandler((data) => {
        const parsedData = parseGameMessage(data);
        controller.switchLayout(parsedData.layoutType);
    });

    layout.finishInit(() => {
        console.log('Layout initialization finished - Controller App ready to go!');
    });
});

// FOR TESTING ON A WEB BROWSER WHERE THERE IS NO SDK ACCESS:
// renderOneButtonZoneLayout();
// renderThreeButtonZoneLayout();
// renderFourButtonZoneLayout();
// renderFourButtonDiamondLayout();
// const joystick = new Joystick();
// const tacticsButton = new TacticsButton();
const controller = new Controller();
// controller.switchLayout('oneButtonZone');
// controller.switchLayout('threeButtonZone');
// controller.switchLayout('fourButtonZone');