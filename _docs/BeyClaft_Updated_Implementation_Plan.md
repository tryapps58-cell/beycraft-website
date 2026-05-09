# BEYCRAFT

*Forge Your Legend. Customize Your Spin.*

---

## COMPLETE WEBSITE IMPLEMENTATION PLAN
*From Zero to Full Deployment*

**Stack:** Next.js 14  ·  Supabase  ·  Tailwind CSS  ·  Vanilla Canvas API  ·  Vercel
**Features:** Video Intro Sequence  ·  Split 2D Beyblade Viewer  ·  Part Swapping  ·  User Saved Builds  ·  Supabase Auth

---

## TABLE OF CONTENTS

- PART 0  —  Video Intro Sequence  (NEW — Read First)
- PART 1  —  Tech Stack & Architecture Overview
- PART 2  —  Database Schema & Data Model
- PART 3  —  Project Structure & File Organization
- PART 4  —  Authentication & User Management
- PART 5  —  Split 2D Beyblade Viewer  (REPLACES 3D Customizer)
- PART 6  —  Saved Builds & User Library
- PART 7  —  Homepage & Scroll Animation
- PART 8  —  Frontend UI/UX Implementation Guide
- PART 9  —  SEO Implementation
- PART 10  —  AI Tools & Prompts for Code Generation
- PART 11  —  Step-by-Step Build Sequence  (Updated)
- PART 12  —  Deployment & DevOps
- PART 13  —  Post-Launch Checklist

---

## PART 0  —  VIDEO INTRO SEQUENCE  (NEW — READ THIS FIRST)

### 0.1  What Is the Video Intro Sequence?

When a visitor opens BeyClaft for the very first time (or navigates to the homepage), they will see a full-screen video playing your uploaded animation (PROMPT_TITLE_Fast_Paced_Beybl.mp4) before the actual website is revealed. Once the video finishes playing, it fades out and the real homepage slides into view. This creates a cinematic, premium first impression — like a game intro screen.

> *This is one of the most impactful UX features of BeyClaft. When done correctly, it takes only about 30-60 lines of code. The guidance below covers everything: video preparation, coding the sequence, edge cases, and when to build it.*

### 0.2  How It Works — Technical Overview

The intro sequence is a React component called `<IntroOverlay />` that sits on top of the entire app. It is rendered before the homepage content. Here is the complete behaviour chain:

| **Step** | **What Happens** |
| --- | --- |
| 1. Page Opens | A full-screen black div with a centered `<video>` element renders. The homepage is hidden behind it. |
| 2. Video Plays | The video starts playing automatically (muted, autoplay). The visitor watches the Beyblade animation. |
| 3. Video Ends | An `onEnded` event fires on the video element. |
| 4. Fade Out | The overlay div fades from `opacity:1` to `opacity:0` over 0.8 seconds using a CSS transition. |
| 5. Homepage Reveals | After the fade, the overlay is removed from the DOM. The full homepage is now visible and interactive. |
| 6. Session Memory | `sessionStorage` is used to store that the intro was already shown — if the user navigates away and comes back in the same session, the intro is skipped. |

### 0.3  Video File Preparation  (Do This Before Coding)

This step must be completed before you write a single line of code. Your video file must be properly prepared or the intro will cause performance problems.

#### 0.3.1  Required Video Formats

Web browsers require specific video formats. You must export your video in at least two formats to ensure compatibility across all browsers:

| **Format** | **File Extension** | **Why Needed** |
| --- | --- | --- |
| WebM (VP9) | .webm | Smallest file size. Works in Chrome, Firefox, Edge. Best for performance. |
| MP4 (H.264) | .mp4 | Works in Safari, iOS, and all older browsers. Always include as fallback. |
| Original .mp4 | already have | Your existing file is the source. Export WebM from it. |

#### 0.3.2  How to Convert Your Video

Use the free tool HandBrake (handbrake.fr) or FFmpeg to export both formats. If you use FFmpeg (command-line), run these two commands:

```bash
# Export MP4 (H.264) — optimized for web
ffmpeg -i PROMPT_TITLE_Fast_Paced_Beybl.mp4 -c:v libx264 -crf 23 -preset slow -an intro.mp4

# Export WebM (VP9) — smaller size for Chrome/Firefox
ffmpeg -i PROMPT_TITLE_Fast_Paced_Beybl.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -an intro.webm

# The -an flag removes audio (recommended — no sound for intro animations)
```

> *FFmpeg is free and available at ffmpeg.org. If you prefer a GUI tool, use HandBrake (free). You can also use Cloudconvert.com online to convert for free without installing software.*

#### 0.3.3  Target File Size and Quality

Your intro video must be small enough to load fast. A visitor should see the video start within 1-2 seconds even on a mobile connection. Follow these targets:

| **Property** | **Target Value** |
| --- | --- |
| Video resolution | 1920x1080 (Full HD) maximum. 1280x720 is sufficient. |
| MP4 file size | Under 8 MB ideally. Under 15 MB maximum. |
| WebM file size | Under 5 MB ideally (WebM is 30-50% smaller than MP4). |
| Duration | Under 8 seconds. Shorter is better — do not make visitors wait. |
| Audio | Remove all audio (the `-an` flag). Autoplay with audio is blocked by all browsers. |
| Frame rate | 24fps or 30fps is fine. 60fps is unnecessary and increases file size. |

> *IMPORTANT: Browsers block autoplaying videos that have audio. If your video has audio, it will NOT autoplay and the intro will be broken. Always remove audio from the intro video using the FFmpeg command above.*

#### 0.3.4  Where to Store the Video Files

Place both video files in your Next.js public folder. This makes them available at a direct URL without any authentication or API calls:

```
beycraft/
  public/
    intro/
      intro.mp4        <- MP4 version (Safari + iOS fallback)
      intro.webm       <- WebM version (Chrome + Firefox preferred)
```

This means the videos will be accessible at `https://beycraft.com/intro/intro.mp4` and `https://beycraft.com/intro/intro.webm` — no Supabase needed.

### 0.4  Building the IntroOverlay Component  (Full Code Guidance)

Create this file: `components/intro/IntroOverlay.js`

```javascript
'use client'
import { useState, useEffect, useRef } from 'react'

export function IntroOverlay({ onComplete }) {
  const videoRef = useRef(null)
  const [fading, setFading] = useState(false)
  const [done, setDone] = useState(false)

  const handleEnd = () => {
    setFading(true)  // Start CSS fade-out
    setTimeout(() => {
      setDone(true)            // Remove from DOM
      sessionStorage.setItem('introSeen', '1')  // Remember for this session
      if (onComplete) onComplete()
    }, 800)  // Match CSS transition duration
  }

  // Safety: if video fails to load, skip after 6 seconds
  useEffect(() => {
    const timer = setTimeout(handleEnd, 8000)
    return () => clearTimeout(timer)
  }, [])

  if (done) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0D1B2A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: fading ? 0 : 1,
      transition: 'opacity 0.8s ease',
      pointerEvents: fading ? 'none' : 'all'
    }}>
      <video
        ref={videoRef}
        autoPlay muted playsInline
        onEnded={handleEnd}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      >
        <source src='/intro/intro.webm' type='video/webm' />
        <source src='/intro/intro.mp4'  type='video/mp4' />
      </video>
    </div>
  )
}
```

