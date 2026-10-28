# Ubiquitous Language

The vocabulary for talking about CampusCircle: who participates, how items are bought and rented, how lost and found incidents are reported, how the auto-matching engine pairs counterpart items, and how claims are resolved. One term per concept; the aliases column lists words to stop using for that concept.

---

## People and Roles

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Student (User)** | An authenticated university member identified by an institutional email, possessing a profile with campus affiliation, student ID, and contact details | Account, member account, client, person, profile |
| **Seller** | A student who creates and manages one or more marketplace listings to sell or rent campus items | Vendor, merchant, lister, provider, poster |
| **Buyer / Inquirer** | A student interested in purchasing or renting a listed item, initiating communication through the item's contact modal | Customer, shopper, client, consumer, renter |
| **Reporter** | An authenticated student who submits an incident report for an item they either lost or found on campus | Creator, author, ticket creator, logger, poster |
| **Finder** | The specific reporter of a found item report who discovered the property and holds custody or turned it in | Discoverer, holder, custodian |
| **Owner** | The student who misplaced an item and submits a lost item report, seeking to prove ownership and reclaim it | Loser, seeker, claimant, victim |
| **Claimant** | An owner asserting a rightful claim over a counterpart found item during match verification | Requester, applicant, pretender |
| **Administrator** | A privileged platform user with system-wide authority to inspect, update, or resolve any listing or incident report | Superuser, root, operator, moderator |
| **Campus** | The collegiate institutional setting (e.g., Northwood University) scoping all student activity, meetup zones, and building locations | University, college, tenant, zone, environment |

---

## Authentication and Credentials

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **JWT** | The signed JSON Web Token issued upon registration or login, passed in the `Authorization: Bearer <token>` header to authenticate requests | Session token, bearer cookie, auth key, access token |
| **Student ID** | The university-issued institutional alphanumeric identifier (e.g., `NW-2024-819`) validating academic standing | Matriculation number, roll number, badge number, campus ID |
| **Demo Student** | A pre-seeded student account (Alex Rivera, Maya Chen, Jordan Taylor) provided with one-click login for demonstration and testing | Mock user, test dummy, fake student, sandbox persona |
| **Hashed Password** | The one-way salted bcrypt digest stored in the database; plaintext passwords are never retained or queried | Encrypted password, secret key, passkey |

---

## Campus Marketplace

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Marketplace Listing** | A published offering created by a seller representing a tangible item available for purchase or rental | Post, ad, product, item, entry, ticket |
| **Listing Type** | The transaction model of a marketplace listing, strictly either `buy` or `rent` | Mode, deal type, sale kind, transaction category |
| **Flat Purchase (`buy`)** | A marketplace listing model where ownership is permanently transferred in exchange for a one-off payment | Buy-out, sale, one-time buy, purchase |
| **Campus Rental (`rent`)** | A marketplace listing model where an item is loaned for an agreed duration, often secured by a refundable deposit | Lease, loan, borrow, hire, temporary rent |
| **Rental Period** | The standardized loan interval for a rental listing: `per day`, `per week`, `per month`, or `per semester` | Duration, term, lease window, tenure |
| **Security Deposit** | A refundable monetary amount required for a rental listing, held to cover potential loss or damage | Bond, pledge, caution deposit, advance |
| **Item Condition** | The physical wear status of a listed item: `Brand New`, `Like New`, `Gently Used`, or `Acceptable` | Quality, grade, state |
| **Meetup Location** | The designated safe on-campus physical landmark (e.g., "Student Union Quad", "Science Library") agreed upon for handoffs | Pick-up point, address, place, exchange venue |
| **Preferred Contact Method** | The communication channel chosen by a seller: `Campus Meetup`, `WhatsApp`, `Email`, or `Call` | Delivery channel, contact mode, reach-out |
| **Listing Status** | The operational availability of a marketplace listing: `active`, `reserved`, `rented`, or `sold` | Item state, inventory flag, condition |

---

## Lost and Found Incident Reports

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Report (Incident Report)** | An asynchronous record logged into the system detailing a lost or found physical property on campus | Ticket, submission, post, log, ad |
| **Lost Item Report** | An incident report of type `lost` submitted by a student seeking their misplaced property | Lost ticket, missing ad, loss claim |
| **Found Item Report** | An incident report of type `found` submitted by a finder documenting property recovered on campus | Found ticket, recovery ad, found log |
| **Incident Location** | The building, room, or campus landmark where the property was lost or recovered (e.g., "Main Campus Library 2nd Floor") | Spot, place, address, zone |
| **Date Occurred** | The timestamp indicating when the property was lost or found, used for temporal proximity evaluation | Event date, loss date, incident timestamp, report time |
| **Identifying Marks** | Unique distinctive indicators (e.g., engraved initials, blue NASA stickers, scratches, case color) used to verify authentic ownership | Clues, features, specs, secrets, details |
| **Tags** | Searchable descriptor keywords attached to a report, either supplied manually or automatically derived via tokenization | Labels, categories, hashtags, tokens |
| **Report Status** | The lifecycle state of an incident report: `open`, `matched`, or `resolved` | Ticket state, progress, phase |
| **Counterpart Item** | An incident report of the complementary type (`lost` for a `found` item, or `found` for a `lost` item) evaluated for potential matching | Opposite item, complementary ticket, target pair |

