import { useState, useEffect, useRef } from "react";

// ─── EMAILJS CONFIG ───────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID       = "service_e4gi90r";          
const EMAILJS_PUBLIC_KEY       = "cqWBlZliX0aLNQQDB";        
const EMAILJS_BOOKING_TEMPLATE = "template_r4zfcvr"; 
const EMAILJS_CONTACT_TEMPLATE = "template_poipe2s"; 

// Helper: sends email via EmailJS REST API (no npm package needed)
async function sendEmail(templateId, templateParams) {
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id:  EMAILJS_SERVICE_ID,
      template_id: templateId,
      user_id:     EMAILJS_PUBLIC_KEY,
      template_params: templateParams,
    }),
  });
  if (!res.ok) throw new Error("EmailJS failed: " + res.status);
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const ROOMS = [
  {
    id: 1, name: "Himalayan Suite", type: "Suite", price: 3500,
    available: true, maxGuests: 3,
    description: "Wake up to breathtaking Kedarnath peaks. Spacious suite with panoramic mountain views, premium bedding, and a private sit-out.",
    amenities: ["Mountain View", "WiFi", "Hot Water", "Heater", "Attached Bath", "Room Service"],
    images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
             "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&q=80"],
    badge: "Most Popular"
  },
  {
    id: 2, name: "Valley Retreat", type: "Deluxe", price: 2200,
    available: true, maxGuests: 2,
    description: "Cozy deluxe room overlooking the lush Mandakini valley. Perfect for couples seeking peace and warmth.",
    amenities: ["Valley View", "WiFi", "Hot Water", "Heater", "Attached Bath"],
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
             "https://images.unsplash.com/photo-1601701119533-fde78d20f76c?w=800&q=80"],
    badge: null
  },
  {
    id: 3, name: "Pilgrim's Nest", type: "Standard", price: 1400,
    available: true, maxGuests: 2,
    description: "Simple, warm and comfortable. Ideal for Kedarnath pilgrims needing a clean restful stay before the yatra.",
    amenities: ["WiFi", "Hot Water", "Heater", "Common Bath"],
    images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
             "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80"],
    badge: "Best Value"
  },
  {
    id: 4, name: "Forest Cottage", type: "Cottage", price: 4200,
    available: false, maxGuests: 4,
    description: "Private wooden cottage nestled in deodar forest. Complete privacy with fireplace, sit-out and family capacity.",
    amenities: ["Forest View", "WiFi", "Hot Water", "Fireplace", "Parking", "Kitchenette"],
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
             "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=80"],
    badge: "Private"
  },
  {
    id: 5, name: "Sky Loft", type: "Deluxe", price: 2800,
    available: true, maxGuests: 2,
    description: "Top-floor loft with a 270° panoramic view. Stargazing from bed, modern interiors, and premium amenities.",
    amenities: ["360° View", "WiFi", "Hot Water", "Heater", "Telescope", "Mini Bar"],
    images: ["https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
             "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80"],
    badge: "Stargazing"
  },
  {
    id: 6, name: "Family Meadow Room", type: "Family", price: 3800,
    available: true, maxGuests: 5,
    description: "Spacious family room with two queen beds, a kids corner, and meadow-facing balcony. Perfect for family pilgrimages.",
    amenities: ["Meadow View", "WiFi", "Hot Water", "Heater", "Extra Beds", "Balcony"],
    images: ["https://images.unsplash.com/photo-1541971875076-8f970d573be6?w=800&q=80",
             "https://images.unsplash.com/photo-1555854877-bab8e564b8d5?w=800&q=80"],
    badge: "Family"
  }
];

const TESTIMONIALS = [
  { name: "Aryan Sharma", location: "Delhi", rating: 5, text: "Absolutely magical stay! The mountain views from the Himalayan Suite were unreal. The host Ramesh ji was incredibly helpful with our Kedarnath trek planning. Will return every year!", avatar: "AS" },
  { name: "Priya & Vikram", location: "Bengaluru", rating: 5, text: "We honeymooned at the Sky Loft. Stargazing from bed, fresh mountain air, bonfire at night — it felt like paradise. The food was home-cooked and delicious. 10/10!", avatar: "PV" },
  { name: "Suresh Nair", location: "Mumbai", rating: 4, text: "Perfect base camp for Kedarnath yatra. Rooms are clean, hot water even at 5am before the trek. Pickup from Sonprayag was a lifesaver. Highly recommended.", avatar: "SN" },
  { name: "Meera Iyer", location: "Chennai", rating: 5, text: "The Forest Cottage was beyond expectations. Complete privacy, crackling fireplace, deodar trees all around. My family loved every moment. Magical Uttarakhand!", avatar: "MI" },
];

