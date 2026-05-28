# Tax Loss Harvesting Web App

A responsive, premium React application designed to help users offset capital gains with capital losses to reduce tax burdens. This project was built to satisfy frontend engineering assignment requirements.

## 🌟 Features & Bonus Points Completed

- **Premium UI/UX:** Built with Tailwind CSS v4 featuring glassmorphism, responsive grids, dark-mode themes, and micro-animations.
- **Smart Auto-Harvest Algorithm:** One-click algorithm to automatically select all portfolio assets currently operating at a loss, instantly calculating optimal tax savings.
- **Interactive Data Visualization:** Includes a Recharts bar chart to dynamically compare Pre-Harvesting and Post-Harvesting net capital gains.
- **Advanced Holdings Table:** 
  - **Search:** Instantly filter assets by name.
  - **Sort:** Sort by Holdings, Price, or Gains.
  - **View All / Pagination:** Displays the top 5 assets by default for a clean UI, with a "View All Holdings" toggle.
- **State Management:** Fully utilizes React `useContext` for performant global state distribution without prop drilling.
- **Loading & Error States:** Simulated API requests with visual loading spinners and graceful error handling.

## 📸 Screenshots

*(Please replace these placeholders with actual screenshots of the running app before submission)*

- **Dashboard (Pre-Harvesting):** `[Add Screenshot Here]`
- **Dashboard (Post-Harvesting with Charts):** `[Add Screenshot Here]`
- **Holdings Table (Search & Sort active):** `[Add Screenshot Here]`

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-link>
   cd TaxLoss
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

4. **Build for Production:**
   ```bash
   npm run build
   ```

## 🧠 Assumptions Made

1. **Capital Gains Math:** Realised Capital Gains are calculated as `(STCG Profits - STCG Losses) + (LTCG Profits - LTCG Losses)`. When a holding is selected, if its specific STCG/LTCG gain is positive, it is added to Profits; if negative, the absolute magnitude is added to Losses.
2. **Tax Savings Calculation:** The absolute difference between Pre-Harvesting Realised Gains and Post-Harvesting Realised Gains is treated as the "Tax Saved" amount for simplicity in the UI context, assuming taxes are strictly levied on the net positive realised gains.
3. **Mock APIs:** A 600-800ms network delay is artificially induced to demonstrate loader/spinner states. The mock data accurately reflects the provided JSON structures.

## 🚀 Deployment

This project is built using Vite and is perfectly configured for zero-config deployments on **Vercel** or **Netlify**.
- To deploy on Vercel: Connect your GitHub repository to Vercel, and it will automatically detect the Vite preset and deploy the application.
