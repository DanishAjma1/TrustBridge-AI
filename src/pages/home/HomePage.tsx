import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/home/Navbar";
import { Footer } from "../../components/home/Footer";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { AmountMeasureWithTags } from "../../data/users";
import {
  TrendingUp,
  Users,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Lightbulb,
  BarChart3,
  Lock,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface CampaignProps {
  _id: string;
  image: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
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
    <motion.div
      onClick={() => navigate(`/campaigns/${_id}`)}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-200 cursor-pointer transition-all duration-300"
      whileHover={{ y: -6 }}
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-b from-primary-100 to-white">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white text-xs font-bold rounded-full">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Live Now
          </span>
        </div>
      </div>
      <div className="p-5">
        <h4 className="text-base font-bold text-gray-900 mb-2 line-clamp-1">
          {title}
        </h4>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>
        <div className="space-y-3">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">
              <span className="font-bold text-primary-600">${raisedAmount.toLocaleString()}</span>
              <span className="text-gray-500"> raised</span>
            </span>
            <span className="text-gray-700">
              <span className="font-bold text-gray-900">${goalAmount.toLocaleString()}</span>
              <span className="text-gray-500"> goal</span>
            </span>
          </div>
        </div>
        <button className="w-full mt-4 px-4 py-2 bg-primary-50 text-primary-600 font-semibold rounded-lg hover:bg-primary-100 transition-colors text-sm">
          View Opportunity
        </button>
      </div>
    </motion.div>
  );
};

/* ─── Success Story Card ─────────────────────────────────────────────────── */
const SuccessCard: React.FC<SuccessfulCompanyProps & { label: string }> = ({
  image,
  company,
  description,
  label,
}) => (
  <motion.div
    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-200"
    whileHover={{ y: -6 }}
  >
    <div className="relative h-56 overflow-hidden bg-gradient-to-b from-primary-100 to-white">
      <img
        src={image}
        alt={company}
        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      <div className="absolute top-4 right-4">
        <span className="px-4 py-2 bg-white/95 backdrop-blur-md text-primary-600 text-xs font-bold rounded-lg border border-primary-200 shadow-lg">
          {label}
        </span>
      </div>
    </div>
    <div className="p-5">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-lg text-gray-900">{company}</h3>
        <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-xs font-bold text-green-700">Verified</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
        {description}
      </p>
      <button className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-2 group">
        Read Success Story <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </motion.div>
);

/* ─── Feature Box ────────────────────────────────────────────────────────── */
const FeatureBox = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <motion.div
    className="p-6 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all"
    whileHover={{ y: -4 }}
  >
    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
      {Icon}
    </div>
    <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);

