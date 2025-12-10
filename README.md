# DocuMind - Intelligent Document Management

DocuMind is a modern, AI-powered document management and utility platform built with Next.js. It offers a suite of PDF tools (Merge, Split, Compress) backed by the specialized iLovePDF API, along with an intelligent AI Chat feature that allows users to converse with their documents.

## 🚀 Features

### PDF Utilities (Powered by iLovePDF)
*   **Merge**: Combine multiple PDF files into a single document.
*   **Split**: Extract all pages or specific ranges from a PDF.
*   **Compress**: Reduce PDF file size while maintaining optimal quality.

### AI Capabilities
*   **Chat with Documents**: Upload a document and ask questions, summarize content, or extract key information using an interactive AI interface.
*   **Chat History**: Automatically saves your conversations for future reference.

### User Experience
*   **Modern Dashboard**: Clean, responsive interface with glassmorphism design elements.
*   **Secure Authentication**: Google OAuth and Email/Password login powered by Supabase.
*   **Responsive Design**: Optimized for Desktop, Tablet, and Mobile devices.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **Styling**: Tailwind CSS, Lucide React (Icons)
*   **Backend/Database**: [Supabase](https://supabase.com/) (Auth, PostgreSQL, Row Level Security)
*   **PDF Processing**: [iLovePDF API](https://developer.ilovepdf.com/)
*   **Language**: TypeScript

## 📦 Getting Started

### Prerequisites
*   Node.js 18+ installed
*   A Supabase project (for Auth & Database)
*   An iLovePDF Developer account (for API keys)

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
    Create a `.env.local` file in the root directory and add the following keys:
    ```env
    # Supabase Configuration
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    
    # iLovePDF API Keys (Get these from developer.ilovepdf.com)
    ILOVEPDF_PUBLIC_KEY=your_public_key
    ILOVEPDF_SECRET_KEY=your_secret_key
    ```
    *(Refer to `env.local.example` for a template)*

4.  **Database Setup:**
    Run the SQL script located at `supabase/schema.sql` in your Supabase SQL Editor to create the necessary tables (e.g., `chat_history`).

5.  **Run the application:**
    ```bash
    npm run dev
    ```

6.  **Open in Browser:**
    Navigate to [http://localhost:3000](http://localhost:3000).

## 🔒 Security

*   **Authentication**: Protected routes (Dashboard, AI Chat, Tools) require login via `AuthGuard`.
*   **Data Privacy**: Row Level Security (RLS) ensures users can only access their own chat history and data.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
