# HR Workflow Designer

A visual drag-and-drop workflow builder for HR processes, built with React, TypeScript, ReactFlow, and Zustand.

## 🚀 Live Demo Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## ✨ Features

### 🎨 Visual Canvas
- Drag-and-drop node creation from the sidebar palette
- Connect nodes with animated edges
- Pan, zoom, and minimap navigation
- Delete nodes with the `Delete` key
- Empty-state hint when canvas is empty

### 🧩 Node Types
| Node | Purpose |
|------|---------|
| 🚀 **Start** | Entry point of the workflow |
| 📋 **Task** | Assign work to a team member |
| 🔐 **Approval** | Require sign-off from a role |
| ⚡ **Automation** | Trigger automated actions (email, HRIS, etc.) |
| 🔀 **Condition** | Branch based on field evaluation |
| 🏁 **End** | Marks workflow completion |

### 📝 Node Configuration (Right Panel)
- Click any node to open its config form
- Context-aware fields per node type
- Dynamic automation parameter inputs
- Priority badges, assignee, due dates
- Delete node from form header

### 📦 Templates
Load pre-built HR workflows from the sidebar:
- **Employee Onboarding** – collect docs → approval → IT setup
- **Leave Approval** – condition branch for short vs long leave
- **Performance Review** – self-assessment → manager review → HR sign-off

### ▶️ Simulation Panel
- Validates workflow before running (checks for Start/End node, disconnected nodes)
- Animated step-by-step execution with logs
- Color-coded log levels: info, success, warning, error
- Node breakdown stats
- Real-time active-node highlighting on canvas

### 📤 Import / Export
- Export workflow as `workflow.json`
- Import a previously saved workflow JSON

---

## 🛠 Tech Stack

| Tech | Role |
|------|------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **ReactFlow 11** | Node-based canvas |
| **Zustand 4** | Global state management |
| **Tailwind CSS 3** | Utility-first styling |
| **Vite 5** | Build tool & dev server |

---

## 📁 Project Structure

```
src/
├── App.tsx                      # Root layout
├── index.css                    # Global styles + CSS variables
├── main.tsx                     # Entry point
│
├── components/
│   ├── canvas/
│   │   ├── Sidebar.tsx          # Node palette + templates
│   │   ├── WorkflowCanvas.tsx   # ReactFlow canvas with D&D
│   │   ├── NodeFormPanel.tsx    # Selected node config form
│   │   ├── SimulationPanel.tsx  # Run & view simulation logs
│   │   └── Toolbar.tsx          # Export / Import / Clear
│   └── nodes/
│       ├── BaseNode.tsx         # Shared node wrapper
│       ├── StartNode.tsx
│       ├── TaskNode.tsx
│       ├── ApprovalNode.tsx
│       ├── AutomationNode.tsx
│       ├── ConditionNode.tsx
│       └── EndNode.tsx
│
├── config/
│   └── nodeFormSchema.ts        # Field definitions per node type
│
├── hooks/
│   └── useAutomations.ts        # Fetch automation actions
│
├── services/api/
│   ├── automation.ts            # Mock automation actions API
│   └── simulation.ts            # Topological simulation engine
│
├── store/
│   └── workflowStore.ts         # Zustand state (nodes, edges, sim)
│
├── types/
│   ├── workflow.types.ts        # Node & workflow type definitions
│   └── form.types.ts            # Form field type definitions
│
└── utils/
    └── graphutils.ts            # Validate, serialize, ID generation
```

---

## 🧪 How to Use

1. **Add nodes** — drag from the left sidebar onto the canvas, or click to place
2. **Connect nodes** — drag from a node's bottom handle to another node's top handle
3. **Configure nodes** — click a node to edit its properties in the right panel
4. **Load a template** — click "Templates" tab in the sidebar
5. **Run simulation** — click ▶ Run Workflow in the Simulation panel
6. **Export** — click Export in the toolbar to save as JSON

---

## 📋 Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint check
```
