(function () {
    FullScreenMario.prototype.settings.objects = {
        "onMake": "onMake",
        "indexMap": ["width", "height"],
        "doPropertiesFull": true,
        "inheritance": {
            "Quadrant": {},
            "Map": {},
            "Area": {},
            "Location": {},
            "Thing": {
                "character": {
                    "Player": {},
                    "enemy": {
                        "Goomba": {},
                        "Koopa": {},
                        "Beetle": {},
                        "Piranha": {},
                        "Blooper": {},
                        "CheepCheep": {},
                        "Podoboo": {},
                        "BulletBill": {},
                        "Lakitu": {},
                        "SpinyEgg": {},
                        "Spiny": {},
                        "HammerBro": {
                            "Bowser": {}
                        },
                        "Hammer": {},
                        "BowserFire": {},
                    },
                    "item": {
                        "Mushroom": {
                            "Mushroom1Up": {},
                            "MushroomDeathly": {}
                        },
                        "FireFlower": {},
                        "Fireball": {
                            "CastleFireball": {}
                        },
                        "Star": {},
                        "Shell": {
                            "BeetleShell": {}
                        },
                        "Vine": {}
                    },
                    "BrickShard": {},
                    "Bubble": {},
                    "Coin": {},
                    "Firework": {},
                },
                "solid": {
                    "Block": {},
                    "BridgeBase": {},
                    "Brick": {},
                    "DeadGoomba": {},
                    "Pipe": {},
                    "PipeHorizontal": {},
                    "PipeVertical": {},
                    "Platform": {},
                    "Stone": {
                        "RestingStone": {}
                    },
                    "Cannon": {},
                    "Springboard": {},
                    "Floor": {},
                    "TreeTop": {},
                    "ShroomTop": {},
                    "CastleAxe": {},
                    "CastleBlock": {},
                    "CastleBridge": {},
                    "CastleChain": {},
                    "Coral": {},
                    "WaterBlocker": {},
                    "detector": {
                        "DetectCollision": {
                            "ScrollEnabler": {},
                        },
                        "DetectWindow": {
                            "ScrollBlocker": {},
                            "RandomSpawner": {}
                        },
                        "DetectSpawn": {}
                    }
                },
                "scenery": {
                    "Blank": {},
                    "BrickHalf": {},
                    "BrickPlain": {},
                    "Bush1": {},
                    "Bush2": {},
                    "Bush3": {},
                    "CastleDoor": {},
                    "CastleFlag": {},
                    "CastleRailing": {},
                    "CastleRailingFilled": {},
                    "CastleTop": {},
                    "CastleWall": {},
                    "Cloud": {
                        "Cloud1": {},
                        "Cloud2": {},
                        "Cloud3": {},
                    },
                    "Fence": {},
                    "Flag": {},
                    "FlagPole": {},
                    "FlagTop": {},
                    "HillSmall": {},
                    "HillLarge": {},
                    "Peach": {},
                    "PlatformString": {},
                    "PlantSmall": {},
                    "PlantLarge": {},
                    "Railing": {},
                    "ShroomTrunk": {},
                    "String": {},
                    "StringCornerLeft": {},
                    "StringCornerRight": {},
                    "Toad": {},
                    "TreeTrunk": {},
                    "Water": {}
                },
                "Text": {
                    "DecorativeBack": {},
                    "DecorativeDot": {},
                    "TextA": {},
                    "TextB": {},
                    "TextC": {},
                    "TextD": {},
                    "TextE": {},
                    "TextF": {},
                    "TextG": {},
                    "TextH": {},
                    "TextI": {},
                    "TextJ": {},
                    "TextK": {},
                    "TextL": {},
                    "TextM": {},
                    "TextN": {},
                    "TextO": {},
                    "TextP": {},
                    "TextQ": {},
                    "TextR": {},
                    "TextS": {},
                    "TextT": {},
                    "TextU": {},
                    "TextV": {},
                    "TextW": {},
                    "TextX": {},
                    "TextY": {},
                    "TextZ": {},
                    "Text0": {},
                    "Text1": {},
                    "Text2": {},
                    "Text3": {},
                    "Text4": {},
                    "Text5": {},
                    "Text6": {},
                    "Text7": {},
                    "Text8": {},
                    "Text9": {},
                    "TextSpace": {},
                    "TextSlash": {},
                    "TextCharacters": {
                        "TextPeriod": {},
                        "TextExclamationMark": {},
                        "TextColon": {},
                    },
                    "TextColored": {
                        "TextColoredD": {},
                        "TextColoredE": {},
                        "TextColoredI": {},
                        "TextColoredN": {},
                        "TextColoredO": {},
                        "TextColoredT": {},
                        "TextColored1": {},
                        "TextColored5": {},
                        "TextColored8": {},
                        "TextColored9": {},
                        "TextColoredSpace": {},
                        "TextColoredCopyright": {}
                    },
                    "TextLarge": {
                        "TextLargeE": {},
                        "TextLargeP": {},
                        "TextLargeR": {},
                        "TextLargeS": {},
                        "TextLargeU": {}
                    },
                    "TextHuge": {
                        "TextHugeA": {},
                        "TextHugeB": {},
                        "TextHugeI": {},
                        "TextHugeM": {},
                        "TextHugeO": {},
                        "TextHugeR": {},
                        "TextHugeS": {},
                        "TextHugeSpace": {},
                        "TextHugePeriod": {}
                    },
                    "ScoreText": {
                        "Text100": {},
                        "Text200": {},
                        "Text400": {},
                        "Text500": {},
                        "Text800": {},
                        "Text1000": {},
                        "Text2000": {},
                        "Text4000": {},
                        "Text5000": {},
                        "Text8000": {},
                        "Text1Up": {},
                    },
                    "CustomText": {}
                }
            }
        },
        "properties": {
            "Quadrant": {
                "tolx": 0,
                "toly": 0
            },
            "Map": {
                "initialized": false
            },
            "Area": {
                "onMake": FullScreenMario.prototype.initializeArea,
                "setBackground": FullScreenMario.prototype.setAreaBackground,
                "floor": 104,
                "time": 400,
                "jumpmod": 1.056,
                "maxyvel": FullScreenMario.unitsize * 2,
                "maxyvelinv": FullScreenMario.unitsize * -3.5,
                "onPlayerDeathTimeout": 280,
                "onGameOverTimeout": 280,
                "gravity": FullScreenMario.gravity,
                "canscroll": true,
                "underwater": false,
                "notime": false,
                "nokeys": false,
                "onPlayerDeath": FullScreenMario.prototype.setMap,
                "onGameOver": FullScreenMario.prototype.gameOver,
                "attributes": {
                    "underwater": {
                        "gravity": FullScreenMario.gravity / 2.8,
                        "stretches": [{
                            "thing": "WaterBlocker",
                            "y": 104,
                            "height": 16
                        }, {
                            "thing": "Water",
                            "y": 88
                        }]
                    },
                    "blockBoundaries": {
                        "afters": [{
                            "thing": "ScrollBlocker"
                        }]
                    },
                    "random": {
                        "onPlayerDeath": FullScreenMario.prototype.mapEntranceRespawn,
                        "onPlayerDeathTimeout": 140
                    }
                }
            },
            "Location": {
                "area": 0,
                "entry": "Normal"
            },
            "Thing": {
                // Sizing
                "width": 8,
                "height": 8,
                "tolx": 0,
                "toly": FullScreenMario.unitsize / 8,
                // Velocity
                "xvel": 0,
                "yvel": 0,
                "speed": 0,
                // Score amounts on death
                "scoreStomp": 100,
                "scoreFire": 200,
                "scoreStar": 200,
                "scoreBelow": 100,
                // Placement
                "alive": true,
                "placed": false,
                // Quadrants
                "maxquads": 4,
                "outerok": false,
                // Sprites
                "sprite": "",
                "spriteType": "neither",
                "opacity": 1,
                // Triggered functions
                "animate": FullScreenMario.prototype.animateEmerge,
                "onMake": FullScreenMario.prototype.thingProcess,
                "death": FullScreenMario.prototype.killNormal,
                "collide": undefined,
                "movement": undefined
            },
            "character": {
                "groupType": "Character",
                "character": true,
                "lookleft": true,
                "moveleft": true,
                "firedeath": true,
                "movement": FullScreenMario.prototype.moveSimple
            },
            "Player": {
                "player": true,
                "canjump": true,
                "nofire": true,
                "nokillend": true,
                "checkOverlaps": true,
                "power": 1,
                "numballs": 0,
                "moveleft": 0,
                "skidding": 0,
                "star": 0,
                "dying": 0,
                "nofall": 0,
                "maxvel": 0,
                "paddling": 0,
                "jumpers": 0,
                "landing": 0,
                "tolx": FullScreenMario.unitsize * 2,
                "toly": 0,
                "walkspeed": FullScreenMario.unitsize / 2,
                "maxspeed": FullScreenMario.unitsize * 1.35, // Really only used for timed animations
                "maxspeedsave": FullScreenMario.unitsize * 1.35,
                "scrollspeed": FullScreenMario.unitsize * 1.75,
                "running": '', // Evaluates to false for cycle checker
                "fire": FullScreenMario.prototype.animatePlayerFire,
                "movement": FullScreenMario.prototype.movePlayer,
                "death": FullScreenMario.prototype.killPlayer,
                "onResting": FullScreenMario.prototype.animatePlayerLanding,
                "onRestingOff": FullScreenMario.prototype.animatePlayerRestingOff,
                "type": "character",
                "name": "player normal small still",
                "getKeys": function () {
                    return {
                        "run": 0,
                        "crouch": 0,
                        "jump": 0,
                        "jumplev": 0,
                        "sprint": 0
                    };
                }
            },
            "enemy": {
                "type": "enemy",
                "speed": FullScreenMario.unitsize * .21,
                "collide": FullScreenMario.prototype.collideEnemy,
                "death": FullScreenMario.prototype.killFlip
            },
            "Goomba": {
                "scoreFire": 100,
                "scoreStar": 100,
                "spawnType": "DeadGoomba",
                "toly": FullScreenMario.unitsize,
                "death": FullScreenMario.prototype.killGoomba,
                "spriteCycleSynched": [
                    [FullScreenMario.prototype.unflipHoriz, FullScreenMario.prototype.flipHoriz]
                ]
            },
            "Koopa": {
                "height": 12,
                "shellspawn": true,
                "spawnType": "Shell",
                "shelltype": "Shell",
                "toly": FullScreenMario.unitsize * 2,
                "death": FullScreenMario.prototype.killKoopa,
                "spriteCycle": [
                    ["one", "two"]
                ],
                "attributes": {
                    "smart": {
                        "movement": FullScreenMario.prototype.moveSmart,
                        "spawnSettings": {
                            "smart": true
                        }
                    },
                    "jumping": {
                        "movement": FullScreenMario.prototype.moveJumping,
                        "jumpheight": FullScreenMario.unitsize * 1.17,
                        "gravity": FullScreenMario.gravity / 2.8,
                        "scoreStomp": 400
                    },
                    "floating": {
                        "onThingAdded": FullScreenMario.prototype.spawnMoveFloating,
                        "movement": FullScreenMario.prototype.moveFloating,
                        "nofall": true,
                        "yvel": FullScreenMario.unitsize / 8,
                        "maxvel": FullScreenMario.unitsize / 4,
                        "scoreStomp": 400
                    }
                }
            },
            "Beetle": {
                "speed": FullScreenMario.unitsize * .21,
                "xvel": FullScreenMario.unitsize * .21,
                "height": 8,
                "nofire": 2,
                "shellspawn": true,
                "movement": FullScreenMario.prototype.moveSmart,
                "death": FullScreenMario.prototype.killToShell,
                "spawnType": "BeetleShell",
                "shelltype": "BeetleShell",
                "spriteCycle": [
                    ["one", "two"]
                ],
            },
            "Piranha": {
                "height": 12,
                "toly": FullScreenMario.unitsize * 8,
                "countermax": 49,
                // nofall": true,
                "deadly": true,
                // nocollidesolid": true,
                "grounded": true,
                "death": FullScreenMario.prototype.killNormal,
                "movement": FullScreenMario.prototype.movePiranha,
                "onThingAdded": FullScreenMario.prototype.spawnPiranha,
                "spriteCycleSynched": [
                    ["one", "two"]
                ]
            },
            "Blooper": {
                "height": 12,
                "nofall": true,
                "nocollidesolid": true,
                "speed": FullScreenMario.unitsize / 2,
                "onThingAdded": FullScreenMario.prototype.spawnBlooper,
                "movement": FullScreenMario.prototype.moveBlooper,
                "death": FullScreenMario.prototype.killFlip
            },
            "CheepCheep": {
                "nofall": true,
                "nocollidesolid": true,
                "nocollidechar": true,
                "movement": FullScreenMario.prototype.moveCheepCheep,
                "xvel": FullScreenMario.unitsize / -6,
                "yvel": FullScreenMario.unitsize / -32,
                "death": FullScreenMario.prototype.killFlip,
                "spriteCycleSynched": [
                    ["one", "two"]
                ],
                "attributes": {
                    "red": {
                        "xvel": FullScreenMario.unitsize / -4,
                        "yvel": FullScreenMario.unitsize / -24
                    },
                    "flying": {
                        "movement": FullScreenMario.prototype.moveCheepCheepFlying,
                        "gravity": FullScreenMario.gravity / 3.5
                    }
                }
            },
            "Podoboo": {
                "width": 7,
                "speed": FullScreenMario.unitsize * 1.75,
                "acceleration": FullScreenMario.unitsize / 24,
                "jumpHeight": 28,
                "frequency": 245,
                "deadly": true,
                "nofall": true,
                "nofire": true,
                "nocollidechar": true,
                "nocollidesolid": true,
                "grounded": true,
                "movement": undefined,
                "onThingAdded": FullScreenMario.prototype.spawnPodoboo
            },
            "BulletBill": {
                "height": 7,
                "nofall": true,
                "nofire": true,
                "nocollidechar": true,
                "nocollidesolid": true,
                "grounded": true,
                "movement": undefined,
                "xvel": FullScreenMario.unitsize / 2,
            },
            "Lakitu": {
                "height": 12,
                "nofall": true,
                "noshiftx": true,
                "nocollidesolid": true,
                "grounded": true,
                "onThingAdded": FullScreenMario.prototype.spawnLakitu,
                "movement": FullScreenMario.prototype.moveLakituInitial
            },
            "SpinyEgg": {
                "width": 7,
                "deadly": true,
                "movement": undefined,
                "onResting": FullScreenMario.prototype.animateSpinyEggHatching,
                "spawnType": "Spiny",
                "spriteCycleSynched": [
                    ["one", "two"]
                ]
            },
            "Spiny": {
                "deadly": true,
                "moveleft": true,
                "spriteCycle": [
                    ["one", "two"]
                ]
            },
            "HammerBro": {
                "height": 12,
                "onThingAdded": FullScreenMario.prototype.spawnHammerBro,
                "movement": FullScreenMario.prototype.moveHammerBro,
                "spriteCycle": [
                    ["one", "two"]
                ]
            },
            "Bowser": {
                "width": 16,
                "height": 16,
                "speed": FullScreenMario.unitsize * .14,
                "gravity": FullScreenMario.gravity / 2.8,
                "jumpTimes": [117],
                "fireTimes": [280, 350, 490],
                "throwAmount": 7,
                "throwDelay": 84,
                "throwPeriod": 210,
                "throwBetween": 11,
                "deadly": true,
                "noflip": true,
                "nofiredeath": true,
                "nokillend": true,
                "outerok": true,
                "spawnType": "Goomba",
                "movement": FullScreenMario.prototype.moveBowser,
                "killonend": FullScreenMario.prototype.animateBowserFreeze,
                "death": FullScreenMario.prototype.killBowser,
                "onThingAdded": FullScreenMario.prototype.spawnBowser,
                "spriteCycle": [
                    ["one", "two"]
                ]
            },
            "Hammer": {
                "movement": undefined,
                "nocollidesolid": true,
                "nocollidechar": true,
                "deadly": true,
                "nofire": true,
                "spriteCycle": [
                    ["one", "two", "three", "four"],
                    3
                ]
            },
            "BowserFire": {
                "width": 12,
                "height": 4,
                "nocollidesolid": true,
                "nocollidechar": true,
                "nofall": true,
                "deadly": true,
                "nofire": true,
                "movement": FullScreenMario.prototype.moveBowserFire,
                "xvel": FullScreenMario.unitsize * -.63,
                "spriteCycle": [
                    [
                        FullScreenMario.prototype.flipVert,
                        FullScreenMario.prototype.unflipVert
                    ]
                ]
            },
            "item": {
                "group": "item",
                "collide": FullScreenMario.prototype.collideFriendly,
                "onCollideUp": FullScreenMario.prototype.collideUpItem,
                "jump": FullScreenMario.prototype.itemJump,
                "nofire": true
            },
            "Mushroom": {
                "action": FullScreenMario.prototype.playerShroom,
                "speed": FullScreenMario.unitsize * .42
            },
            "Mushroom1Up": {
                "action": FullScreenMario.prototype.playerShroom1Up
            },
            "MushroomDeathly": {
                "action": FullScreenMario.prototype.killPlayer
            },
            "FireFlower": {
                "action": FullScreenMario.prototype.playerShroom,
                "spriteCycle": [
                    ["one", "two", "three", "four"]
                ]
            },
            "Fireball": {
                "width": 4,
                "height": 4,
                "nofire": true,
                "nostar": true,
                "collidePrimary": true,
                "grounded": true,
                "animate": FullScreenMario.prototype.animateFireballEmerge,
                "collide": FullScreenMario.prototype.collideFireball,
                "death": FullScreenMario.prototype.animateFireballExplode,
                "spriteCycleSynched": [
                    ["one", "two", "three", "four"], "spinning", 4
                ]
            },
            "CastleFireball": {
                "deadly": true,
                "nocollidesolid": true,
                "nocollidechar": true,
                "nofall": true,
                "outerok": true,
                "collide": FullScreenMario.prototype.collideCastleFireball
            },
            "Firework": {
                "nocollide": true,
                "nofall": true,
                "animate": FullScreenMario.prototype.animateFirework
            },
            "Star": {
                "name": "star item", // Item class so player's star isn't confused with this
                "width": 7,
                "grounded": true,
                "speed": FullScreenMario.unitsize * .56,
                "action": FullScreenMario.prototype.collideStar,
                "movement": FullScreenMario.prototype.moveJumping,
                "jumpheight": FullScreenMario.unitsize * 1.17,
                "gravity": FullScreenMario.gravity / 2.8,
                "spriteCycle": [
                    ["one", "two", "three", "four"], 0, 7
                ]
            },
            "Shell": {
                "height": 7,
                "speed": FullScreenMario.unitsize * 2,
                "collidePrimary": true,
                "nofire": false,
                "moveleft": 0,
                "xvel": 0,
                "move": 0,
                "shell": true,
                "hitcount": 0,
                "peeking": 0,
                "counting": 0,
                "landing": 0,
                "enemyhitcount": 0,
                "movement": FullScreenMario.prototype.moveShell,
                "collide": FullScreenMario.prototype.collideShell,
                "death": FullScreenMario.prototype.killFlip,
                "spawnType": "Koopa",
                "attributes": {
                    "smart": {}
                }
            },
            "BeetleShell": {
                "height": 8,
                "nofire": 2,
                "spawnType": "Beetle"
            },
            "Vine": {
                "width": 7,
                "nofall": true,
                "nocollide": true,
                "nocollidesolid": true,
                "grounded": true,
                "speed": FullScreenMario.unitsize / 4,
                "movement": FullScreenMario.prototype.moveVine,
                "collide": FullScreenMario.prototype.collideVine,
                "animate": FullScreenMario.prototype.animateEmergeVine
            },
            "BrickShard": {
                "width": 4,
                "height": 4,
                "nocollide": true,
                "grounded": true,
                "movement": undefined,
                "spriteCycle": [
                    [FullScreenMario.prototype.unflipHoriz, FullScreenMario.prototype.flipHoriz]
                ]
            },
            "Bubble": {
                "width": 2,
                "height": 2,
                "nocollide": true,
                "nofall": true,
                "movement": FullScreenMario.prototype.moveBubble,
                "yvel": FullScreenMario.unitsize / -4
            },
            "Coin": {
                "width": 5,
                "spritewidth": 5,
                "height": 7,
                "nofall": true,
                "nocollidechar": true,
                "nocollidesolid": true,
                "allowUpSolids": true,
                "animate": FullScreenMario.prototype.animateEmergeCoin,
                "onCollideUp": FullScreenMario.prototype.collideUpCoin,
                "collide": FullScreenMario.prototype.collideCoin,
                "spriteCycleSynched": [
                    ["one", "two", "three", "two", "one"]
                ]
            },
            "solid": {
                "type": "solid",
                "groupType": "Solid",
                "spritewidth": 8,
                "spriteheight": 8,
                "repeat": true,
                "solid": true,
                "nocollidesolid": true,
                "firedeath": 0,
                "nofire": 2,
                "collide": FullScreenMario.prototype.collideCharacterSolid,
            },
            "Brick": {
                "breakable": true,
                "bottomBump": FullScreenMario.prototype.collideBottomBrick
            },
            "Block": {
                "unused": true,
                "contents": "Coin",
                "bottomBump": FullScreenMario.prototype.collideBottomBlock,
                "spriteCycleSynched": [
                    ["one", "two", "three", "two", "one"]
                ]
            },
            "BridgeBase": {
                "height": 4,
                "spritewidth": 4,
            },
            "DeadGoomba": {
                "height": 4,
                "nocollide": true,
                "onThingAdded": FullScreenMario.prototype.spawnDeadGoomba
            },
            "Pipe": {
                "width": 16,
                "spritewidth": 16,
                "actionTop": FullScreenMario.prototype.mapExitPipeVertical
            },
            "PipeHorizontal": {
                "height": 16,
                "spriteheight": 16,
                "width": 19.5,
                "spritewidth": 19.5,
                "actionLeft": FullScreenMario.prototype.mapExitPipeHorizontal,
                "attributes": {
                    "width": 8,
                    "spritewidth": 8
                }
            },
            "PipeVertical": {
                "position": "beginning",
                "width": 16,
                "spritewidth": 16
            },
            "Platform": {
                "height": 4,
                "spritewidth": 4,
                "fallThresholdStart": FullScreenMario.unitsize * 2.8,
                "fallThresholdEnd": FullScreenMario.unitsize * 2,
                "acceleration": FullScreenMario.unitsize / 16,
                "repeat": true,
                "killonend": false,
                "maxvel": FullScreenMario.unitsize / 4 * 1.5,
                "attributes": {
                    "floating": {
                        "onThingAdded": FullScreenMario.prototype.spawnMoveFloating,
                        "movement": FullScreenMario.prototype.moveFloating,
                        "yvel": FullScreenMario.unitsize / 4 * 1.5
                    },
                    "sliding": {
                        "onThingAdded": FullScreenMario.prototype.spawnMoveSliding,
                        "movement": FullScreenMario.prototype.moveSliding,
                        "xvel": FullScreenMario.unitsize / 4 * 1.5
                    },
                    "transport": {
                        "movement": undefined,
                        "collide": FullScreenMario.prototype.collideTransport
                    },
                    "falling": {
                        "movement": FullScreenMario.prototype.moveFalling
                    },
                    "scale": {
                        "movement": FullScreenMario.prototype.movePlatformScale
                    }
                }
            },
            "RestingStone": {
                "opacity": 0.01, // Why is opacity set to 1 when added?
                "onRestedUpon": FullScreenMario.prototype.activateRestingStone
            },
            "Cannon": {
                "frequency": 280,
                "spriteheight": 16,
                "onThingAdded": FullScreenMario.prototype.spawnCannon
            },
            "Springboard": {
                "height": 14.5,
                "heightNormal": 14.5,
                "spriteheight": 10,
                "collide": FullScreenMario.prototype.collideSpringboard
            },
            "CastleAxe": {
                "collide": FullScreenMario.prototype.collideCastleAxe
            },
            "CastleBlock": {
                "onThingAdded": FullScreenMario.prototype.spawnCastleBlock,
                "attributes": {
                    "fireballs": {
                        "speed": 1
                    }
                }
            },
            "CastleBridge": {
                "height": 16,
                "spriteheight": 16,
                "spritewidth": 4,
                "killonend": FullScreenMario.prototype.animateCastleBridgeOpen
            },
            "CastleChain": {
                "width": 7.5,
                "spritewidth": 7.5,
                "height": 8,
                "nocollide": true,
                "killonend": FullScreenMario.prototype.animateCastleChainOpen
            },
            "Floor": {
                "nofire": true // for the "Super Fireballs" mod
            },
            "WaterBlocker": {
                "hidden": true,
                "collide": FullScreenMario.prototype.collideWaterBlocker
            },
            "detector": {
                "hidden": true,
                "collideHidden": true
            },
            "DetectCollision": {
                "collide": FullScreenMario.prototype.collideDetector
            },
            "ScrollEnabler": {
                "activate": FullScreenMario.prototype.activateScrollEnabler
            },
            "DetectWindow": {
                "movement": FullScreenMario.prototype.activateWindowDetector
            },
            "RandomSpawner": {
                "activate": FullScreenMario.prototype.spawnRandomSpawner
            },
            "ScrollBlocker": {
                "onThingAdded": FullScreenMario.prototype.spawnScrollBlocker,
                "activate": FullScreenMario.prototype.activateScrollBlocker
            },
            "DetectSpawn": {
                "movement": FullScreenMario.prototype.spawnDetector
            },
            "scenery": {
                "groupType": "Scenery",
                "repeat": true,
                "nocollide": true, // for when placed in Solid group
                "noBoundaryStretch": true
            },
            "BrickHalf": [8, 4],
            "BrickPlain": [8, 8],
            "Bush1": [16, 8],
            "Bush2": [24, 8],
            "Bush3": [32, 8],
            "CastleDoor": [8, 20],
            "CastleFlag": [6.5, 10],
            "CastleRailing": [8, 4],
            "CastleRailingFilled": [8, 4],
            "CastleTop": [12, 12],
            "CastleWall": [8, 48],
            "Cloud1": [16, 12],
            "Cloud2": [24, 12],
            "Cloud3": [32, 12],
            "Flag": [8, 8],
            "FlagPole": [1, 72],
            "FlagTop": [4, 4],
            "Fence": [8, 8],
            "HillSmall": [24, 9.5],
            "HillLarge": [40, 17.5],
            "Peach": [8, 13],
            "PlatformString": [1, 1],
            "PlantSmall": [7, 15],
            "PlantLarge": [8, 23],
            "Railing": [4, 4],
            "ShroomTrunk": [8, 8],
            "String": [1, 1],
            "StringCornerLeft": [5, 5],
            "StringCornerRight": [5, 5],
            "Toad": [8, 13],
            "TreeTrunk": [4, 4],
            "Water": {
                "width": 4,
                "height": 5,
                // spriteCycle": [
                //     ["one", "two", "three", "four"]
                // ]
            },
            "Text": {
                "width": 3.5,
                "height": 3.5,
                "groupType": "Text",
                "size": ""
            },
            "DecorativeBack": {
                "width": 88,
                "height": 44,
                "spritewidth": .5,
                "spriteheight": .5,
            },
            "DecorativeDot": {
                "width": 1.5,
                "height": 1.5
            },
            "TextSpace": {
                "hidden": true
            },
            "TextColored1": [3, 3.5],
            "TextColoredSpace": {
                "hidden": true
            },
            "TextColoredCopyright": [4, 4],
            "TextLarge": {
                "width": 7.5,
                "height": 14,
                "size": "Large"
            },
            "TextHuge": {
                "width": 7.5,
                "height": 22
            },
            "TextHugeI": {
                "width": 3.5
            },
            "TextHugeM": {
                "width": 11.5
            },
            "TextHugeSpace": {
                "width": 3.5,
                "hidden": true
            },
            "TextHugePeriod": {
                "width": 3.5
            },
            "ScoreText": {
                "groupType": "Text",
            },
            "TextCharacters": [2.5, 4],
            "TextCharagersHuge": [1, 1],
            "Text100": [6, 4],
            "Text200": [6, 4],
            "Text400": [6, 4],
            "Text500": [6, 4],
            "Text800": [6, 4],
            "Text1000": [8, 4],
            "Text2000": [8, 4],
            "Text4000": [8, 4],
            "Text5000": [8, 4],
            "Text8000": [8, 4],
            "Text1Up": [8, 4],
            "CustomText": {
                "hidden": true,
                "spacingHorizontal": .5,
                "spacingVertical": 8,
                "spacingVerticalBlank": 6,
                "onThingAdded": FullScreenMario.prototype.spawnCustomText
            }
        }
    };
})();