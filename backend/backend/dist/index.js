"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// Create multer object
const imageUpload = (0, multer_1.default)({
    dest: 'images',
});
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.post('/parse/image', imageUpload.single('image'), (req, res) => {
    console.log(req.file);
    res.sendStatus(200);
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
