FullScreenMario.prototype.settings.input = {
    "InputWritrArgs": {
        "aliases": {
            // Keyboard aliases
            "left":   [65, 37],     // a,     left
            "right":  [68, 39],     // d,     right
            "up":     [87, 38, 32], // w,     up,    space
            "down":   [83, 40],     // s,     down
            "sprint": [16, 17],     // shift, ctrl
            "pause":  [80],         // p (pause)
            // Mute and Luigi disabled because there's a GUI for them now
            // "mute":   [77],         // m (mute)
            // "l":      [76],         // l (luigi)
            // Mouse aliases
            "rightclick": [3],
        },
        "triggers": {
            "onkeydown": {
                "left": FullScreenMario.prototype.keyDownLeft,
                "right": FullScreenMario.prototype.keyDownRight,
                "up": FullScreenMario.prototype.keyDownUp,
                "down": FullScreenMario.prototype.keyDownDown,
                "sprint": FullScreenMario.prototype.keyDownSprint,
                "pause": FullScreenMario.prototype.keyDownPause,
                "mute": FullScreenMario.prototype.keyDownMute,
            },
            "onkeyup": {
                "left": FullScreenMario.prototype.keyUpLeft,
                "right": FullScreenMario.prototype.keyUpRight,
                "up": FullScreenMario.prototype.keyUpUp,
                "down": FullScreenMario.prototype.keyUpDown,
                "sprint": FullScreenMario.prototype.keyUpSprint,
                "pause": FullScreenMario.prototype.keyUpPause
            },
            "onmousedown": {
                "rightclick": FullScreenMario.prototype.mouseDownRight
            },
            "oncontextmenu": {},
            "ondevicemotion": {
                "devicemotion": FullScreenMario.prototype.deviceMotion
            }
        }
    }
};