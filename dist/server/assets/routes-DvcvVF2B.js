import { useEffect, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowRight, Bot, Brain, Briefcase, Calendar, Camera, ChevronRight, Code2, GraduationCap, Handshake, Heart, Link2, Mail, MessageCircle, Network, Rocket, Send, Sparkles, Star, Target, Trophy, Users, X, Zap } from "lucide-react";
//#region src/assets/hero-ai.jpg
var hero_ai_default = "/assets/hero-ai-BjwwlIim.jpg";
//#endregion
//#region src/assets/team-fardeen.png
var team_fardeen_default = "/assets/team-fardeen-Cj1_k94s.png";
//#endregion
//#region src/assets/team-shiny.png
var team_shiny_default = "/assets/team-shiny-BI6-ktWk.png";
//#endregion
//#region src/assets/new-logo.png
var new_logo_default = "/assets/new-logo-BNyw7v1d.png";
//#endregion
//#region src/components/SparkLogo.tsx
function SparkLogo({ className = "" }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `flex min-w-0 items-center gap-2.5 ${className}`,
		children: [/* @__PURE__ */ jsx("div", {
			className: "relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white/20 shadow-[var(--shadow-glow)]",
			style: { backgroundColor: "#ffffff" },
			children: /* @__PURE__ */ jsx("img", {
				src: new_logo_default,
				alt: "SPARK Tech AI Hub",
				className: "h-full w-full object-contain",
				style: {
					padding: "2px",
					background: "#ffffff"
				}
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "min-w-0 leading-tight",
			children: [/* @__PURE__ */ jsx("div", {
				className: "truncate font-display text-base font-semibold tracking-tight",
				children: "SPARK"
			}), /* @__PURE__ */ jsx("div", {
				className: "truncate text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
				children: "Tech AI Hub"
			})]
		})]
	});
}
//#endregion
//#region src/components/Chatbot.tsx
var SYSTEM_PROMPT = `You are Spark — the friendly AI assistant for SPARK Tech AI Hub, an AI learning and networking community based in India.

About SPARK Tech AI Hub:
- Founded by Fardeen Ansari (Founder & CEO), with Shiny Dhingra (Associate Graphic Designer)
- A movement for students and professionals to learn, build and grow in the age of AI
- Community of 500+ builders
- Programs: AI Workshops (weekly), Hackathons (48-hour sprints), Bootcamps, AI Projects, Community Meetups, Startup Networking
- Past events: SnowFrost Hackathon (Jan 17, 2026) at Jamia, Spark Tech Event 2025 (professional shoot), Neo4j Aura meetup
- Hosted 40+ events, 12 hackathons, 60+ workshops, 150+ projects built, 25+ mentors
- Join via WhatsApp: https://chat.whatsapp.com/DL3S2U6W6zHJFREu11Oht0
- LinkedIn: https://www.linkedin.com/company/spark-tech-ai-hub/
- Instagram: @spark_tech_ai_hub
- Most events are free; bootcamps have a nominal fee

Personality: Be warm, enthusiastic, helpful, and concise. Use emojis sparingly. Keep replies under 3 sentences unless asked for detail. If you don't know something specific, direct to WhatsApp or LinkedIn.`;
var GROQ_API_KEY = "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";
async function* streamGroqReply(history, userMsg) {
	const messages = [
		{
			role: "system",
			content: SYSTEM_PROMPT
		},
		...history.filter((m) => !m.streaming).map((m) => ({
			role: m.role === "user" ? "user" : "assistant",
			content: m.text
		})),
		{
			role: "user",
			content: userMsg
		}
	];
	const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${GROQ_API_KEY}`
		},
		body: JSON.stringify({
			model: "llama-3.3-70b-versatile",
			messages,
			stream: true
		})
	});
	if (!response.ok || !response.body) throw new Error("Failed to fetch from Groq");
	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	let buffer = "";
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		buffer += decoder.decode(value, { stream: true });
		const lines = buffer.split("\n");
		buffer = lines.pop() || "";
		for (const line of lines) if (line.startsWith("data: ") && line !== "data: [DONE]") try {
			const content = JSON.parse(line.slice(6)).choices[0]?.delta?.content;
			if (content) yield content;
		} catch (e) {}
	}
}
function Chatbot() {
	const [open, setOpen] = useState(false);
	const [input, setInput] = useState("");
	const [msgs, setMsgs] = useState([{
		role: "bot",
		text: "Hi! I'm Spark ✨ — your AI guide to SPARK Tech AI Hub. Ask me about events, how to join, our programs, or anything else!"
	}]);
	const [loading, setLoading] = useState(false);
	const bottomRef = useRef(null);
	const inputRef = useRef(null);
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [msgs]);
	useEffect(() => {
		if (open) setTimeout(() => inputRef.current?.focus(), 100);
	}, [open]);
	const sendText = async (t) => {
		if (!t || loading) return;
		setInput("");
		setLoading(true);
		const userMsg = {
			role: "user",
			text: t
		};
		const botPlaceholder = {
			role: "bot",
			text: "",
			streaming: true
		};
		setMsgs((prev) => [
			...prev,
			userMsg,
			botPlaceholder
		]);
		try {
			let fullText = "";
			const historyForContext = msgs;
			for await (const chunk of streamGroqReply(historyForContext, t)) {
				fullText += chunk;
				setMsgs((prev) => {
					const copy = [...prev];
					copy[copy.length - 1] = {
						role: "bot",
						text: fullText,
						streaming: true
					};
					return copy;
				});
			}
			setMsgs((prev) => {
				const copy = [...prev];
				copy[copy.length - 1] = {
					role: "bot",
					text: fullText,
					streaming: false
				};
				return copy;
			});
		} catch {
			setMsgs((prev) => {
				const copy = [...prev];
				copy[copy.length - 1] = {
					role: "bot",
					text: "Sorry, I ran into an issue connecting to the AI. Please try again or reach us on WhatsApp! 🙏",
					streaming: false
				};
				return copy;
			});
		} finally {
			setLoading(false);
		}
	};
	const send = () => sendText(input.trim());
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(motion.button, {
		whileHover: { scale: 1.05 },
		whileTap: { scale: .95 },
		onClick: () => setOpen((o) => !o),
		className: "fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-white text-primary shadow-lg border border-border/40 hover:bg-white/90",
		"aria-label": "Open chatbot",
		children: /* @__PURE__ */ jsx(AnimatePresence, {
			mode: "wait",
			initial: false,
			children: /* @__PURE__ */ jsx(motion.span, {
				initial: {
					rotate: -90,
					opacity: 0
				},
				animate: {
					rotate: 0,
					opacity: 1
				},
				exit: {
					rotate: 90,
					opacity: 0
				},
				transition: { duration: .15 },
				children: open ? /* @__PURE__ */ jsx(X, { className: "h-6 w-6" }) : /* @__PURE__ */ jsx(MessageCircle, { className: "h-6 w-6" })
			}, open ? "x" : "chat")
		})
	}), /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxs(motion.div, {
		initial: {
			opacity: 0,
			y: 20,
			scale: .95
		},
		animate: {
			opacity: 1,
			y: 0,
			scale: 1
		},
		exit: {
			opacity: 0,
			y: 20,
			scale: .95
		},
		transition: {
			type: "spring",
			damping: 25,
			stiffness: 300
		},
		className: "glass fixed bottom-24 right-6 z-50 flex h-[520px] w-[370px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl shadow-[var(--shadow-card)]",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3 border-b border-border/60 bg-primary/5 p-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white shadow-sm border border-border/20",
						children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ jsx("span", { className: "absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-400" })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-sm font-semibold",
							children: "Spark Assistant"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-[11px] text-muted-foreground",
							children: loading ? /* @__PURE__ */ jsx("span", {
								className: "text-primary animate-pulse",
								children: "Typing…"
							}) : "Online"
						})]
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: () => setOpen(false),
						className: "grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors",
						children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex-1 space-y-3 overflow-y-auto p-4 scroll-smooth",
				children: [msgs.map((m, i) => /* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						y: 6
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { duration: .2 },
					className: `flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`,
					children: [m.role === "bot" && /* @__PURE__ */ jsx("div", {
						className: "mb-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white border border-border/20 shadow-sm",
						children: /* @__PURE__ */ jsx(Bot, { className: "h-3.5 w-3.5 text-primary" })
					}), /* @__PURE__ */ jsxs("div", {
						className: `max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "rounded-br-sm bg-[var(--gradient-brand)] text-white" : "rounded-bl-sm bg-secondary text-secondary-foreground"}`,
						children: [m.text || m.streaming && /* @__PURE__ */ jsxs("span", {
							className: "flex gap-1 items-center h-4",
							children: [
								/* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" }),
								/* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" }),
								/* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" })
							]
						}), m.streaming && m.text && /* @__PURE__ */ jsx("span", { className: "ml-0.5 inline-block h-3.5 w-0.5 translate-y-0.5 animate-pulse bg-current opacity-70" })]
					})]
				}, i)), /* @__PURE__ */ jsx("div", { ref: bottomRef })]
			}),
			msgs.length === 1 && /* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap gap-2 px-4 pb-2",
				children: [
					"Upcoming events?",
					"How to join?",
					"What is SPARK?",
					"Is it free?"
				].map((s) => /* @__PURE__ */ jsx("button", {
					onClick: () => sendText(s),
					className: "rounded-full border border-border/60 bg-secondary/60 px-3 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors",
					children: s
				}, s))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 border-t border-border/60 p-3",
				children: [/* @__PURE__ */ jsx("input", {
					ref: inputRef,
					value: input,
					onChange: (e) => setInput(e.target.value),
					onKeyDown: (e) => e.key === "Enter" && !e.shiftKey && send(),
					placeholder: "Ask about SPARK…",
					disabled: loading,
					className: "flex-1 rounded-xl bg-input px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring disabled:opacity-50"
				}), /* @__PURE__ */ jsx(motion.button, {
					onClick: send,
					disabled: loading || !input.trim(),
					whileHover: { scale: 1.05 },
					whileTap: { scale: .95 },
					className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--gradient-brand)] text-background shadow-[var(--shadow-glow)] disabled:opacity-40 disabled:cursor-not-allowed",
					"aria-label": "Send",
					children: /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" })
				})]
			})
		]
	}) })] });
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
function Index() {
	return /* @__PURE__ */ jsxs("div", {
		className: "relative min-h-screen w-full overflow-x-clip text-foreground",
		children: [
			/* @__PURE__ */ jsx(Nav, {}),
			/* @__PURE__ */ jsx(Hero, {}),
			/* @__PURE__ */ jsx(About, {}),
			/* @__PURE__ */ jsx(Stats, {}),
			/* @__PURE__ */ jsx(Programs, {}),
			/* @__PURE__ */ jsx(Gallery, {}),
			/* @__PURE__ */ jsx(Testimonials, {}),
			/* @__PURE__ */ jsx(Team, {}),
			/* @__PURE__ */ jsx(Community, {}),
			/* @__PURE__ */ jsx(Partners, {}),
			/* @__PURE__ */ jsx(WhyChoose, {}),
			/* @__PURE__ */ jsx(CTA, {}),
			/* @__PURE__ */ jsx(Footer, {}),
			/* @__PURE__ */ jsx(Chatbot, {})
		]
	});
}
var fadeUp = {
	hidden: {
		opacity: 0,
		y: 24
	},
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: .6,
			ease: [
				.22,
				1,
				.36,
				1
			]
		}
	}
};
function Section({ id, children, className = "" }) {
	return /* @__PURE__ */ jsx("section", {
		id,
		className: `relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 md:py-28 ${className}`,
		children
	});
}
function SectionTitle({ eyebrow, title, subtitle }) {
	return /* @__PURE__ */ jsxs(motion.div, {
		initial: "hidden",
		whileInView: "show",
		viewport: {
			once: true,
			margin: "-80px"
		},
		variants: fadeUp,
		className: "mx-auto mb-16 max-w-2xl text-center",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-3 inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground",
				children: [
					/* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3" }),
					" ",
					eyebrow
				]
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "text-3xl font-semibold sm:text-4xl md:text-5xl",
				children: /* @__PURE__ */ jsx("span", {
					className: "text-gradient",
					children: title
				})
			}),
			subtitle && /* @__PURE__ */ jsx("p", {
				className: "mt-4 text-base text-muted-foreground md:text-lg",
				children: subtitle
			})
		]
	});
}
function Nav() {
	const [scrolled, setScrolled] = useState(false);
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return /* @__PURE__ */ jsx("header", {
		className: `fixed inset-x-0 top-0 z-40 transition-all ${scrolled ? "glass backdrop-blur-xl" : "bg-transparent"}`,
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 sm:px-6 md:flex md:justify-between",
			children: [
				/* @__PURE__ */ jsx(SparkLogo, { className: "min-w-0" }),
				/* @__PURE__ */ jsx("nav", {
					className: "hidden items-center gap-8 md:flex",
					children: [
						["About", "#about"],
						["Programs", "#programs"],
						["Events", "#events"],
						["Team", "#team"],
						["Community", "#community"]
					].map(([label, href]) => /* @__PURE__ */ jsx("a", {
						href,
						className: "text-sm text-muted-foreground transition-colors hover:text-foreground",
						children: label
					}, href))
				}),
				/* @__PURE__ */ jsxs("a", {
					href: "https://chat.whatsapp.com/DL3S2U6W6zHJFREu11Oht0",
					target: "_blank",
					rel: "noreferrer",
					className: "inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--gradient-brand)] px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow-glow)] transition-transform hover:scale-105",
					children: ["Join Community ", /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })]
				})
			]
		})
	});
}
function Hero() {
	return /* @__PURE__ */ jsxs("section", {
		className: "relative overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32",
		children: [/* @__PURE__ */ jsx("div", {
			className: "pointer-events-none absolute inset-0 -z-10",
			children: /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.5_0.2_285/0.35),transparent)]" })
		}), /* @__PURE__ */ jsxs("div", {
			className: "mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-12",
			children: [/* @__PURE__ */ jsxs(motion.div, {
				initial: "hidden",
				animate: "show",
				variants: fadeUp,
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/35 bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-foreground shadow-[0_0_30px_-18px_var(--color-primary)] backdrop-blur",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "relative flex h-2 w-2",
							children: [/* @__PURE__ */ jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" }), /* @__PURE__ */ jsx("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-primary" })]
						}), "Powered by Community · AI-first"]
					}),
					/* @__PURE__ */ jsxs("h1", {
						className: "text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl",
						children: [
							"Learn AI.",
							/* @__PURE__ */ jsx("br", {}),
							/* @__PURE__ */ jsx("span", {
								className: "text-gradient",
								children: "Build Projects."
							}),
							/* @__PURE__ */ jsx("br", {}),
							"Join the Community."
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-6 max-w-xl text-base text-muted-foreground md:text-lg",
						children: "Empowering students and professionals through AI workshops, hackathons, real-world projects, and an active tech community."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-8 flex flex-col gap-3 min-[430px]:flex-row min-[430px]:flex-wrap",
						children: [/* @__PURE__ */ jsxs("a", {
							href: "https://chat.whatsapp.com/DL3S2U6W6zHJFREu11Oht0",
							target: "_blank",
							rel: "noreferrer",
							className: "group inline-flex items-center gap-2 rounded-full bg-[var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.03]",
							children: ["Join Community ", /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })]
						}), /* @__PURE__ */ jsx("a", {
							href: "#events",
							className: "inline-flex items-center justify-center gap-2 rounded-full border border-border bg-secondary/40 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary",
							children: "Explore Events"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-10 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 text-sm text-muted-foreground sm:flex sm:gap-6",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex -space-x-2",
							children: [
								team_fardeen_default,
								team_shiny_default,
								"/media/IMG_20260117_100702751_HDR.jpg",
								"/media/IMG_20260117_105713312_HDR.jpg"
							].map((s, i) => /* @__PURE__ */ jsx("img", {
								src: s,
								className: "h-8 w-8 rounded-full border-2 border-background object-cover",
								alt: ""
							}, i))
						}), /* @__PURE__ */ jsx("span", {
							className: "min-w-0",
							children: "500+ builders learning together"
						})]
					})
				]
			}), /* @__PURE__ */ jsxs(motion.div, {
				initial: {
					opacity: 0,
					scale: .9
				},
				animate: {
					opacity: 1,
					scale: 1
				},
				transition: {
					duration: .9,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				className: "relative",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "glass relative overflow-hidden rounded-3xl p-2 shadow-[var(--shadow-card)]",
						children: [/* @__PURE__ */ jsx("img", {
							src: hero_ai_default,
							alt: "AI neural network",
							className: "rounded-2xl",
							width: 1600,
							height: 1200
						}), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary/20 via-transparent to-accent/20" })]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "glass absolute -left-6 top-10 hidden rounded-2xl p-3 md:block",
						style: { animation: "float-y 6s ease-in-out infinite" },
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 text-xs",
							children: [/* @__PURE__ */ jsx("div", {
								className: "grid h-8 w-8 place-items-center rounded-lg bg-[var(--gradient-brand)]",
								children: /* @__PURE__ */ jsx(Brain, { className: "h-4 w-4 text-background" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "font-semibold",
								children: "AI Workshops"
							}), /* @__PURE__ */ jsx("div", {
								className: "text-muted-foreground",
								children: "Live · every week"
							})] })]
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "glass absolute -right-4 bottom-8 hidden rounded-2xl p-3 md:block",
						style: { animation: "float-y 7s ease-in-out infinite reverse" },
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 text-xs",
							children: [/* @__PURE__ */ jsx("div", {
								className: "grid h-8 w-8 place-items-center rounded-lg bg-[var(--gradient-brand)]",
								children: /* @__PURE__ */ jsx(Trophy, { className: "h-4 w-4 text-background" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "font-semibold",
								children: "Hackathons"
							}), /* @__PURE__ */ jsx("div", {
								className: "text-muted-foreground",
								children: "Build · ship · win"
							})] })]
						})
					})
				]
			})]
		})]
	});
}
function About() {
	return /* @__PURE__ */ jsxs(Section, {
		id: "about",
		children: [/* @__PURE__ */ jsx(SectionTitle, {
			eyebrow: "About Spark",
			title: "Where curiosity turns into real AI skills",
			subtitle: "SPARK Tech AI Hub is a movement for students and professionals to learn, build and grow together in the age of AI."
		}), /* @__PURE__ */ jsx("div", {
			className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
			children: [
				{
					icon: Brain,
					title: "AI Learning",
					text: "Structured tracks from fundamentals to LLMs, agents & MLOps."
				},
				{
					icon: Users,
					title: "Community",
					text: "A supportive network of curious builders and mentors."
				},
				{
					icon: Network,
					title: "Networking",
					text: "Meet founders, engineers, and hiring partners in tech."
				},
				{
					icon: Trophy,
					title: "Hackathons",
					text: "Ship real products under pressure — win prizes and offers."
				},
				{
					icon: GraduationCap,
					title: "Workshops",
					text: "Hands-on sessions on the hottest stacks in AI."
				},
				{
					icon: Briefcase,
					title: "Career Growth",
					text: "Portfolio-worthy projects and referrals to top companies."
				}
			].map((it, i) => /* @__PURE__ */ jsxs(motion.div, {
				variants: fadeUp,
				initial: "hidden",
				whileInView: "show",
				viewport: {
					once: true,
					margin: "-60px"
				},
				transition: { delay: i * .05 },
				whileHover: { y: -6 },
				className: "glass group relative overflow-hidden rounded-2xl p-6",
				children: [
					/* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" }),
					/* @__PURE__ */ jsx("div", {
						className: "mb-4 inline-grid h-11 w-11 place-items-center rounded-xl bg-[var(--gradient-brand)] text-background",
						children: /* @__PURE__ */ jsx(it.icon, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "mb-1 text-lg font-semibold",
						children: it.title
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted-foreground",
						children: it.text
					})
				]
			}, it.title))
		})]
	});
}
function Counter({ to, suffix = "" }) {
	const ref = useRef(null);
	const inView = useInView(ref, {
		once: true,
		margin: "-40px"
	});
	const [n, setN] = useState(0);
	useEffect(() => {
		if (!inView) return;
		const dur = 1400;
		const start = performance.now();
		let raf = 0;
		const step = (t) => {
			const p = Math.min(1, (t - start) / dur);
			const eased = 1 - Math.pow(1 - p, 3);
			setN(Math.round(eased * to));
			if (p < 1) raf = requestAnimationFrame(step);
		};
		raf = requestAnimationFrame(step);
		return () => cancelAnimationFrame(raf);
	}, [inView, to]);
	return /* @__PURE__ */ jsxs("span", {
		ref,
		children: [n.toLocaleString(), suffix]
	});
}
function Stats() {
	return /* @__PURE__ */ jsx(Section, {
		className: "!py-16",
		children: /* @__PURE__ */ jsx("div", {
			className: "glass rounded-3xl p-8 md:p-12",
			children: /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6",
				children: [
					{
						n: 500,
						s: "+",
						label: "Community Members"
					},
					{
						n: 40,
						s: "+",
						label: "Events Hosted"
					},
					{
						n: 12,
						s: "",
						label: "Hackathons"
					},
					{
						n: 60,
						s: "+",
						label: "Workshops"
					},
					{
						n: 150,
						s: "+",
						label: "Projects Built"
					},
					{
						n: 25,
						s: "+",
						label: "Industry Mentors"
					}
				].map((s) => /* @__PURE__ */ jsxs("div", {
					className: "text-center",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-3xl font-semibold text-gradient md:text-4xl",
						children: /* @__PURE__ */ jsx(Counter, {
							to: s.n,
							suffix: s.s
						})
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-1 text-xs uppercase tracking-widest text-muted-foreground",
						children: s.label
					})]
				}, s.label))
			})
		})
	});
}
function Programs() {
	return /* @__PURE__ */ jsxs(Section, {
		id: "programs",
		children: [/* @__PURE__ */ jsx(SectionTitle, {
			eyebrow: "Programs",
			title: "Featured programs",
			subtitle: "Pick your path — every program is hands-on and community-driven."
		}), /* @__PURE__ */ jsx("div", {
			className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
			children: [
				{
					icon: Brain,
					title: "AI Workshops",
					text: "Deep-dive sessions on LLMs, agents, RAG, vision and more."
				},
				{
					icon: Trophy,
					title: "Hackathons",
					text: "48-hour build sprints with mentors, prizes, and hiring partners."
				},
				{
					icon: Rocket,
					title: "Bootcamps",
					text: "Intensive multi-week programs to level-up your AI skills fast."
				},
				{
					icon: Code2,
					title: "AI Projects",
					text: "Ship real, portfolio-ready projects reviewed by industry mentors."
				},
				{
					icon: Users,
					title: "Community Meetups",
					text: "Casual meetups to connect, share, and learn from peers."
				},
				{
					icon: Handshake,
					title: "Startup Networking",
					text: "Meet founders and investors building the AI future."
				}
			].map((it, i) => /* @__PURE__ */ jsxs(motion.a, {
				href: "#events",
				variants: fadeUp,
				initial: "hidden",
				whileInView: "show",
				viewport: {
					once: true,
					margin: "-60px"
				},
				transition: { delay: i * .04 },
				whileHover: { y: -6 },
				className: "glass group relative flex flex-col overflow-hidden rounded-2xl p-6",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "mb-4 inline-grid h-12 w-12 place-items-center rounded-xl bg-secondary/60 ring-1 ring-border",
						children: /* @__PURE__ */ jsx(it.icon, { className: "h-6 w-6 text-primary" })
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "text-lg font-semibold",
						children: it.title
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: it.text
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-6 inline-flex items-center gap-1 text-sm text-primary opacity-70 transition-opacity group-hover:opacity-100",
						children: ["Learn more ", /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })]
					})
				]
			}, it.title))
		})]
	});
}
function Gallery() {
	const events = [
		{
			src: "/media/VID-20260117-WA0169.mp4",
			type: "video",
			name: "SnowFrost Hackathon",
			blurb: "Flagship hackathon at Jamia — packed hall of builders shipping AI solutions overnight."
		},
		{
			src: "/media/IMG_20260117_104454066_HDR.jpg",
			type: "image",
			name: "SnowFrost Hackathon",
			blurb: "Builders deep in the zone — late-night code sprints, energy drinks and big ideas."
		},
		{
			src: "/media/hackathon_10.jpg",
			type: "image",
			name: "SnowFrost Hackathon",
			blurb: "Crowd of passionate hackers gathered for the opening keynote session."
		},
		{
			src: "/media/hackathon_06.jpg",
			type: "image",
			name: "SnowFrost Hackathon",
			blurb: "Teams collaborating across tracks — AI, Web3, and sustainability challenges."
		},
		{
			src: "/media/IMG_20260117_100702751_HDR.jpg",
			type: "image",
			name: "SnowFrost Hackathon",
			blurb: "Demo day in full swing — teams presenting their 24-hour builds to judges."
		},
		{
			src: "/media/hackathon_07.jpg",
			type: "image",
			name: "SnowFrost Hackathon",
			blurb: "Community vibes at its best — smiles, stickers, and shipping real products."
		},
		{
			src: "/media/IMG_20260117_104600818_HDR.jpg",
			type: "image",
			name: "SnowFrost Hackathon",
			blurb: "Post-build energy — the room buzzing after an intense night of building."
		},
		{
			src: "/media/hackathon_12.jpg",
			type: "image",
			name: "SnowFrost Hackathon",
			blurb: "Winners being announced — hard work, creativity, and community spirit rewarded."
		},
		{
			src: "/media/IMG_20260117_105713312_HDR.jpg",
			type: "image",
			name: "SnowFrost Hackathon",
			blurb: "Group photo of the SnowFrost cohort — the people who make Spark what it is."
		},
		{
			src: "/media/VID-20260117-WA0170.mp4",
			type: "video",
			name: "SnowFrost Hackathon · Live",
			blurb: "Live coverage from the hackathon floor — pitches, chaos, and coffee."
		},
		{
			src: "/media/VID-20260117-WA0172.mp4",
			type: "video",
			name: "SnowFrost Hackathon · Full",
			blurb: "Highlights from the full event — the energy, the building, and the people."
		},
		{
			src: "/media/VID-20260117-WA0174.mp4",
			type: "video",
			name: "SnowFrost Hackathon · Final",
			blurb: "Closing ceremony and final project showcases."
		},
		{
			src: "/media/VID-20260118-WA0031.mp4",
			type: "video",
			name: "SnowFrost Hackathon · Winners",
			blurb: "Winning teams celebrating their hard work and creativity."
		},
		{
			src: "/media/event2025_01.jpg",
			type: "image",
			name: "Spark Tech Event 2025",
			blurb: "Professional keynote session — speakers sharing cutting-edge AI insights with the community."
		},
		{
			src: "/media/event2025_06.jpg",
			type: "image",
			name: "Spark Tech Event 2025",
			blurb: "Networking hour — founders, engineers, and students connecting over shared passion for AI."
		},
		{
			src: "/media/event2025_07.jpg",
			type: "image",
			name: "Spark Tech Event 2025",
			blurb: "Panel discussion on the future of AI in India — real talk, real builders."
		},
		{
			src: "/media/event2025_14.jpg",
			type: "image",
			name: "Spark Tech Event 2025",
			blurb: "Award ceremony — recognising the best projects and community contributors."
		},
		{
			src: "/media/event2025_17.jpg",
			type: "image",
			name: "Spark Tech Event 2025",
			blurb: "Crowd energy at peak — a room full of AI-first builders ready to change things."
		},
		{
			src: "/media/event2025_18.jpg",
			type: "image",
			name: "Spark Tech Event 2025",
			blurb: "Closing session — gratitude, connections made, and ideas to carry forward."
		}
	];
	const track = [...events, ...events];
	const [lightbox, setLightbox] = useState(null);
	const [ready, setReady] = useState(false);
	useEffect(() => {
		let cancelled = false;
		Promise.all(events.map((e) => new Promise((resolve) => {
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
		}))).then(() => {
			if (!cancelled) setReady(true);
		});
		return () => {
			cancelled = true;
		};
	}, []);
	return /* @__PURE__ */ jsxs(Section, {
		id: "events",
		children: [
			/* @__PURE__ */ jsx(SectionTitle, {
				eyebrow: "Event Gallery",
				title: "Moments from our hackathons & meetups",
				subtitle: "From late-night code sprints to trophy lifts — this is what community feels like."
			}),
			/* @__PURE__ */ jsx("div", {
				className: "events-viewport",
				children: /* @__PURE__ */ jsx("div", {
					className: `events-track ${ready ? "is-ready" : ""}`,
					children: track.map((e, i) => /* @__PURE__ */ jsxs("button", {
						onClick: () => setLightbox({
							src: e.src,
							type: e.type
						}),
						"aria-hidden": i >= events.length,
						className: "events-card glass group/card relative flex flex-col overflow-hidden rounded-2xl text-left shadow-[var(--shadow-card)] transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[var(--shadow-glow)]",
						children: [/* @__PURE__ */ jsx("div", {
							className: "events-card-media",
							children: e.type === "video" ? /* @__PURE__ */ jsx("video", {
								src: e.src,
								muted: true,
								playsInline: true,
								preload: "metadata",
								className: "h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.08]",
								style: {
									objectFit: "cover",
									objectPosition: "center"
								},
								onMouseEnter: (ev) => ev.target.play(),
								onMouseLeave: (ev) => {
									ev.target.pause();
									ev.target.currentTime = 0;
								}
							}) : /* @__PURE__ */ jsx("img", {
								src: e.src,
								alt: e.name,
								loading: "eager",
								decoding: "async",
								className: "h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.08]",
								style: {
									objectFit: "cover",
									objectPosition: "center"
								}
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-1 flex-col p-5",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: `mb-2 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest backdrop-blur ${e.name.includes("SnowFrost") ? "border-amber-400/40 bg-amber-400/10 text-amber-300" : e.name.includes("Spark Tech") ? "border-primary/30 bg-primary/10 text-foreground" : "border-primary/30 bg-primary/10 text-foreground"}`,
									children: [e.type === "video" ? /* @__PURE__ */ jsx("span", { children: "▶" }) : e.name.includes("SnowFrost") ? /* @__PURE__ */ jsx(Trophy, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3" }), e.name.includes("SnowFrost") ? "Hackathon" : "Event 2025"]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "break-words text-base font-semibold text-foreground",
									children: e.name
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-2 line-clamp-3 break-words text-sm leading-relaxed text-muted-foreground",
									children: e.blurb
								})
							]
						})]
					}, `${e.src}-${i}`))
				})
			}),
			lightbox && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 grid place-items-center bg-background/90 p-6 backdrop-blur-xl",
				onClick: () => setLightbox(null),
				children: lightbox.type === "video" ? /* @__PURE__ */ jsx("video", {
					src: lightbox.src,
					controls: true,
					playsInline: true,
					className: "max-h-[85vh] max-w-5xl rounded-2xl"
				}) : /* @__PURE__ */ jsx("img", {
					src: lightbox.src,
					className: "max-h-[85vh] max-w-5xl rounded-2xl",
					alt: ""
				})
			})
		]
	});
}
function Testimonials() {
	return /* @__PURE__ */ jsxs(Section, { children: [/* @__PURE__ */ jsx(SectionTitle, {
		eyebrow: "Testimonials",
		title: "Hear it from our community",
		subtitle: "Real voices from members who built, shipped and grew with SPARK."
	}), /* @__PURE__ */ jsx("div", {
		className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
		children: [
			{
				name: "Community Member",
				role: "Hackathon Participant",
				src: "/media/VID-20260117-WA0172.mp4"
			},
			{
				name: "Community Member",
				role: "Workshop Attendee",
				src: "/media/VID-20260117-WA0174.mp4"
			},
			{
				name: "Community Member",
				role: "Bootcamp Alum",
				src: "/media/VID-20260118-WA0031.mp4"
			},
			{
				name: "Community Member",
				role: "Meetup Speaker",
				src: "/media/VID-20260117-WA0169.mp4"
			}
		].map((t, i) => /* @__PURE__ */ jsxs(motion.div, {
			variants: fadeUp,
			initial: "hidden",
			whileInView: "show",
			viewport: { once: true },
			transition: { delay: i * .06 },
			className: "glass group flex flex-col overflow-hidden rounded-2xl p-3",
			children: [/* @__PURE__ */ jsx("div", {
				className: "relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-black",
				children: /* @__PURE__ */ jsx("video", {
					src: t.src,
					controls: true,
					playsInline: true,
					preload: "metadata",
					controlsList: "nodownload",
					className: "h-full w-full object-contain"
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 px-2 pt-3 pb-1",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex gap-0.5 text-primary",
					children: Array.from({ length: 5 }).map((_, k) => /* @__PURE__ */ jsx(Star, { className: "h-3 w-3 fill-current" }, k))
				}), /* @__PURE__ */ jsx("div", {
					className: "ml-auto text-[11px] text-muted-foreground",
					children: t.role
				})]
			})]
		}, `${t.role}-${i}`))
	})] });
}
function Team() {
	return /* @__PURE__ */ jsxs(Section, {
		id: "team",
		children: [/* @__PURE__ */ jsx(SectionTitle, {
			eyebrow: "Team",
			title: "The people behind Spark",
			subtitle: "A small, passionate team building the AI community from the ground up."
		}), /* @__PURE__ */ jsx("div", {
			className: "mx-auto flex w-full max-w-6xl flex-wrap justify-center gap-6",
			children: [{
				name: "Fardeen Ansari",
				role: "Founder & CEO",
				img: team_fardeen_default,
				url: "https://www.linkedin.com/in/fardeen-ansari-642a352aa"
			}, {
				name: "Shiny Dhingra",
				role: "Associate Graphic Designer",
				img: team_shiny_default,
				url: "https://www.linkedin.com/in/shiny-dhingra-62097b324"
			}].map((m, i) => /* @__PURE__ */ jsxs(motion.a, {
				href: m.url,
				target: "_blank",
				rel: "noreferrer",
				variants: fadeUp,
				initial: "hidden",
				whileInView: "show",
				viewport: { once: true },
				transition: {
					delay: i * .08,
					duration: .35
				},
				whileHover: {
					y: -6,
					scale: 1.03
				},
				className: "glass team-card group flex w-[290px] flex-col items-center rounded-2xl p-5 text-center shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-glow)]",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx("div", { className: "absolute -inset-1.5 rounded-2xl bg-[var(--gradient-brand)] opacity-40 blur-lg transition-opacity duration-300 group-hover:opacity-80" }), /* @__PURE__ */ jsx("div", {
							className: "relative grid h-[220px] w-[220px] place-items-center overflow-hidden rounded-2xl bg-secondary/40 ring-1 ring-border",
							children: /* @__PURE__ */ jsx("img", {
								src: m.img,
								alt: m.name,
								loading: "lazy",
								className: "h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]",
								style: {
									objectFit: "contain",
									objectPosition: "center"
								}
							})
						})]
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "mt-4 w-full truncate text-base font-semibold",
						children: m.name
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-0.5 text-xs text-muted-foreground",
						children: m.role
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-2 inline-flex items-center gap-1 text-xs text-primary",
						children: [/* @__PURE__ */ jsx(Link2, { className: "h-3 w-3" }), " LinkedIn"]
					})
				]
			}, m.name))
		})]
	});
}
function Community() {
	return /* @__PURE__ */ jsxs(Section, {
		id: "community",
		children: [/* @__PURE__ */ jsx(SectionTitle, {
			eyebrow: "Community",
			title: "Come hang out with us",
			subtitle: "Follow, join, and say hi — we love meeting new builders."
		}), /* @__PURE__ */ jsx("div", {
			className: "grid gap-6 md:grid-cols-3",
			children: [
				{
					icon: Link2,
					name: "LinkedIn",
					handle: "@spark-tech-ai-hub",
					url: "https://www.linkedin.com/company/spark-tech-ai-hub/"
				},
				{
					icon: Camera,
					name: "Camera",
					handle: "@spark_tech_ai_hub",
					url: "https://www.instagram.com/spark_tech_ai_hub"
				},
				{
					icon: MessageCircle,
					name: "WhatsApp Community",
					handle: "Join the group chat",
					url: "https://chat.whatsapp.com/DL3S2U6W6zHJFREu11Oht0"
				}
			].map((l, i) => /* @__PURE__ */ jsxs(motion.a, {
				href: l.url,
				target: "_blank",
				rel: "noreferrer",
				variants: fadeUp,
				initial: "hidden",
				whileInView: "show",
				viewport: { once: true },
				transition: { delay: i * .06 },
				whileHover: { y: -6 },
				className: "glass group flex items-center gap-4 rounded-2xl p-6",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "grid h-12 w-12 place-items-center rounded-xl bg-[var(--gradient-brand)] text-background",
						children: /* @__PURE__ */ jsx(l.icon, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ jsx("div", {
							className: "font-semibold",
							children: l.name
						}), /* @__PURE__ */ jsx("div", {
							className: "text-xs text-muted-foreground",
							children: l.handle
						})]
					}),
					/* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" })
				]
			}, l.name))
		})]
	});
}
function Partners() {
	const sponsors = [
		{
			name: "Google for Developers",
			domain: "developers.google.com"
		},
		{
			name: "Neo4j",
			domain: "neo4j.com"
		},
		{
			name: "Perplexity",
			domain: "perplexity.ai"
		},
		{
			name: "Duality AI",
			domain: "duality.ai"
		},
		{
			name: "Coding Blocks",
			domain: "codingblocks.com"
		},
		{
			name: "GeeksforGeeks",
			domain: "geeksforgeeks.org"
		},
		{
			name: "Coding Ninjas",
			domain: "codingninjas.com"
		},
		{
			name: "Domino's",
			domain: "dominos.co.in"
		},
		{
			name: "Campa",
			domain: "campacola.in"
		},
		{
			name: "SBI",
			domain: "sbi.co.in"
		},
		{
			name: "HDFC",
			domain: "hdfcbank.com"
		},
		{
			name: ".xyz",
			domain: "gen.xyz"
		}
	];
	const track = [...sponsors, ...sponsors];
	return /* @__PURE__ */ jsxs(Section, { children: [/* @__PURE__ */ jsx(SectionTitle, {
		eyebrow: "Partners & Sponsors",
		title: "Backed by the Best",
		subtitle: "Proud to partner with industry leaders who support our mission."
	}), /* @__PURE__ */ jsx("div", {
		className: "marquee-viewport",
		children: /* @__PURE__ */ jsx("div", {
			className: "marquee-track gap-4 sm:gap-6 md:gap-8",
			children: track.map((s, i) => /* @__PURE__ */ jsxs("div", {
				className: "glass grid h-20 w-48 shrink-0 place-items-center rounded-xl border border-white/5 bg-white/5 px-6 shadow-sm backdrop-blur-md transition-all hover:bg-white/10 sm:h-24 sm:w-56",
				children: [/* @__PURE__ */ jsx("img", {
					src: `https://logo.clearbit.com/${s.domain}`,
					alt: s.name,
					className: "max-h-full max-w-full object-contain grayscale transition-all hover:grayscale-0",
					onError: (e) => {
						e.currentTarget.style.display = "none";
						e.currentTarget.nextElementSibling?.classList.remove("hidden");
					}
				}), /* @__PURE__ */ jsx("span", {
					className: "hidden text-center text-sm font-semibold tracking-wide text-foreground/80",
					children: s.name
				})]
			}, `${s.name}-${i}`))
		})
	})] });
}
function WhyChoose() {
	return /* @__PURE__ */ jsxs(Section, { children: [/* @__PURE__ */ jsx(SectionTitle, {
		eyebrow: "Why Spark",
		title: "Why choose SPARK Tech AI Hub"
	}), /* @__PURE__ */ jsx("div", {
		className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
		children: [
			{
				icon: Zap,
				title: "Hands-on Learning",
				text: "Every session ends with something you built yourself."
			},
			{
				icon: GraduationCap,
				title: "Industry Mentors",
				text: "Get feedback from engineers actually shipping AI at work."
			},
			{
				icon: Code2,
				title: "AI Projects",
				text: "Ship portfolio-worthy projects, not tutorial clones."
			},
			{
				icon: Network,
				title: "Networking",
				text: "Meet peers, mentors, founders and future co-founders."
			},
			{
				icon: Heart,
				title: "Community Support",
				text: "A friendly space to ask stupid questions and grow."
			},
			{
				icon: Target,
				title: "Career Opportunities",
				text: "Referrals, internships and hiring intros through the network."
			}
		].map((it, i) => /* @__PURE__ */ jsxs(motion.div, {
			variants: fadeUp,
			initial: "hidden",
			whileInView: "show",
			viewport: { once: true },
			transition: { delay: i * .05 },
			whileHover: { y: -6 },
			className: "glass rounded-2xl p-6",
			children: [
				/* @__PURE__ */ jsx(it.icon, { className: "mb-4 h-6 w-6 text-primary" }),
				/* @__PURE__ */ jsx("h3", {
					className: "text-lg font-semibold",
					children: it.title
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: it.text
				})
			]
		}, it.title))
	})] });
}
function CTA() {
	return /* @__PURE__ */ jsx(Section, {
		className: "!py-16",
		children: /* @__PURE__ */ jsxs("div", {
			className: "glass relative overflow-hidden rounded-3xl p-10 text-center md:p-16",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "pointer-events-none absolute inset-0 -z-10 opacity-70",
					children: /* @__PURE__ */ jsx("div", { className: "absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--gradient-brand)] blur-3xl" })
				}),
				/* @__PURE__ */ jsxs("h2", {
					className: "text-3xl font-semibold sm:text-4xl md:text-5xl",
					children: ["Ready to start your ", /* @__PURE__ */ jsx("span", {
						className: "text-gradient",
						children: "AI journey?"
					})]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mx-auto mt-4 max-w-xl text-muted-foreground",
					children: "Join a growing community of curious builders. Free to join. Warm welcome guaranteed."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-8 flex flex-wrap justify-center gap-3",
					children: [/* @__PURE__ */ jsxs("a", {
						href: "https://chat.whatsapp.com/DL3S2U6W6zHJFREu11Oht0",
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex items-center gap-2 rounded-full bg-[var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-glow)]",
						children: ["Join Community ", /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })]
					}), /* @__PURE__ */ jsxs("a", {
						href: "#events",
						className: "inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-6 py-3 text-sm font-medium",
						children: [/* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4" }), " Register for Next Event"]
					})]
				})
			]
		})
	});
}
function Footer() {
	return /* @__PURE__ */ jsxs("footer", {
		className: "border-t border-border/60 py-12",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-4",
			children: [
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(SparkLogo, {}), /* @__PURE__ */ jsx("p", {
					className: "mt-4 max-w-xs text-sm text-muted-foreground",
					children: "Learn AI. Build projects. Join the community."
				})] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "mb-3 text-sm font-semibold",
					children: "Quick Links"
				}), /* @__PURE__ */ jsxs("ul", {
					className: "space-y-2 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
							href: "#about",
							className: "hover:text-foreground",
							children: "About"
						}) }),
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
							href: "#programs",
							className: "hover:text-foreground",
							children: "Programs"
						}) }),
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
							href: "#events",
							className: "hover:text-foreground",
							children: "Events"
						}) }),
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
							href: "#team",
							className: "hover:text-foreground",
							children: "Team"
						}) })
					]
				})] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "mb-3 text-sm font-semibold",
					children: "Contact"
				}), /* @__PURE__ */ jsxs("ul", {
					className: "space-y-2 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ jsxs("li", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Mail, { className: "h-4 w-4" }), " hello@sparktechaihub.com"]
						}),
						/* @__PURE__ */ jsxs("li", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Link2, { className: "h-4 w-4" }), " spark-tech-ai-hub"]
						}),
						/* @__PURE__ */ jsxs("li", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Camera, { className: "h-4 w-4" }), " spark_tech_ai_hub"]
						})
					]
				})] }),
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("div", {
						className: "mb-3 text-sm font-semibold",
						children: "Newsletter"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mb-3 text-xs text-muted-foreground",
						children: "Get event drops and AI resources in your inbox."
					}),
					/* @__PURE__ */ jsxs("form", {
						className: "flex gap-2",
						onSubmit: (e) => e.preventDefault(),
						children: [/* @__PURE__ */ jsx("input", {
							placeholder: "you@email.com",
							className: "flex-1 rounded-lg bg-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
						}), /* @__PURE__ */ jsx("button", {
							className: "rounded-lg bg-[var(--gradient-brand)] px-3 py-2 text-sm font-semibold text-white",
							children: "Join"
						})]
					})
				] })
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "mx-auto mt-10 flex max-w-7xl flex-col items-center justify-between gap-3 px-6 text-xs text-muted-foreground md:flex-row",
			children: [/* @__PURE__ */ jsxs("div", { children: [
				"© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" SPARK Tech AI Hub. All rights reserved."
			] }), /* @__PURE__ */ jsxs("div", {
				className: "flex gap-4",
				children: [/* @__PURE__ */ jsx("a", {
					href: "#",
					className: "hover:text-foreground",
					children: "Privacy"
				}), /* @__PURE__ */ jsx("a", {
					href: "#",
					className: "hover:text-foreground",
					children: "Terms"
				})]
			})]
		})]
	});
}
//#endregion
export { Index as component };
