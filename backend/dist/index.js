"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cors_1 = __importDefault(require("cors"));
const multer_cloud_storage_1 = __importDefault(require("multer-cloud-storage"));
const textDetection_1 = require("./services/textDetection");
const dotenv_1 = require("dotenv");
const morgan_1 = __importDefault(require("morgan"));
const detection_1 = require("./services/detection");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('tiny'));
// Create multer object
const imageUpload = (0, multer_1.default)({
    storage: new multer_cloud_storage_1.default({
        uniformBucketLevelAccess: true,
    }),
});
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.post('/parse/image', imageUpload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        const text = yield (0, textDetection_1.detectText)(req.file.uri);
        res.json({
            translation: yield (0, detection_1.translateText)(text),
            original: text,
        });
    }
    else {
        res.sendStatus(400);
    }
}));
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
