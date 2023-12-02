import { Scene } from "./base";

export let processDt = 0;
function setAnimation(f: () => void) {
    let id = requestAnimationFrame(fNew),
        before = performance.now();
    function fNew() {
        const now = performance.now();
        processDt = (now - before) / 1000, before = now;
        f();
        id = requestAnimationFrame(fNew);
    };
    return () => cancelAnimationFrame(id);
}

export let dt = 0;
export function initProgram(scenes: Scene[], startId = 0) {
    return new Promise<void>(resolve => {
        let world = scenes[startId][0](),
            systems = scenes[startId][1],
            processors = scenes[startId][2],
            before = performance.now();

        const systemSize = systems.length,
            intervalId = setInterval(() => {
                const now = performance.now();
                dt = (now - before) / 1000, before = now;
                for (let i = 0; i < systemSize; i++) {
                    const result = systems[i](world);
                    switch (result[0]) {
                        case "continue":
                            break;
                        case "stop":
                            document.title = "Stopped!";
                            stopAll();
                            resolve();
                            break;
                        case "scene":
                            world = scenes[result[1]][0]();
                            systems = scenes[result[1]][1];
                            processors = scenes[result[1]][2];
                            break;
                    }
                }
            }, 2),
            processorSize = processors.length,
            stop = setAnimation(() => {
                for (let i = 0; i < processorSize; i++) processors[i](world);
            });

        function stopAll() {
            clearInterval(intervalId);
            stop();
        };
    })
}
