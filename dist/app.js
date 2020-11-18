"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const port = 8000;
const accounts_1 = __importDefault(require("./routes/accounts"));
app.get('/', (req, res) => {
    res.send('Leethub.com');
});
app.use('/accounts', accounts_1.default);
app.listen(port, () => {
    // tslint:disable-next-line: no-console
    return console.log("Server listening on port http://localhost:" + port);
});
//# sourceMappingURL=app.js.map