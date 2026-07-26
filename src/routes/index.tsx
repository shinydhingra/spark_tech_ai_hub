import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Brain, Rocket, Users, Trophy, Code2, Briefcase, Sparkles, Calendar,
  GraduationCap, Network, Handshake, Star, ArrowRight, Link2, Camera,
  MessageCircle, Mail, ChevronRight, Zap, Target, Heart,
} from "lucide-react";
import heroAi from "@/assets/hero-ai.jpg";
import fardeen from "@/assets/team-fardeen.png";
import shiny from "@/assets/team-shiny.png";
import { SparkLogo } from "@/components/SparkLogo";
import { Chatbot } from "@/components/Chatbot";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen w-full overflow-x-clip text-foreground">
      <Nav />
      <Hero />
      <About />
      <Stats />
      <Programs />
      <Gallery />
      <Testimonials />
      <Team />
      <Community />
      <Partners />
      <WhyChoose />
      <CTA />
      <Footer />
      <Chatbot />
    </div>
  );
}

/* ---------- Reusable ---------- */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 md:py-28 ${className}`}>
      {children}
    </section>
  );
}

function SectionTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      className="mx-auto mb-16 max-w-2xl text-center"
    >
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
        <Sparkles className="h-3 w-3" /> {eyebrow}
      </div>
      <h2 className="text-3xl font-semibold sm:text-4xl md:text-5xl">
        <span className="text-gradient">{title}</span>
      </h2>
      {subtitle && <p className="mt-4 text-base text-muted-foreground md:text-lg">{subtitle}</p>}
    </motion.div>
  );
}

/* ---------- Nav ---------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    ["About", "#about"],
    ["Programs", "#programs"],
    ["Events", "#events"],
    ["Team", "#team"],
    ["Community", "#community"],
  ];
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all ${
        scrolled ? "glass backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 sm:px-6 md:flex md:justify-between">
        <SparkLogo className="min-w-0" />
        <nav className="hidden items-center gap-8 md:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {label}
            </a>
          ))}
        </nav>
        <a
          href="https://chat.whatsapp.com/DL3S2U6W6zHJFREu11Oht0"
          target="_blank" rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--gradient-brand)] px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
        >
          Join Community <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.5_0.2_285/0.35),transparent)]" />
      </div>
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/35 bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-foreground shadow-[0_0_30px_-18px_var(--color-primary)] backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Powered by Community · AI-first
          </div>
          <h1 className="text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
            Learn AI.<br />
            <span className="text-gradient">Build Projects.</span><br />
            Join the Community.
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
            Empowering students and professionals through AI workshops, hackathons,
            real-world projects, and an active tech community.
          </p>
          <div className="mt-8 flex flex-col gap-3 min-[430px]:flex-row min-[430px]:flex-wrap">
            <a
              href="https://chat.whatsapp.com/DL3S2U6W6zHJFREu11Oht0"
              target="_blank" rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.03]"
            >
              Join Community <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#events"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-secondary/40 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Explore Events
            </a>
          </div>
          <div className="mt-10 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 text-sm text-muted-foreground sm:flex sm:gap-6">
            <div className="flex -space-x-2">
              {[fardeen, shiny, "/media/IMG_20260117_100702751_HDR.jpg", "/media/IMG_20260117_105713312_HDR.jpg"].map((s, i) => (
                <img key={i} src={s} className="h-8 w-8 rounded-full border-2 border-background object-cover" alt="" />
              ))}
            </div>
            <span className="min-w-0">500+ builders learning together</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="glass relative overflow-hidden rounded-3xl p-2 shadow-[var(--shadow-card)]">
            <img src={heroAi} alt="AI neural network" className="rounded-2xl" width={1600} height={1200} />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary/20 via-transparent to-accent/20" />
          </div>
          <div className="glass absolute -left-6 top-10 hidden rounded-2xl p-3 md:block" style={{ animation: "float-y 6s ease-in-out infinite" }}>
            <div className="flex items-center gap-2 text-xs">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--gradient-brand)]"><Brain className="h-4 w-4 text-background" /></div>
              <div>
                <div className="font-semibold">AI Workshops</div>
                <div className="text-muted-foreground">Live · every week</div>
              </div>
            </div>
          </div>
          <div className="glass absolute -right-4 bottom-8 hidden rounded-2xl p-3 md:block" style={{ animation: "float-y 7s ease-in-out infinite reverse" }}>
            <div className="flex items-center gap-2 text-xs">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--gradient-brand)]"><Trophy className="h-4 w-4 text-background" /></div>
              <div>
                <div className="font-semibold">Hackathons</div>
                <div className="text-muted-foreground">Build · ship · win</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- About ---------- */
function About() {
  const items = [
    { icon: Brain, title: "AI Learning", text: "Structured tracks from fundamentals to LLMs, agents & MLOps." },
    { icon: Users, title: "Community", text: "A supportive network of curious builders and mentors." },
    { icon: Network, title: "Networking", text: "Meet founders, engineers, and hiring partners in tech." },
    { icon: Trophy, title: "Hackathons", text: "Ship real products under pressure — win prizes and offers." },
    { icon: GraduationCap, title: "Workshops", text: "Hands-on sessions on the hottest stacks in AI." },
    { icon: Briefcase, title: "Career Growth", text: "Portfolio-worthy projects and referrals to top companies." },
  ];
  return (
    <Section id="about">
      <SectionTitle
        eyebrow="About Spark"
        title="Where curiosity turns into real AI skills"
        subtitle="SPARK Tech AI Hub is a movement for students and professionals to learn, build and grow together in the age of AI."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -6 }}
            className="glass group relative overflow-hidden rounded-2xl p-6"
          >
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="mb-4 inline-grid h-11 w-11 place-items-center rounded-xl bg-[var(--gradient-brand)] text-background">
              <it.icon className="h-5 w-5" />
            </div>
            <h3 className="mb-1 text-lg font-semibold">{it.title}</h3>
            <p className="text-sm text-muted-foreground">{it.text}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Stats ---------- */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 1400;
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

function Stats() {
  const stats = [
    { n: 500, s: "+", label: "Community Members" },
    { n: 40, s: "+", label: "Events Hosted" },
    { n: 12, s: "", label: "Hackathons" },
    { n: 60, s: "+", label: "Workshops" },
    { n: 150, s: "+", label: "Projects Built" },
    { n: 25, s: "+", label: "Industry Mentors" },
  ];
  return (
    <Section className="!py-16">
      <div className="glass rounded-3xl p-8 md:p-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-semibold text-gradient md:text-4xl">
                <Counter to={s.n} suffix={s.s} />
              </div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------- Programs ---------- */
function Programs() {
  const items = [
    { icon: Brain, title: "AI Workshops", text: "Deep-dive sessions on LLMs, agents, RAG, vision and more." },
    { icon: Trophy, title: "Hackathons", text: "48-hour build sprints with mentors, prizes, and hiring partners." },
    { icon: Rocket, title: "Bootcamps", text: "Intensive multi-week programs to level-up your AI skills fast." },
    { icon: Code2, title: "AI Projects", text: "Ship real, portfolio-ready projects reviewed by industry mentors." },
    { icon: Users, title: "Community Meetups", text: "Casual meetups to connect, share, and learn from peers." },
    { icon: Handshake, title: "Startup Networking", text: "Meet founders and investors building the AI future." },
  ];
  return (
    <Section id="programs">
      <SectionTitle eyebrow="Programs" title="Featured programs" subtitle="Pick your path — every program is hands-on and community-driven." />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <motion.a
            key={it.title}
            href="#events"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -6 }}
            className="glass group relative flex flex-col overflow-hidden rounded-2xl p-6"
          >
            <div className="mb-4 inline-grid h-12 w-12 place-items-center rounded-xl bg-secondary/60 ring-1 ring-border">
              <it.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{it.text}</p>
            <div className="mt-6 inline-flex items-center gap-1 text-sm text-primary opacity-70 transition-opacity group-hover:opacity-100">
              Learn more <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </motion.a>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Gallery ---------- */
function Gallery() {
  const events = [
    // SnowFrost Hackathon – Jan 17, 2026
    { src: "/media/VID-20260117-WA0169.mp4",          type: "video" as const, name: "SnowFrost Hackathon",           blurb: "Flagship hackathon at Jamia — packed hall of builders shipping AI solutions overnight." },
    { src: "/media/IMG_20260117_104454066_HDR.jpg",    type: "image" as const, name: "SnowFrost Hackathon",           blurb: "Builders deep in the zone — late-night code sprints, energy drinks and big ideas." },
    { src: "/media/hackathon_10.jpg",                  type: "image" as const, name: "SnowFrost Hackathon",           blurb: "Crowd of passionate hackers gathered for the opening keynote session." },
    { src: "/media/hackathon_06.jpg",                  type: "image" as const, name: "SnowFrost Hackathon",           blurb: "Teams collaborating across tracks — AI, Web3, and sustainability challenges." },
    { src: "/media/IMG_20260117_100702751_HDR.jpg",    type: "image" as const, name: "SnowFrost Hackathon",           blurb: "Demo day in full swing — teams presenting their 24-hour builds to judges." },
    { src: "/media/hackathon_07.jpg",                  type: "image" as const, name: "SnowFrost Hackathon",           blurb: "Community vibes at its best — smiles, stickers, and shipping real products." },
    { src: "/media/IMG_20260117_104600818_HDR.jpg",    type: "image" as const, name: "SnowFrost Hackathon",           blurb: "Post-build energy — the room buzzing after an intense night of building." },
    { src: "/media/hackathon_12.jpg",                  type: "image" as const, name: "SnowFrost Hackathon",           blurb: "Winners being announced — hard work, creativity, and community spirit rewarded." },
    { src: "/media/IMG_20260117_105713312_HDR.jpg",    type: "image" as const, name: "SnowFrost Hackathon",           blurb: "Group photo of the SnowFrost cohort — the people who make Spark what it is." },
    { src: "/media/VID-20260117-WA0170.mp4",           type: "video" as const, name: "SnowFrost Hackathon · Live",    blurb: "Live coverage from the hackathon floor — pitches, chaos, and coffee." },
    { src: "/media/VID-20260117-WA0172.mp4",           type: "video" as const, name: "SnowFrost Hackathon · Full",    blurb: "Highlights from the full event — the energy, the building, and the people." },
    { src: "/media/VID-20260117-WA0174.mp4",           type: "video" as const, name: "SnowFrost Hackathon · Final",   blurb: "Closing ceremony and final project showcases." },
    { src: "/media/VID-20260118-WA0031.mp4",           type: "video" as const, name: "SnowFrost Hackathon · Winners", blurb: "Winning teams celebrating their hard work and creativity." },
    // Spark Tech Event 2025 – Professional shoot
    { src: "/media/event2025_01.jpg",                  type: "image" as const, name: "Spark Tech Event 2025",         blurb: "Professional keynote session — speakers sharing cutting-edge AI insights with the community." },
    { src: "/media/event2025_06.jpg",                  type: "image" as const, name: "Spark Tech Event 2025",         blurb: "Networking hour — founders, engineers, and students connecting over shared passion for AI." },
    { src: "/media/event2025_07.jpg",                  type: "image" as const, name: "Spark Tech Event 2025",         blurb: "Panel discussion on the future of AI in India — real talk, real builders." },
    { src: "/media/event2025_14.jpg",                  type: "image" as const, name: "Spark Tech Event 2025",         blurb: "Award ceremony — recognising the best projects and community contributors." },
    { src: "/media/event2025_17.jpg",                  type: "image" as const, name: "Spark Tech Event 2025",         blurb: "Crowd energy at peak — a room full of AI-first builders ready to change things." },
    { src: "/media/event2025_18.jpg",                  type: "image" as const, name: "Spark Tech Event 2025",         blurb: "Closing session — gratitude, connections made, and ideas to carry forward." },
  ];
  const track = [...events, ...events];
  const [lightbox, setLightbox] = useState<{ src: string; type: "image" | "video" } | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      events.map(
        (e) =>
          new Promise<void>((resolve) => {
            if (e.type === "video") {
              const vid = document.createElement("video");
              vid.onloadeddata = () => resolve();
              vid.onerror = () => resolve();
              vid.src = e.src;
            } else {
              const img = new Image();
              img.onload = () => resolve();
              img.onerror = () => resolve();
              img.src = e.src;
            }
          })
      )
    ).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Section id="events">
      <SectionTitle
        eyebrow="Event Gallery"
        title="Moments from our hackathons & meetups"
        subtitle="From late-night code sprints to trophy lifts — this is what community feels like."
      />
      <div className="events-viewport">
        <div className={`events-track ${ready ? "is-ready" : ""}`}>
          {track.map((e, i) => (
            <button
              key={`${e.src}-${i}`}
              onClick={() => setLightbox({ src: e.src, type: e.type })}
              aria-hidden={i >= events.length}
              className="events-card glass group/card relative flex flex-col overflow-hidden rounded-2xl text-left shadow-[var(--shadow-card)] transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[var(--shadow-glow)]"
            >
              <div className="events-card-media">
                {e.type === "video" ? (
                  <video
                    src={e.src}
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.08]"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    onMouseEnter={(ev) => (ev.target as HTMLVideoElement).play()}
                    onMouseLeave={(ev) => { (ev.target as HTMLVideoElement).pause(); (ev.target as HTMLVideoElement).currentTime = 0; }}
                  />
                ) : (
                  <img
                    src={e.src}
                    alt={e.name}
                    loading="eager"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.08]"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className={`mb-2 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest backdrop-blur ${
                  e.name.includes("SnowFrost") ? "border-amber-400/40 bg-amber-400/10 text-amber-300" :
                  e.name.includes("Spark Tech") ? "border-primary/30 bg-primary/10 text-foreground" :
                  "border-primary/30 bg-primary/10 text-foreground"
                }`}>
                  {e.type === "video" ? <span>▶</span> : e.name.includes("SnowFrost") ? <Trophy className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                  {e.name.includes("SnowFrost") ? "Hackathon" : "Event 2025"}
                </div>
                <div className="break-words text-base font-semibold text-foreground">{e.name}</div>
                <p className="mt-2 line-clamp-3 break-words text-sm leading-relaxed text-muted-foreground">{e.blurb}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      {lightbox && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-background/90 p-6 backdrop-blur-xl"
          onClick={() => setLightbox(null)}
        >
          {lightbox.type === "video" ? (
            <video
              src={lightbox.src}
              controls
              playsInline
              className="max-h-[85vh] max-w-5xl rounded-2xl"
            />
          ) : (
            <img src={lightbox.src} className="max-h-[85vh] max-w-5xl rounded-2xl" alt="" />
          )}
        </div>
      )}
    </Section>
  );
}

/* ---------- Testimonials ---------- */
function Testimonials() {
  const items = [
    { name: "Community Member", role: "Hackathon Participant", src: "/media/VID-20260117-WA0172.mp4" },
    { name: "Community Member", role: "Workshop Attendee", src: "/media/VID-20260117-WA0174.mp4" },
    { name: "Community Member", role: "Bootcamp Alum", src: "/media/VID-20260118-WA0031.mp4" },
    { name: "Community Member", role: "Meetup Speaker", src: "/media/VID-20260117-WA0169.mp4" },
  ];
  return (
    <Section>
      <SectionTitle eyebrow="Testimonials" title="Hear it from our community" subtitle="Real voices from members who built, shipped and grew with SPARK." />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((t, i) => (
          <motion.div
            key={`${t.role}-${i}`}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="glass group flex flex-col overflow-hidden rounded-2xl p-3"
          >
            <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-black">
              <video
                src={t.src}
                controls
                playsInline
                preload="metadata"
                controlsList="nodownload"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex items-center gap-2 px-2 pt-3 pb-1">
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-3 w-3 fill-current" />)}
              </div>
              <div className="ml-auto text-[11px] text-muted-foreground">{t.role}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Team ---------- */
function Team() {
  const team = [
    { name: "Fardeen Ansari", role: "Founder & CEO", img: fardeen, url: "https://www.linkedin.com/in/fardeen-ansari-642a352aa" },
    { name: "Shiny Dhingra", role: "Associate Graphic Designer", img: shiny, url: "https://www.linkedin.com/in/shiny-dhingra-62097b324" },
  ];
  return (
    <Section id="team">
      <SectionTitle eyebrow="Team" title="The people behind Spark" subtitle="A small, passionate team building the AI community from the ground up." />
      <div className="mx-auto flex w-full max-w-6xl flex-wrap justify-center gap-6">
        {team.map((m, i) => (
          <motion.a
            key={m.name}
            href={m.url} target="_blank" rel="noreferrer"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
            whileHover={{ y: -6, scale: 1.03 }}
            className="glass team-card group flex w-[290px] flex-col items-center rounded-2xl p-5 text-center shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-glow)]"
          >
            <div className="relative">
              <div className="absolute -inset-1.5 rounded-2xl bg-[var(--gradient-brand)] opacity-40 blur-lg transition-opacity duration-300 group-hover:opacity-80" />
              <div className="relative grid h-[220px] w-[220px] place-items-center overflow-hidden rounded-2xl bg-secondary/40 ring-1 ring-border">
                <img
                  src={m.img}
                  alt={m.name}
                  loading="lazy"
                  className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  style={{ objectFit: "contain", objectPosition: "center" }}
                />
              </div>
            </div>
            <h3 className="mt-4 w-full truncate text-base font-semibold">{m.name}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{m.role}</p>
            <div className="mt-2 inline-flex items-center gap-1 text-xs text-primary">
              <Link2 className="h-3 w-3" /> LinkedIn
            </div>
          </motion.a>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Community ---------- */
function Community() {
  const links = [
    { icon: Link2, name: "LinkedIn", handle: "@spark-tech-ai-hub", url: "https://www.linkedin.com/company/spark-tech-ai-hub/" },
    { icon: Camera, name: "Camera", handle: "@spark_tech_ai_hub", url: "https://www.instagram.com/spark_tech_ai_hub" },
    { icon: MessageCircle, name: "WhatsApp Community", handle: "Join the group chat", url: "https://chat.whatsapp.com/DL3S2U6W6zHJFREu11Oht0" },
  ];
  return (
    <Section id="community">
      <SectionTitle eyebrow="Community" title="Come hang out with us" subtitle="Follow, join, and say hi — we love meeting new builders." />
      <div className="grid gap-6 md:grid-cols-3">
        {links.map((l, i) => (
          <motion.a
            key={l.name}
            href={l.url} target="_blank" rel="noreferrer"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -6 }}
            className="glass group flex items-center gap-4 rounded-2xl p-6"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--gradient-brand)] text-background">
              <l.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">{l.name}</div>
              <div className="text-xs text-muted-foreground">{l.handle}</div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </motion.a>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Partners ---------- */
function Partners() {
  const sponsors = [
    { name: "Google for Developers", domain: "developers.google.com" },
    { name: "Neo4j", domain: "neo4j.com" },
    { name: "Perplexity", domain: "perplexity.ai" },
    { name: "Duality AI", domain: "duality.ai" },
    { name: "Coding Blocks", domain: "codingblocks.com" },
    { name: "GeeksforGeeks", domain: "geeksforgeeks.org" },
    { name: "Coding Ninjas", domain: "codingninjas.com" },
    { name: "Domino's", domain: "dominos.co.in" },
    { name: "Campa", domain: "campacola.in" },
    { name: "SBI", domain: "sbi.co.in" },
    { name: "HDFC", domain: "hdfcbank.com" },
    { name: ".xyz", domain: "gen.xyz" },
  ];
  const track = [...sponsors, ...sponsors];

  return (
    <Section>
      <SectionTitle eyebrow="Partners & Sponsors" title="Backed by the Best" subtitle="Proud to partner with industry leaders who support our mission." />
      <div className="marquee-viewport">
        <div className="marquee-track gap-4 sm:gap-6 md:gap-8">
          {track.map((s, i) => (
            <div key={`${s.name}-${i}`} className="glass flex h-16 w-48 shrink-0 items-center justify-start gap-4 rounded-xl border border-white/5 bg-white/5 px-5 shadow-sm backdrop-blur-md transition-all hover:bg-white/10 sm:h-20 sm:w-56">
              <img
                src={`https://www.google.com/s2/favicons?domain=${s.domain}&sz=64`}
                alt={`${s.name} logo`}
                className="h-8 w-8 rounded-md object-contain sm:h-10 sm:w-10"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span className="text-sm font-semibold tracking-wide text-foreground/80">{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------- Why Choose ---------- */
function WhyChoose() {
  const items = [
    { icon: Zap, title: "Hands-on Learning", text: "Every session ends with something you built yourself." },
    { icon: GraduationCap, title: "Industry Mentors", text: "Get feedback from engineers actually shipping AI at work." },
    { icon: Code2, title: "AI Projects", text: "Ship portfolio-worthy projects, not tutorial clones." },
    { icon: Network, title: "Networking", text: "Meet peers, mentors, founders and future co-founders." },
    { icon: Heart, title: "Community Support", text: "A friendly space to ask stupid questions and grow." },
    { icon: Target, title: "Career Opportunities", text: "Referrals, internships and hiring intros through the network." },
  ];
  return (
    <Section>
      <SectionTitle eyebrow="Why Spark" title="Why choose SPARK Tech AI Hub" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -6 }}
            className="glass rounded-2xl p-6"
          >
            <it.icon className="mb-4 h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{it.text}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- CTA ---------- */
function CTA() {
  return (
    <Section className="!py-16">
      <div className="glass relative overflow-hidden rounded-3xl p-10 text-center md:p-16">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
          <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--gradient-brand)] blur-3xl" />
        </div>
        <h2 className="text-3xl font-semibold sm:text-4xl md:text-5xl">
          Ready to start your <span className="text-gradient">AI journey?</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Join a growing community of curious builders. Free to join. Warm welcome guaranteed.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="https://chat.whatsapp.com/DL3S2U6W6zHJFREu11Oht0"
            target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-glow)]"
          >
            Join Community <ArrowRight className="h-4 w-4" />
          </a>
          <a href="#events" className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-6 py-3 text-sm font-medium">
            <Calendar className="h-4 w-4" /> Register for Next Event
          </a>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="border-t border-border/60 py-12">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-4">
        <div>
          <SparkLogo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Learn AI. Build projects. Join the community.
          </p>
        </div>
        <div>
          <div className="mb-3 text-sm font-semibold">Quick Links</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#about" className="hover:text-foreground">About</a></li>
            <li><a href="#programs" className="hover:text-foreground">Programs</a></li>
            <li><a href="#events" className="hover:text-foreground">Events</a></li>
            <li><a href="#team" className="hover:text-foreground">Team</a></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-sm font-semibold">Contact</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@sparktechaihub.com</li>
            <li className="flex items-center gap-2"><Link2 className="h-4 w-4" /> spark-tech-ai-hub</li>
            <li className="flex items-center gap-2"><Camera className="h-4 w-4" /> spark_tech_ai_hub</li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-sm font-semibold">Newsletter</div>
          <p className="mb-3 text-xs text-muted-foreground">Get event drops and AI resources in your inbox.</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input placeholder="you@email.com" className="flex-1 rounded-lg bg-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <button className="rounded-lg bg-[var(--gradient-brand)] px-3 py-2 text-sm font-semibold text-white">Join</button>
          </form>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-col items-center justify-between gap-3 px-6 text-xs text-muted-foreground md:flex-row">
        <div>© {new Date().getFullYear()} SPARK Tech AI Hub. All rights reserved.</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
        </div>
      </div>
    </footer>
  );
}
