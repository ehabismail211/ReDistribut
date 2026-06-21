import { ArrowRight, Bell, Boxes, Building2, ClipboardCheck, Filter, Handshake, MapPin, PackagePlus, Search, ShieldCheck } from "lucide-react";

const listings = [
  {
    title: "Prepared chicken meals",
    category: "Food and beverage",
    offer: "Free",
    city: "Dubai Marina",
    quantity: "120 meals",
    urgency: "2 days left",
    tone: "food",
    description: "Freshly prepared and packed. Collection available this afternoon.",
  },
  {
    title: "Double-wall cardboard boxes",
    category: "Packaging",
    offer: "AED 1.25 each",
    city: "Sharjah",
    quantity: "850 boxes",
    urgency: "Excess stock",
    tone: "packaging",
    description: "Unused shipping boxes in three practical warehouse sizes.",
  },
  {
    title: "Ergonomic office chairs",
    category: "Furniture",
    offer: "Exchange",
    city: "Abu Dhabi",
    quantity: "18 chairs",
    urgency: "Slow moving",
    tone: "furniture",
    description: "Good condition. Exchange preferred for storage shelving.",
  },
];

const workflow = [
  { icon: PackagePlus, title: "Publish inventory", text: "Create a listing with category, condition, reason, quantity, expiry, photos, and handover details." },
  { icon: Search, title: "Discover and filter", text: "Find stock by category, location, urgency, offer type, group, or saved search." },
  { icon: ClipboardCheck, title: "Request quantity", text: "Request only the amount needed. ReDist keeps the owner and requester aligned." },
  { icon: Handshake, title: "Reserve and hand over", text: "Owners accept, reserve quantity transactionally, and both sides confirm completion." },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="ReDist home">
          <span className="proto-mark" aria-hidden="true">RD</span>
          <strong>ReDist</strong>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#discover">Discover</a>
          <a href="#workflow">Workflow</a>
          <a href="#platform">Platform</a>
        </nav>
        <div className="header-actions">
          <a className="button secondary" href="/api/v1/categories">API</a>
          <a className="button primary" href="/app">
            <PackagePlus size={18} />
            List item
          </a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <span className="eyebrow">Circular inventory exchange</span>
          <h1>Redistribute surplus before it becomes waste.</h1>
          <p>
            ReDist helps businesses, charities, and approved organizations move excess, near-expiry, and slow-moving inventory through free offers, sales, and exchanges.
          </p>
          <form className="search-panel">
            <label>
              <span>Search inventory</span>
              <input type="search" placeholder="Food, packaging, office chairs..." />
            </label>
            <label>
              <span>Location</span>
              <select defaultValue="AE">
                <option value="AE">United Arab Emirates</option>
                <option value="all">All launch markets</option>
              </select>
            </label>
            <button className="button primary" type="button">
              <Search size={18} />
              Search
            </button>
          </form>
          <div className="hero-stats">
            <div><strong>41 t</strong><span>waste avoided target</span></div>
            <div><strong>AED 318k</strong><span>recoverable value model</span></div>
            <div><strong>7-step</strong><span>controlled handover</span></div>
          </div>
        </div>
        <aside className="opportunity-panel" aria-label="Featured opportunity">
          <div className="panel-top">
            <span>Live opportunity</span>
            <strong>Expires soon</strong>
          </div>
          <div className="panel-number">
            <span>Food and beverage</span>
            <strong>120</strong>
            <span>prepared meals available</span>
          </div>
          <div className="panel-bottom">
            <MapPin size={18} />
            <span>Pickup in Dubai Marina</span>
            <ArrowRight size={18} />
          </div>
        </aside>
      </section>

      <section className="section" id="discover">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Available now</span>
            <h2>Useful stock, ready to move</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Filter listings">
            <Filter size={20} />
          </button>
        </div>
        <div className="listing-grid">
          {listings.map((listing) => (
            <article className="listing-card" key={listing.title}>
              <div className={`listing-visual ${listing.tone}`}>
                <span>{listing.urgency}</span>
              </div>
              <div className="listing-body">
                <div className="listing-meta">
                  <span>{listing.offer}</span>
                  <span>{listing.city}</span>
                </div>
                <h3>{listing.title}</h3>
                <p>{listing.description}</p>
                <div className="quantity-row">
                  <strong>{listing.quantity}</strong>
                  <span>{listing.category}</span>
                </div>
                <button className="card-action" type="button">
                  View and request
                  <ArrowRight size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="band" id="workflow">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Accountable by design</span>
            <h2>From excess to confirmed handover</h2>
          </div>
        </div>
        <div className="workflow-grid">
          {workflow.map((step) => (
            <article key={step.title}>
              <step.icon size={26} />
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section platform-section" id="platform">
        <div>
          <span className="eyebrow">Production foundation</span>
          <h2>Built for web now, apps next</h2>
          <p>
            The first build uses Next.js, Supabase Auth, PostgreSQL Row Level Security, transactional reservation functions, private storage, and a versioned API surface under <code>/api/v1</code>.
          </p>
        </div>
        <div className="platform-list">
          <div><ShieldCheck size={22} /><span>Restricted categories disabled until compliance is ready</span></div>
          <div><Building2 size={22} /><span>Organizations, members, listings, requests, and audit events</span></div>
          <div><Bell size={22} /><span>Groups, saved searches, notifications, and messaging planned in schema</span></div>
          <div><Boxes size={22} /><span>Same domain model can power Expo mobile apps later</span></div>
        </div>
      </section>
    </main>
  );
}
