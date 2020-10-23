const crypto = require('crypto')


const start = Date.now()

// https://nodejs.org/docs/latest-v12.x/api/crypto.html#crypto_crypto_pbkdf2_password_salt_iterations_keylen_digest_callback
function logHashTime () {
  // Password-Based Key Derivation Function 2 (PBKDF2) implementation
  crypto.pbkdf2("password", "salt", 100000, 512, "sha512", (err, derivedKey) => {
    console.log(`Time spent to take hash: ${Date.now() - start} ms`)
  })
}

/**
 * All 4 calls to the `logHashTime` should take approximately the same time
 * because they each use a separate thread.
 */
// console.log('Running logHashTime 4 times...')
// logHashTime()
// logHashTime()
// logHashTime()
// logHashTime()
/* Produces:
Time spent to take hash: 1711 ms
Time spent to take hash: 1730 ms
Time spent to take hash: 1747 ms
Time spent to take hash: 1749 ms */


/**
 * Libuv will create a threadpool with 4 threads. The 5th call will have to wait to execute,
 * so we will see a big difference in execution time taken by the first 4 and the 5th call.
 */
// console.log('Running logHashTime 5 times...')
// logHashTime()
// logHashTime()
// logHashTime()
// logHashTime()
// logHashTime()
/* Produces:
Time spent to take hash: 1898 ms
Time spent to take hash: 1901 ms
Time spent to take hash: 1955 ms
Time spent to take hash: 1964 ms
Time spent to take hash: 2715 ms */

/**
 * Let's try to run this 8 times with 4 threads.
 * 
 * The result is that we have a much worse performance for each execution because we have 2 times
 * less executor threads than tasks to run. The first 4 tasks fit in the libuv thread pool but the
 * remaining 4 will have to wait until a free thread can pick them up.
 */
// Array(8).fill(1).forEach((_) => {
//   logHashTime()
// })
/* Produces:
Time spent to take hash: 1684 ms
Time spent to take hash: 1744 ms
Time spent to take hash: 1783 ms
Time spent to take hash: 1813 ms
Time spent to take hash: 3555 ms
Time spent to take hash: 3630 ms
Time spent to take hash: 3643 ms
Time spent to take hash: 3676 ms */

/**
 * Let's try to increase the number of threads in libuv thread pool to 8 and run this again.
 * 
 * This will result in even worse performance than before because we now have 4 times more executor
 * threads than CPU cores (2 in my case), and there is probably too much context switching.
 */
// process.env.UV_THREADPOOL_SIZE = 8
// Array(8).fill(1).forEach((_) => {
//   logHashTime()
// })
/* Produces:
Time spent to take hash: 3444 ms
Time spent to take hash: 3477 ms
Time spent to take hash: 3488 ms
Time spent to take hash: 3507 ms
Time spent to take hash: 3532 ms
Time spent to take hash: 3537 ms
Time spent to take hash: 3544 ms
Time spent to take hash: 3547 ms */

/**
 * Let's try to decrease the number of threads to just 2 (equal to the amount of CPU cores on my machine).
 * 
 * This actually results in a much better performance than when using the default `UV_THREADPOOL_SIZE` value (4), i.e.:
 */
// process.env.UV_THREADPOOL_SIZE = 2
// Array(8).fill(1).forEach((_) => {
//   logHashTime()
// })
/* Produces:
Time spent to take hash: 766 ms
Time spent to take hash: 770 ms
Time spent to take hash: 1638 ms
Time spent to take hash: 1647 ms
Time spent to take hash: 2493 ms
Time spent to take hash: 2500 ms
Time spent to take hash: 3354 ms
Time spent to take hash: 3379 ms */