### 0.5  Integrating IntroOverlay into the App

In your root layout file (`app/layout.js`), add the IntroOverlay as the first child. It sits above everything else in the DOM.

```javascript
// app/layout.js
'use client'
import { useState, useEffect } from 'react'
import { IntroOverlay } from '@/components/intro/IntroOverlay'

export default function RootLayout({ children }) {
  const [showIntro, setShowIntro] = useState(false)

  useEffect(() => {
    // Only show intro on first visit per session
    const seen = sessionStorage.getItem('introSeen')
    if (!seen) setShowIntro(true)
  }, [])

  return (
    <html lang='en'>
      <body>
        {showIntro && <IntroOverlay onComplete={() => setShowIntro(false)} />}
        {children}
      </body>
    </html>
  )
}
```

> *Why `useEffect` for the initial check? Because `sessionStorage` is only available in the browser, not during Next.js server-side rendering. Without `useEffect`, you will get a hydration mismatch error. This pattern is the correct way to handle browser-only APIs in Next.js.*

### 0.6  Optional: Skip Button

For good UX, add a 'Skip' button that lets users bypass the intro. Place it in the bottom-right corner:

```javascript
// Inside the <div> in IntroOverlay.js, add this after the <video>:
<button
  onClick={handleEnd}
  style={{
    position: 'absolute', bottom: '40px', right: '40px',
    background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)',
    color: 'white', padding: '8px 20px', borderRadius: '4px',
    cursor: 'pointer', fontFamily: 'Arial', fontSize: '14px',
    backdropFilter: 'blur(4px)'
  }}
>
  Skip ›
</button>
```

### 0.7  Testing the Intro Sequence

Follow this exact test procedure to confirm the intro works correctly before moving to any other development:

- Clear `sessionStorage` in browser DevTools (Application tab > Storage > sessionStorage > Clear) — then reload. The intro should play.
- Watch the video to completion — the overlay must fade out and homepage must be visible after.
- Navigate away from homepage, then press Back — intro should NOT replay (sessionStorage protects this).
- Open a new browser tab and go to homepage — intro SHOULD play again (new session).
- Test on a mobile device — video must play without audio autoplay errors (check browser console).
- Test the safety timeout: disable your internet after page loads partially — intro should skip after 8 seconds.
- Test the Skip button — clicking it should immediately trigger the fade.

> *Build and fully test the intro in Phase 0 (Days 1-3) before doing anything else. It is a short task that sets a great tone for the project. See updated build sequence in Part 11.*

### 0.8  Edge Cases and Common Problems

| **Problem** | **Solution** |
| --- | --- |
| Video does not autoplay | Confirm the video file has NO audio track. Use FFmpeg `-an` flag to strip audio. All browsers block audio autoplay. |
| Video works on desktop but not iOS Safari | Make sure you have the MP4 source listed as a fallback in `<source>`. iOS requires H.264 MP4. Also confirm `playsInline` attribute is on the video tag. |
| Video flickers or shows wrong color before playing | Set `background: '#0D1B2A'` on the overlay div so the video background matches your brand color before the first frame loads. |
| Intro plays on every page navigation | Use `sessionStorage.getItem` check inside `useEffect` (see code above). This ensures it only shows once per browser session. |
| Intro shows on SSR/hydration causing flash | The `useState(false)` + `useEffect` pattern prevents this. Never initialize `showIntro` to `true`. |
| Video loading is slow on mobile | Compress the WebM and MP4 further. Target under 5MB WebM. Add a loading progress bar if needed. |

---

## PART 1  —  TECH STACK & ARCHITECTURE OVERVIEW  (UPDATED)

### 1.1  Why This Stack

This stack gives BeyClaft a world-class, fully custom 2D Beyblade viewer website built on modern, industry-standard technology. Every tool is chosen specifically for the demands of real-time 2D part-swapping rendering, user-generated content (saved builds), and smooth deployment via GitHub and Vercel. Critically, the 3D React Three Fiber dependency has been removed and replaced with a simpler, faster, no-dependency 2D Canvas API approach — eliminating the need for GLB 3D model assets entirely. The entire stack can be built and maintained with AI coding tools without requiring traditional developer experience.

### 1.2  Core Technology Stack  (Updated)

| **Layer / Concern** | **Technology & Purpose** |
| --- | --- |
| Frontend Framework | Next.js 14 (App Router) — React 18, Server Components, fast page loads |
| Styling | Tailwind CSS 3 — utility-first, mobile-first responsive design |
| 2D Viewer Engine | HTML5 Canvas API (native browser) — renders top-view and side-view 2D Beyblade part images |
| Part Image Format | PNG with transparency — one top-view and one side-view image per part |
| Database | Supabase PostgreSQL — stores user accounts, saved builds, parts catalog |
| Auth | Supabase Auth — email/password login, session management |
| Storage | Supabase Storage — stores part PNG images (top + side views) |
| State Management | Zustand — tracks currently selected parts across components |
| Animations | Framer Motion — page transitions, UI micro-interactions |
| Hosting | Vercel — auto-deploys on every GitHub push |
| Version Control | GitHub — source of truth, push to deploy |
| Forms | React Hook Form + Zod — validated login/signup/save forms |
| Intro Video | Native HTML5 `<video>` element — no external library needed |

> *REMOVED from original plan: React Three Fiber, @react-three/drei, GLTF/GLB format. These required 3D model assets that are difficult to create. The new 2D approach uses simple PNG images that are far easier to produce and work on all devices including low-end mobile.*

### 1.3  Architecture Diagram (Described)

- **Layer 1 — Edge/CDN:** Vercel Edge Network serves cached static pages globally
- **Layer 2 — Video Intro:** Native HTML5 video plays before homepage, stored in `/public/intro/`
- **Layer 3 — Frontend:** Next.js App Router with Server + Client Components
- **Layer 4 — 2D Viewer:** HTML5 Canvas API composites layered PNG part images (top-view + side-view)
- **Layer 5 — State:** Zustand store holds selected parts, updates both canvas panels in real time
- **Layer 6 — API:** Next.js Server Actions handle save/load builds securely
- **Layer 7 — Database:** Supabase PostgreSQL stores all user data and builds
- **Layer 8 — Storage:** Supabase Storage buckets hold PNG part images (top and side views)
- **Layer 9 — Auth:** Supabase Auth with JWT tokens, SSR cookie sessions

