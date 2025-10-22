#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

interface AssetMap {
  [appName: string]: {
    logo?: string
    cover?: string
    screenshots?: string[]
  }
}

interface MissingAssetsReport {
  [appName: string]: {
    used?: string
    reason?: string
  }
}

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', 'assets-map.json')
const MISSING_ASSETS_LOG = path.join(process.cwd(), 'logs', 'missing-assets-report.json')

/**
 * Enhanced asset mapping script for EmmanuelOS v3.6
 * Scans entire /public/ directory and uses name similarity matching
 */
class AssetMapper {
  private assetMap: AssetMap = {}
  private missingAssetsReport: MissingAssetsReport = {}
  private allImages: { [filename: string]: string } = {}

  /**
   * Scans /public/apps/* directory and maps assets to app names
   */
  scanAppsDirectory(): void {
    const appsDir = path.join(PUBLIC_DIR, 'apps')

    if (!fs.existsSync(appsDir)) {
      console.log('⚠️  /public/apps directory not found')
      return
    }

    const appDirectories = fs.readdirSync(appsDir)
      .filter(item => {
        const itemPath = path.join(appsDir, item)
        return fs.statSync(itemPath).isDirectory()
      })

    console.log(`📁 Found ${appDirectories.length} app directories`)

    appDirectories.forEach(appName => {
      this.mapAppAssets(appName, path.join(appsDir, appName))
    })
  }

  /**
   * Scans entire /public/ directory for orphaned images that match app names
   */
  private async scanEntirePublicDirectory(): Promise<void> {
    console.log('🔍 Scanning entire /public/ directory for orphaned images...')

    this.scanDirectoryRecursive(PUBLIC_DIR)

    // Find images that match app names but aren't in direct app folders
    await this.findOrphanedImages()
  }

  /**
   * Recursively scans directory for image files
   */
  private scanDirectoryRecursive(dir: string, relativePath: string = ''): void {
    const items = fs.readdirSync(dir)

    items.forEach(item => {
      const fullPath = path.join(dir, item)
      const relPath = path.join(relativePath, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory() && !item.startsWith('.') && item !== 'apps') {
        this.scanDirectoryRecursive(fullPath, relPath)
      } else if (stat.isFile() && this.isImageFile(item)) {
        this.allImages[item.toLowerCase()] = relPath
      }
    })
  }

  /**
   * Finds orphaned images that match app names
   */
  private async findOrphanedImages(): Promise<void> {
    const appsData = await this.loadAppsData()
    const mappedAppNames = Object.keys(this.assetMap)

    appsData.forEach(app => {
      if (mappedAppNames.includes(app.name)) return // Already mapped

      // Try to find images that match this app name
      const appNameLower = app.name.toLowerCase()

      // Look for exact matches or partial matches
      for (const [filename, filepath] of Object.entries(this.allImages)) {
        const filenameLower = filename.toLowerCase()

        // Check for various matching patterns
        if (
          filenameLower.includes(appNameLower) ||
          filenameLower.includes(appNameLower.replace(/[^a-z0-9]/g, '')) ||
          this.calculateSimilarity(filenameLower, appNameLower) > 0.6
        ) {
          console.log(`🎯 Found potential match for "${app.name}": ${filepath}`)
          this.mapOrphanedAsset(app.name, filepath)
          break
        }
      }
    })
  }

