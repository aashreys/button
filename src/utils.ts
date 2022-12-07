import { computeMaximumBounds } from "@create-figma-plugin/utilities"

export function getPage(node: SceneNode | PageNode): PageNode {
  let page
  let currentNode: any = node
  while (!page) {
    if (currentNode.type === 'PAGE') page = currentNode
    else currentNode = currentNode.parent
  }
  return page
}

export function isOnSamePage(nodes: SceneNode[]): boolean {
  let lastPage: PageNode | null = null

  for (let node of nodes) {
    let page = getPage(node as SceneNode)
    if (lastPage && lastPage.id !== page.id) {
      return false
    }
    lastPage = page
  }

  return true
}

export function getBounds(nodes: SceneNode[]): Rect {
  let bounds = computeMaximumBounds(nodes)
  let width = bounds[1].x - bounds[0].x
  let height = bounds[1].y - bounds[0].y
  return {
    x: bounds[0].x,
    y: bounds[0].y,
    width: width,
    height: height
  }
}

export function smoothScrollToNodes(nodes: SceneNode[], zoomScale: number, time: number): Promise<void> {
  let rect: Rect = getBounds(nodes)
  return smoothScrollToRect(rect, zoomScale, time)
}

export function smoothScrollToRect(rect: Rect, zoomScale: number, time: number): Promise<void> {
  let x = rect.x + rect.width / 2
  let y = rect.y + rect.height / 2
  let zoom1 = (figma.viewport.bounds.width * figma.viewport.zoom) / (rect.width * zoomScale)
  let zoom2 = (figma.viewport.bounds.height * figma.viewport.zoom) / (rect.height * zoomScale)
  let zoom = zoom1 < zoom2 ? zoom1 : zoom2
  return smoothScrollToPoint(x, y, zoom, time)
}

export function smoothScrollToPoint(x: number, y: number, zoom: number, time: number): Promise<void> {
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