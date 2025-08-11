Design a modern, beautiful, and versatile **ReactJS UI/UX** for a website project named **"Diamond Valuation System"** — a platform for diamond price estimation and management, catering to both customers and internal staff, with strong e-commerce elements. The website should include all common and advanced e-commerce features, customized for the diamond industry.

### Actors:
- Guest (unregistered visitor)
- Customer (registered user)
- Consulting Staff
- Valuation Staff
- Manager
- Admin

---

## Main Features & Pages:

1. **Homepage**  
   - Stunning hero section with luxury diamond imagery.
   - Company introduction, mission, services.
   - Highlight diamond knowledge base, price estimation tool, blog, FAQs.
   - Search bar for quick diamond info lookup.

2. **Diamond Knowledge Base**  
   - Articles, guides, videos about diamonds, buying tips, maintenance.
   - Tag/category navigation, featured posts.

3. **Diamond Valuation Estimation Tool**  
   - Step-by-step form for users to estimate diamond value using:
     - Origin, Shape & Cut, Measurements, Carat weight, Color, Clarity, Cut, Proportions, Polish, Symmetry, Fluorescence.
   - Real-time calculation and dynamic visual feedback.
   - Option to input a Diamond Certification Number to auto-fetch details.
   - "Get official valuation" CTA.

4. **Valuation Request Process Tracking**  
   - Customer dashboard to submit, view, and track valuation requests.
   - Timeline UI:  
     1. Submit valuation request  
     2. Consulting staff contacts customer  
     3. Staff receives sample and issues receipt  
     4. Valuation staff performs appraisal  
     5. Result sent back to customer
   - Downloadable/printable valuation certificate.

5. **Admin & Staff Dashboards**  
   - List and manage all valuation requests (status, assignment, notifications).
   - Create/approve seal reports if customers do not collect results.
   - Generate commitment forms if receipts are lost (approval workflow).
   - Price list & turnaround time management for each service type.
   - CRUD for diamond attribute catalogs, sync pricing data from jewelry platforms.

6. **E-commerce Features**  
   - Product listing/grid for diamonds/jewelry (filter, sort, compare).
   - Product detail page (images, 360 viewer, specs, price, availability).
   - Shopping cart, checkout, order history (for jewelry sales, if included).
   - Integration of payment methods (mock UI).
   - User authentication, profile & address management.
   - Blog and content marketing sections.

7. **Statistics Dashboard**  
   - Interactive dashboard with charts:  
     - Number of valuation requests, completed jobs, sales, customer ratings, revenue, turnaround time analytics, etc.

8. **General UI/UX Requirements**  
   - Clean, modern, luxury, and trustworthy aesthetic (white, silver, navy blue, gold accents).
   - Responsive and mobile-first design.
   - Accessible (a11y), with clear call-to-action buttons.
- Sidebar and top navigation depending on role.
   - Notification system (status changes, approvals, reminders).
   - Multilingual support (EN/VI).

---

## Technology & Code Structure:

- ReactJS (preferably with modern hooks, context, or Redux for state management)
- Component-based structure (e.g. /components, /pages, /layouts)
- Use TailwindCSS or Material UI for rapid, elegant design.
- Use dummy/mock data and placeholder images where appropriate.
- Separate UI for each Actor with role-based access (routing & conditional rendering).

---

## Generate sample code and design ideas for:

- HomePage with hero section and diamond knowledge teasers.
- Diamond Valuation Estimation Form (multi-step, with dynamic calculation).
- Customer dashboard for tracking requests.
- Admin dashboard with status management and analytics.
- E-commerce product grid and diamond detail modal.
- Beautiful sidebar navigation and responsive top bar.

---

## Output:

- Provide ReactJS code samples for main components/pages.
- Suggest folder/file structure for scalability.
- Give sample data for diamonds, users, valuation requests.
- Include modern, luxury, and intuitive UI elements.
- All text in English (or bilingual EN/VI where needed).

