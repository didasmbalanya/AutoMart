"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

var _express = _interopRequireDefault(require("express"));

var _bodyParser = require("body-parser");

var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));

var _user = _interopRequireDefault(require("./routes/user"));

var _car = _interopRequireDefault(require("./routes/car"));

var _order = _interopRequireDefault(require("./routes/order"));

var _swagger = _interopRequireDefault(require("../swagger.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable linebreak-style */
_dotenv["default"].config();

var app = (0, _express["default"])();
var PORT = process.env.PORT || 3000;
app.use(_express["default"].json());
app.use((0, _bodyParser.json)());
app.use((0, _bodyParser.urlencoded)({
  extended: true
}));
app.use('/api/V1/docs', _swaggerUiExpress["default"].serve, _swaggerUiExpress["default"].setup(_swagger["default"]));
app.use(_user["default"]);
app.use(_car["default"]);
app.use(_order["default"]); // eslint-disable-next-line no-console

app.listen(PORT, console.log('listening on port ', PORT));
var _default = app;
exports["default"] = _default;