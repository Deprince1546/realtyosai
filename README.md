# AI Real Estate Operator

Build the public marketing website for a premium enterprise SaaS called **RealtyOS**.



RealtyOS is an autonomous AI employee for the real estate industry. It is marketed as an AI that brokerages and realtors can hire to operate their business 24/7. Do not mention the underlying AI provider or technology anywhere in the UI.



========================================================

TECH STACK

========================================================



Use:



• React

• TypeScript

• Tailwind CSS

• Framer Motion

• Lucide React Icons



Typography



Display font:



"Ogg Medium"



Load from:



https://dcym8fthxf5uu.cloudfront.net/fonts/247a073c-29f5-4a89-aa3a-741020f346fc/OggText-Medium.woff2



Body font:



Inter



Component architecture.



Responsive design.



Dark mode only.



========================================================

DESIGN LANGUAGE

========================================================



This should feel like a $100M Silicon Valley AI startup.



The design language should combine the elegance of:



Apple



OpenAI



Linear



Arc Browser



Notion



Tesla



Avoid generic SaaS templates.



Everything should feel cinematic.



Minimal.



Luxurious.



Confident.



Modern.



Sophisticated.



The visitor should feel like they are visiting the headquarters of an AI company rather than a normal website.



========================================================

COLOR PALETTE

========================================================



Background



Near Black



Navy



White typography



Very subtle cyan accents



Heavy glassmorphism



Backdrop blur



Soft shadows



Premium gradients



High contrast



========================================================

HERO EXPERIENCE

========================================================



Use ONLY the uploaded video as the hero scene.



Do not generate replacement images.



Do not use stock footage.



Do not create AI artwork.



The uploaded video is the hero.



Keep the architecture visible throughout the experience.



Apply a cinematic dark overlay between 50% and 70%.



The UI floats above the cinematic scene using premium glass panels.



========================================================

SCROLL-SCRUBBED CINEMATIC EXPERIENCE

========================================================



Do NOT implement traditional video playback.



The uploaded scene behaves like a cinematic timeline.



The visitor controls the camera movement with scrolling.



At page load:



The scene begins on the first frame.



As the user scrolls down:



the timeline advances smoothly.



The camera slowly flies toward the architecture.



Continues through the entrance.



Moves into the interior.



Reveals additional spaces naturally.



Scrolling upward reverses the timeline.



The movement must feel physically weighted.



Never jump.



Never stutter.



Never skip frames.



Use requestAnimationFrame with interpolation.



Use easing.



Use momentum.



Use lerp.



Use spring damping.



Map scroll progress directly to timeline progress.



When reaching the final frame:



Freeze naturally.



Do not loop while idle.



Desktop:



Mouse wheel controls progression.



Laptop:



Trackpad gestures control progression.



Mobile:



Vertical swipe controls progression.



Maintain 60fps.



Use passive scroll listeners.



GPU transforms.



translate3d()



will-change



Intersection Observer where appropriate.



========================================================

PARALLAX

========================================================



The cinematic scene never moves independently.



Only foreground interface elements respond to pointer movement.



Mouse movement should create depth.



Headline



4–6px



Navigation



4px



Buttons



2–3px



Glass cards



10px



Everything moves independently.



Never perfectly together.



========================================================

NAVIGATION

========================================================



Single page only.



No route changes.



No page refreshes.



No multiple pages.



The entire experience lives inside one immersive environment.



Top Navigation



Center



RealtyOS logo



Use a clean minimalist logo.



No oversized branding.



Left



Hamburger Menu



Right



Hire RealtyOS



Start Free



Navigation floats over the hero using glassmorphism.



Rounded corners.



Soft blur.



Thin borders.



========================================================

HAMBURGER MENU

========================================================



Clicking the hamburger opens a premium slide-out navigation drawer from the left.



Dark glass panel.



Blur background.



Smooth animation.



The hero scene always remains visible.



The drawer contains expandable accordion sections.



No separate pages.



Menu



Home



About



Features



Solutions



How It Works



Dashboard



Integrations



Pricing



Customers



Enterprise



Developers



API



Documentation



Security



FAQ



Contact



Clicking any menu expands rich content inside the drawer.



The visitor never leaves the hero experience.



========================================================

LOGO PLACEMENT

========================================================



Place the RealtyOS logo centered in the navigation exactly like Apple's website.



Minimal.



Elegant.



Monochrome.



========================================================

HERO CONTENT

========================================================



Large Display Heading



RealtyOS



Subheading



The AI Operating System for Modern Real Estate.



Supporting Copy



Hire one AI employee that captures leads, qualifies buyers, books showings, manages transactions, updates CRMs, follows up automatically, and keeps your brokerage running every day.



Primary Button



Hire RealtyOS



Secondary Button



Start Free



Do not include:



Powered by...



Book Demo



Watch Demo



Watch AI



========================================================

WORKFLOW

========================================================



Below the CTA buttons display a continuously animated workflow.



Lead



↓



Qualification



↓



Property Search



↓



Showing



↓



CRM



↓



Transaction



↓



Closing



Use elegant animated connectors.



Glass badges.



Subtle glowing indicators.



========================================================

MICRO INTERACTIONS

========================================================



Everything should feel alive.



Buttons gently elevate.



Glass panels shimmer.



Navigation fades.



Text reveals smoothly.



Icons animate softly.



Cards float slightly.



Hover states should feel premium.



========================================================

TYPOGRAPHY

========================================================



Huge hero headline.



Very generous spacing.



Minimal copy.



Readable hierarchy.



Elegant white typography.



Avoid clutter.



========================================================

RESPONSIVENESS

========================================================



Desktop



Large cinematic experience.



Tablet



Adaptive layout.



Mobile



Maintain cinematic storytelling.



Navigation becomes full-screen drawer.



Timeline remains scroll controlled.



========================================================

PERFORMANCE

========================================================



Prioritize smoothness.



No heavy animation libraries except Framer Motion.



GPU acceleration.



Lazy loading.



Optimized rendering.



Maintain approximately 60fps.



========================================================

FINAL EXPERIENCE

========================================================



The visitor should feel like they are hiring an autonomous AI employee—not buying software.



The homepage should feel closer to an Apple product launch than a traditional SaaS landing page.



The first impression should communicate luxury, intelligence, trust, and enterprise capability.



Every animation, transition, interaction, and layout decision should reinforce the idea that RealtyOS is the future operating system for modern real estate businesses.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cf9a113a-75ee-4025-a9b2-91afdfdcca28).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
