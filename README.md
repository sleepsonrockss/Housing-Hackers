# TenantTales Frontend - Routing & File Structure Guide

## Folder Structure

```
frontend/
├── public/
│   └── index.html          ← Landing page (static HTML preview)
│
├── src/pages/
│   ├── index.jsx           ← Home/Landing (use LandingPage.jsx content)
│   ├── how-it-works.jsx    ← HowItWorks.jsx content
│   ├── chapters.jsx        ← Chapters.jsx content
│   ├── about.jsx           ← About.jsx content
│   ├── login.jsx           ← SignIn.jsx content
│   ├── signup.jsx          ← SignUp.jsx content
│   ├── game.jsx            ← Game component (you'll build this)
│   └── forgot-password.jsx ← Password reset (optional)
```

## Next.js Routing Reference

In Next.js, file paths in `src/pages/` automatically map to URL routes:

| File Path | URL Route |
|-----------|-----------|
| `src/pages/index.jsx` | `/` |
| `src/pages/how-it-works.jsx` | `/how-it-works` |
| `src/pages/chapters.jsx` | `/chapters` |
| `src/pages/about.jsx` | `/about` |
| `src/pages/login.jsx` | `/login` |
| `src/pages/signup.jsx` | `/signup` |
| `src/pages/game.jsx` | `/game` |
| `src/pages/forgot-password.jsx` | `/forgot-password` |

## URL References Used in the Components

All links in the pages use these URLs (which are **already correct** for your Next.js setup):

### Navigation Links
- Home: `/`
- How it Works: `/how-it-works`
- Chapters: `/chapters`
- About: `/about`

### Auth Links
- Sign In: `/login`
- Sign Up: `/signup`
- Forgot Password: `/forgot-password`

### Game Link
- Continue Game: `/game`

## Setup Instructions

### 1. Copy Component Files

Copy the content from the provided `.jsx` files into your pages:

```bash
# Example: Rename LandingPage.jsx to index.jsx
cp LandingPage.jsx frontend/src/pages/index.jsx
cp HowItWorks.jsx frontend/src/pages/how-it-works.jsx
cp Chapters.jsx frontend/src/pages/chapters.jsx
cp About.jsx frontend/src/pages/about.jsx
cp SignIn.jsx frontend/src/pages/login.jsx
cp SignUp.jsx frontend/src/pages/signup.jsx
```

### 2. Optional: Static Preview

If you want a static HTML preview (for testing without running Next.js):
```bash
cp index.html frontend/public/index.html
# Visit: http://localhost:3000/index.html
```

### 3. Install Dependencies

If you haven't already:
```bash
cd frontend
npm install
# or
yarn install
```

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Then visit:
- Home: http://localhost:3000
- How it Works: http://localhost:3000/how-it-works
- Chapters: http://localhost:3000/chapters
- About: http://localhost:3000/about
- Login: http://localhost:3000/login
- Sign Up: http://localhost:3000/signup

## Additional Notes

The components provided use standard `<a>` tags which also work fine with Next.js routing.

### API Integration Points

These components have comment placeholders where you'll need to integrate your backend:

- **SignIn.jsx**: Line where form submits (`handleSubmit`)
- **SignUp.jsx**: Form validation and API call
- **Chapters.jsx**: Link to game with `day` parameter: `/game?day=${ch.day}`

### Environment Variables (if needed)

Create a `.env.local` file in your `frontend` directory:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Then you can use: `process.env.NEXT_PUBLIC_API_URL` in your components for API calls.

## All Links Are Ready to Go ✅

The `index.html` file and all `.jsx` components already have the correct URLs configured for your Next.js setup. No changes needed!
