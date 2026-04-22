import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CourseListPage } from './pages/CourseListPage'
import { DashboardPage } from './pages/DashboardPage'
import { GuideChatPage } from './pages/GuideChatPage'
import { HomePage } from './pages/HomePage'
import { ModulePage } from './pages/ModulePage'
import { PromptBuilderPage } from './pages/PromptBuilderPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="learn" element={<CourseListPage />} />
          <Route path="learn/:moduleId" element={<ModulePage />} />
          <Route path="practice/prompt-builder" element={<PromptBuilderPage />} />
          <Route path="guide" element={<GuideChatPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
