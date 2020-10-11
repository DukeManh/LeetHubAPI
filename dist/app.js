"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const port = 8000;
app.get('/', (req, res) => {
    res.send('Leethub.com');
});
app.listen(port, () => {
    return console.log("Server listening on port http://localhost:" + port);
});
//# sourceMappingURL=app.js.map