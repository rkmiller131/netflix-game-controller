type NetflixControllerError<T = string> = {
    code: T;
    message: string;
};
type SendErrorCode = 'NO_ERROR' | 'UNKNOWN_CLIENT_ID' | 'NOT_CONNECTED' | 'SEND_ERROR' | 'TIMEOUT';

type AirDpadCallback = (error: NetflixControllerError | undefined) => void;
type AirDpadOptions = {
    constraint?: 'horizontal' | 'vertical';
    deltaAngleDeg?: number;
};
type AirDpad = {
    start(options: AirDpadOptions, callback: AirDpadCallback): void;
    stop(callback: AirDpadCallback): void;
};
declare const airDpad: AirDpad;

type AirMouseCallback = (error: NetflixControllerError | undefined) => void;
declare const enum AirMouseButton {
    BTN_LEFT = "BTN_LEFT",
    BTN_RIGHT = "BTN_RIGHT"
}
declare const enum AirMouseFilter {
    NONE = "NONE",
    PRECISE = "PRECISE"
}
type AirMouse = {
    start(options: {
        userEducation: boolean;
        filter?: AirMouseFilter;
    }, callback: AirMouseCallback): void;
    stop(callback: AirMouseCallback): void;
    setButton(code: AirMouseButton, pressed: boolean, eventTimestamp: number, callback: AirMouseCallback): void;
};
declare const airMouse: AirMouse;

type CreateMemoryAudioSourceOptions = {
    url: string;
    loop?: boolean;
};
type CreateStreamingAudioSourceOptions = {
    url: string;
    prepared?: boolean;
};
type SourceUpdateHandlerHandler = (event: {
    source: AudioSource;
}) => void;
type UpdateAudioSourceOptions = {
    sourceId: string;
    currentTime?: number;
    playing?: boolean;
    muted?: boolean;
    volume?: number;
};
type CloseAudioSourceOptions = {
    sourceId: string;
};
declare enum AudioSourcePlaybackState {
    PAUSED = "paused",
    BUFFERING = "buffering",
    PLAYING = "playing",
    ENDED = "ended",
    ERROR = "error"
}
type AudioSourceState = {
    state: AudioSourcePlaybackState;
    currentTime: number;
    bufferProgress: number;
    duration?: number;
    isMuted: boolean;
    volume: number;
    error?: string;
};
type AudioSourceUpdateEvent = AudioSourceState & {
    sourceId: string;
};
type AudioSettings = {
    isDisabled: boolean;
    isDeviceVolumeLow: boolean;
};
type AudioSettingsUpdateHandler = (event: AudioSettings) => void;
type Audio = {
    createMemorySource(options: CreateMemoryAudioSourceOptions, callback: (error: NetflixControllerError | undefined, data: {
        source?: AudioSource;
    }) => void): void;
    createStreamingSource(options: CreateStreamingAudioSourceOptions, callback: (error: NetflixControllerError | undefined, data: {
        source?: AudioSource;
    }) => void): void;
    getSettings(callback: (error: NetflixControllerError | undefined, settings: AudioSettings) => void): void;
    addSettingsChangeHandler(handler: AudioSettingsUpdateHandler): void;
    removeSettingsChangeHandler(handler: AudioSettingsUpdateHandler): void;
};
declare const audio: Audio;
type AudioSource = InstanceType<typeof AudioSourceInternal>;
declare class AudioSourceInternal {
    readonly id: string;
    constructor(id: string);
    toJSON(): {
        id: string;
        state?: AudioSourcePlaybackState | undefined;
        currentTime?: number | undefined;
        bufferProgress?: number | undefined;
        duration?: number | undefined;
        isMuted?: boolean | undefined;
        volume?: number | undefined;
        error?: string | undefined;
    };
    addUpdateHandler(handler: SourceUpdateHandlerHandler): void;
    removeUpdateHandler(handler: SourceUpdateHandlerHandler): void;
    get bufferProgress(): number;
    play(callback: (error: NetflixControllerError | undefined) => void): void;
    play(options: {
        from: number;
    }, callback: (error: NetflixControllerError | undefined) => void): void;
    pause(callback: (error: NetflixControllerError | undefined) => void): void;
    get state(): "error" | AudioSourcePlaybackState;
    seek(currentTime: number, callback: (error: NetflixControllerError | undefined) => void): void;
    get currentTime(): number;
    get duration(): number;
    mute(muted: boolean, callback: (error: NetflixControllerError | undefined) => void): void;
    get isMuted(): boolean;
    setVolume(volume: number, callback: (error: NetflixControllerError | undefined) => void): void;
    get volume(): number;
    get error(): string | undefined;
    close(callback: (error: NetflixControllerError | undefined) => void): void;
}

