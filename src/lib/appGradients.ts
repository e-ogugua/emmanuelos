// Generate dynamic gradient colors based on app data for unique hero sections
export function generateAppGradient(appName: string, category: string, status: string) {
  // Create deterministic but varied gradients based on app properties
  const seed = appName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) +
               category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) +
               status.length * 100

  // Brand color palette
  const gradients = [
    // Sky to Blue gradients
    'from-sky-500/80 via-blue-600/70 to-indigo-700/80',
    'from-sky-400/75 via-blue-500/65 to-indigo-600/75',
    'from-sky-600/85 via-blue-700/75 to-indigo-800/85',

    // Blue to Indigo gradients
    'from-blue-500/80 via-indigo-600/70 to-purple-700/80',
    'from-blue-400/75 via-indigo-500/65 to-purple-600/75',
    'from-blue-600/85 via-indigo-700/75 to-purple-800/85',

    // Indigo to Purple gradients
    'from-indigo-500/80 via-purple-600/70 to-pink-700/80',
    'from-indigo-400/75 via-purple-500/65 to-pink-600/75',
    'from-indigo-600/85 via-purple-700/75 to-pink-800/85',

    // Purple to Pink gradients
    'from-purple-500/80 via-pink-600/70 to-rose-700/80',
    'from-purple-400/75 via-pink-500/65 to-rose-600/75',
    'from-purple-600/85 via-pink-700/75 to-rose-800/85',

    // Cyan to Teal gradients
    'from-cyan-500/80 via-teal-600/70 to-emerald-700/80',
    'from-cyan-400/75 via-teal-500/65 to-emerald-600/75',
    'from-cyan-600/85 via-teal-700/75 to-emerald-800/85',

    // Emerald to Green gradients
    'from-emerald-500/80 via-green-600/70 to-teal-700/80',
    'from-emerald-400/75 via-green-500/65 to-teal-600/75',
    'from-emerald-600/85 via-green-700/75 to-teal-800/85',

    // Orange to Red gradients
    'from-orange-500/80 via-red-600/70 to-pink-700/80',
    'from-orange-400/75 via-red-500/65 to-pink-600/75',
    'from-orange-600/85 via-red-700/75 to-pink-800/85',
  ]

  const gradientIndex = seed % gradients.length
  const selectedGradient = gradients[gradientIndex]

  // Generate complementary animated border gradient
  const borderGradients = [
    'from-sky-400/30 via-blue-500/25 to-indigo-500/30',
    'from-blue-400/30 via-indigo-500/25 to-purple-500/30',
    'from-indigo-400/30 via-purple-500/25 to-pink-500/30',
    'from-purple-400/30 via-pink-500/25 to-rose-500/30',
    'from-cyan-400/30 via-teal-500/25 to-emerald-500/30',
    'from-emerald-400/30 via-green-500/25 to-teal-500/30',
    'from-orange-400/30 via-red-500/25 to-pink-500/30',
  ]

  const borderIndex = (seed + 7) % borderGradients.length
  const animatedBorder = borderGradients[borderIndex]

  return {
    mainGradient: selectedGradient,
    animatedBorder,
    // Generate accent colors based on the same seed
    accentColor: ['sky', 'blue', 'indigo', 'purple', 'pink', 'cyan', 'emerald'][seed % 7]
  }
}
