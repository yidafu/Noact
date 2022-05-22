
export interface Fiber {
  type: string | Function;
  props: Record<string, any>;
  dom: HTMLElement | Text | null;
  parent: Fiber;
  child?: Fiber;
  sibling?: Fiber;
  alternate: Fiber | null;
  effectTag: 'UPDATE' | 'PLACEMENT' | 'DELETION';

  hooks: { state: any, queue: Function[] };
}

export interface VNode {
  type: string;
  props: IVNodeProps;
}

export interface IVNodeProps {
  children: VNode;
  [key: string]: string | Function;
}