type TelemetryEvent = {
    eventName: string;
    eventData: Record<string, unknown>;
    version: number;
    environment: string;
};
type Telemetry$1 = {
    logEvent(event: TelemetryEvent): void;
};
declare const telemetry: Telemetry$1;

type MessageAction<D = undefined, U = undefined> = U extends undefined ? {
    action: D;
} : {
    action: D;
    data: U;
};
type Message<T extends string, D = undefined> = D extends undefined ? {
    type: T;
} : {
    type: T;
    data: D;
};
type GenericAction<Type extends string, Action extends string, Data = undefined> = {
    type: Type;
} & MessageAction<Action, Data>;
type IncomingMessage = Message<'init', {
    safeAreaInsetTop: number;
    safeAreaInsetBottom: number;
    safeAreaInsetLeft: number;
    safeAreaInsetRight: number;
    displayZoomScale: number;
}> | Message<'deviceOrientationChange', {
    orientation: ScreenOrientation;
    safeAreaInsetTop: number;
    safeAreaInsetBottom: number;
    safeAreaInsetLeft: number;
    safeAreaInsetRight: number;
}> | Message<'messageAck', {
    messageId: number;
    delivered: boolean;
    errorCode: SendErrorCode;
}> | Message<'message', {
    data: string | ArrayBuffer;
}> | Message<'customMenuButton', {
    pressed: boolean;
}> | Message<'variable', {
    name: string;
    value: string;
}> | Message<'layoutVisible'> | Message<'layoutHidden'> | Message<'textInputEvent', {
    /**
     * The type of user action triggering this event:
     * - change: the user updated the input by interacting with the
     *   keyboard
     * - submit: the user submitted the input using the “done” button
     * - cancel: the user canceled the input by using the “cancel”
     * button
     */
    type: 'change' | 'submit' | 'cancel';
    /**
     * The current content of the input
     */
    value: string;
}> | Message<'storageResponse', {
    requestId: number;
    error: NetflixControllerError | undefined;
    data?: unknown;
}> | Message<'motionEventsChannel', {
    port: MessagePort;
}> | Message<'audio.sourceUpdate', AudioSourceUpdateEvent> | Message<'audio.settingsChange', AudioSettings> | Message<'audio.sourceCreated', {
    requestId: number;
    error?: NetflixControllerError;
    data?: {
        sourceId: string;
    };
}> | Message<'audio.sourceUpdated', {
    requestId: number;
    error?: NetflixControllerError;
}> | Message<'audio.sourceClosed', {
    requestId: number;
    error?: NetflixControllerError;
}>;
type StorageAction<T extends string, D> = GenericAction<'storage', T, D>;
type Storage$1 = StorageAction<'set', {
    requestId: number;
    key: string;
    value: string;
}> | StorageAction<'get', {
    requestId: number;
    key: string;
}> | StorageAction<'getAll', {
    requestId: number;
}> | StorageAction<'remove', {
    requestId: number;
    key: string;
}> | StorageAction<'clear', {
    requestId: number;
}>;
type TelemetryAction<T extends string, D> = GenericAction<'telemetry', T, D>;
type Telemetry = TelemetryAction<'logEvent', {
    event: TelemetryEvent;
}>;
type OutgoingMessage = Message<'ready', {
    assetsStatistics: {
        transferSizeBytes: number;
        encodedBodySizeBytes: number;
        decodedBodySizeBytes: number;
    };
}> | Message<'lockOrientation', {
    orientation: ScreenOrientation;
}> | Message<'activityUserActive'> | Message<'loading', {
    sdkVersion: string;
}> | Message<'setDebugContextField', {
    key: string;
    value: string;
}> | Message<'showView', {
    view: ControllerView;
}> | Message<'console', {
    level: 'info' | 'debug' | 'warn' | 'error';
    location: {
        filename: string;
        line: number;
        col: number;
    };
    args: any[];
}> | Message<'message', {
    messageId: number;
    data: string | ArrayBuffer;
}> | Message<'openTextInput', {
    /**
     * Type of supported text inputs for the keyboard.
     */
    type?: 'text';
    /**
     * If true, the keyboard will NOT be closed when the user presses the button on the keyboard that
     * results in a textInputEvent of type 'submit'.
     */
    doNotCloseOnSubmit?: boolean;
    /**
     * Placeholder text to be shown when no text is entered
     */
    placeholder?: string;
    /**
     * If set, it defines text to be inserted in the text input.
     * This can be used to show a default value.
     */
    value?: string;
    /**
     * The number of characters that can be entered in the text input field box.
     */
    maxCharacterCount?: number;
}> | Message<'closeTextInput'> | Message<'input', Array<{
    code: string;
    value: boolean | number;
}>> | Message<'haptics', {
    action: 'create';
    id: string;
    presetId: string;
    audioUrl?: string;
}> | Message<'haptics', {
    action: 'play';
    id: string;
}> | Message<'haptics', {
    action: 'stop';
}> | Message<'mouse', Array<{
    code: string;
    value: boolean | number;
    isRawValue?: boolean;
}>> | Message<'touchInput', {
    eventTimestamp: number;
}> | Storage$1 | Message<
/**
 * @deprecated use StorageAction<'set'> instead. This is only kept
 * for older versions.
 */
