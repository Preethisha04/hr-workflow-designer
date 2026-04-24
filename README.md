# HR Workflow Designer

A visual, node-based workflow builder for HR processes built using React Flow.
This application allows users to design, configure, and simulate workflows such as onboarding, approvals, and automation pipelines.

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

---

## Core Features

### 🔷 Interactive Workflow Canvas

* Drag-and-drop node creation
* Connect nodes with edges to define flow
* Zoom, pan, and minimap support
* Delete nodes and edges dynamically

---

### 🧩 Multiple Node Types

Supports different workflow stages:

* **Start** – Entry point
* **Task** – Assign actions
* **Approval** – Role-based decisions
* **Automation** – Trigger system actions
* **Condition** – Branch logic
* **End** – Workflow completion

---

### 📝 Dynamic Node Configuration

* Click any node to edit properties
* Schema-driven form system
* Context-aware inputs per node type
* Real-time updates to workflow state

---

### ⚙️ API-driven Automation

* Fetch automation actions dynamically
* Populate dropdown from API layer
* Render dynamic parameter inputs based on selection

---

### ▶️ Workflow Simulation Engine

* Validates workflow before execution
* Detects:

  * Missing Start node
  * Disconnected nodes
* Simulates execution step-by-step
* Displays logs of workflow progression

---

### 📤 Import / Export

* Export workflows as JSON
* Import saved workflows

---

## 🧠 Architecture Highlights

* Zustand store for centralized workflow state
* Schema-driven forms for dynamic configuration
* Service layer abstraction for API interaction
* Graph utilities for validation and serialization
* Modular component structure for scalability

---

## 🛠 Tech Stack

* React + TypeScript
* React Flow
* Zustand
* Tailwind CSS
* Vite

---

## 📁 Project Structure

```
src/
├── components/
│   ├── canvas/
│   ├── nodes/
│
├── config/
├── hooks/
├── services/api/
├── store/
├── types/
├── utils/
```

---

## 🧪 How It Works

1. Add nodes from the sidebar
2. Connect nodes to define workflow
3. Configure nodes using the form panel
4. Run simulation to validate execution
5. Export workflow as JSON

---

## 🔮 Future Improvements

* Undo / Redo functionality
* Advanced validation (cycle detection)
* Backend integration
* Real-time collaboration

---

## 📌 Key Learning Outcomes

* Building graph-based UI systems
* Managing complex state with Zustand
* Designing scalable frontend architecture
* Implementing dynamic form systems
* Handling workflow simulation logic
