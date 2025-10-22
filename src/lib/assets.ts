import { App, AssetMap } from '@/lib/types'
import assetsMapData from '@/data/assets-map.json'

/**
 * Merges app data with visual assets from assets-map.json
 * @param apps - Array of app objects from the API/database
 * @returns Array of apps with visual assets attached
 */
export function mergeAppAssets(apps: App[]): App[] {
  const assetsMap: AssetMap = assetsMapData

  // Create a mapping for apps with different naming conventions
  const nameMappings: { [key: string]: string } = {
    'Emmdra Empire & Lifestyle': 'emmdraEmpireImages',
    'Zereth Cakes Hub': 'Zereth_CakesHubImages',
    'Jepligom Ministry Portal': 'JepligomMinistryPortal',
    'CEOTR Ltd ERP Suite': 'ceotr-erp-suite',
    'CEO Writes': 'ceowrites-emmanuelBlogHub',
    'CodeMentor Academy': 'codementor-academy',
    'FinanceFlow Pro': 'financeflow-pro',
    'Workflow Hub': 'workflow-hub',
    'Bible Game Hub': 'Bible-game-hub',
    'PoshPOULE Farms Website & ERP Suite': 'PoshPOULEfarmsErpSuite',
    'FarmTrack': 'farmTrack',
    'EmmanuelOS': 'EmmanuelOS',
    'ceodev - Chukwuka Emmanuel Ogugua': 'ceodev',
    'FinEdge-Pro v2': 'finedge-pro-v2',
    'FinEdge Global': 'finedge-global',
    'PoshPoulet Scratch Game': 'poshpoulet-scratch-game'
  }

  return apps.map(app => {
    // Try direct mapping first
    let appAssets = assetsMap[nameMappings[app.name]] || assetsMap[app.name]

    if (!appAssets) {
      // Try lowercase version
      appAssets = assetsMap[app.name.toLowerCase()]
    }

    if (!appAssets) {
      // Try common variations from the assets map
      const variations = [
        app.name.replace(/\s+/g, '').toLowerCase(),
        app.name.replace(/[^a-zA-Z0-9]/g, ''),
        app.name.split(' ')[0].toLowerCase(),
        app.name.replace(/\s+/g, '-').toLowerCase(),
        app.name.replace(/\s+/g, '_').toLowerCase()
      ]

      for (const variation of variations) {
        appAssets = assetsMap[variation]
        if (appAssets) break
      }
    }

    if (appAssets) {
      // Ensure we have a cover image - use first screenshot if no cover specified
      const cover = appAssets.cover || (appAssets.screenshots && appAssets.screenshots.length > 0 ? appAssets.screenshots[0] : undefined)

      return {
        ...app,
        logo: appAssets.logo,
        cover: cover,
        screenshots: appAssets.screenshots || []
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