'setStorageItem', {
    requestId: number;
    key: string;
    value: string;
}>
/**
 * @deprecated use StorageAction<'get'> instead. This is only kept
 * for older versions.
 */
 | Message<'getStorageItem', {
    requestId: number;
    key: string;
}>
/**
 * @deprecated use StorageAction<'getAll'> instead. This is only kept
 * for older versions.
 */
 | Message<'getAllStorage', {
    requestId: number;
}>
/**
 * @deprecated use StorageAction<'remove'> instead. This is only kept
 * for older versions.
 */
 | Message<'removeStorageItem', {
    requestId: number;
    key: string;
}>
/**
 * @deprecated use StorageAction<'clear'> instead. This is only kept
 * for older versions.
 */
 | Message<'clearStorage', {
    requestId: number;
}> | Message<'airMouse.start', {
    userEducation: boolean;
    filter?: AirMouseFilter;
}> | Message<'airMouse.stop'> | Message<'airMouse.setMouseButton', {
    code: 'BTN_LEFT' | 'BTN_RIGHT';
    pressed: boolean;
    eventTimestamp: number;
}> | Message<'startAirDpad', AirDpadOptions> | Message<'stopAirDpad'> | Message<'startMotionEvents'> | Message<'stopMotionEvents'> | Message<'audio.createMemorySource', {
    requestId: number;
} & CreateMemoryAudioSourceOptions> | Message<'audio.createStreamingSource', {
    requestId: number;
} & CreateStreamingAudioSourceOptions> | Message<'audio.closeSource', {
    requestId: number;
} & CloseAudioSourceOptions> | Message<'audio.updateSource', {
    requestId: number;
} & UpdateAudioSourceOptions> | Telemetry;
type ExtractMessageData<T extends Message<string>, K extends T['type']> = Extract<T, {
    type: K;
}> extends Message<K, infer D> ? D : undefined;
type IncomingMessageData<T extends IncomingMessage['type']> = ExtractMessageData<IncomingMessage, T>;
type OutgoingMessageData<T extends OutgoingMessage['type']> = ExtractMessageData<OutgoingMessage, T>;
type IncomingMessageHandler<T extends IncomingMessage['type']> = (data: IncomingMessageData<T>) => void;

