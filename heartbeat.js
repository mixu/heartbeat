// Use a single heartbeat object that can be explicitly cleared when running tests
var Heartbeat = function() {
  this._actions = [];
  this._loop = false;
  this._interval = 60 * 1000;
};

Heartbeat.prototype.interval = function(millis) {
  this._interval = millis;
};

Heartbeat.prototype.nextTimeout = function(millis) {
  if(this._loop) {
    this.pause();
  }
  var self = this;
  this._loop = setTimeout(function() { Heartbeat.prototype._runActions(self._actions);}, millis);
};


Heartbeat.prototype.start = Heartbeat.prototype.resume = function() {
  if(this._loop) {
    return;
  }
  var self = this;
  this._loop = setTimeout(function() { Heartbeat.prototype._runActions(self._actions);}, this._interval);
};

Heartbeat.prototype.add = function(callback) {
  this._actions.push(callback);
};

Heartbeat.prototype.remove = function(callback) {
  var i = this._actions.length-1;
  while(i >= 0) {
    if(this._actions[i] === callback) {
      this._actions.splice(i, 1);
    }
    i--;
  }
};

Heartbeat.prototype.pause = function() {
  this._loop && ( clearTimeout(this._loop), (this._loop = false) );
};

Heartbeat.prototype.clear = function() {
  this.pause();
  this._actions = [];
};

Heartbeat.prototype.isActive = function() {
  return !!this._loop;
};

Heartbeat.prototype._runActions = function(actions) {
  var len = actions.length, i = 0;
  while(i < len) {
    actions[i]();
    i++;
  }
  // using setTimeout, since it is safer and easier to control
  // - only set the next interval once all actions have run
  setTimeout(Heartbeat.prototype._runActions, this._interval);
};

module.exports = Heartbeat;
