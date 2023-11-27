import { listenAll, removeAll } from './lib/engine/input';
import { initProgram } from './lib/engine/loop';
import TestScene from './scenes/Test.scene';
import './style.css';

onload = (async () => {
    listenAll();
    await initProgram([TestScene]);
    removeAll();
});
