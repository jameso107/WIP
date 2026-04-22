import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CourseListPage } from './pages/CourseListPage'
import { DashboardPage } from './pages/DashboardPage'
import { GuideChatPage } from './pages/GuideChatPage'
import { HomePage } from './pages/HomePage'
import { ModulePage } from './pages/ModulePage'
import { PromptBuilderPage } from './pages/PromptBuilderPage'
import { TodosPage } from './pages/TodosPage'
import { DraftRescuePage } from './pages/games/DraftRescuePage'
import { GamesHubPage } from './pages/games/GamesHubPage'
import { HallucinationHunterPage } from './pages/games/HallucinationHunterPage'
import { MissionBriefPage } from './pages/games/MissionBriefPage'
import { PromptCraftArenaPage } from './pages/games/PromptCraftArenaPage'
import { TheLinePage } from './pages/games/TheLinePage'
import { UseItOrLoseItPage } from './pages/games/UseItOrLoseItPage'

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
          <Route path="todos" element={<TodosPage />} />
          <Route path="games" element={<GamesHubPage />} />
          <Route path="games/use-it-or-lose-it" element={<UseItOrLoseItPage />} />
          <Route path="games/mission-brief" element={<MissionBriefPage />} />
          <Route path="games/prompt-craft" element={<PromptCraftArenaPage />} />
          <Route path="games/hallucination-hunter" element={<HallucinationHunterPage />} />
          <Route path="games/draft-rescue" element={<DraftRescuePage />} />
          <Route path="games/the-line" element={<TheLinePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