---

## Auto-Matcher and Scoring Engine

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Auto-Matcher** | The algorithmic heuristic scoring engine that compares an item against active counterpart reports to find matches | Recommender, search engine, AI bot, matchmaker |
| **Candidate Pair** | A pair consisting of one target report and one candidate counterpart report being evaluated by the scoring engine | Evaluation set, item pair, match pair |
| **Match Score** | A normalized integer score from 0 to 100 representing the calculated probability that two reports describe the identical physical item | Similarity index, rating, confidence score, percentage |
| **Confidence Level** | The qualitative grade assigned to a match score: `high` (score ≥ 70), `medium` (score 45–69), or `low` (score < 45) | Quality tier, certainty rank, match grade |
| **Category Weight** | The taxonomy component awarding up to 35 points for identical categories (35 pts) or hierarchically related categories (20–22 pts) | Hierarchy score, taxonomy points |
| **Textual & NLP Overlap** | The text analysis component awarding up to 35 points based on normalized keyword stem intersections across titles, descriptions, and tags | Lexical match, string similarity, semantic score |
| **Brand Token** | A curated high-salience manufacturer or model term (e.g., `apple`, `airpods`, `hydro`, `flask`, `ti-84`, `yeti`) that awards a +6 point bonus | Brand tag, trademark token, device keyword |
| **Color Token** | A recognized color term (e.g., `navy`, `matte`, `silver`, `rose`) that awards a +4 point bonus upon mutual intersection | Hue tag, appearance keyword |
| **Location Proximity** | The spatial component awarding up to 20 points based on shared building and zone tokens in the incident location strings | Distance score, geo score, zone proximity |
| **Temporal Closeness** | The recency component awarding up to 10 points based on the absolute calendar day delta between reports (≤ 3 days = 10 pts, ≤ 7 days = 7 pts, ≤ 14 days = 4 pts) | Date delta, recency bonus, time decay |
| **Tokenization** | The process of lowercasing, stripping punctuation, filtering stop words, and splitting hyphenated variations into cleaned keyword sets | Parsing, text cleaning, stemming |
| **Explainable Match Reasons** | The human-readable list of justifications generated by the scoring engine explaining why a candidate pair matched | Rationale, audit trail, scoring factors, match proof |

---

## Claim Verification and Resolution

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Match Confirmation** | The user action of selecting an auto-matched counterpart item and submitting a resolution request | Linking, binding, pairing, claim acceptance |
| **Proof of Ownership** | The inspection process where a claimant verifies specific identifying marks, unlocks a device, or confirms contents before physical handoff | Claim verification, identity check, receipt proof |
| **Matched Reference (`matchedWith`)** | The reciprocal database foreign key permanently linking a resolved lost report to its corresponding found report | Paired ID, link key, partner ticket |
| **Resolution Timestamp (`resolvedAt`)** | The exact date and time an incident report was transitioned to `resolved` | Closed date, end time, settlement stamp |
| **Resolved Report** | An incident report whose status is `resolved`, removing it from candidate pools and archiving it in the resolution history | Closed ticket, archived report, completed item |

---

## System and Architecture

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Control API** | The Express.js application serving authenticated and public REST endpoints under the `/api` route prefix | Backend, server, core, service engine |
| **In-Memory Fallback** | The transient embedded MongoDB instance initialized via `mongodb-memory-server` when no remote MongoDB URI is provided | Mock database, fake DB, local storage |
| **Seed Runner** | The database seeding script (`seedRunner.js`) that populates verified demo users, marketplace listings, and instant-match lost/found pairs | Data loader, fixture populator, init script |
| **Client Portal** | The single-page React and Vite web application delivering the responsive student user interface | Frontend, UI, web app, dashboard |
| **Reverse Proxy** | The development Vite server proxy routing client requests from `/api` to the backend server running on port 5001 | Gateway, tunnel, forwarder |

---

## Relationships

