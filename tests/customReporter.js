const Mocha = require('mocha');

class CustomReporter extends Mocha.reporters.Spec {
  constructor(runner) {
    super(runner);

    runner.on('pass', function(test) {
      console.log(`✓ ${test.title}: Passed`);
    });

    runner.on('fail', function(test, err) {
      console.error(`✗ ${test.title}: Failed - ${err.message}`);
    });
  }
}

module.exports = CustomReporter;
