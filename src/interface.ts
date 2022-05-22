type FiberType = keyof HTMLElementTagNameMap | Function | 'TEXT_ELEMENT'

type VNodeType = FiberType;

export interface Fiber {
  type: FiberType;
  props: IVNodeProps;
  dom: HTMLElement | Text | null;
  parent?: Fiber;
  child?: Fiber;
  sibling?: Fiber;
  alternate: Fiber | null;
  effectTag?: 'UPDATE' | 'PLACEMENT' | 'DELETION';

  hooks?: FiberHook[];
}

export interface FiberHook {
  state: any;
  queue: Function[];
}

export interface VNode {
  type: VNodeType;
  props: IVNodeProps;
}

export type IVNodeProps = {
  [key in keyof HTMLElement | keyof Text]: string | EventListenerOrEventListenerObject;
} & {
  children: VNode[];
};