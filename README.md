# PashuVision

PashuVision is a web-based tool designed to assist India's veterinary field workers by using AI to instantly recognize cattle and buffalo breeds from a single photo. The platform simplifies animal registration, maintains health & ownership records, and provides easy access to animal profiles and data insights.

---

## ✨ Features

- **AI Breed Recognition**  
  Upload a photo to identify cattle & buffalo breed instantly.

- **Animal Registration System**  
  Capture owner details, animal characteristics, and unique ID.

- **Health & Medical Records**  
  Maintain vaccination, diseases, and medical history logs.

- **Quick Lookup (Tag / Ear ID)**  
  Instantly fetch animal details by unique identifier.

- **Multilingual Support**  
  Available in **English & Hindi** for field usability.

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React + TypeScript + Vite |
| AI Model | Gemini Vision API (Google) |
| Storage | LocalStorage / IndexedDB (Offline Support) |
| Styling | TailwindCSS |
| State Mgmt | Context API |

---

## 📦 Run Locally

**Prerequisites:**  
- Node.js >= 18

```sh
# Install dependencies
npm install

# Create environment file
echo GEMINI_API_KEY=YOUR_API_KEY > .env.local

# Start development server
npm run dev
