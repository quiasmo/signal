import * as Sentry from "@sentry/react"
import { Integrations } from "@sentry/tracing"
import React from "react"
import { HelmetProvider } from "react-helmet-async"
import { DialogProvider } from "use-dialog-mui"
import { PromptProvider } from "use-prompt-mui"
import { defaultTheme } from "../../../common/theme/Theme"
import { Toast } from "../../../components/Toast"
import { StoreContext } from "../../hooks/useStores"
import { ThemeContext } from "../../hooks/useTheme"
import { ToastProvider } from "../../hooks/useToast"
import RootStore from "../../stores/RootStore"
import { GlobalKeyboardShortcut } from "../KeyboardShortcut/GlobalKeyboardShortcut"
import { RootView } from "../RootView/RootView"
import { EmotionThemeProvider } from "../Theme/EmotionThemeProvider"
import { GlobalCSS } from "../Theme/GlobalCSS"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  release: process.env.VERCEL_GIT_COMMIT_SHA,
  environment: process.env.VERCEL_ENV,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
})

export function App() {
  return (
    <React.StrictMode>
      <StoreContext.Provider value={new RootStore()}>
        <ThemeContext.Provider value={defaultTheme}>
          <EmotionThemeProvider>
            <HelmetProvider>
              <ToastProvider component={Toast}>
                <PromptProvider>
                  <DialogProvider>
                    <GlobalKeyboardShortcut />
                    <GlobalCSS />
                    <RootView />
                  </DialogProvider>
                </PromptProvider>
              </ToastProvider>
            </HelmetProvider>
          </EmotionThemeProvider>
        </ThemeContext.Provider>
      </StoreContext.Provider>
    </React.StrictMode>
  )
}
