import { Fiber } from "./interface";

export let nextUnitOfWork: Fiber | null = null;
export let wipRoot: Fiber | null = null;
export let currentRoot: Fiber | null = null;
export let deletions: Fiber[] = [];
export let wipFiber: Fiber | null = null;
export let hookIndex = -1;

export function setNextNunitOfWork(newNextUnitOfWork: Fiber | null) {
  nextUnitOfWork = newNextUnitOfWork;
}

export function setWipRoot(newWipRoot: Fiber | null) {
  wipRoot = newWipRoot;
}

export function setCurrentRoot(newCurrentRoot: Fiber | null) {
  currentRoot = newCurrentRoot;
}

export function appendDeletion(fiber: Fiber) {
  deletions.push(fiber);
}

export function resetDeletion() {
  deletions.length = 0;
}

export function setWipFiber(newWipFiber: Fiber | null) {
  wipFiber = newWipFiber;
}

export function setHookIndex(index: number) {
  hookIndex = index;
}