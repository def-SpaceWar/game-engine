import { Input } from './lib/ecs/input';
import { initProgram } from './lib/ecs/loop';
import Test from './scenes/Test';
import './style.css';

(async () => {
    Input.startAll();
    await initProgram([Test]);
    Input.stopAll();
})();
