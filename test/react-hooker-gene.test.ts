import wrapper, { makeHook } from '../src/react-hooker-gene'

describe('react-hooker-gene', () => {
  it('should call valid hook', () => {
    const hook = jest.fn()
    const hookCallback = jest.fn()

    const Component = wrapper(function*() {
      yield hook()

      return 'success'
    })

    hook.mockReturnValue(makeHook(hookCallback))
    Component({})

    expect(hookCallback.mock.calls.length).toBe(1)
  })

  it('should throw on invalid', () => {
    const callback = jest.fn()
    const invalid = jest.fn()
    invalid.mockReturnValue({ hook: callback, payload: [] })

    const Component = wrapper(function*() {
      yield invalid()

      return 'success'
    })

    expect(() => Component({})).toThrow(
      'Illegal yield. Only hooks and other generators(yield*) can be yielded'
    )
    expect(callback.mock.calls.length).toBe(0)
  })

  it('should pass props to generator', () => {
    const hook = jest.fn()

    const props = {}
    const Component = wrapper(function*(props) {
      yield hook(props)

      return 'success'
    })

    hook.mockReturnValue(makeHook(() => {}))

    Component(props)

    expect(hook.mock.calls[0][0]).toBe(props)
  })

  it('should pass result of hook to yield return', () => {
    const hook = jest.fn()
    const hookCallback = jest.fn()

    const Component = wrapper(function*() {
      const value = yield hook()
      yield hook(value)

      return 'success'
    })

    const value = 'value'

    hook.mockReturnValue(makeHook(hookCallback))
    hookCallback.mockReturnValue(value)
    Component({})

    expect(hook.mock.calls[1][0]).toBe(value)
  })

  it('should return generator return when run successfully', () => {
    const hook = jest.fn()

    const template = 'success'

    const Component = wrapper(function*() {
      yield hook()

      return template
    })

    hook.mockReturnValue(makeHook(() => {}))

    expect(Component({})).toBe(template)
  })
})