  /**
   * Maps assets for a specific app
   */
  private mapAppAssets(appName: string, appDir: string): void {
    const assets = {
      logo: undefined as string | undefined,
      cover: undefined as string | undefined,
      screenshots: [] as string[]
    }

    const files = fs.readdirSync(appDir)

    files.forEach(file => {
      if (!this.isImageFile(file)) return

      const ext = path.extname(file).toLowerCase()
      const baseName = path.basename(file, ext).toLowerCase()

      const publicPath = `/apps/${appName}/${file}`

      if (baseName === 'logo') {
        assets.logo = publicPath
      } else if (baseName === 'cover') {
        assets.cover = publicPath
      } else if (baseName.startsWith('screenshot-') || baseName.includes('screenshot') || baseName.match(/screenshot\d+$/)) {
        const screenshotNumber = parseInt(baseName.replace(/screenshot[-]?/i, '').replace(/\D/g, '')) || 999
        if (!isNaN(screenshotNumber)) {
          assets.screenshots.push(publicPath)
        }
      }
    })

    // Sort screenshots numerically
    assets.screenshots.sort((a, b) => {
      const getScreenshotNumber = (filepath: string) => {
        const filename = path.basename(filepath, path.extname(filepath)).toLowerCase()
        const match = filename.match(/screenshot[-]?(\d+)/i)
        return match ? parseInt(match[1]) : 999
      }
      return getScreenshotNumber(a) - getScreenshotNumber(b)
    })

    // Set cover image as first screenshot if no explicit cover
    if (!assets.cover && assets.screenshots.length > 0) {
      assets.cover = assets.screenshots[0]
    }

    this.assetMap[appName] = assets

    console.log(`✅ Mapped assets for ${appName}:`)
    if (assets.logo) console.log(`   Logo: ${assets.logo}`)
    if (assets.cover) console.log(`   Cover: ${assets.cover}`)
    if (assets.screenshots.length > 0) console.log(`   Screenshots: ${assets.screenshots.length} files`)
  }

  /**
   * Maps an orphaned asset (image not in app folder but matches app name)
   */
  private mapOrphanedAsset(appName: string, imagePath: string): void {
    const filename = path.basename(imagePath).toLowerCase()
    const baseName = path.basename(filename, path.extname(filename))

    if (baseName === 'logo' || filename.includes('logo')) {
      this.assetMap[appName] = this.assetMap[appName] || {}
      this.assetMap[appName].logo = imagePath
      console.log(`   📍 Orphaned logo mapped: ${imagePath}`)
    } else if (baseName === 'cover' || filename.includes('cover')) {
      this.assetMap[appName] = this.assetMap[appName] || {}
      this.assetMap[appName].cover = imagePath
      console.log(`   📍 Orphaned cover mapped: ${imagePath}`)
    } else if (baseName.startsWith('screenshot-') || filename.includes('screenshot')) {
      this.assetMap[appName] = this.assetMap[appName] || {}
      if (!this.assetMap[appName].screenshots) this.assetMap[appName].screenshots = []
      this.assetMap[appName].screenshots!.push(imagePath)
      console.log(`   📍 Orphaned screenshot mapped: ${imagePath}`)

      // Set cover as first screenshot if no cover exists
      if (!this.assetMap[appName].cover && this.assetMap[appName].screenshots!.length === 1) {
        this.assetMap[appName].cover = imagePath
        console.log(`   📍 Set as cover image: ${imagePath}`)
      }
    }
  }

