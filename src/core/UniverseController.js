/*jslint browser: true, sloppy: true */
/*global THREE */
var UNIVERSE = UNIVERSE || {};

UNIVERSE.UniverseController = function (theRefreshRate) {
    var graphicsObjects = [],

        // Timeout that runs the animation, will be cleared when paused
        refreshTimeout,

        // number of milliseconds between calls to update() (frame rate / refresh rate)
        refreshRate = theRefreshRate || 30,

        // the last time we called update() in ms since jsDate epoch
        lastUpdateMs = 0;

    function update() {
        // determine how much time has elapsed since update has last been called
        var nowMs = (new Date()).getTime(),
            elapsedTime = nowMs - lastUpdateMs,
            i;
        // save now as the last time we've updated
        lastUpdateMs = nowMs;

        // causes terrible performance... only enable if needed for debugging!
        // logger.debug("now [" + nowMs + "] elapsed ms [" + elapsedTime + "]");
        // update and draw all graphics objects
        for (i in graphicsObjects) {
            graphicsObjects[i].update(elapsedTime);
            graphicsObjects[i].draw();
        }

        // call update() again in a certain number of milliseconds
        refreshTimeout = setTimeout(function () {
            update();
        }, refreshRate);
    }

    this.updateOnce = function () {
        var i;
        for (i in graphicsObjects) {
            graphicsObjects[i].update(null);
            graphicsObjects[i].draw();
        }
    };

    // id
    // objectName
    // updateFunction
    this.addGraphicsObject = function (graphicsObject) {
        graphicsObjects[graphicsObject.id] = graphicsObject;
        //this.updateOnce();
    };

    this.removeGraphicsObject = function (id) {
        delete graphicsObjects[id];
    };

    this.play = function () {
		clearTimeout(refreshTimeout);
        // set our last update time to now since this is the first update
        lastUpdateMs = (new Date()).getTime();
        update();
    };

    this.pause = function () {
        clearTimeout(refreshTimeout);
    };

    this.removeAllGraphicsObjects = function () {
        graphicsObjects = [];
    };

    this.getGraphicsObjects = function () {
        return graphicsObjects;
    };

    this.getGraphicsObjectById = function (id) {
        return graphicsObjects[id];
    };
};