- A **Student** registers with a unique institutional email, sets a **Hashed Password**, and belongs to exactly one **Campus**.
- A **Student** receives a **JWT** upon login, which authorizes subsequent operations across the **Control API**.
- A **Student** can act as a **Seller** by publishing zero or more **Marketplace Listings**.
- A **Marketplace Listing** has exactly one **Seller**, belongs to one **Category**, and declares exactly one **Listing Type** (`buy` or `rent`).
- A **Marketplace Listing** of type `rent` must specify a **Rental Period** (e.g., `per semester`) and an optional refundable **Security Deposit**.
- A **Marketplace Listing** begins in status `active` and transitions to `reserved`, `rented`, or `sold`.
- A **Student** can act as a **Reporter** by submitting zero or more **Reports** (`lost` or `found`).
- A **Report** has exactly one **Reporter**, specifies one **Incident Location**, records a **Date Occurred**, and maintains a **Report Status** (`open`, `matched`, or `resolved`).
- The **Auto-Matcher** evaluates a target **Report** only against active **Counterpart Items** of the opposite type (`lost` evaluates `found`, `found` evaluates `lost`); it never matches items of identical type.
- A **Candidate Pair** generates a composite **Match Score** (0–100) combining **Category Weight** (max 35), **Textual & NLP Overlap** (max 35), **Location Proximity** (max 20), and **Temporal Closeness** (max 10).
- A **Match Score** maps directly to a **Confidence Level**: `high` (≥ 70), `medium` (45–69), or `low` (< 45).
- Upon **Match Confirmation**, both the target **Report** and its counterpart have their **Report Status** updated to `resolved`, set reciprocal `matchedWith` references, and record a **Resolution Timestamp**.
- A **Resolved Report** is excluded from future **Auto-Matcher** candidate queries.

---

## Example Dialogue

> **Dev:** "A student reported losing their calculator in the library. When they open their dashboard, why does the match list show a calculator found two days ago in the science hall instead of calculators lost by others in the library?"

> **Domain Expert:** "Because the **Auto-Matcher** only evaluates **Counterpart Items**. A **Lost Item Report** only pairs with a **Found Item Report**, never with another lost report. Two students who both lost calculators share an incident type, not a custody match."

> **Dev:** "Why did that pair get a **Confidence Level** of `medium` (55%) if the location strings didn't match?"

> **Domain Expert:** "The scoring engine computes four distinct components. They had an **Identical Category** (`Calculators`, 35 points), **Temporal Closeness** within 3 days (10 points), and a **Brand Token** overlap (`ti-84`, 10 points), totaling 55 points even with zero **Location Proximity** points."

> **Dev:** "When a finder hands the item over, can the buyer click buy in the marketplace to close it?"

> **Domain Expert:** "Stop mixing domains. A student in the lost-and-found system is an **Owner** or **Finder**, not a buyer. They execute a **Match Confirmation** on the **Report**, transitioning its **Report Status** to `resolved` and setting `matchedWith`. The marketplace domain is strictly for **Marketplace Listings** involving a **Seller** and **Buyer**."

> **Dev:** "Can a seller list a graphing calculator for rent without specifying a rental duration?"

> **Domain Expert:** "No. Every **Campus Rental** (`rent`) requires a defined **Rental Period** (such as `per semester`), whereas a **Flat Purchase** (`buy`) defaults to a permanent sale without a recurring period or **Security Deposit**."

---

## Flagged Ambiguities

- **"Item"** — Overloaded term across domains. In the marketplace, refer strictly to a **Marketplace Listing**. In the recovery portal, refer strictly to a **Report** (**Lost Item Report** or **Found Item Report**). Never write code or documentation that treats a marketplace listing as a lost-and-found item.
- **"Token"** — Refers to two completely different technical mechanisms. A security **JWT** is an authentication credential passed in HTTP request headers. An NLP **Token** is a parsed, sanitized keyword extracted from textual descriptions by the **Auto-Matcher**.
- **"User" vs "Seller" vs "Reporter"** — A **User (Student)** is the underlying authenticated identity. Use **Seller** when discussing marketplace transactions, **Reporter** when discussing lost/found submissions, **Finder** for custodial discovery, and **Claimant** during verification.
- **"Status"** — A listing has a **Listing Status** (`active`, `reserved`, `rented`, `sold`). A report has a **Report Status** (`open`, `matched`, `resolved`). Always qualify which domain lifecycle is being referenced.
- **"Location"** — Distinguish between the student's institutional **Campus** (e.g., Northwood University), a seller's **Meetup Location** (e.g., Student Union Quad), and an incident's **Incident Location** (e.g., Library 2nd Floor Printer Station).
- **"Price" vs "Deposit"** — In a **Campus Rental**, the `price` represents the fee for the agreed **Rental Period**, while the `deposit` is the refundable **Security Deposit** returned when the item is returned undamaged.
- **"Date"** — Avoid using bare "date". Use `dateOccurred` for the physical event time, `createdAt` for system submission time, and `resolvedAt` for the **Resolution Timestamp**.
- **"Score" vs "Confidence"** — The **Match Score** is the quantitative numerical result (0–100), whereas the **Confidence Level** is the qualitative band (`high`, `medium`, `low`) presented in the student interface.
- **"Match"** — Can mean the calculated similarity (**Match Score**), the candidate record (**Counterpart Item**), or the completed resolution state (**Match Confirmation**). Use the exact term.
- **"Buy" vs "Rent"** — These represent distinct **Listing Types** with different database schemas, pricing mechanics, and operational assumptions.