  /**
   * Checks if file is an image
   */
  private isImageFile(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase()
    return ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext)
  }

  /**
   * Calculates similarity between two strings (simple implementation)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1

    if (longer.length === 0) return 1.0

    const editDistance = this.levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  /**
   * Calculates Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = []

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }

    return matrix[str2.length][str1.length]
  }

  /**
   * Loads apps data from the data file
   */
  private async loadAppsData(): Promise<Array<{ name: string }>> {
    try {
      const dataPath = path.join(process.cwd(), 'src', 'data', 'someOfMyApps.js')
      const data = await import(dataPath)
      return data.default || []
    } catch (error) {
      console.error('Error loading apps data:', error)
      return []
    }
  }

  /**
   * Auto-allocates placeholder assets for missing visuals
   */
  private autoAllocateMissingAssets(): void {
    console.log('🔧 Auto-allocating placeholder assets for missing visuals...')

    const appsData = this.loadAppsDataSync()
    const unusedAssets = this.generateUnusedAssetsReport()

    appsData.forEach(app => {
      const assets = this.assetMap[app.name]
      const missingReport = this.missingAssetsReport[app.name]

      if (!assets || !missingReport) return

      // Auto-assign logo if missing
      if (!assets.logo) {
        const logoPlaceholder = this.findBestPlaceholder(app.name, 'logo', unusedAssets)
        if (logoPlaceholder) {
          this.assetMap[app.name] = this.assetMap[app.name] || {}
          this.assetMap[app.name].logo = logoPlaceholder
          missingReport.used = logoPlaceholder
          missingReport.reason = 'Auto-assigned placeholder'
          console.log(`   🎯 Auto-assigned logo for "${app.name}": ${logoPlaceholder}`)
        }
      }

      // Auto-assign cover if missing
      if (!assets.cover) {
        const coverPlaceholder = this.findBestPlaceholder(app.name, 'cover', unusedAssets)
        if (coverPlaceholder) {
          this.assetMap[app.name] = this.assetMap[app.name] || {}
          this.assetMap[app.name].cover = coverPlaceholder
          missingReport.used = coverPlaceholder
          missingReport.reason = 'Auto-assigned placeholder'
          console.log(`   🎯 Auto-assigned cover for "${app.name}": ${coverPlaceholder}`)
        }
      }

      // Auto-assign screenshots if missing
      if (!assets.screenshots || assets.screenshots.length === 0) {
        const screenshotPlaceholders = this.findBestPlaceholders(app.name, 'screenshot', unusedAssets, 3)
        if (screenshotPlaceholders.length > 0) {
          this.assetMap[app.name] = this.assetMap[app.name] || {}
          this.assetMap[app.name].screenshots = screenshotPlaceholders
          missingReport.used = screenshotPlaceholders.join(', ')
          missingReport.reason = 'Auto-assigned placeholders'
          console.log(`   🎯 Auto-assigned ${screenshotPlaceholders.length} screenshots for "${app.name}"`)
        }
      }
    })
  }

  /**
   * Synchronously loads apps data (for non-async operations)
   */
  private loadAppsDataSync(): Array<{ name: string }> {
    try {
      // Use dynamic import for ES modules compatibility
      const dataPath = path.join(process.cwd(), 'src', 'data', 'someOfMyApps.js')
      const dataModule = require(dataPath)
      return dataModule.default || []
    } catch (error) {
      console.error('Error loading apps data:', error)
      return []
    }
  }

  /**
   * Finds the best placeholder asset for a given type
   */
  private findBestPlaceholder(appName: string, type: string, unusedAssets: { [filename: string]: string }): string | null {
    const appNameLower = appName.toLowerCase()
    const typeLower = type.toLowerCase()

    // Look for exact matches first
    for (const [filename, filepath] of Object.entries(unusedAssets)) {
      const filenameLowerCase = filename.toLowerCase()

      if (filenameLowerCase.includes(typeLower) && filenameLowerCase.includes(appNameLower)) {
        delete unusedAssets[filename] // Remove from unused pool
        return filepath
      }
    }

    // Look for partial matches
    for (const [filename, filepath] of Object.entries(unusedAssets)) {
      const filenameLowerCase = filename.toLowerCase()

      if (filenameLowerCase.includes(typeLower) || filenameLowerCase.includes(appNameLower)) {
        delete unusedAssets[filename] // Remove from unused pool
        return filepath
      }
    }

    // Look for any image that might be suitable
    for (const [filename, filepath] of Object.entries(unusedAssets)) {
      const filenameLowerCase = filename.toLowerCase()
      if (filenameLowerCase.includes('screenshot') || filenameLowerCase.includes('logo') || filenameLowerCase.includes('cover')) {
        delete unusedAssets[filename] // Remove from unused pool
        return filepath
      }
    }

    return null
  }

  /**
   * Finds multiple placeholder assets for screenshots
   */
  private findBestPlaceholders(appName: string, type: string, unusedAssets: { [filename: string]: string }, count: number): string[] {
    const placeholders: string[] = []
    const typeLower = type.toLowerCase()

    // Look for screenshot files
    for (const [filename, filepath] of Object.entries(unusedAssets)) {
      const filenameLower = filename.toLowerCase()

      if (filenameLower.includes(typeLower)) {
        placeholders.push(filepath)
        delete unusedAssets[filename] // Remove from unused pool

        if (placeholders.length >= count) break
      }
    }

    // If we don't have enough, use any available images
    if (placeholders.length < count) {
      for (const [filename, filepath] of Object.entries(unusedAssets)) {
        placeholders.push(filepath)
        delete unusedAssets[filename] // Remove from unused pool

        if (placeholders.length >= count) break
      }
    }

    return placeholders.slice(0, count)
  }

  /**
   * Writes the asset map to JSON file
   */
  writeAssetMap(): void {
    const jsonContent = JSON.stringify(this.assetMap, null, 2)

    // Ensure data directory exists
    const dataDir = path.dirname(OUTPUT_FILE)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    fs.writeFileSync(OUTPUT_FILE, jsonContent)
    console.log(`💾 Asset map written to ${OUTPUT_FILE}`)
    console.log(`📊 Total apps mapped: ${Object.keys(this.assetMap).length}`)
  }

  /**
   * Writes missing assets report
   */
  private async writeMissingAssetsReport(): Promise<void> {
    await this.generateMissingAssetsReportSync()

    const logsDir = path.dirname(MISSING_ASSETS_LOG)
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true })
    }

    fs.writeFileSync(MISSING_ASSETS_LOG, JSON.stringify(this.missingAssetsReport, null, 2))
    console.log(`📝 Missing assets report written to ${MISSING_ASSETS_LOG}`)
  }

  /**
   * Generates missing assets report (synchronous version)
   */
  private generateMissingAssetsReportSync(): void {
    const appsData = this.loadAppsDataSync()

    appsData.forEach(app => {
      const assets = this.assetMap[app.name]
      if (!assets) {
        this.missingAssetsReport[app.name] = {
          reason: 'No assets found in mapping'
        }
        return
      }

      if (!assets.logo || !assets.cover || !assets.screenshots || assets.screenshots.length === 0) {
        this.missingAssetsReport[app.name] = {
          reason: 'Incomplete asset set'
        }
      }
    })
  }

  /**
   * Generates unused assets report (returns object for internal use)
   */
  generateUnusedAssetsReport(): { [filename: string]: string } {
    const usedImages = new Set<string>()

    // Collect all used image paths
    Object.values(this.assetMap).forEach(assets => {
      if (assets.logo) usedImages.add(assets.logo)
      if (assets.cover) usedImages.add(assets.cover)
      if (assets.screenshots) assets.screenshots.forEach(s => usedImages.add(s))
    })

    const unusedAssets: { [filename: string]: string } = {}

    // Find images that exist but aren't used
    Object.entries(this.allImages).forEach(([filename, filepath]) => {
      if (!usedImages.has(filepath) && !usedImages.has(`/${filepath}`)) {
        unusedAssets[filename] = filepath
      }
    })

    return unusedAssets
  }

  /**
   * Cleans up unused assets by moving them to archive folder
   */
  private cleanupUnusedAssets(): void {
    console.log('🧹 Cleaning up unused assets...')

    const unusedAssets = this.generateUnusedAssetsReport()
    const archiveDir = path.join(PUBLIC_DIR, '_archive')

    // Create archive directory if it doesn't exist
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true })
    }

    let movedCount = 0
    Object.values(unusedAssets).forEach(filepath => {
      const fullPath = path.join(PUBLIC_DIR, filepath)

      if (fs.existsSync(fullPath)) {
        const filename = path.basename(filepath)
        const archivePath = path.join(archiveDir, filename)

        try {
          fs.renameSync(fullPath, archivePath)
          movedCount++
          console.log(`   📦 Moved to archive: ${filepath} → _archive/${filename}`)
        } catch (error) {
          console.error(`   ❌ Failed to move ${filepath}:`, error)
        }
      }
    })

    console.log(`✅ Cleanup completed: ${movedCount} unused assets archived`)
  }

  /**
   * Main execution method
   */
  async execute(): Promise<void> {
    console.log('🚀 EmmanuelOS v3.6 Asset Mapping System')
    console.log('=====================================')

    // Step 1: Scan app directories
    this.scanAppsDirectory()

    // Step 2: Scan entire public directory for orphaned images
    await this.scanEntirePublicDirectory()

    // Step 3: Write asset map
    this.writeAssetMap()

    // Step 4: Write reports
    await this.writeMissingAssetsReport()
    this.cleanupUnusedAssets()

    console.log('\n🎉 Asset mapping completed!')
    console.log('Next steps:')
    console.log('1. Review /logs/missing-assets-report.json for incomplete assets')
    console.log('2. Review /public/_archive/ for archived unused assets')
    console.log('3. Place actual image assets in /public/apps/[AppName]/')
    console.log('4. Run this script again to update mappings')
  }
}

// Execute the mapper
async function main() {
  const mapper = new AssetMapper()
  await mapper.execute()
}

main().catch(console.error)
