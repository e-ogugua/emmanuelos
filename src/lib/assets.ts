import { App, AssetMap } from '@/lib/types'
import assetsMapData from '@/data/assets-map.json'

/**
 * Merges app data with visual assets from assets-map.json
 * @param apps - Array of app objects from the API/database
 * @returns Array of apps with visual assets attached
 */
export function mergeAppAssets(apps: App[]): App[] {
  const assetsMap: AssetMap = assetsMapData

  return apps.map(app => {
    const appAssets = assetsMap[app.name] || assetsMap[app.name.toLowerCase()]

    if (appAssets) {
      return {
        ...app,
        logo: appAssets.logo,
        cover: appAssets.cover,
        screenshots: appAssets.screenshots
      }
    }

    return app
  })
}

/**
 * Gets visual assets for a specific app by name
 * @param appName - Name of the app
 * @returns Asset object or null if not found
 */
export function getAppAssets(appName: string) {
  const assetsMap: AssetMap = assetsMapData
  return assetsMap[appName] || assetsMap[appName.toLowerCase()] || null
}
