### About

Node threads is a bit tricky topic. Despite Node being a single-threaded, with a node application and event-loop running on the same thread, the catch is that there are some libraries in Node.js that are not single-threaded.

### Links

https://nodejs.org/docs/latest-v12.x/api/cli.html#cli_uv_threadpool_size_size

"""
Asynchronous system APIs are used by Node.js whenever possible, but where they do not exist, libuv's threadpool is used to create asynchronous node APIs based on synchronous system APIs. Node.js APIs that use the threadpool are:

all fs APIs, other than the file watcher APIs and those that are explicitly synchronous
asynchronous crypto APIs such as crypto.pbkdf2(), crypto.scrypt(), crypto.randomBytes(), crypto.randomFill(), crypto.generateKeyPair()
dns.lookup()
all zlib APIs, other than those that are explicitly synchronous
"""
