import { getAbsolutePosition } from "@create-figma-plugin/utilities"
import { UrlType } from "./main"

const NODE_NAV_SCHEME = 'button:navigateTo -> '

export function formatUrl(url: string): string {
  if (url.length > 0 && url.indexOf(':') < 0) {
    url = 'https://' + url
  }
  return url
}

export function isURLFromThisFile(url: string): boolean {
  let formattedFilename = figma.root.name.trim()
  formattedFilename = encodeURIComponent(formattedFilename).replace(/%20/g, '-')
  let isThisFile = getUrlType(url) === UrlType.FIGMA && url.includes(formattedFilename)
  // console.log(formattedFilename)
  // console.log(url)
  // console.log('Is this file: ' + isThisFile)
  return isThisFile
}

export function getNodeIdFromUrl(url: string): string | null {
  let nodeId = null

  let urlType = getUrlType(url)

  if (urlType === UrlType.FIGMA) {
    url = url.toLowerCase()
    let startIndex: number = url.indexOf('node-id=') + 8
    let endIndex: number = url.indexOf('&', startIndex)
    if (startIndex) {
      if (endIndex > 0) {
        nodeId = url.substring(startIndex, endIndex).replace('%3a', ':')
      } else {
        nodeId = url.substring(startIndex).replace('%3a', ':')
      }
    }
  }
  
  if (urlType === UrlType.NODE_NAV) {
    nodeId = url.replace(NODE_NAV_SCHEME, '')
  }

  return nodeId
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

export async function smoothScroll(node: SceneNode, time: number): Promise<void> {
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
  if (node.width > node.height) {
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

export function createNodeNavigationUrl(id: string): string {
  return NODE_NAV_SCHEME + id
}

export function getUrlType(url: string): UrlType {
  if (url.length === 0) return UrlType.EMPTY
  if (url.includes('figma.com')) return UrlType.FIGMA
  if (url.includes(NODE_NAV_SCHEME)) return UrlType.NODE_NAV
  return UrlType.WEB
}