
Maintains a single interval, which is used to trigger tasks.

This is useful for something like:

- sending heartbeat messages
- performing cleanup operations occasionally

## API

### heartbeat.interval(ms)

Set the interval lenght for the heartbeat.

### heartbeat.start() / heartbeat.resume()

Start or resume the heartbeat.

### heartbeat.nextTimeout(millis)

Change the trigger time of the next timeout. For example, in order to guarantee that first heartbeat occurs within a shorter amount of time than average.

### heartbeat.add(cb)

Add a callback to the heartbeat actions.

### heartbeat.remove(cb)

Remove a callback from the heartbeat actions.

### heartbeat.pause()

Pause the heartbeat.

### heartbeat.clear()

Clear the heartbeat and all callback actions.
