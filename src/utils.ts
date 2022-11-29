import { getAbsolutePosition } from "@create-figma-plugin/utilities"

export function getFormattedUrl(url: string): string {
  if (url.length > 0 && url.indexOf(':') < 0) {
    url = 'https://' + url
  }
  return url
}

export function isThisFile(url: string): boolean {
  let formattedFilename = figma.root.name.trim()
  console.log(formattedFilename)
  formattedFilename = encodeURIComponent(formattedFilename).replace(/%20/g, '-')
  let isThisFile = url.includes('figma.com') && url.includes(formattedFilename)
  // console.log(formattedFilename)
  // console.log(url)
  // console.log('Is this file: ' + isThisFile)
  return isThisFile
}

export function getNodeIdFromUrl(url: string): string | null {
  url = url.toLowerCase()
  let startIndex: number = url.indexOf('node-id=') + 8
  let endIndex: number = url.indexOf('&', startIndex)
  if (startIndex) {
    if (endIndex > 0) {
      return url.substring(startIndex, endIndex).replace('%3a', ':')
    } else {
      return url.substring(startIndex).replace('%3a', ':')
    }
  } else {
    return null
  }
}

export function getParentPage(node: SceneNode | PageNode): PageNode {
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
    }
  )
}

function lerp(a: number, b: number, t: number) {
  return (1 - t) * a + t * b
}

function easeOutQuint(x: number): number {
  return 1 - Math.pow(1 - x, 5);
}