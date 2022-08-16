import React from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './App'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import Event from './pages/Event'
import { StartServer } from "../wailsjs/go/main/App";

StartServer()

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
  <HashRouter basename='/'>
    <Routes>
      <Route path="/" element={<App />}>
      </Route>
      <Route path="/event/:eventId" element={<Event />} />
    </Routes>
  </HashRouter>
)