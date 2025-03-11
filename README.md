# NextAuth.js XenForo Demo

## Introduction
This is a Next.js application demonstrating how to implement authentication with NextAuth.js, specifically tailored for XenForo integration.

## Features
- XenForo authentication
- Session management
- Protected routes
- User profile information display

## Installation
1. Clone the repository
2. Run `npm install`
3. Create `.env` file with required environment variables

## Configuration
Set up your environment variables in `.env`, look at the example.env for reference:
```
NEXTAUTH_SECRET=your-secret-key
XENFORO_API_URL=your-xenforo-api-url
```

## Usage
0. Set up an Oauth2 application in your XenForo admin panel and copy all the necessary values into your `.env` file
1. Start the development server: `npm run dev`
2. Access the home page to login
3. View session information after login

## Protected Routes
Use the `getServerAuthSession` function to protect pages:
```typescript
const session = await getServerAuthSession();
if (!session) {
  redirect('/');
}
```

## Session Management
Access user session data in components:
```typescript
const session = await getServerAuthSession();
const userName = session.user?.name;
```

## Summarization Implementation Tutorial
To implement summarization in your NextAuth.js XenForo application, follow these steps:

### Step 1: Install Required Packages
Install the required packages by running the following command:
```bash
npm install summarization-library
```

### Step 2: Import Summarization Library
Import the summarization library in your Next.js page:
```typescript
import { summarize } from 'summarization-library';
```

### Step 3: Implement Summarization Function
Create a function to summarize text using the summarization library:
```typescript
const summarizeText = async (text) => {
  const summary = await summarize(text);
  return summary;
};
```

### Step 4: Integrate Summarization Function
Integrate the summarization function into your Next.js page:
```typescript
const MyPage = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');

  const handleSummarize = async () => {
    const summary = await summarizeText(text);
    setSummary(summary);
  };

  return (
    <div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleSummarize}>Summarize</button>
      <p>Summary: {summary}</p>
    </div>
  );
};
```

### Step 5: Test Summarization Function
Test the summarization function by running the application and entering text into the textarea. Click the "Summarize" button to generate a summary of the text.