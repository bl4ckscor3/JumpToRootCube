// ==UserScript==
// @name         Jump to Root Cube
// @namespace    bl4ckscor3
// @version      1.0
// @description  EyeWire script to add a button that lets scouts and higher jump to the root cube of the cell they're currently viewing
// @author       bl4ckscor3
// @match        https://eyewire.org/
// @grant        none
// @updateURL    https://raw.githubusercontent.com/bl4ckscor3/JumpToRootCube/master/jumptorootcube.user.js
// @downloadURL  https://raw.githubusercontent.com/bl4ckscor3/JumpToRootCube/master/jumptorootcube.user.js
// @homepageURL  https://github.com/bl4ckscor3/JumpToRootCube
// ==/UserScript==

/* globals $ account tomni */

(function() {
    'use strict';

    const checkAccount = setInterval(function() {
        if(typeof account === "undefined" || !account.account.uid) { //is the account accessible yet?
            return; //if not, try again
        }

        clearInterval(checkAccount); //if yes, stop trying and start the actual script
        main();
    }, 100);

    function main() {
        if(account.can("scout", "scythe", "mystic", "admin")) {
            let rootButton = document.createElement("button");

            rootButton.id = "rootJumpButton";
            rootButton.title = "Jump to this cell's root cube";
            rootButton.onclick = findAndJump;
            copyCSS(document.getElementById("jumpButton"), rootButton, "; background-color: #6F57D2; cursor: pointer");
            $("#cubeFinder").prepend(rootButton);
        }
    }

    function findAndJump() {
        $.getJSON(`/1.0/cell/${tomni.cell}/tasks`, function(data) {
            let root = data.root;

            for(let i in data.tasks) {
                let task = data.tasks[i];
                let bounds = task.bounds;

                if(bounds.min.x === root.min.x && bounds.min.y === root.min.y && bounds.min.z === root.min.z && bounds.max.x === root.max.x && bounds.max.y === root.max.y && bounds.max.z === root.max.z) {
                    tomni.jumpToTaskID(task.id);
                    return;
                }
            }
        });
    }

    function copyCSS(from, to, additionalCSS) {
        let styles = getComputedStyle(from);
        let cssText = '';

        for(let style in styles) {
            cssText += `${style}:${styles[style]}`;
        }

        to.style.cssText = cssText + additionalCSS;
    }
})();
