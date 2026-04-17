# HookDrop: Secure Document Webhook Bridge

HookDrop is a polished, full-stack web application designed to streamline the transmission of documents to custom webhook endpoints. It features a minimalist, professional interface with automated handling of mixed content and CORS issues via a built-in server-side proxy.

## Features

-   **Clean Minimalism Design**: A refined, focused user interface built with Tailwind CSS.
-   **Automated Transmission**: Simply drop a file to instantly trigger a secure server-to-server transmission.
-   **Server-Side Proxy**: Bypasses browser security restrictions (CORS, Mixed Content) by forwarding files through an Express backend.
-   **Transmission History**: Real-time feedback and a history log of recent document deliveries.
-   **Responsive Layout**: Optimized for both desktop and mobile productivity.

## Tech Stack

-   **Frontend**: React 19, Vite, Tailwind CSS, Motion, shadcn/ui
-   **Backend**: Node.js, Express, Mutter
-   **Environment**: TypeScript

## Getting Started

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/hookdrop.git
    cd hookdrop
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure environment variables:
    Create a `.env` file in the root directory and add your webhook URL:
    ```env
    VITE_WEBHOOK_URL="https://your-webhook-endpoint.com/api"
    ```
    *(See `.env.example` for reference)*

### Running the App

-   **Development Mode**:
    Starts the Express server with Vite middleware for hot-reloading:
    ```bash
    npm run dev
    ```

-   **Production Mode**:
    1. Build the frontend:
       ```bash
       npm run build
       ```
    2. Start the production server:
       ```bash
       NODE_ENV=production npm start
       ```

## Project Structure

-   `server.ts`: Express server entry point and API proxy logic.
-   `src/App.tsx`: Main React component.
-   `src/components/WebhookUploader.tsx`: Core transmission and UI logic.
-   `src/index.css`: Global styles and Tailwind theme configuration.

## License

This project is licensed under the Apache-2.0 License.
