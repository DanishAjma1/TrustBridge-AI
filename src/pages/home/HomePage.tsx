import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/home/Navbar";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { AmountMeasureWithTags } from "../../data/users";

/* ─── Inline styles / CSS vars injected once ───────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    :root {
      --blue:   #1d4ed8;
      --blue-l: #3b82f6;
      --blue-xl:#93c5fd;
      --black:  #050810;
      --surface:#0b1120;
      --border: rgba(29,78,216,.25);
      --white:  #f0f4ff;
    }

    .hp-root * { box-sizing: border-box; }
    .hp-root { font-family: 'DM Sans', sans-serif; background: var(--black); color: var(--white); }
    .hp-root h1,.hp-root h2,.hp-root h3,.hp-root h4 { font-family: 'Syne', sans-serif; }

    /* Grid noise overlay */
    .hp-root::before {
      content: '';
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background-image:
        linear-gradient(rgba(29,78,216,.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(29,78,216,.03) 1px, transparent 1px);
      background-size: 40px 40px;
    }

    /* Orb glow blobs */
    .orb {
      position: absolute; border-radius: 50%;
      filter: blur(80px); pointer-events: none; z-index: 0;
    }
    .orb-1 { width: 520px; height: 520px; background: rgba(29,78,216,.18); top: -120px; left: -100px; }
    .orb-2 { width: 400px; height: 400px; background: rgba(59,130,246,.12); bottom: 0; right: -80px; }
    .orb-3 { width: 300px; height: 300px; background: rgba(29,78,216,.14); top: 50%; left: 50%; transform: translate(-50%,-50%); }

    /* Slide-up entry */
    @keyframes slideUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
    .slide-up { animation: slideUp .7s cubic-bezier(.22,1,.36,1) both; }
    .delay-1 { animation-delay:.1s; }
    .delay-2 { animation-delay:.22s; }
    .delay-3 { animation-delay:.34s; }
    .delay-4 { animation-delay:.46s; }

    /* Card */
    .card {
      position: relative; background: var(--surface);
      border: 1px solid var(--border); border-radius: 14px;
      overflow: hidden; transition: border-color .25s, transform .25s, box-shadow .25s;
    }
    .card:hover { border-color: var(--blue-l); transform: translateY(-3px); box-shadow: 0 16px 48px rgba(29,78,216,.2); }

    /* Blue pill badge */
    .badge {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 3px 10px; border-radius: 100px;
      font-size: 11px; font-weight: 600; letter-spacing: .04em;
      background: rgba(29,78,216,.2); border: 1px solid rgba(59,130,246,.3);
      color: var(--blue-xl);
    }

    /* Section label */
    .section-label {
      display: flex; align-items: center; gap: 10px;
      font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
      color: var(--blue-l);
    }
    .section-label::before {
      content: ''; display: block; width: 28px; height: 2px;
      background: linear-gradient(90deg, var(--blue), var(--blue-l));
      border-radius: 2px;
    }

    /* Stat card */
    .stat-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 12px; padding: 18px 20px; text-align: center;
      transition: border-color .25s;
    }
    .stat-card:hover { border-color: var(--blue-l); }

    /* Progress bar */
    .progress-track { height: 3px; background: rgba(255,255,255,.07); border-radius: 99px; overflow: hidden; }
    .progress-fill  { height: 100%; background: linear-gradient(90deg, var(--blue), var(--blue-l)); border-radius: 99px; transition: width 1s ease; }

    /* CTA section gradient border */
    .cta-box {
      position: relative; border-radius: 20px;
      background: linear-gradient(135deg, rgba(29,78,216,.12) 0%, var(--surface) 60%);
      border: 1px solid rgba(29,78,216,.4);
    }
    .cta-box::after {
      content: '';
      position: absolute; inset: -1px; border-radius: 21px;
      background: linear-gradient(135deg, var(--blue), transparent 50%);
      z-index: -1; opacity: .4;
    }

    /* Input */
    .hp-input {
      width: 100%; padding: 10px 14px; border-radius: 8px;
      background: rgba(255,255,255,.05); border: 1px solid var(--border);
      color: var(--white); font-family: 'DM Sans', sans-serif; font-size: 14px;
      transition: border-color .2s;
      outline: none;
    }
    .hp-input::placeholder { color: rgba(240,244,255,.3); }
    .hp-input:focus { border-color: var(--blue-l); background: rgba(29,78,216,.08); }

    /* Primary button */
    .btn-primary {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 12px 28px; border-radius: 8px; cursor: pointer; border: none;
      background: var(--blue); color: #fff;
      font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: .04em;
      transition: background .2s, transform .2s, box-shadow .2s;
    }
    .btn-primary:hover { background: var(--blue-l); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(29,78,216,.4); }
    .btn-primary:disabled { opacity:.6; cursor:not-allowed; }

    /* Ghost button */
    .btn-ghost {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 12px 28px; border-radius: 8px; cursor: pointer;
      background: transparent; border: 1px solid var(--border); color: var(--white);
      font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 600;
      transition: border-color .2s, background .2s;
    }
    .btn-ghost:hover { border-color: var(--blue-l); background: rgba(29,78,216,.1); }

    /* Scrollbar */
    .hp-root ::-webkit-scrollbar { width: 4px; }
    .hp-root ::-webkit-scrollbar-thumb { background: var(--blue); border-radius: 4px; }

    /* Divider */
    .h-divider { width: 100%; height: 1px; background: var(--border); }

    /* Pulse dot */
    @keyframes pulseDot { 0%,100%{ opacity:1; } 50%{ opacity:.3; } }
    .pulse-dot { width:7px; height:7px; border-radius:50%; background:var(--blue-l); animation: pulseDot 1.6s ease-in-out infinite; flex-shrink:0; }

    /* Contact success */
    @keyframes fadeSlide { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
    .success-msg { animation: fadeSlide .35s ease both; }
  `}</style>
);

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface CampaignProps {
  _id: string;
  image: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
}
interface FundraiserProps {
  id: string;
  image: string;
  fundNeeded: number;
  company: string;
  description: string;
  totalRaised: number;
}
interface SuccessfulCompanyProps {
  image: string;
  company: string;
  description: string;
  exits: number;
}

/* ─── Campaign Card ──────────────────────────────────────────────────────── */
const CampaignCard: React.FC<CampaignProps> = ({
  _id,
  image,
  title,
  description,
  goalAmount,
  raisedAmount,
}) => {
  const navigate = useNavigate();
  const pct = Math.min((raisedAmount / (goalAmount || 1)) * 100, 100);
  return (
    <div
      onClick={() => navigate(`/campaigns/${_id}`)}
      className="card"
      style={{ cursor: "pointer" }}
    >
      <div style={{ position: "relative", height: 140, overflow: "hidden" }}>
        <img
          src={image}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform .4s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(5,8,16,.95) 0%, rgba(5,8,16,.3) 60%, transparent)",
          }}
        />
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <span className="badge">
            <span className="pulse-dot" />
            Live
          </span>
        </div>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <h4
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--white)",
            marginBottom: 4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </h4>
        <p
          style={{
            fontSize: 11,
            color: "rgba(240,244,255,.5)",
            lineHeight: 1.5,
            marginBottom: 12,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </p>
        <div className="progress-track" style={{ marginBottom: 8 }}>
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
          }}
        >
          <span style={{ color: "rgba(240,244,255,.45)" }}>
            Raised{" "}
            <b style={{ color: "var(--blue-xl)" }}>
              ${raisedAmount.toLocaleString()}
            </b>
          </span>
          <span style={{ color: "rgba(240,244,255,.45)" }}>
            Goal{" "}
            <b style={{ color: "rgba(240,244,255,.7)" }}>
              ${goalAmount.toLocaleString()}
            </b>
          </span>
        </div>
      </div>
    </div>
  );
};

/* ─── Fundraiser Card ────────────────────────────────────────────────────── */
const FundraiserCard: React.FC<FundraiserProps> = ({
  id,
  image,
  fundNeeded,
  company,
  description,
  totalRaised,
}) => {
  const navigate = useNavigate();
  const pct = Math.min((totalRaised / (fundNeeded || 1)) * 100, 100);
  return (
    <div
      onClick={() => navigate("/fundraises")}
      className="card"
      style={{ cursor: "pointer" }}
    >
      <div style={{ position: "relative", height: 140, overflow: "hidden" }}>
        <img
          src={image}
          alt={company}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform .4s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(5,8,16,.95) 0%, rgba(5,8,16,.3) 60%, transparent)",
          }}
        />
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <span
            className="badge"
            style={{
              background: "rgba(59,130,246,.2)",
              borderColor: "rgba(147,197,253,.3)",
              color: "var(--blue-xl)",
            }}
          >
            <span className="pulse-dot" style={{ background: "#60a5fa" }} />
            Funding
          </span>
        </div>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <h4
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--white)",
            marginBottom: 4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {company}
        </h4>
        <p
          style={{
            fontSize: 11,
            color: "rgba(240,244,255,.5)",
            lineHeight: 1.5,
            marginBottom: 12,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </p>
        <div className="progress-track" style={{ marginBottom: 8 }}>
          <div
            className="progress-fill"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg,#2563eb,#60a5fa)",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
          }}
        >
          <span style={{ color: "rgba(240,244,255,.45)" }}>
            Raised{" "}
            <b style={{ color: "var(--blue-xl)" }}>
              ${totalRaised.toLocaleString()}
            </b>
          </span>
          <span style={{ color: "rgba(240,244,255,.45)" }}>
            Target{" "}
            <b style={{ color: "rgba(240,244,255,.7)" }}>
              ${fundNeeded.toLocaleString()}
            </b>
          </span>
        </div>
      </div>
    </div>
  );
};

/* ─── Success Story Card ─────────────────────────────────────────────────── */
const SuccessCard: React.FC<SuccessfulCompanyProps> = ({
  image,
  company,
  description,
  exits,
  label,
}) => (
  <motion.div
    className="card"
    style={{ overflow: "hidden" }}
    initial={{ opacity: 1 }}
    animate={{ x: ["3%", "-3%"], y: ["2%", "-2%"] }}
    transition={{
      repeat: Infinity,
      repeatType: "reverse",
      duration: 4,
      ease: "linear",
    }}
  >
    <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
      <img
        src={image}
        alt={company}
        className="w-full h-full object-cover"
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, var(--surface) 0%, transparent 60%)",
        }}
      />
      {/* Exit badge */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          background: "rgba(5,8,16,.7)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(29,78,216,.4)",
          borderRadius: 8,
          padding: "4px 10px",
          fontSize: 11,
          fontWeight: 700,
          color: "var(--blue-xl)",
          letterSpacing: ".04em",
        }}
      >
        {label}
      </div>
    </div>
    <div style={{ padding: "16px 18px 20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--white)" }}>
          {company}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span className="pulse-dot" style={{ background: "#22c55e" }} />
          <span
            style={{
              fontSize: 10,
              color: "rgba(240,244,255,.4)",
              fontWeight: 600,
              letterSpacing: ".06em",
              textTransform: "uppercase",
            }}
          >
            Verified
          </span>
        </div>
      </div>
      <p
        style={{
          fontSize: 13,
          color: "rgba(240,244,255,.5)",
          lineHeight: 1.6,
          marginBottom: 16,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {description}
      </p>
      <div className="h-divider" style={{ marginBottom: 14 }} />
      <button
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "var(--blue-xl)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          letterSpacing: ".04em",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        View Case Study <span style={{ fontSize: 14 }}>→</span>
      </button>
    </div>
  </motion.div>
);

/* ─── Stat Block ─────────────────────────────────────────────────────────── */
const StatBlock = ({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) => (
  <div className="stat-card">
    <div
      style={{
        fontSize: 26,
        fontWeight: 800,
        color,
        fontFamily: "Syne, sans-serif",
        lineHeight: 1.1,
        marginBottom: 4,
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontSize: 11,
        color: "rgba(240,244,255,.4)",
        fontWeight: 500,
        letterSpacing: ".06em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
  </div>
);

/* ─── Skeleton Loader ────────────────────────────────────────────────────── */
const Skeleton = () => (
  <div
    style={{
      background: "var(--surface)",
      borderRadius: 14,
      border: "1px solid var(--border)",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        height: 140,
        background:
          "linear-gradient(90deg, rgba(255,255,255,.04) 0%, rgba(29,78,216,.06) 50%, rgba(255,255,255,.04) 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
      }}
    />
    <div style={{ padding: "14px 16px" }}>
      {[70, 50, 100].map((w, i) => (
        <div
          key={i}
          style={{
            height: 10,
            borderRadius: 6,
            background: "rgba(255,255,255,.05)",
            width: `${w}%`,
            marginBottom: 8,
          }}
        />
      ))}
    </div>
    <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
  </div>
);

/* ─── Main Page ──────────────────────────────────────────────────────────── */
interface CampaignData {
  _id: string;
  image: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
}

export const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  useEffect(() => {
    if (user) logout();
  }, [user, logout]);

  const URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [recentCampaigns, setRecentCampaigns] = useState<any[]>([]);
  const [recentFundraisers, setRecentFundraisers] = useState<any[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [fundraisersLoading, setFundraisersLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStartups: 0,
    totalFunded: 0,
    successRate: 95,
  });
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campaignsRes, entrepreneursRes, statsRes] = await Promise.all([
          axios.get(`${URL}/admin/campaigns`),
          axios.get(`${URL}/entrepreneur/get-entrepreneurs`),
          axios.get(`${URL}/user/platform-stats`),
        ]);


        setRecentCampaigns(
          (campaignsRes.data || [])
            .filter((c: any) => c.status === "active")
            .sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .slice(0, 2),
        );
        setRecentFundraisers(
          [...(entrepreneursRes.data.entrepreneurs || [])]
            .sort(
              (a: any, b: any) =>
                b.valuation - a.valuation,
            )
            .slice(0, 2),
        );
        if (statsRes.data)
          setStats({
            totalStartups: statsRes.data.totalStartups || 0,
            totalFunded: statsRes.data.totalFunded || 0,
            successRate: statsRes.data.successRate || 95,
          });
      } catch (e) {
        console.error(e);
      } finally {
        setCampaignsLoading(false);
        setFundraisersLoading(false);
      }
    };
    fetchData();
  }, [URL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    try {
      const res = await fetch(`${URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else alert(data.error || "Failed to send message");
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="hp-root"
      style={{ minHeight: "100vh", position: "relative" }}
    >
      <GlobalStyle />
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          paddingTop: 72,
        }}
      >
        {/* Orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1280,
            margin: "0 auto",
            padding: "48px 24px 64px",
          }}
        >
          {/* 3-column grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.6fr 1fr",
              gap: 32,
              alignItems: "start",
            }}
            className="hero-grid"
          >
            <style>{`
              @media(max-width:1023px){.hero-grid{grid-template-columns:1fr!important}}
              @media(max-width:1023px){.col-left{order:3!important}.col-center{order:1!important}.col-right{order:2!important}}
            `}</style>

            {/* LEFT — Campaigns */}
            <div className="col-left" style={{ order: 1 }}>
              <div style={{ position: "sticky", top: 88 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <span className="section-label">Campaigns</span>
                  <span className="badge">{recentCampaigns.length} Live</span>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {campaignsLoading ? (
                    [1, 2, 3].map((i) => <Skeleton key={i} />)
                  ) : recentCampaigns.length === 0 ? (
                    <p
                      style={{
                        color: "rgba(240,244,255,.3)",
                        fontSize: 13,
                        textAlign: "center",
                        padding: "32px 0",
                      }}
                    >
                      No campaigns yet
                    </p>
                  ) : (
                    recentCampaigns.map((c) => (
                      <CampaignCard
                        key={c._id}
                        _id={c._id}
                        image={
                          c.images?.[0]
                            ? `${URL}${c.images[0]}`
                            : "app logo.jpeg"
                        }
                        title={c.title}
                        description={c.description}
                        goalAmount={c.goalAmount}
                        raisedAmount={c.raisedAmount}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* CENTER — Hero copy */}
            <div
              className="col-center"
              style={{
                order: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "48px 16px",
              }}
            >
              <div
                style={{
                  opacity: entered ? 1 : 0,
                  transform: entered ? "none" : "translateY(24px)",
                  transition: "opacity .7s ease, transform .7s ease",
                  textAlign: "center",
                  maxWidth: 560,
                }}
              >
                {/* Eyebrow */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 24,
                  }}
                >
                  <span className="badge" style={{ fontSize: 12 }}>
                    <span className="pulse-dot" /> The premier venture platform
                  </span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl font-extrabold">
                  Where{" "}
                  <span
                    style={{
                      color: "var(--blue-l)",
                      position: "relative",
                      display: "inline-block",
                    }}
                  >
                    Entrepreneurs
                    <span
                      style={{
                        position: "absolute",
                        bottom: -4,
                        left: 0,
                        width: "100%",
                        height: 3,
                        background:
                          "linear-gradient(90deg,var(--blue),var(--blue-l))",
                        borderRadius: 3,
                        opacity: 0.7,
                      }}
                    />
                  </span>{" "}
                  meet <span style={{ color: "var(--white)" }}>Investors</span>
                </h1>

                <p
                  style={{
                    fontSize: 16,
                    color: "rgba(240,244,255,.6)",
                    lineHeight: 1.7,
                    marginBottom: 32,
                    fontWeight: 300,
                  }}
                >
                  Collaborate, make deals, and build successful ventures
                  together in our curated ecosystem.
                </p>

                {/* CTAs */}
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: "center",
                    flexWrap: "wrap",
                    marginBottom: 48,
                  }}
                >
                  <Link to="/register">
                    <button className="btn-primary">
                      Get Started <span style={{ fontSize: 16 }}>→</span>
                    </button>
                  </Link>
                  <Link to="/fundraises">
                    <button className="btn-ghost">Browse Deals</button>
                  </Link>
                </div>

                {/* Stats */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: 12,
                  }}
                >
                  <StatBlock
                    value={`${stats.totalStartups}+`}
                    label="Startups"
                    color="var(--blue-l)"
                  />
                  <StatBlock
                    value={`$${AmountMeasureWithTags(stats.totalFunded ?? 0)}`}
                    label="Funded"
                    color="var(--white)"
                  />
                  <StatBlock
                    value={`${stats.successRate}%`}
                    label="Success Rate"
                    color="#4ade80"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT — Fundraisers */}
            <div className="col-right" style={{ order: 3 }}>
              <div style={{ position: "sticky", top: 88 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <span className="section-label">Fundraisers</span>
                  <span
                    className="badge"
                    style={{
                      background: "rgba(59,130,246,.18)",
                      borderColor: "rgba(147,197,253,.25)",
                    }}
                  >
                    Hot 🔥
                  </span>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {fundraisersLoading ? (
                    [1, 2, 3].map((i) => <Skeleton key={i} />)
                  ) : recentFundraisers.length === 0 ? (
                    <p
                      style={{
                        color: "rgba(240,244,255,.3)",
                        fontSize: 13,
                        textAlign: "center",
                        padding: "32px 0",
                      }}
                    >
                      No fundraisers yet
                    </p>
                  ) : (
                    recentFundraisers.map((e) => {
                      const img =
                        e.businessThumbnails?.[0] ||
                        (e.avatarUrl
                          ? e.avatarUrl.startsWith("http")
                            ? e.avatarUrl
                            : `${URL}/${e.avatarUrl}`
                          : "app logo.jpeg");
                      return (
                        <FundraiserCard
                          key={e.userId}
                          id={e.userId}
                          image={img}
                          company={e.startupName || "Unnamed Startup"}
                          fundNeeded={e.fundingNeeded || 0}
                          totalRaised={e.totalRaised || 0}
                          description={e.pitchSummary || "No description."}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ───────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, var(--border), transparent)",
          }}
        />
      </div>

      {/* ── SUCCESS STORIES ───────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1280,
          margin: "0 auto",
          padding: "80px 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 48,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <span className="section-label" style={{ marginBottom: 12 }}>
              Success Stories
            </span>
            <h2 className="text-5xl font-extrabold">Featured Exits</h2>
          </div>
          <p
            style={{
              fontSize: 14,
              color: "rgba(240,244,255,.45)",
              maxWidth: 340,
              lineHeight: 1.6,
            }}
          >
            Entrepreneurs who turned ideas into multi-exit ventures through our
            platform.
          </p>
        </div>

        <motion.div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              company: "AgriTech Innovations",
              label: "Trending",
              description:
                "AI-driven farming solutions that boosted yields by 40%, attracting $8M in funding from top investors and leading to 3 successful exits.",
              image: "app logo.jpeg",
            },
            {
              company: "HealthAI Diagnostics",
              label: "Popular",
              description:
                "Revolutionary AI for early disease detection, secured $12M from venture capitalists, with 2 high-profile exits to healthcare leaders.",
              image: "app logo.jpeg",
            },
            {
              company: "FinSecure Blockchain",
              label: "Success",
              description:
                "Secure blockchain platform for finance, raised $15M from investors, achieving a blockbuster exit to a major bank.",
              image: "app logo.jpeg",
            },
          ].map((s, i) => (
            <SuccessCard
              key={i}
              image={s.image}
              company={s.company}
              description={s.description}
              label={s.label}
            />
          ))}
        </motion.div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px 80px",
        }}
      >
        <div
          className="cta-box"
          style={{
            padding: "clamp(40px,6vw,72px)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative glow */}
          <div
            style={{
              position: "absolute",
              top: -80,
              right: -80,
              width: 300,
              height: 300,
              background: "rgba(29,78,216,.15)",
              borderRadius: "50%",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <span
              className="section-label"
              style={{ justifyContent: "center", marginBottom: 16 }}
            >
              Join Now
            </span>
            <h2 className="text-5xl font-extrabold">
              Ready to Build the Future?
            </h2>
            <p
              style={{
                color: "rgba(240,244,255,.5)",
                fontSize: 15,
                marginBottom: 36,
                maxWidth: 480,
                margin: "0 auto 36px",
              }}
            >
              Join thousands of entrepreneurs and investors already shaping
              tomorrow.
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link to="/register">
                <button
                  className="btn-primary"
                  style={{ padding: "14px 36px", fontSize: 15 }}
                >
                  Create Account →
                </button>
              </Link>
              <Link to="/login">
                <button
                  className="btn-ghost"
                  style={{ padding: "14px 36px", fontSize: 15 }}
                >
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px 100px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: 24,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          {/* Form */}
          <div style={{ padding: 40 }}>
            <span className="section-label" style={{ marginBottom: 16 }}>
              Contact Us
            </span>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "var(--white)",
                marginBottom: 8,
                marginTop: 10,
              }}
            >
              Get in Touch
            </h2>
            <p
              style={{
                color: "rgba(240,244,255,.45)",
                fontSize: 14,
                marginBottom: 28,
              }}
            >
              We'll respond within 24 hours.
            </p>

            {success && (
              <div
                className="success-msg"
                style={{
                  marginBottom: 20,
                  padding: "12px 16px",
                  background: "rgba(34,197,94,.1)",
                  border: "1px solid rgba(34,197,94,.3)",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#4ade80",
                }}
              >
                ✓ {success}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              {[
                {
                  id: "name",
                  label: "Full Name",
                  type: "text",
                  placeholder: "Your name",
                  field: "name",
                },
                {
                  id: "email",
                  label: "Email Address",
                  type: "email",
                  placeholder: "you@example.com",
                  field: "email",
                },
              ].map(({ id, label, type, placeholder, field }) => (
                <div key={id}>
                  <label
                    htmlFor={id}
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      color: "rgba(240,244,255,.4)",
                      marginBottom: 6,
                    }}
                  >
                    {label}
                  </label>
                  <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    className="hp-input"
                    value={(formData as any)[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                  />
                </div>
              ))}
              <div>
                <label
                  htmlFor="message"
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: "rgba(240,244,255,.4)",
                    marginBottom: 6,
                  }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Tell us how we can help..."
                  className="hp-input"
                  style={{ resize: "vertical", minHeight: 100 }}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ alignSelf: "flex-start", marginTop: 4 }}
              >
                {loading ? "Sending…" : "Send Message →"}
              </button>
            </form>
          </div>

          {/* Info */}
          <div
            style={{
              padding: 40,
              background:
                "linear-gradient(135deg, rgba(29,78,216,.08) 0%, transparent 60%)",
              borderLeft: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 32,
            }}
          >
            <div>
              <span className="section-label" style={{ marginBottom: 12 }}>
                Contact Info
              </span>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "var(--white)",
                  marginTop: 10,
                }}
              >
                We're here to help
              </h3>
            </div>
            {[
              {
                label: "Email",
                value: "aitrustbridge@gmail.com",
                href: "mailto:aitrustbridge@gmail.com",
                icon: "✉",
              },
              {
                label: "Phone",
                value: "+92 322 6409363",
                href: "tel:+923226409363",
                icon: "☎",
              },
              {
                label: "Location",
                value: "River Garden, Gujrat, Pakistan",
                href: undefined,
                icon: "⊙",
              },
            ].map(({ label, value, href, icon }) => (
              <div
                key={label}
                style={{ display: "flex", gap: 16, alignItems: "flex-start" }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: "rgba(29,78,216,.15)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: "rgba(240,244,255,.35)",
                      marginBottom: 4,
                    }}
                  >
                    {label}
                  </div>
                  {href ? (
                    <a
                      href={href}
                      style={{
                        fontSize: 14,
                        color: "var(--blue-xl)",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.color = "var(--white)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.color = "var(--blue-xl)")
                      }
                    >
                      {value}
                    </a>
                  ) : (
                    <span
                      style={{ fontSize: 14, color: "rgba(240,244,255,.65)" }}
                    >
                      {value}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Decorative divider */}
            <div className="h-divider" />
            <p
              style={{
                fontSize: 12,
                color: "rgba(240,244,255,.25)",
                lineHeight: 1.6,
              }}
            >
              © 2025 AI Trust Bridge · River Garden, Gujrat, Pakistan
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
