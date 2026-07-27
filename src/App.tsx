import { useState, useEffect } from 'react'
import type { Screen } from './types'
import BottomNav from './components/BottomNav'
import { AuthProvider, useAuth } from './contexts/AuthContext'

import SplashScreen from './screens/SplashScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import LanguageScreen from './screens/LanguageScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import DashboardScreen from './screens/DashboardScreen'
import ReportIncidentScreen from './screens/ReportIncidentScreen'
import IncidentFormScreen from './screens/IncidentFormScreen'
import LocationScreen from './screens/LocationScreen'
import AIAssistantScreen from './screens/AIAssistantScreen'
import AIResultScreen from './screens/AIResultScreen'
import EvidenceVaultScreen from './screens/EvidenceVaultScreen'
import UploadEvidenceScreen from './screens/UploadEvidenceScreen'
import TimelineScreen from './screens/TimelineScreen'
import ComplaintPreviewScreen from './screens/ComplaintPreviewScreen'
import EmergencyScreen from './screens/EmergencyScreen'
import TrustedContactsScreen from './screens/TrustedContactsScreen'
import NearbyHelpScreen from './screens/NearbyHelpScreen'
import LegalRightsScreen from './screens/LegalRightsScreen'
import AwarenessScreen from './screens/AwarenessScreen'
import NotificationsScreen from './screens/NotificationsScreen'
import ReportHistoryScreen from './screens/ReportHistoryScreen'
import ProfileScreen from './screens/ProfileScreen'
import SettingsScreen from './screens/SettingsScreen'
import SafeExitScreen from './screens/SafeExitScreen'
import PanicModeScreen from './screens/PanicModeScreen'
import AboutScreen from './screens/AboutScreen'
import ContactSupportScreen from './screens/ContactSupportScreen'

const NO_BOTTOM_NAV: Screen[] = [
  'splash', 'onboarding', 'language', 'login', 'register',
  'report-incident', 'incident-form', 'location-select',
  'upload-evidence', 'safe-exit', 'panic-mode',
  'ai-assistant', 'ai-result', 'complaint-preview', 'timeline',
  'trusted-contacts', 'nearby-help', 'legal-rights', 'awareness',
  'notifications', 'settings', 'about', 'contact-support',
]

const PUBLIC_SCREENS: Screen[] = ['splash', 'onboarding', 'language', 'login', 'register']

function AppShell() {
  const { user, loading } = useAuth()
  const [screen, setScreen] = useState<Screen>('splash')
  const [history, setHistory] = useState<Screen[]>([])
  const [authResolvedOnce, setAuthResolvedOnce] = useState(false)

  const navigate = (s: Screen) => {
    setHistory((h) => [...h, screen])
    setScreen(s)
  }

  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1]
      setHistory((h) => h.slice(0, -1))
      setScreen(prev)
    }
  }

  // Once Firebase resolves whether a user session already exists, route
  // straight to the dashboard for a returning signed-in user, skipping the
  // splash/onboarding/login screens they've already been through.
  useEffect(() => {
    if (loading || authResolvedOnce) return
    setAuthResolvedOnce(true)
    if (user) setScreen('dashboard')
  }, [loading, user, authResolvedOnce])

  // If the session ends (sign out, or the token becomes invalid) while the
  // person is on a screen that requires auth, send them back to login rather
  // than leaving them stranded on a screen with no data behind it.
  useEffect(() => {
    if (loading || !authResolvedOnce) return
    if (!user && !PUBLIC_SCREENS.includes(screen)) {
      setScreen('login')
      setHistory([])
    }
  }, [user, loading, authResolvedOnce, screen])

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#E8EAF0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '3px solid #E5E7EB',
            borderTopColor: '#4F46E5',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
      </div>
    )
  }

  const showNav = !NO_BOTTOM_NAV.includes(screen)
  const navProps = { navigate, goBack }

  const renderScreen = () => {
    switch (screen) {
      case 'splash': return <SplashScreen {...navProps} />
      case 'onboarding': return <OnboardingScreen {...navProps} />
      case 'language': return <LanguageScreen {...navProps} />
      case 'login': return <LoginScreen {...navProps} />
      case 'register': return <RegisterScreen {...navProps} />
      case 'dashboard': return <DashboardScreen {...navProps} />
      case 'report-incident': return <ReportIncidentScreen {...navProps} />
      case 'incident-form': return <IncidentFormScreen {...navProps} />
      case 'location-select': return <LocationScreen {...navProps} />
      case 'ai-assistant': return <AIAssistantScreen {...navProps} />
      case 'ai-result': return <AIResultScreen {...navProps} />
      case 'evidence-vault': return <EvidenceVaultScreen {...navProps} />
      case 'upload-evidence': return <UploadEvidenceScreen {...navProps} />
      case 'timeline': return <TimelineScreen {...navProps} />
      case 'complaint-preview': return <ComplaintPreviewScreen {...navProps} />
      case 'emergency': return <EmergencyScreen {...navProps} />
      case 'trusted-contacts': return <TrustedContactsScreen {...navProps} />
      case 'nearby-help': return <NearbyHelpScreen {...navProps} />
      case 'legal-rights': return <LegalRightsScreen {...navProps} />
      case 'awareness': return <AwarenessScreen {...navProps} />
      case 'notifications': return <NotificationsScreen {...navProps} />
      case 'report-history': return <ReportHistoryScreen {...navProps} />
      case 'profile': return <ProfileScreen {...navProps} />
      case 'settings': return <SettingsScreen {...navProps} />
      case 'safe-exit': return <SafeExitScreen {...navProps} />
      case 'panic-mode': return <PanicModeScreen {...navProps} />
      case 'about': return <AboutScreen {...navProps} />
      case 'contact-support': return <ContactSupportScreen {...navProps} />
      default: return <DashboardScreen {...navProps} />
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#E8EAF0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 0',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
      }}
    >
      {/* Mobile device frame */}
      <div
        style={{
          width: 390,
          height: 844,
          background: 'white',
          borderRadius: 50,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 0 0 12px #1C1C1E, 0 40px 80px rgba(0,0,0,0.5), 0 0 0 13px #2C2C2E',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Dynamic island */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 120,
            height: 34,
            background: '#000',
            borderRadius: 20,
            zIndex: 100,
          }}
        />

        {/* Screen content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            {renderScreen()}
          </div>
          {showNav && (
            <BottomNav active={screen} navigate={navigate} />
          )}
        </div>
      </div>

      {/* Screen label */}
      <div
        style={{
          position: 'fixed',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.75)',
          borderRadius: 20,
          padding: '6px 16px',
          backdropFilter: 'blur(8px)',
        }}
      >
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', fontFamily: 'Inter, -apple-system, sans-serif', fontWeight: 500, letterSpacing: '0.02em' }}>
          {screen.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} Screen
        </span>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}