const GALLERY = [
  { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", cat: "Views", label: "Kedarnath Peaks" },
  { url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80", cat: "Rooms", label: "Deluxe Room" },
  { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80", cat: "Views", label: "Mountain Dawn" },
  { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80", cat: "Rooms", label: "Forest Cottage" },
  { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", cat: "Food", label: "Local Cuisine" },
  { url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80", cat: "Views", label: "Starry Nights" },
  { url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&q=80", cat: "Surroundings", label: "Deodar Forest" },
  { url: "https://images.unsplash.com/photo-1541971875076-8f970d573be6?w=600&q=80", cat: "Rooms", label: "Family Room" },
  { url: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=80", cat: "Food", label: "Breakfast View" },
  { url: "https://images.unsplash.com/photo-1601701119533-fde78d20f76c?w=600&q=80", cat: "Rooms", label: "Valley Retreat" },
  { url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&q=80", cat: "Surroundings", label: "River Mandakini" },
  { url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=80", cat: "Surroundings", label: "Temple Trail" },
];

const SERVICES = [
  { icon: "🍲", title: "Home-Cooked Meals", desc: "Authentic Garhwali cuisine made with local ingredients. Breakfast, lunch & dinner available." },
  { icon: "🥾", title: "Trek Guidance", desc: "Expert local guides for Kedarnath, Vasuki Tal, and nearby treks. All difficulty levels." },
  { icon: "🚗", title: "Pickup & Drop", desc: "Comfortable transfers from Sonprayag, Guptkashi bus stand, or Rishikesh on request." },
  { icon: "🔥", title: "Bonfire Evenings", desc: "Cozy evening bonfires under the stars with chai, local music and mountain stories." },
  { icon: "🅿️", title: "Free Parking", desc: "Secure on-site parking for cars and bikes. EV charging point available." },
  { icon: "🌿", title: "Nature Walks", desc: "Guided morning walks through deodar forests and village trails with local flora insights." },
  { icon: "📿", title: "Puja Arrangements", desc: "Help with Kedarnath darshan bookings, puja materials and pandit coordination." },
  { icon: "🧘", title: "Yoga & Meditation", desc: "Morning sessions on the mountain terrace with certified instructor on request." },
];

// ─── STYLES ──────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }

  :root {
    --ice: #e8f4f8;
    --snow: #f7fbfc;
    --glacier: #c5dde8;
    --peak: #1a3a4a;
    --pine: #2d5a3d;
    --gold: #c8963e;
    --rust: #b5451b;
    --text: #1c2b35;
    --muted: #5a7380;
    --border: #d0e4ec;
    --card: rgba(255,255,255,0.92);
    --shadow: 0 4px 32px rgba(26,58,74,0.12);
    --shadow-lg: 0 16px 64px rgba(26,58,74,0.2);
    --radius: 16px;
    --radius-sm: 8px;
    --transition: all 0.35s cubic-bezier(0.25,0.46,0.45,0.94);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--snow);
    color: var(--text);
    line-height: 1.6;
    overflow-x: hidden;
    position: relative;
    width: 100%;
  }

  h1,h2,h3,h4 { font-family: 'Cormorant Garamond', serif; line-height: 1.2; }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--ice); }
  ::-webkit-scrollbar-thumb { background: var(--glacier); border-radius: 3px; }

  /* ── NAVBAR ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    padding: 0 2rem;
    display: flex; align-items: center; justify-content: space-between;
    height: 70px;
    transition: var(--transition);
    width: 100%;
    max-width: 100%;
  }
  .nav.scrolled {
    background: rgba(26,58,74,0.96);
    backdrop-filter: blur(12px);
    box-shadow: 0 2px 20px rgba(0,0,0,0.2);
  }
  .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .nav-logo-icon { font-size: 1.6rem; }
  .nav-logo-text { color: white; font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600; line-height: 1.1; }
  .nav-logo-sub { font-size: 0.65rem; letter-spacing: 0.15em; font-family: 'DM Sans', sans-serif; font-weight: 300; opacity: 0.8; }
  .nav-links { display: flex; gap: 2rem; align-items: center; }
  .nav-links a { color: rgba(255,255,255,0.88); text-decoration: none; font-size: 0.875rem; font-weight: 500; letter-spacing: 0.02em; transition: color 0.2s; }
  .nav-links a:hover { color: var(--gold); }
  .nav-cta {
    background: var(--gold); color: var(--peak) !important; padding: 0.5rem 1.25rem;
    border-radius: 50px; font-weight: 600 !important; transition: var(--transition) !important;
  }
  .nav-cta:hover { background: #e0a845 !important; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(200,150,62,0.4); }
  .nav-hamburger { display: none; background: none; border: none; cursor: pointer; color: white; font-size: 1.4rem; }

  @media (max-width: 768px) {
    .nav-links { display: none; }
    .nav-hamburger { display: block; }
    .nav-links.open {
      display: flex; flex-direction: column; position: absolute;
      top: 70px; left: 0; right: 0; padding: 1.5rem 2rem 2rem;
      background: rgba(26,58,74,0.98); backdrop-filter: blur(12px);
      gap: 1.25rem; align-items: flex-start;
    }
  }

  /* ── HERO ── */
  .hero {
    height: 100vh; min-height: 600px;
    position: relative; display: flex; align-items: center; justify-content: center;
    overflow: hidden;
    width: 100%;
    max-width: 100%;
  }
  .hero-bg {
    position: absolute; inset: 0;
    background: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80') center/cover no-repeat;
    width: 100%;
  }
  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(160deg, rgba(10,30,42,0.65) 0%, rgba(26,58,74,0.45) 50%, rgba(10,20,30,0.7) 100%);
  }
  .hero-content {
    position: relative; z-index: 2; text-align: center;
    padding: 0 1.5rem; max-width: 900px;
    animation: heroFade 1.2s ease forwards;
  }
  @keyframes heroFade { from { opacity:0; transform: translateY(30px); } to { opacity:1; transform: translateY(0); } }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(200,150,62,0.2); border: 1px solid rgba(200,150,62,0.5);
    color: #f0c060; padding: 0.35rem 1rem; border-radius: 50px;
    font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase;
    margin-bottom: 1.25rem; backdrop-filter: blur(4px);
  }
  .hero h1 {
    font-size: clamp(2.8rem, 7vw, 5.5rem); font-weight: 700; color: white;
    text-shadow: 0 2px 20px rgba(0,0,0,0.3); margin-bottom: 0.75rem;
    letter-spacing: -0.01em;
  }
  .hero h1 span { color: var(--gold); font-style: italic; }
  .hero-tagline {
    font-size: clamp(1rem, 2.5vw, 1.3rem); color: rgba(255,255,255,0.85);
    font-family: 'DM Sans', sans-serif; font-weight: 300; letter-spacing: 0.02em;
    margin-bottom: 2.5rem;
  }
  .hero-stats {
    display: flex; gap: 2.5rem; justify-content: center; margin-bottom: 2.5rem; flex-wrap: wrap;
  }
  .hero-stat { text-align: center; }
  .hero-stat-num { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 700; color: var(--gold); }
  .hero-stat-label { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.6); }
  .hero-scroll { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); animation: bounce 2s infinite; }
  .hero-scroll-line { width: 1px; height: 50px; background: linear-gradient(to bottom, rgba(255,255,255,0.6), transparent); margin: 0 auto 6px; }
  .hero-scroll-dot { width: 6px; height: 6px; background: var(--gold); border-radius: 50%; margin: 0 auto; }
  @keyframes bounce { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }

  /* ── BOOKING FORM ── */
  .booking-strip {
    background: white; border-radius: var(--radius);
    box-shadow: var(--shadow-lg); padding: 0.5rem;
    display: flex; gap: 0.5rem; flex-wrap: wrap;
    max-width: 780px; margin: 0 auto;
    width: 100%;
  }
  .booking-field {
    flex: 1; min-width: 140px; display: flex; flex-direction: column;
    padding: 0.6rem 1rem; border-radius: 12px; background: var(--snow);
    border: 1px solid var(--border); cursor: pointer; transition: var(--transition);
  }
  .booking-field:hover { border-color: var(--glacier); background: var(--ice); }
  .booking-field label { font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); font-weight: 600; margin-bottom: 2px; }
  .booking-field input, .booking-field select {
    border: none; background: transparent; font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem; color: var(--text); font-weight: 500; outline: none; cursor: pointer;
  }
  .booking-btn {
    background: var(--gold); color: white; border: none; border-radius: 12px;
    padding: 0.75rem 1.5rem; font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    font-weight: 600; cursor: pointer; white-space: nowrap; transition: var(--transition);
  }
  .booking-btn:hover { background: #e0a845; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(200,150,62,0.4); }

  /* ── SECTIONS ── */
  .section { padding: 5rem 1.5rem; max-width: 1200px; margin: 0 auto; }
  .section-full { padding: 5rem 1.5rem; }
  .section-label {
    font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--gold); font-weight: 600; margin-bottom: 0.5rem; display: block;
  }
  .section-title { font-size: clamp(2rem, 4vw, 3rem); color: var(--peak); margin-bottom: 0.75rem; }
  .section-sub { color: var(--muted); max-width: 560px; font-size: 1.05rem; line-height: 1.7; margin-bottom: 2.5rem; }
  .section-header-row { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem; margin-bottom: 2.5rem; }

  /* ── DIVIDER ── */
  .divider { height: 1px; background: linear-gradient(to right, transparent, var(--glacier), transparent); max-width: 1200px; margin: 0 auto; }

  /* ── ROOMS ── */
  .filter-bar { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2rem; }
  .filter-chip {
    padding: 0.45rem 1.1rem; border-radius: 50px; border: 1.5px solid var(--border);
    background: white; font-size: 0.82rem; font-weight: 500; cursor: pointer;
    transition: var(--transition); color: var(--muted);
  }
  .filter-chip:hover { border-color: var(--peak); color: var(--peak); }
  .filter-chip.active { background: var(--peak); color: white; border-color: var(--peak); }
  .rooms-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem; }
  .room-card {
    background: white; border-radius: var(--radius); overflow: hidden;
    box-shadow: var(--shadow); transition: var(--transition); border: 1px solid var(--border);
  }
  .room-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
  .room-img { position: relative; height: 220px; overflow: hidden; }
  .room-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
  .room-card:hover .room-img img { transform: scale(1.05); }
  .room-badge {
    position: absolute; top: 12px; left: 12px;
    background: var(--gold); color: white; font-size: 0.68rem; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase; padding: 0.3rem 0.75rem; border-radius: 50px;
  }
  .room-status {
    position: absolute; top: 12px; right: 12px;
    padding: 0.3rem 0.75rem; border-radius: 50px; font-size: 0.7rem; font-weight: 600;
    letter-spacing: 0.05em; text-transform: uppercase;
  }
  .room-status.avail { background: rgba(45,90,61,0.9); color: #90e6a8; }
  .room-status.unavail { background: rgba(181,69,27,0.9); color: #ffb39a; }
  .room-body { padding: 1.25rem 1.5rem 1.5rem; }
  .room-type { font-size: 0.7rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
  .room-name { font-size: 1.3rem; color: var(--peak); margin-bottom: 0.5rem; }
  .room-desc { font-size: 0.875rem; color: var(--muted); line-height: 1.6; margin-bottom: 1rem; }
  .room-amenities { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.25rem; }
  .amenity-tag {
    background: var(--ice); color: var(--peak); font-size: 0.72rem;
    padding: 0.25rem 0.65rem; border-radius: 50px; border: 1px solid var(--glacier);
  }
  .room-footer { display: flex; align-items: center; justify-content: space-between; }
  .room-price { font-family: 'Cormorant Garamond', serif; }
  .room-price-num { font-size: 1.6rem; font-weight: 700; color: var(--peak); }
  .room-price-per { font-size: 0.75rem; color: var(--muted); }
  .room-price-guests { font-size: 0.72rem; color: var(--muted); margin-top: 2px; }
  .btn-primary {
    background: var(--peak); color: white; border: none; border-radius: 50px;
    padding: 0.6rem 1.4rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
    font-weight: 600; cursor: pointer; transition: var(--transition); text-decoration: none; display: inline-block;
  }
  .btn-primary:hover { background: var(--pine); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(26,58,74,0.3); }
  .btn-primary:disabled { background: var(--muted); cursor: not-allowed; transform: none; }
  .btn-outline {
    background: transparent; color: var(--peak); border: 2px solid var(--peak);
    border-radius: 50px; padding: 0.6rem 1.4rem; font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: var(--transition); text-decoration: none; display: inline-block;
  }
  .btn-outline:hover { background: var(--peak); color: white; }

  /* ── ABOUT ── */
  .about-bg { background: linear-gradient(135deg, var(--peak) 0%, #0d2535 100%); padding: 5rem 1.5rem; }
  .about-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
  .about-img-stack { position: relative; height: 500px; }
  .about-img-main {
    position: absolute; top: 0; left: 0; width: 75%; height: 80%;
    border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-lg);
  }
  .about-img-accent {
    position: absolute; bottom: 0; right: 0; width: 55%; height: 55%;
    border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-lg);
    border: 4px solid rgba(255,255,255,0.1);
  }
  .about-img-main img, .about-img-accent img { width: 100%; height: 100%; object-fit: cover; }
  .about-card {
    position: absolute; top: 50%; left: 65%; transform: translateY(-50%);
    background: var(--gold); padding: 1.25rem 1.5rem; border-radius: var(--radius-sm);
    text-align: center; box-shadow: 0 8px 32px rgba(200,150,62,0.4); min-width: 120px;
  }
  .about-card-num { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 700; color: white; }
  .about-card-label { font-size: 0.7rem; color: rgba(255,255,255,0.85); text-transform: uppercase; letter-spacing: 0.1em; }
  .about-text { color: rgba(255,255,255,0.75); }
  .about-text .section-label { color: var(--gold); }
  .about-text .section-title { color: white; }
  .about-text p { line-height: 1.8; margin-bottom: 1rem; }
  .about-features { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 2rem; }
  .about-feature { display: flex; align-items: flex-start; gap: 0.75rem; }
  .about-feature-icon { font-size: 1.2rem; margin-top: 2px; }
  .about-feature-text h4 { color: white; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600; margin-bottom: 2px; }
  .about-feature-text p { font-size: 0.8rem; color: rgba(255,255,255,0.55); }

  @media (max-width: 768px) {
    .about-grid { grid-template-columns: 1fr; gap: 3rem; }
    .about-img-stack { height: 320px; }
    .about-card { left: 55%; }
  }

  /* ── SERVICES ── */
  .services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.25rem; }
  .service-card {
    background: white; padding: 1.75rem; border-radius: var(--radius);
    border: 1px solid var(--border); transition: var(--transition);
    display: flex; gap: 1rem; align-items: flex-start;
  }
  .service-card:hover { border-color: var(--glacier); box-shadow: var(--shadow); transform: translateY(-3px); }
  .service-icon { font-size: 2rem; flex-shrink: 0; }
  .service-title { font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 600; color: var(--peak); margin-bottom: 0.35rem; }
  .service-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.6; }

  /* ── GALLERY ── */
  .gallery-bg { background: var(--ice); padding: 5rem 1.5rem; }
  .gallery-inner { max-width: 1200px; margin: 0 auto; }
  .gallery-cats { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.75rem; }
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 200px;
    gap: 0.75rem;
  }
  .gallery-item {
    border-radius: var(--radius-sm); overflow: hidden; position: relative; cursor: pointer;
    transition: var(--transition);
  }
  .gallery-item:nth-child(1) { grid-column: span 2; grid-row: span 2; }
  .gallery-item:nth-child(5) { grid-column: span 2; }
  .gallery-item:nth-child(9) { grid-column: span 2; }
  .gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
  .gallery-item:hover img { transform: scale(1.07); }
  .gallery-item:hover .gallery-overlay { opacity: 1; }
  .gallery-overlay {
    position: absolute; inset: 0; background: rgba(26,58,74,0.5);
    display: flex; align-items: flex-end; padding: 1rem;
    opacity: 0; transition: opacity 0.3s;
  }
  .gallery-label { color: white; font-size: 0.8rem; font-weight: 500; background: rgba(0,0,0,0.4); padding: 0.3rem 0.75rem; border-radius: 50px; }

  @media (max-width: 768px) {
    .gallery-grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 160px; }
    .gallery-item:nth-child(n) { grid-column: span 1; grid-row: span 1; }
    .gallery-item:nth-child(1), .gallery-item:nth-child(5), .gallery-item:nth-child(9) { grid-column: span 2; }
  }

  /* ── LIGHTBOX ── */
  .lightbox {
    position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 2000;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  .lightbox img { max-width: 90vw; max-height: 85vh; object-fit: contain; border-radius: var(--radius-sm); }
  .lightbox-close {
    position: absolute; top: 1.5rem; right: 1.5rem; background: rgba(255,255,255,0.1);
    border: none; color: white; font-size: 1.5rem; width: 44px; height: 44px; border-radius: 50%;
    cursor: pointer; display: flex; align-items: center; justify-content: center; transition: var(--transition);
  }
  .lightbox-close:hover { background: rgba(255,255,255,0.2); }
  .lightbox-nav {
    position: absolute; top: 50%; transform: translateY(-50%);
    background: rgba(255,255,255,0.1); border: none; color: white; font-size: 1.4rem;
    width: 50px; height: 50px; border-radius: 50%; cursor: pointer; transition: var(--transition);
    display: flex; align-items: center; justify-content: center;
  }
  .lightbox-nav:hover { background: rgba(255,255,255,0.2); }
  .lightbox-prev { left: 1.5rem; }
  .lightbox-next { right: 1.5rem; }

  /* ── TESTIMONIALS ── */
  .testimonials-bg { background: var(--peak); padding: 5rem 1.5rem; }
  .testimonials-inner { max-width: 1200px; margin: 0 auto; }
  .testimonials-inner .section-label { color: var(--gold); }
  .testimonials-inner .section-title { color: white; }
  .testi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
  .testi-card {
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
    border-radius: var(--radius); padding: 1.75rem; transition: var(--transition);
    backdrop-filter: blur(4px);
  }
  .testi-card:hover { background: rgba(255,255,255,0.12); transform: translateY(-4px); }
  .testi-stars { color: var(--gold); margin-bottom: 1rem; font-size: 1rem; letter-spacing: 2px; }
  .testi-text { color: rgba(255,255,255,0.8); font-size: 0.9rem; line-height: 1.7; margin-bottom: 1.25rem; font-style: italic; }
  .testi-author { display: flex; align-items: center; gap: 0.75rem; }
  .testi-avatar {
    width: 40px; height: 40px; border-radius: 50%; background: var(--gold);
    color: white; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; justify-content: center;
  }
  .testi-name { color: white; font-weight: 600; font-size: 0.9rem; }
  .testi-loc { color: rgba(255,255,255,0.5); font-size: 0.78rem; }

  /* ── BOOKING MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 3000;
    display: flex; align-items: center; justify-content: center; padding: 1rem;
    animation: fadeIn 0.2s ease;
  }
  .modal {
    background: white; border-radius: var(--radius); padding: 2.5rem;
    max-width: 520px; width: 100%; max-height: 90vh; overflow-y: auto;
    box-shadow: 0 32px 80px rgba(0,0,0,0.3);
  }
  .modal h2 { font-size: 1.8rem; color: var(--peak); margin-bottom: 0.25rem; }
  .modal-room-name { color: var(--muted); font-size: 0.9rem; margin-bottom: 1.75rem; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
  .form-group.full { grid-column: 1 / -1; }
  .form-group label { font-size: 0.78rem; font-weight: 600; color: var(--peak); letter-spacing: 0.05em; }
  .form-group input, .form-group select, .form-group textarea {
    border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    padding: 0.65rem 0.9rem; font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    color: var(--text); background: var(--snow); outline: none; transition: var(--transition);
  }
  .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
    border-color: var(--peak); background: white; box-shadow: 0 0 0 3px rgba(26,58,74,0.08);
  }
  .form-group textarea { resize: vertical; min-height: 80px; }
  .modal-footer { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
  .modal-total { background: var(--ice); border-radius: var(--radius-sm); padding: 1rem 1.25rem; margin-top: 1rem; display: flex; justify-content: space-between; align-items: center; }
  .modal-total-label { font-size: 0.85rem; color: var(--muted); }
  .modal-total-price { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700; color: var(--peak); }
  .success-box { text-align: center; padding: 2rem 0; }
  .success-icon { font-size: 3.5rem; margin-bottom: 1rem; }
  .success-box h3 { font-size: 1.6rem; color: var(--peak); margin-bottom: 0.5rem; }
  .success-box p { color: var(--muted); font-size: 0.9rem; line-height: 1.7; }

  /* ── CONTACT ── */
  .contact-grid { display: grid; grid-template-columns: 1fr 1.3fr; gap: 3rem; align-items: start; }
  .contact-info h3 { font-size: 1.5rem; color: var(--peak); margin-bottom: 1.5rem; }
  .contact-item { display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1.25rem; }
  .contact-icon { width: 42px; height: 42px; background: var(--ice); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
  .contact-item-title { font-weight: 600; color: var(--peak); font-size: 0.9rem; }
  .contact-item-val { font-size: 0.85rem; color: var(--muted); margin-top: 2px; }
  .whatsapp-btn {
    display: flex; align-items: center; gap: 0.6rem; background: #25D366; color: white;
    padding: 0.75rem 1.5rem; border-radius: 50px; text-decoration: none; font-weight: 600;
    font-size: 0.9rem; margin-top: 1.5rem; width: fit-content; transition: var(--transition);
  }
  .whatsapp-btn:hover { background: #1da851; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37,211,102,0.4); }
  .map-placeholder {
    width: 100%; height: 280px; background: var(--ice); border-radius: var(--radius);
    display: flex; align-items: center; justify-content: center; flex-direction: column;
    gap: 0.75rem; color: var(--muted); margin-top: 1.5rem; border: 1px solid var(--border);
    font-size: 0.9rem; text-align: center;
  }
  .map-placeholder a { color: var(--peak); font-weight: 600; text-decoration: none; }
  .map-placeholder a:hover { text-decoration: underline; }

  @media (max-width: 768px) {
    .contact-grid { grid-template-columns: 1fr; }
  }

  /* ── FOOTER ── */
  .footer { background: #0a1e2b; padding: 3.5rem 1.5rem 1.5rem; }
  .footer-inner { max-width: 1200px; margin: 0 auto; }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 2.5rem; margin-bottom: 3rem; }
  .footer-brand-name { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; color: white; margin-bottom: 0.75rem; }
  .footer-brand-desc { font-size: 0.85rem; color: rgba(255,255,255,0.45); line-height: 1.7; }
  .footer-col h4 { color: rgba(255,255,255,0.7); font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 1rem; font-family: 'DM Sans', sans-serif; font-weight: 600; }
  .footer-col a { display: block; color: rgba(255,255,255,0.45); text-decoration: none; font-size: 0.85rem; margin-bottom: 0.6rem; transition: color 0.2s; }
  .footer-col a:hover { color: var(--gold); }
  .footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1.5rem; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; }
  .footer-copy { font-size: 0.8rem; color: rgba(255,255,255,0.3); }
  .footer-love { font-size: 0.8rem; color: rgba(255,255,255,0.3); }

  @media (max-width: 768px) {
    .footer-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 480px) {
    .footer-grid { grid-template-columns: 1fr; }
  }

  /* ── WHATSAPP FLOAT ── */
  .wa-float {
    position: fixed; bottom: 2rem; right: 1.5rem; z-index: 999;
    width: 56px; height: 56px; background: #25D366; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; font-size: 1.5rem;
    box-shadow: 0 6px 24px rgba(37,211,102,0.5); cursor: pointer; transition: var(--transition);
    text-decoration: none;
  }
  .wa-float:hover { transform: scale(1.1); box-shadow: 0 10px 32px rgba(37,211,102,0.6); }
  .wa-tooltip {
    position: absolute; right: 64px; background: var(--peak); color: white;
    font-size: 0.78rem; padding: 0.4rem 0.75rem; border-radius: 6px; white-space: nowrap;
    pointer-events: none; opacity: 0; transition: opacity 0.2s;
  }
  .wa-float:hover .wa-tooltip { opacity: 1; }

  /* ── VIDEO SECTION ── */
  .video-bg { background: linear-gradient(135deg, #0a1e2b 0%, var(--peak) 100%); padding: 5rem 1.5rem; }
  .video-inner { max-width: 900px; margin: 0 auto; text-align: center; }
  .video-inner .section-label { color: var(--gold); }
  .video-inner .section-title { color: white; }
  .video-inner .section-sub { color: rgba(255,255,255,0.6); margin: 0 auto 2rem; }
  .video-frame {
    border-radius: var(--radius); overflow: hidden; box-shadow: 0 32px 80px rgba(0,0,0,0.5);
    position: relative; padding-bottom: 56.25%; height: 0;
    border: 1px solid rgba(255,255,255,0.1);
  }
  .video-frame iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }

  /* ── LOCATION HIGHLIGHTS ── */
  .highlights { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1.5rem; }
  .highlight { display: flex; align-items: center; gap: 0.5rem; background: var(--ice); padding: 0.5rem 1rem; border-radius: 50px; font-size: 0.82rem; color: var(--peak); border: 1px solid var(--glacier); }

  /* ── MISC ── */
  .text-center { text-align: center; }
  .mt-1 { margin-top: 0.5rem; }
  .mt-2 { margin-top: 1rem; }
  .mt-3 { margin-top: 1.5rem; }
  .flex-center { display: flex; align-items: center; justify-content: center; }
  .gap-1 { gap: 0.5rem; }

  /* ── ADMIN ── */
  .admin-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 4000;
    display: flex; animation: fadeIn 0.2s ease;
  }
  .admin-sidebar {
    width: 240px; background: var(--peak); padding: 2rem 0; flex-shrink: 0;
    display: flex; flex-direction: column;
  }
  .admin-logo { padding: 0 1.5rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .admin-logo-text { color: white; font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; }
  .admin-nav { padding: 1rem 0; flex: 1; }
  .admin-nav-item {
    display: flex; align-items: center; gap: 0.75rem; padding: 0.8rem 1.5rem;
    color: rgba(255,255,255,0.6); cursor: pointer; transition: var(--transition); font-size: 0.9rem;
  }
  .admin-nav-item:hover, .admin-nav-item.active { background: rgba(255,255,255,0.1); color: white; }
  .admin-main { flex: 1; background: var(--snow); overflow-y: auto; padding: 2.5rem; }
  .admin-header { margin-bottom: 2rem; }
  .admin-header h2 { font-size: 1.8rem; color: var(--peak); }
  .admin-header p { color: var(--muted); font-size: 0.9rem; }
  .admin-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
  .admin-stat-card {
    background: white; border-radius: var(--radius-sm); padding: 1.25rem;
    border: 1px solid var(--border); text-align: center;
  }
  .admin-stat-num { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 700; color: var(--peak); }
  .admin-stat-label { font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }
  .bookings-table { background: white; border-radius: var(--radius-sm); border: 1px solid var(--border); overflow: hidden; }
  .bookings-table table { width: 100%; border-collapse: collapse; }
  .bookings-table th { background: var(--ice); padding: 0.75rem 1rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); text-align: left; }
  .bookings-table td { padding: 0.85rem 1rem; border-top: 1px solid var(--border); font-size: 0.875rem; color: var(--text); }
  .status-badge { display: inline-block; padding: 0.25rem 0.65rem; border-radius: 50px; font-size: 0.7rem; font-weight: 600; }
  .status-confirmed { background: rgba(45,90,61,0.1); color: var(--pine); }
  .status-pending { background: rgba(200,150,62,0.1); color: var(--gold); }
  .admin-close-btn {
    background: rgba(255,255,255,0.1); border: none; color: rgba(255,255,255,0.6);
    padding: 0.75rem 1.5rem; cursor: pointer; font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; margin: 0 1.5rem 1rem; border-radius: var(--radius-sm);
    transition: var(--transition); display: flex; align-items: center; gap: 0.5rem;
  }
  .admin-close-btn:hover { background: rgba(255,255,255,0.15); color: white; }
`;

// ─── SAMPLE BOOKINGS FOR ADMIN ────────────────────────────────────────────────
const SAMPLE_BOOKINGS = [
  { id: "SIH-001", guest: "Rahul Verma", room: "Himalayan Suite", checkin: "2025-06-10", checkout: "2025-06-13", guests: 2, amount: "₹10,500", status: "confirmed" },
  { id: "SIH-002", guest: "Pooja Mehta", room: "Sky Loft", checkin: "2025-06-14", checkout: "2025-06-16", guests: 2, amount: "₹5,600", status: "confirmed" },
  { id: "SIH-003", guest: "Amit Singh", room: "Pilgrim's Nest", checkin: "2025-06-15", checkout: "2025-06-16", guests: 1, amount: "₹1,400", status: "pending" },
  { id: "SIH-004", guest: "Neha Joshi", room: "Family Meadow Room", checkin: "2025-06-20", checkout: "2025-06-24", guests: 4, amount: "₹15,200", status: "confirmed" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function StarRating({ n }) {
  return <span style={{ color: "#c8963e", letterSpacing: "2px" }}>{"★".repeat(n)}{"☆".repeat(5 - n)}</span>;
}

function Navbar({ onAdminClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    ["#rooms", "Rooms"], ["#gallery", "Gallery"], ["#services", "Services"],
    ["#about", "About"], ["#contact", "Contact"]
  ];

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <a href="#hero" className="nav-logo">
        <span className="nav-logo-icon">🏔️</span>
        <div>
          <div className="nav-logo-text">Shivalik Ice Hills</div>
          <div className="nav-logo-sub">Guptkashi, Uttarakhand</div>
        </div>
      </a>
      <div className={`nav-links${open ? " open" : ""}`}>
        {links.map(([href, label]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
        <a href="#rooms" className="nav-cta" onClick={() => setOpen(false)}>Book Now</a>
        <a href="#" className="nav-cta" style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
           onClick={e => { e.preventDefault(); setOpen(false); onAdminClick(); }}>Admin</a>
      </div>
      <button className="nav-hamburger" onClick={() => setOpen(o => !o)}>
        {open ? "✕" : "☰"}
      </button>
    </nav>
  );
}

function Hero({ onBookNow }) {
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState("2");

  const today = new Date().toISOString().split("T")[0];

  return (
    <section className="hero" id="hero">
      <div className="hero-bg" />
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-badge">🌟 Top-Rated Homestay in Guptkashi</div>
        <h1>Stay Where the<br /><span>Himalayas Begin</span></h1>
        <p className="hero-tagline">Best stay for nature lovers & Kedarnath travelers · Guptkashi, Uttarakhand</p>
        <div className="hero-stats">
          {[["500+", "Happy Guests"], ["6", "Unique Rooms"], ["3200m", "Altitude"], ["4.9★", "Avg Rating"]].map(([n, l]) => (
            <div className="hero-stat" key={l}>
              <div className="hero-stat-num">{n}</div>
              <div className="hero-stat-label">{l}</div>
            </div>
          ))}
        </div>
        <div className="booking-strip">
          <div className="booking-field">
            <label>Check-in</label>
            <input type="date" min={today} value={checkin} onChange={e => setCheckin(e.target.value)} />
          </div>
          <div className="booking-field">
            <label>Check-out</label>
            <input type="date" min={checkin || today} value={checkout} onChange={e => setCheckout(e.target.value)} />
          </div>
          <div className="booking-field">
            <label>Guests</label>
            <select value={guests} onChange={e => setGuests(e.target.value)}>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>)}
            </select>
          </div>
          <button className="booking-btn" onClick={() => onBookNow(null, checkin, checkout, guests)}>
            🔍 Search Rooms
          </button>
        </div>
      </div>
      <div className="hero-scroll">
        <div className="hero-scroll-line" />
        <div className="hero-scroll-dot" />
      </div>
    </section>
  );
}

function Rooms({ onBook }) {
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const types = ["All", "Suite", "Deluxe", "Standard", "Cottage", "Family"];

  let filtered = filter === "All" ? ROOMS : ROOMS.filter(r => r.type === filter);
  if (sortBy === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === "avail") filtered = [...filtered].sort((a, b) => (b.available ? 1 : 0) - (a.available ? 1 : 0));

  return (
    <section className="section" id="rooms">
      <div className="section-header-row">
        <div>
          <span className="section-label">🛏 Our Rooms</span>
          <h2 className="section-title">Find Your Perfect Stay</h2>
          <p className="section-sub">Each room is thoughtfully designed to immerse you in the beauty of the Himalayas.</p>
        </div>
        <select className="filter-chip" style={{ padding: "0.45rem 1rem" }}
                value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="avail">Availability</option>
        </select>
      </div>
      <div className="filter-bar">
        {types.map(t => (
          <button key={t} className={`filter-chip${filter === t ? " active" : ""}`}
                  onClick={() => setFilter(t)}>{t}</button>
        ))}
      </div>
      <div className="rooms-grid">
        {filtered.map(room => (
          <RoomCard key={room.id} room={room} onBook={onBook} />
        ))}
      </div>
    </section>
  );
}

function RoomCard({ room, onBook }) {
  const [imgIdx, setImgIdx] = useState(0);

  return (
    <div className="room-card">
      <div className="room-img" onClick={() => setImgIdx(i => (i + 1) % room.images.length)}
           style={{ cursor: "pointer" }}>
        <img src={room.images[imgIdx]} alt={room.name} loading="lazy" />
        {room.badge && <span className="room-badge">{room.badge}</span>}
        <span className={`room-status ${room.available ? "avail" : "unavail"}`}>
          {room.available ? "● Available" : "● Booked"}
        </span>
        {room.images.length > 1 && (
          <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "5px" }}>
            {room.images.map((_, i) => (
              <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: i === imgIdx ? "white" : "rgba(255,255,255,0.5)" }} />
            ))}
          </div>
        )}
      </div>
      <div className="room-body">
        <div className="room-type">{room.type} · Up to {room.maxGuests} Guests</div>
        <div className="room-name">{room.name}</div>
        <p className="room-desc">{room.description}</p>
        <div className="room-amenities">
          {room.amenities.map(a => <span key={a} className="amenity-tag">{a}</span>)}
        </div>
        <div className="room-footer">
          <div className="room-price">
            <div><span className="room-price-num">₹{room.price.toLocaleString()}</span><span className="room-price-per"> /night</span></div>
            <div className="room-price-guests">Max {room.maxGuests} guests</div>
          </div>
          <button className="btn-primary" onClick={() => onBook(room)} disabled={!room.available}>
            {room.available ? "Book Now" : "Not Available"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingModal({ room, preCheckin, preCheckout, preGuests, onClose }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    checkin: preCheckin || "", checkout: preCheckout || "",
    guests: preGuests || "1", special: "",
    selectedRoom: room?.id || ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingId] = useState("SIH-" + Math.random().toString(36).slice(2, 7).toUpperCase());

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const nights = form.checkin && form.checkout
    ? Math.max(0, Math.ceil((new Date(form.checkout) - new Date(form.checkin)) / 86400000))
    : 0;

  const selectedRoom = room || ROOMS.find(r => r.id === Number(form.selectedRoom));
  const total = selectedRoom && nights > 0 ? selectedRoom.price * nights : 0;

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone || !form.checkin || !form.checkout) {
      alert("Please fill all required fields.");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {submitted ? (
          <div className="success-box">
            <div className="success-icon">✅</div>
            <h3>Booking Confirmed!</h3>
            <p>Booking ID: <strong>{bookingId}</strong><br />
              Thank you, <strong>{form.name}</strong>! Your stay at <strong>{selectedRoom?.name}</strong> is confirmed.<br /><br />
              We'll send details to <strong>{form.email}</strong>.<br />
              For questions, WhatsApp: <strong>+91 94120 XXXXX</strong></p>
            <button className="btn-primary mt-3" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <h2>Book Your Stay</h2>
            <p className="modal-room-name">{room ? `Room: ${room.name} · ₹${room.price}/night` : "Select your preferred room"}</p>
            <div className="form-grid">
              <div className="form-group full">
                <label>Full Name *</label>
                <input placeholder="Your full name" value={form.name} onChange={e => set("name", e.target.value)} />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" placeholder="email@example.com" value={form.email} onChange={e => set("email", e.target.value)} />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => set("phone", e.target.value)} />
              </div>
              {!room && (
                <div className="form-group full">
                  <label>Select Room *</label>
                  <select value={form.selectedRoom} onChange={e => set("selectedRoom", e.target.value)}>
                    <option value="">Choose a room</option>
                    {ROOMS.filter(r => r.available).map(r => (
                      <option key={r.id} value={r.id}>{r.name} — ₹{r.price}/night</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="form-group">
                <label>Check-in *</label>
                <input type="date" min={today} value={form.checkin} onChange={e => set("checkin", e.target.value)} />
              </div>
              <div className="form-group">
                <label>Check-out *</label>
                <input type="date" min={form.checkin || today} value={form.checkout} onChange={e => set("checkout", e.target.value)} />
              </div>
              <div className="form-group">
                <label>Guests</label>
                <select value={form.guests} onChange={e => set("guests", e.target.value)}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Nights</label>
                <input readOnly value={nights > 0 ? `${nights} night${nights > 1 ? "s" : ""}` : "Select dates"} style={{ background: "#f0f5f7", cursor: "default" }} />
              </div>
              <div className="form-group full">
                <label>Special Requests</label>
                <textarea placeholder="Early check-in, dietary needs, trek guidance..." value={form.special} onChange={e => set("special", e.target.value)} />
              </div>
            </div>
            {total > 0 && (
              <div className="modal-total">
                <div>
                  <div className="modal-total-label">Total Estimate</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{selectedRoom?.name} × {nights} night{nights > 1 ? "s" : ""}</div>
                </div>
                <div className="modal-total-price">₹{total.toLocaleString()}</div>
              </div>
            )}
            <div className="modal-footer">
              <button className="btn-outline" onClick={onClose}>Cancel</button>
              <button className="btn-primary" onClick={handleSubmit} disabled={loading}
                      style={{ flex: 1 }}>
                {loading ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
            <p style={{ fontSize: "0.73rem", color: "var(--muted)", marginTop: "1rem", textAlign: "center" }}>
              🔒 Secure booking · No payment required now · Free cancellation 48h before check-in
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Gallery() {
  const [cat, setCat] = useState("All");
  const [light, setLight] = useState(null);
  const cats = ["All", "Views", "Rooms", "Food", "Surroundings"];
  const items = cat === "All" ? GALLERY : GALLERY.filter(g => g.cat === cat);

  const move = (dir) => {
    const idx = items.findIndex(i => i.url === light.url);
    const next = (idx + dir + items.length) % items.length;
    setLight(items[next]);
  };

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") setLight(null); if (e.key === "ArrowRight") move(1); if (e.key === "ArrowLeft") move(-1); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [light, items]);

  return (
    <>
      <div className="gallery-bg" id="gallery">
        <div className="gallery-inner">
          <span className="section-label">📸 Gallery</span>
          <h2 className="section-title">A Glimpse of Paradise</h2>
          <p className="section-sub">Every corner of Shivalik Ice Hills tells a story of mountains, warmth and wonder.</p>
          <div className="gallery-cats">
            {cats.map(c => (
              <button key={c} className={`filter-chip${cat === c ? " active" : ""}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <div className="gallery-grid">
            {items.map((img, i) => (
              <div key={i} className="gallery-item" onClick={() => setLight(img)}>
                <img src={img.url} alt={img.label} loading="lazy" />
                <div className="gallery-overlay">
                  <span className="gallery-label">{img.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {light && (
        <div className="lightbox" onClick={() => setLight(null)}>
          <img src={light.url} alt={light.label} onClick={e => e.stopPropagation()} />
          <button className="lightbox-close" onClick={() => setLight(null)}>✕</button>
          <button className="lightbox-nav lightbox-prev" onClick={e => { e.stopPropagation(); move(-1); }}>‹</button>
          <button className="lightbox-nav lightbox-next" onClick={e => { e.stopPropagation(); move(1); }}>›</button>
        </div>
      )}
    </>
  );
}

function VideoSection() {
  return (
    <div className="video-bg" id="video">
      <div className="video-inner">
        <span className="section-label">🎬 Experience</span>
        <h2 className="section-title">See It Before You Visit</h2>
        <p className="section-sub">Take a virtual tour of Shivalik Ice Hills and the breathtaking surroundings of Guptkashi.</p>
        <div className="video-frame">
          <iframe
            src="https://www.youtube.com/embed/jq2ByFz9vf4?autoplay=0&rel=0&modestbranding=1"
            title="Guptkashi - Kedarnath Region"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

function Services() {
  return (
    <section className="section" id="services">
      <span className="section-label">✨ Services</span>
      <h2 className="section-title">Everything You Need</h2>
      <p className="section-sub">Beyond comfortable rooms, we offer experiences that make your Himalayan journey unforgettable.</p>
      <div className="services-grid">
        {SERVICES.map(s => (
          <div key={s.title} className="service-card">
            <span className="service-icon">{s.icon}</span>
            <div>
              <div className="service-title">{s.title}</div>
              <div className="service-desc">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <div className="about-bg" id="about">
      <div className="about-grid">
        <div className="about-img-stack">
          <div className="about-img-main">
            <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" alt="Mountain views" />
          </div>
          <div className="about-img-accent">
            <img src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&q=80" alt="Forest" />
          </div>
          <div className="about-card">
            <div className="about-card-num">8+</div>
            <div className="about-card-label">Years of Hosting</div>
          </div>
        </div>
        <div className="about-text">
          <span className="section-label">🏡 Our Story</span>
          <h2 className="section-title">Born from a Love of Mountains</h2>
          <p>Shivalik Ice Hills began as a dream of Ram Prasad Negi — a local Garhwali who wanted to share the magic of his homeland with the world. What started as two rooms in a family home has grown into a beloved boutique homestay.</p>
          <p>Perched at 3200m above sea level in the sacred town of Guptkashi, we're ideally placed on the route to Kedarnath Dham — one of the holiest shrines in India. Our guests aren't just visitors; they become part of our mountain family.</p>
          <div className="highlights">
            {["12km from Kedarnath", "On NH-7 Highway", "Mandakini Riverside", "Deodar Forest"].map(h => (
              <span key={h} className="highlight">📍 {h}</span>
            ))}
          </div>
          <div className="about-features">
            {[
              ["🏔️", "Panoramic Views", "Unobstructed Himalayan vista from every room"],
              ["🏡", "Family-Run", "Personal care and authentic local hospitality"],
              ["♻️", "Eco-Friendly", "Solar power, rainwater harvesting, organic garden"],
              ["🛡️", "Safe & Clean", "Sanitized rooms, filtered water, fire safety certified"],
            ].map(([icon, title, desc]) => (
              <div key={title} className="about-feature">
                <span className="about-feature-icon">{icon}</span>
                <div className="about-feature-text">
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  return (
    <div className="testimonials-bg">
      <div className="testimonials-inner">
        <span className="section-label">💬 Reviews</span>
        <h2 className="section-title" style={{ marginBottom: "0.5rem" }}>What Our Guests Say</h2>
        <p style={{ color: "rgba(255,255,255,0.55)", margin: "0 0 2.5rem", fontSize: "1rem" }}>
          Real stories from the travelers who've stayed with us
        </p>
        <div className="testi-grid">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="testi-card">
              <div className="testi-stars">{"★".repeat(t.rating)}</div>
              <p className="testi-text">"{t.text}"</p>
              <div className="testi-author">
                <div className="testi-avatar">{t.avatar}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-loc">📍 {t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { alert("Please fill all fields."); return; }
    await new Promise(r => setTimeout(r, 800));
    setSent(true);
  };

  return (
    <section className="section" id="contact">
      <span className="section-label">📬 Contact</span>
      <h2 className="section-title">Get in Touch</h2>
      <p className="section-sub">Have questions? We're always happy to help you plan the perfect mountain getaway.</p>
      <div className="contact-grid">
        <div className="contact-info">
          <h3>Reach Us Directly</h3>
          {[
            ["📍", "Address", "Shivalik Ice Hills, Near Ardhnarishwar Temple, Guptkashi, Rudraprayag, Uttarakhand – 246439"],
            ["📞", "Phone", "+91 94120 XXXXX · +91 96342 XXXXX"],
            ["✉️", "Email", "info@shivalikicehills.in"],
            ["🕐", "Check-in / Check-out", "Check-in: 12:00 PM · Check-out: 11:00 AM"],
            ["🏔️", "Altitude", "3,200 meters above sea level"],
          ].map(([icon, title, val]) => (
            <div key={title} className="contact-item">
              <div className="contact-icon">{icon}</div>
              <div>
                <div className="contact-item-title">{title}</div>
                <div className="contact-item-val">{val}</div>
              </div>
            </div>
          ))}
          <a href="https://wa.me/9412000000?text=Hello! I want to book a room at Shivalik Ice Hills, Guptkashi."
             target="_blank" rel="noopener noreferrer" className="whatsapp-btn">
            <span>💬</span> Chat on WhatsApp
          </a>
          <div className="map-placeholder">
            <span style={{ fontSize: "2rem" }}>🗺️</span>
            <div>
              <strong>Shivalik Ice Hills, Guptkashi</strong><br />
              <span style={{ fontSize: "0.82rem" }}>Rudraprayag District, Uttarakhand</span>
            </div>
            <a href="https://maps.google.com/?q=Guptkashi+Uttarakhand" target="_blank" rel="noopener noreferrer">
              Open in Google Maps →
            </a>
          </div>
        </div>
        <div>
          <h3 style={{ fontSize: "1.4rem", color: "var(--peak)", marginBottom: "1.5rem" }}>Send a Message</h3>
          {sent ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", background: "var(--ice)", borderRadius: "var(--radius)", border: "1px solid var(--glacier)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🙏</div>
              <h4 style={{ color: "var(--peak)", marginBottom: "0.5rem" }}>Message Received!</h4>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Thank you {form.name}! We'll get back to you within 2 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSend}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input placeholder="Full name" value={form.name} onChange={e => set("name", e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" placeholder="your@email.com" value={form.email} onChange={e => set("email", e.target.value)} />
                </div>
                <div className="form-group full">
                  <label>Phone</label>
                  <input type="tel" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="form-group full">
                  <label>Message *</label>
                  <textarea style={{ minHeight: "140px" }} placeholder="Ask about rooms, availability, trek guidance, group bookings..." value={form.message} onChange={e => set("message", e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: "1rem", width: "100%", padding: "0.85rem" }}>
                Send Message 📩
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function AdminPanel({ onClose }) {
  const [tab, setTab] = useState("dashboard");
  const [adminUser, setAdminUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ user: "", pass: "" });
  const [loginErr, setLoginErr] = useState("");

  const handleLogin = () => {
    if (loginForm.user === "admin" && loginForm.pass === "shivalik2024") {
      setAdminUser("Admin");
    } else {
      setLoginErr("Invalid credentials. Try admin / shivalik2024");
    }
  };

  if (!adminUser) {
    return (
      <div className="admin-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div style={{ margin: "auto", background: "white", borderRadius: "var(--radius)", padding: "2.5rem", maxWidth: "400px", width: "100%" }}>
          <h2 style={{ fontSize: "1.6rem", color: "var(--peak)", marginBottom: "0.25rem" }}>Admin Login</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>Shivalik Ice Hills · Management</p>
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label>Username</label>
            <input placeholder="admin" value={loginForm.user} onChange={e => setLoginForm(f => ({ ...f, user: e.target.value }))} />
          </div>
          <div className="form-group" style={{ marginBottom: "1.25rem" }}>
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={loginForm.pass} onChange={e => setLoginForm(f => ({ ...f, pass: e.target.value }))}
                   onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          {loginErr && <p style={{ color: "var(--rust)", fontSize: "0.82rem", marginBottom: "1rem" }}>{loginErr}</p>}
          <button className="btn-primary" style={{ width: "100%", padding: "0.85rem" }} onClick={handleLogin}>Login →</button>
          <button className="btn-outline" style={{ width: "100%", padding: "0.75rem", marginTop: "0.75rem" }} onClick={onClose}>Cancel</button>
          <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "1rem", textAlign: "center" }}>Demo: admin / shivalik2024</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "bookings", icon: "📅", label: "Bookings" },
    { id: "rooms", icon: "🛏", label: "Rooms" },
    { id: "gallery", icon: "📸", label: "Media" },
  ];

  return (
    <div className="admin-overlay">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <div className="admin-logo-text">🏔️ Shivalik Ice Hills</div>
          <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>Admin Panel</div>
        </div>
        <div className="admin-nav">
          {navItems.map(n => (
            <div key={n.id} className={`admin-nav-item${tab === n.id ? " active" : ""}`} onClick={() => setTab(n.id)}>
              <span>{n.icon}</span> {n.label}
            </div>
          ))}
        </div>
        <button className="admin-close-btn" onClick={onClose}>← Back to Site</button>
        <div style={{ padding: "0 1.5rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.35)" }}>
          Logged in as {adminUser}
        </div>
      </div>
      <div className="admin-main">
        {tab === "dashboard" && (
          <>
            <div className="admin-header">
              <h2>Good day! 👋</h2>
              <p>Here's what's happening at Shivalik Ice Hills today.</p>
            </div>
            <div className="admin-stats">
              {[["4", "Total Bookings"], ["5", "Rooms Available"], ["₹32,700", "Revenue This Month"], ["4.9★", "Avg Rating"]].map(([n, l]) => (
                <div key={l} className="admin-stat-card">
                  <div className="admin-stat-num">{n}</div>
                  <div className="admin-stat-label">{l}</div>
                </div>
              ))}
            </div>
            <h3 style={{ fontSize: "1.1rem", color: "var(--peak)", margin: "1.5rem 0 1rem" }}>Recent Bookings</h3>
            <div className="bookings-table">
              <table>
                <thead><tr>
                  {["ID", "Guest", "Room", "Check-in", "Guests", "Amount", "Status"].map(h => <th key={h}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {SAMPLE_BOOKINGS.map(b => (
                    <tr key={b.id}>
                      <td><strong>{b.id}</strong></td>
                      <td>{b.guest}</td>
                      <td>{b.room}</td>
                      <td>{b.checkin}</td>
                      <td>{b.guests}</td>
                      <td><strong>{b.amount}</strong></td>
                      <td><span className={`status-badge status-${b.status}`}>{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === "bookings" && (
          <>
            <div className="admin-header"><h2>Manage Bookings</h2><p>View and manage all reservations.</p></div>
            <div className="bookings-table">
              <table>
                <thead><tr>
                  {["ID", "Guest", "Room", "Check-in", "Check-out", "Guests", "Amount", "Status", "Actions"].map(h => <th key={h}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {SAMPLE_BOOKINGS.map(b => (
                    <tr key={b.id}>
                      <td><strong>{b.id}</strong></td>
                      <td>{b.guest}</td>
                      <td>{b.room}</td>
                      <td>{b.checkin}</td>
                      <td>{b.checkout}</td>
                      <td>{b.guests}</td>
                      <td><strong>{b.amount}</strong></td>
                      <td><span className={`status-badge status-${b.status}`}>{b.status}</span></td>
                      <td><button style={{ background: "var(--ice)", border: "1px solid var(--border)", borderRadius: "6px", padding: "0.3rem 0.6rem", cursor: "pointer", fontSize: "0.75rem" }}>Edit</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {tab === "rooms" && (
          <>
            <div className="admin-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div><h2>Manage Rooms</h2><p>Add, edit or update room details and availability.</p></div>
              <button className="btn-primary" style={{ fontSize: "0.85rem" }}>+ Add Room</button>
            </div>
            <div style={{ display: "grid", gap: "1rem" }}>
              {ROOMS.map(r => (
                <div key={r.id} style={{ background: "white", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <img src={r.images[0]} alt={r.name} style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "8px" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: "var(--peak)" }}>{r.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{r.type} · ₹{r.price}/night · Max {r.maxGuests} guests</div>
                  </div>
                  <span className={`status-badge status-${r.available ? "confirmed" : "pending"}`}>
                    {r.available ? "Available" : "Booked"}
                  </span>
                  <button style={{ background: "var(--ice)", border: "1px solid var(--border)", borderRadius: "6px", padding: "0.4rem 0.8rem", cursor: "pointer", fontSize: "0.8rem" }}>Edit</button>
                </div>
              ))}
            </div>
          </>
        )}
        {tab === "gallery" && (
          <>
            <div className="admin-header"><h2>Media Manager</h2><p>Upload and manage photos and videos.</p></div>
            <div style={{ background: "white", border: "2px dashed var(--glacier)", borderRadius: "var(--radius)", padding: "3rem", textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>☁️</div>
              <h4 style={{ color: "var(--peak)", marginBottom: "0.5rem" }}>Upload Photos or Videos</h4>
              <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>Drag & drop or click to browse · JPG, PNG, MP4 supported · Max 10MB</p>
              <button className="btn-outline">Choose Files</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.75rem" }}>
              {GALLERY.slice(0, 8).map((img, i) => (
                <div key={i} style={{ position: "relative", borderRadius: "var(--radius-sm)", overflow: "hidden", height: "120px" }}>
                  <img src={img.url} alt={img.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", top: "6px", right: "6px", background: "rgba(0,0,0,0.5)", color: "white", border: "none", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", cursor: "pointer" }}>✕</div>
                  <div style={{ position: "absolute", bottom: "6px", left: "6px", background: "rgba(0,0,0,0.5)", color: "white", fontSize: "0.65rem", padding: "2px 6px", borderRadius: "4px" }}>{img.cat}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Footer({ onBook }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-name">🏔️ Shivalik Ice Hills</div>
            <p className="footer-brand-desc">A boutique mountain homestay in Guptkashi, Uttarakhand. The perfect base for Kedarnath pilgrims and Himalayan adventurers.</p>
          </div>
          <div className="footer-col">
            <h4>Explore</h4>
            {[["#rooms", "Rooms"], ["#gallery", "Gallery"], ["#services", "Services"], ["#about", "Our Story"]].map(([h, l]) => (
              <a key={h} href={h}>{l}</a>
            ))}
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <a href="#contact">Contact Us</a>
            <a href="#rooms">Book a Room</a>
            <a href="#">Cancellation Policy</a>
            <a href="#">Privacy Policy</a>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href="tel:+919412000000">📞 +91 94120 XXXXX</a>
            <a href="mailto:info@shivalikicehills.in">✉️ Email Us</a>
            <a href="https://wa.me/9412000000" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
            <a href="https://maps.google.com/?q=Guptkashi" target="_blank" rel="noopener noreferrer">📍 Directions</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2025 Shivalik Ice Hills, Guptkashi, Uttarakhand. All rights reserved.</div>
          <div className="footer-love">Made with ❤️ in the Himalayas</div>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [booking, setBooking] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  // Inject viewport meta to prevent mobile zoom/overflow issues
  useEffect(() => {
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "viewport";
      document.head.appendChild(meta);
    }
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0";
    // Prevent any element from causing horizontal scroll
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    document.body.style.width = "100%";
    document.body.style.position = "relative";
  }, []);

  const openBooking = (room = null, checkin = "", checkout = "", guests = "1") => {
    setBooking({ room, checkin, checkout, guests });
    if (!room) {
      setTimeout(() => document.getElementById("rooms")?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "100%", overflowX: "hidden", position: "relative" }}>
      <style>{CSS}</style>
      <Navbar onAdminClick={() => setShowAdmin(true)} />
      <Hero onBookNow={openBooking} />
      <Rooms onBook={(room) => setBooking({ room, checkin: "", checkout: "", guests: "1" })} />
      <div className="divider" />
      <Services />
      <div className="divider" />
      <Gallery />
      <VideoSection />
      <About />
      <Testimonials />
      <Contact />
      <Footer onBook={openBooking} />

      {/* WhatsApp Float */}
      <a href="https://wa.me/9412000000?text=Hello! I'd like to know more about Shivalik Ice Hills, Guptkashi."
         target="_blank" rel="noopener noreferrer" className="wa-float" title="Chat on WhatsApp">
        <span style={{ fontSize: "1.5rem" }}>💬</span>
        <span className="wa-tooltip">Chat with us</span>
      </a>

      {/* Booking Modal */}
      {booking && (
        <BookingModal
          room={booking.room}
          preCheckin={booking.checkin}
          preCheckout={booking.checkout}
          preGuests={booking.guests}
          onClose={() => setBooking(null)}
        />
      )}

      {/* Admin Panel */}
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  );
}
