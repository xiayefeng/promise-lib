type promiseFn = (arg?: any) => promise
interface listType {
  promise: promiseFn,
  cb: (() => promise) | Function
}

interface promise<T=any> extends Promise<T> {
}

class Scheduler {
  list: promiseFn[] = []
  waitList: listType[] = []
  private parallelNum: number = 2
  get parallel():number {
    return this.parallelNum
  }
  set parallel(num: number) {
    this.parallelNum = num
  }
  add (promiseCreator: promiseFn): promise {
    if (this.list.length < this.parallelNum) {
      this.list.push(promiseCreator)
      let promise:promise = promiseCreator()
      this.changeList(promise)
      return promise
    } else {
      // this.waitList.push(promiseCreator)
      return new Promise((resolve: Function, reject: Function) => {
        try {
          this.waitList.push({
            promise: promiseCreator,
            cb: resolve
          })
        } catch (err) {
          reject(err)
        }
      })
    }
  }
  changeList (promise: promise) {
    promise.then(() => {
      // console.log(this.waitList)
      if (this.waitList.length > 0) {
        // this.list.splice(idx, 1)
        let obj: listType | undefined = this.waitList.shift()
        let result:promise | undefined = obj?.promise()
        result?.then(() => {
          obj?.cb()
        })
        result && this.changeList(result)
      }
    })
  }
}

const request = (fn: Function, ctx: object, ...args: any[]) => new Promise(resolve => {
  fn.apply(ctx, args).then((res: any) => resolve(res))
})

const scheduler = new Scheduler()
const addPromise = (fn: Function, ctx: object, ...args: any[]) => {
   return scheduler.add(() => request(fn, ctx, args)).then((res: any) => Promise.resolve(res))
}

export function changeParallel(num: number){
  if(num) {
    num = num < 0 ? 0 : num
    scheduler.parallel = num
  } else {
    return scheduler.parallel
  }
}

export default addPromise