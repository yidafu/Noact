import { commitRoot, updateDom } from "./commitPhases";
import { currentRoot, hookIndex, nextUnitOfWork, resetDeletion, setHookIndex, setNextNunitOfWork as setNextUnitOfWork, setWipFiber, setWipRoot, wipFiber, wipRoot } from "./glabolVariable";
import { Fiber, FiberHook, IVNodeProps, VNode } from "./interface";
import { reconcileChildren } from "./reconcile";


function createDom(fiber: Fiber) {
  if (typeof fiber.type !== 'function') {
    const dom = fiber.type === 'TEXT_ELEMENT'
      ? document.createTextNode("")
      : document.createElement(fiber.type);
    updateDom(dom, {} as IVNodeProps, fiber.props);
    return dom;
  }
  throw new TypeError('Fiber.type must be a HTML Tag or String');
}


export function render(element: VNode, container: HTMLElement) {
  setWipRoot({
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  });
  resetDeletion()
  setNextUnitOfWork(wipRoot);
}

function workLoop(deadline: IdleDeadline) {
  console.log('work loop ...');
 let shouldYield = false;
 while (nextUnitOfWork && !shouldYield) {
  const newNextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  setNextUnitOfWork(newNextUnitOfWork);
  shouldYield = deadline.timeRemaining() < 1;
 }

 if (!nextUnitOfWork && wipRoot) {
   commitRoot();
 }
 requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop);

function performUnitOfWork(fiber: Fiber) {

  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }


  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber  = nextFiber.parent;
  }
  return null;
}

function updateFunctionComponent(fiber: Fiber) {
  setWipFiber(fiber);
  setHookIndex(0);
  wipFiber!.hooks = [] as FiberHook[]
  const children = [(fiber.type as Function)(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber: Fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);
}


export function useState(initail: any) {
  const oldHook = wipFiber?.alternate?.hooks?.[hookIndex];
  const hook: FiberHook = {
    state: oldHook ? oldHook.state : initail,
    queue: [],
  }
  const actions = oldHook ? oldHook.queue : [];
  actions.forEach(action => {
    hook.state = action(hook.state);
  })
  const setState = (action: Function) => {
    hook.queue.push(action);
    setWipRoot({
      type: currentRoot!.type,
      dom: currentRoot!.dom,
      props: currentRoot!.props,
      alternate: currentRoot,
    });
    setNextUnitOfWork(wipRoot);
    resetDeletion();
  }
  wipFiber?.hooks?.push(hook);
  setHookIndex(hookIndex + 1);
  return [hook.state, setState];
}