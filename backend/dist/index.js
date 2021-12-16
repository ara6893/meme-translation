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
const dotenv_1 = require("dotenv");
const morgan_1 = __importDefault(require("morgan"));
const detection_1 = require("./services/detection");
const simple_encryptor_1 = require("simple-encryptor");
const image_1 = require("./services/image");
const fs_1 = require("fs");
const crypto_1 = require("crypto");
const env_const_1 = require("./env.const");
const base64url_1 = __importDefault(require("base64url"));
const storage_1 = require("./services/storage");
(0, dotenv_1.config)();
const cipher = (0, simple_encryptor_1.createEncryptor)({
    key: process.env.KEY,
    hmac: true,
    debug: true,
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('tiny'));
if (!(0, fs_1.existsSync)(env_const_1.PUBLIC_FOLDER)) {
    (0, fs_1.mkdirSync)(env_const_1.PUBLIC_FOLDER);
}
app.use('/public', express_1.default.static(env_const_1.PUBLIC_FOLDER));
// Create multer object
const imageUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
});
const port = process.env.PORT || 3000;
function removeDomainNames(text) {
    return text
        .split(/[\s]+/)
        .filter(e => e.indexOf('.com') === -1)
        .join(' ');
}
function toHash(text) {
    return (0, crypto_1.createHash)('md5').update(text).digest('hex');
}
app.post('/parse/image', imageUpload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        const uri = yield (0, storage_1.uploadFile)(req.file);
        res.json({
            id: (0, base64url_1.default)(cipher.encrypt(uri)),
            imageId: toHash(uri),
        });
    }
    else {
        res.sendStatus(400);
    }
}));
app.get('/metadata/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.id) {
        const uri = cipher.decrypt(base64url_1.default.decode(req.params.id));
        console.log(uri);
        const textEntities = yield (0, detection_1.detectText)(uri);
        const text = removeDomainNames(textEntities.length ? textEntities[0].description : '');
        const relevantText = textEntities.filter((e, i) => i > 0 && e.description.indexOf('.com') < 0);
        const [translationByEntity, translation, webEntities, landmarks] = yield Promise.all([
            Promise.all(relevantText.map((e) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, detection_1.translateText)(e.description); }))),
            (0, detection_1.translateText)(text),
            (0, detection_1.detectWebEntities)(uri),
            (0, detection_1.detectLandmarks)(uri),
        ]);
        yield (0, image_1.updateImage)(toHash(uri), uri, relevantText, translationByEntity);
        res.json({
            translation,
            original: text,
            webEntities,
            landmarks,
        });
    }
    else {
        res.sendStatus(400);
    }
}));
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
