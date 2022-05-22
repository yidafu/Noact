import { deletions, setCurrentRoot, setWipRoot, wipRoot } from "./glabolVariable";
import { Fiber, IVNodeProps } from "./interface";
import { isEvent, isNew, isProperty } from "./utils";


export function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot?.child!);
  setCurrentRoot(wipRoot);
  setWipRoot(null)
}

function commitWork(fiber?: Fiber | null) {
  if (!fiber) {
    return;
  }

  let domParentFiber = fiber.parent;
  while (!domParentFiber!.dom) {
    domParentFiber = domParentFiber!.parent
  }
  const domParent = domParentFiber!.dom;
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom !== null) {
    domParent?.appendChild(fiber.dom);
  } else if (fiber.effectTag === 'DELETION' && fiber.dom !== null) {
    commitDeletion(fiber, domParent);
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom !== null) {
    updateDom(fiber.dom, fiber.alternate?.props!, fiber.props)
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitDeletion(fiber: Fiber, domParent: HTMLElement | Text) {
  if (fiber.dom != null) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child!, domParent);
  }
}

export function updateDom(dom: HTMLElement | Text, prevProps: IVNodeProps, nextProps: IVNodeProps) {

  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      if (dom instanceof HTMLElement && typeof prevProps[name as keyof HTMLElement | keyof Text] === 'function') {
        const eventType = name.toLowerCase().substring(2) as keyof HTMLElementEventMap;
        dom.removeEventListener(eventType, prevProps[name as keyof HTMLElement | keyof Text] as EventListenerOrEventListenerObject);
      }
    })
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2) as keyof GlobalEventHandlersEventMap;
      dom.addEventListener(eventType, nextProps[name as keyof HTMLElement | keyof Text] as EventListenerOrEventListenerObject)
    })

  Object.keys(prevProps)
    .filter(isProperty)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      // @ts-ignore
      dom[name] = '';
    })
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      // @ts-ignore
      dom[name] = nextProps[name]
    })
}