var assert = require('assert'),

    Heartbeat = require('../heartbeat.js');

exports['given a heartbeat'] = {

  beforeEach: function(done) {
    this.hb = new Heartbeat();
    done();
  },

  afterEach: function(done) {
    this.hb.clear();
    done();
  },

  'can set the default interval': function(done) {
    var start = new Date(),
        hb = this.hb;
    hb.interval(100);

    hb.add(function() {
      var end = new Date(),
          total = end - start;
      assert.ok(total > 80, 'is more than 80ms');
      assert.ok(total < 120, 'is less than 120ms');
      done();
    });
    hb.start();
  },

  'can clear the heartbeat': function(done) {
    this.hb.add(function() {});
    this.hb.clear();
    assert.deepEqual([], this.hb._actions);
    assert.equal(false, this.hb._loop);
    done();
  },

  'can set a faster timeout for the next run': function(done) {
    var start = new Date(),
        hb = this.hb;
    this.hb.interval(500);
    this.hb.nextTimeout(250);

    hb.add(function() {
      var end = new Date(),
          total = end - start;
      assert.ok(total > 230, 'is more than 230ms');
      assert.ok(total < 270, 'is less than 270ms');
      done();
    });
    hb.start();
  },

  'can remove a callback': function(done) {
    var foo = function() {},
        bar = function() {},
        hb = this.hb;
    hb.add(foo);
    hb.add(bar);
    assert.ok(hb._actions.some(function(cb) { return cb == foo }), 'foo is in actions');
    assert.ok(hb._actions.some(function(cb) { return cb == bar }), 'bar is in actions');
    hb.remove(foo);
    assert.ok(!hb._actions.some(function(cb) { return cb == foo }), 'foo is not in actions');
    assert.ok(hb._actions.some(function(cb) { return cb == bar }), 'bar is in actions');
    done();
  },

  'can pause the heartbeat': function(done) {
    var hb = this.hb;
    hb.interval(100);
    hb.add(function() {
      assert.ok(false, 'should never run');
    });
    hb.start();
    setTimeout(function() {
      hb.pause();
    }, 50);
    setTimeout(function() {
      done();
    }, 150);
  },

  'can resume the heartbeat': function(done) {
    var hb = this.hb;
    hb.interval(100);
    hb.add(function() {
      assert.ok(true);
      done();
    });
    hb.start();
    setTimeout(function() {
      hb.pause();
    }, 50);
    setTimeout(function() {
      hb.resume();
    }, 75);
  }

};

// if this module is the script being run, then run the tests:
if (module == require.main) {
  var mocha = require('child_process').spawn('mocha', [ '--colors', '--ui', 'exports', '--reporter', 'spec', __filename ]);
  mocha.stdout.pipe(process.stdout);
  mocha.stderr.pipe(process.stderr);
}
