"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TRIG = exports.SYMBOLS = exports.STRUCTURE = exports.OPERATORS = exports.VERT = exports.VDASH = exports.UNION = exports.UNDERLINE = exports.TRIANGLE = exports.TIMES = exports.THETA = exports.TAN = exports.SUPERSETEQ = exports.SUPERSET = exports.SUM = exports.SUBSETEQ = exports.SUBSET = exports.SUBSCRIPT = exports.SQRT = exports.SQRT2 = exports.SQR = exports.SMALLE = exports.SIN = exports.SIM = exports.SIMEQ = exports.POWER = exports.PM = exports.PLUS = exports.PI = exports.PHI = exports.PERP = exports.PARENS = exports.OVERLINE = exports.NEQ = exports.MINUS = exports.LTE = exports.LT = exports.LOG_E = exports.INTXY = exports.INTERSECT = exports.INT = exports.INFINITY = exports.IMAGINARY = exports.GTE = exports.GT = exports.FRAC = exports.EQUAL = exports.DOTM = exports.DOLLAR = exports.DIVIDE = exports.DEGREES = exports.CTIMES = exports.CONG = exports.COS = exports.CENT = exports.BRACKETS = exports.ARROWLLR = exports.ARROWRL = exports.ARROWLL = exports.ARCTAN = exports.ARCSIN = exports.ARCCOS = exports.APPROX = exports.ANGLE = exports.ABSOLUTE = void 0;

