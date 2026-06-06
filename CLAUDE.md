# CLAUDE.md

# Core Behavior

- Follow explicit user instructions first.
- Preserve existing architecture, conventions, and project structure.
- Minimize scope of changes.
- Prefer simple, maintainable implementations.
- Avoid assumptions.
- State uncertainty clearly when confidence is low.

---

# Instruction Priority

When instructions conflict, follow this order:

1. Explicit user instructions
2. Safety and irreversible action constraints
3. Preserve existing work and architecture
4. Minimize scope of changes
5. Simplicity and maintainability
6. Performance and optimization

---

# Environment

## Node Environment

- Node.js 22
- pnpm preferred
- Next.js App Router
- Turbopack enabled when applicable

## Python Environment

- Python 3.12
- venv or uv depending on project
- Django projects typically use DRF
- Celery + Redis for async/background jobs

## Database

- PostgreSQL primary database
- Prisma ORM for Next.js projects
- Django ORM for backend services
- Supabase used in selected projects

## Infrastructure

- Ubuntu VPS
- Nginx
- Gunicorn
- systemd
- DigitalOcean
- Cloudflare
- Vercel

## Frontend Conventions

- Tailwind CSS
- shadcn/ui
- React Hook Form
- Server Actions preferred when appropriate
- next-intl for localization where applicable

## Backend Conventions

- DRF serializers/views should follow existing patterns
- Reuse existing services/utilities before creating new abstractions
- Avoid introducing unnecessary architecture layers

---

# Active Projects

## Ortholand Invoice Management System

### Stack

- Django
- Django REST Framework
- Celery
- Redis
- PostgreSQL
- WeasyPrint,
- HTMX,
- Alpine js
- Native Javascript,

### Features

- invoice management
- AADE myDATA integration
- PDF generation
- async processing

### Infrastructure

- Ubuntu VPS
- Gunicorn
- Nginx

### Constraints

- production financial data
- avoid risky schema changes
- background jobs handled via Celery

---

## Finn Ireland Digital Treatment

### Stack

- Next.js 16
- Prisma
- Clerk
- Supabase

### Deployment

- Vercel

### Constraints

- multi-role authentication
- onboarding flows
- server/client boundary accuracy

---

## Spotteq Eshop

### Stack

- Next.js 16 App Router
- Sanity v5 (CMS + content model)
- Stripe (Payment Intents, webhooks)
- next-intl (el/en, locale prefix routing)
- Zustand (cart state, localStorage persistence)
- React Hook Form + Zod (form validation)
- Tailwind CSS v4
- shadcn/ui

### Deployment

- Vercel

### Constraints

- Checkout supports both guest and authenticated users
- Authentication not yet implemented — planned (likely Clerk)
- Products and bundles both purchasable; inventory tracked per product
- Coupon system is email-tied with max-uses and auto-deactivation
- Shipping methods managed in Sanity (not hardcoded)
- Locale-aware slugs: slugs.el.current / slugs.en.current
- backendClient (write token) must never be imported in client components
- server/client boundary accuracy

### Checkout Implementation Status

- Stripe packages installed: stripe, @stripe/react-stripe-js, @stripe/stripe-js
- lib/stripe.js — server-only Stripe singleton
- app/api/create-payment-intent/route.js — fetches server-side prices, creates Sanity order + Stripe PI
- app/api/webhook/stripe/route.js — marks order paid, decrements inventory, records coupon usage
- Remaining: StripePaymentWrapper, PaymentForm, checkout-form rewrite, success page

---


## FreshGuard

### Stack

- Django backend
- Next.js frontend
- PostgreSQL

### Domain

- stock management SaaS
- Greek food businesses

### Key Concerns

- inventory accuracy
- reporting performance
- multi-business data isolation

---

## Plano Orthodontics

### Stack

- Next.js 15
- Sanity CMS

### Constraints

- SEO-sensitive pages
- CMS schema consistency
- performance-focused frontend

---

## Other Client Projects

Mostly:
- dental
- orthodontic
- booking
- management systems

If multiple projects may apply:
- ask which project is in scope before proceeding

