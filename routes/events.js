/*
|-----------------------------------------------------
| Events Routes
|-----------------------------------------------------
| Here is where you can register Event for ATRI.
|
*/

import interactionCreate from "../events/interactionCreate.js";
import mention from "../events/mention.js";
import ready from "../events/ready.js";
import visualNovelInfoButtonListener from "../events/VisualNovelInfoButtonListener.js";

export default [
    interactionCreate,
    mention,
    ready,
    visualNovelInfoButtonListener
];