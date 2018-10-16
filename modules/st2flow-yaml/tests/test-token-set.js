import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import TokenSet from '../token-set';

describe('TokenSet', () => {
  describe('toYAML method', () => {
    [ 'basic', 'simple', 'long', 'complex' ].forEach(file => {
      const yaml = fs.readFileSync(path.join(__dirname, 'data', `${file}.yaml`), 'utf-8');

      it(`stringification maintains source identity with ${file}.yaml`, () => {
        const set = new TokenSet(yaml);
        expect(set.toYAML()).to.equal(yaml);
      });

      it(`refining maintains source identity with ${file}.yaml`, () => {
        const set = new TokenSet(yaml);
        set.refineTree();
        expect(set.toYAML()).to.equal(yaml);
      });
    });
  });
});
