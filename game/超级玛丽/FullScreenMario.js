/**
 * FullScreenMario
 * 
 * A free HTML5 remake of Nintendo's original Super Mario Bros, expanded for the
 * modern web. It includes the original 32 levels, a random map generator, a 
 * level editor, and over a dozen custom mods.
 * 
 * @example 
 * // Creating a 15 x 14.5 blocks sized FullScreenMario object.
 * var FSM = new FullScreenMario({
 *     "width": 480, 
 *     "height": 464
 * });
 * 
 * @example
 * // Creating a 15 x 14.5 blocks sized FullScreenMario object and logging the 
 * // amount of time each reset function took.
 * var FSM = new FullScreenMario({
 *     "width": 480, 
 *     "height": 464,
 *     "resetTimed": true
 * });
 * console.log(FSM.resetTimes);
 * 
 * @example
 * // Creating a full-screen FullScreenMario object with a few mods.
 * var FSM = new FullScreenMario({
 *    "width": window.innerWidth,
 *    "height": window.innerHeight,
 *    "mods": {
 *         "Luigi": true,
 *         "HorizClouds": true,
 *         "High Speed": true,
 *         "Super Fireballs": true
 *     }
 * });
 * 
 * @example
 * // Binding the FullScreenMario object controls to the body's mouse and key 
 * // events, and starting the game.
 * window.FSM = new FullScreenMario({
 *    "width": window.innerWidth, 
 *    "height": window.innerHeight
 * });
 * 
 * document.body.appendChild(FSM.container);
 * 
 * FSM.proliferate(document.body, {
 *     "onkeydown": FSM.InputWriter.makePipe("onkeydown", "keyCode", true),
 *     "onkeyup": FSM.InputWriter.makePipe("onkeyup", "keyCode", true),
 *     "onmousedown": FSM.InputWriter.makePipe("onmousedown", "which", true)
 * });
 * 
 * FSM.gameStart();
 */
