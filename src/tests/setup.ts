
// Configure le silence des logs pendant les tests 
// (nous pouvons les réactiver individuellement si nécessaire)
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};
