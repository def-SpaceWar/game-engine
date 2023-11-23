import { Processor, System, World } from "./base";

function setAnimation(f: () => void) {
    let id = requestAnimationFrame(fPrime);
    function fPrime() {
        f();
        id = requestAnimationFrame(fPrime);
    };
    return () => cancelAnimationFrame(id);
}

export let dt = 0;

export function initEngine(worlds: World[], systems: System[], processors: Processor[], startId = 0) {
    let currentWorld = worlds[startId],
        before = performance.now();

    const systemSize = systems.length,
        intervalId = setInterval(() => {
            const now = performance.now();
            dt = (now - before) / 1000, before = now;
            for (let i = 0, result = systems[i](currentWorld); i < systemSize; i++)
                switch (result[0]) {
                    case "continue":
                        break;
                    case "stop":
                        alert("Stopped!")
                        stopAll();
                        break;
                    case "world":
                        currentWorld = worlds[result[1]];
                        break;
                }
        }),
        processorSize = processors.length,
        stop = setAnimation(() => {
            for (let i = 0; i < processorSize; i++) processors[i](currentWorld);
        });

    function stopAll() {
        clearInterval(intervalId);
        stop();
    };
}
