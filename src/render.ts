function createDom(fiber) {
  const dom = fiber.type === 'TEXT_ELEMENT'
  ? document.createTextNode("")
  : document.createElement(fiber.type);

  Object.keys(fiber.props)
    .filter(key => key !== 'children')
    .forEach(name => {
      dom[name] = fiber.props[name];
    });

  return dom;
}


let nextUnitOfWork = null;
let wipRoot = null;

export function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    }
  }
  nextUnitOfWork = wipRoot;
}

function workLoop(deadline: IdleDeadline) {
 let shouldYield = false;
 while (nextUnitOfWork && !shouldYield) {
   nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
   shouldYield = deadline.timeRemaining() < 1;
 }

 if (!nextUnitOfWork && wipRoot) {
   commitRoot();
 }
 requestIdleCallback(workLoop)
}

function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;
  while(index < elements.length) {
    const element = elements[index];
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    if (index = 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
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

function commitRoot() {
  commitWork(wipRoot.child);
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}