---

# Communication Rules

## Response Style

- Start directly with the answer or action.
- No filler language.
- No motivational phrasing.
- No unnecessary apologies.
- No exaggerated certainty.
- Match response depth to task complexity.

Avoid:
- “Great question”
- “Absolutely”
- “Of course”
- “Happy to help”

---

## Uncertainty Handling

If uncertain:
- say so clearly
- explain what is uncertain
- avoid presenting guesses as facts

Examples:
- "I'm not certain about this."
- "This depends on..."
- "I need confirmation before proceeding."

---

## Assumptions

Never silently assume:
- requirements
- deployment intent
- database changes
- architecture decisions
- production impact

Ask targeted clarification questions instead.

---

## Language

- Respond in the same language as the user.
- Code comments in English unless instructed otherwise.

---

# Execution Modes

## DISCUSS MODE

Use when:
- requirements are unclear
- architecture decisions are involved
- evaluating tradeoffs

Behavior:
- analyze
- provide approaches
- explain tradeoffs
- do not implement yet

---

## IMPLEMENT MODE

Use when:
- requirements are clear
- user approved the direction

Behavior:
- execute requested work
- stay strictly in scope
- avoid unrelated edits

---

## REVIEW MODE

Use when:
- reviewing code
- debugging systems
- auditing architecture
- analyzing performance

Behavior:
- identify issues and risks
- explain findings
- avoid unnecessary rewrites

---

# Workflow Rules

## Significant Tasks

Before significant work:
- provide 2–3 approaches
- explain tradeoffs briefly
- wait for confirmation

Significant tasks include:
- architecture changes
- refactors
- database schema changes
- major rewrites
- production-impacting work

Skip this for:
- isolated fixes
- small edits
- direct answers

---

## Scope Control

Only modify:
- files directly related to the task
- logic required for the task
- components/functions in scope

Do NOT:
- refactor unrelated code
- rename unrelated variables
- reorganize unrelated imports
- globally reformat files
- rewrite unrelated sections

Mention unrelated issues separately without modifying them.

---

## Codebase Consistency

Before implementing:
- inspect surrounding patterns
- follow existing architecture
- reuse existing utilities/components
- maintain existing conventions

Avoid:
- introducing parallel abstractions
- inconsistent patterns
- unnecessary architecture changes

Prefer consistency over personal preference.

---

# Development Rules

## Simplest Solution First

Prefer:
- straightforward logic
- maintainable code
- low abstraction
- minimal implementations

Avoid:
- premature optimization
- speculative abstractions
- unnecessary dependencies
- overengineering

---

## Stack Alignment

Default to the existing stack and conventions.

Do not introduce:
- new frameworks
- major tooling changes
- architectural rewrites

unless:
- explicitly requested
- technically necessary

If something appears problematic:
- explain concerns briefly
- still follow existing patterns unless instructed otherwise

---

## Destructive Changes

Before destructive actions:
- explain exact impact
- list affected resources
- explain rollback considerations
- wait for confirmation

Examples:
- deleting files
- dropping tables
- overwriting large sections
- force pushes
- production deployments

---

# Safety Rules

## External Actions Require Confirmation

Never perform without explicit confirmation:
- deployments
- migrations
- production modifications
- API calls
- publishing content
- sending emails/messages

Intent is not permission.

---

## Low Confidence Policy

If confidence is below ~80%:
- state uncertainty
- avoid irreversible actions
- prefer safer/minimal approaches
- ask clarification questions when necessary

---

# Memory & Documentation

Only maintain memory/project tracking files if:
- they already exist
- the user explicitly requests them

Possible files:
- MEMORY.md
- ERRORS.md

---

## MEMORY.md

Track:
- major decisions
- architecture constraints
- rejected approaches
- ongoing work

---

## ERRORS.md

Track:
- repeated failures
- root causes
- successful fixes
- lessons learned

---

# Completion Format

After coding tasks include:

## Files Changed

- path/file.ext — short description

---

## Files Not Touched

- important untouched areas

---

## Follow-Up Needed

- testing
- pending risks
- remaining work
- unresolved decisions

---