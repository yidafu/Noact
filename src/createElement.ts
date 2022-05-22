import { IVNodeProps, VNode } from "./interface"

export function createElement(type: String, props: IVNodeProps, ...children: VNode[]) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => typeof child == 'object' ? child : createTextElement(child)),
    }
  }
}

function createTextElement(text: string) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    }
  }
}