# DocuMind - Intelligent Document Management

![DocuMind Banner](/app/icon.png)

**Created by: Rahmanda Ahmad Wilyan Januardo (23083000113)**

DocuMind is a modern, AI-powered document management and utility platform built with the latest web technologies. It combines powerful PDF tools (Merge, Split, Compress) with an intelligent AI Chat feature, allowing users to converse with their documents for summaries and insights.

## 🚀 Features

### 🧠 Intelligent AI Chat
*   **Chat with Documents**: Upload a PDF and interact with it using advanced AI (Google Gemini 2.5/Flash).
*   **Context Aware**: ask questions specific to the document's content.
*   **Guest Access**: Try the AI chat instantly without creating an account (limited usage).

### 📄 PDF Utilities (Powered by iLovePDF)
*   **Merge**: Combine multiple PDF files into a single document.
*   **Split**: Extract all pages or specific ranges from a PDF.
*   **Compress**: Reduce PDF file size while maintaining optimal quality.

### 🛡️ Smart Usage & Security
*   **Tiered Access System**:
    *   **Guest Mode**: 1 Free Credit/Day (IP-based tracking).
    *   **Registered Users**: 5 PDF Credits + 3 AI Credits per Day.
*   **Live Dashboard**: Real-time visualization of your daily usage limits.
*   **Secure Auth**: Google OAuth and Email Magic Links via Supabase.

### 💻 User Experience
*   **Modern UI**: Sleek, glassmorphism-inspired design with responsive layouts.
*   **Landing Page**: A dedicated homepage showcasing features and trust indicators.
*   **Fast & Reliable**: Built on Next.js 16 for optimal performance.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
*   **Styling**: Tailwind CSS 3.4, Lucide React
*   **Backend/Auth**: [Supabase](https://supabase.com/) (PostgreSQL, RLS)
*   **AI Engine**: [Google Gemini API](https://ai.google.dev/)
*   **PDF Engine**: [iLovePDF API](https://developer.ilovepdf.com/)
*   **Language**: TypeScript

## 📦 Getting Started

### Prerequisites
*   Node.js 20+ installed
*   A Supabase project (for Auth & Database)
*   An iLovePDF Developer account
*   A Google Gemini API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/WilyArd/Documind-Project.git
    cd Documind-Project
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory:
    ```env
    # Supabase Configuration
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    
    # iLovePDF API Keys
    ILOVEPDF_PUBLIC_KEY=your_public_key
    ILOVEPDF_SECRET_KEY=your_secret_key

    # Google Gemini AI
    GEMINI_API_KEY=your_gemini_key
    ```

4.  **Run the application:**
    ```bash
    npm run dev
    ```

5.  **Open in Browser:**
    Navigate to [http://localhost:3000](http://localhost:3000).

## 🔒 Security & Privacy

*   **Authentication**: Protected routes verify session server-side.
*   **RLS Policies**: Row Level Security ensures users can only access their own data.
*   **Guest Privacy**: Guest usage is tracked via IP without persistent personal data storage.
*   **Vulnerability Free**: Regularly audited dependencies (0 vulnerabilities).