type LayoutConfiguration = IncomingMessageData<'init'>;
type VisibilityHandler = (isLayoutVisible: boolean) => void;
declare enum ScreenOrientation {
    PORTRAIT = "portrait",
    LANDSCAPE = "landscape",
    ANY = "any"
}
type OrientationChangeEvent = {
    orientation: ScreenOrientation;
    safeAreaInsetTop: number;
    safeAreaInsetBottom: number;
    safeAreaInsetLeft: number;
    safeAreaInsetRight: number;
};
type OrientationChangeHandler = (event: OrientationChangeEvent) => void;
declare enum ControllerView {
    PLAYER_SUPPORT = "PLAYER_SUPPORT"
}
type Layout = {
    /**
     * This function is called as soon at the custom built layout is
     * starting to load. The layouts configuration is returned. This
     * configuration can be used to finalize the initialization of
     * the page content.
     */
    beginInit(callback: (error: NetflixControllerError | undefined, layoutConfig: LayoutConfiguration) => void): void;
    /**
     * Once the custom built layout page is ready, it should call the
     * finishInit function to notify the Netflix Controller that it can complete the
     * init sequence. After this call, the custom built layout page must be ready to
     * be shown to the user.
     */
    finishInit(callback?: (error: NetflixControllerError | undefined) => void): void;
    addVisibilityHandler(handler: VisibilityHandler): void;
    removeVisibilityHandler(handler: VisibilityHandler): void;
    getVisibility(callback: (error: NetflixControllerError | undefined, isLayoutVisible: boolean) => void): void;
    lockOrientation(orientation: ScreenOrientation): void;
    addOrientationChangeHandler(handler: OrientationChangeHandler): void;
    removeOrientationChangeHandler(handler: OrientationChangeHandler): void;
    setDebugContextField: (options: {
        key: string;
        value: string;
    }) => void;
    showView: (options: {
        view: ControllerView;
    }) => void;
};
declare const layout: Layout;

type MenuButtonState = IncomingMessageData<'customMenuButton'>;
type MenuMessageHandler = IncomingMessageHandler<'customMenuButton'>;
type Menu = {
    addMenuHandler(handler: MenuMessageHandler): void;
    removeMenuHandler(handler: MenuMessageHandler): void;
};
declare const menu: Menu;

type ReceiveHandler = (data: IncomingMessageData<'message'>['data']) => void;
type GameMessageCallback = (error: NetflixControllerError<SendErrorCode> | undefined) => void;
type GameMessage = {
    send(data: string | ArrayBuffer, callback: GameMessageCallback): void;
    addReceiveHandler(handler: ReceiveHandler): void;
    removeReceiveHandler(handler: ReceiveHandler): void;
};
declare const gameMessage: GameMessage;

type GameVariableChangeHandler = (name: string, value: string) => void;
type GameVariable = {
    addChangeHandler(handler: GameVariableChangeHandler): void;
    removeChangeHandler(handler: GameVariableChangeHandler): void;
    get(name: string, callback: (error: NetflixControllerError | undefined, value: string | undefined) => void): void;
};
declare const gameVariable: GameVariable;

declare const enum GamepadButton {
    BTN_A = "BTN_A",
    BTN_B = "BTN_B",
    BTN_X = "BTN_X",
    BTN_Y = "BTN_Y",
    BTN_Z = "BTN_Z",
    BTN_TL = "BTN_TL",
    BTN_TR = "BTN_TR",
    BTN_TL2 = "BTN_TL2",
    BTN_TR2 = "BTN_TR2",
    BTN_SELECT = "BTN_SELECT",
    BTN_START = "BTN_START",
    BTN_MODE = "BTN_MODE",
    BTN_THUMBL = "BTN_THUMBL",
    BTN_THUMBR = "BTN_THUMBR",
    BTN_DPAD_LEFT = "BTN_DPAD_LEFT",
    BTN_DPAD_RIGHT = "BTN_DPAD_RIGHT",
    BTN_DPAD_UP = "BTN_DPAD_UP",
    BTN_DPAD_DOWN = "BTN_DPAD_DOWN"
}
declare const enum MouseButton {
    BTN_LEFT = "BTN_LEFT",
    BTN_RIGHT = "BTN_RIGHT"
}
declare const enum GamepadAxis {
    X = "ABS_X",
    Y = "ABS_Y",
    RIGHT_X = "ABS_RX",
    RIGHT_Y = "ABS_RY"
}
type MousePosition = {
    x: number;
    y: number;
};
type MouseMovement = {
    deltaX: number;
    deltaY: number;
};
type Input = {
    setGamepadButton(button: GamepadButton, state: boolean): void;
    setGamepadAxis(axis: GamepadAxis, value: number): void;
    setMouseButton(button: MouseButton, state: boolean): void;
    setMousePosition(position: MousePosition): void;
    setMouseMovement(movement: MouseMovement): void;
    setMousePositionAndMovement(position: MousePosition, movement: MouseMovement): void;
};
declare const input: Input;

