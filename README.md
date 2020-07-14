## promise-parallel-serial

``` js
import addPromise, {changeParallel} from 'promise-parallel-serial'

// fn：function () {return new Promise()}
// ctx: this
// args: fn.call(ctx, args)
addPromise(fn: Promise, ctx, args)

// get parallel num
changeParallel() //  get current parallel , default is 2

// change parallel num
changeParallel(3) // set parallel is 3

```
