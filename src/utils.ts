import { getAbsolutePosition, setAbsolutePosition } from "@create-figma-plugin/utilities"

export function getFormattedUrl(url: string): string {
  if (url.length > 0 && url.indexOf(':') < 0) {
    url = 'https://' + url
  }
  return url
}

export function getNodeIdFromUrl(figmaUrl: string): string {
  figmaUrl = figmaUrl.toLowerCase()
  let startIndex: number = figmaUrl.indexOf('node-id=') + 8
  let endIndex: number = figmaUrl.indexOf('&', startIndex)
  let id = ''
  if (endIndex > 0) {
    id = figmaUrl.substring(startIndex, endIndex).replace('%3a', ':')
  } else {
    id = figmaUrl.substring(startIndex).replace('%3a', ':')
  }
  return id
}

export function containsFigmaNode(url: string): boolean {
  url = url.toLowerCase()
  return url.indexOf('figma') > 0 && url.indexOf('node-id=') > 0
}

export function getPageOfNode(node: BaseNode): PageNode {
  let page
  let currentNode = node
  while (!page) {
    if (currentNode.type === 'PAGE') {
      page = currentNode
    }
    else {
      currentNode = currentNode.parent as (BaseNode & ChildrenMixin)
    }
  }
  return page
}

export async function smoothScrollToNode(node: SceneNode, time: number): Promise<void> {
  let nodePosition = getAbsolutePosition(node)

  // Calulate distance to move viewport
  let startX = figma.viewport.center.x
  let startY = figma.viewport.center.y
  let distX = nodePosition.x + node.width / 2 - startX
  let distY = nodePosition.y + node.height / 2 - startY
  
  // Caculate zoom level of viewport
  let zoomMultiplier = 1.2
  let startZoom = figma.viewport.zoom
  let endZoom: number
  if (node.width >= node.height) {
    endZoom = (figma.viewport.bounds.width * figma.viewport.zoom) / (node.width * zoomMultiplier)
  }
  else {
    endZoom = (figma.viewport.bounds.height * figma.viewport.zoom) / (node.height * zoomMultiplier)
  }

  let currentTime = 0
  let intervalMs = 1
  return new Promise((resolve) => {
      let animateViewport = () => {
        currentTime++
        figma.viewport.center = {
          x: startX + lerp(0, distX, currentTime / time),
          y: startY + lerp(0, distY, currentTime / time),
        }

        figma.viewport.zoom = lerp(startZoom, endZoom, currentTime / time)

        if (currentTime < time) {
          setTimeout(() => { animateViewport() }, intervalMs)
        }
        else {
          resolve()
        }
      }
      setTimeout(() => { animateViewport() }, intervalMs)
    }
  )
  
  
}

function lerp(a: number, b: number, t: number) {
  return (1 - t) * a + t * b
}

 

// Node
// https://www.figma.com/file/GQIqlT9vTJH1U4MWlhh13t/2022---Button-Widget?node-id=1807%3A5&viewport=660%2C335%2C1.98&t=7E1lbXbv4b7PzMpp-11

// Page
// https://www.figma.com/file/GQIqlT9vTJH1U4MWlhh13t/2022---Button-Widget?node-id=1701%3A431&viewport=403%2C311%2C0.71&t=7E1lbXbv4b7PzMpp-11

// Widget
// https://www.figma.com/file/GQIqlT9vTJH1U4MWlhh13t/2022---Button-Widget?node-id=1813%3A2&t=7E1lbXbv4b7PzMpp-4

// 1813:383
// https://www.figma.com/file/GQIqlT9vTJH1U4MWlhh13t/2022---Button-Widget?node-id=1801%3A12