declare enum HapticPreset {
    TAP = "TAP",
    HOVER = "HOVER",
    TICK = "TICK",
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    LIGHT = "LIGHT",
    MEDIUM = "MEDIUM",
    HEAVY = "HEAVY",
    SHARP = "SHARP",
    SOFT = "SOFT",
    DOUBLE_TAP_SHARP = "DOUBLE_TAP_SHARP",
    DOUBLE_TAP_SOFT = "DOUBLE_TAP_SOFT",
    TRIPLE_TAP_SHARP = "TRIPLE_TAP_SHARP",
    TRIPLE_TAP_SOFT = "TRIPLE_TAP_SOFT",
    BUZZ = "BUZZ",
    SHORT_BUZZ = "SHORT_BUZZ"
}
type CreateHapticOptions = {
    id: string;
    presetId: HapticPreset;
    audioUrl?: string;
};
type PlayHapticOptions = {
    id: string;
};
type Haptics = {
    create(options: CreateHapticOptions): void;
    play(options: PlayHapticOptions): void;
    stop(): void;
};
declare const haptics: Haptics;

type StorageCallback = (error: NetflixControllerError | undefined) => void;
type StorageGetCallback = (error: NetflixControllerError | undefined, data?: unknown) => void;
type Storage = {
    set: (options: {
        key: string;
        value: string;
    }, callback: StorageCallback) => void;
    get: (options: {
        key: string;
    }, callback: StorageGetCallback) => void;
    getAll: (callback: StorageGetCallback) => void;
    remove: (options: {
        key: string;
    }, callback: StorageCallback) => void;
    clear: (callback: StorageCallback) => void;
};
declare const storage: Storage;

type OpenTextInputOptions = OutgoingMessageData<'openTextInput'>;
type TextInputEvent = IncomingMessageData<'textInputEvent'>;
type TextInputChangeHandler = IncomingMessageHandler<'textInputEvent'>;
type TextInput = {
    /**
     * Opens the text input UI. On each user action, a TextInputEvent
     * will be sent to the app. You can use closeTextInput to close it.
     */
    open(options: OpenTextInputOptions, callback: (error: NetflixControllerError | undefined) => void): void;
    /**
     * closeTextInput is used to close the text input UI opened with
     * openTextInput. It is usually called as a result of a TextInputEvent
     * with type 'submit' or 'cancel'. The text input UI won't close by
     * itself. It is the responsibility of the app to close it using this
     * function.
     */
    close(callback: (error: NetflixControllerError | undefined) => void): void;
    addChangeHandler(handler: TextInputChangeHandler): void;
    removeChangeHandler(handler: TextInputChangeHandler): void;
};
declare const textInput: TextInput;

type Vector3 = {
    x: number;
    y: number;
    z: number;
};
type Quaternion = {
    x: number;
    y: number;
    z: number;
    w: number;
};
type MotionEvent = {
    timestamp: number;
    attitude: Quaternion;
    gravity: Vector3;
    rotationRate: Vector3;
    rotationRateUnbiased: Vector3;
    userAcceleration: Vector3;
};
declare const motion: {
    addHandler: (handler: (event: MotionEvent) => void) => void;
    removeHandler: (handler: (event: MotionEvent) => void) => void;
};

declare const VERSION: string;

export { type AirDpadOptions, AirMouseButton, AirMouseFilter, type AudioSettings, type AudioSettingsUpdateHandler, type AudioSource, AudioSourcePlaybackState, type AudioSourceState, type AudioSourceUpdateEvent, type CloseAudioSourceOptions, ControllerView, type CreateMemoryAudioSourceOptions, type CreateStreamingAudioSourceOptions, GamepadAxis, GamepadButton, HapticPreset, type IncomingMessage, type LayoutConfiguration, type MenuButtonState, type MenuMessageHandler, type MotionEvent, MouseButton, type MouseMovement, type MousePosition, type NetflixControllerError, type OpenTextInputOptions, type OrientationChangeEvent, type OutgoingMessage, type Quaternion, type ReceiveHandler, ScreenOrientation, type SendErrorCode, type SourceUpdateHandlerHandler, type TelemetryEvent, type TextInputEvent, type UpdateAudioSourceOptions, VERSION, type Vector3, airDpad, airMouse, audio, gameMessage, gameVariable, haptics, input, layout, menu, motion, storage, telemetry, textInput };