var FullScreenMario = (function(GameStartr) {
    "use strict";
    
    // Use an GameStartr as the class parent, with GameStartr's constructor
    var GameStartrProto = new GameStartr(),
        
        // Used for combining arrays from the prototype to this
        proliferate = GameStartrProto.proliferate,
        proliferateHard = GameStartrProto.proliferateHard;
    
    // Subsequent settings will be stored in FullScreenMario.prototype.settings
    GameStartrProto.settings = {};
    
    /**
     * Constructor for a new FullScreenMario game object.
     * Static game settings are stored in the appropriate settings/*.js object
     * as members of the FullScreenMario.prototype object.
     * Dynamic game settings may be given as members of the "customs" argument.
     * On typical machines, game startup time is approximately 500-700ms.
     * 
     * @constructor
     * @param {Number} width   Width of the game viewport: at least 480.
     * @param {Number} height   Height of the game viewport: at least 464.
     * @param {Boolean} [resetTimes]   Whether the amount of time in of each
     *                               reset function (in millseconds) should be 
     *                               stored as a member .resetTimes (by default,
     *                               false).
     * @param {Object} [style]   Additional CSS styles to be given to the
     *                           game's container <div> element.
     * @return {FullScreenMario}
     */
    function FullScreenMario(customs) {
        // Call the parent GameStartr constructor to set the base settings and
        // verify the prototype requirements
        GameStartr.call(this, {
            "customs": customs,
            "constructor": FullScreenMario,
            "requirements": {
                "settings": {
                    "audio": "settings/audio.js",
                    "collisions": "settings/collisions.js",
                    "editor": "settings/editor.js",
                    "events": "settings/events.js",
                    "generator": "settings/generator.js",
                    "input": "settings/inpug.js",
                    "maps": "settings/maps.js",
                    "mods": "settings/mods.js",
                    "numbers": "settings/number.js",
                    "objects": "settings/objetcs.js",
                    "quadrants": "settings/quadrants.js",
                    "renderer": "settings/renderer.js",
                    "runner": "settings/runner.js",
                    "sprites": "settings/sprites.js",
                    "statistics": "settings/statistics.js",
                    "ui": "settings/ui.js",
                }
            },
            "constants": [
                "unitsize",
                "scale",
                "gravity",
                "pointLevels",
                "customTextMappings"
            ]
        });
        
        if (customs.resetTimed) {
            this.resetTimes = this.resetTimed(this, customs);
        } else {
            this.reset(this, customs);
        }
    }
    FullScreenMario.prototype = GameStartrProto;
    
    // For the sake of reset functions, store constants as members of the actual
    // FullScreenMario Function itself - this allows prototype setters to use 
    // them regardless of whether the prototype has been instantiated yet.
    FullScreenMario.unitsize = 4;
    FullScreenMario.scale = FullScreenMario.unitsize / 2;
    
    // Gravity is always a function of unitsize (and about .48)
    FullScreenMario.gravity = Math.round(12 * FullScreenMario.unitsize) / 100;
    
    // Levels of points to award for hopping on / shelling enemies
    FullScreenMario.pointLevels = [
        100, 200, 400, 500, 800, 1000, 2000, 4000, 5000, 8000
    ];
    
    // Useful for custom text, where "text!" cannot be a Function name
    FullScreenMario.customTextMappings = {
        " ": "Space",
        ".": "Period",
        "!": "ExclamationMark",
        ":": "Colon",
        "/": "Slash",
        "©": "Copyright"
    };
    
    
    /* Resets
    */
    
    /**
     * Sets self.AudioPlayer.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): AudioPlayr (src/AudioPlayr/AudioPlayr.js)
     *                          audio.js (settings/audio.js)
     */
    function resetAudioPlayer(EightBitter, customs) {
        GameStartr.prototype.resetAudioPlayer(EightBitter, customs);
        
        EightBitter.AudioPlayer.setGetVolumeLocal(
            EightBitter.getVolumeLocal.bind(EightBitter, EightBitter)
        );
        
        EightBitter.AudioPlayer.setGetThemeDefault(
            EightBitter.getAudioThemeDefault.bind(EightBitter, EightBitter)
        );
    }
    
    /**
     * Sets self.ThingHitter.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): ThingHittr (src/ThingHittr/ThingHittr.js)
     *                          collisions.js (settings/collisions.js)
     */
    function resetThingHitter(EightBitter, customs) {
        GameStartr.prototype.resetThingHitter(EightBitter, customs);
        
        EightBitter.ThingHitter.cacheHitCheckGroup("Solid");
        EightBitter.ThingHitter.cacheHitCheckGroup("Character");
    }
    
    /**
     * Sets self.MapsHandler.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): MapsHandlr (src/MapsHandlr/MapsHandlr.js)
     *                          maps.js (settings/maps.js)
     */
    function resetMapsHandler(EightBitter, customs) {
        EightBitter.MapsHandler = new MapsHandlr({
            "MapsCreator": EightBitter.MapsCreator,
            "MapScreener": EightBitter.MapScreener,
            "screenAttributes": EightBitter.settings.maps.screenAttributes,
            "onSpawn": EightBitter.settings.maps.onSpawn,
            "stretchAdd": EightBitter.mapAddStretched.bind(EightBitter),
            "onStretch": EightBitter.mapStretchThing,
            "afterAdd": EightBitter.mapAddAfter.bind(EightBitter)
        });
    }
    
    /**
     * Resets self.StatsHolder via the parent GameStartr resetStatsHolder.
     * 
     * If the screen isn't wide enough to fit the 'lives' display, it's hidden.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     */
    function resetStatsHolder(EightBitter, customs) {
        GameStartr.prototype.resetStatsHolder(EightBitter, customs);
        
        if (customs.width < 560) {
            EightBitter.StatsHolder.getContainer().children[0].cells[4].style.display = "none";
        }
    }
    
    /**
     * Sets self.container via the parent GameStartr resetContaienr.
     * 
     * The container is given the "Press Start" font, the PixelRender is told
     * to draw the scenery, solid, character, and text groups, and the container
     * width is set to the custom's width.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     */
    function resetContainer(EightBitter, customs) {
        GameStartr.prototype.resetContainer(EightBitter, customs);
        
        EightBitter.container.style.fontFamily = "Press Start";
        EightBitter.container.className += " FullScreenMario";
        
        EightBitter.PixelDrawer.setThingArrays([
            EightBitter.GroupHolder.getSceneryGroup(),
            EightBitter.GroupHolder.getSolidGroup(),
            EightBitter.GroupHolder.getCharacterGroup(),
            EightBitter.GroupHolder.getTextGroup()
        ]);
        
        EightBitter.StatsHolder.getContainer().style.width = customs.width + "px";
        EightBitter.container.appendChild(EightBitter.StatsHolder.getContainer());
    }
    
    
    /* Global manipulations
    */
    
    /**
     * Completely restarts the game. Lives are reset to 3, the map goes back
     * to default, and the onGameStart mod trigger is fired.
     * 
     * @this {EightBittr}
     */
    function gameStart() {
        var EightBitter = EightBittr.ensureCorrectCaller(this);
        
        EightBitter.setMap(
            EightBitter.settings.maps.mapDefault,
            EightBitter.settings.maps.locationDefault
        );
        EightBitter.StatsHolder.set(
            "lives", EightBitter.settings.statistics.values.lives.valueDefault
        );
        
        EightBitter.ModAttacher.fireEvent("onGameStart");
    }
    
    /**
     * Completely ends the game. All Thing groups are clared, sounds are 
     * stopped, the screen goes to black, "GAME OVER" is displayed. After a 
     * while, the game restarts again via gameStart.
     */
    function gameOver() {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            text = EightBitter.ObjectMaker.make("CustomText", {
                "texts": [{
                    "text": "GAME OVER"
                }]
            }),
            texts, textWidth, dx, i;
        
        EightBitter.killNPCs();
        
        EightBitter.AudioPlayer.clearAll();
        EightBitter.AudioPlayer.play("Game Over");
        
        EightBitter.GroupHolder.clearArrays();
        EightBitter.StatsHolder.hideContainer();
        EightBitter.TimeHandler.cancelAllEvents();
        EightBitter.PixelDrawer.setBackground("black");
        
        EightBitter.addThing(
            text,
            EightBitter.MapScreener.width / 2,
            EightBitter.MapScreener.height / 2
        );
        
        texts = text.children;
        textWidth = -(texts[texts.length - 1].right - texts[0].left) / 2;
        for (i = 0; i < texts.length; i += 1) {
            EightBitter.shiftHoriz(texts[i], textWidth);
        }
        
        EightBitter.TimeHandler.addEvent(function () {
            EightBitter.gameStart();
            EightBitter.StatsHolder.displayContainer();
        }, 420);
        
        EightBitter.ModAttacher.fireEvent("onGameOver");
    }
    
    /**
     * Slight addition to the GameStartr thingProcess Function. The Thing's hit
     * check type is cached immediately.
     * 
     * @see GameStartr::thingProcess
     */
    function thingProcess(thing, type, settings, defaults) {
        GameStartr.prototype.thingProcess(thing, type, settings, defaults);

        // ThingHittr becomes very non-performant if functions aren't generated
        // for each Thing constructor (optimization does not respect prototypal 
        // inheritance, sadly).
        thing.EightBitter.ThingHitter.cacheHitCheckType(
            thing.title,
            thing.groupType
        );
    }
    
    /**
     * Adds a Thing via addPreThing based on the specifications in a PreThing.
     * This is done relative to MapScreener.left and MapScreener.floor.
     * 
     * @param {PreThing} prething
     */
    function addPreThing(prething) {
        var thing = prething.thing,
            position = prething.position || thing.position;
        
        thing.EightBitter.addThing(
            thing, 
            prething.left * thing.EightBitter.unitsize - thing.EightBitter.MapScreener.left,
            (thing.EightBitter.MapScreener.floor - prething.top) * thing.EightBitter.unitsize
        );
        
        // Either the prething or thing, in that order, may request to be in the
        // front or back of the container
        if (position) {
            thing.EightBitter.TimeHandler.addEvent(function () {
                switch (position) {
                    case "beginning":
                        thing.EightBitter.arrayToBeginning(thing, thing.EightBitter.GroupHolder.getGroup(thing.groupType));
                        break;
                    case "end":
                        thing.EightBitter.arrayToEnd(thing, thing.EightBitter.GroupHolder.getGroup(thing.groupType));
                        break;
                }
            });
        }
        
        thing.EightBitter.ModAttacher.fireEvent("onAddPreThing", prething);
    }
    
    /**
     * Adds a new Player Thing to the game and sets it as EightBitter.play. Any
     * required additional settings (namely keys, power/size, and swimming) are
     * applied here.
     * 
     * @this {EightBittr}
     * @param {Number} [left]   A left coordinate to place the Thing at (by
     *                          default, unitsize * 16).
     * @param {Number} [bottom]   A bottom coordinate to place the Thing upon
     *                            (by default, unitsize * 16).         
     */
    function addPlayer(left, bottom) {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            player;
        
        player = EightBitter.player = EightBitter.ObjectMaker.make("Player", {
            "power": EightBitter.StatsHolder.get("power"),
            "keys": EightBitter.ObjectMaker.getProperties().Player.getKeys()
        });
        
        EightBitter.InputWriter.setEventInformation(player);
        
        if (EightBitter.MapScreener.underwater) {
            player.swimming = true;
            EightBitter.TimeHandler.addClassCycle(player, [
                "swim1", "swim2"
            ], "swimming", 5);
            EightBitter.TimeHandler.addEventInterval(
                player.EightBitter.animatePlayerBubbling,
                96, Infinity,
                player
            );
        }
        
        EightBitter.setPlayerSizeSmall(player);
        
        if (player.power >= 2) {
            EightBitter.playerGetsBig(player, true);
            if (player.power === 3) {
                EightBitter.playerGetsFire(player, true);
            }
        }
        
        if (typeof left === "undefined") {
            left = EightBitter.unitsize * 16;
        }
        if (typeof bottom === "undefined") {
            bottom = EightBitter.unitsize * 16;
        }
        
        EightBitter.addThing(
            player, left, bottom - player.height * EightBitter.unitsize
        );
        
        EightBitter.ModAttacher.fireEvent("onAddPlayer", player);
        
        return player;
    }
    
    /**
     * Shortcut to call scrollThing on the player.
     * 
     * @this {EightBittr}
     * @param {Number} dx
     * @param {Number} dy
     */
    function scrollPlayer(dx, dy) {
        var EightBitter = EightBittr.ensureCorrectCaller(this);
        
        EightBitter.scrollThing(EightBitter.player, dx, dy);
        
        EightBitter.ModAttacher.fireEvent("onScrollPlayer", dx, dy);
    }
    
    /**
     * Triggered Function for when the game is paused. Music stops, the pause
     * bleep is played, and the mod event is fired.
     */
    function onGamePause(EightBitter) {
        EightBitter.AudioPlayer.pauseAll();
        EightBitter.AudioPlayer.play("Pause");
        EightBitter.ModAttacher.fireEvent("onGamePause");
    }
    
    /**
     * Triggered Function for when the game is played or unpause. Music resumes 
     * and the mod event is fired.
     */
    function onGamePlay(EightBitter) {
        EightBitter.AudioPlayer.resumeAll();
        EightBitter.ModAttacher.fireEvent("onGamePlay");
    }
    
    
    /* Input
    */
    
    /**
     * Reacts to the left key being pressed. keys.run and leftDown are marked 
     * and the mod event is fired.
     * 
     * @param {Player} player
     */
    function keyDownLeft(player, event) {
        if (player.EightBitter.GamesRunner.getPaused()) {
            return;
        }
        
        player.keys.run = -1;
        player.keys.leftDown = true; // independent of changes to keys.run
        player.EightBitter.ModAttacher.fireEvent("onKeyDownLeft");
    }
    
    /**
     * Reacts to the right key being pressed. keys.run and keys.rightDown are
     * marked and the mod event is fired.
     * 
     * @param {Player} player
     */
    function keyDownRight(player, event) {
        if (player.EightBitter.GamesRunner.getPaused()) {
            return;
        }
        
        player.keys.run = 1;
        player.keys.rightDown = true; // independent of changes to keys.run
        player.EightBitter.ModAttacher.fireEvent("onKeyDownRight");
        
        event.preventDefault();
    }
    
    /**
     * Reacts to the up key being pressed. If the player can jump, it does, and
     * underwater paddling is checked. The mod event is fired.
     * 
     * @param {Player} player
     */
    function keyDownUp(player, event) {
        if (player.EightBitter.GamesRunner.getPaused()) {
            return;
        }
        
        player.keys.up = true;
        
        if (player.canjump && (
            player.resting || player.EightBitter.MapScreener.underwater)
        ) {
            player.keys.jump = 1;
            player.canjump = player.keys.jumplev = 0;
            
            if (player.power > 1) {
                player.EightBitter.AudioPlayer.play("Jump Super");
            } else {
                player.EightBitter.AudioPlayer.play("Jump Small");
            }
            
            if (player.EightBitter.MapScreener.underwater) {
                player.EightBitter.TimeHandler.addEvent(function () {
                    player.jumping = player.keys.jump = false;
                }, 14);
            }
        }
        
        player.EightBitter.ModAttacher.fireEvent("onKeyDownUp");
        
        event.preventDefault();
    }
    
    /**
     * Reacts to the down key being pressed. keys.crouch is marked and the mod
     * event is fired.
     * 
     * @param {Player} player
     */
    function keyDownDown(player, event) {
        if (player.EightBitter.GamesRunner.getPaused()) {
            return;
        }
        
        player.keys.crouch = true;
        player.EightBitter.ModAttacher.fireEvent("onKeyDownDown");
        
        event.preventDefault();
    }
    
    /**
     * Reacts to the sprint key being pressed. Firing happens if the player is
     * able, keys.spring is marked, and the mod event is fired.
     * 
     * @param {Player} player
     */
    function keyDownSprint(player, event) {
        if (player.EightBitter.GamesRunner.getPaused()) {
            return;
        }
        
        if (player.power === 3 && player.keys.sprint === 0 && !player.crouch) {
            player.fire(player);
        }
        player.keys.sprint = 1;
        player.EightBitter.ModAttacher.fireEvent("onKeyDownSprint");
        
        event.preventDefault();
    }
    
    /**
     * Reacts to the pause key being pressed. Pausing happens almost immediately
     * (the delay helps prevent accidental pauses) and the mod event fires.
     * 
     * @param {Player} player
     */
    function keyDownPause(player, event) {
        if (!player.EightBitter.GamesRunner.getPaused()) {
            player.EightBitter.TimeHandler.addEvent(
                player.EightBitter.GamesRunner.pause, 7, true
            );
        }
        player.EightBitter.ModAttacher.fireEvent("onKeyDownPause");
        
        event.preventDefault();
    }
    
    /**
     * Reacts to the mute key being lifted. Muting is toggled and the mod event
     * is fired.
     * 
     * @param {Player} player
     */
    function keyDownMute(player, event) {
        if (player.EightBitter.GamesRunner.getPaused()) {
            return;
        }
        
        player.EightBitter.AudioPlayer.toggleMuted();
        player.EightBitter.ModAttacher.fireEvent("onKeyDownMute");
        
        event.preventDefault();
    }
    
    /**
     * Reacts to the left key being lifted. keys.run and keys.leftDown are 
     * marked and the mod event is fired.
     * 
     * @param {Player} player
     */
    function keyUpLeft(player, event) {
        player.keys.run = player.keys.leftDown = 0;
        player.EightBitter.ModAttacher.fireEvent("onKeyUpLeft");
        
        event.preventDefault();
    }
    
    /**
     * Reacts to the right key being lifted. keys.run and keys.rightDown are 
     * marked and the mod event is fired.
     * 
     * @param {Player} player
     */
    function keyUpRight(player, event) {
        player.keys.run = player.keys.rightDown = 0;
        player.EightBitter.ModAttacher.fireEvent("onKeyUpRight");
        
        event.preventDefault();
    }
    
    /**
     * Reacts to the up key being lifted. Jumping stops and the mod event is
     * fired.
     * 
     * @param {Player} player
     */
    function keyUpUp(player, event) {
        if (!player.EightBitter.MapScreener.underwater) {
            player.keys.jump = player.keys.up = 0;
        }
        player.canjump = true;
        player.EightBitter.ModAttacher.fireEvent("onKeyUpUp");
        
        event.preventDefault();
    }
    
    /**
     * Reacts to the down key being lifted. keys.crouch is marked, crouch
     * removal happens if necessary, and the mod event is fired.
     * 
     * @param {Player} player
     */
    function keyUpDown(player, event) {
        player.keys.crouch = 0;
        if (!player.piping) {
            player.EightBitter.animatePlayerRemoveCrouch(player);
        }
        player.EightBitter.ModAttacher.fireEvent("onKeyUpDown");
        
        event.preventDefault();
    }
    
    /**
     * Reacts to the spring key being lifted. keys.sprint is marked and the mod
     * event is fired.
     * 
     * @param {Player} player
     */
    function keyUpSprint(player, event) {
        player.keys.sprint = 0;
        player.EightBitter.ModAttacher.fireEvent("onKeyUpSprint");
        
        event.preventDefault();
    }
    
    /**
     * Reacts to the pause key being lifted. The game is unpaused if necessary
     * and the mod event is fired.
     * 
     * @param {Player} player
     */
    function keyUpPause(player, event) {
        if (player.EightBitter.GamesRunner.getPaused()) {
            player.EightBitter.GamesRunner.play();
        }
        player.EightBitter.ModAttacher.fireEvent("onKeyUpPause");
        
        event.preventDefault();
    }
    
    /**
     * Reacts to a right click being pressed. Pausing is toggled and the mod
     * event is fired.
     * 
     * @param {Player} player
     */
    function mouseDownRight(player, event) {
        player.EightBitter.GamesRunner.togglePause();
        player.EightBitter.ModAttacher.fireEvent("onMouseDownRight");
        
        event.preventDefault();
    }
    
    /**
     * Reacts to a regularly caused device motion event. Acceleration is checked
     * for changed tilt horizontally (to trigger left or right key statuses) or
     * changed tilt vertically (jumping). The mod event is also fired.
     * 
     * @param {Player} player
     * @param {DeviceMotionEvent} event
     */
    var deviceMotion = (function () {
        var motionDown = false,
            motionLeft = false,
            motionRight = false,
            x, y,
            dy;
        
        return function deviceMotion(player, event) {
            player.EightBitter.ModAttacher.fireEvent("onDeviceMotion", event);
            
            var acceleration = event.accelerationIncludingGravity;
            
            if (y !== undefined) {
                dy = acceleration.y - y;
                if (dy > 0.21) {
                    player.EightBitter.keyDownUp(player);
                } else if (dy < -0.14) {
                    player.EightBitter.keyUpUp(player);
                }
            }
            
            x = acceleration.x;
            y = acceleration.y;
            
            if (x > 2.1) {
                if (!motionLeft) {
                    player.EightBitter.keyDownLeft(player);
                    motionLeft = true;
                }
            } else if (x < -2.1) {
                if (!motionRight) {
                    player.EightBitter.keyDownRight(player);
                    motionRight = true;
                }
            } else {
                if (motionLeft) {
                    player.EightBitter.keyUpLeft(player);
                    motionLeft = false;
                }
                if (motionRight) {
                    player.EightBitter.keyUpRight(player);
                    motionRight = false;
                }
            }
        };
    })();
    
    /**
     * Checks whether inputs can be fired, which is equivalent to the status of
     * the MapScreener's nokeys variable (an inverse value).
     * 
     * @param {EightBittr} EightBitter
     */
    function canInputsTrigger(EightBitter) {
        return !EightBitter.MapScreener.nokeys;
    }
    
    
    /* Upkeep maintenence
    */
    
    /**
     * Regular maintenance Function called on the Solids group every upkeep.  
     * Things are checked for being alive and to the right of QuadsKeeper.left; 
     * if they aren't, they are removed. Each Thing is also allowed a movement
     * Function.
     * 
     * @param {EightBittr} EightBitter
     * @param {Solid[]} solids   EightBittr's GroupHolder's Solid group.
     */
    function maintainSolids(EightBitter, solids) {
        var delx = EightBitter.QuadsKeeper.left,
            solid, i;
        
        EightBitter.QuadsKeeper.determineAllQuadrants("Solid", solids);
        
        for (i = 0; i < solids.length; ++i) {
            solid = solids[i];
            
            if (solid.alive && solid.right > delx) {
                if (solid.movement) {
                    solid.movement(solid);
                }
            } else {
                EightBitter.arrayDeleteThing(solid, solids, i);
                i -= 1;
            }
        }
    }

    /**
     * Regular maintenance Function called on the Characters group every upkeep.
     * Things have gravity and y-velocities, collision detection, and resting
     * checks applied before they're checked for being alive. If they are, they
     * are allowed a movement Function; if not, they are removed.
     * 
     * @param {EightBittr} EightBitter
     * @param {Character[]} characters   EightBittr's GroupHolder's Characters
     *                                   group.
     */
    function maintainCharacters(EightBitter, characters) {
        var delx = EightBitter.QuadsKeeper.right,
            character, i;
        
        for (i = 0; i < characters.length; ++i) {
            character = characters[i];
            
            // Gravity
            if (character.resting) {
                character.yvel = 0;
            } else {
                if (!character.nofall) {
                    character.yvel += character.gravity || EightBitter.MapScreener.gravity;
                }
                character.yvel = Math.min(character.yvel, EightBitter.MapScreener.maxyvel);
            }

            // Position updating and collision detection
            character.under = character.undermid = false;
            EightBitter.updatePosition(character);
            EightBitter.QuadsKeeper.determineThingQuadrants(character);
            EightBitter.ThingHitter.checkHitsOf[character.title](character);
            
            // Overlaps
            if (character.overlaps && character.overlaps.length) {
                EightBitter.maintainOverlaps(character);
            }

            // Resting tests
            if (character.resting) {
                if (!EightBitter.isCharacterOnResting(character, character.resting)) {
                    if (character.onRestingOff) {
                        character.onRestingOff(character, character.resting);
                    } else {
                        // Necessary for moving platforms
                        character.resting = undefined; 
                    }
                } else {
                    character.yvel = 0;
                    EightBitter.setBottom(character, character.resting.top);
                }
            }

            // Movement or deletion
            // To do: rethink this...
            if (character.alive) {
                if (!character.player &&
                    (character.numquads === 0 || character.left > delx) &&
                    (!character.outerok || (
                        character.right < EightBitter.MapScreener.width - delx
                    ))) {
                    EightBitter.arrayDeleteThing(character, characters, i);
                } else {
                    if (!character.nomove && character.movement) {
                        character.movement(character);
                    }
                }
            } else {
                EightBitter.arrayDeleteThing(character, characters, i);
                i -= 1;
            }
        }
    }
    
    /**
     * Maintenance Function only triggered for Things that are known to have 
     * overlapping Solids stored in their overlaps attribute. This will slide
     * the offending Thing away from the midpoint of those overlaps once a call
     * until it's past the boundary (and check for those boundaries if not 
     * already set).
     * 
     * @param {Thing} thing
     */
    function maintainOverlaps(thing) {
        // If checkOverlaps is still true, this is the first maintain call
        if (thing.checkOverlaps) {
            if (!thing.EightBitter.setOverlapBoundaries(thing)) {
                return;
            }
        }
        
        thing.EightBitter.slideToX(
            thing, 
            thing.overlapGoal, 
            thing.EightBitter.unitsize
        );
        
        // Goal to the right: has the thing gone far enough to the right?
        if (thing.overlapGoRight) {
            if (thing.left >= thing.overlapCheck) {
                thing.EightBitter.setLeft(thing, thing.overlapCheck);
            } else {
                return;
            }
        } 
        // Goal to the left: has the thing gone far enough to the left?
        else {
            if (thing.right <= thing.overlapCheck) {
                thing.EightBitter.setRight(thing, thing.overlapCheck);
            } else {
                return;
            }
        }
        
        // A check above didn't fail into a return, so overlapping is solved
        thing.overlaps.length = 0;
        thing.checkOverlaps = true;
    }
    
    /**
     * Sets the overlapping properties of a Thing when it is first detected as
     * overlapping in maintainOverlaps. All solids in its overlaps Array are
     * checked to find the leftmost and rightmost extremes and midpoint.
     * Then, the Thing is checked for being to the left or right of the 
     * midpoint, and the goal set to move it away from the midpoint.
     * 
     * @param {Thing} thing
     * @return {Boolean}   Whether the Thing's overlaps were successfully 
     *                     recorded (if there was only one, not so).
     */
    function setOverlapBoundaries(thing) {
        // Only having one overlap means nothing should be done
        if (thing.overlaps.length === 1) {
            thing.overlaps.length = 0;
            return false;
        }
        
        var rightX = -Infinity,
            leftX = Infinity,
            overlaps = thing.overlaps,
            other, leftThing, rightThing, 
            midpoint, i;
        
        for (i = 0; i < overlaps.length; i += 1) {
            other = overlaps[i];
            
            if (other.right > rightX) {
                rightThing = other;
            }
            if (other.left < leftX) {
                leftThing = other;
            }
        }
        
        midpoint = (leftX + rightX) / 2;
        
        if (thing.EightBitter.getMidX(thing) >= midpoint) {
            thing.overlapGoal = Infinity;
            thing.overlapGoRight = true;
            thing.overlapCheck = rightThing.right;
        } else {
            thing.overlapGoal = -Infinity;
            thing.overlapGoRight = false;
            thing.overlapCheck = leftThing.left;
        }
        
        thing.checkOverlaps = false;
        
        return true;
    }

    /**
     * Regular maintenance Function called on the player every upkeep. A barrage
     * of tests are applied, namely falling/jumping, dying, x- and y-velocities,
     * running, and scrolling. This is separate from the movePlayer movement
     * Function that will be called in maintainCharacters.
     * 
     * @param {EightBittr} EightBitter
     */
    function maintainPlayer(EightBitter) {
        var player = EightBitter.player;
        if (!EightBitter.isThingAlive(player)) {
            return;
        }

        // Player is falling
        if (player.yvel > 0) {
            if (!EightBitter.MapScreener.underwater) {
                player.keys.jump = 0;
            }
            // Jumping?
            if (!player.jumping && !player.crouching) {
                // Paddling? (from falling off a solid)
                if (EightBitter.MapScreener.underwater) {
                    if (!player.paddling) {
                        EightBitter.switchClass(player, "paddling", "paddling");
                        player.paddling = true;
                    }
                } else {
                    EightBitter.addClass(player, "jumping");
                    player.jumping = true;
                }
            }
            // Player has fallen too far
            if (!player.dying && player.top > EightBitter.MapScreener.bottom) {
                // If the map has an exit (e.g. cloud world), transport there
                if (EightBitter.MapsHandler.getArea().exit) {
                    EightBitter.setLocation(EightBitter.MapsHandler.getArea().exit);
                }
                // Otherwise, since Player is below the screen, kill him dead
                else {
                    EightBitter.killPlayer(player, 2);
                }
                
                return;
            }
        }

        // Player is moving to the right
        if (player.xvel > 0) {
            if (player.right > EightBitter.MapScreener.middleX) {
                // If Player is to the right of the screen's middle, move the screen
                if (player.right > EightBitter.MapScreener.right - EightBitter.MapScreener.left) {
                    player.xvel = Math.min(0, player.xvel);
                }
            }
        }
        // Player is moving to the left
        else if (player.left < 0) {
            // Stop Player from going to the left.
            player.xvel = Math.max(0, player.xvel);
        }

        // Player is hitting something (stop jumping)
        if (player.under) {
            player.jumpcount = 0;
        }

        // Scrolloffset is how far over the middle player's right is
        if (EightBitter.MapScreener.canscroll) {
            var scrolloffset = player.right - EightBitter.MapScreener.middleX;
            if (scrolloffset > 0) {
                EightBitter.scrollWindow(
                    Math.round(Math.min(player.scrollspeed, scrolloffset))
                );
            }
        }
    }
    
    
    /* Collision detectors
    */

    /**
     * Function generator for the generic canThingCollide checker. This is used
     * repeatedly by ThingHittr to generate separately optimized Functions for
     * different Thing types.
     * 
     * @return {Function}
     */
    function generateCanThingCollide() {
        /**
         * Generic checker for canCollide, used for both Solids and Characters.
         * This just returns if the Thing is alive and doesn't have the
         * nocollide flag.
         * 
         * @param {Thing} thing
         * @return {Boolean}
         */
        return function canThingCollide(thing) {
            return thing.alive && !thing.nocollide;
        };
    }
    
    /**
     * @param {Thing} thing
     * @return {Boolean} Whether the Thing is alive, meaning it has a true alive
     *                   flag and a false dead flag.
     */
    function isThingAlive(thing) {
        return thing && thing.alive && !thing.dead;
    }

    /**
     * Generic base function to check if one Thing is touching another. This 
     * will be called by the more specific Thing touching functions.
     * 
     * @param {Thing} thing
     * @param {Thing} other
     * @return {Boolean}
     * @remarks Only the horizontal checks use unitsize
     */
    function isThingTouchingThing(thing, other) {
        return (
            !thing.nocollide && !other.nocollide
            && thing.right - thing.EightBitter.unitsize > other.left
            && thing.left + thing.EightBitter.unitsize < other.right
            && thing.bottom >= other.top
            && thing.top <= other.bottom
        );
    }
    
    /**
     * General top collision detection Function for two Things to determine if
     * one Thing is on top of another. This takes into consideration factors
     * such as which are solid or an enemy, and y-velocity.
     * 
     * @param {Thing} thing
     * @param {Thing} other
     * @return {Boolean}
     * @remarks This is a more specific form of isThingTouchingThing
     */
    function isThingOnThing(thing, other) {
        // If thing is a solid and other is falling, thing can't be above other
        if (thing.groupType === "Solid" && other.yvel > 0) {
            return false;
        }
        
        // If other is falling faster than thing, and isn't a solid,
        // thing can't be on top (if anything, the opposite is true)
        if (thing.yvel < other.yvel && other.groupType !== "Solid") {
            return false;
        }
        
        // If thing is the player, and it's on top of an enemy, that's true
        if (
            thing.player && thing.bottom < other.bottom 
            && other.type === "enemy"
        ) {
            return true;
        }
        
        // If thing is too far to the right, it can't be touching other
        if (thing.left + thing.EightBitter.unitsize >= other.right) {
            return false;
        }
        
        // If thing is too far to the left, it can't be touching other
        if (thing.right - thing.EightBitter.unitsize <= other.left) {
            return false;
        }
        
        // If thing's bottom is below other's top, factoring tolerance and
        // other's vertical velocity, they're touching
        if (thing.bottom <= other.top + other.toly + other.yvel) {
            return true;
        }
        
        // Same as before, but with velocity as the absolute difference between
        // their two velocities
        if (
            thing.bottom <= other.top + other.toly
            + Math.abs(thing.yvel - other.yvel)
        ) {
            return true;
        }
        
        // None of the above checks passed for true, so this is false (thing's
        // bottom is above other's top
        return false;
    }
    
    /**
     * Top collision Function to determine if one Thing is on top of a solid.
     * 
     * @param {Thing} thing
     * @param {Solid} other
     * @remarks Similar to isThingOnThing, but more specifically used for
     *          isCharacterOnSolid and isCharacterOnResting
     */
    function isThingOnSolid(thing, other) {
        // If thing is too far to the right, they're not touching
        if (thing.left + thing.EightBitter.unitsize >= other.right) {
            return false;
        }
        
        // If thing is too far to the left, they're not touching
        if (thing.right - thing.EightBitter.unitsize <= other.left) {
            return false;
        }
        
        // If thing's bottom is below other's top, factoring thing's velocity
        // and other's tolerance, they're touching
        if (thing.bottom - thing.yvel <= other.top + other.toly + thing.yvel) {
            return true;
        }
        
        // Same as before, but with velocity as the absolute difference between
        // their two velocities
        if (thing.bottom <= other.top + other.toly
                + Math.abs(thing.yvel - other.yvel)) {
            return true;
        }
        
        // None of the above checks passed for true, so this is false (thing's
        // bottom is above other's top
        return false;
    }
    
    /**
     * Top collision Function to determine if a character is on top of a solid.
     * This is always true for resting (since resting checks happen before when
     * this should be called).
     * 
     * @param {Character} thing
     * @param {Solid} other
     * @return {Boolean}
     */
    function isCharacterOnSolid(thing, other) {
        // If character is resting on solid, this is automatically true
        if (thing.resting === other) {
            return true;
        }
        
        // If the character is jumping upwards, it's not on a solid
        // (removing this check would cause Mario to have "sticky" behavior when
        // jumping at the corners of solids)
        if (thing.yvel < 0) {
            return false;
        }
        
        // The character and solid must be touching appropriately
        if (!thing.EightBitter.isThingOnSolid(thing, other)) {
            return false;
        }
        
        // Corner case: when character is exactly falling off the right (false)
        if (thing.left + thing.xvel + thing.EightBitter.unitsize === other.right) {
            return false;
        }
        
        // Corner case: when character is exactly falling off the left (false)
        if (thing.right - thing.xvel - thing.EightBitter.unitsize === other.left) {
            return false;
        }
        
        // None of the above checks caught a falsity, so this must be true
        return true;
    }
    
    /**
     * Top collision Function to determine if a character should be considered 
     * resting on a solid. This mostly uses isThingOnSolid, but also checks for
     * the corner cases of the character being exactly at the edge of the solid
     * (such as when jumping while next to it).
     * 
     * @param {Character} thing
     * @param {Solid} other
     * @return {Boolean}
     */
    function isCharacterOnResting(thing, other) {
        if (!thing.EightBitter.isThingOnSolid(thing, other)) {
            return false;
        }
        
        // Corner case: when character is exactly falling off the right (false)
        if (
            thing.left + thing.xvel + thing.EightBitter.unitsize === other.right
        ) {
            return false;
        }
        
        // Corner case: when character is exactly falling off the left (false)
        if (
            thing.right - thing.xvel - thing.EightBitter.unitsize === other.left
        ) {
            return false;
        }
        
        // None of the above checks caught a falsity, so this must be true
        return true;
    }
    
    /**
     * Function generator for the generic isCharacterTouchingCharacter checker.
     * This is used repeatedly by ThingHittr to generate separately optimized
     * Functions for different Thing types.
     * 
     * @return {Function} 
     */
    function generateIsCharacterTouchingCharacter() {
        /**
         * Generic checker for whether two characters are touching each other.
         * This mostly checks to see if either has the nocollidechar flag, and
         * if the other is a player. isThingTouchingThing is used after.
         * 
         * @param {Character} thing
         * @param {Character} other
         * @return {Boolean}
         */
        return function isCharacterTouchingCharacter(thing, other) {
            if (
                thing.nocollidechar
                && (!other.player || thing.nocollideplayer)
            ) {
                return false;
            }
            
            if (
                other.nocollidechar
                && (!thing.player || other.nocollideplayer)
            ) {
                return false;
            }
            
            return thing.EightBitter.isThingTouchingThing(thing, other);
        };
    }
    
    /**
     * Function generator for the generic isCharacterTouchingSolid checker. This
     * is used repeatedly by ThingHittr to generate separately optimized 
     * Functions for different Thing types.
     * 
     * @return {Function}
     */
    function generateIsCharacterTouchingSolid() {
        /**
         * Generic checker for whether a character is touching a solid. The
         * hidden, collideHidden, and nocollidesolid flags are most relevant.
         * 
         * @param {Character} thing
         * @param {Solid} other
         */
        return function isCharacterTouchingSolid(thing, other) {
            // Hidden solids can only be touched by the player bottom-bumping
            // them, or by specifying collideHidden
            if (other.hidden && !other.collideHidden) {
                if (
                    !thing.player 
                    || !thing.EightBitter.isSolidOnCharacter(other, thing)
                ) {
                    return false;
                }
            }
            
            if (thing.nocollidesolid && !(thing.allowUpSolids && other.up)) {
                return false;
            }
            
            return thing.EightBitter.isThingTouchingThing(thing, other);
        };
    }
    
    /**
     * @param {Character} thing
     * @param {Enemy} other
     * @return {Boolean} Whether the Thing's bottom is above the other's top,
     *                   allowing for the other's toly.
     */
    function isCharacterAboveEnemy(thing, other) {
        return thing.bottom < other.top + other.toly;
    }
    
    /**
     * @param {Character} thing
     * @param {Solid} other
     * @return {Boolean} Whether the Thing's top is above the other's bottom,
     *                   allowing for the Thing's toly and yvel.
     */
    function isCharacterBumpingSolid(thing, other) {
        return thing.top + thing.toly + Math.abs(thing.yvel) > other.bottom;
    }
    
    /**
     * @param {Character} thing
     * @param {Solid} other
     * @return {Boolean} Whether the Thing is "overlapping" the solid, which 
     *                      should move the Thing until it isn't.
     */
    function isCharacterOverlappingSolid(thing, other) {
        return thing.top <= other.top && thing.bottom > other.bottom;
    }
    
    /**
     * @param {Solid} thing
     * @param {Character} other
     * @return {Boolean} Whether the Thing, typically a solid, is on top of the 
     *                   other .
     * @remarks Similar to isThingOnThing, but more specifically used for
     *          characterTouchedSolid
     */
    function isSolidOnCharacter(thing, other) {
        // This can never be true if other is falling
        if (other.yvel >= 0) {
            return false;
        }
        
        // Horizontally, all that's required is for the other's midpoint to
        // be within the thing's left and right
        var midx = thing.EightBitter.getMidX(other);
        if (midx <= thing.left || midx >= thing.right) {
            return false;
        }
        
        // If the thing's bottom is below the other's top, factoring
        // tolerance and velocity, that's false (this function assumes they're
        // already touching)
        if (thing.bottom - thing.yvel > other.top + other.toly - other.yvel) {
            return false;
        }
        
        // The above checks never caught falsities, so this must be true
        return true;
    }
    
    
    /* Collision reactions
    */
    
    /**
     * Externally facing Function to gain some number of lives. StatsHolder 
     * increases the "score" statistic, an audio is played, and the mod event is 
     * fired.
     * 
     * @this {EightBittr}
     * @param {Number} [amount]   How many lives to gain (by default, 1).
     * @param {Boolean} [nosound]   Whether the sound should be skipped (by
     *                              default, false).
     */
    function gainLife(amount, nosound) {
        var EightBitter = EightBittr.ensureCorrectCaller(this);
        
        amount = Number(amount) || 1;
        
        EightBitter.StatsHolder.increase("lives", amount);
        
        if (!nosound) {
            this.AudioPlayer.play("Gain Life");
        }
        
        EightBitter.ModAttacher.fireEvent("onGainLife", amount);
    }
    
    /**
     * Basic Function for an item to jump slightly into the air, such as from 
     * the player hitting a solid below it. 
     * 
     * @param {Item} thing
     * @remarks This simply moves the thing up slightly and decreases its
     *          y-velocity, without considering x-direction.
     */
    function itemJump(thing) {
        thing.yvel -= FullScreenMario.unitsize * 1.4;
        this.shiftVert(thing, -FullScreenMario.unitsize);
    }
    
    /**
     * Generic Function for when the player jumps on top of an enemy. The enemy
     * is killed, the player's velocity points upward, and score is gained.
     * 
     * @param {Player} thing
     * @param {Enemy} other
     */
    function jumpEnemy(thing, other) {
        if (thing.keys.up) {
            thing.yvel = thing.EightBitter.unitsize * -1.4;
        } else {
            thing.yvel = thing.EightBitter.unitsize * -0.7;
        }
        
        thing.xvel *= 0.91;
        thing.EightBitter.AudioPlayer.play("Kick");
        
        if (other.group !== "item" || other.shell) {
            thing.jumpcount += 1;
            thing.EightBitter.scoreOn(
                thing.EightBitter.findScore(thing.jumpcount + thing.jumpers),
                other
            );
        }
        
        thing.jumpers += 1;
        thing.EightBitter.TimeHandler.addEvent(function (thing) {
            thing.jumpers -= 1;
        }, 1, thing);
    }
    
    /**
     * Callback for the player hitting a Mushroom or FireFlower. The player's
     * power and the StatsHolder's "power" statistic both go up, and the
     * corresponding animations and mod event are triggered.
     * 
     * @param {Player} thing
     * @param {Item} [other]
     */
    function playerShroom(thing, other) {
        if (thing.shrooming || !thing.player) {
            return;
        }
        
        thing.EightBitter.AudioPlayer.play("Powerup");
        thing.EightBitter.scoreOn(1000, thing.EightBitter.player);
        
        if (thing.power < 3) {
            thing.EightBitter.StatsHolder.increase("power");
            
            if (thing.power < 3) {
                thing.shrooming = true;
                thing.power += 1;
                
                if (thing.power === 3) {
                    thing.EightBitter.playerGetsFire(thing.EightBitter.player);
                } else {
                    thing.EightBitter.playerGetsBig(thing.EightBitter.player);
                }
            }
        }
            
        thing.EightBitter.ModAttacher.fireEvent("onPlayerShroom", thing, other);
    }
    
    /**
     * Callback for the player hitting a Mushroom1Up. The game simply calls 
     * gainLife and triggers the mod event.
     * 
     * @param {Player} thing
     * @param {Item} [other]
     */
    function playerShroom1Up(thing, other) {
        if (!thing.player) {
            return;
        }
        
        thing.EightBitter.gainLife(1);
        thing.EightBitter.ModAttacher.fireEvent(
            "onPlayerShroom1Up", thing, other
        );
    }
    
    /**
     * Callback for the player hitting a Star. A set of animation loops and 
     * sounds play, and the mod event is triggered. After some long period time,
     * playerStarDown is called to start the process of removing star power.
     * 
     * @param {Player} thing
     * @param {Number} [timeout]   How long to wait before calling 
     *                             playerStarDown (by default, 560).
     */
    function playerStarUp(thing, timeout) {
        thing.star += 1;
        
        thing.EightBitter.switchClass(thing, "normal fiery", "star");
        
        thing.EightBitter.AudioPlayer.play("Powerup");
        thing.EightBitter.AudioPlayer.addEventListener(
            "Powerup",
            "ended",
            thing.EightBitter.AudioPlayer.playTheme.bind(
                undefined, "Star", true
            )
        );
        
        thing.EightBitter.TimeHandler.addClassCycle(thing, [
            "star1", "star2", "star3", "star4"
        ], "star", 2);
        
        thing.EightBitter.TimeHandler.addEvent(
            thing.EightBitter.playerStarDown, 
            timeout || 560, 
            thing
        );
        
        thing.EightBitter.ModAttacher.fireEvent("onPlayerStarUp", thing);
    }
    
    /**
     * Trigger to commence reducing the player's star power. This slows the
     * class cycle, times a playerStarOffCycle trigger, and fires the mod event.
     * 
     * @param {Player} thing
     */
    function playerStarDown(thing) {
        if (!thing.player) {
            return;
        }
        
        thing.EightBitter.TimeHandler.cancelClassCycle(thing, "star");
        thing.EightBitter.TimeHandler.addClassCycle(thing, [
            "star1", "star2", "star3", "star4"
        ], "star", 5);
        
        thing.EightBitter.TimeHandler.addEvent(
            thing.EightBitter.playerStarOffCycle,
            140,
            thing
        );
        
        thing.EightBitter.AudioPlayer.removeEventListeners("Powerup", "ended");
        
        thing.EightBitter.ModAttacher.fireEvent("onPlayerStarDown", thing);
    }
    
    /**
     * Trigger to continue reducing the player's star power. This resumes 
     * playing the regular theme, times a playerStarOffFinal trigger, and fires
     * the mod event.
     * 
     * @param {Player} thing
     */
    function playerStarOffCycle(thing) {
        if (!thing.player) {
            return;
        }
        
        if (thing.star > 1) {
            thing.star -= 1;
            return;
        }
        
        if (!thing.EightBitter.AudioPlayer.getTheme().paused) {
            thing.EightBitter.AudioPlayer.playTheme();
        }
        
        thing.EightBitter.TimeHandler.addEvent(
            thing.EightBitter.playerStarOffFinal,
            70,
            thing
        );
        
        thing.EightBitter.ModAttacher.fireEvent("onPlayerStarOffCycle", thing);
    }
    
    /**
     * Trigger to finish reducing the player's star power. This actually reduces
     * the player's star attribute, cancels the sprite cycle, adds the previous 
     * classes back, and fires the mod event.
     * 
     * @param {Player} thing
     */
    function playerStarOffFinal(thing) {
        if (!thing.player) {
            return;
        }
        
        thing.star -= 1;
        thing.EightBitter.TimeHandler.cancelClassCycle(thing, "star");
        thing.EightBitter.removeClasses(thing, "star star1 star2 star3 star4");
        thing.EightBitter.addClass(thing, "normal");
        
        if (thing.power === 3) {
            thing.EightBitter.addClass(thing, "fiery");
        }
        
        thing.EightBitter.ModAttacher.fireEvent("onPlayerStarOffFinal", thing);
    }
    
    /**
     * Sizing modifier for the player, typically called when entering a location
     * or colliding with a Mushroom. This sets the player's size to the large 
     * mode and optionally plays the animation. The mod event is then fired.
     * 
     * @param {Player} thing
     * @param {Boolean} [noAnimation]   Whether to skip the animation (by 
     *                                  default, false).
     */
    function playerGetsBig(thing, noAnimation) {
        thing.keys.down = 0;
        thing.EightBitter.setPlayerSizeLarge(thing);
        thing.EightBitter.removeClasses(thing, "crouching small");
        thing.EightBitter.updateBottom(thing, 0);
        thing.EightBitter.updateSize(thing);
        
        if (noAnimation) {
            thing.EightBitter.addClass(thing, "large");
        } else {
            thing.EightBitter.playerGetsBigAnimation(thing);
        }
        
        thing.EightBitter.ModAttacher.fireEvent("onPlayerGetsBig", thing);
    }
    
    /**
     * Animation scheduler for the player getting big. The shrooming classes are
     * cycled through rapidly while the player's velocity is paused.
     * 
     * @param {Player} thing
     */
    function playerGetsBigAnimation(thing) {
        var stages = [
                'shrooming1', 'shrooming2', 'shrooming1', 'shrooming2',
                'shrooming3', 'shrooming2', 'shrooming3'
            ],
            i;
        
        thing.EightBitter.addClass(thing, "shrooming");
        thing.EightBitter.thingPauseVelocity(thing);
        
        // The last stage in the events clears it, resets movement, and stops
        stages.push(function (thing, stages) {
            thing.shrooming = stages.length = 0;
            
            thing.EightBitter.addClass(thing, "large");
            thing.EightBitter.removeClasses(thing, "shrooming shrooming3");
            thing.EightBitter.thingResumeVelocity(thing);
            
            return true;
        });
        
        thing.EightBitter.TimeHandler.addClassCycle(thing, stages, "shrooming", 6);
    }
    
    /**
     * Sizing modifier for the player, typically called when going down to 
     * normal size after being large. This containst eha nimation scheduling
     * to cycle through paddling classes, then flickers the player. The mod 
     * event is fired.
     * 
     * @param {Player} thing
     */
    function playerGetsSmall(thing) {
        var bottom = thing.bottom;
        
        thing.keys.down = 0;
        thing.EightBitter.thingPauseVelocity(thing);
        
        // Step one
        thing.nocollidechar = true;
        thing.EightBitter.animateFlicker(thing);
        thing.EightBitter.removeClasses(
            thing, "running skidding jumping fiery"
        );
        thing.EightBitter.addClasses(thing, "paddling small");
        
        // Step two (t+21)
        thing.EightBitter.TimeHandler.addEvent(function (thing) {
            thing.EightBitter.removeClass(thing, "large");
            thing.EightBitter.setPlayerSizeSmall(thing);
            thing.EightBitter.setBottom(
                thing, bottom - FullScreenMario.unitsize
            );
        }, 21, thing);
        
        // Step three (t+42)
        thing.EightBitter.TimeHandler.addEvent(function (thing) {
            thing.EightBitter.thingResumeVelocity(thing, false);
            thing.EightBitter.removeClass(thing, "paddling");
            if (thing.running || thing.xvel) {
                thing.EightBitter.addClass(thing, "running");
            }
            thing.EightBitter.PixelDrawer.setThingSprite(thing);
        }, 42, thing);
        
        // Step four (t+70)
        thing.EightBitter.TimeHandler.addEvent(function (thing) {
            thing.nocollidechar = false;
        }, 70, thing);
        
        thing.EightBitter.ModAttacher.fireEvent("onPlayerGetsSmall");
    }
    
    /**
     * Visual changer for when the player collides with a FireFlower. The 
     * "fiery" class is added, and the mod event is fired.
     * 
     * @param {Player} thing
     */
    function playerGetsFire(thing) {
        thing.shrooming = false;
        
        if (!thing.star) {
            thing.EightBitter.addClass(thing, "fiery");
        }
        
        thing.EightBitter.ModAttacher.fireEvent("onPlayerGetsFire");
    }
    
    /**
     * Actually sets the size for a player to small (8x8) via setSize and 
     * updateSize.
     * 
     * @param {Player} thing
     */
    function setPlayerSizeSmall(thing) {
        thing.EightBitter.setSize(thing, 8, 8, true);
        thing.EightBitter.updateSize(thing);
    }
    
    /**
     * Actually sets the size for a player to large (8x16) via setSize and 
     * updateSize.
     * 
     * @param {Player} thing
     */
    function setPlayerSizeLarge(thing) {
        thing.EightBitter.setSize(thing, 8, 16, true);
        thing.EightBitter.updateSize(thing);
    }
    
    /**
     * Removes the crouching flag from the player and re-adds the running cycle. 
     * If the player is large (has power > 1), size and classes must be set.
     * 
     * @param {Player} thing
     */
    function animatePlayerRemoveCrouch(thing) {
        thing.crouching = false;
        thing.toly = thing.tolyOld || 0;
        
        if (thing.power !== 1) {
            thing.EightBitter.setHeight(thing, 16, true, true);
            thing.EightBitter.removeClasses(thing, "crouching");
            thing.EightBitter.updateBottom(thing, 0);
            thing.EightBitter.updateSize(thing);
        }
        
        thing.EightBitter.animatePlayerRunningCycle(thing);
    }
    
    /**
     * Officially unattaches a character from a solid. The thing's physics flags
     * are reset to normal, the two have their attachment flags set, and the 
     * thing is set to be jumping off.
     * 
     * @param {Player} thing   A character attached to other.
     * @param {Solid} other   A solid the thing is attached to.
     */
    function unattachPlayer(thing, other) {
        thing.nofall = false;
        thing.nocollide = false;
        thing.checkOverlaps = true;
        thing.attachedSolid = undefined;
        thing.xvel = thing.keys ? thing.keys.run : 0;
        thing.movement = thing.EightBitter.movePlayer;
        
        thing.EightBitter.addClass(thing, "jumping");
        thing.EightBitter.removeClasses(thing, "climbing", "animated");
        
        other.attachedCharacter = undefined;
    }
    
    /**
     * Adds an invisible RestingStone underneath the player. It is hidden and
     * unable to collide until the player falls to its level, at which point the
     * stone is set underneath the player to be rested upon.
     * 
     * @param {Player} thing
     */
    function playerAddRestingStone(thing) {
        var stone = thing.EightBitter.addThing(
            "RestingStone", 
            thing.left,
            thing.top + thing.EightBitter.unitsize * 48
        );
        
        thing.nocollide = true;
        
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            if (thing.bottom >= stone.top) {
                thing.nocollide = false;
                thing.EightBitter.setMidXObj(stone, thing);
                thing.EightBitter.setBottom(thing, stone.top);
                return true;
            }
        }, 1, Infinity);
    }
    
    /**
     * Marks a new overlapping Thing in the first Thing's overlaps Array, 
     * creating the Array if needed.
     * 
     * @param {Thing} thing   The Thing that is overlapping another Thing.
     * @param {Thing} other   The Thing being added to the overlaps Array.
     */
    function markOverlap(thing, other) {
        if (!thing.overlaps) {
            thing.overlaps = [other];
        } else {
            thing.overlaps.push(other);
        }
    }
    
    
    /* Spawn / activate functions
    */
    
    /**
     * Spawn callback for DeadGoombas. They simply disappear after 21 steps.
     * 
     * @param {DeadGoomba} thing
     */
    function spawnDeadGoomba(thing) {
        thing.EightBitter.TimeHandler.addEvent(
            FullScreenMario.prototype.killNormal, 21, thing
        );
    }
    
    /**
     * Spawn callback for HammerBros. Gravity is reduced, and the hammer and
     * jump event intervals are started. The cyclical movement counter is set to
     * 0.
     * 
     * @param {HammerBro} thing
     */
    function spawnHammerBro(thing) {
        thing.counter = 0;
        thing.gravity = thing.EightBitter.MapScreener.gravity / 2.1;
        thing.EightBitter.TimeHandler.addEvent(
            animateThrowingHammer, 35, thing, 7
        );
        thing.EightBitter.TimeHandler.addEventInterval(
            animateJump, 140, Infinity, thing
        );
    }
    
    /** 
     * Spawn callback for Bowsers. The cyclical movement counter is set to 0 and
     * the firing and jumping event intervals are started. If it also specifies 
     * a throwing interval, that's started too.
     * 
     * @param {Bowser} thing
     */
    function spawnBowser(thing) {
        var i;
        
        thing.counter = 0;
        thing.deathcount = 0;
        
        for (i = 0; i < thing.fireTimes.length; i += 1) {
            thing.EightBitter.TimeHandler.addEventInterval(
                thing.EightBitter.animateBowserFire,
                thing.fireTimes[i],
                Infinity, 
                thing
            );
        }
        
        for (i = 0; i < thing.jumpTimes.length; i += 1) {
            thing.EightBitter.TimeHandler.addEventInterval(
                thing.EightBitter.animateBowserJump,
                thing.jumpTimes[i],
                Infinity, 
                thing
            );
        }
        
        if (thing.throwing) {
            for (i = 0; i < thing.throwAmount; i += 1) {
                thing.EightBitter.TimeHandler.addEvent(function () {
                    thing.EightBitter.TimeHandler.addEventInterval(
                        thing.EightBitter.animateBowserThrow,
                        thing.throwPeriod,
                        Infinity, 
                        thing
                    );
                }, thing.throwDelay + i * thing.throwBetween);
            }
        }
    }
    
    /**
     * Spawn callback for Piranhas. The movement counter and direction are
     * reset, and if the Piranha is on a pipe, it has a reduced height (6).
     * 
     * @param {Piranha} thing
     */
    function spawnPiranha(thing) {
        thing.counter = 0;
        thing.direction = thing.EightBitter.unitsize / -40;
        
        if (thing.onPipe) {
            var bottom = thing.bottom;
            
            thing.EightBitter.setHeight(thing, 6, true, true);
            
            thing.EightBitter.setBottom(thing, bottom);
        }
    }
    
    /**
     * Spawn callback for Bloopers. Its squeeze and movement counters are set to
     * 0.
     * 
     * @param {Blooper} thing
     */
    function spawnBlooper(thing) {
        thing.squeeze = 0;
        thing.counter = 0;
    }
    
    /**
     * Spawn callback for Podoboos. The jumping interval is set to the Thing's
     * frequency.
     * 
     * @param {Podoboo} thing
     */
    function spawnPodoboo(thing) {
        thing.EightBitter.TimeHandler.addEventInterval(
            thing.EightBitter.animatePodobooJumpUp,
            thing.frequency,
            Infinity,
            thing
        );
    }
    
    /**
     * Spawn callback for Lakitus. These are only allowed to exist if there 
     * isn't already one registered in the MapScreener. If there isn't, it is
     * registered and its throwing interval is scheduled.
     * 
     * @param {Lakitu} thing
     */
    function spawnLakitu(thing) {
        if (
            thing.EightBitter.isThingAlive(
                thing.EightBitter.MapScreener.lakitu
            )
        ) {
            thing.EightBitter.killNormal(thing);
            return;
        }
        thing.EightBitter.MapScreener.lakitu = thing;
        
        thing.EightBitter.TimeHandler.addEventInterval(
            thing.EightBitter.animateLakituThrowingSpiny, 140, Infinity, thing
        );
    }
    
    /**
     * Spawning callback for Cannons. Unless specified by the noBullets flag,
     * the firing interval is set to the Thing's frequency.
     * 
     * @param {Cannon} thing
     */
    function spawnCannon(thing) {
        if (!thing.noBullets) {
            thing.EightBitter.TimeHandler.addEventInterval(
                thing.EightBitter.animateCannonFiring,
                thing.frequency,
                thing.frequency,
                thing
            );
        }
    }
    
    /**
     * Spawning callback for CastleBlocks. If the Thing has fireballs, an Array
     * of them are made and animated to tick around the block like a clock, set
     * by the thing's speed and direction.
     * 
     * @param {CastleBlock} thing
     */
    function spawnCastleBlock(thing) {
        if (!thing.fireballs) {
            return;
        }
        
        var balls = [],
            i;
        
        for (i = 0; i < thing.fireballs; i += 1) {
            balls.push(thing.EightBitter.addThing("CastleFireball"));
            thing.EightBitter.setMidObj(balls[i], thing);
        }
        
        if (thing.speed >= 0) {
            thing.dt = 0.07;
            thing.angle = 0.25;
        } else {
            thing.dt = -0.07;
            thing.angle = -0.25;
        }
        
        if (!thing.direction) {
            thing.direction = -1;
        }
        
        thing.EightBitter.TimeHandler.addEventInterval(
            thing.EightBitter.animateCastleBlock,
            Math.round(7 / Math.abs(thing.speed)),
            Infinity,
            thing,
            balls
        );
    }
    
    /**
     * Spawning callback for floating Things, such as Koopas and Platforms. The
     * Thing's begin and end attributes are set relative to the MapScreener's
     * floor, so its movement can handle cycling between the two.
     * 
     * @param {Thing} thing
     */
    function spawnMoveFloating(thing) {
        // Make sure thing.begin <= thing.end
        thing.EightBitter.setMovementEndpoints(thing);
        
        // Make thing.begin and thing.end relative to the area's floor
        thing.begin = (
            thing.EightBitter.MapScreener.floor 
            * thing.EightBitter.unitsize - thing.begin
        );
        thing.end = (
            thing.EightBitter.MapScreener.floor
            * thing.EightBitter.unitsize - thing.end
        );
    }
    
    /**
     * Spawning callback for sliding Things, such as Platforms. The Thing's 
     * begin and end attributes do not need to be relative to anything.
     * 
     * @param {Thing} thing
     */
    function spawnMoveSliding(thing) {
        // Make sure thing.begin <= thing.end
        thing.EightBitter.setMovementEndpoints(thing);
    }
    
    /**
     * Spawning callback for a Platform that's a part of a Scale. ???
     * 
     * @param {Platform} thing
     */
    function spawnScalePlatform(thing) {
        var collection = thing.collection,
            ownKey = thing.collectionKey === "platformLeft" ? "Left" : "Right",
            partnerKey = ownKey === "Left" ? "Right": "Left";
        
        thing.partners = {
            "ownString": collection["string" + ownKey],
            "partnerString": collection["string" + partnerKey],
            "partnerPlatform": collection["platform" + partnerKey]
        };
    }
    
    /**
     * Generator callback to create a random CheepCheep. The spawn is given a
     * random x-velocity, is placed at a random point just below the screen, and
     * is oriented towards the player.
     * 
     * @param {EightBittr} EightBitter
     */
    function spawnRandomCheep(EightBitter) {
        var spawn;
        
        if (!EightBitter.MapScreener.spawningCheeps) {
            return true;
        }
        
        spawn = EightBitter.ObjectMaker.make("CheepCheep", {
            "flying": true,
            "xvel": EightBitter.NumberMaker.random() 
                * EightBitter.unitsize * 1.4,
            "yvel": EightBitter.unitsize * -1.4
        });
        
        EightBitter.addThing(
            spawn,
            EightBitter.NumberMaker.random()
                * EightBitter.MapScreener.width,
            EightBitter.MapScreener.height
        );
        
        if (spawn.left < EightBitter.MapScreener.width / 2) {
            EightBitter.flipHoriz(spawn);
        } else {
            spawn.xvel *= -1;
        }
    }
    
    /**
     * Generator callback to create a BulleBill. The spawn moves horizontally
     * at a constant rate towards the left side of the bill, and is placed at a
     * random point to the right side of the screen.
     * 
     * @param {EightBittr} EightBitter
     */
    function spawnRandomBulletBill(EightBitter) {
        var spawn;
        
        if (!EightBitter.MapScreener.spawningBulletBills) {
            return true;
        }
        
        spawn = EightBitter.ObjectMaker.make("BulletBill");
        spawn.direction = spawn.moveleft = true;
        spawn.xvel *= -1;
        EightBitter.flipHoriz(spawn);
        
        EightBitter.addThing(
            spawn,
            EightBitter.MapScreener.width,
            Math.floor(
                EightBitter.NumberMaker.randomIntWithin(
                    0,
                    EightBitter.MapScreener.floor
                ) / 8
            ) * 8 * EightBitter.unitsize
        );
    }
    
    /**
     * Spawns a CustomText by killing it and placing the contents of its texts
     * member variable. These are written with a determined amount of spacing
     * between them, as if by a typewriter.
     * 
     * @param {CustomText} thing
     */
    function spawnCustomText(thing) {
        var top = thing.top,
            texts = thing.texts,
            attributes = thing.textAttributes,
            spacingHorizontal = thing.spacingHorizontal * thing.EightBitter.unitsize,
            spacingVertical = thing.spacingVertical * thing.EightBitter.unitsize,
            spacingVerticalBlank = thing.spacingVerticalBlank * thing.EightBitter.unitsize,
            children = thing.children = [],
            left, text, letter, textThing, i, j;
        
        for (i = 0; i < texts.length; i += 1) {
            if (!texts[i]) {
                top += spacingVerticalBlank;
                continue;
            }
            
            text = texts[i].text;
            
            if (texts[i].offset) {
                left = (
                    thing.left
                    + texts[i].offset * thing.EightBitter.unitsize
                );
            } else {
                left = thing.left;
            }
            
            for (j = 0; j < text.length; j += 1) {
                letter = text[j];
                
                if (
                    thing.EightBitter.customTextMappings.hasOwnProperty(
                        letter
                    )
                ) {
                    letter = thing.EightBitter.customTextMappings[letter];
                }
                letter = "Text" + thing.size + letter;
                
                textThing = thing.EightBitter.ObjectMaker.make(
                    letter, attributes
                );
                textThing.EightBitter.addThing(textThing, left, top);
                children.push(textThing);
                
                left += textThing.width * thing.EightBitter.unitsize;
                left += spacingHorizontal;
            }
            top += spacingVertical;
        }
        
        thing.EightBitter.killNormal(thing);
    }
    
    /**
     * Spawning callback for generic detectors, activated as soon as they are 
     * placed. The Thing's activate trigger is called, then it is killed.
     * 
     * @param {Detector} thing
     */
    function spawnDetector(thing) {
        thing.activate(thing);
        thing.EightBitter.killNormal(thing);
    }
    
    /**
     * Spawning callback for ScrollBlockers. If the Thing is too the right of 
     * the visible viewframe, it should limit scrolling when triggered.
     * 
     * @param {ScrollBlocker} thing
     */
    function spawnScrollBlocker(thing) {
        if (thing.EightBitter.MapScreener.width < thing.right) {
            thing.setEdge = true;
        }
    }
    
    /** 
     * Used by Things in a collection to register themselves as a part of their
     * container collection Object. This is called by onThingMake, so they're 
     * immediately put in the collection and have it as a member variable.
     * 
     * @param {Object} collection   The collection Object shared by all members
     *                              of it. It should be automatically generated.
     * @param {Thing} thing   A member of the collection being spawned.
     * @remarks This should be bound in prethings as ".bind(scope, collection)"
     */
    function spawnCollectionComponent(collection, thing) {
        thing.collection = collection;
        collection[thing.collectionName] = thing;
    }
    
    /** 
     * Used by Things in a collection to get direct references to other Things
     * ("partners") in that collection. This is called by onThingAdd, so it's
     * always after spawnCollectionComponent (which is by onThingMake).     
     * 
     * @param {Object} collection   The collection Object shared by all members
     *                              of it. It should be automatically generated.
     * @param {Thing} thing   A member of the collection being spawned.
     * @remarks This should be bound in prethings as ".bind(scope, collection)"
     */
    function spawnCollectionPartner(collection, thing) {
        var partnerNames = thing.collectionPartnerNames,
            partners = thing.partners = {},
            collection = thing.collection,
            name;
        
        for (name in partnerNames) {
            if (partnerNames.hasOwnProperty(name)) {
                thing.partners[name] = collection[partnerNames[name]];
            }
        }
    }
    
    /**
     * Spawning callback for RandomSpawner Things, which generate a set of 
     * commands using the WorldSeeder to be piped into the MapsHandlr, then 
     * spawn the immediate area.
     * 
     * @param {RandomSpawner} thing
     */
    function spawnRandomSpawner(thing) {
        var EightBitter = thing.EightBitter,
            left = (
                (thing.left + EightBitter.MapScreener.left) 
                / EightBitter.unitsize
            );
        
        EightBitter.WorldSeeder.clearGeneratedCommands();
        EightBitter.WorldSeeder.generateFull({
            "title": thing.randomization,
            "top": thing.randomTop,
            "right": left + thing.randomWidth,
            "bottom": thing.randomBottom,
            "left": left
        });
        EightBitter.WorldSeeder.runGeneratedCommands();
        
        EightBitter.MapsHandler.spawnMap(
            "xInc",
            EightBitter.QuadsKeeper.top / EightBitter.unitsize,
            EightBitter.QuadsKeeper.right / EightBitter.unitsize,
            EightBitter.QuadsKeeper.bottom / EightBitter.unitsize,
            EightBitter.QuadsKeeper.left / EightBitter.unitsize
        );
    }
    
    /**
     * Activation callback for starting spawnRandomCheep on an interval.
     * MapScreener is notified that spawningCheeps is true.
     * 
     * @param {Detector} thing
     */
    function activateCheepsStart(thing) {
        thing.EightBitter.MapScreener.spawningCheeps = true;
        thing.EightBitter.TimeHandler.addEventInterval(
            spawnRandomCheep, 21, Infinity, thing.EightBitter
        );
    }
    
    /**
     * Activation callback to stop spawning CheepCheeps. MapScreener is notified
     * that spawningCheeps is false.
     * 
     * @param {Detector} thing
     */
    function activateCheepsStop(thing) {
        thing.EightBitter.MapScreener.spawningCheeps = false;
    }
    
    /**
     * Activation callback for starting spawnRandomBulletBill on an interval.
     * MapScreener is notified that spawningBulletBills is true.
     * 
     * @param {Detector} thing
     */
    function activateBulletBillsStart(thing) {
        thing.EightBitter.MapScreener.spawningBulletBills = true;
        thing.EightBitter.TimeHandler.addEventInterval(
            spawnRandomBulletBill, 210, Infinity, thing.EightBitter
        );
    }
    
    /**
     * Activation callback to stop spawning BulletBills. MapScreener is notified
     * that spawningBulletBills is false.
     * 
     * @param {Detector} thing
     */
    function activateBulletBillsStop(thing) {
        thing.EightBitter.MapScreener.spawningBulletBills = false;
    }
    
    /**
     * Activation callback to tell the area's Lakitu, if it exists, to start 
     * fleeing the scene.
     * 
     * @param {Detector} thing
     */
    function activateLakituStop(thing) {
        var lakitu = thing.EightBitter.MapScreener.lakitu;
        
        if (!lakitu) {
            return;
        }
        
        lakitu.fleeing = true;
        lakitu.movement = thing.EightBitter.moveLakituFleeing;
    }
    
    /**
     * Activation callback for a warp world area, triggered by the player 
     * touching a collider on top of it. Piranhas disappear and texts are
     * revealed.
     * 
     * @param {Thing} player
     * @param {DetectCollision} other
     */
    function activateWarpWorld(thing, other) {
        var collection = other.collection,
            key = 0, 
            keyString, scenery, texts, j;
        
        if (!thing.player) {
            return;
        }
        
        texts = collection["Welcomer"].children;
        for (j = 0; j < texts.length; j += 1) {
            if (texts[j].title !== "TextSpace") {
                texts[j].hidden = false;
            }
        }
        
        while (true) {
            keyString = key + "-Text";
            if (!collection.hasOwnProperty(keyString)) {
                break;
            }
            
            texts = collection[keyString].children;
            for (j = 0; j < texts.length; j += 1) {
                if (texts[j].title !== "TextSpace") {
                    texts[j].hidden = false;
                }
            }
            
            thing.EightBitter.killNormal(collection[key + "-Piranha"]);
            
            key += 1;
        }
    }
    
    /**
     * Activation callback for when the player lands on a RestingStone. The 
     * stone "appears" (via opacity), the regular theme plays if it wasn't 
     * already, and the RestingStone waits to kill itself when the player isn't
     * touching it.
     * 
     * @param {RestingStone} thing
     * @param {Player} other
     */
    function activateRestingStone(thing, other) {
        if (thing.activated) {
            return;
        }
        
        thing.activated = true;
        thing.opacity = 1;
        thing.EightBitter.AudioPlayer.playTheme();
        
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            if (other.resting !== thing) {
                thing.EightBitter.killNormal(thing);
                return true;
            }
        }, 1, Infinity);
    }
    
    /**
     * Generic activation callback for DetectWindow Things. This is typically 
     * set as a .movement Function, so it waits until the calling Thing is 
     * within the MapScreener's area to call the activate Function and kill 
     * itself.
     * 
     * @param {DetectWindow} thing
     */
    function activateWindowDetector(thing) {
        if (thing.EightBitter.MapScreener.right 
            - thing.EightBitter.MapScreener.left < thing.left) {
            return;
        }
        
        thing.activate(thing);
        thing.EightBitter.killNormal(thing);
    }
    
    /**
     * Activation callback for ScrollBlocker Things. These are WindowDetectors
     * that set MapScreener.canscroll to false when they're triggered. If the
     * latest scrollWindow call pushed it too far to the left, it scrolls back
     * the other way.
     * 
     * @param {ScrollBlocker} thing
     */
    function activateScrollBlocker(thing) {
        var dx = thing.EightBitter.MapScreener.width - thing.left;
       
        thing.EightBitter.MapScreener.canscroll = false;
        if (thing.setEdge && dx > 0) {
            thing.EightBitter.scrollWindow(-dx);
        }
    }
    
    /**
     * Activation callback for ScrollBlocker Things. These are DetectCollision
     * that set MapScreener.canscroll to true when they're triggered. 
     * 
     * @param {DetectCollision} thing
     */
    function activateScrollEnabler(thing) {
        thing.EightBitter.MapScreener.canscroll = true;
    }
    
    /**
     * Activates the "before" component of a stretchable section. The creation
     * commands of the section are loaded onto the screen as is and a 
     * DetectWindow is added to their immediate right that will trigger the 
     * equivalent activateSectionStretch.
     * 
     * @param {DetectWindow} thing
     */
    function activateSectionBefore(thing) {
        var EightBitter = thing.EightBitter,
            MapsCreator = EightBitter.MapsCreator,
            MapScreener = EightBitter.MapScreener,
            MapsHandler = EightBitter.MapsHandler,
            area = MapsHandler.getArea(),
            map = MapsHandler.getMap(),
            prethings = MapsHandler.getPreThings(),
            section = area.sections[thing.section || 0],
            left = (thing.left + MapScreener.left) / EightBitter.unitsize,
            before = section.before ? section.before.creation : undefined,
            command, i;
        
        // If there is a before, parse each command into the prethings array
        if (before) {
            for (i = 0; i < before.length; i += 1) {
                // A copy of the command must be used to not modify the original 
                command = EightBitter.proliferate({}, before[i]);
                
                // The command's x must be shifted by the thing's placement
                if (!command.x) {
                    command.x = left;
                } else {
                    command.x += left;
                }
                
                // For Platforms that slide around, start and end are dynamic
                if (command.sliding) {
                    command.begin += left;
                    command.end += left;
                }
                
                MapsCreator.analyzePreSwitch(command, prethings, area, map);
            }
        }
            
        // Add a prething at the end of all this to trigger the stretch part
        command = {
            "thing": "DetectWindow", 
            "x": left + (before ? section.before.width : 0), "y": 0, 
            "activate": EightBitter.activateSectionStretch,
            "section": thing.section || 0
        };
        
        MapsCreator.analyzePreSwitch(command, prethings, area, map);
        
        // Spawn new Things that should be placed for being nearby
        MapsHandler.spawnMap(
            "xInc",
            MapScreener.top / EightBitter.unitsize,
            (MapScreener.left + EightBitter.QuadsKeeper.right) / EightBitter.unitsize,
            MapScreener.bottom / EightBitter.unitsize,
            left
        );
    }
    
    /**
     * Activates the "stretch" component of a stretchable section. The creation
     * commands of the section are loaded onto the screen and have their widths
     * set to take up the entire width of the screen. A DetectWindow is added
     * to their immediate right that will trigger the equivalent
     * activateSectionAfter.
     * 
     * @param {DetectWindow} thing
     */
    function activateSectionStretch(thing) {
        var EightBitter = thing.EightBitter,
            MapsCreator = EightBitter.MapsCreator,
            MapScreener = EightBitter.MapScreener,
            MapsHandler = EightBitter.MapsHandler,
            area = MapsHandler.getArea(),
            map = MapsHandler.getMap(),
            prethings = MapsHandler.getPreThings(),
            section = area.sections[thing.section || 0],
            stretch = section.stretch ? section.stretch.creation : undefined,
            left = (thing.left + MapScreener.left) / EightBitter.unitsize,
            width = MapScreener.width / EightBitter.unitsize,
            command, i;
        
        // If there is a stretch, parse each command into the current prethings array
        if (stretch) {
            for (i = 0; i < stretch.length; i += 1) {
                // A copy of the command must be used, so the original isn't modified
                command = EightBitter.proliferate({}, stretch[i]);
                command.x = left;
                
                // "stretch" the command by making its width equal to the screen
                command.width = width;
                MapsCreator.analyzePreSwitch(command, prethings, area, map);
            }
            
            // Add a prething at the end of all this to trigger the after part
            command = {
                "thing": "DetectWindow", 
                "x": left + width, 
                "y": 0,
                "activate": EightBitter.activateSectionAfter,
                "section": thing.section || 0
            };
            MapsCreator.analyzePreSwitch(command, prethings, area, map);
        }
        
        // Spawn the map, so new Things that should be placed will be spawned if nearby
        MapsHandler.spawnMap(
            "xInc",
            MapScreener.top / EightBitter.unitsize,
            left + (MapScreener.width / EightBitter.unitsize),
            MapScreener.bottom / EightBitter.unitsize,
            left
        );
    }
    
    /**
     * Activates the "after" component of a stretchable sectin. The creation
     * commands of the stretch are loaded onto the screen as is.
     * 
     * @param {DetectWindow} thing
     */
    function activateSectionAfter(thing) {
        // Since the section was passed, do the rest of things normally
        var EightBitter = thing.EightBitter,
            MapsCreator = EightBitter.MapsCreator,
            MapScreener = EightBitter.MapScreener,
            MapsHandler = EightBitter.MapsHandler,
            area = MapsHandler.getArea(),
            map = MapsHandler.getMap(),
            prethings = MapsHandler.getPreThings(),
            section = area.sections[thing.section || 0],
            left = (thing.left + MapScreener.left) / EightBitter.unitsize,
            after = section.after ? section.after.creation : undefined,
            command, i;
        
        // If there is an after, parse each command into the current prethings array
        if (after) {
            for (i = 0; i < after.length; i += 1) {
                // A copy of the command must be used, so the original isn't modified
                command = EightBitter.proliferate({}, after[i]);
                
                // The command's x-location must be shifted by the thing's placement
                if (!command.x) {
                    command.x = left;
                } else {
                    command.x += left;
                }
                
                // For Platforms that slide around, start and end are dynamic
                if (command.sliding) {
                    command.begin += left;
                    command.end += left;
                }
                
                MapsCreator.analyzePreSwitch(command, prethings, area, map);
            }
        }
        
        // Spawn the map, so new Things that should be placed will be spawned if nearby
        MapsHandler.spawnMap(
            "xInc",
            MapScreener.top / EightBitter.unitsize,
            left + (MapScreener.right / EightBitter.unitsize),
            MapScreener.bottom / EightBitter.unitsize,
            left
        );
    }
    
    
    /* Collision functions
    */

    /**
     * Function generator for the generic hitCharacterSolid callback. This is 
     * used repeatedly by ThingHittr to generate separately optimized Functions
     * for different Thing types.
     * 
     * @return {Function}
     */
    function generateHitCharacterSolid() {
        /**
         * Generic callback for when a character touches a solid. Solids that 
         * "up" kill anything that didn't cause the up, but otherwise this will
         * normally involve the solid's collide callback being called and
         * under/undermid checks activating.
         * 
         * @param {Character} thing
         * @param {Solid} other
         */
        return function hitCharacterSolid(thing, other) {
            // "Up" solids are special (they kill things that aren't their .up)
            if (other.up && thing !== other.up) {
                return thing.EightBitter.collideCharacterSolidUp(thing, other);
            }
            
            other.collide(thing, other);
            
            // If a character is bumping into the bottom, call that
            if (thing.undermid) {
                if (thing.undermid.bottomBump) {
                    thing.undermid.bottomBump(thing.undermid, thing);
                }
            }
            else if (thing.under && thing.under.bottomBump) {
                thing.under.bottomBump(thing.under, thing);
            }
            
            // If the character is overlapping the solid, call that too
            if (
                thing.checkOverlaps 
                && thing.EightBitter.isCharacterOverlappingSolid(thing, other)
            ) {
                thing.EightBitter.markOverlap(thing, other);
            }
        };
    }

    /**
     * Function generator for the generic hitCharacterCharacter callback. This
     * is used repeatedly by ThingHittr to generate separately optimized 
     * Functions for different Thing types.
     * 
     * @return {Function}
     */
    function generateHitCharacterCharacter(thing, other) {
        /**
         * Generic callback for when a character touches another character. The
         * first Thing's collide callback is called unless it's a player, in 
         * which the other Thing's is.
         *  
         * @param {Character} thing
         * @param {Character} other
         */
        return function hitCharacterCharacter(thing, other) {
            // The player calls the other's collide function, such as playerStar
            if (thing.player) {
                if (other.collide) {
                    return other.collide(thing, other);
                }
            }
            // Otherwise just use thing's collide function
            else if (thing.collide) {
                thing.collide(other, thing);
            }
        };
    }
    
    /**
     * Collision callback used by most Items. The item's action callback will
     * be called only if the first Thing is a player.
     * 
     * @param {Thing} thing
     * @param {Item} other
     */
    function collideFriendly(thing, other) {
        if (thing.player) {
            if (!thing.EightBitter.isThingAlive(other)) {
                return;
            }
            if (other.action) {
                other.action(thing, other);
            }
            other.death(other);
        }
    }
    
    /**
     * General callback for when a character touches a solid. This mostly 
     * determines if the character is on top (it should rest on the solid), to
     * the side (it should shouldn't overlap), or undernearth (it also shouldn't
     * overlap).
     * 
     * @param {Character} thing
     * @param {Solid} other
     */
    function collideCharacterSolid(thing, other) {
        if (other.up === thing) {
            return;
        }
        
        // Character on top of solid
        if (thing.EightBitter.isCharacterOnSolid(thing, other)) {
            if (other.hidden && !other.collideHidden) {
                return;
            }
            
            if (thing.resting !== other) {
                thing.resting = other;
                if (thing.onResting) {
                    thing.onResting(thing, other);
                }
                if (other.onRestedUpon) {
                    other.onRestedUpon(other, thing);
                }
            }
        }
        // Solid on top of character
        else if (thing.EightBitter.isSolidOnCharacter(other, thing)) {
            var midx = thing.EightBitter.getMidX(thing);
            
            if (midx > other.left && midx < other.right) {
                thing.undermid = other;
            } else if (other.hidden && !other.collideHidden) {
                return;
            }
            
            if (!thing.under) {
                thing.under = [other];
            } else {
                thing.under.push(other);
            }
            
            if (thing.player) {
                thing.keys.jump = 0;
                thing.EightBitter.setTop(
                    thing, other.bottom - thing.toly + other.yvel
                );
            }
            
            thing.yvel = other.yvel;
        }
        
        if (other.hidden && !other.collideHidden) {
            return;
        }
        
        // Character bumping into the side of the solid
        if (
            thing.resting !== other
            && !thing.EightBitter.isCharacterBumpingSolid(thing, other)
            && !thing.EightBitter.isThingOnThing(thing, other)
            && !thing.EightBitter.isThingOnThing(other, thing) 
            && !thing.under
        ) {
            // Character to the left of the solid
            if (thing.right <= other.right) {
                thing.xvel = Math.min(thing.xvel, 0);
                thing.EightBitter.shiftHoriz(
                    thing,
                    Math.max(
                        other.left + thing.EightBitter.unitsize - thing.right,
                        thing.EightBitter.unitsize / -2
                    )
                );
            }
            // Character to the right of the solid
            else {
                thing.xvel = Math.max(thing.xvel, 0);
                thing.EightBitter.shiftHoriz(
                    thing,
                    Math.min(
                        other.right - thing.EightBitter.unitsize - thing.left,
                        thing.EightBitter.unitsize / 2
                    )
                );
            }
            
            // Non-players flip horizontally
            if (!thing.player) {
                if (!thing.noflip) {
                    thing.moveleft = !thing.moveleft;
                }
                // Some items require fancy versions (e.g. Shell)
                if (thing.group === "item") {
                    thing.collide(other, thing);
                }
            }
            // Players trigger other actions (e.g. Pipe's mapExitPipeHorizontal)
            else if (other.actionLeft) {
                thing.EightBitter.ModAttacher.fireEvent(
                    "onPlayerActionLeft", thing, other
                );
                other.actionLeft(thing, other, other.transport);
            }
        }
    }
    
    /**
     * Collision callback for a character hitting an "up" solid. If it has an
     * onCollideUp callback that is called; otherwise, it is killed.
     * 
     * @param {Character} thing
     * @param {Solid} other
     */
    function collideCharacterSolidUp(thing, other) {
        if (thing.onCollideUp) {
            thing.onCollideUp(thing, other);
        } else {
            thing.EightBitter.scoreOn(thing.scoreBelow, thing);
            thing.death(thing, 2);
        }
    }
    
    /**
     * Collision callback for an item hitting an "up" solid. Items just hop
     * and switch direction.
     * 
     * @param {Item} thing
     * @param {Solid} other
     */
    function collideUpItem(thing, other) {
        thing.EightBitter.animateCharacterHop(thing);
        thing.moveleft = thing.EightBitter.objectToLeft(thing, other);
    }
    
    /**
     * Collision callback for a floating coin being hit by an "up" solid. It is
     * animated, as if it were hit as the contents of a solid.
     * 
     * @param {Coin} thing
     * @param {Solid} other
     */
    function collideUpCoin(thing, other) {
        thing.blockparent = other;
        thing.animate(thing, other);
    }
    
    /**
     * Collision callback for a player hitting a regular Coin. The Coin
     * disappears but points and Coin totals are both increased, along with
     * the "Coin" sound being played.
     * 
     * @param {Player} thing
     * @param {Coin} other
     */
    function collideCoin(thing, other) {
        if (!thing.player) {
            return;
        }
        
        thing.EightBitter.AudioPlayer.play("Coin");
        thing.EightBitter.StatsHolder.increase("score", 200);
        thing.EightBitter.StatsHolder.increase("coins", 1);
        thing.EightBitter.killNormal(other);
    }
    
    /**
     * Collision callback for a player hitting a Star. The Star is killed, and
     * the playerStarUp trigger is called on the Thing.
     * 
     * @param {Player} thing
     * @param {Star} other
     */
    function collideStar(thing, other) {
        if (!thing.player || thing.star) {
            return;
        }
        
        thing.EightBitter.playerStarUp(thing);
        thing.EightBitter.ModAttacher.fireEvent("onCollideStar", thing, other);
    }
    
    /**
     * Collision callback for a character being hit by a fireball. It will
     * most likely be killed with an explosion unless it has the nofiredeath 
     * flag, in which case only the fireball dies.
     * 
     * @param {Character} thing
     * @param {Fireball} other
     */
    function collideFireball(thing, other) {
        if (
            !thing.EightBitter.isThingAlive(thing) 
            || thing.height < thing.EightBitter.unitsize
        ) {
            return;
        }
        
        if (thing.nofire) {
            if (thing.nofire > 1) {
                other.death(other);
            }
            return;
        }
        
        if (thing.nofiredeath) {
            thing.EightBitter.AudioPlayer.playLocal(
                "Bump", thing.EightBitter.getMidX(other)
            );
            thing.death(thing);
        } else {
            thing.EightBitter.AudioPlayer.playLocal(
                "Kick", thing.EightBitter.getMidX(other)
            );
            thing.death(thing, 2);
            thing.EightBitter.scoreOn(thing.scoreFire, thing);
        }
        
        other.death(other);
    }
    
    /**
     * Collision callback for hitting a CastleFireball. The character is killed
     * unless it has the star flag, in which case the CastleFireball is.
     * 
     * @param {Character} thing
     * @param {CastleFireball} other
     */
    function collideCastleFireball(thing, other) {
        if (thing.star) {
            other.death(other);
        } else {
            thing.death(thing);
        }
    }
    
    /**
     * Collision callback for when a character hits a Shell. This covers various
     * cases, such as deaths, side-to-side Shell collisions, player stomps, and
     * so on.
     * 
     * @param {Character} thing
     * @param {Shell} other
     */
    function collideShell(thing, other) {
        // If only one is a shell, it should be other, not thing
        if (thing.shell) {
            if (other.shell) {
                return thing.EightBitter.collideShellShell(thing, other);
            }
            return thing.EightBitter.collideShell(thing, other);
        }
        
        // Hitting a solid (e.g. wall) 
        if (thing.groupType === "Solid") {
            return thing.EightBitter.collideShellSolid(thing, other);
        }
        
        // Hitting the player
        if (thing.player) {
            return thing.EightBitter.collideShellPlayer(thing, other);
        }
        
        // Assume anything else to be an enemy, which only moving shells kill
        if (other.xvel) {
            thing.EightBitter.killFlip(thing);
            if (thing.shellspawn) {
                thing = thing.EightBitter.killSpawn(thing);
            }
            
            thing.EightBitter.AudioPlayer.play("Kick");
            thing.EightBitter.scoreOn(
                thing.EightBitter.findScore(other.enemyhitcount), thing
            );
            other.enemyhitcount += 1;
        } else {
            thing.moveleft = thing.EightBitter.objectToLeft(thing, other);
        }
    }
    
    /**
     * Collision callback for a solid being hit by a Shell. The Shell will 
     * bounce the opposition direction.
     * 
     * @param {Solid} thing
     * @param {Shell} other
     */
    function collideShellSolid(thing, other) {
        if (other.right < thing.right) {
            thing.EightBitter.AudioPlayer.playLocal("Bump", thing.left);
            thing.EightBitter.setRight(other, thing.left);
            other.xvel = -other.speed;
            other.moveleft = true;
        } else {
            thing.EightBitter.AudioPlayer.playLocal("Bump", thing.right);
            thing.EightBitter.setLeft(other, thing.right);
            other.xvel = other.speed;
            other.moveleft = false;
        }
    }
    
    /**
     * Collision callback for when the player hits a Shell. This covers all the
     * possible scenarios, and is much larger than common sense dictates.
     * 
     * @param {Player} thing
     * @param {Shell} other
     */
    function collideShellPlayer(thing, other) {
        var shelltoleft = thing.EightBitter.objectToLeft(other, thing),
            playerjump = thing.yvel > 0 && (
                thing.bottom <= other.top + thing.EightBitter.unitsize * 2
            );
        
        // Star players kill the shell no matter what
        if (thing.star) {
            thing.EightBitter.scorePlayerShell(thing, other);
            other.death(other, 2);
            return;
        }
        
        // If the shell is already being landed on by the player, see if it's
        // still being pushed to the side, or has reversed direction (is deadly)
        if (other.landing) {
            // Equal shelltoleft measurements: it's still being pushed
            if (other.shelltoleft === shelltoleft) {
                // Tepmorarily increase the landing count of the shell; if it is 
                // just being started, that counts as the score hit
                other.landing += 1;
                if (other.landing === 1) {
                    thing.EightBitter.scorePlayerShell(thing, other);
                }
                thing.EightBitter.TimeHandler.addEvent(function (other) {
                    other.landing -= 1;
                }, 2, other);
            }
            // Different shelltoleft measurements: it's deadly
            else {
                thing.death(thing);
            }
            return;
        }
        
        // If the shell is being kicked by the player, either by hitting a still
        // shell or jumping onto an already moving one
        if (other.xvel === 0 || playerjump) {
            // Reset any signs of peeking from the shell
            other.counting = 0;
            
            // If the shell is standing still, make it move
            if (other.xvel === 0) {
                thing.EightBitter.AudioPlayer.play("Kick");
                thing.EightBitter.scorePlayerShell(thing, other);
                if (shelltoleft) {
                    other.moveleft = true;
                    other.xvel = -other.speed;
                } else {
                    other.moveleft = false;
                    other.xvel = other.speed;
                }
                other.hitcount += 1;
                thing.EightBitter.TimeHandler.addEvent(function (other) {
                    other.hitcount -= 1;
                }, 2, other);
            }
            // Otherwise it was moving, but should now be still
            else {
                other.xvel = 0;
            }
            
            if (other.peeking) {
                other.peeking = 0;
                thing.EightBitter.removeClass(other, "peeking");
                other.height -= thing.EightBitter.unitsize / 8;
                thing.EightBitter.updateSize(other);
            }
            
            // If the player is landing on the shell (with movements and xvels
            // already set), the player should then jump up a bit
            if (playerjump) {
                thing.EightBitter.AudioPlayer.play("Kick");
                
                if (!other.xvel) {
                    thing.EightBitter.jumpEnemy(thing, other);
                    thing.yvel *= 2;
                    // thing.EightBitter.scorePlayerShell(thing, other);
                    thing.EightBitter.setBottom(
                        thing, other.top - thing.EightBitter.unitsize, true
                    );
                } else {
                    // thing.EightBitter.scorePlayerShell(thing, other);
                }
                
                other.landing += 1;
                other.shelltoleft = shelltoleft;
                thing.EightBitter.TimeHandler.addEvent(function (other) {
                    other.landing -= 1;
                }, 2, other);
            }
        } 
        // Since the player is touching the shell normally, that's a death if
        // the shell isn't moving away
        else {
            if (!other.hitcount && (
                (shelltoleft && other.xvel > 0) 
                || (!shelltoleft && other.xvel < 0)
            )) {
                thing.death(thing);
            }
        }
    }
    
    /**
     * Collision callback for two Shells. If one is moving, it kills the other;
     * otherwise, they bounce off.
     * 
     * @param {Shell} thing
     * @param {Shell} other
     */
    function collideShellShell(thing, other) {
        if (thing.xvel !== 0) {
            if (other.xvel !== 0) {
                var temp = thing.xvel;
                thing.xvel = other.xvel;
                other.xvel = temp;
                
                thing.EightBitter.shiftHoriz(thing, thing.xvel);
                thing.EightBitter.shiftHoriz(other, other.xvel);
            } else {
                thing.EightBitter.StatsHolder.increase("score", 500);
                other.death(other);
            }
        } else {
            thing.EightBitter.StatsHolder.increase("score", 500);
            thing.death(thing);
        }
    }
    
    /**
     * Collision callback for a general character hitting an enemy. This covers
     * many general cases, most of which involve a player and an enemy.
     * 
     * @param {Character} thing
     * @param {Enemy} other
     */
    function collideEnemy(thing, other) {
        // If either is a player, make it thing (not other)
        if (!thing.player && other.player) {
            return thing.EightBitter.collideEnemy(thing, other);
        }
        
        // Death: nothing happens
        if (
            !thing.EightBitter.isThingAlive(thing)
            || !thing.EightBitter.isThingAlive(other)
        ) {
            return;
        }
        
        // Items
        if (thing.group === "item") {
            if (thing.collidePrimary) {
                return thing.collide(other, thing);
            }
            return;
        }
        
        
        // For non-players, it's just to characters colliding: they bounce
        if (!thing.player) {
            thing.moveleft = thing.EightBitter.objectToLeft(thing, other);
            other.moveleft = !thing.moveleft;
            return;
        }
        
        // Player landing on top of an enemy
        if (
            (thing.star && !other.nostar)
            || (
                !thing.EightBitter.MapScreener.underwater
                && (!other.deadly && isThingOnThing(thing, other))
            )
        ) {
            // Enforces toly (not touching means stop)
            if (thing.EightBitter.isCharacterAboveEnemy(thing, other)) {
                return;
            }
            
            // A star player just kills the enemy, no matter what
            if (thing.star) {
                other.nocollide = true;
                other.death(other, 2);
                thing.EightBitter.scoreOn(other.scoreStar, other);
                thing.EightBitter.AudioPlayer.play("Kick");
            }
            // A non-star player kills the enemy with spawn, and hops
            else {
                thing.EightBitter.setBottom(
                    thing, 
                    Math.min(
                        thing.bottom, other.top + thing.EightBitter.unitsize
                    )
                );
                thing.EightBitter.TimeHandler.addEvent(
                    jumpEnemy, 0, thing, other
                );
                
                other.death(other, thing.star ? 2 : 0);
                
                thing.EightBitter.addClass(thing, "hopping");
                thing.EightBitter.removeClasses(
                    thing, "running skidding jumping one two three"
                );
                thing.hopping = true;
                
                if (thing.power === 1) {
                    thing.EightBitter.setPlayerSizeSmall(thing); 
                }
            }
        }
        // Player being landed on by an enemy
        else if (!thing.EightBitter.isCharacterAboveEnemy(thing, other)) {
            thing.death(thing);
        }
    }
    
    
    /**
     * Collision callback for a character bumping into the bottom of a solid.
     * Only players cause the solid to jump and be considered "up", though large
     * players will kill solids that have the breakable flag on. If the solid 
     * does jump and has contents, they emerge.
     * 
     * @param {Solid} thing
     * @param {Character} other
     */
    function collideBottomBrick(thing, other) {
        if (other.solid && !thing.solid) {
            return thing.EightBitter.collideBottomBrick(other, thing);
        }
        
        if (thing.up || !other.player) {
            return;
        }
        
        thing.EightBitter.AudioPlayer.play("Bump");
        
        if (thing.used) {
            return;
        }
        
        thing.up = other;
        if (other.power > 1 && thing.breakable && !thing.contents) {
            thing.EightBitter.TimeHandler.addEvent(
                thing.EightBitter.killBrick, 2, thing, other
            );
            return;
        }
        
        thing.EightBitter.animateSolidBump(thing);
        
        if (thing.contents) {
            thing.EightBitter.TimeHandler.addEvent(function () {
                var output = thing.EightBitter.animateSolidContents(thing, other);
                
                if (thing.contents !== "Coin") {
                    thing.EightBitter.animateBlockBecomesUsed(thing);
                } else {
                    if (thing.lastcoin) {
                        thing.EightBitter.animateBlockBecomesUsed(thing);
                    } else {
                        thing.EightBitter.TimeHandler.addEvent(function () {
                            thing.lastcoin = true;
                        }, 245);
                    }
                }
            }, 7);
        }
    }
    
    /**
     * Collision callback for the player hitting the bottom of a Block. Unused
     * Blocks have their contents emerge (by default a Coin), while used Blocks
     * just have a small bump noise played.
     * 
     * @param {Player} thing
     * @param {Solid} other
     */
    function collideBottomBlock(thing, other) {
        if (other.solid && !thing.solid) {
            return thing.EightBitter.collideBottomBlock(other, thing);
        }
        
        if (thing.up || !other.player) {
            return;
        }
        
        if (thing.used) {
            thing.EightBitter.AudioPlayer.play("Bump");
            return;
        }
        
        thing.used = true;
        thing.hidden = false;
        thing.up = other;
        
        thing.EightBitter.animateSolidBump(thing);
        thing.EightBitter.removeClass(thing, "hidden");
        thing.EightBitter.switchClass(thing, "unused", "used");
        thing.EightBitter.TimeHandler.addEvent(
            thing.EightBitter.animateSolidContents, 7, thing, other
        );
    }
    
    /**
     * Collision callback for Vines. The player becomes "attached" to the Vine
     * and starts climbing it, with movement set to movePlayerVine.
     * 
     * @param {Player} thing
     * @param {Solid} other
     */
    function collideVine(thing, other) {
        if (!thing.player || thing.attachedSolid || thing.climbing) {
            return;
        }
        
        if (thing.bottom > other.bottom + thing.EightBitter.unitsize * 2) {
            return;
        }
        
        other.attachedCharacter = thing;
        thing.attachedSolid = other;
        
        thing.nofall = true;
        thing.checkOverlaps = false;
        thing.resting = undefined;
        
        // To the left of the vine
        if (thing.right < other.right) {
            thing.lookleft = false;
            thing.moveleft = false;
            thing.attachedDirection = -1;
            thing.EightBitter.unflipHoriz(thing);
        }
        // To the right of the vine
        else {
            thing.lookleft = true;
            thing.moveleft = true;
            thing.attachedDirection = 1;
            thing.EightBitter.flipHoriz(thing);
        }
        
        thing.EightBitter.thingPauseVelocity(thing);
        thing.EightBitter.addClass(thing, "climbing");
        thing.EightBitter.removeClasses(
            thing, "running", "jumping", "skidding"
        );
        
        thing.EightBitter.TimeHandler.cancelClassCycle(thing, "running");
        thing.EightBitter.TimeHandler.addClassCycle(
            thing, ["one", "two"], "climbing"
        );
        
        thing.attachedLeft = !thing.EightBitter.objectToLeft(thing, other);
        thing.attachedOff = thing.attachedLeft ? 1 : -1;
        
        thing.movement = thing.EightBitter.movePlayerVine;
    }
    
    /**
     * Collision callback for a character hitting a Springboard. This acts as a
     * normal solid to non-players, and only acts as a spring if the player is
     * above it and moving down.
     * 
     * @param {Character} thing
     * @param {Springboard} other
     */
    function collideSpringboard(thing, other) {
        if (
            thing.player && thing.yvel >= 0 && !other.tension
            && thing.EightBitter.isCharacterOnSolid(thing, other)
        ) {
            other.tension = other.tensionSave = Math.max(
                thing.yvel * 0.77,
                thing.EightBitter.unitsize
            );
            thing.movement = thing.EightBitter.movePlayerSpringboardDown;
            thing.spring = other;
            thing.xvel /= 2.8;
        } else {
            thing.EightBitter.collideCharacterSolid(thing, other);
        }
    }
    
    /**
     * Collision callback for a character hitting a WaterBlocker on the top of
     * an underwater area. It simply stops them from moving up.
     * 
     * @param {Character} thing
     * @param {WaterBlocker} other
     */
    function collideWaterBlocker(thing, other) {
        thing.EightBitter.collideCharacterSolid(thing, other);
    }
    
    /**
     * Collision callback for the DetectCollision on a flagpole at the end of an
     * EndOutsideCastle. The player becomes invincible and starts sliding down
     * the flagpole, while all other Things are killed. A score calculated by
     * scorePlayerFlag is shown at the base of the pole and works its way up. 
     * The collideFlagBottom callback will be fired when the player reaches the 
     * bottom. 
     * 
     * @param {Player} thing
     * @param {DetectCollision} other
     */
    function collideFlagpole(thing, other) {
        if (thing.bottom > other.bottom) {
            return;
        }
        
        var height = (other.bottom - thing.bottom) | 0,
            scoreAmount = scorePlayerFlag(
                thing, height / thing.EightBitter.unitsize
            ),
            scoreThing = thing.EightBitter.ObjectMaker.make(
                "Text" + scoreAmount
            );
        
        // This is a cutscene. No movement, no deaths, no scrolling.
        thing.star = true;
        thing.nocollidechar = true;
        thing.EightBitter.MapScreener.nokeys = true;
        thing.EightBitter.MapScreener.notime = true;
        thing.EightBitter.MapScreener.canscroll = false;
        
        // Kill all other characters and pause the player next to the pole
        thing.EightBitter.killNPCs();
        thing.EightBitter.thingPauseVelocity(thing);
        thing.EightBitter.setRight(
            thing, other.left + thing.EightBitter.unitsize * 3
        );
        thing.EightBitter.killNormal(other);
        
        // The player is now climbing down the pole
        thing.EightBitter.removeClasses(thing, "running jumping skidding");
        thing.EightBitter.addClass(thing, "climbing animated");
        thing.EightBitter.TimeHandler.addClassCycle(
            thing, ["one", "two"], "climbing"
        );
        
        // Animate the Flag to the base of the pole
        thing.EightBitter.TimeHandler.addEventInterval(
            thing.EightBitter.shiftVert, 
            1,
            64,
            other.collection.Flag, 
            thing.EightBitter.unitsize
        );
        
        // Add a ScoreText element at the bottom of the flag and animate it up
        thing.EightBitter.addThing(scoreThing, other.right, other.bottom);
        thing.EightBitter.TimeHandler.addEventInterval(
            thing.EightBitter.shiftVert, 
            1,
            72,
            scoreThing, 
            -thing.EightBitter.unitsize
        );
        thing.EightBitter.TimeHandler.addEvent(
            thing.EightBitter.StatsHolder.increase, 72, "score", scoreAmount
        );
        
        // All audio stops, and the flagpole clip is played
        thing.EightBitter.AudioPlayer.clearAll();
        thing.EightBitter.AudioPlayer.clearTheme();
        thing.EightBitter.AudioPlayer.play("Flagpole");
        
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            // While the player hasn't reached the bottom yet, slide down
            if (thing.bottom < other.bottom) {
                thing.EightBitter.shiftVert(thing, thing.EightBitter.unitsize);
                return;
            }
            
            // If the flag hasn't reached it but the player has, don't move yet
            if ((other.collection.Flag.bottom | 0) < (other.bottom | 0)) {
                return;
            }
            
            // The player is done climbing: trigger the flag bottom collision
            thing.movement = false;
            thing.EightBitter.setBottom(thing, other.bottom);
            thing.EightBitter.TimeHandler.cancelClassCycle(
                thing, "climbing"
            );
            thing.EightBitter.TimeHandler.addEvent(function () {
                thing.EightBitter.collideFlagBottom(thing, other);
            }, 21);
            
            return true;
        }, 1, Infinity);
    }
    
    /**
     * Collision callback for when a player hits the bottom of a flagpole. It is
     * flipped horizontally, shifted to the other side of the pole, and the
     * animatePlayerOffPole callback is quickly timed.
     * 
     * @param {Player} thing
     * @param {Solid} other
     */
    function collideFlagBottom(thing, other) {
        thing.keys.run = 1;
        thing.maxspeed = thing.walkspeed;
        
        thing.EightBitter.flipHoriz(thing);
        thing.EightBitter.shiftHoriz(
            thing, (thing.width + 1) * thing.EightBitter.unitsize
        );
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.EightBitter.AudioPlayer.play("Stage Clear");
            thing.EightBitter.animatePlayerOffPole(thing, true);
        }, 14);
    }
    
    /**
     * Collision callback for the player hitting a CastleAxe. The player and
     * screen are paused for 140 steps (other callbacks should be animating
     * the custcene).
     * 
     * @param {Player} thing
     * @param {CastleAxe} other
     */
    function collideCastleAxe(thing, other) {
        if (!thing.EightBitter.isThingAlive(thing)) {
            return;
        }
        
        if (
            thing.right < other.left + other.EightBitter.unitsize
            || thing.bottom > other.bottom - other.EightBitter.unitsize
        ) {
            return;
        }
        
        thing.EightBitter.thingPauseVelocity(thing);
        thing.EightBitter.killNormal(other);
        thing.EightBitter.killNPCs();
        
        thing.EightBitter.AudioPlayer.clearTheme();
        thing.EightBitter.MapScreener.nokeys = true;
        thing.EightBitter.MapScreener.notime = true;
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.keys.run = 1;
            thing.maxspeed = thing.walkspeed;
            thing.EightBitter.thingResumeVelocity(thing);
            thing.yvel = 0;
            thing.EightBitter.MapScreener.canscroll = true;
            thing.EightBitter.AudioPlayer.play("World Clear");
        }, 140);
    }
    
    /**
     * Collision callback for a player hitting the DetectCollision placed next 
     * a CastleDoor in EndOutsideCastle. Time is converted one step at a time to
     * score, after which animateEndLevelFireworks is called.
     * 
     * @param {Player} thing
     * @param {DetectCollision} other
     */
    function collideCastleDoor(thing, other) {
        var time = String(thing.EightBitter.StatsHolder.get("time")),
            numFireworks = Number(time[time.length - 1]);
        
        thing.EightBitter.killNormal(thing);
        if (!thing.player) {
            return;
        }
        
        if (!(numFireworks === 1 || numFireworks === 3 || numFireworks === 6)) {
            numFireworks = 0;
        }
        
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            thing.EightBitter.StatsHolder.decrease("time");
            thing.EightBitter.StatsHolder.increase("score", 50);
            thing.EightBitter.AudioPlayer.play("Coin");
            
            if (thing.EightBitter.StatsHolder.get("time") <= 0) {
                thing.EightBitter.TimeHandler.addEvent(function () {
                    thing.EightBitter.animateEndLevelFireworks(thing, other, numFireworks);
                }, 35);
                return true;
            }
        }, 1, Infinity);
    }
    
    /** 
     * Collision callback for a player reaching a castle's NPC. The ending text
     * chunks are revealed in turn, after which collideLevelTransport is called.
     * 
     * @param {Player} thing
     * @param {DetectCollision} other
     */
    function collideCastleNPC(thing, other) {
        var keys = other.collection.npc.collectionKeys,
            interval = 140,
            i = 0,
            letters, j;
        
        thing.keys.run = 0;
        thing.EightBitter.killNormal(other);
        
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            letters = other.collection[keys[i]].children;
            
            for (j = 0; j < letters.length; j += 1) {
                if (letters[j].title !== "TextSpace") {
                    letters[j].hidden = false;
                }
            }
            
            i += 1;
        }, interval, keys.length);
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.EightBitter.collideLevelTransport(thing, other);
        }, (interval * keys.length) + 280);
    }
    
    /**
     * Collision callback for a player hitting the transportation Platform in
     * cloud worlds. The player collides with it as normal for solids, but if
     * the player is then resting on it, it becomes a normal moving platform
     * with only horizontal momentum.
     * 
     * @param {Player} thing
     * @param {Solid} other
     */
    function collideTransport(thing, other) {
        if (!thing.player) {
            return;
        }
        
        thing.EightBitter.collideCharacterSolid(thing, other);
        if (thing.resting !== other) {
            return;
        }

        other.xvel = thing.EightBitter.unitsize / 2;
        other.movement = thing.EightBitter.movePlatform;
        other.collide = thing.EightBitter.collideCharacterSolid;
    }
    
    /**
     * General collision callback for DetectCollision Things. The real activate
     * callback is only hit if the Thing is a player; otherwise, an optional
     * activateFail may be activated. The DetectCollision is then killed if it
     * doesn't have the noActivateDeath flag.
     * 
     * @param {Thing} thing
     * @param {DetectCollision} other
     */
    function collideDetector(thing, other) {
        if (!thing.player) {
            if (other.activateFail) {
                other.activateFail(thing);
            }
            return;
        }
        
        other.activate(thing, other);
        
        if (!other.noActivateDeath) {
            thing.EightBitter.killNormal(other);
        }
    }
    
    /**
     * Collision callback for level transports (any Thing with a .transport 
     * attribute). Depending on the transport, either the map or location are 
     * shifted to it.
     * 
     * @param {Player} thing
     * @param {Thing} other
     */
    function collideLevelTransport(thing, other) {
        var transport = other.transport;
        
        if (!thing.player) {
            return;
        }
        
        if (typeof transport === "undefined") {
            throw new Error("No transport given to collideLevelTransport");
        }
        
        if (transport.constructor === String) {
            thing.EightBitter.setLocation(transport);
        } else if (typeof transport.map !== "undefined") {
            thing.EightBitter.setMap(transport.map);
        } else if (typeof transport.location !== "undefined") {
            thing.EightBitter.setLocation(transport.location);
        } else {        
            throw new Error("Unknown transport type:" + transport);
        }
    }   
    
    
    /* Movement functions
    */
    
    /**
     * Base, generic movement Function for simple characters. The Thing moves
     * at a constant rate in either the x or y direction, and switches direction
     * only if directed by the engine (e.g. when it hits a Solid)
     * 
     * @param {Character} thing
     * @remarks thing.speed is the only required member attribute; .direction
     *          and .moveleft should be set by the game engine.
     */
    function moveSimple(thing) {
        // If the thing is looking away from the intended direction, flip it
        if (thing.direction != thing.moveleft) {
            // thing.moveleft is truthy: it should now be looking to the right
            if (thing.moveleft) {
                thing.xvel = -thing.speed;
                if (!thing.noflip) {
                    thing.EightBitter.unflipHoriz(thing);
                }
            }
            // thing.moveleft is falsy: it should now be looking to the left
            else {
                thing.xvel = thing.speed;
                if (!thing.noflip) {
                    thing.EightBitter.flipHoriz(thing);
                }
            }
            thing.direction = thing.moveleft;
        }
    }
    
    /**
     * Extension of the moveSimple movement Function for Things that shouldn't
     * fall off the edge of their resting blocks
     * 
     * @param {Character} thing
     */
    function moveSmart(thing) {
        // Start off by calling moveSimple for normal movement
        thing.EightBitter.moveSimple(thing);
        
        // If this isn't resting, it's the same as moveSimple
        if (thing.yvel !== 0) {
            return;
        }

        if (!thing.resting || !thing.EightBitter.isCharacterOnResting(thing, thing.resting)) {
            if (thing.moveleft) {
                thing.EightBitter.shiftHoriz(thing, thing.EightBitter.unitsize, true);
            } else {
                thing.EightBitter.shiftHoriz(thing, -thing.EightBitter.unitsize, true);
            }
            thing.moveleft = !thing.moveleft;
        }

        
        // // Check for being over the edge in the direction of movement
        // if (thing.moveleft) {
            // if (thing.left + thing.EightBitter.unitsize <= thing.resting.left) {
                // thing.EightBitter.shiftHoriz(thing, thing.EightBitter.unitsize);
                // thing.moveleft = false;
            // }
        // } else {
            // if (thing.right - thing.EightBitter.unitsize >= thing.resting.right) {
                // thing.EightBitter.shiftHoriz(thing, -thing.EightBitter.unitsize);
                // thing.moveleft = true;
            // }
        // }
    }
    
    /**
     * Extension of the moveSimple movement Function for Things that should
     * jump whenever they start resting.
     * 
     * @param {Character} thing
     * @remarks thing.jumpheight is required to know how high to jump
     */
    function moveJumping(thing) {
        // Start off by calling moveSimple for normal movement
        thing.EightBitter.moveSimple(thing);
        
        // If .resting, jump!
        if (thing.resting) {
            thing.yvel = -Math.abs(thing.jumpheight);
            thing.resting = undefined;
        }
    }
    
    /**
     * Movement Function for Things that slide back and forth, such as 
     * HammerBros and Lakitus.
     * 
     * @remarks thing.counter must be a number set elsewhere, such as in a spawn
     *          Function.    
     */
    function movePacing(thing) {
        thing.counter += .007;
        thing.xvel = Math.sin(Math.PI * thing.counter) / 2.1;
    }
    
    /**
     * Movement Function for HammerBros. They movePacing, look towards the 
     * player, and have the nocollidesolid flag if they're jumping up or 
     * intentionally falling through a solid.
     * 
     * @param {HammerBro} thing
     */
    function moveHammerBro(thing) {
        thing.EightBitter.movePacing(thing);
        thing.EightBitter.lookTowardsPlayer(thing);
        thing.nocollidesolid = thing.yvel < 0 || thing.falling;
    }
    
    /**
     * Movement Function for Bowser. Bowser always faces the player and 
     * movePaces if he's to the right of the player, or moves to the right if
     * he's to the left.
     * 
     * @param {Bowser} thing
     */
    function moveBowser(thing) {
        // Facing to the right
        if (thing.flipHoriz) {
            // To the left of player: walk to the right
            if (
                thing.EightBitter.objectToLeft(thing, thing.EightBitter.player)
            ) {
                thing.EightBitter.moveSimple(thing);
            }
            // To the right of player: look to the left and movePacing as normal
            else {
                thing.lookleft = thing.moveleft = true;
                thing.EightBitter.unflipHoriz(thing);
                thing.EightBitter.movePacing(thing);
            }
        } 
        // Facing to the left
        else {
            // To the left of player: look and walk to the right
            if (
                thing.EightBitter.objectToLeft(thing, thing.EightBitter.player)
            ) {
                thing.lookleft = thing.moveleft = false;
                thing.EightBitter.flipHoriz(thing);
                thing.EightBitter.moveSimple(thing);
            }
            // To the right of the player: movePacing as normal
            else {
                thing.EightBitter.movePacing(thing);
            }
        }
    }
    
    /**
     * 
     */
    function moveBowserFire(thing) {
        if (Math.round(thing.bottom) === Math.round(thing.ylev)) {
            thing.movement = undefined;
            return;
        }
        thing.EightBitter.shiftVert(
            thing,
            Math.min(Math.max(0, thing.ylev - thing.bottom), thing.EightBitter.unitsize)
        );
    }
    
    /**
     * Movement function for Things that float up and down (vertically).
     * If the Thing has reached thing.begin or thing.end, it gradually switches
     * thing.yvel
     * 
     * @param {Thing} thing
     * @remarks thing.maxvel is used as the maximum absolute speed vertically
     * @remarks thing.begin and thing.end are used as the vertical endpoints;
     *          .begin is the bottom and .end is the top (since begin <= end)
     */
    function moveFloating(thing) {
        // If above the endpoint:
        if (thing.top <= thing.end) {
            thing.yvel = Math.min(thing.yvel + thing.EightBitter.unitsize / 64, thing.maxvel);
        }
        // If below the endpoint:
        else if (thing.bottom >= thing.begin) {
            thing.yvel = Math.max(thing.yvel - thing.EightBitter.unitsize / 64, -thing.maxvel);
        }
        
        // Deal with velocities and whether the player is resting on this
        thing.EightBitter.movePlatform(thing);
    }
    
    /**
     * Actual movement Function for Things that float sideways (horizontally).
     * If the Thing has reached thing.begin or thing.end, it gradually switches
     * thing.xvel
     * 
     * @param {Thing} thing
     * @remarks thing.maxvel is used as the maximum absolute speed horizontally
     * @remarks thing.begin and thing.end are used as the horizontal endpoints;
     *          .begin is the left and .end is the right (since begin <= end)
     */
    function moveSliding(thing) {
        // If to the left of the endpoint:
        if (thing.EightBitter.MapScreener.left + thing.left <= thing.begin) {
            thing.xvel = Math.min(
                thing.xvel + thing.EightBitter.unitsize / 64, thing.maxvel
            );
        }
        // If to the right of the endpoint:
        else if (thing.EightBitter.MapScreener.left + thing.right > thing.end) {
            thing.xvel = Math.max(
                thing.xvel - thing.EightBitter.unitsize / 64, -thing.maxvel
            );
        }
        
        // Deal with velocities and whether the player is resting on this
        thing.EightBitter.movePlatform(thing);
    }
    
    /**
     * Ensures thing.begin <= thing.end (so there won't be glitches pertaining
     * to them in functions like moveFloating and moveSliding
     * 
     * @param {Thing} thing
     */
    function setMovementEndpoints(thing) {
        if (thing.begin > thing.end) {
            var temp = thing.begin;
            thing.begin = thing.end;
            thing.end = temp;
        }
        
        thing.begin *= thing.EightBitter.unitsize;
        thing.end *= thing.EightBitter.unitsize;
    }
    
    /**
     * General movement Function for Platforms. Moves a Platform by its 
     * velocities, and checks for whether a Thing is resting on it (if so, 
     * the Thing is accordingly).
     * 
     * @param {Thing} thing
     */
    function movePlatform(thing) {
        thing.EightBitter.shiftHoriz(thing, thing.xvel);
        thing.EightBitter.shiftVert(thing, thing.yvel);
        
        // If the player is resting on this and this is alive, move the player
        if (thing === thing.EightBitter.player.resting && thing.EightBitter.player.alive) {
            thing.EightBitter.setBottom(thing.EightBitter.player, thing.top);
            thing.EightBitter.shiftHoriz(thing.EightBitter.player, thing.xvel);
            
            // If the player is too far to the right or left, stop that overlap
            if (thing.EightBitter.player.right > thing.EightBitter.MapScreener.innerWidth) {
                thing.EightBitter.setRight(
                    thing.EightBitter.player, 
                    thing.EightBitter.MapScreener.innerWidth
                );
            } else if (thing.EightBitter.player.left < 0) {
                thing.EightBitter.setLeft(thing.EightBitter.player, 0);
            }
        }
    }
    
    /**
     * Movement Function for platforms that are in a PlatformGenerator. They
     * have the typical movePlatform applied to them, but if they reach the
     * bottom or top of the screen, they are shifted to the opposite side.
     * 
     * @param {Platform} thing
     */
    function movePlatformSpawn(thing) {
        if (thing.bottom < 0) {
            thing.EightBitter.setTop(
                thing, thing.EightBitter.MapScreener.bottomPlatformMax
            );
        } else if (
            thing.top > thing.EightBitter.MapScreener.bottomPlatformMax
        ) {
            thing.EightBitter.setBottom(thing, 0);
        } else {
            thing.EightBitter.movePlatform(thing);
            return;
        }
        
        if (
            thing.EightBitter.player
            && thing.EightBitter.player.resting === thing
        ) {
            thing.EightBitter.player.resting = undefined;
        }
    }

    /**
     * Movement Function for Platforms that fall whenever rested upon by a 
     * player. Being rested upon means the Platform falls; when it reaches a 
     * terminal velocity, it switches to moveFreeFalling forever.
     * 
     * @param {Platform} thing
     */
    function moveFalling(thing) {
        // If the player isn't resting on this thing (any more?), ignore it
        if (thing.EightBitter.player.resting !== thing) {
            // Since the player might have been on this thing but isn't anymore, 
            // set the yvel to 0 just in case
            thing.yvel = 0;
            return;
        }

        // Since the player is on this thing, start falling more
        thing.EightBitter.shiftVert(
            thing, thing.yvel += thing.EightBitter.unitsize / 8
        );
        thing.EightBitter.setBottom(thing.EightBitter.player, thing.top);

        // After a velocity threshold, start always falling
        if (
            thing.yvel >= (
                thing.fallThresholdStart || thing.EightBitter.unitsize * 2.8
            )
        ) {
            thing.freefall = true;
            thing.movement = thing.EightBitter.moveFreeFalling;
        }
    }

    /**
     * Movement Function for Platforms that have reached terminal velocity in
     * moveFalling and are now destined to die. The Platform will continue to
     * accelerate towards certain death until another velocity threshold,
     * and then switches to movePlatform to remain at that rate.
     * 
     * @param {Platform} thing
     */
    function moveFreeFalling(thing) {
        // Accelerate downwards, increasing the thing's y-velocity
        thing.yvel += thing.acceleration || thing.EightBitter.unitsize / 16;
        thing.EightBitter.shiftVert(thing, thing.yvel);

        // After a velocity threshold, stop accelerating
        if (
            thing.yvel >= (
                thing.fallThresholdEnd || thing.EightBitter.unitsize * 2
            )
        ) {
            thing.movement = movePlatform;
        }
    }
    
    /**
     * Movement Function for Platforms that are a part of a scale.  Nothing
     * happens if a Platform isn't being rested and doesn't have a y-velocity. 
     * Being rested upon means the y-velocity increases, and not being rested
     * means the y-velocity decreases: either moves the corresponding Platform
     * "partner" in the other vertical direction. When the Platform is too far
     * down (visually has no string left), they both fall.
     * 
     * @param {Platform} thing
     * @todo Implement this! See #146.
     */
    function movePlatformScale(thing) {
        // If the Player is resting on this, fall hard
        if (thing.EightBitter.player.resting === thing) {
            thing.yvel += thing.EightBitter.unitsize / 16;
        }
        // If this still has velocity from a player, fall less
        else if (this.yvel > 0) {
            thing.yvel = Math.max(
                thing.yvel - thing.EightBitter.unitsize / 16,
                0
            );
        }
        // Not being rested upon or having a yvel means nothing happens
        else {
            return;
        }
        
        thing.tension += thing.yvel;
        thing.partners.partnerPlatform.tension -= thing.yvel;
        
        // If the partner has fallen off, everybody falls!
        if (thing.partners.partnerPlatform.tension <= 0) {
            thing.EightBitter.scoreOn(1000, thing); 
            thing.partners.partnerPlatform.yvel = thing.EightBitter.unitsize / 2;
            thing.collide = thing.partners.partnerPlatform.collide = (
                thing.EightBitter.collideCharacterSolid
            );
            thing.movement = thing.partners.partnerPlatform.movement = (
                thing.EightBitter.moveFreeFalling
            );
        }
        
        
        thing.EightBitter.shiftVert(thing, thing.yvel);
        
        thing.EightBitter.shiftVert(
            thing.partners.partnerPlatform,
            -thing.yvel
        );
        
        thing.EightBitter.setHeight(
            thing.partners.ownString,
            thing.partners.ownString.height + (
                thing.yvel / thing.EightBitter.unitsize
            )
        );
        
        thing.EightBitter.setHeight(
            thing.partners.partnerString, 
            Math.max(
                thing.partners.partnerString.height - (
                    thing.yvel / thing.EightBitter.unitsize
                ),
                0
            )
        );
    }
    
    /**
     * Movement Function for Vines. They are constantly growing upward, until
     * some trigger (generally from animateEmergeVine) sets movement to 
     * undefined. If there is an attached Thing, it is moved up at the same rate
     * as the Vine.
     * 
     * @param {Vine} thing
     */
    function moveVine(thing) {
        thing.EightBitter.increaseHeight(thing, thing.speed);
        thing.EightBitter.updateSize(thing);
        
        if (thing.attachedSolid) {
            thing.EightBitter.setBottom(thing, thing.attachedSolid.top);
        }
        
        if (thing.attachedCharacter) {
            thing.EightBitter.shiftVert(thing.attachedCharacter, -thing.speed); 
        }
    }
    
    /**
     * Movement Function for Springboards that are "pushing up" during or after
     * being hit by a player. The Springboard changes its height based on its
     * tension. If the player is still on it, then the player is given extra
     * vertical velocity and taken off.
     * 
     * @param {Vine} thing
     */
    function moveSpringboardUp(thing) {
        var player = thing.EightBitter.player;
        
        thing.EightBitter.reduceHeight(thing, -thing.tension, true);
        thing.tension *= 2;
            
        // If the spring height is past the normal, it's done moving
        if (thing.height > thing.heightNormal) {
            thing.EightBitter.reduceHeight(
                thing, 
                (thing.height - thing.heightNormal) * thing.EightBitter.unitsize
            );
            if (thing === player.spring) {
                player.yvel = Math.max(
                    thing.EightBitter.unitsize * -2,
                    thing.tensionSave * -.98
                );
                player.resting = player.spring = undefined;
                player.movement = FullScreenMario.prototype.movePlayer;
            }
            thing.tension = 0;
            thing.movement = undefined;
        } else {
            thing.EightBitter.setBottom(player, thing.top);
        }
        
        if (thing === player.spring) {
            if (!thing.EightBitter.isThingTouchingThing(player, thing)) {
                player.spring = undefined;
                player.movement = FullScreenMario.prototype.movePlayer;
            }
        }
    }
    
    /**
     * Movement Function for Shells. This actually does nothing for moving 
     * Shells (since they only interact unusually on collision). For Shells with
     * no x-velocity, a counting variable is increased. Once it reaches 350, the
     * shell is "peeking" visually; when it reaches 490, the Shell spawns back
     * into its original spawner (typically Koopa or Beetle).
     * 
     * @param {Shell} thing
     */
    function moveShell(thing) {
        if (thing.xvel !== 0) {
            return;
        }
        thing.counting += 1;
        
        if (thing.counting === 350) {
            thing.peeking = 1;
            thing.height += thing.EightBitter.unitsize / 8;
            thing.EightBitter.addClass(thing, "peeking");
            thing.EightBitter.updateSize(thing);
        } else if (thing.counting === 455) {
            thing.peeking = 2;
        } else if (thing.counting === 490) {
            thing.spawnSettings = {
                "smart": thing.smart
            };
            thing.EightBitter.killSpawn(thing);
        }
    }
    
    /**
     * Movement Function for Piranhas. These constantly change their height 
     * except when they reach 0 or full height (alternating direction), at which
     * point they switch to movePiranhaLatent to wait to move in the opposite
     * direction.
     * 
     * @param {Piranha} thing
     */
    function movePiranha(thing) {
        var bottom = thing.bottom,
            height = thing.height + thing.direction,
            atEnd = false;
        
        if (thing.resting && !thing.EightBitter.isThingAlive(thing.resting)) {
            bottom = thing.top + (
                thing.constructor.prototype.height * thing.EightBitter.unitsize
            );
            height = Infinity;
            thing.resting = undefined;
        }
        
        if (height <= 0) {
            height = thing.height = 0;
            atEnd = true;
        } else if (height >= thing.constructor.prototype.height) {
            height = thing.height = thing.constructor.prototype.height;
            atEnd = true;
        }
        
        thing.EightBitter.setHeight(thing, height, true, true);
        thing.EightBitter.setBottom(thing, bottom);
        
        if (atEnd) {
            thing.counter = 0;
            thing.movement = movePiranhaLatent;
        }
    }

    /**
     * Movement Function for Piranhas that are not changing size. They wait 
     * until a counter reaches a point (and then, if their height is 0, for the
     * player to go away) to switch back to movePiranha.
     * 
     * @param {Piranha} thing
     */
    function movePiranhaLatent(thing) {
        var playerx = thing.EightBitter.getMidX(thing.EightBitter.player);

        if (
            thing.counter >= thing.countermax
            && (
                thing.height > 0
                || playerx < thing.left - thing.EightBitter.unitsize * 8
                || playerx > thing.right + thing.EightBitter.unitsize * 8
            )
        ) {
            thing.movement = undefined;
            thing.direction *= -1;

            thing.EightBitter.TimeHandler.addEvent(function () {
                thing.movement = thing.EightBitter.movePiranha;
            }, 7);
        } else {
            thing.counter += 1;
        }
    }
    
    /**
     * Movement Function for the Bubbles that come out of a player's mouth
     * underwater. They die when they reach a top threshold of unitsize * 16.
     * 
     * @param {Bubble} thing
     */
    function moveBubble(thing) {
        if (
            thing.top < (
                thing.EightBitter.MapScreener.top
                + thing.EightBitter.unitsize * 16
            )
        ) {
            thing.EightBitter.killNormal(thing);
        }
    }
    
    /**
     * Movement Function for typical CheepCheeps, which are underwater. They
     * move according to their native velocities except that they cannot travel
     * above the unitsize * 16 top threshold.
     * 
     * @param {CheepCheep} thing
     */
    function moveCheepCheep(thing) {
        if (thing.top < thing.EightBitter.unitsize * 16) {
            thing.EightBitter.setTop(thing, thing.EightBitter.unitsize * 16);
            thing.yvel *= -1;
            return;
        }
    }
    
    /**
     * Movement Function for flying CheepCheeps, like in bridge areas. They 
     * lose a movement Function (and therefore just fall) at a unitsize * 28 top
     * threshold.
     * 
     * @param {CheepCheep} thing
     */
    function moveCheepCheepFlying(thing) {
        if (thing.top < thing.EightBitter.unitsize * 28) {
            thing.movement = undefined;
            thing.nofall = false;
        }
    }
    
    /**
     * Movement Function for Bloopers. These switch between "squeezing" (moving
     * down) and moving up ("unsqueezing"). They always try to unsqueeze if the 
     * player is above them.
     * 
     * @param {Blooper} thing
     */
    function moveBlooper(thing) {
        // If the player is dead, just drift aimlessly
        if (!thing.EightBitter.isThingAlive(thing.EightBitter.player)) {    
            thing.xvel = thing.EightBitter.unitsize / -4;
            thing.yvel = 0;
            thing.movement = undefined;
            return;
        }
        
        switch (thing.counter) {
            case 56: 
                thing.squeeze = true; 
                thing.counter += 1;
                break;
            case 63:
                thing.EightBitter.moveBlooperSqueezing(thing); 
                break;
            default: 
                thing.counter += 1;
                if (thing.top < thing.EightBitter.unitsize * 18) {
                    thing.EightBitter.moveBlooperSqueezing(thing);
                }
                break;
        }

        if (thing.squeeze) {
            thing.yvel = Math.max(thing.yvel + .021, .7); // going down
        } else {
            thing.yvel = Math.min(thing.yvel - .035, -.7); // going up
        }
        
        if (thing.top > thing.EightBitter.unitsize * 16) {
            thing.EightBitter.shiftVert(thing, thing.yvel, true);
        }

        if (!thing.squeeze) {
            if (
                thing.EightBitter.player.left
                > thing.right + thing.EightBitter.unitsize * 8
            ) {
                // Go to the right
                thing.xvel = Math.min(
                    thing.speed, thing.xvel + thing.EightBitter.unitsize / 32
                );
            }
            else if (
                thing.EightBitter.player.right
                < thing.left - thing.EightBitter.unitsize * 8
            ) {
                // Go to the left
                thing.xvel = Math.max(
                    -thing.speed,
                    thing.xvel - thing.EightBitter.unitsize / 32
                );
            }
        }
    }
    
    /**
     * Additional movement Function for Bloopers that are "squeezing". Squeezing
     * Bloopers travel downard at a gradual pace until they reach either the
     * player's bottom or a threshold of unitsize * 90.
     * 
     * @param {Blooper} thing
     */
    function moveBlooperSqueezing(thing) {
        if (thing.squeeze !== 2) {
            thing.squeeze = 2;
            thing.EightBitter.addClass(thing, "squeeze");
            thing.EightBitter.setHeight(thing, 10, true, true);
        }
        
        if (thing.squeeze < 7) {
            thing.xvel /= 1.4;
        } else if (thing.squeeze === 7) {
            thing.xvel = 0;
        }
        
        thing.squeeze += 1;
        
        if (
            thing.top > thing.EightBitter.player.bottom
            || thing.bottom > thing.EightBitter.unitsize * 91
        ) {
            thing.EightBitter.animateBlooperUnsqueezing(thing);
        }
    }
    
    /**
     * Movement Function for Podoboos that is only used when they are falling.
     * Podoboo animations trigger this when they reach a certain height, and
     * use this to determine when they should stop accelerating downward, which
     * is their starting location.
     * 
     * @param {Podoboo} thing
     */
    function movePodobooFalling(thing) {
        if (thing.top >= thing.starty) {
            thing.yvel = 0;
            thing.movement = undefined;
            thing.EightBitter.unflipVert(thing);
            thing.EightBitter.setTop(thing, thing.starty);
            return;
        }
        
        if (thing.yvel >= thing.speed) {
            thing.yvel = thing.speed;
            return;
        }
        
        if (!thing.flipVert && thing.yvel > 0) {
            thing.EightBitter.flipVert(thing);
        }
        
        thing.yvel += thing.acceleration;
    }
    
    /**
     * Movement Function for Lakitus that have finished their moveLakituInitial
     * run. This is similar to movePacing in that it makes the Lakitu pace to 
     * left and right of the player, and moves with the player rather than the
     * scrolling window.
     * 
     * @param {Lakitu} thing
     */
    function moveLakitu(thing) {
        var player = thing.EightBitter.player;
        // If the player is moving quickly to the right, move in front and stay there
        if (
            player.xvel > thing.EightBitter.unitsize / 8
            && player.left > thing.EightBitter.MapScreener.width / 2
        ) {
            if (thing.left < player.right + thing.EightBitter.unitsize * 16) {
                // slide to xloc
                thing.EightBitter.slideToX(
                    thing,
                    player.right + player.xvel + thing.EightBitter.unitsize * 32,
                    player.maxspeed * 1.4
                );
                thing.counter = 0;
            }
        } else {
            thing.counter += .007;
            thing.EightBitter.slideToX(
                thing,
                player.left + player.xvel + Math.sin(Math.PI * thing.counter) * 117,
                player.maxspeed * .7
            );
        }
    }
    
    /**
     * Initial entry movement Function for Lakitus. They enter by sliding across
     * the top of the screen until they reach the player, and then switch to
     * their standard moveLakitu movement.
     * 
     * @param {Lakitu} thing
     */
    function moveLakituInitial(thing) {
        if (thing.right < thing.EightBitter.player.left) {
            thing.counter = 0;
            thing.movement = thing.EightBitter.moveLakitu;
            thing.movement(thing);
            return;
        }
        
        thing.EightBitter.shiftHoriz(thing, -thing.EightBitter.unitsize);
    }
    
    /**
     * Alternate movement Function for Lakitus. This is used when the player
     * reaches the ending flagpole in a level and the Lakitu just flies to the 
     * left.
     * 
     * @param {Lakitu} thing
     */
    function moveLakituFleeing(thing) {
        thing.EightBitter.shiftHoriz(thing, -thing.EightBitter.unitsize);
    }
    
    /**
     * Movement Function for Coins that have been animated. They move based on
     * their yvel, and if they have a parent, die when they go below the parent.
     * 
     * @param {Coin} thing
     * @param {Solid} [parent]
     */
    function moveCoinEmerge(thing, parent) {
        thing.EightBitter.shiftVert(thing, thing.yvel);
        if (parent && thing.bottom >= thing.blockparent.bottom) {
            thing.EightBitter.killNormal(thing);
        }
    }
    
    /**
     * Movement Function for the player. It reacts to almost all actions that 
     * to be done, but is horribly written so that is all the documentation you
     * get here. Sorry! Sections are labeled on the inside.
     * 
     * @param {Player} thing
     */
    function movePlayer(thing) {
        // Not jumping
        if (!thing.keys.up) {
            thing.keys.jump = 0;
        }
        // Jumping
        else if (
            thing.keys.jump > 0 
            && (thing.yvel <= 0 || thing.EightBitter.MapScreener.underwater)
        ) {
            if (thing.EightBitter.MapScreener.underwater) {
                thing.EightBitter.animatePlayerPaddling(thing);
                thing.EightBitter.removeClass(thing, "running");
            }
            
            if (thing.resting) {
                if (thing.resting.xvel) {
                    thing.xvel += thing.resting.xvel;
                }
                thing.resting = undefined;
            }
            // Jumping, not resting
            else {
                if (!thing.jumping && !thing.EightBitter.MapScreener.underwater) {
                    thing.EightBitter.switchClass(thing, "running skidding", "jumping");
                }
                thing.jumping = true;
                
                if (thing.power > 1 && thing.crouching) {
                    thing.EightBitter.removeClass(thing, "jumping");
                }
            }
            if (!thing.EightBitter.MapScreener.underwater) {
                thing.keys.jumplev += 1;
                var dy = FullScreenMario.unitsize 
                    / (Math.pow(thing.keys.jumplev, thing.EightBitter.MapScreener.jumpmod - .0014 * thing.xvel));
                thing.yvel = Math.max(thing.yvel - dy, thing.EightBitter.MapScreener.maxyvelinv);
            }
        }
      
        // Crouching
        if (thing.keys.crouch && !thing.crouching && thing.resting) {
            if (thing.power > 1) {
                thing.crouching = true;
                thing.EightBitter.removeClass(thing, "running");
                thing.EightBitter.addClass(thing, "crouching");
                thing.EightBitter.setHeight(thing, 11, true, true);
                thing.height = 11;
                thing.tolyOld = thing.toly;
                thing.toly = thing.EightBitter.unitsize * 4;
                thing.EightBitter.updateBottom(thing, 0);
                thing.EightBitter.updateSize(thing);
            }
            // Pipe movement
            if (thing.resting.actionTop) {
                thing.EightBitter.ModAttacher.fireEvent("onPlayerActionTop", thing, thing.resting);
                thing.resting.actionTop(thing, thing.resting);
            }
        }
      
        // Running
        var decel = 0 ; // (how much extra to decrease)
        // If a button is pressed, hold/increase speed
        if (thing.keys.run != 0 && !thing.crouching) {
            var dir = thing.keys.run,
                // No sprinting underwater
                sprinting = (thing.keys.sprint && !thing.EightBitter.MapScreener.underwater) || 0,
                adder = dir * (.098 * (sprinting + 1));
            
            // Reduce the speed, both by subtracting and dividing a little
            thing.xvel += adder || 0;
            thing.xvel *= .98;
            decel = .0007;
            
            // If you're accelerating in the opposite direction from your current velocity, that's a skid
            if ((thing.keys.run > 0) == thing.moveleft) {
                if (!thing.skidding) {
                    thing.EightBitter.addClass(thing, "skidding");
                    thing.skidding = true;
                }
            }
            // Not accelerating: make sure you're not skidding
            else if (thing.skidding) {
                thing.EightBitter.removeClass(thing, "skidding");
                thing.skidding = false;
            }
        }
        // Otherwise slow down a bit
        else {
            thing.xvel *= .98;
            decel = .035;
        }

        if (thing.xvel > decel) {
            thing.xvel -= decel;
        } else if (thing.xvel < -decel) {
            thing.xvel += decel;
        } else if (thing.xvel != 0) {
            thing.xvel = 0;
            if (!thing.EightBitter.MapScreener.nokeys && thing.keys.run == 0) {
                if (thing.keys.leftDown) {
                    thing.keys.run = -1;
                } else if (thing.keys.rightDown) {
                    thing.keys.run = 1;
                }
            }  
        }
      
        // Movement mods
        // Slowing down
        if (Math.abs(thing.xvel) < .14) {
            if (thing.running) {
                thing.running = false;
                if (thing.power == 1) {
                    thing.EightBitter.setPlayerSizeSmall(thing);
                }
                thing.EightBitter.removeClasses(thing, "running skidding one two three");
                thing.EightBitter.addClass(thing, "still");
                thing.EightBitter.TimeHandler.cancelClassCycle(thing, "running");
            }
        }
        // Not moving slowly
        else if (!thing.running) {
            thing.running = true;
            thing.EightBitter.animatePlayerRunningCycle(thing);
            if (thing.power == 1) {
                thing.EightBitter.setPlayerSizeSmall(thing);
            }
        }
        if (thing.xvel > 0) {
            thing.xvel = Math.min(thing.xvel, thing.maxspeed);
            if (thing.moveleft && (thing.resting || thing.EightBitter.MapScreener.underwater)) {
                thing.EightBitter.unflipHoriz(thing);
                thing.moveleft = false;
            }
        }
        else if (thing.xvel < 0) {
            thing.xvel = Math.max(thing.xvel, thing.maxspeed * -1);
            if (!thing.moveleft && (thing.resting || thing.EightBitter.MapScreener.underwater)) {
                thing.moveleft = true;
                thing.EightBitter.flipHoriz(thing);
            }
        }
      
        // Resting stops a bunch of other stuff
        if (thing.resting) {
            // Hopping
            if (thing.hopping) {
                thing.hopping = false;
                thing.EightBitter.removeClass(thing, "hopping");
                if (thing.xvel) {
                    thing.EightBitter.addClass(thing, "running");
                }
            }
            // Jumping
            thing.keys.jumplev = thing.yvel = thing.jumpcount = 0;
            if (thing.jumping) {
                thing.jumping = false;
                thing.EightBitter.removeClass(thing, "jumping");
                if (thing.power == 1) {
                    thing.EightBitter.setPlayerSizeSmall(thing);
                }
                thing.EightBitter.addClass(thing, Math.abs(thing.xvel) < .14 ? "still" : "running");
            }
            // Paddling
            if (thing.paddling) {
                thing.paddling = thing.swimming = false;
                thing.EightBitter.TimeHandler.cancelClassCycle(thing, "paddling");
                thing.EightBitter.removeClasses(thing, "paddling swim1 swim2");
                thing.EightBitter.addClass(thing, "running");
            }
        }
    }
    
    /**
     * Alternate movement Function for players attached to a Vine. They may 
     * climb up or down the Vine, or jump off. 
     * 
     * @param {Player} thing
     */
    function movePlayerVine(thing) {
        var attachedSolid = thing.attachedSolid,
            animatedClimbing;
        
        if (!attachedSolid) {
            thing.movement = thing.EightBitter.movePlayer;
            return;
        }
        
        if (thing.bottom < thing.attachedSolid.top) {
            thing.EightBitter.unattachPlayer(thing, thing.attachedSolid);
            return;
        }
        
        // Running away from the vine means dropping off
        if (thing.keys.run !== 0 && thing.keys.run === thing.attachedDirection) {
            // Leaving to the left
            if (thing.attachedDirection === -1) {
                thing.EightBitter.setRight(thing, attachedSolid.left - thing.EightBitter.unitsize);
            }
            // Leaving to the right
            else if (thing.attachedDirection === 1) {
                thing.EightBitter.setLeft(thing, attachedSolid.right + thing.EightBitter.unitsize);
            }
            
            thing.EightBitter.unattachPlayer(thing, attachedSolid);
            return;
        }
        
        // If the player is moving up, simply move up
        if (thing.keys.up) {
            animatedClimbing = true;
            thing.EightBitter.shiftVert(thing, thing.EightBitter.unitsize / -4);
        }
        // If the thing is moving down, move down and check for unattachment
        else if (thing.keys.crouch) {
            animatedClimbing = true;
            thing.EightBitter.shiftVert(thing, thing.EightBitter.unitsize / 2);
            if (thing.top > attachedSolid.bottom) {
                thing.EightBitter.unattachPlayer(thing, thing.attachedSolid);
            }
            return;
        } else {
            animatedClimbing = false;
        }
        
        if (animatedClimbing && !thing.animatedClimbing) {
            thing.EightBitter.addClass(thing, "animated");
        } else if (!animatedClimbing && thing.animatedClimbing) {
            thing.EightBitter.removeClass(thing, "animated");
        }
        
        thing.animatedClimbing = animatedClimbing;
        
        if (thing.bottom < thing.EightBitter.MapScreener.top - thing.EightBitter.unitsize * 4) {
            thing.EightBitter.setLocation(thing.attachedSolid.transport);
        }
    }
    
    /**
     * Movement Function for players pressing down onto a Springboard. This does
     * basically nothing except check for when the player is off the spring or
     * the spring is fully contracted. The former restores the player's movement
     * and the latter clears it (to be restored in moveSpringboardUp).
     * 
     * @param {Player} thing
     */
    function movePlayerSpringboardDown(thing) {
        var other = thing.spring;
        
        // If the player has moved off the spring, get outta here
        if (!thing.EightBitter.isThingTouchingThing(thing, other)) {
            thing.movement = thing.EightBitter.movePlayer;
            other.movement = thing.EightBitter.moveSpringboardUp;
            thing.spring = false;
            return;
        }
        
        // If the spring is fully contracted, go back up
        if (
            other.height < thing.EightBitter.unitsize * 2.5
            || other.tension < thing.EightBitter.unitsize / 32
        ) {
            thing.movement = undefined;
            other.movement = thing.EightBitter.moveSpringboardUp;
            return;
        }
        
        // Make sure it's hard to slide off
        if (
            thing.left < other.left + thing.EightBitter.unitsize * 2
            || thing.right > other.right - thing.EightBitter.unitsize * 2
        ) {
            thing.xvel /= 1.4;
        }
        
        thing.EightBitter.reduceHeight(other, other.tension, true);
        other.tension /= 2;
        thing.EightBitter.setBottom(thing, other.top);
        thing.EightBitter.updateSize(other);
    }
    
    
    // Animations
    
    /**
     * Animates a solid that has just had its bottom "bumped" by a player. It
     * moves with a dx that is initially negative (up) and increases (to down).
     * 
     * @param {Solid} thing
     */
    function animateSolidBump(thing) {
        var dx = -3;
        
        thing.EightBitter.TimeHandler.addEventInterval(function (thing) {
            thing.EightBitter.shiftVert(thing, dx);
            dx += .5;
            if (dx === 3.5) {
                thing.up = false;
                return true;
            }
        }, 1, Infinity, thing);
    }
    
    /**
     * Animates a Block to switch from unused to used.
     * 
     * @param {Block} thing
     */
    function animateBlockBecomesUsed(thing) {
        thing.used = true;
        thing.EightBitter.switchClass(thing, "unused", "used");
    }
    
    /**
     * Animates a solid to have its contents emerge. A new Thing based on the 
     * contents is spawned directly on top of (visually behind) the solid, and
     * has its animate callback triggered.
     * 
     * @param {Solid} thing
     * @param {Player} other
     * @remarks If the contents are "Mushroom" and a large player hits the 
     *          solid, they turn into "FireFlower".
     */
    function animateSolidContents(thing, other) {
        var output;

        if (
            other
            && other.player
            && other.power > 1
            && thing.contents === "Mushroom"
        ) {
            thing.contents = "FireFlower";
        }
        
        output = thing.EightBitter.addThing(thing.contents);
        thing.EightBitter.setMidXObj(output, thing);
        thing.EightBitter.setTop(output, thing.top);
        output.blockparent = thing;
        output.animate(output, thing);
        
        return output;
    }
    
    /**
     * Animates a Brick turning into four rotating shards flying out of it. The
     * shards have an initial x- and y-velocities, and die after 70 steps.
     * 
     * @param {Brick} thing
     */
    function animateBrickShards(thing) {
        var unitsize = thing.EightBitter.unitsize,
            shard,
            left, top,
            i;
        
        for (i = 0; i < 4; i += 1) {
            left = thing.left + (i < 2) * thing.width * unitsize - unitsize * 2;
            top = thing.top + (i % 2) * thing.height * unitsize - unitsize * 2;
            
            shard = thing.EightBitter.addThing("BrickShard", left, top);
            shard.xvel = shard.speed = unitsize / 2 - unitsize * (i > 1);
            shard.yvel = unitsize * -1.4 + i % 2;
            
            thing.EightBitter.TimeHandler.addEvent(
                thing.EightBitter.killNormal, 70, shard
            );
        }
    }
    
    /**
     * Standard animation Function for Things emerging from a solid as contents.
     * They start at inside the solid, slowly move up, then moveSimple until 
     * they're off the solid, at which point they revert to their normal 
     * movement.
     * 
     * @param {Thing} thing
     * @param {Solid} other
     */
    function animateEmerge(thing, other) {
        thing.nomove = thing.nocollide = thing.nofall = thing.alive = true;
        
        thing.EightBitter.flipHoriz(thing);
        thing.EightBitter.AudioPlayer.play("Powerup Appears");
        thing.EightBitter.arraySwitch(thing, 
            thing.EightBitter.GroupHolder.getCharacterGroup(), 
            thing.EightBitter.GroupHolder.getSceneryGroup()
        );
        
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            thing.EightBitter.shiftVert(thing, thing.EightBitter.unitsize / -8);
            
            // Only stop once the bottom has reached the solid's top
            if (thing.bottom > other.top) {
                return;
            }
            
            thing.EightBitter.setBottom(thing, other.top);
            thing.EightBitter.GroupHolder.switchObjectGroup(
                thing, "Scenery", "Character"
            );
            thing.nomove = thing.nocollide = thing.nofall = thing.moveleft = false;
            
            if (thing.emergeOut) {
                thing.emergeOut(thing, other);
            }
            
            // Wait for movement until moveSimple moves this off the solid
            if (thing.movement) {
                thing.movementSave = thing.movement;
                thing.movement = thing.EightBitter.moveSimple;
                
                thing.EightBitter.TimeHandler.addEventInterval(function () {
                    if (thing.resting !== other) {
                        thing.EightBitter.TimeHandler.addEvent(function () {
                            thing.movement = thing.movementSave;
                        }, 1);
                        return true;
                    }
                }, 1, Infinity);
            }
            
            return true;
        }, 1, Infinity);
    }
    
    /**
     * Animation Function for Coins emerging from (or being hit by) a solid. The
     * Coin switches to the Scenery group, rotates between animation classes, 
     * moves up then down then dies, plays the "Coin" sound, and increaes the
     * "coins" and "score" statistics.
     * 
     * @param {Coin} thing
     * @param {Solid} other
     */
    function animateEmergeCoin(thing, other) {
        thing.nocollide = thing.alive = thing.nofall = true;
        thing.yvel -= thing.EightBitter.unitsize;
        
        thing.EightBitter.switchClass(thing, "still", "anim");
        thing.EightBitter.GroupHolder.switchObjectGroup(thing, "Character", "Scenery");
        
        thing.EightBitter.AudioPlayer.play("Coin");
        thing.EightBitter.StatsHolder.increase("coins", 1);
        thing.EightBitter.StatsHolder.increase("score", 200);
        
        thing.EightBitter.TimeHandler.cancelClassCycle(thing, 0);
        thing.EightBitter.TimeHandler.addClassCycle(thing, [
            "anim1", "anim2", "anim3", "anim4", "anim3", "anim2"
        ], 0, 5);
        
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            thing.EightBitter.moveCoinEmerge(thing, other);
            return !thing.EightBitter.isThingAlive(thing);
        }, 1, Infinity);
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.EightBitter.killNormal(thing);
        }, 49);
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.yvel *= -1;
        }, 25);
    }
    
    /**
     * Animation Function for a Vine emerging from a solid. It continues to grow
     * as normal via moveVine for 700 steps, then has its movement erased to 
     * stop.
     * 
     * @param {Vine} thing
     * @param {Solid} solid
     */
    function animateEmergeVine(thing, solid) {
        // This allows the thing's movement to keep it on the solid
        thing.attachedSolid = solid;
        
        thing.EightBitter.setHeight(thing, 0);
        thing.EightBitter.AudioPlayer.play("Vine Emerging");
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.nocollide = false;
        }, 14);
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.movement = undefined;
        }, 700);
    }
    
    /**
     * Animates a "flicker" effect on a Thing by repeatedly toggling its hidden
     * flag for a little while.
     * 
     * @param {Thing} thing
     * @param {Number} [cleartime]   How long to wait to stop the effect (by 
     *                               default, 49).
     * @param {Number} [interval]   How many steps between hidden toggles (by
     *                              default, 2).
     */
    function animateFlicker(thing, cleartime, interval) {
        cleartime = Math.round(cleartime) || 49;
        interval = Math.round(interval) || 2;
        
        thing.flickering = true;
        
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            thing.hidden = !thing.hidden;
            if (!thing.hidden) {
                thing.EightBitter.PixelDrawer.setThingSprite(thing);
            }
        }, interval, cleartime);
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.flickering = thing.hidden = false;
            thing.EightBitter.PixelDrawer.setThingSprite(thing);
        }, cleartime * interval + 1);
    }
    
    /**
     * Animate Function for a HammerBro to throw a hammer. The HammerBro 
     * switches to the "throwing" class, waits and throws a few repeats, then
     * goes back to normal.
     * 
     * @param {HammerBro} thing
     * @param {Number} count   How many times left there are to throw a hammer.
     *                         If equal to 3, a hammer will not be thrown (to
     *                         mimic the pause in the original game).
     * @remarks This could probably be re-written.
     */
    function animateThrowingHammer(thing, count) {
        if ( 
            !thing.EightBitter.isThingAlive(thing)
            || thing.right < thing.EightBitter.unitsize * -32
        ) {
            return true;
        }
        
        if (count !== 3) {
            thing.EightBitter.switchClass(thing, "thrown", "throwing");
        }
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            if (!thing.EightBitter.isThingAlive(thing)) {
                return;
            }
            
            // Throw the hammer...
            if (count !== 3) {
                thing.EightBitter.switchClass(thing, "throwing", "thrown");
                thing.EightBitter.addThing(
                    ["Hammer", {
                        "xvel": thing.lookleft 
                            ? thing.EightBitter.unitsize / -1.4
                            : thing.EightBitter.unitsize / 1.4,
                        "yvel": thing.EightBitter.unitsize * -1.4,
                        "gravity": thing.EightBitter.MapScreener.gravity / 2.1
                    }],
                    thing.left - thing.EightBitter.unitsize * 2,
                    thing.top - thing.EightBitter.unitsize * 2
                );
            }
            
            // ...and go again
            if (count > 0) {
                thing.EightBitter.TimeHandler.addEvent(
                    thing.EightBitter.animateThrowingHammer,
                    7, thing, count - 1
                );
            } else {
                thing.EightBitter.TimeHandler.addEvent(
                    thing.EightBitter.animateThrowingHammer,
                    70, thing, 7
                );
                thing.EightBitter.removeClass(thing, "thrown");
            }
        }, 14);
    }
    
    /**
     * Animation Function for when Bowser jumps. This will only trigger if he is
     * facing left and a player exists. If either Bowser or the player die, it
     * is cancelled. He is given a negative yvel to jump, and the nocollidesolid
     * flag is enabled as long as he is rising.
     * 
     * @param {Bowser} thing
     */
    function animateBowserJump(thing) {
        if (!thing.lookleft || !thing.EightBitter.player) {
            return;
        }
        
        if (
            !thing.EightBitter.isThingAlive(thing)
            || !thing.EightBitter.isThingAlive(thing.EightBitter.player)
        ) {
            return true;
        }
        
        thing.resting = undefined;
        thing.yvel = thing.EightBitter.unitsize * -1.4;
        
        // If there is a platform, don't bump into it
        thing.nocollidesolid = true;
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            if (thing.dead || thing.yvel > thing.EightBitter.unitsize) {
                thing.nocollidesolid = false;
                return true;
            }
        }, 3, Infinity);
    }
    
    /**
     * Animation Function for when Bowser fires. This will only trigger if he is
     * facing left and a player exists. If either Bowser or the player die, it
     * is cancelled. His mouth is closed and an animateBowserFireOpen call is
     * scheduled to complete the animation.
     * 
     * @param {Bowser} thing
     */
    function animateBowserFire(thing) {
        if (!thing.lookleft || !thing.lookleft || !thing.EightBitter.player) {
            return;
        }
        
        if (
            !thing.EightBitter.isThingAlive(thing)
            || !thing.EightBitter.isThingAlive(thing.EightBitter.player)
        ) {
            return true;
        }
        
        // Close the mouth
        thing.EightBitter.addClass(thing, "firing");
        thing.EightBitter.AudioPlayer.playLocal("Bowser Fires", thing.left);
        
        // After a bit, re-open and fire
        thing.EightBitter.TimeHandler.addEvent(
            animateBowserFireOpen, 14, thing
        );
    }
    
    /**
     * Animation Function for when Bowser actually fires. A BowserFire Thing is
     * placed at his mouth, given a (rounded to unitsize * 8) destination y, and
     * sent firing to the player.
     * 
     * @param {Bowser} thing
     */
    function animateBowserFireOpen(thing) {
        var unitsize = thing.EightBitter.unitsize,
            ylev = Math.max(
                -thing.height * unitsize,
                Math.round(thing.EightBitter.player.bottom / (unitsize * 8)) 
                    * unitsize * 8
            );

        if (!thing.EightBitter.isThingAlive(thing)) {
            return true;
        }
        
        thing.EightBitter.removeClass(thing, "firing");
        thing.EightBitter.addThing(
            ["BowserFire", {
                "ylev": ylev
            }],
            thing.left - thing.EightBitter.unitsize * 8,
            thing.top + thing.EightBitter.unitsize * 4
        );
    }
    
    /**
     * Animation Function for when Bowser throws a Hammer. It's similar to a
     * HammerBro, but the hammer appears on top of Bowser for a few steps
     * before being thrown in the direction Bowser is facing (though it will
     * only be added if facing left).
     * 
     * @param {Bowser} thing
     */
    function animateBowserThrow(thing) {
        if (!thing.lookleft || !thing.EightBitter.isThingAlive(thing)) {
            return;
        }
        
        var hammer = thing.EightBitter.addThing(
            "Hammer", 
            thing.left + thing.EightBitter.unitsize * 2,
            thing.top - thing.EightBitter.unitsize * 2
        );
        
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            if (!thing.EightBitter.isThingAlive(thing)) {
                thing.EightBitter.killNormal(hammer);
                return true;
            }
            
            thing.EightBitter.setTop(
                hammer, thing.top - thing.EightBitter.unitsize * 2
            );
            if (thing.lookleft) {
                thing.EightBitter.setLeft(
                    hammer,
                    thing.left + thing.EightBitter.unitsize * 2,
                    thing.top - thing.EightBitter.unitsize * 2
                );
            } else {
                thing.EightBitter.setLeft(
                    hammer, 
                    thing.right - thing.EightBitter.unitsize * 2, 
                    thing.top - thing.EightBitter.unitsize * 2
                );
            }
        }, 1, 14);
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            hammer.xvel = thing.EightBitter.unitsize * 1.17;
            hammer.yvel = thing.EightBitter.unitsize * -2.1;
            // hammer.gravity = thing.EightBitter.MapScreener.gravity / 1.4;
            if (thing.lookleft) {
                hammer.xvel *= -1;
            }
        }, 14);
    }
    
    /**
     * Animation Function for when Bowser freezes upon the player hitting a 
     * CastleAxe. Velocity and movement are paused, then nofall is disabled 
     * after 70 steps.
     * 
     * @param {Bowser} thing
     */
    function animateBowserFreeze(thing) {
        thing.nofall = true;
        thing.nothrow = true;
        thing.movement = false;
        thing.dead = true;
        thing.EightBitter.thingPauseVelocity(thing);
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.nofall = false;
        }, 70);
    }
    
    /**
     * Animation Function for a standard jump, such as what HammerBros do. The
     * jump may be in either up or down, chosen at random by the NumberMaker.
     * Steps are taken to ensure the Thing does not collide at improper points
     * during the jump.
     * 
     * @param {Thing} thing
     */
    function animateJump(thing) {
        // Finish
        if (!thing.EightBitter.isThingAlive(thing)) {
            return true;
        }
        
        // Skip
        if (!thing.resting) {
            return;
        }
        
        // Jump up?
        if (
            thing.EightBitter.MapScreener.floor - (
                thing.bottom / thing.EightBitter.unitsize
            ) >= 30
            && thing.resting.title !== "Floor"
            && thing.EightBitter.NumberMaker.randomBoolean()
        ) {
            thing.falling = true;
            thing.yvel = thing.EightBitter.unitsize * -.7;
            thing.EightBitter.TimeHandler.addEvent(function () {
                thing.falling = false;
            }, 42);
        }
        // Jump down
        else {
            thing.nocollidesolid = true;
            thing.yvel = thing.EightBitter.unitsize * -2.1;
            thing.EightBitter.TimeHandler.addEvent(function () {
                thing.nocollidesolid = false;
            }, 42);
        }
        
        thing.resting = undefined;
    }
    
    /**
     * Animation Function for Bloopers starting to "unsqueeze". The "squeeze"
     * class is removed, their height is reset to 12, and their counter reset.
     * 
     * @param {Blooper} thing
     */
    function animateBlooperUnsqueezing(thing) {
        thing.counter = 0;
        thing.squeeze = false;
        
        thing.EightBitter.removeClass(thing, "squeeze");
        thing.EightBitter.setHeight(thing, 12, true, true);
    }
    
    /**
     * Animation Function for Podoboos jumping up. Their top is recorded and a 
     * large negative yvel is given; after the jumpheight number of steps, they
     * fall back down.
     * 
     * @param {Podoboo} thing
     */
    function animatePodobooJumpUp(thing) {
        thing.starty = thing.top;
        thing.yvel = thing.speed * -1;
        
        thing.EightBitter.TimeHandler.addEvent(
            thing.EightBitter.animatePodobooJumpDown,
            thing.jumpHeight, 
            thing
        );
    }
    
    /**
     * Animation Function for when a Podoboo needs to stop jumping. It obtains 
     * the movePodobooFalling movement to track its descent.
     * 
     * @param {Podoboo} thing
     */
    function animatePodobooJumpDown(thing) {
        thing.movement = thing.EightBitter.movePodobooFalling;
    }
    
    /**
     * Animation Function for a Lakitu throwing a SpinyEgg. The Lakitu hides
     * behind its cloud ("hiding" class), waits 21 steps, then throws an egg up
     * and comes out of "hiding".
     * 
     * @param {Lakitu} thing
     */
    function animateLakituThrowingSpiny(thing) {
        if (thing.fleeing || !thing.EightBitter.isThingAlive(thing)) {
            return true;
        }
        
        thing.EightBitter.switchClass(thing, "out", "hiding");
        thing.EightBitter.TimeHandler.addEvent(function () {
            if (thing.dead) {
                return;
            }
            var spawn = thing.EightBitter.addThing(
                "SpinyEgg", thing.left, thing.top
            );
            spawn.yvel = thing.EightBitter.unitsize * -2.1;
            thing.EightBitter.switchClass(thing, "hiding", "out");
        }, 21);
    }
    
    /**
     * Animation Function for when a SpinyEgg hits the ground. The SpinyEgg is
     * killed and a Spiny is put in its place, moving towards the player.
     * 
     * @param {SpinyEgg} thing
     */
    function animateSpinyEggHatching(thing) {
        if (!thing.EightBitter.isThingAlive(thing)) {
            return;
        }
        
        var spawn = thing.EightBitter.addThing(
            "Spiny", thing.left, thing.top - thing.yvel
        );
        spawn.moveleft = thing.EightBitter.objectToLeft(
            thing.EightBitter.player, spawn
        );
        thing.EightBitter.killNormal(thing);
    }
    
    /**
     * Animation Function for when a Fireball emerges from a player. All that
     * happens is the "Fireball" sound plays.
     * 
     * @param {Fireball} thing
     */
    function animateFireballEmerge(thing) {
        thing.EightBitter.AudioPlayer.play("Fireball");
    }
    
    /**
     * Animation Function for when a Fireball explodes. It is deleted and, 
     * unless big is === 2 (as this is used as a kill Function), a Firework is
     * put in its place.
     * 
     * @param {Fireball} thing
     * @param {Number} [big]   The "level" of death this is (a 2 implies this is
     *                         a sudden death, without animations).
     */
    function animateFireballExplode(thing, big) {
        thing.nocollide = true;
        thing.EightBitter.killNormal(thing);
        if (big === 2) {
            return;
        }
        
        var output = thing.EightBitter.addThing("Firework");
        thing.EightBitter.setMidXObj(output, thing);
        thing.EightBitter.setMidYObj(output, thing);
        output.animate(output);
    }
    
    /**
     * Animation Function for a Firework, triggered immediately upon spawning.
     * The Firework cycles between "n1" through "n3", then dies.
     * 
     * @param {Firework} thing
     */
    function animateFirework(thing) {
        var name = thing.className + " n",
            i;
        
        for (i = 0; i < 3; i += 1) {
            thing.EightBitter.TimeHandler.addEvent(function (i) {
                thing.EightBitter.setClass(thing, name + String(i + 1));
            }, i * 7, i);
        }
        
        thing.EightBitter.AudioPlayer.play("Firework");
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.EightBitter.killNormal(thing);
        }, i * 7);
    }
    
    /**
     * Animation Function for the Fireworks found at the end of 
     * EndOutsideCastle. numFireworks dicatates how many to place, and positions
     * are declared within.
     * 
     * @param {Collider} other 
     * @remarks The left of other is the right of player, and is 4 units away 
     *          from the center of the door.
     */
    function animateEndLevelFireworks(thing, other, numFireworks) {
        var doorRight = other.left,
            doorLeft = doorRight - thing.EightBitter.unitsize * 8,
            doorBottom = other.bottom,
            doorTop = doorBottom - thing.EightBitter.unitsize * 16,
            flag = thing.EightBitter.ObjectMaker.make("CastleFlag", {
                "position": "beginning"
            }),
            flagMovements = 28,
            fireInterval = 28,
            fireworkPositions = [
                [0, -48],
                [-8, -40],
                [8, -40],
                [-8, -32],
                [0, -48],
                [-8, -40]
            ],
            i = 0,
            firework, position;
        
        thing.EightBitter.addThing(
            flag,
            doorLeft + thing.EightBitter.unitsize,
            doorTop - thing.EightBitter.unitsize * 24
        );
        thing.EightBitter.arrayToBeginning(
            flag, thing.EightBitter.GroupHolder.getGroup(flag.groupType)
        );
        
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            thing.EightBitter.shiftVert(flag, thing.EightBitter.unitsize * -.25);
        }, 1, flagMovements);
        
        if (numFireworks > 0 ) {
            thing.EightBitter.TimeHandler.addEventInterval(function () {
                position = fireworkPositions[i];
                firework = thing.EightBitter.addThing(
                    "Firework",
                    thing.left + position[0] * thing.EightBitter.unitsize,
                    thing.top + position[1] * thing.EightBitter.unitsize
                );
                firework.animate(firework);
                i += 1;
            }, fireInterval, numFireworks);
        }
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.EightBitter.AudioPlayer.addEventImmediate(
                "Stage Clear", "ended", function () {
                    thing.EightBitter.collideLevelTransport(thing, other);
                }
            );
        }, i * fireInterval + 420);
    }
    
    /**
     * Animation Function for a Cannon outputting a BulletBill. This will only
     * happen if the Cannon isn't within 8 units of the player. The spawn flies
     * at a constant rate towards the player.
     * 
     * @param {Cannon} thing
     */
    function animateCannonFiring(thing) {
        if (!thing.EightBitter.isThingAlive(thing)) {
            return;
        }
        
        // Don't fire if Player is too close
        if (
            thing.EightBitter.player.right > (
                thing.left - thing.EightBitter.unitsize * 8
            )
            && thing.EightBitter.player.left < (
                thing.right + thing.EightBitter.unitsize * 8
            )
        ) {
            return;
        }
        
        var spawn = thing.EightBitter.ObjectMaker.make("BulletBill");
        if (thing.EightBitter.objectToLeft(thing.EightBitter.player, thing)) {
            spawn.direction = spawn.moveleft = true;
            spawn.xvel *= -1;
            thing.EightBitter.flipHoriz(spawn);
            thing.EightBitter.addThing(spawn, thing.left, thing.top);
        } else {
            thing.EightBitter.addThing(
                spawn, thing.left + thing.width, thing.top
            );
        }
        
        thing.EightBitter.AudioPlayer.playLocal("Bump", thing.right);
    }
    
    /**
     * Animation Function for a fiery player throwing a Fireball. The player may
     * only do so if fewer than 2 other thrown Fireballs exist. A new Fireball
     * is created in front of where the player is facing and are sent bouncing
     * away.
     * 
     * @param {Player} thing
     * @remarks Yes, it's called numballs.
     */
    function animatePlayerFire(thing) {
        if (thing.numballs >= 2) {
            return;
        }
        
        var ball = thing.EightBitter.ObjectMaker.make("Fireball", {
                "moveleft": thing.moveleft,
                "speed": thing.EightBitter.unitsize * 1.75,
                "jumpheight": thing.EightBitter.unitsize * 1.56,
                "gravity": thing.EightBitter.MapScreener.gravity * 1.56,
                "yvel": thing.EightBitter.unitsize,
                "movement": thing.EightBitter.moveJumping
            }),
            xloc = thing.moveleft
                ? (thing.left - thing.EightBitter.unitsize / 4)
                : (thing.right + thing.EightBitter.unitsize / 4);
        
        thing.EightBitter.addThing(
            ball, xloc, thing.top + thing.EightBitter.unitsize * 8
        );
        ball.animate(ball);
        ball.onDelete = function () {
            thing.numballs -= 1;
        };

        thing.numballs += 1;
        thing.EightBitter.addClass(thing, "firing");
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.EightBitter.removeClass(thing, "firing");
        }, 7);
    }
    
    /**
     * Animation Function that regularly spings CastleFireballs around their
     * parent CastleBlock. The CastleBlock's location and angle determine the
     * location of each CastleFireball, and its dt and direction determine how
     * the angle is changed for the next call.
     * 
     * @param {CastleBlock} thing
     * @param {CastleFireball[]} balls
     */
    function animateCastleBlock(thing, balls) {
        var ax = Math.cos(thing.angle * Math.PI) * thing.EightBitter.unitsize * 4,
            ay = Math.sin(thing.angle * Math.PI) * thing.EightBitter.unitsize * 4,
            i;
        
        for (i = 0; i < balls.length; i += 1) {
            thing.EightBitter.setMidX(balls[i], thing.left + ax * i);
            thing.EightBitter.setMidY(balls[i], thing.top + ay * i);
        }
        
        thing.angle += thing.dt * thing.direction;
    }
    
    /**
     * Animation Function to close a CastleBridge when the player triggers its
     * killonend after hitting the CastleAxe in EndInsideCastle. Its width is
     * reduced repeatedly on an interval until it's 0.
     * 
     * @param {CastleBridge} thing
     */
    function animateCastleBridgeOpen(thing) {
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.EightBitter.TimeHandler.addEventInterval(function () {
                thing.right -= thing.EightBitter.unitsize * 2;
                thing.EightBitter.setWidth(thing, thing.width - 2);
                thing.EightBitter.AudioPlayer.play("Break Block");
                
                if (thing.width <= 0) {
                    thing.EightBitter.AudioPlayer.play("Bowser Falls");
                    return true;
                }
            }, 1, Infinity);
        }, 7);
    }
    
    /**
     * Animation Function for when a CastleChain opens, which just delays a
     * killNormal call for 7 steps.
     * 
     * @param {CastleChain} thing
     */
    function animateCastleChainOpen(thing) {
        thing.EightBitter.TimeHandler.addEvent(killNormal, 7, thing);
    }
    
    /**
     * Animation Function for when the player paddles underwater. Any previous
     * Any previous paddling classes and cycle are removed, and a new one is 
     * added that, when it finishes, remnoves the player's paddlingCycle as 
     * well.
     * 
     * @param {Player} thing
     */
    function animatePlayerPaddling(thing) {
        if (!thing.paddlingCycle) {
            thing.EightBitter.removeClasses(
                thing, "skidding paddle1 paddle2 paddle3 paddle4 paddle5"
            );
            thing.EightBitter.addClass(thing, "paddling");
            thing.EightBitter.TimeHandler.cancelClassCycle(
                thing, "paddlingCycle"
            );
            thing.EightBitter.TimeHandler.addClassCycle(
                thing, 
                [
                    "paddle1", "paddle2", "paddle3", "paddle2", "paddle1",
                    function () {
                        return thing.paddlingCycle = false;
                    },
                ],
                "paddlingCycle", 
                7
            );
        }
        thing.paddling = thing.paddlingCycle = thing.swimming = true;
        thing.yvel = thing.EightBitter.unitsize * -.84;
    }
    
    /**
     * Animation Function for when a player lands to reset size and remove 
     * hopping (and if underwater, paddling) classes. The mod event is fired.
     * 
     * @param {Player} thing
     */
    function animatePlayerLanding(thing) {
        if (thing.crouching && thing.power > 1) {
            thing.EightBitter.setHeight(thing, 11, true, true);
        }
    
        if (thing.EightBitter.hasClass(thing, "hopping")) {
            thing.EightBitter.switchClass(thing, "hopping", "jumping");
        }
        
        if (thing.EightBitter.MapScreener.underwater) {
            thing.EightBitter.removeClass(thing, "paddling");
        }
        
        thing.EightBitter.ModAttacher.fireEvent(
            "onPlayerLanding", thing, thing.resting
        );
    }
    
    /**
     * Animation Function for when the player moves off a resting solid. It
     * sets resting to undefined, and if underwater, switches the "running" and
     * "paddling" classes.
     * 
     * @param {Player} thing
     */
    function animatePlayerRestingOff(thing) {
        thing.resting = undefined;
        if (thing.EightBitter.MapScreener.underwater) {
            thing.EightBitter.switchClass(thing, "running", "paddling");
        }
    }
    
    /**
     * Animation Function for when a player breathes a underwater. This creates
     * a Bubble, which slowly rises to the top of the screen.
     * 
     * @param {Player} thing
     */
    function animatePlayerBubbling(thing) {
        thing.EightBitter.addThing("Bubble", thing.right, thing.top);
    }
    
    /**
     * Animation Function to give the player a cycle of running classes. The 
     * cycle auto-updates its time as a function of how fast the player is 
     * moving relative to its maximum speed.
     * 
     * @param {Player} thing
     */
    function animatePlayerRunningCycle(thing) {
        thing.EightBitter.switchClass(thing, "still", "running");
        
        thing.running = thing.EightBitter.TimeHandler.addClassCycle(thing, [
            "one", "two", "three", "two"
        ], "running", function (event) {
            event.timeout = 5 + Math.ceil(
                thing.maxspeedsave - Math.abs(thing.xvel)
            );
        });
    }
    
    /**
     * Animation Function for when a player hops on an enemy. Resting is set to
     * undefined, and a small vertical yvel is given.
     * 
     * @param {Player} thing
     */
    function animateCharacterHop(thing) {
        thing.resting = undefined;
        thing.yvel = thing.EightBitter.unitsize * -1.4;
    }
    
    /**
     * Animation Function to start a player transferring through a Pipe. This is
     * generic for entrances and exists horizontally and vertically: movement
     * and velocities are frozen, size is reset, and the piping flag enabled. 
     * The player is also moved into the Scenery group to be behind the Pipe.
     * 
     * @param {Player} thing
     */
    function animatePlayerPipingStart(thing) {
        thing.nocollide = thing.nofall = thing.piping = true;
        thing.xvel = thing.yvel = 0;
        thing.movementOld = thing.movement;
        thing.movement = undefined;
        
        if (thing.power > 1) {
            thing.EightBitter.animatePlayerRemoveCrouch(thing);
            thing.EightBitter.setPlayerSizeLarge(thing);
        } else {
            thing.EightBitter.setPlayerSizeSmall(thing);
        }
        thing.EightBitter.removeClasses(thing, "jumping running crouching");
        
        thing.EightBitter.AudioPlayer.clearTheme();
        thing.EightBitter.TimeHandler.cancelAllCycles(thing);
        thing.EightBitter.GroupHolder.switchObjectGroup(
            thing, "Character", "Scenery"
        );
    }
    
    /**
     * Animation Function for when a player is done passing through a Pipe. This
     * is abstracted for exits both horizontally and vertically, typically after
     * an area has just been entered.
     * 
     * @param {Player} thing
     */
    function animatePlayerPipingEnd(thing) {
        thing.movement = thing.movementOld;
        thing.nocollide = thing.nofall = thing.piping = false;
        
        thing.EightBitter.AudioPlayer.resumeTheme();
        thing.EightBitter.GroupHolder.switchObjectGroup(
            thing, "Scenery", "Character"
        );
    }
    
    /**
     * Animation Function for when a player is hopping off a pole. It hops off
     * and faces the opposite direction.
     * 
     * @param {Player} thing
     * @param {Boolean} [doRun]   Whether the player should have a running cycle
     *                            added immediately, such as during cutscenes
     *                            (by default, false).
     */
    function animatePlayerOffPole(thing, doRun) {
        thing.EightBitter.removeClasses(thing, "climbing running");
        thing.EightBitter.addClass(thing, "jumping");
        
        thing.xvel = 1.4;
        thing.yvel = -.7;
        thing.nocollide = thing.nofall = false;
        thing.gravity = thing.EightBitter.MapScreener.gravity / 14;
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.movement = thing.EightBitter.movePlayer;
            thing.gravity = thing.EightBitter.MapScreener.gravity;
            
            thing.EightBitter.unflipHoriz(thing);
            
            if (doRun) {
                thing.EightBitter.animatePlayerRunningCycle(thing);
            }
        }, 21);
    }
    
    /**
     * Animation Function for when a player must hop off a Vine during an area's
     * opening cutscene. The player switches sides, waits 14 steps, then calls
     * animatePlayerOffPole.
     * 
     * @param {Player} thing
     */
    function animatePlayerOffVine(thing) {
        thing.EightBitter.flipHoriz(thing);
        thing.EightBitter.shiftHoriz(
            thing, 
            (thing.width - 1) * thing.EightBitter.unitsize
        );
        
        thing.EightBitter.TimeHandler.addEvent(
            thing.EightBitter.animatePlayerOffPole,
            14,
            thing
        );
    }
    
    
    /* Appearance utilities
    */
    
    /**
     * Makes one Thing look towards another, chainging lookleft and moveleft in
     * the process.
     * 
     * @param {Thing} thing
     * @param {Thing} other
     */
    function lookTowardsThing(thing, other) {
        // Case: other is to the left
        if (other.right <= thing.left) {
            thing.lookleft = true;
            thing.moveleft = true;
            thing.EightBitter.unflipHoriz(thing);
        }
        // Case: other is to the right
        else if (other.left >= thing.right) {
            thing.lookleft = false;
            thing.moveleft = false;
            thing.EightBitter.flipHoriz(thing);
        }
    }
    
    /**
     * Makes one Thing look towards the player, chainging lookleft and moveleft 
     * in the process.
     * 
     * @param {Thing} thing
     * @param {Boolean} [big]   Whether to always change lookleft and moveleft,
     *                          even if lookleft is already accurate (by 
     *                          default, false).
     */
    function lookTowardsPlayer(thing, big) {
        // Case: Player is to the left
        if (thing.EightBitter.player.right <= thing.left) {
            if (!thing.lookleft || big) {
                thing.lookleft = true;
                thing.moveleft = false;
                thing.EightBitter.unflipHoriz(thing);
            }
        }
        // Case: Player is to the right
        else if (thing.EightBitter.player.left >= thing.right) {
            if (thing.lookleft || big) {
                thing.lookleft = false;
                thing.moveleft = true;
                thing.EightBitter.flipHoriz(thing);
            }
        }
    }
    
    
    /* Death functions
    */
    
    /**
     * Standard Function to kill a Thing, which means marking it as dead and
     * clearing its numquads, resting, movement, and cycles. It will later be
     * marked as gone by its maintain* Function (Solids or Characters).
     * 
     * @param {Thing} thing
     */
    function killNormal(thing) {
        if (!thing) {
            return;
        }
        
        thing.hidden = thing.dead = true;
        thing.alive = false;
        thing.numquads = 0;
        thing.resting = thing.movement = undefined;
        
        if (thing.EightBitter) {
            thing.EightBitter.TimeHandler.cancelAllCycles(thing);
        }
        
        thing.EightBitter.ModAttacher.fireEvent("onKillNormal", thing);
    }
    
    /**
     * Death Function commonly called on characters to animate a small flip
     * before killNormal is called.
     * 
     * @param {Thing} thing
     * @param {Number} [extra]   How much time to wait beyond the standard 70
     *                           steps before calling killNormal (by default, 
     *                           0).
     */
    function killFlip(thing, extra) {
        thing.EightBitter.flipVert(thing);
        
        if (!extra) {
            extra = 0;
        }
        
        if (thing.bottomBump) {
            thing.bottomBump = undefined;
        }
        
        thing.nocollide = thing.dead = true;
        thing.speed = thing.xvel = thing.nofall = false;
        thing.resting = thing.movement = undefined;
        thing.yvel = -thing.EightBitter.unitsize;
        thing.EightBitter.TimeHandler.addEvent(
            thing.EightBitter.killNormal, 70 + extra, thing
        );
    }
    
    /**
     * Kill Function to replace a Thing with a spawned Thing, determined by the
     * thing's spawnType, in the same location.
     * 
     * @param {Thing} thing 
     * @param {Boolean} [big]   Whether this should skip creating the spawn (by
     *                          default, false).
     */
    function killSpawn(thing, big) {
        if (big) {
            thing.EightBitter.killNormal(thing);
            return;
        }
        
        if (!thing.spawnType) {
            throw new Error("Thing " + thing.title + " has no .spawnType.");
        }
        
        var spawn = thing.EightBitter.ObjectMaker.make(
            thing.spawnType,
            thing.spawnSettings || {}
        );
        thing.EightBitter.addThing(spawn);
        thing.EightBitter.setBottom(spawn, thing.bottom);
        thing.EightBitter.setMidXObj(spawn, thing);
        
        thing.EightBitter.killNormal(thing);
        
        return spawn;
    }
    
    /**
     * A kill Function similar to killSpawn but more configurable. A spawned 
     * Thing is created with the given attributes and copies over any specified
     * attributes from the original Thing.
     * 
     * @param {Thing} thing
     * @param {String} type   The type of new Thing to create, such as "Goomba".
     * @param {Object} [attributes]   An optional object to pass in to the
     *                                ObjectMaker.make call (by default, {}).
     * @param {String[]} [attributesCopied]   An optional listing of attributes
     *                                        to copy from the original Thing
     *                                        (by default, none).
     */
    function killReplace(thing, type, attributes, attributesCopied) {
        var spawn, i;
        
        if (typeof attributes === "undefined") {
            attributes = {};
        }
        
        if (typeof attributesCopied !== "undefined") {
            for (i = 0; i < attributesCopied.length; i += 1) {
                attributes[attributesCopied[i]] = thing[attributesCopied[i]];
            }
        }
        
        spawn = thing.EightBitter.ObjectMaker.make(type, attributes);
        
        if (thing.flipHoriz) {
            thing.EightBitter.flipHoriz(spawn);
        }
        
        if (thing.flipVert) {
            thing.EightBitter.flipVert(spawn);
        }
        
        thing.EightBitter.addThing(spawn, thing.left, thing.top);
        thing.EightBitter.killNormal(thing);
        
        return spawn;
    }
    
    /**
     * Kill Function for Goombas. If big isn't specified, it replaces the 
     * killed Goomba with a DeadGoomba via killSpawn.
     * 
     * @param {Thing} thing
     * @param {Boolean} [big]   Whether to call killFlip on the Thing instead of
     *                          killSpawn, such as when a Shell hits it.
     */
    function killGoomba(thing, big) {
        if (big) {
            thing.EightBitter.killFlip(thing);
            return;
        }
        
        thing.EightBitter.killSpawn(thing);
    }
    
    /**
     * Kill Function for Koopas. Jumping and floating Koopas are replacing with
     * an equivalent Koopa that's just walking, while walking Koopas become
     * Shells.
     * 
     * @param {Koopa} thing
     * @param {Boolean} [big]   Whether shells should be immediately killed.
     * @remarks This isn't called when a Shell hits a Koopa.
     */
    function killKoopa(thing, big) {
        var spawn;
        
        if (thing.jumping || thing.floating) {
            spawn = thing.EightBitter.killReplace(
                thing, "Koopa", undefined, ["smart", "direction", "moveleft"]
            );
            spawn.xvel = spawn.moveleft ? -spawn.speed : spawn.speed;
        } else {
            spawn = thing.EightBitter.killToShell(thing, big);
        }
        
        return spawn;
    }
    
    /**
     * Kill Function for Bowsers. In reality this is only called when the player
     * Fireballs him or all NPCs are to be killed. It takes five Fireballs to 
     * killFlip a Bowser, which scores 5000 points.
     * 
     * @param {Bowser} thing
     * @param {Boolean} [big]   Whether this should default to killFlip, as in
     *                          an EndInsideCastle cutscene.
     */
    function killBowser(thing, big) {
        if (big) {
            thing.nofall = false;
            thing.movement = undefined;
            thing.EightBitter.killFlip(thing.EightBitter.killSpawn(thing));
            return;
        }
        
        thing.deathcount += 1;
        if (thing.deathcount === 5) {
            thing.yvel = 0;
            thing.speed = 0;
            thing.movement = 0;
            thing.EightBitter.killFlip(thing.EightBitter.killSpawn(thing), 350);
            thing.EightBitter.scoreOn(5000, thing);
        }
    }
    
    /**
     * Kills a Thing by replacing it with another Thing, typically a Shell or
     * BeetleShell (determined by thing.shelltype). The spawn inherits smartness
     * and location from its parent, and is temporarily given nocollidechar to
     * stop double collision detections.
     * 
     * @param {Thing} thing
     * @param {Boolean} [big]   Whether the spawned Shell should be killed
     *                          immediately (by default, false).
     */
    function killToShell(thing, big) {
        var spawn, nocollidecharold, nocollideplayerold;
        
        thing.spawnSettings = {
            "smart": thing.smart
        };
            
        if (big && big !== 2) {
            thing.spawnType = thing.title;
        } else {
            thing.spawnType = thing.shelltype || "Shell";
        }
        
        thing.spawnSettings = {
            "smart": thing.smart
        };
        
        spawn = thing.EightBitter.killSpawn(thing);
        nocollidecharold = spawn.nocollidechar;
        nocollideplayerold = spawn.nocollideplayer;
        spawn.nocollidechar = true;
        spawn.nocollideplayer = true;
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            spawn.nocollidechar = nocollidecharold;
            spawn.nocollideplayer = nocollideplayerold;
        }, 7);
        
        thing.EightBitter.killNormal(thing);
        
        if (big === 2) {
            thing.EightBitter.killFlip(spawn);
        }
    }
    
    /**
     * Wipes the screen of any characters or solids that should be gone during
     * an important cutscene, such as hitting an end-of-level flag.
     * For characters, they're deleted if .nokillonend isn't truthy. If they
     * have a .killonend function, that's called on them.
     * Solids are only deleted if their .killonend is true.
     * 
     * @remarks If thing.killonend is a Function, it is called on the Thing.
     * @todo   Rename .killonend to be more accurate
     */
    function killNPCs() {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            group, thing, i;
        
        // Characters: they must opt out of being killed with .nokillonend, and
        // may opt into having a function called instead (such as Lakitus).
        group = EightBitter.GroupHolder.getCharacterGroup();
        for (i = group.length - 1; i >= 0; --i) {
            thing = group[i];
            
            if (!thing.nokillend) {
                thing.EightBitter.killNormal(thing);
                thing.EightBitter.arrayDeleteThing(thing, group, i);
            } else if (thing.killonend) {
                thing.killonend(thing);
            }
        }
        
        // Solids: they may opt into being deleted
        group = EightBitter.GroupHolder.getSolidGroup();
        for (i = group.length - 1; i >= 0; --i) {
            thing = group[i];
            
            if (thing.killonend) {
                if (thing.killonend instanceof Function) {
                    thing.killonend(thing, group, i);
                } else {
                    thing.EightBitter.arrayDeleteThing(thing, group, i);
                }
            }
        }
    }
    
    /**
     * Kill Function for Bricks. The Brick is killed an an animateBrickShards
     * animation is timed. If other is provided, it's also marked as the Brick's
     * up, which will kill colliding characters: this works because 
     * maintainSolids happens before maintainCharacters, so the killNormal won't
     * come into play until after the next maintainCharacters call.
     * 
     * @param {Brick} thing
     * @param {Thing} [other]   An optional Thing to mark as the cause of the
     *                          Brick's death (its up attribute). 
     */
    function killBrick(thing, other) {
        thing.EightBitter.AudioPlayer.play("Break Block");
        thing.EightBitter.TimeHandler.addEvent(
            thing.EightBitter.animateBrickShards, 1, thing
        );
        thing.EightBitter.killNormal(thing);
        
        if (
            other instanceof thing.EightBitter.ObjectMaker.getFunction("Thing")
        ) {
            thing.up = other;
        } else {
            thing.up = undefined;
        }
    }
    
    /**
     * Kill Function for the player. It's big and complicated, but in general...
     * 1. If big === 2, just kill it altogether
     * 2. If the player is large and big isn't true, just power down the player.
     * 3. The player can't survive this, so animate the "shrug" class and an
     *    up-then-down movement. 
     * At the end of 1. and 3., decrease the "lives" and "power" statistics and
     * call the equivalent onPlayerDeath or onGameOver callbacks, depending on
     * how many lives are left. The mod event is also fired.
     * 
     * @param {Thing} thing
     * @param {Number} [big]   The severity of this death: 0 for normal, 1 for
     *                         not survivable, 2 for immediate death.
     */
    function killPlayer(thing, big) {
        if (!thing.alive || thing.flickering || thing.dying) {
            return;
        }
        
        var EightBitter = thing.EightBitter,
            area = thing.EightBitter.MapsHandler.getArea();
        
        // Large big: real, no-animation death
        if (big === 2) {
            thing.dead = thing.dying = true;
            thing.alive = false;
            EightBitter.MapScreener.notime = true;
        }
        // Regular big: regular (enemy, time, etc.) kill
        else {
            // If the player can survive this, just power down
            if (!big && thing.power > 1) {
                thing.power = 1;
                EightBitter.StatsHolder.set("power", 1);
                EightBitter.AudioPlayer.play("Power Down");
                EightBitter.playerGetsSmall(thing);
                return;
            }
            // The player can't survive this: animate a death
            else {
                thing.dying = true;
                
                EightBitter.setSize(thing, 7.5, 7, true);
                EightBitter.updateSize(thing);
                EightBitter.setClass(thing, "character player dead");
                EightBitter.thingPauseVelocity(thing);
                EightBitter.arrayToEnd(
                    thing, EightBitter.GroupHolder.getGroup(thing.groupType)
                );
                
                EightBitter.MapScreener.notime = true;
                EightBitter.MapScreener.nokeys = true;
                
                EightBitter.TimeHandler.cancelAllCycles(thing);
                EightBitter.TimeHandler.addEvent(function () {
                    EightBitter.thingResumeVelocity(thing, true);
                    thing.nocollide = true;
                    thing.movement = thing.resting = undefined;
                    thing.gravity = EightBitter.MapScreener.gravity / 2.1;
                    thing.yvel = FullScreenMario.unitsize * -1.4;
                }, 7);
            }
        }
        
        thing.nocollide = thing.nomove = thing.dead = true;
        EightBitter.MapScreener.nokeys = true;
        EightBitter.AudioPlayer.clearAll();
        EightBitter.AudioPlayer.play("Player Dies");
        EightBitter.StatsHolder.decrease("lives");
        EightBitter.StatsHolder.set("power", 1);
        
        if (EightBitter.StatsHolder.get("lives") > 0) {
            EightBitter.TimeHandler.addEvent(
                area.onPlayerDeath.bind(
                    EightBitter
                ),
                area.onPlayerDeathTimeout,
                EightBitter
            );
        } else {
            EightBitter.TimeHandler.addEvent(
                area.onGameOver.bind(
                    EightBitter
                ),
                area.onGameOverTimeout,
                EightBitter
            );
        }
    }
    
    
    /* Scoring
    */
    
    /**
     * @this {EightBittr}
     * @param {Number} level   What number call this is in a chain of scoring
     *                         events, such as a Shell or hopping spree.
     * @return {Number}   How many points should be gained (if 0, that means the
     *                    maximum points were passed and gainLife was called).
     */
    function findScore(level) {
        var EightBitter = EightBittr.ensureCorrectCaller(this);

        if (level < EightBitter.pointLevels.length) {
            return EightBitter.pointLevels[level];
        }

        EightBitter.gainLife(1);
        return 0;
    }
    
    /**
     * Driver function to score some number of points for the player and show
     * the gains via an animation.
     * 
     * @this {EightBittr}
     * @param {Number} value   How many points the player is receiving.
     * @param {Boolean} continuation   Whether the game shouldn't increase the 
     *                                 score amount in the StatsHoldr (this will
     *                                 only be false on the first score() call).
     * @remarks   For point gains that should not have a visual animation, 
     *            directly call StatsHolder.increase("score", value).
     * @remarks   The calling chain will be: 
     *                score -> scoreOn -> scoreAnimateOn -> scoreAnimate          
     */
    function score(value, continuation) {
        var EightBitter = EightBittr.ensureCorrectCaller(this);
        
        if (!value) {
            return;
        }
        EightBitter.scoreOn(value, EightBitter.player, true);
        
        if (!continuation) {
            this.StatsHolder.increase("score", value);
        }
    }
    
    /**
     * Scores a given number of points for the player, and shows the gains via
     * an animation centered at the top of a thing.
     * 
     * @param {Number} value   How many points the player is receiving.
     * @param {Thing} thing   An in-game Thing to place the visual score text
     *                        on top of and centered.
     * @param {Boolean} continuation   Whether the game shouldn't increase the 
     *                                 score amount in the StatsHoldr (this will
     *                                 only be false on the first score() call).
     * @remarks   The calling chain will be: 
     *                scoreOn -> scoreAnimateOn -> scoreAnimate     
     */
    function scoreOn(value, thing, continuation) {
        if (!value) {
            return;
        }
        var text = thing.EightBitter.addThing("Text" + value);
        
        thing.EightBitter.scoreAnimateOn(text, thing);
        
        if (!continuation) {
            this.StatsHolder.increase("score", value);
        }
        
        thing.EightBitter.ModAttacher.fireEvent("onScoreOn", value, thing, continuation);
    }
    
    /**
     * Centers a text associated with some points gain on the top of a Thing,
     * and animates it updward, setting an event for it to die.
     * 
     * @param {Number} value   How many points the player is receiving.
     * @param {Thing} thing   An in-game Thing to place the visual score text
     *                        on top of and centered.
     * @param {Boolean} continuation   Whether the game shouldn't increase the 
     *                                 score amount in the StatsHoldr (this will
     *                                 only be false on the first score() call).
     * @remarks   The calling chain will be: 
     *                scoreAnimateOn -> scoreAnimate     
     */
    function scoreAnimateOn(text, thing) {
        thing.EightBitter.setMidXObj(text, thing);
        thing.EightBitter.setBottom(text, thing.top);
        thing.EightBitter.scoreAnimate(text);
    }
    
    /**
     * Animates a score on top of a Thing.
     * 
     * @param {Thing} thing   
     * @param {Number} [timeout]   How many game ticks to wait before killing
     *                             the text (defaults to 35).
     * @remarks   This is the last function in the score() calling chain:
     *                scoreAnimate <- scoreAnimateOn <- scoreOn <- score
     */
    function scoreAnimate(thing, timeout) {
        timeout = timeout || 28;
        thing.EightBitter.TimeHandler.addEventInterval(
            thing.EightBitter.shiftVert,
            1,
            timeout,
            thing,
            -thing.EightBitter.unitsize / 6
        );
        thing.EightBitter.TimeHandler.addEvent(
            thing.EightBitter.killNormal, timeout, thing
        );
    }
    
    /**
     * Inelegant catch-all Function for when the player has hit a shell and 
     * needs points to be scored. This takes into account player star status and
     * Shell resting and peeking. With none of those modifiers, it defaults to
     * scoreOn with 400.
     * 
     * @param {Player} thing
     * @param {Shell} other
     * @remarks See http://themushroomkingdom.net/smb_breakdown.shtml
     */
    function scorePlayerShell(thing, other) {
        // Star player: 200 points
        if (thing.star) {
            thing.EightBitter.scoreOn(200, other);
            return;
        }
        
        // Shells in the air: 8000 points (see guide)
        if (!other.resting) {
            thing.EightBitter.scoreOn(8000, other);
            return;
        }
        
        // Peeking shells: 1000 points
        if (other.peeking) {
            thing.EightBitter.scoreOn(1000, other);
            return;
        }
        
        // Already hopping: 500 points
        if (thing.jumpcount) {
            thing.EightBitter.scoreOn(500, other);
            return;
        }
        
        // All other cases: the shell's default
        thing.EightBitter.scoreOn(400, other);
    }
    
    /**
     * Determines the amount a player should score upon hitting a flag, based on
     * the player's y-position.
     * 
     * @param {Player} thing
     * @param {Number} difference   How far up the pole the collision happened,
     *                              by absolute amount (not multiplied by 
     *                              unitsize).
     * @return {Number}
     * @remarks See http://themushroomkingdom.net/smb_breakdown.shtml
     */
    function scorePlayerFlag(thing, difference) {
        var amount;
        
        if (difference < 28) {
            amount = difference < 8 ? 100 : 400;
        } else if (difference < 40) {
            amount = 800;
        } else {
            amount = difference < 62 ? 2000 : 5000;
        }
        
        return amount;
    }
    
    
    /* Audio
    */
    
    /**
     * @param {EightBittr} EightBitter
     * @param {Number} xloc   The x-location of the sound's source.
     * @return {Number} How loud the sound should be at that position, in [0,1].
     *                  This is louder closer to the player, and nothing to
     *                  the right of the visible screen.
     */
    function getVolumeLocal(EightBitter, xloc) {
        if (xloc > EightBitter.MapScreener.right) {
            return 0;
        }
        
        return Math.max(
            .14,
            Math.min(
                .84,
                (
                    EightBitter.MapScreener.width - Math.abs(
                        xloc - EightBitter.player.left
                    )
                ) / EightBitter.MapScreener.width
            )
        );
    }
    
    /**
     * @param {EightBittr} EightBitter
     * @return {String} The name of the default audio for the current area,
     *                  which is the first word in the area's setting (split on
     *                  spaces).
     */
    function getAudioThemeDefault(EightBitter) {
        return EightBitter.MapsHandler.getArea().setting.split(' ')[0];
    }
    
    
    /* Map sets
    */
    
    /**
     * Sets the game state to a new map, resetting all Things and inputs in the
     * process. The mod events are fired.
     * 
     * @param {String} [name]   The name of the map (by default, the currently
     *                          played one).
     * @param {Mixed} [location]   The name of the location within the map (by
     *                             default 0 for the first in Array form).
     * @remarks Most of the work here is done by setLocation.
     */
    function setMap(name, location) {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            map;
        
        if (typeof name === "undefined" || name instanceof EightBittr) {
            name = EightBitter.MapsHandler.getMapName();
        }
        
        map = EightBitter.MapsHandler.setMap(name);
        
        EightBitter.ModAttacher.fireEvent("onPreSetMap", map);
        
        EightBitter.NumberMaker.resetFromSeed(map.seed);
        EightBitter.StatsHolder.set("world", name);
        EightBitter.InputWriter.restartHistory();

        EightBitter.ModAttacher.fireEvent("onSetMap", map);
        
        EightBitter.setLocation(
            location
            || map.locationDefault
            || EightBitter.settings.maps.locationDefault
        );
    }
    
    /**
     * Sets the game state to a location within the current map, resetting all
     * Things, inputs, the current Area, PixelRender, and MapScreener in the
     * process. The location's entry Function is called to bring a new Player
     * into the game. The mod events are fired.
     * 
     * @param {Mixed} [location]   The name of the location within the map (by
     *                             default 0 for the first in Array form).
     */
    function setLocation(name) {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            location;
        
        EightBitter.MapScreener.nokeys = false;
        EightBitter.MapScreener.notime = false;
        EightBitter.MapScreener.canscroll = true;
        EightBitter.MapScreener.clearScreen();
        EightBitter.GroupHolder.clearArrays();
        EightBitter.TimeHandler.cancelAllEvents();
        
        EightBitter.MapsHandler.setLocation(name || 0);
        EightBitter.MapScreener.setVariables();
        location = EightBitter.MapsHandler.getLocation(name || 0);
        
        EightBitter.ModAttacher.fireEvent("onPreSetLocation", location)
        
        EightBitter.PixelDrawer.setBackground(
            EightBitter.MapsHandler.getArea().background
        );
        
        EightBitter.TimeHandler.addEventInterval(function () {
            if (!EightBitter.MapScreener.notime) {
                EightBitter.StatsHolder.decrease("time", 1);
            }
            if (!EightBitter.StatsHolder.get("time")) {
                return true;
            }
        }, 25, Infinity);
        
        EightBitter.StatsHolder.set(
            "time", EightBitter.MapsHandler.getArea().time
        );
  
        EightBitter.AudioPlayer.clearAll();
        EightBitter.AudioPlayer.playTheme();
        
        EightBitter.QuadsKeeper.resetQuadrants();
        
        location.entry(EightBitter, location);
        
        EightBitter.ModAttacher.fireEvent("onSetLocation", location);
        
        EightBitter.GamesRunner.play();
    }
    
    /* Map entrances
    */
     
    /**
     * Standard map entrance Function for dropping from the ceiling. A new 
     * player is placed 16x16 units away from the top-left corner, with
     * location.xloc scrolling applied if necessary.
     * 
     * @param {EightBittr} EightBittr
     * @param {Location} [location]   The calling Location entering into (by
     *                                default, not used).
     */
    function mapEntranceNormal(EightBitter, location) {
        if (location && location.xloc) {
           EightBitter.scrollWindow(location.xloc * EightBitter.unitsize);
       }
       
       EightBitter.addPlayer(
           EightBitter.unitsize * 16,
           EightBitter.unitsize * 16
       );
    }
    
    /**
     * Standard map entrance Function for starting on the ground. A new player
     * is placed 16x16 units away from the top-left corner, with location.xloc
     * scrolling applied if necessary.
     * 
     * @param {EightBittr} EightBittr
     * @param {Location} [location]   The calling Location entering into (by
     *                                default, not used).
     */
    function mapEntrancePlain(EightBitter, location) {
       if (location && location.xloc) {
           EightBitter.scrollWindow(location.xloc * EightBitter.unitsize);
       }
       
       EightBitter.addPlayer(
           EightBitter.unitsize * 16,
           EightBitter.MapScreener.floor * EightBitter.unitsize
       );
        
    }
     
    /**
     * Map entrance Function for starting on the ground and immediately walking
     * as if in a cutscene. mapEntrancePlain is immediately called, and the 
     * player has movement forced to be walking, with nokeys and notime set to
     * true.
     * 
     * @param {EightBittr} EightBitter
     * @param {Location} [location]   The calling Location entering into (by
     *                                default, not used).
     */
    function mapEntranceWalking(EightBitter, location) {
       EightBitter.mapEntrancePlain(EightBitter, location);
       
       EightBitter.player.keys.run = 1;
       EightBitter.player.maxspeed = EightBitter.player.walkspeed;
       
       EightBitter.MapScreener.nokeys = true;
       EightBitter.MapScreener.notime = true;
    }
     
    /**
     * Map entrance Function for entering a castle area. The player is simply
     * added at 2 x 56.
     * 
     * @param {EightBittr} EightBitter
     */
    function mapEntranceCastle(EightBitter) {
        EightBitter.addPlayer(
            EightBitter.unitsize * 2,
            EightBitter.unitsize * 56
        );
    }
    
    /**
     * Map entrance Function for entering an area climbing a Vine. The Vine 
     * enters first by growing, then the player climbs it and hops off. The 
     * player's actions are done via mapEntranceVinePlayer and are triggered
     * when the Vine's top reaches its threshold.
     * 
     * @param {EightBittr} EightBittr
     */
    function mapEntranceVine(EightBitter) {
        var vine = EightBitter.addThing(
                "Vine", 
                EightBitter.unitsize * 32,
                EightBitter.MapScreener.bottom + EightBitter.unitsize * 8
            ),
            threshold = (
                EightBitter.MapScreener.bottom - EightBitter.unitsize * 40
            );
        
        EightBitter.TimeHandler.addEventInterval(function () {
            if (vine.top < threshold) {
                vine.movement = undefined;
                EightBitter.mapEntranceVinePlayer(EightBitter, vine);
                return true;
            }
        }, 1, Infinity);
    }
    
    /**
     * Continuation of mapEntranceVine for the player's actions. The player
     * climbs up the Vine; once it reaches the threshold, it hops off using
     * animatePlayerOffVine.
     * 
     * @param {EightBittr} EightBitter
     * @param {Vine} vine
     */
     function mapEntranceVinePlayer(EightBitter, vine) {
         var threshold = (
                EightBitter.MapScreener.bottom - EightBitter.unitsize * 24
            ),
            speed = EightBitter.unitsize / -4,
            player = EightBitter.addPlayer(
                EightBitter.unitsize * 29,
                EightBitter.MapScreener.bottom - EightBitter.unitsize * 4
            );
        
        EightBitter.shiftVert(player, player.height * EightBitter.unitsize);
        
        EightBitter.collideVine(player, vine);
        
        EightBitter.TimeHandler.addEventInterval(function () {
            EightBitter.shiftVert(player, speed);
            if (player.top < threshold) {
                EightBitter.TimeHandler.addEvent(
                    EightBitter.animatePlayerOffVine, 49, player
                );
                return true;
            }
        }, 1, Infinity);
    }
    
    /**
     * Map entrance Function for coming in through a vertical Pipe. The player 
     * is added just below the top of the Pipe, and is animated to rise up 
     * through it like an Italian chestburster.
     * 
     * @param {EightBittr} EightBittr
     * @param {Location} [location]   The calling Location entering into (by
     *                                default, not used).
     */
    function mapEntrancePipeVertical(EightBitter, location) {
        if (location && location.xloc) {
            EightBitter.scrollWindow(location.xloc * EightBitter.unitsize);
        }
        
        EightBitter.addPlayer(
            (
                location.entrance.left 
                + EightBitter.player.width * EightBitter.unitsize / 2
            ),
            (
                location.entrance.top 
                + EightBitter.player.height * EightBitter.unitsize
            )
        );
        
        EightBitter.animatePlayerPipingStart(EightBitter.player);
        EightBitter.AudioPlayer.play("Pipe");
        
        EightBitter.TimeHandler.addEventInterval(function () {
            EightBitter.shiftVert(EightBitter.player, EightBitter.unitsize / -4);
            
            if (EightBitter.player.bottom <= location.entrance.top) {
                EightBitter.animatePlayerPipingEnd(EightBitter.player);
                return true;
            }
        }, 1, Infinity);
    }
    
    /**
     * Map entrance Function for coming in through a horizontal Pipe. The player 
     * is added just to the left of the entrance, and is animated to pass  
     * through it like an Italian chestburster.
     * 
     * @param {EightBittr} EightBittr
     * @param {Location} [location]   The calling Location entering into (by
     *                                default, not used).
     */
    function mapEntrancePipeHorizontal(EightBitter, location) {
        throw new Error("mapEntrancePipeHorizontal is not yet implemented.");
    }
    
    /**
     * Map entrance Function for the player reincarnating into a level, 
     * typically from a random map. The player is placed at 16 x 0 and a
     * Resting Stone placed some spaces below via playerAddRestingStone.
     * 
     * @param {EightBittr} EightBitter
     */
    function mapEntranceRespawn(EightBitter) {
        EightBitter.MapScreener.nokeys = false;
        EightBitter.MapScreener.notime = false;
        EightBitter.MapScreener.canscroll = true;
        
        EightBitter.addPlayer(EightBitter.unitsize * 16, 0);
        EightBitter.animateFlicker(EightBitter.player);
        
        if (!EightBitter.MapScreener.underwater) {
            EightBitter.playerAddRestingStone(EightBitter.player);
        }
        
        EightBitter.ModAttacher.fireEvent("onPlayerRespawn");
    }
    
    
    /* Map exits
    */
    
    /**
     * Map exit Function for leaving through a vertical Pipe. The player is
     * animated to pass through it and then transfer locations.
     * 
     * @param {Player} thing
     * @param {Pipe} other
     */
    function mapExitPipeVertical(thing, other) {
        if (!thing.resting || typeof(other.transport) === "undefined"
                || thing.right + thing.EightBitter.unitsize * 2 > other.right 
                || thing.left - thing.EightBitter.unitsize * 2 < other.left) {
            return;
        }
        
        thing.EightBitter.animatePlayerPipingStart(thing);
        thing.EightBitter.AudioPlayer.play("Pipe");
        
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            thing.EightBitter.shiftVert(thing, thing.EightBitter.unitsize / 4);
            
            if (thing.top > other.top) { 
                thing.EightBitter.TimeHandler.addEvent(function () {
                    if (other.transport.constructor === Object) {
                        thing.EightBitter.setMap(other.transport.map);
                    } else {
                        thing.EightBitter.setLocation(other.transport);
                    }
                }, 42);
                return true;
            }
        }, 1, Infinity);
    }
    
    /**
     * Map exit Function for leaving through a horiontal Pipe. The player is
     * animated to pass through it and then transfer locations.
     * 
     * @param {Player} thing
     * @param {Pipe} other
     * @param {Boolean} [shouldTransport]   Whether not resting and not paddling
     *                                      does not imply the player cannot
     *                                      pass through the Pipe (by default,
     *                                      false, as this is normal).
     * @remarks The shouldTransport argument was added because the "Bouncy 
     *          Bounce!" mod rendered some areas unenterable without it.
     */
    function mapExitPipeHorizontal(thing, other, shouldTransport) {
        if (!shouldTransport && !thing.resting && !thing.paddling) {
            return;
        }
        
        if (thing.top < other.top || thing.bottom > other.bottom) {
            return;
        }
        
        if (!thing.keys.run) {
            return;
        }
        
        thing.EightBitter.animatePlayerPipingStart(thing);
        thing.EightBitter.AudioPlayer.play("Pipe");
        
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            thing.EightBitter.shiftHoriz(thing, thing.EightBitter.unitsize / 4);
            
            if (thing.left > other.left) { 
                thing.EightBitter.TimeHandler.addEvent(function () {
                    thing.EightBitter.setLocation(other.transport);
                }, 42);
                return true;
            }
        }, 1, Infinity);
    }
    
    
    /* Map creation
    */
    
    /**
     * The onMake callback for Areas. Attributes are copied as specified in the
     * prototype, and the background is set based on the setting.
     * 
     * @this {Area}
     */
    function initializeArea() {
        var setting = this.setting,
            i;
        
        // Copy all attributes, if they exist
        if (this.attributes) {
            for (i in this.attributes) {
                if (this[i]) {
                    // Add the extra options
                    proliferate(this, this.attributes[i]);
                }
            }
        }
        
        this.setBackground(this);
    }
    
    /**
     * Sets an area's background as a function of its setting.
     * 
     * @param {Area} area
     * @remarks In the future, it might be more elegant to make Areas inherit
     * from base Area types (Overworld, etc.) so  this inelegant switch
     * statement doesn't have to be used.
     */
    function setAreaBackground(area) {
        // Non-underwater Underworld, Castle, and all Nights: black background
        if (
            area.setting.indexOf("Underwater") === -1
            && (
                area.setting.indexOf("Underworld") !== -1
                || area.setting.indexOf("Castle") !== -1
                || area.setting.indexOf("Night") !== -1
            )
        ) {
            area.background = "#000000";
        } 
        // Default (typically Overworld): sky blue background
        else {
            area.background = "#5c94fc";
        }
    }
    
    /**
     * @param {Number} yloc   A height to find the distance to the floor from.
     * @param {Boolean} [correctUnitsize]   Whether the yloc accounts for 
     *                                      unitsize expansion (e.g. 48 rather
     *                                      than 12, for unitsize=4).
     * @return {Number} The distance from the absolute base (bottom of the 
     *                  user's viewport) to a specific height above the floor 
     *                  (in the form given by map functions, distance from the 
     *                  floor).
     */
    function getAbsoluteHeight(yloc, correctUnitsize) {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            height = yloc + EightBitter.MapScreener.height;
        
        if (!correctUnitsize) {
            height *= EightBitter.unitsize;
        }
        
        return height;
    }
    
    /**
     * Adds a PreThing to the map and stretches it to fit a width equal to the 
     * current map's outermost boundaries.
     * 
     * @this {EightBittr}
     * @param {PreThing} prething
     * @return {Thing} A strethed Thing, newly added via addThing.
     */
    function mapAddStretched(prething) {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            boundaries = EightBitter.MapsHandler.getArea().boundaries,
            y = (
                (EightBitter.MapScreener.floor - prething.y) 
                * EightBitter.unitsize
            ),
            thing = EightBitter.ObjectMaker.make(prething.thing, {
                "width": boundaries.right - boundaries.left,
                "height": (
                    prething.height || EightBitter.getAbsoluteHeight(prething.y)
                )
            });
        
        return EightBitter.addThing(thing, boundaries.left, y);
    }
    
    /**
     * Analyzes a PreThing to be placed to the right of the current map's
     * boundaries (after everything else).
     * 
     * @this {EightBittr}
     * @param {PreThing} prething
     */
    function mapAddAfter(prething) {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            MapsCreator = EightBitter.MapsCreator,
            MapsHandler = EightBitter.MapsHandler,
            prethings = MapsHandler.getPreThings(),
            area = MapsHandler.getArea(),
            map = MapsHandler.getMap(),
            boundaries = EightBitter.MapsHandler.getArea().boundaries;
        
        prething.x = boundaries.right;
        MapsCreator.analyzePreSwitch(prething, prethings, area, map);
    }


    /* Map macros
    */
    
    /**
     * Sample macro with no functionality, except to console.log a listing of 
     * the arguments provided to each macro function.
     * For all real macros, arguments are listed as the keys given as members of
     * the reference object.
     * They also ignore the "x" and "y" arguments, which 
     * are the x-location and y-location of the output (and both default to 0),
     * and the "macro" argument, which is listed as their alias.
     * 
     * @alias Example
     * @param {Object} reference   A listing of the settings for this macro,
     *                             from an Area's .creation Array. This should 
     *                             be treated as static!
     * @param {Object[]} prethings   The Area's actual .creation Array, which
     *                               consists of a bunch of reference Objects.
     * @param {Area} area   The area currently being generated.
     * @param {Map} map   The map containing the area currently being generated.
     */
    function macroExample(reference, prethings, area, map, scope) {
        console.log("This is a macro that may be called by a map creation.");
        console.log("The arguments are:\n");
        console.log("Reference (the listing from area.creation):  ", reference);
        console.log("Prethings (the area's listing of prethings): ", prethings);
        console.log("Area      (the currently generated area):    ", area);
        console.log("Map       (the map containing the area):     ", map);
        console.log("Scope     (the custom scope container):      ", scope);
    }
    
    /**
     * Macro to place a single type of Thing multiple times, drawing from a
     * bottom/left corner to a top/right corner.
     * 
     * @alias Fill
     * @param {String} thing   The name of the Thing to fill (e.g. "Brick").
     * @param {Number} xnum   How many times to repeat the Thing horizontally
     *                        to the right (defaults to 1)
     * @param {Number} ynum   How many times to repeat the Thing vertically
     *                        upwards (defaults to 1)
     * @param {Number} xwidth   How many units are between the left edges of 
     *                          placed Things horizontally (defaults to 0)
     * @param {Number} yheight   How many units are between the top edges of
     *                           placed Things vertically (defaults to 0)
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [y]   The y-location (defaults to 0).
     * @example   { "macro": "Fill", "thing": "Brick",
     *              "x": 644, "y": 64, "xnum": 5, "xwidth": 8 }
     * @return {Object[]}
     */
    function macroFillPreThings(reference, prethings, area, map, scope) {
        var defaults = scope.ObjectMaker.getFullPropertiesOf(reference.thing),
            xnum = reference.xnum || 1,
            ynum = reference.ynum || 1,
            xwidth = reference.xwidth || defaults.width,
            yheight = reference.yheight || defaults.height,
            x = reference.x || 0,
            yref = reference.y || 0,
            ynum = reference.ynum || 1,
            outputs = [],
            output,
            o = 0, y, i, j;
        
        for (i = 0; i < xnum; ++i) {
            y = yref;
            for (j = 0; j < ynum; ++j) {
                output = {
                    "x": x,
                    "y": y,
                    "macro": undefined
                };
                outputs.push(proliferate(output, reference, true));
                o += 1;
                y += yheight;
            }
            x += xwidth;
        }
        
        return outputs;
    }
    
    /**
     * Macro to continuously place a listing of Things multiple times, from left
     * to right. This is commonly used for repeating background scenery.
     * 
     * @alias Pattern
     * @param {String} pattern   The name of the pattern to print, from the
     *                           listing in scope.settings.maps.patterns.
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [y]   The y-location (defaults to 0).
     * @param {Number} [repeat]   How many times to repeat the overall pattern 
     *                            (by default, 1).
     * @param {Number[]} [skips]   Which numbered items to skip, if any.
     * @return {Object[]}
     */
    function macroFillPrePattern(reference, prethings, area, map, scope) {
        // Make sure the pattern exists before doing anything
        if (!scope.settings.maps.patterns[reference.pattern]) {
            console.warn("An unknown pattern is referenced: " + reference);
            return;
        }
        var pattern = scope.settings.maps.patterns[reference.pattern],
            length = pattern.length,
            defaults = scope.ObjectMaker.getFullProperties(),
            repeats = reference.repeat || 1,
            xpos = reference.x || 0,
            ypos = reference.y || 0,
            outputs = [],
            o = 0,
            skips = {},
            output, prething, i, j;
        
        // If skips are given, record them in an Object for quick access
        if (typeof reference.skips !== "undefined") {
            for (i = 0; i < reference.skips.length; i += 1) {
                skips[reference.skips[i]] = true;
            }
        }
        
        // For each time the pattern should be repeated:
        for (i = 0; i < repeats; i += 1) {
            // For each Thing listing in the pattern:
            for (j = 0; j < length; j += 1) {
                // Don't place if marked in skips
                if (skips[j]) {
                    continue;
                }
                
                prething = pattern[j];
                output = {
                    "thing": prething[0],
                    "x": xpos + prething[1],
                    "y": ypos + prething[2]
                };
                output.y += defaults[prething[0]].height;
                
                if (prething[3]) {
                    output["width"] = prething[3];
                }
                
                outputs.push(output);
                o += 1;
            }
            xpos += pattern.width;
        }
        
        return outputs;
    }
    
    /**
     * Macro to place a Floor Thing with infinite height. All settings are 
     * passed in except "macro", which becomes undefined.
     * 
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [y]   The y-location (defaults to 0).
     * @param {Number} [width]   How wide the Floor should be (by default, 8).
     * @return {Object}
     */
    function macroFloor(reference, prethings, area, map, scope) {
        var x = reference.x || 0,
            y = reference.y || 0,
            floor = proliferate({
                "thing": "Floor",
                "x": x,
                "y": y,
                "width": (reference.width || 8),
                "height": "Infinity",
            }, reference, true);
        floor.macro = undefined;
        return floor;
    }
    
    /**
     * Macro to place a Pipe, possibly with a pirahna, location hooks, and/or
     * infinite height. All settings are copied to Pipe except for "macro",
     * which becomes undefined.
     * 
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [y]   The y-location (defaults to 0).
     * @param {Mixed} [height]   How high the Pipe should be (by default, 8). 
     *                           May be a Number or "Infinity".
     * @param {Boolean} [piranha]   Whethere there should be a Piranha spawned
     *                              with the Pipe (by default, false).
     * @param {Mixed} [transport]   What location the Pipe should transport to
     *                              (by default, none).
     * @param {Mixed} [entrance]   What location the Pipe should act as an
     *                             entrance to (by default, none).
     * @return {Object[]}
     */
    function macroPipe(reference, prethings, area, map, scope) {
        var x = reference.x || 0,
            y = reference.y || 0,
            height = reference.height || 16,
            pipe = proliferate({
                "thing": "Pipe",
                "x": x,
                "y": y,
                "width": 16,
                "height": reference.height || 8
            }, reference, true),
            output = [pipe];
            
        pipe.macro = undefined;
        
        if (height === "Infinity") {
            pipe.height = scope.MapScreener.height;
        } else {
            pipe.y += height;
        }
        
        if (reference.piranha) {
            output.push({
                "thing": "Piranha",
                "x": x + 4,
                "y": pipe.y + 12,
                "onPipe": true
            });
        }
        
        return output;
    }
    
    /**
     * Macro to place a horizontal Pipe with a vertical one, likely with 
     * location hooks.
     * 
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [y]   The y-location (defaults to 0).
     * @param {Mixed} [height]   How high the Pipe should be (by default, 8). 
     *                           May be a Number or "Infinity".
     * @param {Mixed} [transport]   What location the Pipe should transport to
     *                              (by default, none).
     * @param {Boolean} [scrollEnabler]   Whether there should be a 
     *                                    ScrollEnabler placed on top of the
     *                                    PipeVertical (by default, false).
     * @param {Boolean} [scrollBlocker]   Whether there should be a 
     *                                    ScrollBlocker placed to the right of
     *                                    the PipeVertical (by default, false).
     * @return {Object[]}
     * @remarks This could be used in maps like 1-2, but there's no real need to 
     *          take the time (unless you're a volunteer and want something to 
     *          do!). It was introduced for WorldSeedr generation.
     */
    function macroPipeCorner(reference, prethings, area, map, scope) {
        var x = reference.x || 0,
            y = reference.y || 0,
            height = reference.height || 16,
            output = [
                {
                    "thing": "PipeHorizontal",
                    "x": x,
                    "y": y,
                    "transport": reference.transport || 0
                },
                {
                    "thing": "PipeVertical",
                    "x": x + 16,
                    "y": y + height - 16,
                    "height": height
                }
            ];
        
        if (reference.scrollEnabler) {
            output.push({
                "thing": "ScrollEnabler", 
                "x": x + 16, 
                "y": y + height + 48, 
                "height": 64,
                "width": 16
            });
        }
        
        if (reference.scrollBlocker) {
            output.push({
                "thing": "ScrollBlocker", 
                "x": x + 32
            });
        }
        
        return output;
    }

    /**
     * Macro to place a large Tree. 
     * 
     * @param {Number} width   How wide the Tree should be (preferably a 
     *                         multiple of eight
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [y]   The y-location (defaults to 0).
     * @param {Boolean} [solidTrunk]   Whether the trunk scenery should be 
     *                                 listed in the Solids group instead of
     *                                 Scenery for the sake of overlaps (by
     *                                 default, false).
     * @return {Object[]}
     * @remarks Although the tree trunks in later trees overlap earlier ones, 
     *          it's ok because the pattern is indistinguishible when placed 
     *          correctly.
     */
    function macroTree(reference, prethings, area, map, scope) {
        var x = reference.x || 0,
            y = reference.y || 0,
            width = reference.width || 24,
            output = [
                { 
                    "thing": "TreeTop", 
                    "x": x,
                    "y": y,
                    "width": width 
                }
            ];
        
        if (width > 16) {
            output.push({
                "thing": "TreeTrunk", 
                "x": x + 8, 
                "y": y - 8,
                "width": width - 16,
                "height": "Infinity",
                "groupType": reference.solidTrunk ? "Solid": "Scenery"
            });
        };
        
        return output;
    }
    
    /**
     * Macro to place a large Shroom (a Tree that looks like a large Mushroom). 
     * 
     * @param {Number} width   How wide the Shroom should be (preferably a 
     *                         multiple of eight).
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [y]   The y-location (defaults to 0).
     * @param {Boolean} [solidTrunk]   Whether the trunk scenery should be 
     *                                 listed in the Solids group instead of
     *                                 Scenery for the sake of overlaps (by
     *                                 default, false).
     * @return {Object[]}
     * @remarks Although the shroom trunks in later shrooms overlap earlier  
     *          ones, it's ok because the pattern is indistinguishible when 
     *          placed correctly.
     */
    function macroShroom(reference, prethings, area, map, scope) {
        var x = reference.x || 0,
            y = reference.y || 0,
            width = reference.width || 24,
            output = [
                {
                    "thing": "ShroomTop",
                    "x": x,
                    "y": y,
                    "width": width
                }
            ];
        
        if (width > 16) {
            output.push({
                "thing": "ShroomTrunk",
                "x": x + (width - 8) / 2,
                "y": y - 8,
                "height": "Infinity",
                "groupType": reference.solidTrunk ? "Solid" : "Scenery"
            });
        }
        
        return output;
    }
    
    /**
     * Macro to place Water of infinite height. All settings are copied to the 
     * Water except for "macro", which becomes undefined.
     * 
     * @param {Number} width   How wide the Water should be.
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [y]   The y-location (defaults to 0).
     * @return {Object}
     */
    function macroWater(reference, prethings, area, map, scope) {
        var x = reference.x || 0,
            y = (reference.y || 0) + 2, // water is 3.5 x 5.5
            output = proliferate({
                "thing": "Water",
                "x": x,
                "y": y,
                "height": "Infinity",
                "macro": undefined
            }, reference, true);
        
        return output;
    }
    
    /**
     * Macro to place a row of Bricks at y = 88.
     * 
     * @param {Number} width   How wide the ceiling should be (eight times the
     *                         number of Bricks).
     * @param {Number} [x]   The x-location (defaults to 0).
     * @return {Object}
     */
    function macroCeiling(reference) {
        return {
            "macro": "Fill",
            "thing": "Brick",
            "x": reference.x,
            "y": 88,
            "xnum": (reference.width / 8) | 0,
            "xwidth": 8
        };
    }
    
    /**
     * Macro to place a bridge, possibly with columns at the start and/or end.
     * 
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [y]   The y-location (defaults to 0).
     * @param {Number} [width]   How wide the bridge should be (by default, 16).
     * @param {Boolean} [begin]   Whether the first 8 units should be taken up
     *                            by an infinitely high Stone column (by 
     *                            default, false).
     * @param {Boolean} [end]   Whether the last 8 units should be taken up by
     *                          an infinitely high Stone column (by default,
     *                          false).
     * @return {Object[]}
     */
    function macroBridge(reference) {
        var x = reference.x || 0,
            y = reference.y || 0,
            width = Math.max(reference.width || 0, 16),
            output = [];

        // A beginning column reduces the width and pushes it forward
        if (reference.begin) {
            width -= 8;
            output.push({
                "thing": "Stone",
                "x": x,
                "y": y,
                "height": "Infinity"
            });
            x += 8;
        }

        // An ending column just reduces the width 
        if (reference.end) {
            width -= 8;
            output.push({
                "thing": "Stone",
                "x": x + width,
                "y": y,
                "height": "Infinity"
            });
        }

        // Between any columns is a BridgeBase with a Railing on top
        output.push({ "thing": "BridgeBase", "x": x, "y": y, "width": width });
        output.push({ "thing": "Railing", "x": x, "y": y + 4, "width": width });

        return output;
    }
    
    /**
     * Macro to place a scale on the map, which is two Platforms seemingly
     * suspended by Strings.
     * 
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [y]   The y-location (defaults to 0).
     * @param {Number} [widthLeft]   How wide the left Platform should be (by
     *                               default, 24).
     * @param {Number} [widthRight]   How wide the right Platform should be (by
     *                               default, 24).
     * @param {Number} [between]   How much space there should be between
     *                             Platforms (by default, 40).
     * @param {Number} [dropLeft]   How far down from y the left platform should
     *                              start (by default, 24).
     * @param {Number} [dropRight]   How far down from y the right platform
     *                               should start (by default, 24).
     * @return {Object[]}
     */
    function macroScale(reference, prethings, area, map, scope) {
        var x = reference.x || 0,
            y = reference.y || 0,
            unitsize = scope.unitsize,
            widthLeft = reference.widthLeft || 24,
            widthRight = reference.widthRight || 24,
            between = reference.between || 40,
            dropLeft = reference.dropLeft || 24,
            dropRight = reference.dropRight || 24,
            collectionName = "ScaleCollection--" + [
                x, y, widthLeft, widthRight, dropLeft, dropRight
            ].join(","),
            // Tension is always the height from the top to a platform
            tensionLeft = dropLeft * unitsize,
            tensionRight = dropRight * unitsize,
            stringLeft = { 
                "thing": "String",
                "x": x, 
                "y": y - 4, 
                "height": dropLeft - 4,
                "collectionName": collectionName,
                "collectionKey": "stringLeft",
            },
            stringRight = {
                "thing": "String",
                "x": x + between,
                "y": y - 4, 
                "height": dropRight - 4,
                "collectionName": collectionName,
                "collectionKey": "stringRight"
            },
            stringMiddle = { 
                "thing": "String", 
                "x": x + 4, 
                "y": y, 
                "width": between - 7,
                "collectionName": collectionName,
                "collectionKey": "stringMiddle" 
            },
            cornerLeft = {
                "thing": "StringCornerLeft", 
                "x": x, 
                "y": y
            },
            cornerRight = {
                "thing": "StringCornerRight", 
                "x": x + between - 4, 
                "y": y
            },
            platformLeft = { 
                "thing": "Platform",
                "x": x - (widthLeft / 2), 
                "y": y - dropLeft, 
                "width": widthLeft,
                "scale": true,
                "tension": (dropLeft - 1.5) * unitsize,
                "onThingAdd": spawnScalePlatform,
                "collectionName": collectionName,
                "collectionKey": "platformLeft"
            },
            platformRight = { 
                "thing": "Platform",
                "x": x + between - (widthRight / 2),
                "y": y - dropRight, 
                "width": widthRight,
                "scale": true,
                "tension": (dropRight - 1.5) * unitsize,
                "onThingAdd": spawnScalePlatform,
                "collectionName": collectionName,
                "collectionKey": "platformRight"
            };
        
        return [
            stringLeft,
            stringRight,
            stringMiddle,
            cornerLeft,
            cornerRight,
            platformLeft,
            platformRight
        ];
    }
    
    /**
     * Macro to place what appears to be a PlatformGenerator on the map (in 
     * actuality, it is multiple Platforms vertically that know how to respawn).
     *
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [direction]   What direction to travel (either -1 or 1;
     *                               defaults to 1).
     * @param {Number} [width]   How wide the Platforms should be (by default,
     *                           16).
     * @return {Object[]}
     */
    function macroPlatformGenerator(reference, prethings, area, map, scope) {
        var output = [],
            direction = reference.direction || 1,
            levels = direction > 0 ? [0, 48] : [8, 56],
            width = reference.width || 16,
            x = reference.x || 0,
            yvel = direction * scope.unitsize * .42,
            i;
        
        for (i = 0; i < levels.length; i += 1) {
            output.push({
                "thing": "Platform",
                "x": x,
                "y": levels[i],
                "width": width,
                "yvel": yvel,
                "movement": scope.movePlatformSpawn
            });
        }
        
        output.push({
            "thing": "PlatformString",
            "x": x + (width / 2) - .5,
            "y": scope.MapScreener.floor,
            "width": 1,
            "height": scope.MapScreener.height / scope.unitsize
        });
        
        return output;
    }
    
    /**
     * Macro to place a Warp World group of Pipes, Texts, Piranhas, and 
     * detectors.
     * 
     * @param {String[]} warps   The map names each Pipe should warp to.
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [y]   The y-location (defaults to 0).
     * @param {Number} [textHeight]   How far above the Piranhas to place the
     *                                CustomText labels (by default, 8).
     * 
     * @return {Object[]}
     */
    function macroWarpWorld(reference, prethings, area, map, scope) {
        var output = [],
            x = reference.x || 0,
            y = reference.y || 0,
            textHeight = reference.hasOwnProperty("textHeight")
                ? reference.textHeight : 8,
            warps = reference.warps,
            collectionName = "WarpWorldCollection-" + warps.join("."),
            keys = [],
            i;
        
        output.push({
            "thing": "CustomText",
            "x": x + 8,
            "y": y + textHeight + 56,
            "texts": [{
                "text": "WELCOME TO WARP WORLD!"
            }],
            "textAttributes": {
                "hidden": true
            },
            "collectionName": collectionName,
            "collectionKey": "Welcomer"
        });
        
        output.push({
            "thing": "DetectCollision",
            "x": x + 64,
            "y": y + 174,
            "width": 40,
            "height": 102,
            "activate": scope.activateWarpWorld,
            "collectionName": collectionName,
            "collectionKey": "Detector"
        });
        
        for (i = 0; i < warps.length; i += 1) {
            keys.push(i);
            output.push({
                "macro": "Pipe",
                "x": x + 8 + i * 32,
                "height": 24,
                "transport": { "map": warps[i] + "-1" },
                "collectionName": collectionName,
                "collectionKey": i + "-Pipe"
            });
            output.push({
                "thing": "Piranha",
                "x": x + 12 + i * 32,
                "y": y + 36,
                "collectionName": collectionName,
                "collectionKey": i + "-Piranha"
            });
            output.push({
                "thing": "CustomText",
                "x": x + 14 + i * 32,
                "y": y + 32 + textHeight,
                "texts": [{
                    "text": String(warps[i])
                }],
                "textAttributes": {
                    "hidden": true
                },
                "collectionName": collectionName,
                "collectionKey": i + "-Text"
            });
        }
        
        if (warps.length === 1) {
            for (i = 2; i < output.length; i += 1) {
                output[i].x += 32;
            }
        }
        
        return output;
    }
    
    /**
     * Macro to place a DetectCollision that will start the map spawning random
     * CheepCheeps intermittently.
     * 
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [width]   How wide the infinitely tall DetectCollision
     *                           should be (by default, 8).
     * @return {Object}
     */
    function macroCheepsStart(reference, prethings, area, map, scope) {
        return { 
            "thing": "DetectCollision", 
            "x": reference.x || 0,
            "y": scope.MapScreener.floor,
            "width": reference.width || 8,
            "height": scope.MapScreener.height / scope.unitsize,
            "activate": scope.activateCheepsStart
        };
    }
    
    /**
     * Macro to place a DetectCollision that will stop the map spawning random
     * CheepCheeps intermittently.
     * 
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [width]   How wide the infinitely tall DetectCollision
     *                           should be (by default, 8).
     * @return {Object}
     */
    function macroCheepsStop(reference, prethings, area, map, scope) {
        return {
            "thing": "DetectCollision",
            "x": reference.x || 0,
            "y": scope.MapScreener.floor,
            "width": reference.width || 8,
            "height": scope.MapScreener.height / scope.unitsize,
            "activate": scope.activateCheepsStop
        };
    }
    
    /**
     * Macro to place a DetectCollision that will start the map spawning random
     * BulletBills intermittently.
     * 
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [width]   How wide the infinitely tall DetectCollision
     *                           should be (by default, 8).
     * @return {Object}
     */
    function macroBulletBillsStart(reference, prethings, area, map, scope) {
        return {
            "thing": "DetectCollision",
            "x": reference.x || 0,
            "y": scope.MapScreener.floor,
            "width": reference.width || 8,
            "height": scope.MapScreener.height / scope.unitsize,
            "activate": scope.activateBulletBillsStart
        };
    }
    
    /**
     * Macro to place a DetectCollision that will stop the map spawning random
     * BulletBills intermittently.
     * 
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [width]   How wide the infinitely tall DetectCollision
     *                           should be (by default, 8).
     * @return {Object}
     */
    function macroBulletBillsStop(reference, prethings, area, map, scope) {
        return {
            "thing": "DetectCollision",
            "x": reference.x || 0,
            "y": scope.MapScreener.floor,
            "width": reference.width || 8,
            "height": scope.MapScreener.height / scope.unitsize,
            "activate": scope.activateBulletBillsStop
        };
    }
    
    /**
     * Macro to place a DetectCollision that will tell any current Lakitu to 
     * flee the scene.
     * 
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [width]   How wide the infinitely tall DetectCollision
     *                           should be (by default, 8).
     * @return {Object}
     */
    function macroLakituStop(reference, prethings, area, map, scope) {
        return {
            "thing": "DetectCollision",
            "x": reference.x || 0,
            "y": scope.MapScreener.floor,
            "width": reference.width || 8,
            "height": scope.MapScreener.height / scope.unitsize,
            "activate": scope.activateLakituStop
        };
    }
    
    /**
     * Macro to place a small castle, which is really a collection of sceneries.
     * 
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [y]   The y-location (defaults to 0).
     * @param {Mixed} [transport]   What map or location to shift to after
     *                              ending theatrics (collidePlayerTransport).
     * @param {Number} [walls]   How many CastleWall Things should be placed to
     *                           the right of the castle (by default, 2).
     * @return {Object[]}
     */
    function macroCastleSmall(reference) {
        var output = [],
            x = reference.x || 0,
            y = reference.y || 0,
            i, j;
        
        // Base filling left
        for (i = 0; i < 2; i += 1) { // x
            output.push({ 
                "thing": "BrickHalf", 
                "x": x + i * 8,
                "y": y + 4,
                "position": "end"
            });
            
            for (j = 1; j < 3; j += 1) { // y
                output.push({
                    "thing": "BrickPlain",
                    "x": x + i * 8,
                    "y": y + 4 + j * 8,
                    "position": "end"
                });
            }
        }
        
        // Base filling right
        for (i = 0; i < 2; i += 1) { // x
            output.push({ 
                "thing": "BrickHalf", 
                "x": x + 24 + i * 8,
                "y": y + 4,
                "position": "end"
            });
            
            for (j = 1; j < 3; j += 1) { // y
                output.push({
                    "thing": "BrickPlain",
                    "x": x + 24 + i * 8,
                    "y": y + 4 + j * 8,
                    "position": "end"
                });
            }
        }
        
        // Medium railing left
        output.push({
            "thing": "CastleRailing",
            "x": x,
            "y": y + 24,
            "position": "end"
        });
        
        // Medium railing center
        for (i = 0; i < 3; i += 1) {
            output.push({
                "thing": "CastleRailingFilled",
                "x": x + (i + 1) * 8,
                "y": y + 24,
                "position": "end"
            });
        }
        
        // Medium railing right
        output.push({
            "thing": "CastleRailing",
            "x": x + 32,
            "y": y + 24,
            "position": "end"
        });
        
        // Top railing
        for (i = 0; i < 3; i += 1) {
            output.push({
                "thing": "CastleRailing",
                "x": x + (i + 1) * 8,
                "y": y + 40,
                "position": "end"
            });
        }
        
        // Top bricking
        for (i = 0; i < 2; i += 1) {
            output.push({
                "thing": "CastleTop",
                "x": x + 8 + i * 12,
                "y": y + 36,
                "position": "end"
            });
        }
        
        // Door, and detector if required
        output.push({
            "thing": "CastleDoor",
            "x": x + 16,
            "y": y + 20,
            "position": "end"
        });
        if (reference.transport) {
            output.push({
                "thing": "DetectCollision",
                "x": x + 24,
                "y": y + 16,
                "height": 16,
                "activate": FullScreenMario.prototype.collideCastleDoor,
                "transport": reference.transport,
                "position": "end"
            });
        }
        
        return output;
    }
    
    /**
     * Macro to place a large castle, which is really a collection of sceneries
     * underneath a small castle.
     * 
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [y]   The y-location (defaults to 0).
     * @param {Mixed} [transport]   What map or location to shift to after
     *                              ending theatrics (collidePlayerTransport).
     * @return {Object[]}
     */
    function macroCastleLarge(reference) {
        var output = [],
            x = reference.x || 0,
            y = reference.y || 0,
            i, j;
        
        output.push({
            "macro": "CastleSmall",
            "x": x + 16,
            "y": y + 48   
        });
        
        // CastleWalls left
        for (i = 0; i < 2; i += 1) { // x
            output.push({
                "thing": "CastleWall",
                "x": x + i * 8,
                "y": y + 48
            });
        }
        
        // Bottom doors with bricks on top
        for (i = 0; i < 3; i += 1) { // x
            output.push({
                "thing": "CastleDoor",
                "x": x + 16 + i * 16,
                "y": y + 20,
                "position": "end"
            });
            for (j = 0; j < 2; j += 1) {
                output.push({
                    "thing": "BrickPlain",
                    "x": x + 16 + i * 16,
                    "y": y + 28 + j * 8
                });
                output.push({
                    "thing": "BrickHalf",
                    "x": x + 16 + i * 16,
                    "y": y + 40 + j * 4
                });
            }
        }
        
        // Bottom bricks with doors on top
        for (i = 0; i < 2; i += 1) { // x
            for (j = 0; j < 3; j += 1) { // y
                output.push({
                    "thing": "BrickPlain",
                    "x": x + 24 + i * 16,
                    "y": y + 8 + j * 8
                });
            }
            output.push({
                "thing": "CastleDoor",
                "x": x + 24 + i * 16,
                "y": y + 44
            });
        }
        
        // Railing (filled)
        for (i = 0; i < 5; i += 1) { // x
            output.push({
                "thing": "CastleRailingFilled",
                "x": x + 16 + i * 8,
                "y": y + 48
            });
        }
        
        // CastleWalls right
        j = reference.hasOwnProperty("walls") ? reference.walls : 2;
        for (i = 0; i < j; i += 1) { // x
            output.push({
                "thing": "CastleWall",
                "x": x + 56 + i * 8,
                "y": y + 48,
                "position": "end"
            });
        }
        
        if (reference.transport) {
            output.push({
                "thing": "DetectCollision",
                "x": x + 24,
                "y": y + 16,
                "height": 16,
                "activate": FullScreenMario.prototype.collideCastleDoor,
                "transport": reference.transport,
                "position": "end"
            });
        }
        
        return output;
    }
    
    /**
     * Macro to place the typical starting Things for the inside of a castle
     * area.
     * 
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [y]   The y-location (defaults to 0).
     * @param {Number} [width]   How wide the entire shebang should be (by 
     *                           default, 40).
     * @return {Object[]}
     */
    function macroStartInsideCastle(reference, prethings, area, map, scope) {
        var x = reference.x || 0,
            y = reference.y || 0,
            width = (reference.width || 0) - 40,
            output = [
                {
                    "thing": "Stone", "x": x, "y": y + 48,
                    "width": 24, "height": "Infinity"
                },
                {
                    "thing": "Stone", "x": x + 24, "y": y + 40,
                    "width": 8, "height": "Infinity"
                },
                {
                    "thing": "Stone", "x": x + 32, "y": y + 32,
                    "width": 8, "height": "Infinity"
                }
            ];
        
        if (width > 0) {
            output.push({
                "macro": "Floor", "x": x + 40, "y": y + 24, "width": width
            });
        }
        
        return output;
    }
    
    /**
     * Macro to place the typical ending Things for the inside of an outdoor
     * area.
     * 
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [y]   The y-location (defaults to 0).
     * @param {Mixed} [transport]   What map or location to shift to after 
     *                              ending theatrics (collidePlayerTransport).
     * @param {Boolean} [large]   Whether this should place a large castle
     *                            instead of a small (by default, false).
     * @param {Number} [castleDistance]   How far from the flagpole to the 
     *                                    castle (by default, 24 for large
     *                                    castles and 32 for small).
     * @param {Number} [walls]   For large castles, how many CastleWall Things
     *                           should be placed after (by default, 2).
     * @return {Object[]}
     */
    function macroEndOutsideCastle(reference) {
        var x = reference.x || 0,
            y = reference.y || 0,
            collectionName = "EndOutsideCastle-" + [
                reference.x, reference.y, reference.large
            ].join(","),
            output;
        
        // Output starts off with the general flag & collision detection
        output = [
            // Initial collision detector
            {
                "thing": "DetectCollision", x: x, y: y + 108, height: 100,
                "activate": FullScreenMario.prototype.collideFlagpole,
                "activateFail": FullScreenMario.prototype.killNormal,
                "noActivateDeath": true,
                "collectionName": collectionName,
                "collectionKey": "DetectCollision",
            },
            // Flag (scenery)
            { 
                "thing": "Flag", "x": x - 4.5, "y": y + 79.5,
                "collectionName": collectionName,
                "collectionKey": "Flag"
            },
            { 
                "thing": "FlagTop", "x": x + 1.5, "y": y + 84,
                "collectionName": collectionName,
                "collectionKey": "FlagTop" },
            {
                "thing": "FlagPole", "x": x + 3, "y": y + 80,
                "collectionName": collectionName,
                "collectionKey": "FlagPole"
            },
            // Bottom stone
            {
                "thing": "Stone", "x": x, "y": y + 8,
                "collectionName": collectionName,
                "collectionKey": "FlagPole"
            },
        ];
        
        if (reference.large) {
            output.push({
                "macro": "CastleLarge",
                "x": x + (reference.castleDistance || 24),
                "y": y,
                "transport": reference.transport,
                "walls": reference.walls || 8
            });
        } else {
            output.push({
                "macro": "CastleSmall",
                "x": x + (reference.castleDistance || 32),
                "y": y,
                "transport": reference.transport
            });
        }

        return output;
    }

    /**
     * Macro to place the typical ending Things for the inside of a castle area.
     * 
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [y]   The y-location (defaults to 0).
     * @param {Mixed} [transport]   What map or location to shift to after 
     *                              ending theatrics (collidePlayerTransport).
     * @param {String} [npc]   Which NPC to use (either "Toad" or "Peach"; 
     *                         "Toad" by default).
     * @param {Boolean} [hard]   Whether Bowser should be "hard" (by default,
     *                           false).
     * @param {String} [spawnType]   What the Bowser's spawnType should be for
     *                               fireball deaths (by default, "Goomba").
     * @param {Boolean} [throwing]   Whether the Bowser is also throwing hammers
     *                               (by default, false).
     * @param {Boolean} [topScrollEnabler]   Whether a ScrollEnabler should be 
     *                                       added like the ones at the end of
     *                                       large underground PipeCorners (by
     *                                       default, false).
     * @return {Object[]}
     */
    function macroEndInsideCastle(reference, prethings, area, map, scope) {
        var x = reference.x || 0,
            y = reference.y || 0,
            npc = reference.npc || "Toad",
            output, texts, keys;

        if (npc === "Toad") {
            keys = ["1", "2"];
            texts = [{
                "thing": "CustomText",
                "x": x + 164,
                "y": y + 64,
                "texts": [{
                    "text": "THANK YOU MARIO!"
                }],
                "textAttributes": {
                    "hidden": true
                },
                "collectionName": "endInsideCastleText",
                "collectionKey": "1"
            }, {
                "thing": "CustomText",
                "x": x + 152,
                "y": y + 48,
                "texts": [{
                    "text": "BUT OUR PRINCESS IS IN"
                }, {
                    "text": "ANOTHER CASTLE!"
                }],
                "textAttributes": {
                    "hidden": true
                },
                "collectionName": "endInsideCastleText",
                "collectionKey": "2"
            }];
        } else if (npc === "Peach") {
            keys = ["1", "2", "3"];
            texts = [{
                "thing": "CustomText",
                "x": x + 164,
                "y": y + 64,
                "texts": [{
                    "text": "THANK YOU MARIO!"
                }],
                "textAttributes": {
                    "hidden": true
                },
                "collectionName": "endInsideCastleText",
                "collectionKey": "1"
            }, {
                "thing": "CustomText",
                "x": x + 152,
                "y": y + 48,
                "texts": [{
                    "text": "YOUR QUEST IS OVER.",
                    "offset": 12
                }, {
                    "text": "WE PRESENT YOU A NEW QUEST."
                }],
                "textAttributes": {
                    "hidden": true
                },
                "collectionName": "endInsideCastleText",
                "collectionKey": "2"
            }, {
                "thing": "CustomText", 
                "x": x + 152,
                "y": 32,
                "texts": [{
                    "text": "PRESS BUTTON B",
                    "offset": 8
                }, {
                    "text": "TO SELECT A WORLD"
                }],
                "textAttributes": {
                    "hidden": true
                },
                "collectionName": "endInsideCastleText",
                "collectionKey": "3"
            }];
        }
        
        output = [
            { "thing": "Stone", "x": x, "y": y + 88, "width": 256 },
            { "macro": "Water", "x": x, "y": y, "width": 104 },
            // Bridge & Bowser area
            { "thing": "CastleBridge", "x": x, "y": y + 24, "width": 104 },
            {
                "thing": "Bowser", "x": x + 69, "y": y + 42,
                "hard": reference.hard, 
                "spawnType": reference.spawnType || "Goomba",
                "throwing": reference.throwing
            },
            { "thing": "CastleChain", "x": x + 96, "y": y + 32 },
            // Axe area
            { "thing": "CastleAxe", "x": x + 104, "y": y + 40 },
            { "thing": "ScrollBlocker", "x": x + 112 },
            { "macro": "Floor", "x": x + 104, "y": y, "width": 152 },
            {
                "thing": "Stone", "x": x + 104, "y": y + 32,
                "width": 24, "height": 32
            },
            {
                "thing": "Stone", "x": x + 112, "y": y + 80,
                "width": 16, "height": 24
            },
            // Peach's Magical Happy Chamber of Fantastic Love
            { 
                "thing": "DetectCollision", "x": x + 180, 
                "activate": scope.collideCastleNPC, 
                "transport": reference.transport,
                "collectionName": "endInsideCastleText", 
                "collectionKey": "npc", 
                "collectionKeys": keys
            },
            { "thing": npc, "x": x + 200, "y": 13 },
            { "thing": "ScrollBlocker", "x": x + 256 }
        ]
        
        if (reference.topScrollEnabler) {
            output.push({
                "thing": "ScrollEnabler",
                "x": x + 96, "y": y + 140,
                "height": 52, "width": 16
            });
            output.push({
                "thing": "ScrollEnabler",
                "x": x + 240, "y": y + 140,
                "height": 52, "width": 16
            });
        }
        
        output.push.apply(output, texts);
        return output;
    }
    
    /**
     * Macro to place a DetectSpawn that will call activateSectionBefore to 
     * start a stretch section.
     * 
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [y]   The y-location (defaults to 0).
     * @param {Number} [section]   Which of the area's sections to spawn (by
     *                             default, 0).
     * @return {Object}
     */
    function macroSection(reference, prethings, area, map, scope) {
        return {
            "thing": "DetectSpawn",
            "x": reference.x || 0,
            "y": reference.y || 0,
            "activate": scope.activateSectionBefore,
            "section": reference.section || 0
        };
    }
    
    /**
     * Macro to place a DetectCollision to mark the current section as passed.
     * 
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [y]   The y-location (defaults to 0).
     * @param {Number} [width]   How wide the DetectCollision should be (by
     *                           default, 8).
     * @param {Number} [height]   How high the DetectCollision should be (by
     *                            default, 8).
     * @return {Object}
     */
    function macroSectionPass(reference, prethings, area, map, scope) {
        return {
            "thing": "DetectCollision",
            "x": reference.x || 0,
            "y": reference.y || 0,
            "width": reference.width || 8,
            "height": reference.height || 8,
            "activate": function (thing) {
                thing.EightBitter.MapScreener.sectionPassed = true;
            }
        };
    }
    
    /**
     * Macro to place a DetectCollision to mark the current section as failed.
     * 
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [y]   The y-location (defaults to 0).
     * @param {Number} [width]   How wide the DetectCollision should be (by
     *                           default, 8).
     * @param {Number} [height]   How high the DetectCollision should be (by
     *                            default, 8).
     * @return {Object}
     */
    function macroSectionFail(reference, prethings, area, map, scope) {
        return [
            { 
                "thing": "DetectCollision", 
                "x": reference.x,
                "y": reference.y, 
                "width": reference.width || 8,
                "height": reference.height || 8,
                "activate": function (thing) {
                    thing.EightBitter.MapScreener.sectionPassed = false;
                }
            }
        ];
    }
    
    /**
     * Macro to place a DetectSpawn that will spawn a following section based on
     * whether the current one was marked as passed or failed.
     * 
     * @param {Number} [x]   The x-location (defaults to 0).
     * @param {Number} [y]   The y-location (defaults to 0).
     * @param {Number} [pass]   Which section to spawn if passed (by default, 
     *                          0).
     * @param {Number} [fail]   Which section to spawn if failed (by default, 
     *                          0).
     * @return {Object}
     */
    function macroSectionDecider(reference, prethings, area, map, scope) {
        return {
            "thing": "DetectSpawn",
            "x": reference.x || 0,
            "y": reference.y || 0,
            "activate": function (thing) {
                if (thing.EightBitter.MapScreener.sectionPassed) {
                    thing.section = reference.pass || 0;
                } else {
                    thing.section = reference.fail || 0;
                }
                thing.EightBitter.activateSectionBefore(thing);
            }
        };
    }
    
    proliferateHard(FullScreenMario.prototype, {
        // Resets
        "resetAudioPlayer": resetAudioPlayer,
        "resetThingHitter": resetThingHitter,
        "resetMapsHandler": resetMapsHandler,
        "resetStatsHolder": resetStatsHolder,
        "resetContainer": resetContainer,
        // Global manipulations
        "gameStart": gameStart,
        "gameOver": gameOver,
        "thingProcess": thingProcess,
        "addPreThing": addPreThing,
        "addPlayer": addPlayer,
        "scrollPlayer": scrollPlayer,
        "onGamePause": onGamePause,
        "onGamePlay": onGamePlay,
        // Inputs
        "keyDownLeft": keyDownLeft,
        "keyDownRight": keyDownRight,
        "keyDownUp": keyDownUp,
        "keyDownDown": keyDownDown,
        "keyDownSprint": keyDownSprint,
        "keyDownPause": keyDownPause,
        "keyDownMute": keyDownMute,
        "keyUpLeft": keyUpLeft,
        "keyUpRight": keyUpRight,
        "keyUpUp": keyUpUp,
        "keyUpDown": keyUpDown,
        "keyUpSprint": keyUpSprint,
        "keyUpPause": keyUpPause,
        "mouseDownRight": mouseDownRight,
        "deviceMotion": deviceMotion,
        "canInputsTrigger": canInputsTrigger,
        // Upkeep maintenence
        "maintainSolids": maintainSolids,
        "maintainCharacters": maintainCharacters,
        "maintainPlayer": maintainPlayer,
        // Overlap maintenance
        "maintainOverlaps": maintainOverlaps,
        "setOverlapBoundaries": setOverlapBoundaries,
        // Collision detectors
        "generateCanThingCollide": generateCanThingCollide,
        "isThingAlive": isThingAlive,
        "isThingTouchingThing": isThingTouchingThing,
        "isThingOnThing": isThingOnThing,
        "isThingOnSolid": isThingOnSolid,
        "generateIsCharacterTouchingSolid": generateIsCharacterTouchingSolid,
        "generateIsCharacterTouchingCharacter": generateIsCharacterTouchingCharacter,
        "isCharacterOnSolid": isCharacterOnSolid,
        "isCharacterOnResting": isCharacterOnResting,
        "isCharacterAboveEnemy": isCharacterAboveEnemy,
        "isCharacterBumpingSolid": isCharacterBumpingSolid,
        "isCharacterOverlappingSolid": isCharacterOverlappingSolid,
        "isSolidOnCharacter": isSolidOnCharacter,
        // Collision reactions
        "gainLife": gainLife,
        "itemJump": itemJump,
        "jumpEnemy": jumpEnemy,
        "playerShroom": playerShroom,
        "playerShroom1Up": playerShroom1Up,
        "playerStarUp": playerStarUp,
        "playerStarDown": playerStarDown,
        "playerStarOffCycle": playerStarOffCycle,
        "playerStarOffFinal": playerStarOffFinal,
        "playerGetsBig": playerGetsBig,
        "playerGetsBigAnimation": playerGetsBigAnimation,
        "playerGetsSmall": playerGetsSmall,
        "playerGetsFire": playerGetsFire,
        "setPlayerSizeSmall": setPlayerSizeSmall,
        "setPlayerSizeLarge": setPlayerSizeLarge,
        "animatePlayerRemoveCrouch": animatePlayerRemoveCrouch,
        "unattachPlayer": unattachPlayer,
        "playerAddRestingStone": playerAddRestingStone,
        "markOverlap": markOverlap,
        // Spawn / actions
        "spawnDeadGoomba": spawnDeadGoomba,
        "spawnHammerBro": spawnHammerBro,
        "spawnBowser": spawnBowser,
        "spawnPiranha": spawnPiranha,
        "spawnBlooper": spawnBlooper,
        "spawnPodoboo": spawnPodoboo,
        "spawnLakitu": spawnLakitu,
        "spawnCannon": spawnCannon,
        "spawnCastleBlock": spawnCastleBlock,
        "spawnMoveFloating": spawnMoveFloating,
        "spawnMoveSliding": spawnMoveSliding,
        "spawnScalePlatform": spawnScalePlatform,
        "spawnRandomCheep": spawnRandomCheep,
        "spawnRandomBulletBill": spawnRandomBulletBill,
        "spawnCustomText": spawnCustomText,
        "spawnDetector": spawnDetector,
        "spawnScrollBlocker": spawnScrollBlocker,
        "spawnCollectionComponent": spawnCollectionComponent,
        "spawnCollectionPartner": spawnCollectionPartner,
        "spawnRandomSpawner": spawnRandomSpawner,
        "activateCheepsStart": activateCheepsStart,
        "activateCheepsStop": activateCheepsStop,
        "activateBulletBillsStart": activateBulletBillsStart,
        "activateBulletBillsStop": activateBulletBillsStop,
        "activateLakituStop": activateLakituStop,
        "activateWarpWorld": activateWarpWorld,
        "activateRestingStone": activateRestingStone,
        "activateWindowDetector": activateWindowDetector,
        "activateScrollBlocker": activateScrollBlocker,
        "activateScrollEnabler": activateScrollEnabler,
        "activateSectionBefore": activateSectionBefore,
        "activateSectionStretch": activateSectionStretch,
        "activateSectionAfter": activateSectionAfter,
        // Collision / actions
        "generateHitCharacterSolid": generateHitCharacterSolid,
        "generateHitCharacterCharacter": generateHitCharacterCharacter,
        "collideFriendly": collideFriendly,
        "collideCharacterSolid": collideCharacterSolid,
        "collideCharacterSolidUp": collideCharacterSolidUp,
        "collideUpItem": collideUpItem,
        "collideUpCoin": collideUpCoin,
        "collideCoin": collideCoin,
        "collideStar": collideStar,
        "collideFireball": collideFireball,
        "collideCastleFireball": collideCastleFireball,
        "collideShell": collideShell,
        "collideShellSolid": collideShellSolid,
        "collideShellPlayer": collideShellPlayer,
        "collideShellShell": collideShellShell,
        "collideEnemy": collideEnemy,
        "collideBottomBrick": collideBottomBrick,
        "collideBottomBlock": collideBottomBlock,
        "collideVine": collideVine,
        "collideSpringboard": collideSpringboard,
        "collideWaterBlocker": collideWaterBlocker,
        "collideFlagpole": collideFlagpole,
        "collideFlagBottom": collideFlagBottom,
        "collideCastleAxe": collideCastleAxe,
        "collideCastleDoor": collideCastleDoor,
        "collideCastleNPC": collideCastleNPC,
        "collideTransport": collideTransport,
        "collideDetector": collideDetector,
        "collideLevelTransport": collideLevelTransport,
        // Movement
        "moveSimple": moveSimple,
        "moveSmart": moveSmart,
        "moveJumping": moveJumping,
        "movePacing": movePacing,
        "moveHammerBro": moveHammerBro,
        "moveBowser": moveBowser,
        "moveBowserFire": moveBowserFire,
        "moveFloating": moveFloating,
        "moveSliding": moveSliding,
        "movePlatform": movePlatform,
        "setMovementEndpoints": setMovementEndpoints,
        "movePlatformSpawn": movePlatformSpawn,
        "movePlatformScale": movePlatformScale,
        "moveFalling": moveFalling,
        "moveFreeFalling": moveFreeFalling,
        "moveVine": moveVine,
        "moveSpringboardUp": moveSpringboardUp,
        "moveShell": moveShell,
        "movePiranha": movePiranha,
        "movePiranhaLatent": movePiranhaLatent,
        "moveBubble": moveBubble,
        "moveCheepCheep": moveCheepCheep,
        "moveCheepCheepFlying": moveCheepCheepFlying,
        "moveBlooper": moveBlooper,
        "moveBlooperSqueezing": moveBlooperSqueezing,
        "movePodobooFalling": movePodobooFalling,
        "moveLakitu": moveLakitu,
        "moveLakituInitial": moveLakituInitial,
        "moveLakituFleeing": moveLakituFleeing,
        "moveCoinEmerge": moveCoinEmerge,
        "movePlayer": movePlayer,
        "movePlayerVine": movePlayerVine,
        "movePlayerSpringboardDown": movePlayerSpringboardDown,
        // Animations
        "animateSolidBump": animateSolidBump,
        "animateSolidContents": animateSolidContents,
        "animateBlockBecomesUsed": animateBlockBecomesUsed,
        "animateBrickShards": animateBrickShards,
        "animateEmerge": animateEmerge,
        "animateEmergeCoin": animateEmergeCoin,
        "animateEmergeVine": animateEmergeVine,
        "animateFlicker": animateFlicker,
        "animateJump": animateJump,
        "animateThrowingHammer": animateThrowingHammer,
        "animateBowserJump": animateBowserJump,
        "animateBowserFire": animateBowserFire,
        "animateBowserThrow": animateBowserThrow,
        "animateBowserFireOpen": animateBowserFireOpen,
        "animateBowserFreeze": animateBowserFreeze,
        "animateBlooperUnsqueezing": animateBlooperUnsqueezing,
        "animatePodobooJumpUp": animatePodobooJumpUp,
        "animatePodobooJumpDown": animatePodobooJumpDown,
        "animateLakituThrowingSpiny": animateLakituThrowingSpiny,
        "animateSpinyEggHatching": animateSpinyEggHatching,
        "animateFireballEmerge": animateFireballEmerge,
        "animateFireballExplode": animateFireballExplode,
        "animateFirework": animateFirework,
        "animateEndLevelFireworks": animateEndLevelFireworks,
        "animateCannonFiring": animateCannonFiring,
        "animateCastleBlock": animateCastleBlock,
        "animateCastleBridgeOpen": animateCastleBridgeOpen,
        "animateCastleChainOpen": animateCastleChainOpen,
        "animatePlayerFire": animatePlayerFire,
        "animatePlayerPaddling": animatePlayerPaddling,
        "animatePlayerLanding": animatePlayerLanding,
        "animatePlayerRestingOff": animatePlayerRestingOff,
        "animatePlayerBubbling": animatePlayerBubbling,
        "animatePlayerRunningCycle": animatePlayerRunningCycle,
        "animatePlayerPipingStart": animatePlayerPipingStart,
        "animatePlayerPipingEnd": animatePlayerPipingEnd,
        "animatePlayerOffPole": animatePlayerOffPole,
        "animatePlayerOffVine": animatePlayerOffVine,
        "animateCharacterHop": animateCharacterHop,
        // Appearance utilities
        "lookTowardsThing": lookTowardsThing,
        "lookTowardsPlayer": lookTowardsPlayer,
        // Death functions
        "killNormal": killNormal,
        "killFlip": killFlip,
        "killSpawn": killSpawn,
        "killReplace": killReplace,
        "killGoomba": killGoomba,
        "killKoopa": killKoopa,
        "killBowser": killBowser,
        "killToShell": killToShell,
        "killNPCs": killNPCs,
        "killBrick": killBrick,
        "killPlayer": killPlayer,
        // Scoring
        "findScore": findScore,
        "score": score,
        "scoreOn": scoreOn,
        "scoreAnimateOn": scoreAnimateOn,
        "scoreAnimate": scoreAnimate,
        "scorePlayerShell": scorePlayerShell,
        "scorePlayerFlag": scorePlayerFlag,
        // Audio
        "getVolumeLocal": getVolumeLocal,
        "getAudioThemeDefault": getAudioThemeDefault,
        // Map sets
        "setMap": setMap,
        "setLocation": setLocation,
        // Map entrances
        "mapEntranceNormal": mapEntranceNormal,
        "mapEntrancePlain": mapEntrancePlain,
        "mapEntranceWalking": mapEntranceWalking,
        "mapEntranceCastle": mapEntranceCastle,
        "mapEntranceVine": mapEntranceVine,
        "mapEntranceVinePlayer": mapEntranceVinePlayer,
        "mapEntrancePipeVertical": mapEntrancePipeVertical,
        "mapEntrancePipeHorizontal": mapEntrancePipeHorizontal,
        "mapEntranceRespawn": mapEntranceRespawn,
        // Map exits
        "mapExitPipeVertical": mapExitPipeVertical,
        "mapExitPipeHorizontal": mapExitPipeHorizontal,
        // Map creation
        "initializeArea": initializeArea,
        "setAreaBackground": setAreaBackground,
        "getAbsoluteHeight": getAbsoluteHeight,
        "mapAddStretched": mapAddStretched,
        "mapAddAfter": mapAddAfter,
        // Map macros
        "macroExample": macroExample,
        "macroFillPreThings": macroFillPreThings,
        "macroFillPrePattern": macroFillPrePattern,
        "macroFloor": macroFloor,
        "macroPipe": macroPipe,
        "macroPipeCorner": macroPipeCorner,
        "macroTree": macroTree,
        "macroShroom": macroShroom,
        "macroWater": macroWater,
        "macroCastleSmall": macroCastleSmall,
        "macroCastleLarge": macroCastleLarge,
        "macroCeiling": macroCeiling,
        "macroBridge": macroBridge,
        "macroScale": macroScale,
        "macroPlatformGenerator": macroPlatformGenerator,
        "macroWarpWorld": macroWarpWorld,
        "macroCheepsStart": macroCheepsStart,
        "macroCheepsStop": macroCheepsStop,
        "macroBulletBillsStart": macroBulletBillsStart,
        "macroBulletBillsStop": macroBulletBillsStop,
        "macroLakituStop": macroLakituStop,
        "macroStartInsideCastle": macroStartInsideCastle,
        "macroEndOutsideCastle": macroEndOutsideCastle,
        "macroEndInsideCastle": macroEndInsideCastle,
        "macroSection": macroSection,
        "macroSectionPass": macroSectionPass,
        "macroSectionFail": macroSectionFail,
        "macroSectionDecider": macroSectionDecider
    });
    
    return FullScreenMario;
})(GameStartr);