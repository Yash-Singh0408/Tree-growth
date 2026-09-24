const trees =
    Array.from(
        document.querySelectorAll(".tree")
    );


/* =========================================
   CONFIGURATION
========================================= */

const TOTAL_TREES =
    trees.length;


/*
    Current scroll position.

    0 = beginning
    1 = final tree
*/

let scrollProgress = 0;


/*
    Target position.

    The mouse wheel changes this value.
    The animation slowly catches up to it.
*/

let targetProgress = 0;


/*
    How much one wheel movement changes
    the tree growth.

    Smaller number = slower growth.

    Try:

    0.0015 → very slow
    0.003  → smooth
    0.005  → faster
*/

const SCROLL_SENSITIVITY = 0.00010;


/*
    Animation smoothing.

    Smaller = slower / smoother
*/

const SMOOTHING = 0.075;


/* =========================================
   EASING
========================================= */

function easeInOut(t) {

    return (
        t * t * (3 - 2 * t)
    );

}


/* =========================================
   WHEEL CONTROL
========================================= */

window.addEventListener(

    "wheel",

    function(event) {

        /*
            IMPORTANT:

            Stop the actual browser page
            from scrolling.
        */

        event.preventDefault();


        /*
            Convert wheel movement
            into animation progress.
        */

        targetProgress +=
            event.deltaY *
            SCROLL_SENSITIVITY;


        /*
            Keep progress between 0 and 1.
        */

        targetProgress =
            Math.max(
                0,
                Math.min(
                    1,
                    targetProgress
                )
            );

    },

    {
        passive: false
    }

);


/* =========================================
   TOUCH SUPPORT
========================================= */

let touchStartY = 0;


window.addEventListener(

    "touchstart",

    function(event) {

        touchStartY =
            event.touches[0].clientY;

    },

    {
        passive: true
    }

);


window.addEventListener(

    "touchmove",

    function(event) {

        event.preventDefault();

    },

    {
        passive: false
    }

);


window.addEventListener(

    "touchend",

    function(event) {

        const touchEndY =
            event.changedTouches[0].clientY;


        const difference =
            touchStartY - touchEndY;


        /*
            Convert swipe distance
            into progress.
        */

        targetProgress +=
            difference * 0.002;


        targetProgress =
            Math.max(
                0,
                Math.min(
                    1,
                    targetProgress
                )
            );

    }

);


/* =========================================
   MAIN ANIMATION
========================================= */

function animate() {


    /*
        Slowly move actual progress
        towards target progress.
    */

    scrollProgress +=

        (
            targetProgress -
            scrollProgress
        ) * SMOOTHING;


    /*
        =====================================
        8 IMAGES
        =====================================

        Example:

        0.00 → Tree 1

        0.14 → Tree 2

        0.28 → Tree 3

        0.42 → Tree 4

        0.57 → Tree 5

        0.71 → Tree 6

        0.85 → Tree 7

        1.00 → Tree 8
    */


    const stagePosition =
        scrollProgress *
        (TOTAL_TREES - 1);


    /*
        Current tree number.
    */

    let currentIndex =
        Math.floor(stagePosition);


    /*
        Don't go beyond Tree 8.
    */

    currentIndex =
        Math.max(
            0,
            Math.min(
                TOTAL_TREES - 1,
                currentIndex
            )
        );


    /*
        Progress between current
        and next tree.

        0 = current tree
        1 = next tree
    */

    let transition =
        stagePosition -
        currentIndex;


    transition =
        easeInOut(transition);


    /*
        Hide all trees first.
    */

    trees.forEach(
        tree => {

            tree.style.opacity = 0;

        }
    );


    /*
        =====================================
        CURRENT TREE
    =====================================
    */

    const currentTree =
        trees[currentIndex];


    currentTree.style.opacity =
        1 - transition;


    /*
        Current tree grows slightly
        during transition.
    */

    const currentScale =
        0.90 +
        (
            transition *
            0.10
        );


    /*
        Current tree moves slightly upward.
    */

    const currentY =
        transition *
        -15;


    currentTree.style.transform =

        `
        translateX(-50%)
        translateY(${currentY}px)
        scale(${currentScale})
        `;


    /*
        =====================================
        NEXT TREE
    =====================================
    */

    const nextIndex =
        currentIndex + 1;


    if (
        nextIndex <
        TOTAL_TREES
    ) {

        const nextTree =
            trees[nextIndex];


        /*
            Fade next tree in.
        */

        nextTree.style.opacity =
            transition;


        /*
            Start slightly smaller.
        */

        const nextScale =

            0.88 +
            (
                transition *
                0.12
            );


        /*
            Move upward.

            This creates the parallax
            growing feeling.
        */

        const nextY =

            35 -
            (
                transition *
                35
            );


        nextTree.style.transform =

            `
            translateX(-50%)
            translateY(${nextY}px)
            scale(${nextScale})
            `;

    }


    /*
        Continue animation.
    */

    requestAnimationFrame(
        animate
    );

}


/* =========================================
   START
========================================= */

animate();