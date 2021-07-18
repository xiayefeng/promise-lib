import {version} from '../package.json'

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
  add (promiseCreator: promiseFn): promise | never {
    if(typeof promiseCreator !== 'function') {
      throw new Error('fn must be a function')
    }
    
    if (this.list.length < this.parallelNum) {
      this.list.push(promiseCreator)
      let promise:promise = promiseCreator()
      if (typeof promise.then !== 'function') {
        throw new Error('fn function must return a <Promise>')
      }
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
    promise?.then(() => {
      // console.log(this.waitList)
      if (this.waitList.length > 0) {
        const obj = this.waitList.shift()
        const result = obj?.promise()
        result?.then(() => {
          obj?.cb()
        })
        result && this.changeList(result)
      } else {
        this.list.length = 0
      }
    }).catch(err => {
      console.log(err)
    })
  }
}

const scheduler: Scheduler = new Scheduler()

const addPromise = (fn: Function, ctx: object, ...args: any[]) => {
   return scheduler.add(() => 
   fn.apply(ctx, args))?.then((res: any) => 
   Promise.resolve(res))
   .catch(err => Promise.reject(err))
}

addPromise.version = version


export function changeParallel(num: number|void): number | never{
  if (num != null) {
    if (typeof num !== 'number') {
      throw new TypeError('function changeParallel params must be number')
    }
    num = num <= 0 ? 1 : num
    scheduler.parallel = num
    return num
  } else {
    return scheduler.parallel
  }
}

export default addPromise