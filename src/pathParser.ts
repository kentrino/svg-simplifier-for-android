interface Point {
  x: number
  y: number
}

interface Node {
  key: string
}

interface EndNode extends Node {
  key: "Z"
}

interface IntermediateNode extends Node {
  key: string
  coordinates: Point[]
}

interface MoveTo extends IntermediateNode {
  key: "M"
}

interface Curve extends IntermediateNode {
  key: "C"
}

interface Line extends IntermediateNode {
  key: "L"
}

function splitToNode(str: string) {
  const nodes = []
  let current = ""
  for (let i = 0; i < str.length; ++i) {
    if (str.charAt(i).match(/[MZCLmzcl]/)) {
      if (current !== "") {
        nodes.push(current)
      }
      current = str.charAt(i)
    } else {
      current += str.charAt(i)
    }
  }
  return nodes
}

export function pathParser(str: string) {

}
