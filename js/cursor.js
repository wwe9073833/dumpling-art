(function() {
    function supportsDesktopCursor() {
        return window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    }

    function prefersReducedMotion() {
        return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function initDesktopCursor() {
        var desktopPointer = supportsDesktopCursor();
        var reduceMotion = prefersReducedMotion();
        var cursor;
        var ring;
        var mouseX;
        var mouseY;
        var ringX;
        var ringY;
        if (!desktopPointer || !document.body) {
            return;
        }

        cursor = document.getElementById("cursor");
        ring = document.getElementById("cursor-ring");

        if (!cursor) {
            cursor = document.createElement("div");
            cursor.id = "cursor";
            cursor.setAttribute("aria-hidden", "true");
            document.body.appendChild(cursor);
        }

        if (!ring) {
            ring = document.createElement("div");
            ring.id = "cursor-ring";
            ring.setAttribute("aria-hidden", "true");
            document.body.appendChild(ring);
        }

        mouseX = window.innerWidth / 2;
        mouseY = window.innerHeight / 2;
        ringX = mouseX;
        ringY = mouseY;

        document.documentElement.classList.add("cursor-enabled");
        document.body.classList.add("cursor-enabled");
        cursor.classList.add("is-visible");
        ring.classList.add("is-visible");

        function applyRingTransform() {
            ring.style.transform = "translate3d(" + ringX + "px, " + ringY + "px, 0) translate(-50%, -50%)" + (ring.classList.contains("expand") ? " scale(1.55)" : "");
        }

        function moveCursor(event) {
            mouseX = event.clientX;
            mouseY = event.clientY;
            cursor.style.transform = "translate3d(" + mouseX + "px, " + mouseY + "px, 0) translate(-50%, -50%)";

            if (reduceMotion) {
                ringX = mouseX;
                ringY = mouseY;
                applyRingTransform();
            }
        }

        function animateRing() {
            var ease = reduceMotion ? 1 : 0.10;
            ringX += (mouseX - ringX) * ease;
            ringY += (mouseY - ringY) * ease;
            applyRingTransform();
            window.requestAnimationFrame(animateRing);
        }

        function setCursorVisible(visible) {
            cursor.classList.toggle("is-visible", visible);
            ring.classList.toggle("is-visible", visible);
            document.documentElement.classList.toggle("cursor-enabled", visible);
            document.body.classList.toggle("cursor-enabled", visible);
        }

        document.addEventListener("mousemove", moveCursor, { passive: true });

        window.addEventListener("mouseenter", function() {
            setCursorVisible(true);
        });

        window.addEventListener("mouseleave", function() {
            setCursorVisible(false);
        });

        document.addEventListener("pointerover", function(event) {
            var target = event.target;
            if (target && target.closest && target.closest("a, button, select, input")) {
                ring.classList.add("expand");
            }
        });

        document.addEventListener("pointerout", function(event) {
            var related = event.relatedTarget;
            if (!related || !related.closest || !related.closest("a, button, select, input")) {
                ring.classList.remove("expand");
            }
        });

        if (!reduceMotion) {
            window.requestAnimationFrame(animateRing);
        } else {
            applyRingTransform();
        }
    }

    function boot() {
        initDesktopCursor();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})();
