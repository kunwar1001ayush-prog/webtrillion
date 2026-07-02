"use client"
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Mail,
  Phone,
  Globe,
  X,
  Menu,
  Code2,
  Zap,
  Layers,
  Sparkles,
  Circle,
  Aperture,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Design tokens — muted earth / sage editorial system                */
/* ------------------------------------------------------------------ */
const C = {
  bg: "#FDFBF7",
  white: "#FFFFFF",
  ink: "#1C1C1A",
  inkSoft: "#5B5A52",
  inkFaint: "#8C8A80",
  sage: "#8A9A86",
  sageDeep: "#6B7A67",
  sageGlow: "#9BB0A5",
  sageMist: "#E4E9DF",
  slateDark: "#20221D",
  line: "rgba(28,28,26,0.12)",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');

.wt-root { font-family: 'Inter', sans-serif; background: ${C.bg}; color: ${C.ink}; }
.wt-serif { font-family: 'Playfair Display', serif; }
.wt-reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.9s cubic-bezier(.19,1,.22,1), transform 0.9s cubic-bezier(.19,1,.22,1); }
.wt-reveal.wt-in { opacity: 1; transform: translateY(0); }
.wt-phone { transition: transform 0.6s cubic-bezier(.19,1,.22,1), box-shadow 0.6s ease; }
.wt-phone:hover { transform: translateY(-10px) scale(1.035) !important; }
::selection { background: ${C.sageGlow}; color: white; }
.wt-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
.wt-scrollbar::-webkit-scrollbar-thumb { background: ${C.sage}; border-radius: 10px; }
`;

/* ------------------------------------------------------------------ */
/*  Image Assets — Curated for Editorial Sage Aesthetic              */
/* ------------------------------------------------------------------ */
const IMAGES = {
  // Mobile app/UI layouts
  mobile: [
    "https://i.pinimg.com/1200x/be/15/ea/be15ea386be772753c84b1b575119374.jpg", // Minimal fluid geometry
    "https://i.pinimg.com/736x/40/16/55/401655934b94d5154599e7d892f22827.jpg", // Sage clay composition
    "https://i.pinimg.com/736x/df/46/ba/df46ba9cad678cac330d42bbf00cb3ee.jpg", // Dark green architecture abstraction
    "https://i.pinimg.com/736x/2b/ce/9f/2bce9f01b9b5eb148d1697fda0531ff8.jpg", // Architectural concrete & plants
    "https://i.pinimg.com/1200x/4f/be/06/4fbe06d9ba5969acf9a20eea91e19d7a.jpg", // Modern abstract UI structure
    "https://i.pinimg.com/1200x/95/bd/a3/95bda3d9db02022ded02e65fdaf4a0f0.jpg", // Natural soft sand textures
    "https://i.pinimg.com/736x/b9/1b/18/b91b18f27f9df006cad75ebec4e67672.jpg", // Generative sage flow artwork
  ],
  // Grid interfaces
  grid: [
    "https://i.pinimg.com/1200x/90/63/93/9063936d4a74eafbe48a6b368f709f62.jpg", // Minimal dashboard UI
    "https://i.pinimg.com/1200x/53/21/d0/5321d0c8fa4135b841fef4970602872d.jpg", // Tech system workflow
    "https://i.pinimg.com/736x/96/78/ef/9678efd4b6e7d05212f20dbb01f96e40.jpg", // Clean financial layouts
    "https://i.pinimg.com/736x/47/11/17/4711173b36a56c01fc361b5f59880b12.jpg", // Fine detail wireframes
    "https://i.pinimg.com/736x/0f/b9/37/0fb93775111a2130800efe7a405fd0b5.jpg", // Clean designer interface blueprint
    "https://i.pinimg.com/1200x/3c/8c/91/3c8c9100400a931627b3a9902991c3ff.jpg", // Sophisticated minimal tone
  ],
  // Full editorial card layouts
  editorial: "https://i.pinimg.com/736x/57/79/42/577942ccac3d82b8b6422c302bb48adb.jpg", // Luxury minimal interior architecture
  // Flagship Project Backgrounds
  flagships: [
    "https://i.pinimg.com/736x/6c/8d/ca/6c8dca27861f31e2fe8cb957954a758d.jpg", // Abstract premium web system
    "https://i.pinimg.com/736x/e0/c9/60/e0c9602191f684457a59c16d6802c967.jpg", // Luxury boutique interior
    "https://i.pinimg.com/736x/a6/18/64/a6186419dc87a770da13d50ea38b4af7.jpg", // Refined dark digital platform
    "https://i.pinimg.com/736x/4d/ac/09/4dac091dd5348e05284992e4cf453ffd.jpg", // Elegant editorial design agency studio
    "https://i.pinimg.com/1200x/75/af/22/75af225f4527677306ea9b434b5c3f77.jpg",
    "https://i.pinimg.com/736x/1b/57/5e/1b575e9a8a845ae9bb43ab3312c5df1b.jpg",
    "https://i.pinimg.com/1200x/4f/be/06/4fbe06d9ba5969acf9a20eea91e19d7a.jpg",
  ]
};

/* ------------------------------------------------------------------ */
/*  Reveal-on-scroll hook                                              */
/* ------------------------------------------------------------------ */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, delay = 0, className = "", as: Tag = "div", style = {} }) {
  const [ref, inView] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`wt-reveal ${inView ? "wt-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/*  Phone frame                                                        */
/* ------------------------------------------------------------------ */
function PhoneFrame({ index, tilt, imgUrl }) {
  return (
    <div
      className="wt-phone flex-shrink-0"
      style={{
        transform: `rotate(${tilt}deg) translateY(${index % 2 === 0 ? 0 : 18}px)`,
      }}
    >
      <div
        className="rounded-[2rem] p-2"
        style={{ background: C.ink, width: 128, height: 260, boxShadow: "0 20px 45px rgba(28,28,26,0.18)" }}
      >
        <div className="w-full h-full rounded-[1.4rem] overflow-hidden relative" style={{ background: C.white }}>
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-2.5 rounded-full z-10"
            style={{ background: C.ink }}
          />
          <img 
            src={imgUrl} 
            alt={`Application Interface Preview ${index + 1}`}
            className="w-full h-full object-cover" 
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export default function WebTrillionLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", type: "Web Platform", budget: "" });
  const [sent, setSent] = useState(false);
  const heroRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    const el = heroRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    });
  }, []);

  const tilts = [-9, -5, -2, 0, 2, 5, 9];

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setModalOpen(false);
      setSent(false);
      setForm({ name: "", email: "", type: "Web Platform", budget: "" });
    }, 1800);
  };

  return (
    <div className="wt-root wt-scrollbar min-h-screen w-full overflow-x-hidden">
      <style>{FONTS}</style>

      {/* ------------------------------------------------------ A. Sticky accent bar */}
      {/* <div
        className="sticky top-0 z-50 w-full flex items-center justify-between px-6 md:px-10 py-2.5"
        style={{ background: C.sage }}
      >
        <div className="flex items-center gap-2 text-white">
          <Aperture size={14} strokeWidth={1.5} />
          <span className="text-[11px] tracking-[0.2em] uppercase font-medium hidden sm:inline">
            Now booking Q4 2026 slots
          </span>
        </div>
        <span className="text-[11px] md:text-xs tracking-[0.25em] uppercase font-medium text-white">
          WebTrillion Studio
        </span>
      </div> */}

      {/* ------------------------------------------------------ Nav */}
      <nav className="w-full flex items-center justify-between px-6 md:px-10 py-6">
        <span className="wt-serif text-lg tracking-wide" style={{ color: C.ink }}>
          WT
        </span>
        <div className="hidden md:flex items-center gap-10 text-[13px] tracking-wide" style={{ color: C.inkSoft }}>
          <a href="#work" className="hover:opacity-60 transition-opacity">Work</a>
          <a href="#studio" className="hover:opacity-60 transition-opacity">Studio</a>
          <a href="#projects" className="hover:opacity-60 transition-opacity">Flagships</a>
          <a href="#contact" className="hover:opacity-60 transition-opacity">Contact</a>
        </div> 


        <button
          onClick={() => setModalOpen(true)}
          className="hidden md:flex items-center gap-1.5 text-[13px] tracking-wide px-4 py-2 rounded-full border transition-colors"
          style={{ borderColor: C.ink, color: C.ink }}
        >
          Inquire <ArrowUpRight size={14} />
        </button>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-5 px-6 pb-8 text-sm" style={{ color: C.inkSoft }}>
          <a href="#work">Work</a>
          <a href="#studio">Studio</a>
          <a href="#projects">Flagships</a>
          <a href="#contact">Contact</a>
        </div>
      )}

      {/* ------------------------------------------------------ B. Hero */}
      <header
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="px-6 md:px-10 pt-8 pb-20 md:pt-14 md:pb-28 flex flex-col items-center text-center"
      >
        <Reveal>
          <div className="wt-serif italic text-sm md:text-base mb-6" style={{ color: "#000080" }}>
            An agency for people who refuse a template
          </div>
        </Reveal>

        <Reveal delay={80}>
  <h1
    className="
      wt-serif
      font-black
      italic
      leading-[0.85]
      tracking-[-0.00em]
      bg-gradient-to-r
      from-[#17134f]
      via-[#3024a8]
      to-[#4b38ff]
      bg-clip-text
      text-transparent
    "
    style={{
      fontSize: "clamp(3rem, 10vw, 7rem)",
      maxWidth: "16ch",
    }}
  >
    Webtrillion
  </h1>
</Reveal>

        <Reveal delay={160}>
          <p
            className="mt-6 text-[13px] md:text-sm tracking-[0.3em] uppercase font-medium"
            style={{ color: "#000080", maxWidth: "26ch" }}
          >
            Your brand's entire digital ecosystem
          </p>
        </Reveal>

        {/* Smartphone Grid with Real UI Layout Images */}
        <div className="mt-16 md:mt-24 w-full flex justify-center">
          <div className="flex gap-3 md:gap-5 items-center flex-wrap justify-center max-w-6xl">
            {tilts.map((t, i) => (
              <Reveal key={i} delay={i * 90} className="wt-reveal">
                <div
                  style={{
                    transform: `translate(${mouse.x * (i - 3) * 2}px, ${mouse.y * 6}px)`,
                    transition: "transform 0.3s ease-out",
                  }}
                >
                  <PhoneFrame index={i} tilt={t} imgUrl={IMAGES.mobile[i % IMAGES.mobile.length]} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------ C. Row 1 — Tech Stack Masonry */}
      <section id="work" className="px-6 md:px-10 py-16 md:py-24">
        <Reveal>
          <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
            <h2 className="wt-serif text-2xl md:text-3xl" style={{ color: "#000080"}}>
              The tech stack cookout
            </h2>
            <span className="text-xs tracking-widest uppercase" style={{ color: C.inkFaint }}>
              Selected interfaces, 2025–2026
            </span>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[130px] md:auto-rows-[160px]">
          {[
            { img: IMAGES.grid[0], span: "row-span-2 col-span-1" },
            { img: IMAGES.grid[1], span: "row-span-1 col-span-1" },
            { img: IMAGES.grid[2], span: "row-span-1 col-span-1" },
            { img: IMAGES.grid[3], span: "row-span-2 col-span-1" },
            { img: IMAGES.grid[4], span: "row-span-1 col-span-2 md:col-span-1" },
            { img: IMAGES.mobile[4], span: "row-span-1 col-span-1" },
            { img: IMAGES.grid[5], span: "row-span-1 col-span-1" },
            { img: IMAGES.mobile[5], span: "row-span-1 col-span-1" },
          ].map((item, i) => (
            <Reveal key={i} delay={i * 60} className={`${item.span} rounded-2xl overflow-hidden border`} style={{ borderColor: C.line }}>
              <img src={item.img} alt={`Tech Interface Preview ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------ Row 2 — Split editorial */}
      <section id="studio" className="px-6 md:px-10 py-16 md:py-28 grid md:grid-cols-2 gap-14 md:gap-10">
        {/* Left Side */}
        <div>
          <Reveal delay={80}>
  <h1
    className="
      wt-serif
      font-black
      italic
      leading-[0.85]
      tracking-[-0.00em]
      bg-gradient-to-r
      from-[#17134f]
      via-[#3024a8]
      to-[#4b38ff]
      bg-clip-text
      text-transparent
    "
    style={{
      fontSize: "clamp(3rem, 10vw, 7rem)",
      maxWidth: "16ch",
    }}
  >
    Webtrillion
  </h1>
</Reveal>
          <Reveal delay={80}>
            <p className="wt-serif italic mt-4 text-lg md:text-xl leading-snug" style={{ color: "#000080", maxWidth: "34ch" }}>
              We don't just build websites — we engineer digital experiences that scale.
            </p>
          </Reveal>

          {/* Overlapping Floating Image Stack */}
          <Reveal delay={160} className="mt-10 relative h-64 md:h-80">
            <div className="absolute left-0 top-6 w-3/5 h-40 rounded-2xl overflow-hidden shadow-lg border" style={{ borderColor: C.line }}>
              <img src={IMAGES.grid[1]} alt="Workspace metric" className="w-full h-full object-cover" />
            </div>
            <div className="absolute right-0 top-0 w-2/5 h-32 rounded-2xl overflow-hidden shadow-lg border" style={{ borderColor: C.line }}>
              <img src={IMAGES.mobile[1]} alt="Interface asset" className="w-full h-full object-cover" />
            </div>
            <div className="absolute left-10 bottom-0 w-1/2 h-32 rounded-2xl overflow-hidden shadow-lg border" style={{ borderColor: C.line }}>
              <img src={IMAGES.grid[4]} alt="Structure viewport" className="w-full h-full object-cover" />
            </div>
          </Reveal>
        </div>

        {/* Right Side */}
        <div>
          <Reveal>
            <div className="w-full h-56 md:h-72 rounded-3xl overflow-hidden border shadow-inner relative" style={{ borderColor: C.line }}>
              <img src={IMAGES.editorial} alt="Studio interior architecture design" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {[
              { icon: Sparkles, label: "Custom animation systems" },
              { icon: Layers, label: "Deep API integrations" },
              { icon: Zap, label: "Sub-second TTFB" },
              { icon: Code2, label: "Hand-tuned architecture" },
            ].map((f, i) => (
              <Reveal
                key={i}
                delay={i * 80}
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{ background: C.white, border: `1px solid ${C.line}` }}
              >
                <f.icon size={18} strokeWidth={1.5} color={C.sageDeep} />
                <span className="text-sm" style={{ color: C.inkSoft }}>{f.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ D. Absolute Creation */}
      <section className="px-6 md:px-10 py-16 md:py-24">
        <Reveal className="text-center mb-12 md:mb-16">
          <p className="wt-serif italic" style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)", color: "#000080" }}>
            The feel of absolute creation
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Left Layout Grid — Mixed Layout Previews */}
          <Reveal className="grid grid-cols-2 gap-3 md:gap-4">
            {[IMAGES.grid[3], IMAGES.mobile[2], IMAGES.mobile[6], IMAGES.grid[0]].map((src, i) => (
              <div key={i} className="h-36 md:h-44 rounded-2xl overflow-hidden border" style={{ borderColor: C.line }}>
                <img src={src} alt={`Composition preview ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </Reveal>

          {/* Right Layout Grid — Brand Spec Sheets */}
          <Reveal delay={100} className="grid grid-cols-3 gap-3 md:gap-4">
            <div className="col-span-3 h-20 rounded-2xl flex overflow-hidden border" style={{ borderColor: C.line }}>
              {[C.ink, C.sage, C.sageGlow, C.sageMist, "#D8D4C6"].map((c, i) => (
                <div key={i} style={{ background: c, flex: 1 }} />
              ))}
            </div>
            <div
              className="col-span-2 h-32 rounded-2xl p-5 flex flex-col justify-center gap-1"
              style={{ background: C.white, border: `1px solid ${C.line}` }}
            >
              <span className="wt-serif text-xl" style={{ color: C.ink }}>Aa Bb Cc</span>
              <span className="text-xs tracking-widest uppercase" style={{ color: C.inkFaint }}>
                Playfair Display / Inter
              </span>
            </div>
            <div className="h-32 rounded-2xl overflow-hidden border" style={{ borderColor: C.line }}>
              <img src={IMAGES.mobile[3]} alt="Color swatches design variant" className="w-full h-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------ E. Vertical Film Strip (Flagships) */}
      <section id="projects" className="px-6 md:px-10 py-16 md:py-24">

  <Reveal>
    <h2
      className="wt-serif text-2xl md:text-3xl mb-8"
      style={{ color:"#000080" }}
    >
      Flagship launches
    </h2>
  </Reveal>


  <div className="relative overflow-hidden rounded-[2.5rem] bg-black py-16">


    {/* Glow background */}
    <div
      className="
        absolute
        inset-0
        bg-[radial-gradient(circle_at_center,rgba(120,255,0,0.25),transparent_45%)]
      "
    />


    {/* Image carousel */}
    <div
      className="
        relative
        flex
        items-center
        justify-center
        gap-4
        md:gap-8
        perspective-[1200px]
      "
    >

      {[
        IMAGES.flagships[0],
        IMAGES.flagships[1],
        IMAGES.flagships[2],
        IMAGES.flagships[3],
        IMAGES.flagships[4],
        IMAGES.flagships[5],
        IMAGES.flagships[6],
      ].map((img, i) => (

        <div
          key={i}
          className={`
            shrink-0
            overflow-hidden
            rounded-2xl
            border
            border-white/10
            transition-all
            duration-700
            shadow-2xl

            ${
              i === 3
                ? "w-44 h-64 md:w-64 md:h-80 scale-110 z-20"
                : "w-28 h-48 md:w-44 md:h-64 opacity-80"
            }

            ${
              i < 3
                ? "-rotate-[8deg]"
                : i > 3
                ? "rotate-[8deg]"
                : ""
            }
          `}
        >

          <img
            src={img}
            alt="Project showcase"
            className="
              w-full
              h-full
              object-cover
              transition-transform
              duration-700
              hover:scale-110
            "
          />

        </div>

      ))}

    </div>



    {/* Feature text */}
    <div
      className="
        relative
        grid
        grid-cols-3
        mt-14
        px-8
        text-center
      "
    >

      {[
        "Lightning-Fast\nImage Generation",
        "Multiple Styles &\nCustomization",
        "High-Resolution\nDownloads",
      ].map((text, i) => (

        <div key={i}>

          <p
            className="
              whitespace-pre-line
              text-xs
              md:text-sm
              text-white/70
              tracking-wide
            "
          >
            {text}
          </p>

        </div>

      ))}

    </div>


  </div>


</section>

      {/* ------------------------------------------------------ F. Footer / CTA */}
      <section id="contact" className="px-6 md:px-10 py-20 md:py-28" style={{ background: C.bg }}>
  <Reveal>
    <h2
      className="wt-serif text-center leading-[1.02]"
      style={{ fontSize: "clamp(2.2rem, 6vw, 4.2rem)", color: "#000080" }}
    >
      For booking /<br />consultation
    </h2>
  </Reveal>

  <Reveal delay={100} className="flex justify-center gap-8 md:gap-12 mt-8 flex-wrap text-sm" style={{ color: C.inkSoft }}>
    <a href="mailto:studio@webtrillion.com" className="flex items-center gap-2 hover:opacity-60 transition-opacity">
      <Mail size={15} strokeWidth={1.5} /> studio@webtrillion.com
    </a>
    <a href="tel:+10000000000" className="flex items-center gap-2 hover:opacity-60 transition-opacity">
      <Phone size={15} strokeWidth={1.5} /> +91 (924) 451 4919
    </a>
    <a href="#" className="flex items-center gap-2 hover:opacity-60 transition-opacity">
      <Globe size={15} strokeWidth={1.5} /> @webtrillion
    </a>
    <a href="#" className="flex items-center gap-2 hover:opacity-60 transition-opacity">
      <Globe size={15} strokeWidth={1.5} /> WebTrillion Studio
    </a>
  </Reveal>

  {/* Viewfinder widget with Left and Right floating images */}
  <Reveal delay={180} className="mt-14 md:mt-20 flex justify-center">
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 w-full max-w-6xl unified-layout-container">
      
      {/* Left side image */}
      <div className="w-full max-w-[240px] md:max-w-[280px] aspect-[3/4] rounded-2xl overflow-hidden shadow-lg transform md:-rotate-3 transition-transform hover:rotate-0 duration-300">
        <img 
          src="https://i.pinimg.com/736x/6c/8d/ca/6c8dca27861f31e2fe8cb957954a758d.jpg" 
          alt="Project showcase left" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Center Black Box Viewfinder Widget */}
      <div
        className="relative w-full max-w-xl rounded-3xl p-1.5 shrink-0"
        style={{ background: C.ink }}
      >
        <div
          className="rounded-[1.3rem] px-8 py-14 md:py-20 flex flex-col items-center text-center relative overflow-hidden"
          style={{ background: C.slateDark }}
        >
          {/* Viewfinder corners */}
          {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} w-4 h-4`}
              style={{
                borderTop: pos.includes("top") ? `1.5px solid ${C.sageGlow}` : "none",
                borderBottom: pos.includes("bottom") ? `1.5px solid ${C.sageGlow}` : "none",
                borderLeft: pos.includes("left") ? `1.5px solid ${C.sageGlow}` : "none",
                borderRight: pos.includes("right") ? `1.5px solid ${C.sageGlow}` : "none",
              }}
            />
          ))}

          <div className="flex items-center gap-2 mb-6">
            <Circle size={7} fill={C.sageGlow} color={C.sageGlow} />
            <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: C.sageGlow }}>
              Rec &nbsp;·&nbsp; New Inquiry
            </span>
          </div>

          <p className="text-white text-lg md:text-2xl wt-serif italic leading-snug max-w-sm">
            Don't just want a website? Build an empire.
          </p>

          <button
            onClick={() => setModalOpen(true)}
            className="mt-8 flex items-center gap-2 px-7 py-3 rounded-full text-sm tracking-wide transition-transform hover:scale-105"
            style={{ background: C.sageGlow, color: C.slateDark }}
          >
            Launch Project <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Right side image */}
      <div className="w-full max-w-[240px] md:max-w-[280px] aspect-[3/4] rounded-2xl overflow-hidden shadow-lg transform md:rotate-3 transition-transform hover:rotate-0 duration-300">
        <img 
          src="https://i.pinimg.com/1200x/21/61/14/216114ba425ff3509206fa26d05830f5.jpg" 
          alt="Project showcase right" 
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  </Reveal>
</section>

      {/* ------------------------------------------------------ Bottom bar */}
      <footer
        className="px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] tracking-wide"
        style={{ background: C.slateDark, color: "rgba(255,255,255,0.55)" }}
      >
        <span>© 2026 WebTrillion</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Terms &amp; Support</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        </div>
        <span>Designed with precision</span>
      </footer>

      {/* ------------------------------------------------------ Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          style={{ background: "rgba(28,28,26,0.6)" }}
          onClick={() => setModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl p-8 relative"
            style={{ background: C.bg }}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5"
              style={{ color: C.inkSoft }}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {!sent ? (
              <>
                <h3 className="wt-serif text-2xl mb-1" style={{ color: C.ink }}>
                  Inquire now
                </h3>
                <p className="text-sm mb-6" style={{ color: C.inkFaint }}>
                  Tell us what you're building. We reply within 48 hours.
                </p>
                <form onSubmit={submit} className="flex flex-col gap-4">
                  <input
                    required
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: C.white, border: `1px solid ${C.line}`, color: C.ink }}
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: C.white, border: `1px solid ${C.line}`, color: C.ink }}
                  />
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: C.white, border: `1px solid ${C.line}`, color: C.ink }}
                  >
                    <option>Web Platform</option>
                    <option>E-Commerce</option>
                    <option>SaaS Dashboard</option>
                    <option>Brand Identity</option>
                  </select>
                  <input
                    placeholder="Estimated budget"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className="px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: C.white, border: `1px solid ${C.line}`, color: C.ink }}
                  />
                  <button
                    type="submit"
                    className="mt-2 py-3 rounded-full text-sm tracking-wide text-white transition-opacity hover:opacity-90"
                    style={{ background: C.ink }}
                  >
                    Send inquiry
                  </button>
                </form>
              </>
            ) : (
              <div className="py-10 flex flex-col items-center text-center gap-3">
                <Sparkles color={C.sageDeep} size={28} strokeWidth={1.3} />
                <p className="wt-serif text-xl" style={{ color: C.ink }}>
                  Received.
                </p>
                <p className="text-sm" style={{ color: C.inkFaint }}>
                  We'll be in touch shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}