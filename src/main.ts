import { listenAll, removeAll } from './lib/ecs/input';
import { initProgram } from './lib/ecs/loop';
import Test from './scenes/Test';
import './style.css';

onload = (async () => {
    listenAll();
    await initProgram([Test]);
    removeAll();
});
