// This code was copied and otained from : https://github.com/anandundavia/ts-complex
// Using the code directly because for some reason the npm package didn't work properly

import { forEachChild, SyntaxKind, createSourceFile } from 'typescript';
import { isFunctionWithBody } from 'tsutils';
import { existsSync, readFileSync } from 'fs';

/* tslint:disable-next-line */
const { isIdentifier } = require('typescript');

const getNodeName = (node) => {
  const { name, pos, end } = node;
  const key = name !== undefined && isIdentifier(name) ? name.text : JSON.stringify({ pos, end });
  return key;
};

const increasesComplexity = (node) => {
  /* eslint-disable indent */
  switch (node.kind) {
    case SyntaxKind.CaseClause:
      return node.statements.length > 0;
    case SyntaxKind.CatchClause:
    case SyntaxKind.ConditionalExpression:
    case SyntaxKind.DoStatement:
    case SyntaxKind.ForStatement:
    case SyntaxKind.ForInStatement:
    case SyntaxKind.ForOfStatement:
    case SyntaxKind.IfStatement:
    case SyntaxKind.WhileStatement:
      return true;

    case SyntaxKind.BinaryExpression:
      switch (node.operatorToken.kind) {
        case SyntaxKind.BarBarToken:
        case SyntaxKind.AmpersandAmpersandToken:
          return true;
        default:
          return false;
      }

    default:
      return false;
  }
  /* eslint-enable indent */
};

const calculateFromSource = (ctx) => {
  let complexity = 0;
  const output = {};
  forEachChild(ctx, function cb(node) {
    if (isFunctionWithBody(node)) {
      const old = complexity;
      complexity = 1;
      forEachChild(node, cb);
      const name = getNodeName(node)?.toString();
      output[name] = complexity;
      complexity = old;
    } else {
      if (increasesComplexity(node)) {
        complexity += 1;
      }
      forEachChild(node, cb);
    }
  });
  return output;
};
exports.calculateFromSource = calculateFromSource;

exports.calculate = (filePath) => {
  if (!existsSync(filePath)) {
    throw new Error(`File "${filePath}" does not exists`);
  }
  const sourceText = readFileSync(filePath).toString();
  const source = createSourceFile(filePath, sourceText, isIdentifier.ES2015);
  return calculateFromSource(source);
};