/* ─── Skeleton Loader ────────────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
    <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-2 bg-gray-100 rounded w-5/6" />
    </div>
  </div>
);

/* ─── Main Component ──────────────────────────────────────────────────────── */
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
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStartups: 0,
    totalFunded: 0,
    successRate: 95,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campaignsRes, statsRes] = await Promise.all([
          axios.get(`${URL}/admin/campaigns`),
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
            .slice(0, 6),
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
        setSuccess("Message sent successfully! We'll be in touch soon.");
        setFormData({ name: "", email: "", message: "" });
      } else alert(data.error || "Failed to send message");
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-16 md:pt-20">
      <Navbar />

      {/* ── HERO SECTION ──────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50 to-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-8 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full border border-primary-300 mb-6">
              <TrendingUp size={16} />
              <span className="text-sm font-semibold">The Future of Entrepreneurship</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
              Connect with <span className="text-primary-600">Opportunities</span>
              <br />
              <span className="text-gray-600">Build Your Success</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join a vetted community of entrepreneurs and investors. Collaborate on deals, access funding, and grow your business in a secure, trusted ecosystem.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <button className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
                  Start Free Today <ArrowRight size={20} />
                </button>
              </Link>
              <Link to="/fundraises">
                <button className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-bold rounded-xl transition-all duration-200">
                  Explore Deals
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-16 pt-12 border-t border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center">
              <div className="text-3xl font-black text-primary-600">{stats.totalStartups}+</div>
              <div className="text-sm text-gray-600 mt-2">Active Startups</div>
            </div>
            <div className="text-center border-l border-r border-gray-200">
              <div className="text-3xl font-black text-primary-600">${AmountMeasureWithTags(stats.totalFunded ?? 0)}</div>
              <div className="text-sm text-gray-600 mt-2">Capital Deployed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-green-600">{stats.successRate}%</div>
              <div className="text-sm text-gray-600 mt-2">Success Rate</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, transparent, and secure. Get started in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Create Account",
                description: "Sign up as an entrepreneur or investor. Complete your profile in minutes.",
              },
              {
                step: "2",
                title: "Get Verified",
                description: "Our team verifies your profile for security and trust. Usually within 24 hours.",
              },
              {
                step: "3",
                title: "Explore & Connect",
                description: "Browse opportunities or pitch your idea to interested investors.",
              },
              {
                step: "4",
                title: "Close the Deal",
                description: "Collaborate, negotiate, and close deals with secure documentation.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-8 border border-primary-200">
                  <div className="w-14 h-14 bg-primary-600 text-white rounded-full flex items-center justify-center font-black text-xl mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-20 -right-4 text-primary-300">
                    <ArrowRight size={24} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              Why TrustBridge AI?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built for success. Designed for trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureBox
              icon={<Shield className="w-6 h-6 text-primary-600" />}
              title="Bank-Grade Security"
              description="Your data is encrypted and protected. We comply with international security standards."
            />
            <FeatureBox
              icon={<Users className="w-6 h-6 text-primary-600" />}
              title="Verified Members"
              description="Every investor and entrepreneur is thoroughly vetted for authenticity and credibility."
            />
            <FeatureBox
              icon={<Zap className="w-6 h-6 text-primary-600" />}
              title="AI-Powered Matching"
              description="Smart algorithms match you with the right partners based on your goals and values."
            />
            <FeatureBox
              icon={<BarChart3 className="w-6 h-6 text-primary-600" />}
              title="Real-Time Analytics"
              description="Track progress, monitor deals, and get insights with detailed dashboards."
            />
            <FeatureBox
              icon={<Briefcase className="w-6 h-6 text-primary-600" />}
              title="Legal Support"
              description="Access templates, documentation, and legal frameworks for smooth transactions."
            />
            <FeatureBox
              icon={<Lightbulb className="w-6 h-6 text-primary-600" />}
              title="Expert Resources"
              description="Learn from experienced mentors and access educational resources for growth."
            />
          </div>
        </div>
      </section>

      {/* ── ACTIVE CAMPAIGNS ──────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full border border-blue-300 mb-6">
              <Zap size={16} />
              <span className="text-sm font-semibold">For Everyone</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              Featured Support Campaigns
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl">
              View community-driven campaigns supporting entrepreneurs and innovators. No account required to explore and learn about these initiatives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaignsLoading ? (
              [1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} />)
            ) : recentCampaigns.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 py-12">
                No active campaigns yet. Check back soon!
              </p>
            ) : (
              recentCampaigns.map((c) => (
                <CampaignCard
                  key={c._id}
                  _id={c._id}
                  image={c.images?.[0] ? `${URL}${c.images[0]}` : "app logo.jpeg"}
                  title={c.title}
                  description={c.description}
                  goalAmount={c.goalAmount}
                  raisedAmount={c.raisedAmount}
                />
              ))
            )}
          </div>

          {recentCampaigns.length > 0 && (
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">View all active campaigns and support causes you believe in</p>
              <Link to="/campaigns">
                <button className="inline-flex items-center gap-2 px-8 py-3 bg-blue-50 border-2 border-blue-200 text-blue-600 hover:bg-blue-100 font-bold rounded-xl transition-all">
                  See All Campaigns <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── FUNDRAISING OPPORTUNITIES ──────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full border border-primary-300 mb-6">
              <TrendingUp size={16} />
              <span className="text-sm font-semibold">Fundraising</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              Investment Opportunities
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl">
              Discover high-potential startups seeking funding. Investors can browse vetted opportunities and connect with founders. Entrepreneurs can pitch their vision.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Entrepreneurs Section */}
              <div>
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                  <Lightbulb className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">For Entrepreneurs</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Pitch your innovative idea to a network of vetted investors. Get the funding you need to scale your startup.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Connect with experienced investors",
                    "Secure funding for your vision",
                    "Access mentorship and resources",
                    "Build strategic partnerships",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <button className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all">
                    Start Pitching Now
                  </button>
                </Link>
              </div>

              {/* Investors Section */}
              <div>
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">For Investors</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Discover investment opportunities with high-growth potential. Evaluate deals and connect with promising founders.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Browse vetted startup deals",
                    "Access detailed business plans",
                    "Direct communication with founders",
                    "Track portfolio performance",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <button className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all">
                    Start Investing Now
                  </button>
                </Link>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-gray-200">
              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  Ready to explore investment opportunities or pitch your startup?
                </p>
                <Link to="/fundraises">
                  <button className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all">
                    Browse Opportunities <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED EXITS ────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Companies that found success through our platform and achieved remarkable exits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                company: "AgriTech Innovations",
                label: "Trending",
                description:
                  "AI-driven farming solutions boosted yields by 40%. Secured $8M in funding and successfully exited with a 3x return.",
                image: "app logo.jpeg",
              },
              {
                company: "HealthAI Diagnostics",
                label: "Popular",
                description:
                  "Revolutionary AI for disease detection. Raised $12M from top VCs and achieved a successful exit to a healthcare leader.",
                image: "app logo.jpeg",
              },
              {
                company: "FinSecure Blockchain",
                label: "Success",
                description:
                  "Secure blockchain for finance raised $15M and completed a blockbuster exit to a major banking institution.",
                image: "app logo.jpeg",
              },
            ].map((s, i) => (
              <SuccessCard
                key={i}
                image={s.image}
                company={s.company}
                description={s.description}
                label={s.label}
                exits={0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              What Users Say
            </h2>
            <p className="text-lg text-gray-600">Trusted by entrepreneurs and investors worldwide.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Chen",
                role: "Founder, TechStartup Inc",
                quote: "TrustBridge AI connected us with the perfect investor within weeks. The platform is secure, transparent, and truly transformative.",
                avatar: "🚀",
              },
              {
                name: "Marcus Rodriguez",
                role: "Venture Capitalist",
                quote: "Finally, a platform that does what it promises. The deal flow is exceptional, and every founder I've met has been thoroughly vetted.",
                avatar: "💼",
              },
              {
                name: "Priya Patel",
                role: "Founder, GreenEnergy Co",
                quote: "The 24/7 support and expert resources helped us close our Series A round. Couldn't have done it without this platform.",
                avatar: "🌱",
              },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl border border-gray-200 transition-all"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-12 sm:p-16 text-center text-white">
            <h2 className="text-4xl sm:text-5xl font-black mb-6">Ready to Start Your Journey?</h2>
            <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-10">
              Join thousands of entrepreneurs and investors building the future. No hidden fees, no long-term contracts. Start free today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 hover:bg-gray-100 font-bold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95">
                  Create Free Account <ArrowRight size={20} />
                </button>
              </Link>
              <Link to="/login">
                <button className="inline-flex items-center gap-2 px-8 py-4 bg-primary-700 hover:bg-primary-800 text-white font-bold rounded-xl transition-all border border-primary-500">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT SECTION ───────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600">Have questions? We're here to help. Contact us anytime.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              className="bg-white rounded-3xl p-8 shadow-md border border-gray-200"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h3>
              <p className="text-gray-600 mb-8">We'll respond within 24 hours.</p>

              {success && (
                <motion.div
                  className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-start gap-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-green-700 font-medium">{success}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us how we can help..."
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <div className="space-y-8">
                {[
                  {
                    icon: "✉",
                    label: "Email",
                    value: "aitrustbridge@gmail.com",
                    href: "mailto:aitrustbridge@gmail.com",
                  },
                  {
                    icon: "☎",
                    label: "Phone",
                    value: "+92 322 6409363",
                    href: "tel:+923226409363",
                  },
                  {
                    icon: "⊙",
                    label: "Location",
                    value: "River Garden, Gujrat, Pakistan",
                    href: null,
                  },
                ].map((contact, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary-100 border border-primary-200 flex items-center justify-center flex-shrink-0 text-2xl">
                      {contact.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                        {contact.label}
                      </p>
                      {contact.href ? (
                        <a
                          href={contact.href}
                          className="text-lg font-bold text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          {contact.value}
                        </a>
                      ) : (
                        <p className="text-lg font-bold text-gray-900">{contact.value}</p>
                      )}
                    </div>
                  </div>
                ))}

                <div className="h-px bg-gray-200 my-8" />

                {/* Social Links */}
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-4">Follow Us</p>
                  <div className="flex gap-3">
                    {["f", "in", "tw"].map((social, idx) => (
                      <button
                        key={idx}
                        className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-primary-600 text-gray-600 hover:text-white transition-all flex items-center justify-center font-bold"
                      >
                        {social.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-200 my-8" />

                <p className="text-xs text-gray-500 leading-relaxed">
                  © 2025 AI Trust Bridge. All rights reserved.
                  <br />
                  River Garden, Gujrat, Pakistan
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};
