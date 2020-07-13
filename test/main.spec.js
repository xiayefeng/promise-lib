import addPromise from '../src/main'

const timeout = time => new Promise(resolve => {
  // console.log('time: ' + time)
  setTimeout(resolve, time)
})
describe('test addPromise fun', () => {
  it('test start', (done) => {
    let a, b, c, d
    addPromise(timeout, {}, 1000).then(() => {
      a = Date.now()
      console.log(a)
    })
    addPromise(timeout, {}, 500).then(() => {
      b = Date.now()
      console.log(b)
    })
    addPromise(timeout, {}, 300).then(() => {
      c = Date.now()
      console.log(c)
    })
    addPromise(timeout, {}, 400).then(() => {
      d = Date.now()
      console.log(d)
      expect(a > b).toBe(true)
      expect(a > c).toBe(true)
      expect(c > b).toBe(true)
      expect(d > c).toBe(true)
      done();
    })
  })
})