### 1.4  Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1...   (server-only, never expose)
NEXT_PUBLIC_SITE_URL=https://beycraft.com
```

> *IMPORTANT: All `NEXT_PUBLIC_` variables are visible in the browser. Never put secret keys in `NEXT_PUBLIC_` variables. The service role key must never be used in client-side code.*

---

## PART 2  —  DATABASE SCHEMA & DATA MODEL  (UPDATED FOR 2D)

### 2.1  Schema Design Principles

- UUID primary keys throughout — collision-safe, globally unique
- Row-Level Security (RLS) on all user-facing tables — users see only their own builds
- All part data stored in parts catalog table — easily extendable with new parts
- Saved builds stored as JSONB — flexible structure for any combination of parts
- Timestamps: `created_at`, `updated_at` on every table (triggers auto-update `updated_at`)
- Soft deletes: `is_deleted BOOLEAN` — never hard delete user builds
- 2D parts use `top_image_path` + `side_image_path` instead of `model_path` (no GLB files needed)

### 2.2  Table: profiles  (extends Supabase auth.users)

| **Column** | **Type / Constraint** | **Notes & Validation** |
| --- | --- | --- |
| id | UUID PK | References `auth.users(id)` ON DELETE CASCADE |
| full_name | TEXT NOT NULL | CHECK (length >= 2 AND length <= 100) |
| email | TEXT NOT NULL | CHECK valid email regex |
| username | TEXT UNIQUE | Display name, CHECK (length 3-30, alphanumeric) |
| avatar_url | TEXT | URL to Supabase storage image |
| bio | TEXT | Optional short bio, max 200 chars |
| favorite_type | TEXT | CHECK IN ('attack','defense','stamina','balance') |
| total_builds_created | INTEGER DEFAULT 0 | Counter, incremented on each save |
| is_email_verified | BOOLEAN DEFAULT false | Set true after email confirmation |
| role | TEXT DEFAULT 'user' | CHECK (role IN ('user','admin')) |
| created_at | TIMESTAMPTZ DEFAULT now() | Auto-set on insert |
| updated_at | TIMESTAMPTZ DEFAULT now() | Auto-updated via trigger |

### 2.3  Table: beyblade_parts  (UPDATED — 2D Image Paths)

The parts catalog now stores PNG image paths for both top-view and side-view instead of GLB model paths. This is the key change from the original plan.

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | UUID PK DEFAULT gen_random_uuid() | Auto-generated |
| name | TEXT NOT NULL | e.g. 'Dragoon Wing Attack Ring' |
| slug | TEXT UNIQUE NOT NULL | URL-safe: 'dragoon-wing-attack-ring' |
| part_type | TEXT NOT NULL | CHECK IN ('attack_ring','weight_disk','spin_gear','blade_base','face_bolt','emblem') |
| beyblade_type | TEXT NOT NULL | CHECK IN ('attack','defense','stamina','balance') |
| description | TEXT | Short description of this part, max 300 chars |
| top_image_path | TEXT NOT NULL | Supabase Storage: `/parts/top_view/dragoon-wing.png`  (NEW) |
| side_image_path | TEXT NOT NULL | Supabase Storage: `/parts/side_view/dragoon-wing.png`  (NEW) |
| preview_image_path | TEXT NOT NULL | 2D thumbnail image path for the picker UI card |
| top_offset_x | FLOAT DEFAULT 0 | X offset in top-view canvas when composited with other parts |
| top_offset_y | FLOAT DEFAULT 0 | Y offset in top-view canvas when composited with other parts |
| side_offset_x | FLOAT DEFAULT 0 | X offset in side-view canvas when composited |
| side_offset_y | FLOAT DEFAULT 0 | Y offset in side-view canvas when composited |
| scale | FLOAT DEFAULT 1 | Scale multiplier for this part in both canvas views |
| layer_order | INTEGER DEFAULT 0 | Paint order — lower parts drawn first, higher drawn on top |
| is_active | BOOLEAN DEFAULT true | false = hidden from customizer |
| is_default | BOOLEAN DEFAULT false | Default part shown on first load per type |
| display_order | INTEGER DEFAULT 0 | Sort order in the picker panel |
| created_at | TIMESTAMPTZ DEFAULT now() | |
| updated_at | TIMESTAMPTZ DEFAULT now() | Auto-trigger |

### 2.4  Table: saved_builds

| **Column** | **Type** | **Notes** |
| --- | --- | --- |
| id | UUID PK DEFAULT gen_random_uuid() | Auto-generated |
| user_id | UUID NOT NULL | FK → profiles(id) ON DELETE CASCADE |
| build_name | TEXT NOT NULL | User-given name, max 60 chars |
| attack_ring_id | UUID NOT NULL | FK → beyblade_parts(id) |
| weight_disk_id | UUID NOT NULL | FK → beyblade_parts(id) |
| spin_gear_id | UUID NOT NULL | FK → beyblade_parts(id) |
| blade_base_id | UUID NOT NULL | FK → beyblade_parts(id) |
| face_bolt_id | UUID | FK → beyblade_parts(id) — optional |
| emblem_id | UUID | FK → beyblade_parts(id) — optional |
| parts_snapshot | JSONB NOT NULL | Full snapshot of all part data at save time |
| notes | TEXT | Optional user notes about this build, max 500 chars |
| is_public | BOOLEAN DEFAULT false | If true, visible to all users in gallery |
| is_deleted | BOOLEAN DEFAULT false | Soft delete |
| created_at | TIMESTAMPTZ DEFAULT now() | |
| updated_at | TIMESTAMPTZ DEFAULT now() | Auto-trigger |

### 2.5  Table: build_likes

| **Column** | **Notes** |
| --- | --- |
| id  UUID PK | Auto-generated |
| build_id  UUID NOT NULL | FK → saved_builds(id) ON DELETE CASCADE |
| user_id  UUID NOT NULL | FK → profiles(id) ON DELETE CASCADE |
| created_at  TIMESTAMPTZ DEFAULT now() | |
| UNIQUE (build_id, user_id) | Prevents duplicate likes |

---

## PART 3  —  PROJECT STRUCTURE & FILE ORGANIZATION  (UPDATED)

### 3.1  Root Directory

```
beycraft/
├── app/                    # Next.js 14 App Router
├── components/             # Reusable UI components
├── lib/                    # Utilities, helpers, Supabase client
├── hooks/                  # Custom React hooks
├── store/                  # Zustand state stores
├── public/                 # Static assets
│   └── intro/              # Video intro files (intro.mp4, intro.webm)  NEW
└── supabase/               # DB migrations, seed data
```

### 3.2  App Router Structure

```
app/
├── (main)/
│   ├── page.js             # Homepage with video intro + scroll animation
│   ├── customize/page.js   # Split 2D Viewer Customizer page  (UPDATED)
│   ├── gallery/page.js
│   └── about/page.js
├── (account)/
│   ├── account/page.js
│   └── account/builds/page.js
├── (auth)/
│   ├── login/page.js
│   ├── signup/page.js
│   └── auth/callback/route.js
└── admin/
    ├── page.js
    └── parts/page.js
```

### 3.3  Components Structure  (Updated — 2D Viewer)

```
components/
├── intro/
│   └── IntroOverlay.js       # Full-screen video intro component  (NEW)
├── viewer/                   # 2D Viewer components  (REPLACES 3d/ folder)
│   ├── BeybladeTopView.js    # HTML5 Canvas top-down 2D view  (NEW)
│   ├── BeybladesSideView.js  # HTML5 Canvas side profile 2D view  (NEW)
│   ├── SplitViewerPanel.js   # Container holding both canvases side by side  (NEW)
│   └── ViewerBackground.js   # Animated dark background behind canvases  (NEW)
├── customizer/
│   ├── CustomizerPanel.js
│   ├── PartTypeSection.js
│   ├── PartCard.js
│   └── SaveBuildModal.js
├── layout/
│   ├── Navbar.js
│   ├── Footer.js
│   └── MobileNav.js
└── ui/
    ├── Button.js
    ├── Modal.js
    ├── Toast.js
    └── LoadingSpinner.js
