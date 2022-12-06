import { getAbsolutePosition } from "@create-figma-plugin/utilities"

export function getPage(node: SceneNode | PageNode): PageNode {
  let page
  let currentNode = node
  while (!page) {
    if (currentNode.type === 'PAGE') page = currentNode
    else currentNode = currentNode.parent as (SceneNode | PageNode)
  }
  return page
}

export async function smoothScrollToNode(node: SceneNode, time: number): Promise<void> {
  let nodePosition = getAbsolutePosition(node)
  let x = nodePosition.x + node.width / 2
  let y = nodePosition.y + node.height / 2
  let zoomMultiplier = 1.2
  let zoom: number
  if (node.width > node.height) {
    zoom = (figma.viewport.bounds.width * figma.viewport.zoom) / (node.width * zoomMultiplier)
  }
  else {
    zoom = (figma.viewport.bounds.height * figma.viewport.zoom) / (node.height * zoomMultiplier)
  }
  return smoothScrollToPoint(x, y, zoom, time)
}

export function smoothScrollToPoint(x: number, y: number, zoom: number, time: number) {
  let startX = figma.viewport.center.x
  let startY = figma.viewport.center.y
  let distX = x - startX
  let distY = y - startY

  let startZoom = figma.viewport.zoom
  let endZoom = zoom

  let currentTime = 0
  let intervalMs = 1
  return new Promise<void>((resolve) => {
    let animateViewport = () => {
      currentTime++
      figma.viewport.center = {
        x: startX + lerp(0, distX, easeOutQuint(currentTime / time)),
        y: startY + lerp(0, distY, easeOutQuint(currentTime / time)),
      }

      figma.viewport.zoom = lerp(startZoom, endZoom, easeOutQuint(currentTime / time))

      if (currentTime < time) {
        setTimeout(() => { animateViewport() }, intervalMs)
      }
      else {
        resolve()
      }
    }
    setTimeout(() => { animateViewport() }, intervalMs)
  })
}

function lerp(a: number, b: number, t: number) {
  return (1 - t) * a + t * b
}

function easeOutQuint(x: number): number {
  return 1 - Math.pow(1 - x, 5);
}