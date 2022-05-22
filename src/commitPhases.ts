import { deletions, setCurrentRoot, setWipRoot, wipRoot } from "./glabolVariable";
import { Fiber, IVNodeProps } from "./interface";
import { isEvent, isGone, isNew, isProperty } from "./utils";


export function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  setCurrentRoot(wipRoot);
  setWipRoot(null)
}

function commitWork(fiber: Fiber | null) {
  if (!fiber) {
    return;
  }

  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent
  }
  const domParent = domParentFiber.dom;
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom !== null) {
    domParent?.appendChild(fiber.dom);
  } else if (fiber.effectTag === 'DELETION' && fiber.dom !== null) {
    commitDeletion(fiber, domParent);
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom !== null) {
    updateDom(fiber.dom, fiber.alternate?.props, fiber.props)
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitDeletion(fiber: Fiber, domParent: HTMLElement) {
  if (fiber.dom != null) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

export function updateDom(dom: HTMLElement, prevProps: IVNodeProps, nextProps: IVNodeProps) {

  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    })
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name])
      // dom[name] = ''
    })

  Object.keys(prevProps)
    .filter(isProperty)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      // dom.setAttribute(name, '');
      dom[name] = ''
    })
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      // dom.setAttribute(name, nextProps[name]);
      dom[name] = nextProps[name]
    })
}