import { commitRoot, updateDom } from "./commitPhases";
import { currentRoot, hookIndex, nextUnitOfWork, resetDeletion, setHookIndex, setNextNunitOfWork as setNextUnitOfWork, setWipFiber, setWipRoot, wipFiber, wipRoot } from "./glabolVariable";
import { Fiber, VNode } from "./interface";
import { reconcileChildren } from "./reconcile";
import { isEvent, isProperty } from "./utils";


function createDom(fiber: Fiber) {
  const dom = fiber.type === 'TEXT_ELEMENT'
  ? document.createTextNode("")
  : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
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
}

function updateFunctionComponent(fiber: Fiber) {
  setWipFiber(fiber);
  setHookIndex(0);
  wipFiber.hooks = []
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber: Fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);
}


export function useState(initail) {
  const oldHook = wipFiber?.alternate?.hooks[hookIndex];
  const hook = {
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
      dom: currentRoot?.dom,
      props: currentRoot?.props,
      alternate: currentRoot,
    });
    setNextUnitOfWork(wipRoot);
    resetDeletion();
  }
  wipFiber?.hooks.push(hook);
  setHookIndex(hookIndex + 1);
  return [hook.state, setState];
}