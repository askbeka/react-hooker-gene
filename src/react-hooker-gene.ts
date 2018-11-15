import {
  useContext as reactUseContext,
  useReducer as reactUseReducer,
  useRef as reactUseRef,
  useMutationEffect as reactUseMutationEffect,
  useLayoutEffect as reactUseLayoutEffect,
  useEffect as reactUseEffect,
  useImperativeMethods as reactUseImperativeMethods,
  useCallback as reactUseCallback,
  useMemo as reactUseMemo
} from 'react'

const hookSymbol = Symbol.for('hook')

interface Hook {
  [hookSymbol]: boolean
  hook: Function
  payload: Array<any>
}

type component = (arg: Object) => Iterator<Hook>

export function makeHook(hook: Function, ...payload: any[]): Hook {
  return {
    [hookSymbol]: true,
    hook,
    payload
  }
}

export default (generator: component) => (props: Object) => {
  const it = generator(props)
  let result = it.next()

  while (!result.done) {
    let value
    if (result.value && result.value[hookSymbol]) {
      value = result.value.hook(...result.value.payload)
    } else {
      throw new Error('Illegal yield. Only hooks and other generators(yield*) can be yielded')
    }
    result = it.next(value)
  }

  return result.value
}

export const useContext = (...args: any[]) => makeHook(reactUseContext, args)
export const useReducer = (...args: any[]) => makeHook(reactUseReducer, args)
export const useRef = (...args: any[]) => makeHook(reactUseRef, args)
export const useMutationEffect = (...args: any[]) => makeHook(reactUseMutationEffect, args)
export const useLayoutEffect = (...args: any[]) => makeHook(reactUseLayoutEffect, args)
export const useEffect = (...args: any[]) => makeHook(reactUseEffect, args)
export const useImperativeMethods = (...args: any[]) => makeHook(reactUseImperativeMethods, args)
export const useCallback = (...args: any[]) => makeHook(reactUseCallback, args)
export const useMemo = (...args: any[]) => makeHook(reactUseMemo, args)