```

---

## PART 4  —  AUTHENTICATION & USER MANAGEMENT  (UNCHANGED)

### 4.1  Auth Strategy

- Supabase Auth handles all authentication — email/password
- SSR-safe auth via `@supabase/ssr` package — uses cookies, not localStorage
- Protected routes via Next.js Middleware — checks session on every request to `/account` and `/admin`
- Admin routes additionally check `profiles.role = 'admin'`
- Guest users can use the customizer freely but must sign up to save builds

### 4.2  Signup Flow

- User fills: Username, Email, Password
- Client validates: email regex, password min 8 chars, username 3-30 chars alphanumeric
- Server validates same fields via Zod schema before DB insert
- Supabase `createUser()` called — sends verification email
- Profile row auto-created via DB trigger on `auth.users` insert
- User redirected to `/customize` to immediately start building

### 4.3  Login Flow / Middleware / Guest Transition

Email + Password via Supabase `signInWithPassword()`. On success, redirect to `/customize` or `/account/builds`. Session persisted in cookie via `@supabase/ssr`. Protected route patterns: `/account/*` requires any authenticated user. `/admin/*` requires authenticated user with `role='admin'`. Guests can freely use the 2D customizer without an account. When they click 'Save Build', a modal prompts them to sign up or log in. After auth, the current customizer state is automatically saved.

---

## PART 5  —  SPLIT 2D BEYBLADE VIEWER  (REPLACES 3D CUSTOMIZER)

### 5.1  Overview

The Split 2D Viewer is the signature feature of BeyClaft. It replaces the original 3D React Three Fiber viewer. Instead of one 3D canvas requiring GLB model files, the viewer shows TWO side-by-side 2D panels: a top-down view of the assembled Beyblade, and a side profile view. Both panels update instantly whenever the user selects a different part. This approach requires only simple PNG images — no 3D software, no GLB exports, no Three.js setup.

> *This is a major simplification over the original plan. The 2D approach loads faster, works on ALL devices including older phones, requires zero 3D modeling skills, and is far easier to build. The result still looks excellent when the PNG images are drawn well.*

### 5.2  What the Two Views Show

| **View Panel** | **What It Displays** |
| --- | --- |
| TOP VIEW (Left panel) | Looking straight down at the Beyblade from above. Shows the Attack Ring, Emblem/Face Bolt centered on top. Parts are layered concentrically — widest (Attack Ring) at the bottom, Face Bolt on top. This view shows the spinning disc shape. |
| SIDE VIEW (Right panel) | Looking at the Beyblade from the side, as if it's sitting on a table. Shows the full height profile: Face Bolt on top, Attack Ring in the middle, Weight Disk, Blade Base at the bottom. This view shows the vertical stacking. |

### 5.3  Asset Preparation  (Do This Before Coding)

Creating the PNG assets is the most important pre-coding step for the 2D viewer. This must be done correctly before any viewer code is written.

#### 5.3.1  What PNG Files You Need

For each beyblade part, you need two PNG files: one showing the part from directly above (top view), and one showing the part from the side. For example, for 'Dragoon Wing Attack Ring':

| **File Name** | **Description** |
| --- | --- |
| dragoon-wing-top.png | The attack ring drawn/photographed from directly overhead. Transparent background. Should be a perfect circle or ring shape viewed from above. |
| dragoon-wing-side.png | The attack ring drawn/photographed from the side profile. Transparent background. Shows the thickness and edge shape. |

#### 5.3.2  PNG Specifications

| **Property** | **Specification** |
| --- | --- |
| Background | 100% transparent (PNG alpha channel). NEVER a white or colored background. |
| Top view canvas size | 512x512 pixels — parts must be drawn centered in this square. |
| Side view canvas size | 512x512 pixels — parts must be drawn centered in this square. |
| File size | Under 200KB per PNG after optimization (use TinyPNG.com to compress). |
| Format | PNG-24 with alpha transparency (not PNG-8 which cannot support smooth edges). |
| Origin point | All parts MUST be drawn centered at the exact middle of the 512x512 canvas so compositing aligns them correctly. |

> *CRITICAL: Every single part image must be centered in its canvas. If a part is off-center, it will not align correctly with other parts when composited. Use Figma (free) or GIMP (free) to create parts on a 512x512 transparent canvas.*

#### 5.3.3  How to Create the PNG Assets — Options

| **Method** | **Details** |
| --- | --- |
| Option 1: Draw in Figma (Recommended) | Figma.com is free. Create a 512x512 frame with transparent background. Draw each part using shape tools. Export as PNG with transparent background. No art experience needed — simple circles, rings, and geometric shapes look great. |
| Option 2: Hire on Fiverr | Search 'beyblade 2D part illustration transparent'. Budget $20-50 for a full set. Ask for PNG files on transparent background, 512x512px, top view AND side view for each part. |
| Option 3: Screenshot + Remove Background | Photograph real Beyblade parts on a plain surface. Use remove.bg (free) to remove background. Resize to 512x512. This gives a realistic look. |
| Option 4: Use AI Image Tools | Use Adobe Firefly or Canva AI to generate Beyblade-style part illustrations. Specify 'top view, transparent background, 512x512'. Clean up in Figma if needed. |

#### 5.3.4  Minimum Asset Set to Start Development

You need at least one part per slot to begin testing the viewer. Start with these minimum assets (2 parts per slot gives you something to swap between):

| **Part Slot** | **Minimum PNG Files Needed** |
| --- | --- |
| Attack Ring (x2) | spike-ring-top.png, spike-ring-side.png, wing-ring-top.png, wing-ring-side.png |
| Weight Disk (x2) | wide-disk-top.png, wide-disk-side.png, heavy-disk-top.png, heavy-disk-side.png |
| Blade Base (x2) | flat-base-top.png, flat-base-side.png, semi-flat-base-top.png, semi-flat-base-side.png |
| Face Bolt (x2) | dragon-face-top.png, dragon-face-side.png, phoenix-face-top.png, phoenix-face-side.png |
| Emblem (x2) | dragon-emblem-top.png, dragon-emblem-side.png, tiger-emblem-top.png, tiger-emblem-side.png |

#### 5.3.5  Where to Store the PNG Files in Supabase

Upload all part PNG images to Supabase Storage. Use this folder structure:

```
Supabase Storage bucket: 'parts'
  parts/
    top_view/
      attack_ring/
        spike-ring-top.png
        wing-ring-top.png
      weight_disk/
        wide-disk-top.png
    side_view/
      attack_ring/
        spike-ring-side.png
      weight_disk/
        wide-disk-side.png
    previews/
      spike-ring-preview.png    <- small 80x80 thumbnail for the picker UI
```

### 5.4  How the 2D Canvas Compositing Works

The viewer uses HTML5 Canvas API to layer part images on top of each other. This is how the assembled Beyblade image is created:

```javascript
// For TOP VIEW — draw all parts from bottom layer to top layer:
// 1. Draw blade_base top image  (layer_order: 0 — drawn first, at bottom)
// 2. Draw weight_disk top image (layer_order: 1 — drawn on top of base)
// 3. Draw attack_ring top image (layer_order: 2)
// 4. Draw face_bolt top image   (layer_order: 3)
// 5. Draw emblem top image      (layer_order: 4 — drawn last, on top of everything)

// Each part image is loaded, then drawn at:
// x = canvas.width/2 + part.top_offset_x - (imgWidth * scale / 2)
// y = canvas.height/2 + part.top_offset_y - (imgHeight * scale / 2)
```

### 5.5  BeybladeTopView Component Code

Create this file: `components/viewer/BeybladeTopView.js`

```javascript
'use client'
import { useRef, useEffect } from 'react'

export function BeybladeTopView({ parts }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Sort parts by layer_order so they stack correctly
    const sorted = Object.values(parts)
      .filter(Boolean)
      .sort((a, b) => a.layer_order - b.layer_order)

    const loadAndDraw = async () => {
      for (const part of sorted) {
        await new Promise((resolve) => {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.src = part.top_image_url  // URL from Supabase Storage
          img.onload = () => {
            const sw = img.width * part.scale
            const sh = img.height * part.scale
            const x = canvas.width/2 + part.top_offset_x - sw/2
            const y = canvas.height/2 + part.top_offset_y - sh/2
            ctx.drawImage(img, x, y, sw, sh)
            resolve()
          }
          img.onerror = resolve  // Skip missing images gracefully
        })
      }
    }
    loadAndDraw()
  }, [parts])  // Re-runs every time parts selection changes

  return (
    <div>
      <p style={{ color: '#9CA3AF', textAlign: 'center', marginBottom: '8px' }}>Top View</p>
      <canvas ref={canvasRef} width={512} height={512}
        style={{ width: '100%', borderRadius: '12px', background: '#0F1923' }} />
    </div>
  )
}
```

### 5.6  BeybladesSideView Component Code

Create this file: `components/viewer/BeybladesSideView.js` — Same pattern as BeybladeTopView but uses `side_image_url` and `side_offset_x/Y`:

```javascript
'use client'
import { useRef, useEffect } from 'react'

export function BeybladesSideView({ parts }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const sorted = Object.values(parts)
      .filter(Boolean)
      .sort((a, b) => a.layer_order - b.layer_order)

    const loadAndDraw = async () => {
      for (const part of sorted) {
        await new Promise((resolve) => {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.src = part.side_image_url  // URL from Supabase Storage (side view)
          img.onload = () => {
            const sw = img.width * part.scale
            const sh = img.height * part.scale
            // Side view: stack vertically based on layer_order
            const x = canvas.width/2 + part.side_offset_x - sw/2
            const y = canvas.height/2 + part.side_offset_y - sh/2
            ctx.drawImage(img, x, y, sw, sh)
            resolve()
          }
          img.onerror = resolve
        })
      }
    }
    loadAndDraw()
  }, [parts])

  return (
    <div>
      <p style={{ color: '#9CA3AF', textAlign: 'center', marginBottom: '8px' }}>Side View</p>
      <canvas ref={canvasRef} width={512} height={512}
        style={{ width: '100%', borderRadius: '12px', background: '#0F1923' }} />
    </div>
  )
}
```

### 5.7  SplitViewerPanel — Both Canvases Together

Create this file: `components/viewer/SplitViewerPanel.js` — This is the container that shows both views side by side:

```javascript
'use client'
import { BeybladeTopView } from './BeybladeTopView'
import { BeybladesSideView } from './BeybladesSideView'
import { useCustomizerStore } from '@/store/useCustomizerStore'

export function SplitViewerPanel() {
  const { selectedParts } = useCustomizerStore()

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '16px' }}>
      <BeybladeTopView  parts={selectedParts} />
      <BeybladesSideView parts={selectedParts} />
    </div>
  )
}
```

### 5.8  Zustand Store — Customizer State (Updated)

```javascript
// store/useCustomizerStore.js
import { create } from 'zustand'

export const useCustomizerStore = create((set, get) => ({
  selectedParts: {
    attack_ring: null,
    weight_disk: null,
    spin_gear:   null,
    blade_base:  null,
    face_bolt:   null,
    emblem:      null,
  },
  selectPart: (partType, part) => set(state => ({
    selectedParts: { ...state.selectedParts, [partType]: part }
  })),
  loadBuild: (parts) => set({ selectedParts: parts }),
  resetToDefaults: () => set({
    selectedParts: { attack_ring: null, weight_disk: null, spin_gear: null,
                     blade_base: null, face_bolt: null, emblem: null }
  }),
}))
```

### 5.9  Customizer Page Layout  (Updated)

The `/customize` page is split into two sections:

- **LEFT PANEL (60% width on desktop)** — SplitViewerPanel: contains two 2D canvas views side by side (top and side). Label each panel clearly: 'Top View' and 'Side View'.
- **RIGHT PANEL (40% width on desktop)** — Parts Picker: scrollable panel with part type sections, Save Build button pinned to bottom. Identical to original plan.
- **MOBILE LAYOUT:** Both canvases stacked vertically on top (each 100% width), picker panel below with horizontal scroll rows.
- **LOADING STATE:** Show a spinner overlay on both canvases while PNG images are loading from Supabase. Use `Promise.all` to detect when all images are loaded.

> *No `dynamic import` with `ssr:false` is needed for the 2D viewer! Unlike Three.js, the HTML5 Canvas API is safe in Next.js because it is controlled entirely by `useEffect`, which only runs in the browser. This removes a major complexity from the original plan.*

---

## PART 6  —  SAVED BUILDS & USER LIBRARY  (UNCHANGED)

### 6.1  Save Build Flow

- User customizes their Beyblade and clicks 'Save Build'
- If not logged in: auth modal appears. After signup/login, save continues automatically
- If logged in: name-your-build modal opens with text input
- User enters a build name (e.g. 'My Champion Striker') and clicks Save
- Server Action validates user session and writes to `saved_builds` table
- JSONB snapshot of all current part data saved for permanent record
- Success toast: 'Build saved! View it in My Builds'
- `profiles.total_builds_created` incremented

### 6.2  My Builds Page  (/account/builds)

- Grid of all saved builds with build name, creation date, part preview thumbnails
- Each build card has: Load Build button (opens in customizer), Delete button, Share toggle (make public/private)
- Load Build: navigates to `/customize` with build state pre-loaded from Supabase
- Delete Build: soft delete (`is_deleted = true`), with confirmation modal
- Build count shown on account dashboard

### 6.3  Public Gallery  (/gallery)

- Shows all builds where `is_public = true`, sorted by likes count
- Each build card shows: build name, creator username, like count, part thumbnails
- Clicking a build opens `/gallery/[buildId]` — shows the 2D split viewer preview of that build
- Logged-in users can like any public build
- 'Remix This Build' button: loads the build into `/customize` for the current user to modify and save

---

## PART 7  —  HOMEPAGE & SCROLL ANIMATION  (UPDATED)

### 7.1  Homepage Overview

The homepage is the first thing visitors see after the video intro sequence fades out. The hero section features an animated Beyblade element. Because we are no longer using React Three Fiber, the homepage animation is achieved with a CSS/Framer Motion spinning Beyblade image rather than a 3D canvas — this is faster, lighter, and more compatible.

### 7.2  Animated Beyblade Hero  (CSS Spin + Framer Motion)

Instead of a 3D scroll-driven canvas, the homepage uses a large PNG image of a Beyblade that spins continuously with a CSS animation. This gives the same visual impact with zero library overhead:

```javascript
// components/homepage/SpinningBeyblade.js
'use client'
import { motion } from 'framer-motion'

export function SpinningBeyblade({ imageUrl }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      style={{ width: '400px', height: '400px' }}
    >
      <img src={imageUrl} alt='BeyClaft hero beyblade'
           style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </motion.div>
  )
}
```

> *For the homepage spinning Beyblade image, you only need ONE top-view PNG image of a complete assembled Beyblade. This can be your best-looking build composited from the part PNGs, exported as a single flat PNG. No 3D model needed.*

### 7.3  Homepage Sections

| **Section** | **Content** | **Key Component** |
| --- | --- | --- |
| Hero | Full-screen — spinning Beyblade PNG on right, headline + CTA on left. | `<HeroSection />` |
| Tagline Bar | 'Drag. Drop. Spin.' animated text marquee | `<TaglineBar />` |
| How It Works | 3-step infographic: Pick Parts → See Top + Side View → Save Your Build | `<HowItWorks />` |
| 2D Viewer Preview | Interactive mini-preview of the 2D split viewer with a sample build | `<ViewerPreview />` |
| Featured Builds | Showcase of 3 impressive public community builds with preview thumbnails | `<FeaturedBuilds />` |
| CTA Section | Dark full-width section: 'Start Building Now' large button link to `/customize` | `<CTASection />` |
| Footer | Logo, navigation links, social links | `<Footer />` |

---

## PART 8  —  FRONTEND UI/UX IMPLEMENTATION GUIDE  (UNCHANGED)

### 8.1  Design System  (Color Tokens)

```javascript
// tailwind.config.js
colors: {
  primary:   { DEFAULT: '#0D1B2A', light: '#1B3A5C', dark: '#060D15' },  // Deep navy
  accent:    { DEFAULT: '#E63946', light: '#FF6B6B' },                   // BeyRed
  gold:      { DEFAULT: '#C9A84C', light: '#E8C96B' },                   // Champion gold
  surface:   { DEFAULT: '#0F1923', light: '#1A2632' },                   // Dark surface
  neutral:   { DEFAULT: '#374151', light: '#9CA3AF', dark: '#111827' },  // Text grays
}
```

### 8.2  Typography Setup

```javascript
// app/layout.js — Google Fonts
import { Orbitron, Inter } from 'next/font/google'

const displayFont = Orbitron({ subsets: ['latin'], weight: ['400','700','900'] })
// Orbitron — futuristic display font for headings and the brand name

const bodyFont = Inter({ subsets: ['latin'], weight: ['400','500','600'] })
// Inter — clean and readable for body text and UI
```

### 8.3  Key UI Components to Build

**Global Components**

- `<Navbar />` — dark background, BeyClaft logo left, nav links center, auth buttons right
- `<MobileNav />` — hamburger menu, slide-in drawer with full navigation
- `<Footer />` — dark minimal footer with logo, links, social icons
- `<Toast />` — non-blocking notifications for save success, errors, login prompts
- `<LoadingSpinner />` — shown while 2D part PNG images load from Supabase Storage

**Viewer Components  (New)**

- `<SplitViewerPanel />` — two 2D canvas panels side by side with 'Top View' / 'Side View' labels
- `<BeybladeTopView />` — HTML5 Canvas rendering top-down view with layered PNGs
- `<BeybladesSideView />` — HTML5 Canvas rendering side profile view with layered PNGs
- `<ViewerBackground />` — animated dark radial gradient behind the canvas panels

### 8.4  Animations  (Framer Motion)

- Hero section: fade-in + slide-up on page load for text elements
- Spinning hero Beyblade: continuous CSS rotation via Framer Motion infinite animation
- Canvas viewer: fade-in transition when a new part is selected (canvas opacity 0→1 on update)
- Customizer panel: parts grid items stagger-in on section expand
- PartCard selection: scale pulse (1.0 → 1.05 → 1.0) when a part is selected
- SaveBuildModal: slide-up from bottom on mobile, fade-scale on desktop
- Toast notifications: slide-in from top-right, auto-dismiss after 3 seconds
- Page transitions: fade between routes via Framer Motion AnimatePresence
- BuildCard hover: slight lift (y: -4px) with shadow increase

---

## PART 9  —  SEO IMPLEMENTATION  (UNCHANGED)

### 9.1  Technical SEO Setup

- Next.js `generateMetadata()` on every page — dynamic meta titles and descriptions
- Open Graph + Twitter Card meta tags on all pages for social sharing
- XML Sitemap: auto-generated at `/sitemap.xml` via Next.js `sitemap.js`
- Robots.txt: `/robots.txt` — allow all crawlers, disallow `/admin/` and `/api/`
- Canonical URLs on all pages

### 9.2  Page-Level Meta Tags

| **Page** | **Meta Title** | **Meta Description** |
| --- | --- | --- |
| Homepage | BeyClaft — Custom Beyblade Customizer | Design your perfect Beyblade online. Swap attack rings, emblems, blades and more. See top and side views live. Save your custom builds. |
| /customize | Customize Your Beyblade — BeyClaft | Mix and match attack rings, weight disks, blade bases and emblems. See your custom Beyblade in real-time top and side view. Free to use. |
| /gallery | Community Builds Gallery — BeyClaft | Browse custom Beyblade designs created by the BeyClaft community. Like your favorites and remix them. |
| /account/builds | My Saved Builds — BeyClaft | View and manage your saved Beyblade custom builds. |

### 9.3  Core Web Vitals Targets

| **Metric** | **Target** | **How to Achieve** |
| --- | --- | --- |
| LCP (Largest Contentful Paint) | < 2.5 seconds | Lazy-load 2D canvases, prioritize above-fold text. No Three.js bundle — page is much lighter now. |
| FID / INP (Interaction) | < 100ms | Canvas draws are fast. Minimize Zustand store updates per part change. |
| CLS (Cumulative Layout Shift) | < 0.1 | Reserve canvas dimensions explicitly. Avoid layout-shifting content. |
| Lighthouse Mobile Score | > 90 | 2D approach is far lighter than 3D. Optimize PNG images, reduce JS bundle. |
| Lighthouse Desktop Score | > 95 | Full optimization pass before launch. |

---

## PART 10  —  AI TOOLS & PROMPTS FOR CODE GENERATION  (UPDATED)

### 10.1  Recommended AI Coding Tools

| **Tool** | **Best Used For** |
| --- | --- |
| Claude (Sonnet/Opus) | Architecture, 2D canvas logic, state management, full feature implementation, this entire plan |
| v0.dev by Vercel | React component generation from descriptions — excellent for UI panels and cards |
| Cursor IDE | AI-powered code editor — tab completion, chat in editor, inline edits |
| Figma | Free tool to create the 2D part PNG assets. Use vector shapes for clean transparent PNGs. |
| TinyPNG.com | Compress all PNG files before uploading to Supabase. Free and online. |
| HandBrake | Free video converter — use to create intro.webm and optimized intro.mp4 from your video. |

### 10.2  Master Prompt — Project Initialization

> *I am building a Beyblade customizer website called BeyClaft. Tech stack: Next.js 14 App Router (NO TypeScript), Tailwind CSS, Supabase (auth + database + storage), HTML5 Canvas API (for 2D part viewer — NOT React Three Fiber), Zustand for state, Framer Motion for animations. Deployed on Vercel. The site has: (1) A video intro sequence that plays on first visit using a native HTML5 video element. (2) Homepage with a Framer Motion spinning Beyblade PNG image. (3) /customize page split into left 2D Split Viewer (showing top-view and side-view HTML5 canvases) and right parts picker panel. (4) Supabase Auth for user login. (5) Saved builds stored in Supabase. Do not use TypeScript. Do not use React Three Fiber or Three.js. Use Tailwind for all styling. Always use the App Router pattern.*

### 10.3  Prompt — 2D Split Viewer Canvas

> *In my Next.js 14 App Router project (no TypeScript) with Zustand and Tailwind, create the Split 2D Viewer at `components/viewer/SplitViewerPanel.js`. It renders two HTML5 canvases side by side: one top-view and one side-view. The Zustand store (`store/useCustomizerStore.js`) holds `selectedParts` with keys: `attack_ring`, `weight_disk`, `spin_gear`, `blade_base`, `face_bolt`, `emblem`. Each part has: `id`, `name`, `top_image_url`, `side_image_url`, `top_offset_x`, `top_offset_y`, `side_offset_x`, `side_offset_y`, `scale`, `layer_order`. The canvases are 512x512px and draw all selected parts using `ctx.drawImage()` in `layer_order` sequence. Parts are centered in the canvas using `offset_x/Y`. The canvas clears and redraws whenever `selectedParts` changes in the Zustand store. Include 'Top View' and 'Side View' labels above each canvas.*

### 10.4  Prompt — Video Intro Sequence

> *In my Next.js 14 App Router project (no TypeScript), create a full-screen video intro overlay component at `components/intro/IntroOverlay.js`. When the homepage loads for the first time, this overlay should show a full-screen video (sources: `/intro/intro.webm` and `/intro/intro.mp4` as fallback). The overlay is fixed position, z-index 9999, dark navy background `#0D1B2A`. The video autoplays, is muted, has `playsInline`. When the video ends (`onEnded` event), the overlay fades out over 0.8 seconds (CSS opacity transition) then is removed from the DOM. Use `sessionStorage` key `'introSeen'` so the intro only plays once per browser session. Add a Skip button in the bottom-right corner. Integrate this component into `app/layout.js` with a `useEffect` that checks `sessionStorage` before showing the overlay.*

### 10.5  Prompt — Save Build to Supabase

> *In my Next.js 14 App Router project (no TypeScript) with Supabase and Zustand, create the Save Build feature. When user clicks Save Build, if not logged in: show a modal with signup/login options. If logged in: show a modal with a text input for the build name. On save, insert a row into the `saved_builds` Supabase table with: `user_id` (from Supabase auth session), `build_name` (from input), `attack_ring_id`, `weight_disk_id`, `spin_gear_id`, `blade_base_id`, `face_bolt_id`, `emblem_id` (all from current Zustand store `selectedParts`), and `parts_snapshot` (full JSON of all current parts including `top_image_url` and `side_image_url`). Show a success toast on save. After save, increment `profiles.total_builds_created` by 1.*

---

## PART 11  —  STEP-BY-STEP BUILD SEQUENCE  (FULLY UPDATED)

The build sequence has been updated to reflect the new video intro and 2D viewer approach. A new Phase 0 has been added at the very beginning for the intro video. The 3D asset gathering phase is replaced with 2D PNG asset creation. The 3D canvas phase is replaced with the 2D Canvas API phase.

### 11.0  Phase 0: Video Intro Sequence  (Days 1–3)  NEW

Build this first — it is short, impactful, and sets the tone for the whole project.

- Convert your PROMPT_TITLE_Fast_Paced_Beybl.mp4 to two formats: `intro.mp4` (H.264) and `intro.webm` (VP9) using HandBrake or FFmpeg. Remove audio with `-an` flag.
- Verify both files are under 8MB (MP4) and 5MB (WebM).
- Place both files in `beycraft/public/intro/` folder.
- Create `components/intro/IntroOverlay.js` with full-screen video, `onEnded` handler, fade-out transition, sessionStorage check, and Skip button.
- Integrate IntroOverlay into `app/layout.js` with `useEffect` + sessionStorage guard.
- Test all 7 test cases from Part 0.7 — do not proceed until all pass.

### 11.1  Phase 1: Foundation  (Days 4–8)

- Create GitHub repository: `github.com/[yourname]/beycraft`
- Initialize Next.js 14: `npx create-next-app@latest beycraft --tailwind --app` (no TypeScript flag)
- Install state/form/animation dependencies: `npm install zustand react-hook-form zod framer-motion`
- Install Supabase: `npm install @supabase/supabase-js @supabase/ssr`
- NOTE: No Three.js or React Three Fiber installation needed
- Create Supabase project at supabase.com — note URL and anon key
- Configure Tailwind with brand color tokens and Orbitron + Inter fonts
- Set up all environment variables in `.env.local`
- Connect GitHub repo to Vercel — first deploy of empty project
- Add all env vars to Vercel dashboard (Settings > Environment Variables)

### 11.2  Phase 2: Database Setup  (Days 9–10)

- Run all SQL migrations in Supabase SQL editor (profiles, beyblade_parts updated for 2D, saved_builds, build_likes)
- Configure Row Level Security policies
- Set up Supabase Auth: enable Email provider
- Create Supabase Storage bucket called `'parts'` — for PNG part images
- Set bucket policy: public read (so images load without auth), authenticated write
- Insert seed data: at least 2 example parts per type for initial testing
- Set up Next.js Middleware for `/account` and `/admin` route protection

### 11.3  Phase 3: Create 2D PNG Part Assets  (Days 11–15)  (REPLACES 3D Asset Phase)

This is the most creative phase of the project. No 3D modeling required.

- Open Figma.com (free) — create a new project called 'BeyClaft Parts'
- Create a 512x512 frame for each part type with transparent background
- Draw top-view PNG for each part: Attack Ring (x2 minimum), Weight Disk (x2), Blade Base (x2), Face Bolt (x2), Emblem (x2)
- Draw side-view PNG for each part — same set of parts, viewed from the side
- Export all as PNG with transparent background at 512x512 resolution
- Compress all PNGs at TinyPNG.com (free) before uploading
- Upload all PNGs to Supabase Storage in the correct folder structure (see Part 5.3.5)
- Create small preview thumbnails (80x80px) for each part for the picker UI cards
- Update `beyblade_parts` table rows with correct `top_image_path`, `side_image_path`, and `preview_image_path`
- Test that all PNG URLs are publicly accessible in browser (paste URL directly in Chrome)

> *Start with placeholder colored circles/rectangles if needed — you can improve the art later. The important thing is that the compositing logic works correctly. A blue circle on top of a red ring still proves the canvas layering is correct.*

### 11.4  Phase 4: Auth & User System  (Days 16–18)

- Build Signup page with all validation (React Hook Form + Zod)
- Build Login page
- Build Forgot Password flow
- Create auth callback route handler (`app/(auth)/auth/callback/route.js`)
- Build Account dashboard page
- Test complete auth flows end to end

### 11.5  Phase 5: 2D Split Viewer — Canvas  (Days 19–22)  (REPLACES Phase 5 3D Canvas)

- Create Zustand store (`store/useCustomizerStore.js`) with `selectedParts` state updated for 2D image URLs
- Build BeybladeTopView component — HTML5 Canvas, draws top-view PNGs in `layer_order` sequence
- Build BeybladesSideView component — same pattern for side-view PNGs
- Build SplitViewerPanel component — holds both canvases side by side with labels
- Test that changing parts in Zustand store immediately redraws both canvases
- Add loading state: show spinner while images are fetching
- Test with all available part combinations

### 11.6  Phase 6: Customizer Picker Panel  (Days 23–26)

- Build CustomizerPanel component with all part type sections
- Build PartTypeSection with horizontal scroll on mobile, grid on desktop
- Build PartCard with preview image, name, and selected highlight state
- Wire up `onClick` to update Zustand store and watch both canvases redraw live
- Build SaveBuildModal with text input and save logic
- Build AuthPromptModal for guests who try to save
- Test complete customizer flow on desktop and mobile

### 11.7  Phase 7: Save / Load Builds  (Days 27–29)

- Build Save Build server action — writes to `saved_builds` table
- Build My Builds page (`/account/builds`) with BuildGrid
- Build Load Build functionality — fetches saved build and restores Zustand state
- Build Delete Build with confirmation modal (soft delete)
- Build Share Build toggle (`is_public`)
- Test save/load cycle completely

### 11.8  Phase 8: Homepage  (Days 30–34)

- Create a combined top-view hero Beyblade PNG by compositing your best parts (single flat PNG)
- Build homepage with split hero layout
- Implement SpinningBeyblade component using Framer Motion infinite rotation
- Build all homepage sections (HowItWorks with 2D viewer explanation, FeaturedBuilds, CTA)
- Add Framer Motion animations for section reveals on scroll
- Add interactive mini ViewerPreview on homepage showing the 2D split view
- Test animations on multiple devices and browsers

### 11.9  Phase 9: Public Gallery  (Days 35–37)

- Build Gallery page — fetches all `is_public = true` builds
- Build GalleryCard component with like button and part preview thumbnails
- Build `build_likes` insert/delete logic
- Build Remix functionality (load any public build into customizer)
- Build individual build detail page `/gallery/[buildId]` with 2D split viewer preview

### 11.10  Phase 10: Testing & Polish  (Days 38–44)

- Run Lighthouse audits — target 90+ mobile (much easier without Three.js)
- Test all flows on iPhone and Android (Chrome, Safari)
- Test all flows on desktop (Chrome, Firefox, Edge)
- Test video intro on all browsers — verify autoplay works without audio
- Test canvas compositing with every part combination
- Accessibility audit: keyboard navigation, contrast ratios
- SEO: verify all meta tags, sitemap, robots.txt
- Performance: measure PNG loading times, optimize images under 200KB each
- Soft launch with 10-20 test users for feedback

---

## PART 12  —  DEPLOYMENT & DEVOPS  (UNCHANGED)

### 12.1  Vercel Deployment

- Connect GitHub repository to Vercel at vercel.com
- Set all environment variables in Vercel Dashboard > Settings > Environment Variables
- Configure custom domain: `beycraft.com` in Vercel Domains
- Update domain DNS A record to Vercel IP: `76.76.21.21`
- Enable Vercel Analytics for real-time performance monitoring
- Every push to the `main` branch auto-triggers a new deployment

### 12.2  Supabase Production Setup

- Upgrade Supabase project to Pro plan for production workloads ($25/month)
- Enable Point-in-Time Recovery — daily automatic backups
- Configure Storage bucket CORS policy to allow requests from your Vercel domain
- Set up Supabase Branching for a staging/preview environment (optional)

### 12.3  Monitoring

| **Concern** | **Tool & Action** |
| --- | --- |
| Error Tracking | Sentry — install `@sentry/nextjs`, configure DSN for production error alerts |
| Performance | Vercel Analytics built-in + Lighthouse CI on every PR |
| Uptime | UptimeRobot (free) — alerts via email if site goes down |
| Database | Supabase Dashboard metrics for query performance and storage usage |
| User Behavior | Vercel Analytics for page views, bounce rate, device breakdown |

---

## PART 13  —  POST-LAUNCH CHECKLIST  (UPDATED)

### 13.1  Pre-Launch Final Checks

- Test video intro: opens homepage → video plays fullscreen → fades out → homepage reveals
- Test intro skip button: clicking Skip immediately triggers fade-out
- Test sessionStorage: intro plays on first visit, skips on page navigation within session
- Test intro on iPhone Safari and Android Chrome (confirm muted autoplay works)
- Test complete customizer flow: load page → swap parts → both 2D canvases update live
- Test canvas compositing: all parts layer correctly in top-view and side-view
- Test save build: sign up → customize → save → appears in My Builds
- Test load build: open My Builds → Load → customizer and both canvases restore correctly
- Test all PNG images load from Supabase Storage (no 403/404 errors)
- Test auth flows: signup, login, forgot password, logout
- Verify `sitemap.xml` accessible at `/sitemap.xml`
- Submit sitemap to Google Search Console
- Check all pages load under 2 seconds on mobile (Lighthouse — 2D is faster than 3D was)
- Verify Supabase RLS policies: logged-out user cannot see other users' builds
- Test public gallery: only `is_public` builds appear
- Verify all admin routes redirect non-admin users to homepage

### 13.2  First 30 Days Post-Launch

- Monitor Supabase logs daily for errors and slow queries
- Check Sentry for any production errors from real users
- Monitor Vercel Analytics: bounce rate, most popular pages, device types
- Collect user feedback: add 3-5 new parts based on community requests
- Share on Beyblade community forums and Reddit (r/Beyblade)
- Encourage early users to make builds public — populate the gallery

### 13.3  Ongoing Maintenance

- **Weekly:** Add new part PNGs to catalog, check error logs, moderate public gallery
- **Monthly:** PNG file size audit, Lighthouse performance check, dependency updates
- **As needed:** New part types, seasonal special emblems, gallery features, spin animations on canvas

---

## QUICK REFERENCE  —  TOOLS, ACCOUNTS & ESTIMATED COSTS  (UPDATED)

### Setup Accounts Required

| **Service** | **URL & Purpose** | **Cost (Monthly)** |
| --- | --- | --- |
| Vercel | vercel.com — Frontend hosting, auto-deploy from GitHub | Free → ~$20 (Pro) |
| Supabase | supabase.com — Database + Auth + Storage for PNG files | Free → ~$25 (Pro) |
| GitHub | github.com — Source control, push to deploy pipeline | Free |
| Figma | figma.com — Create the 2D part PNG assets (top + side view) | Free |
| TinyPNG | tinypng.com — Compress PNG files before Supabase upload | Free |
| HandBrake | handbrake.fr — Convert intro video to WebM + MP4 formats | Free |
| Sentry | sentry.io — Error monitoring in production | Free → ~$26 |
| Domain Registrar | Namecheap / GoDaddy — Domain registration | ~$10-20/year |

### Estimated Monthly Tech Costs

- **Starting (building + testing):** $0 — fully on free tiers
- **Launched (low traffic):** ~$25-45/month (Supabase Pro + domain)
- **Growing (high traffic + storage):** ~$50-100/month

---

## — BEYCRAFT —

*Forge Your Legend. Customize Your Spin.*

Build with vision. Launch with confidence.

---

*BeyClaft  ·  Confidential Implementation Plan*
