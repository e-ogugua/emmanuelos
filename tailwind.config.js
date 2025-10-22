/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			// EmmanuelOS Border Radius Scale - Consistent corner rounding
  			'xs': '0.125rem',    // 2px
  			'sm': '0.25rem',     // 4px
  			'md': '0.375rem',    // 6px
  			'lg': '0.5rem',      // 8px
  			'xl': '0.75rem',     // 12px - Primary for cards
  			'2xl': '1rem',       // 16px - Large cards, modals
  			'3xl': '1.5rem',     // 24px - Special elements
  			'full': '9999px'
  		},
  		spacing: {
  			// EmmanuelOS Spacing Scale - 8px base system
  			'0.5': '0.125rem',   // 2px
  			'1': '0.25rem',      // 4px
  			'1.5': '0.375rem',   // 6px
  			'2': '0.5rem',       // 8px
  			'2.5': '0.625rem',   // 10px
  			'3': '0.75rem',      // 12px
  			'3.5': '0.875rem',   // 14px
  			'4': '1rem',         // 16px
  			'5': '1.25rem',      // 20px
  			'6': '1.5rem',       // 24px
  			'7': '1.75rem',      // 28px
  			'8': '2rem',         // 32px
  			'10': '2.5rem',      // 40px
  			'12': '3rem',        // 48px
  			'16': '4rem',        // 64px
  			'20': '5rem',        // 80px
  			'24': '6rem',        // 96px
  			'32': '8rem',        // 128px
  			'40': '10rem',       // 160px
  			'48': '12rem',       // 192px
  			'56': '14rem',       // 224px
  			'64': '16rem'        // 256px
  		},
  		boxShadow: {
  			// EmmanuelOS Shadow Hierarchy - Consistent elevation system
  			'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',                    // 1px - Subtle borders
  			'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',  // 2px - Buttons, small cards
  			'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)', // 4px - Cards, modals
  			'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)', // 8px - Large cards, elevated elements
  			'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', // 12px - Overlays, large modals
  			'2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',              // 16px - Special elements
  			// Colored shadows for enhanced UI
  			'sky-sm': '0 1px 3px 0 rgba(14, 165, 233, 0.1), 0 1px 2px -1px rgba(14, 165, 233, 0.1)',
  			'sky-md': '0 4px 6px -1px rgba(14, 165, 233, 0.15), 0 2px 4px -2px rgba(14, 165, 233, 0.15)',
  			'sky-lg': '0 10px 15px -3px rgba(14, 165, 233, 0.2), 0 4px 6px -4px rgba(14, 165, 233, 0.2)',
  			// Glass shadows for backdrop-blur elements
  			'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  			'glass-lg': '0 16px 48px 0 rgba(31, 38, 135, 0.37)'
  		},
  		// EmmanuelOS Motion Tokens - Consistent animation system
  		transitionDuration: {
  			'fast': '150ms',
  			'normal': '200ms',
  			'slow': '250ms',
  			'slower': '300ms'
  		},
  		transitionTimingFunction: {
  			'ease-default': 'cubic-bezier(0.4, 0, 0.2, 1)',
  			'ease-spring': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  			'ease-gentle': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			// EmmanuelOS Custom Animations
  			'fade-in': {
  				'0%': { opacity: '0', transform: 'translateY(8px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			},
  			'fade-in-up': {
  				'0%': { opacity: '0', transform: 'translateY(16px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			},
  			'scale-in': {
  				'0%': { opacity: '0', transform: 'scale(0.95)' },
  				'100%': { opacity: '1', transform: 'scale(1)' }
  			},
  			'shimmer': {
  				'0%': { transform: 'translateX(-100%)' },
  				'100%': { transform: 'translateX(100%)' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			// EmmanuelOS Animation Classes
  			'fade-in': 'fade-in 200ms ease-default',
  			'fade-in-up': 'fade-in-up 250ms ease-spring',
  			'scale-in': 'scale-in 150ms ease-default',
  			'shimmer': 'shimmer 2s ease-in-out infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
