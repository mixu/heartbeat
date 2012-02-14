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

};

Heartbeat.prototype.start = Heartbeat.prototype.resume = function() {
  if(this._loop) {
    return;
  }
  var self = this;
  this._loop = setInterval(function(){
    var len = self._actions.length, i = 0;
    while(i < len) {
      self._actions[i]();
      i++;
    }
  }, this._interval);
};

Heartbeat.prototype.add = function(callback) {
  this._actions.push(callback);
};

Heartbeat.prototype.remove = function(callback) {
  var i = this._actions.length-1;
  while(i >= 0) {
    if(this._actions[i] == callback) {
      this._actions.splice(i, 1);
    }
    i--;
  }
};

Heartbeat.prototype.pause = function() {
  this._loop && ( clearInterval(this._loop), (this._loop = false) );
};

Heartbeat.prototype.clear = function() {
  this.pause();
  this._actions = [];
};

Heartbeat.prototype.isActive = function() {
  return !!this._loop;
};

module.exports = Heartbeat;
