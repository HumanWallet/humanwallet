import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <svg 
            width="24" 
            height="24" 
            xmlns="http://www.w3.org/2000/svg" 
            aria-label="HumanWallet Logo" 
            viewBox="0 0 24 24"
            className="humanwallet-logo"
          >
            <defs>
              <linearGradient id="humanwalletGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <circle cx={12} cy={12} r={10} fill="url(#humanwalletGradient)" />
            <path 
              d="M8 10a1.5 1.5 0 0 1 3 0v4a1.5 1.5 0 0 1-3 0v-4zM13 8a1.5 1.5 0 0 1 3 0v8a1.5 1.5 0 0 1-3 0V8z" 
              fill="white" 
            />
          </svg>
          <span className="font-semibold">HumanWallet</span>
        </>
      ),
    },
    // see https://fumadocs.dev/docs/ui/navigation/links
    links: [
      {
        text: "GitHub",
        url: "https://github.com/HumanWallet/humanwallet",
        external: true,
      },
      {
        text: "Examples",
        url: "/docs/examples",
      },
    ],
  }
}
