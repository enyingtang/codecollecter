document.onreadystatechange = function (event) {
    if (event.target.readyState !== "complete") {
        return;
    }
    
    var timeStart = Date.now(),
        UserWrapper = new UserWrappr(FullScreenMario.prototype.proliferate({
            "GameStartrConstructor": FullScreenMario
        }, FullScreenMario.prototype.settings.ui, true));
    
    console.log("It took " + (Date.now() - timeStart) + " milliseconds to start.");
    UserWrapper.displayHelpMenu();
};