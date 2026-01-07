// Import the SDK (adjust relative path from public folder)
import { layout, gameMessage } from './sdk/index.js';
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
        if (!parsedData) return;
        /* Current shape of game messages (I miss TypeScript...):
        {
          "updateConfig": { "configurations": [ { "left": "joystick", "right": "oneButtonZone" ... }, ... ] },
          "jumpToLayoutIndex": 2
        }
        */
       if (parsedData.updateConfig) {
        controller.updateConfig(parsedData.updateConfig);
       }
       if (parsedData.jumpToLayoutIndex) {
        controller.jumpToLayout(parsedData.jumpToLayoutIndex);
       }
    });

    layout.finishInit(() => {
        console.log('Layout initialization finished - Controller App ready to go!');
    });
});

// FOR TESTING ON A WEB BROWSER WHERE THERE IS NO SDK ACCESS:
// const controller = new Controller();