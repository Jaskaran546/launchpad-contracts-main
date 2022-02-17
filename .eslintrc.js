module.exports = {
  extends: ['airbnb-base', 'prettier'],
  globals: {
    artifacts: true,
    contract: true,
    web3: true,
    assert: true,
    it: true,
    before: true,
    beforeEach: true,
    describe: true,
  },
  rules: {
    strict: 0,
    'func-names': 'off',
    'max-len': ['error', { code: 150 }],
  },
};