var _i18n = _interopRequireDefault(require("../i18n"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// It's hard to find a full list of latex symbols that we could use.
// Here's are some references that might be helpful.
// https://github.com/mathquill/mathquill/blob/23a0e88c80c79514ffc30ead490bd880306bce2a/src/commands/math/basicSymbols.js
// http://math.chapman.edu/~jipsen/mathquill/test/MathQuillsymbolsMathJax.html
// https://inspera.atlassian.net/wiki/spaces/KB/pages/62062830/MathQuill+symbols
// https://www.rapidtables.com/math/symbols/Basic_Math_Symbols.html
// https://www.math.uci.edu/~xiangwen/pdf/LaTeX-Math-Symbols.pdf
const ABSOLUTE = {
  label: '|x|',
  latex: '|',
  description: 'Absolute Value',
  cmd: 'cmd'
};
exports.ABSOLUTE = ABSOLUTE;
const ANGLE = {
  label: '\\angle',
  latex: '\\angle',
  description: 'Angle',
  cmd: 'write'
};
exports.ANGLE = ANGLE;
const APPROX = {
  label: '\\approx',
  latex: '\\approx',
  description: 'Approximation',
  cmd: 'cmd'
};
exports.APPROX = APPROX;
const ARCCOS = {
  label: '\\arccos',
  latex: '\\arccos',
  description: 'Arc Cos',
  cmd: 'write'
};
exports.ARCCOS = ARCCOS;
const ARCSIN = {
  label: '\\arcsin',
  latex: '\\arcsin',
  description: 'Arc Sin',
  cmd: 'write'
};
exports.ARCSIN = ARCSIN;
const ARCTAN = {
  label: '\\arctan',
  latex: '\\arctan',
  description: 'Arc Tan',
  cmd: 'write'
};
exports.ARCTAN = ARCTAN;
const ARROWLL = {
  label: '\\Longleftarrow',
  latex: '\\Longleftarrow',
  description: 'Long Left Arrow',
  cmd: 'write'
};
exports.ARROWLL = ARROWLL;
const ARROWRL = {
  label: '\\Longrightarrow',
  latex: '\\Longrightarrow',
  description: 'Long Right Arrow',
  cmd: 'write'
};
exports.ARROWRL = ARROWRL;
const ARROWLLR = {
  label: '\\Longleftrightarrow',
  latex: '\\Longleftrightarrow',
  description: 'Long Left Right Arrow',
  cmd: 'write'
};
exports.ARROWLLR = ARROWLLR;
const BRACKETS = {
  label: '[x]',
  latex: '[',
  description: 'Brackets',
  cmd: 'cmd'
};
exports.BRACKETS = BRACKETS;
const CENT = {
  label: '¢',
  latex: '¢',
  description: 'Cent',
  cmd: 'write'
};
exports.CENT = CENT;
const COS = {
  label: '\\cos',
  latex: '\\cos',
  description: 'Cos',
  cmd: 'write'
};
exports.COS = COS;
const CONG = {
  label: '\\cong',
  latex: '\\cong',
  description: 'Congruent To',
  cmd: 'write'
};
exports.CONG = CONG;
const CTIMES = {
  label: '\\otimes',
  latex: '\\otimes',
  description: 'Tensor Product',
  cmd: 'write'
};
exports.CTIMES = CTIMES;
const DEGREES = {
  label: '\\deg',
  latex: '\\deg',
  description: 'Degrees',
  cmd: 'write'
};
exports.DEGREES = DEGREES;
const DIVIDE = {
  label: '\u00F7',
  latex: '\\divide',
  description: 'Division',
  cmd: 'cmd'
};
exports.DIVIDE = DIVIDE;
const DOLLAR = {
  label: '$',
  latex: '$',
  description: 'Dollar',
  cmd: 'write'
};
exports.DOLLAR = DOLLAR;
const DOTM = {
  label: '\\cdot',
  latex: '\\cdot',
  description: 'Dot for Multiplication',
  cmd: 'write'
};
exports.DOTM = DOTM;
const EQUAL = {
  label: '=',
  latex: '=',
  description: 'Equal',
  cmd: 'cmd'
};
exports.EQUAL = EQUAL;
const FRAC = {
  label: '\\frac {x}{y}',
  latex: '\\frac',
  description: 'Fraction',
  cmd: 'cmd'
};
exports.FRAC = FRAC;
const GT = {
  label: '>',
  latex: '>',
  description: 'Greater Than',
  cmd: 'cmd'
};
exports.GT = GT;
const GTE = {
  label: '\\ge',
  latex: '\\ge',
  description: 'Greater Than or Equal To',
  cmd: 'cmd'
};
exports.GTE = GTE;
const IMAGINARY = {
  label: 'i',
  latex: 'i',
  description: 'Imaginary Number',
  cmd: 'write'
};
exports.IMAGINARY = IMAGINARY;
const INFINITY = {
  label: '\\infty',
  latex: '\\infty',
  description: 'Infinity',
  cmd: 'write'
};
exports.INFINITY = INFINITY;
const INT = {
  label: '\\int',
  latex: '\\int',
  description: 'Integral',
  cmd: 'cmd'
};
exports.INT = INT;
const INTERSECT = {
  label: '\\cap',
  latex: '\\cap',
  description: 'Intersection',
  cmd: 'write'
};
exports.INTERSECT = INTERSECT;
const INTXY = {
  label: '\\int_{x}^{y}',
  latex: '\\int_{x}^{y}',
  description: 'Integral',
  cmd: 'write'
};
exports.INTXY = INTXY;
const LOG_E = {
  label: '\\log',
  latex: '\\log',
  description: 'Log',
  cmd: 'cmd'
};
exports.LOG_E = LOG_E;
const LT = {
  label: '<',
  latex: '<',
  description: 'Less Than',
  cmd: 'cmd'
};
exports.LT = LT;
const LTE = {
  label: '\\le',
  latex: 'le',
  description: 'Less Than or Equal To',
  cmd: 'cmd'
};
exports.LTE = LTE;
const MINUS = {
  label: '-',
  latex: '-',
  description: 'Subtraction',
  cmd: 'cmd'
};
exports.MINUS = MINUS;
const NEQ = {
  label: '\\neq',
  latex: '\\neq',
  description: 'Not Equal',
  cmd: 'write'
};
exports.NEQ = NEQ;
const OVERLINE = {
  label: '\\overline\u3000',
  latex: '\\overline',
  description: 'Overline',
  cmd: 'cmd'
};
exports.OVERLINE = OVERLINE;
const PARENS = {
  label: '(x)',
  latex: '(',
  description: 'Parentheses',
  cmd: 'cmd'
};
exports.PARENS = PARENS;
const PERP = {
  label: '\\perp',
  latex: '\\perp',
  description: 'Perpendicular Lines',
  cmd: 'write'
};
exports.PERP = PERP;
const PHI = {
  label: '\\phi',
  latex: '\\phi',
  description: 'Phi',
  cmd: 'write'
};
exports.PHI = PHI;
const PI = {
  label: '\\pi',
  latex: '\\pi',
  description: 'Pi',
  cmd: 'write'
};
exports.PI = PI;
const PLUS = {
  label: '+',
  latex: '+',
  description: 'Addition',
  cmd: 'cmd'
};
exports.PLUS = PLUS;
const PM = {
  label: '\\pm',
  latex: '\\pm',
  description: 'Plus-Minus',
  cmd: 'cmd'
};
exports.PM = PM;
const POWER = {
  label: 'x^{y}',
  latex: '^',
  description: 'Power',
  cmd: 'cmd'
};
exports.POWER = POWER;
const SIMEQ = {
  label: '\\simeq',
  latex: '\\simeq',
  description: 'Approximately Equal',
  cmd: 'write'
};
exports.SIMEQ = SIMEQ;
const SIM = {
  label: '\\sim',
  latex: '\\sim',
  description: 'Similarity',
  cmd: 'write'
};
exports.SIM = SIM;
const SIN = {
  label: '\\sin',
  latex: '\\sin',
  description: 'Sin',
  cmd: 'write'
};
exports.SIN = SIN;
const SMALLE = {
  label: '\u212F',
  latex: '\u212F',
  description: 'Script Small E',
  cmd: 'write'
};
exports.SMALLE = SMALLE;
const SQR = {
  label: 'x^{2}',
  latex: '^{2}',
  description: 'Square',
  cmd: 'write'
};
exports.SQR = SQR;
const SQRT2 = {
  label: '\\sqrt[x]{y}',
  latex: '\\sqrt[x]{y}',
  description: 'Square Root Alt',
  cmd: 'write'
};
exports.SQRT2 = SQRT2;
const SQRT = {
  label: '\\sqrt x',
  latex: '\\sqrt',
  description: 'Square Root',
  cmd: 'cmd'
};
exports.SQRT = SQRT;
const SUBSCRIPT = {
  label: 'x_{2}',
  latex: '_{2}',
  description: 'Subscript',
  cmd: 'write'
};
exports.SUBSCRIPT = SUBSCRIPT;
const SUBSET = {
  label: '\\sub',
  latex: '\\sub',
  description: 'Subset',
  cmd: 'write'
};
exports.SUBSET = SUBSET;
const SUBSETEQ = {
  label: '\\sube',
  latex: '\\sube',
  description: 'Subset or Equal',
  cmd: 'write'
};
exports.SUBSETEQ = SUBSETEQ;
const SUM = {
  label: '\\sum',
  latex: '\\sum',
  description: 'Summation',
  cmd: 'cmd'
};
exports.SUM = SUM;
const SUPERSET = {
  label: '\\supset',
  latex: '\\supset',
  description: 'Superset',
  cmd: 'write'
};
exports.SUPERSET = SUPERSET;
const SUPERSETEQ = {
  label: '\\supe',
  latex: '\\supe',
  description: 'Superset or Equal',
  cmd: 'write'
};
exports.SUPERSETEQ = SUPERSETEQ;
const TAN = {
  label: '\\tan',
  latex: '\\tan',
  description: 'Tan',
  cmd: 'write'
};
exports.TAN = TAN;
const THETA = {
  label: '\\theta',
  latex: '\\theta',
  description: 'Theta',
  cmd: 'write'
};
exports.THETA = THETA;
const TIMES = {
  label: '\\times',
  latex: '\\times',
  description: 'Multiplication',
  cmd: 'cmd'
};
exports.TIMES = TIMES;
const TRIANGLE = {
  label: '\\bigtriangleup',
  latex: '\\bigtriangleup',
  description: 'Triangle',
  cmd: 'write'
};
exports.TRIANGLE = TRIANGLE;
const UNDERLINE = {
  label: '\\underline\u3000',
  latex: '\\underline',
  description: 'Underline',
  cmd: 'cmd'
};
exports.UNDERLINE = UNDERLINE;
const UNION = {
  label: '\\cup',
  latex: '\\cup',
  description: 'Union',
  cmd: 'write'
};
exports.UNION = UNION;
const VDASH = {
  label: '\\vdash',
  latex: '\\vdash',
  description: 'Vertical and Dash Line',
  cmd: 'write'
};
exports.VDASH = VDASH;
const VERT = {
  label: '\\vert',
  latex: '\\vert',
  description: 'Vertical Line',
  cmd: 'write'
};
exports.VERT = VERT;
const OPERATORS = {
  title: [(0, _i18n.default)('Operators')],
  symbols: [PLUS, MINUS, TIMES, DOTM, DIVIDE, EQUAL, APPROX, SIM, SIMEQ, CONG, NEQ, PM, LT, GT, LTE, GTE, UNION, INTERSECT, SUBSET, SUBSETEQ, SUPERSET, SUPERSETEQ, VERT, CTIMES]
};
exports.OPERATORS = OPERATORS;
const STRUCTURE = {
  title: [(0, _i18n.default)('Structure')],
  symbols: [SUM, FRAC, PARENS, BRACKETS, SQR, SUBSCRIPT, ABSOLUTE, INTXY, OVERLINE, UNDERLINE, POWER, INT, SQRT, SQRT2, LOG_E]
};
exports.STRUCTURE = STRUCTURE;
const SYMBOLS = {
  title: [(0, _i18n.default)('Symbols')],
  symbols: [SMALLE, ANGLE, PI, IMAGINARY, DEGREES, THETA, PHI, TRIANGLE, INFINITY, DOLLAR, CENT, VDASH, PERP, ARROWLL, ARROWRL, ARROWLLR]
};
exports.SYMBOLS = SYMBOLS;
const TRIG = {
  title: [(0, _i18n.default)('Trigonometry')],
  symbols: [SIN, COS, TAN, ARCSIN, ARCCOS, ARCTAN]
};
exports.TRIG = TRIG;