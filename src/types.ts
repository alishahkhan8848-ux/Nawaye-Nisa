export type Screen =
  | 'splash'
  | 'onboarding'
  | 'language'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'report-incident'
  | 'incident-form'
  | 'location-select'
  | 'ai-assistant'
  | 'ai-result'
  | 'evidence-vault'
  | 'upload-evidence'
  | 'timeline'
  | 'complaint-preview'
  | 'emergency'
  | 'trusted-contacts'
  | 'nearby-help'
  | 'legal-rights'
  | 'awareness'
  | 'notifications'
  | 'report-history'
  | 'profile'
  | 'settings'
  | 'safe-exit'
  | 'panic-mode'
  | 'about'
  | 'contact-support'

export interface NavProps {
  navigate: (screen: Screen) => void
  goBack: () => void
}
