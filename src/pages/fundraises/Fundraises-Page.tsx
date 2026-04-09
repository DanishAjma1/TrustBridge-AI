import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/home/Navbar";
import { Footer } from "../../components/home/Footer";
import { Button } from "../../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { Entrepreneur } from "../../types";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Target,
  TrendingUp,
  Building2,
  Filter,
  X,
  ArrowRight,
  Briefcase,
  Star,
  CheckCircle,
} from "lucide-react";
import { AmountMeasureWithTags } from "../../data/users";
import { motion } from "framer-motion";

interface BusinessCardProps {
  entrepreneur: Entrepreneur;
  isFeatured?: boolean;
}

export const FundraisePage: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [filteredEntrepreneurs, setFilteredEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All Industries");
  const [selectedStage, setSelectedStage] = useState<string>("All Stages");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [platformStats, setPlatformStats] = useState({
    totalInvested: 0,
    totalInvestors: 0,
    activeDeals: 0,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(9);
  const [industriesList, setIndustriesList] = useState<string[]>([]);

  const URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [entRes, statsRes, indRes] = await Promise.all([
          axios.get(`${URL}/entrepreneur/get-entrepreneurs`),
          axios.get(`${URL}/user/platform-stats`),
          axios.get(`${URL}/industry/get-all`),
        ]);

        setEntrepreneurs(entRes.data.entrepreneurs || []);
        setFilteredEntrepreneurs(entRes.data.entrepreneurs || []);

        if (indRes.data) {
          const industries = indRes.data.map((ind: any) => ind.name);
          setIndustriesList(industries);
        }

        if (statsRes.data) {
          setPlatformStats(statsRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [URL]);

  useEffect(() => {
    let filtered = [...entrepreneurs];

    if (selectedIndustry !== "All Industries") {
      filtered = filtered.filter((ent) => {
        if (Array.isArray(ent.industry)) {
          return ent.industry.includes(selectedIndustry);
        }
        return ent.industry === selectedIndustry;
      });
    }

    if (selectedStage !== "All Stages") {
      filtered = filtered.filter((ent) => {
        if (selectedStage === "Pre-Seed")
          return ent.preSeedStatus === "completed" || ent.preSeedStatus === "in-progress";
        if (selectedStage === "Seed")
          return ent.seedStatus === "completed" || ent.seedStatus === "in-progress";
        if (selectedStage === "Series A")
          return ent.seriesAStatus === "completed" || ent.seriesAStatus === "in-progress";
        return true;
      });
    }

    setFilteredEntrepreneurs(filtered);
    setCurrentPage(0);
  }, [selectedIndustry, selectedStage, entrepreneurs]);

  const totalPages = Math.ceil(filteredEntrepreneurs.length / itemsPerPage);
  const paginatedEntrepreneurs = filteredEntrepreneurs.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );

  const featuredEntrepreneur = filteredEntrepreneurs[0];

  const industries = ["All Industries", ...industriesList];
  const stages = ["All Stages", "Pre-Seed", "Seed", "Series A"];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Pre-Seed":
        return "bg-blue-100 text-blue-700";
      case "Seed":
        return "bg-primary-100 text-primary-700";
      case "Series A":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getActiveStage = (entrepreneur: Entrepreneur) => {
    if (
      entrepreneur.seriesAStatus === "completed" ||
      entrepreneur.seriesAStatus === "in-progress"
    )
      return "Series A";
    if (
      entrepreneur.seedStatus === "completed" ||
      entrepreneur.seedStatus === "in-progress"
    )
      return "Seed";
    if (
      entrepreneur.preSeedStatus === "completed" ||
      entrepreneur.preSeedStatus === "in-progress"
    )
      return "Pre-Seed";
    return "Concept";
  };

  const FeaturedCard: React.FC<{ entrepreneur: Entrepreneur }> = ({ entrepreneur }) => {
    const images =
      entrepreneur.businessThumbnails && entrepreneur.businessThumbnails.length > 0
        ? entrepreneur.businessThumbnails
        : ["/placeholder-startup.jpg"];

    const stage = getActiveStage(entrepreneur);
    const fundingProgress = Math.round(
      ((entrepreneur.totalRaised || 0) / (entrepreneur.fundingNeeded || 1)) * 100,
    );

    return (
      <motion.div
        className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 w-full">
          {/* Image Section */}
          <div className="relative rounded-2xl overflow-hidden h-80 lg:h-full bg-gradient-to-b from-primary-50 to-white min-w-0">
            <img
              src={images[0]}
              alt={entrepreneur.startupName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-yellow-900 rounded-full font-bold">
                <Star size={16} fill="currentColor" />
                Featured Deal
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex flex-col justify-between min-w-0">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full ${getStageColor(stage)}`}>
                  {stage}
                </span>
                {Array.isArray(entrepreneur.industry) &&
                  entrepreneur.industry.slice(0, 2).map((ind, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 text-xs font-bold bg-gray-100 text-gray-700 rounded-full"
                    >
                      {ind}
                    </span>
                  ))}
              </div>

              {/* Title & Location */}
              <h2 className="text-4xl font-black text-gray-900 mb-2">
                {entrepreneur.startupName || "Unnamed Startup"}
              </h2>
              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <MapPin size={18} className="text-primary-600" />
                <span className="font-semibold">{entrepreneur.location || "Location not specified"}</span>
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed mb-8 text-lg">
                {entrepreneur.pitchSummary || "No description provided."}
              </p>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-primary-50 rounded-xl p-4 border border-primary-200">
                  <div className="text-xs text-primary-700 font-bold uppercase mb-1">Team Size</div>
                  <div className="text-2xl font-black text-primary-600">{entrepreneur.teamSize || 0}</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <div className="text-xs text-green-700 font-bold uppercase mb-1">Founded</div>
                  <div className="text-2xl font-black text-green-600">{entrepreneur.foundedYear || "N/A"}</div>
                </div>
              </div>
            </div>

            {/* Funding Progress */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <div className="text-sm text-gray-600 font-semibold mb-1">Target Raise</div>
                  <div className="text-3xl font-black text-gray-900">
                    ${(entrepreneur.fundingNeeded || 0).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 font-semibold mb-1">Already Raised</div>
                  <div className="text-2xl font-black text-primary-600">
                    ${(entrepreneur.totalRaised || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="h-3 bg-gray-300 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-1000"
                  style={{ width: `${Math.min(fundingProgress, 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">{fundingProgress}% Funded</span>
                <button
                  onClick={() => navigate("/login", { state: { role: "investor" } })}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-all transform hover:-translate-y-0.5"
                >
                  Invest Now <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const OpportunityCard: React.FC<BusinessCardProps> = ({ entrepreneur }) => {
    const images =
      entrepreneur.businessThumbnails && entrepreneur.businessThumbnails.length > 0
        ? entrepreneur.businessThumbnails
        : ["/placeholder-startup.jpg"];

    const stage = getActiveStage(entrepreneur);
    const fundingProgress = Math.round(
      ((entrepreneur.totalRaised || 0) / (entrepreneur.fundingNeeded || 1)) * 100,
    );

    return (
      <motion.div
        className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all group"
        whileHover={{ y: -4 }}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-b from-primary-50 to-white">
          <img
            src={images[0]}
            alt={entrepreneur.startupName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${getStageColor(stage)}`}>
              {stage}
            </span>
          </div>
          <div className="absolute top-3 right-3 flex gap-2">
            {Array.isArray(entrepreneur.industry) &&
              entrepreneur.industry.slice(0, 1).map((ind, idx) => (
                <span key={idx} className="px-3 py-1 text-xs font-bold bg-white/90 text-gray-700 rounded-full">
                  {ind.slice(0, 10)}
                </span>
              ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Header */}
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
            {entrepreneur.startupName || "Unnamed Startup"}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
            <MapPin size={14} className="text-primary-600 flex-shrink-0" />
            <span className="truncate">{entrepreneur.location || "Location not specified"}</span>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-200 min-w-0">
              <div className="text-xs text-gray-600 font-bold">Team</div>
              <div className="text-sm font-black text-gray-900 truncate">{entrepreneur.teamSize || 0}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-200 min-w-0">
              <div className="text-xs text-gray-600 font-bold">Raised</div>
              <div className="text-xs font-black text-primary-600 truncate">${(entrepreneur.totalRaised || 0) / 1000}K</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-200 min-w-0">
              <div className="text-xs text-gray-600 font-bold">Target</div>
              <div className="text-xs font-black text-gray-900 truncate">${(entrepreneur.fundingNeeded || 0) / 1000}K</div>
            </div>
          </div>

          {/* Funding Bar */}
          <div className="mb-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                style={{ width: `${Math.min(fundingProgress, 100)}%` }}
              />
            </div>
            <div className="text-xs font-bold text-primary-600">{fundingProgress}% Funded</div>
          </div>

          {/* CTA */}
          {/* <button
            onClick={() => navigate("/login", { state: { role: "investor" } })}
            className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-all text-sm"
          >
            View Opportunity
          </button> */}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden pt-16 md:pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50 to-white">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-8 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

        <div className="max-w-7xl mx-auto relative z-10 text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full border border-primary-300 mb-6">
              <TrendingUp size={16} />
              <span className="text-sm font-semibold">Investment Opportunities</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-4">
              Invest in the <span className="text-primary-600">Future</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Discover high-growth startups and innovative businesses seeking investment. Evaluate deals and shape the future.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { icon: Building2, label: "Active Deals", value: `${platformStats.activeDeals || entrepreneurs.length}`, color: "text-primary-600" },
                { icon: TrendingUp, label: "Capital Deployed", value: `$${AmountMeasureWithTags(platformStats.totalInvested ?? 0)}`, color: "text-green-600" },
                { icon: Users, label: "Investors", value: `${platformStats.totalInvestors}+`, color: "text-blue-600" },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                    <Icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                    <div className="text-lg font-black text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-600 font-semibold">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Deal */}
      {featuredEntrepreneur && !isLoading && (
        <section className="px-4 sm:px-6 lg:px-8 pb-16 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <FeaturedCard entrepreneur={featuredEntrepreneur} />
          </div>
        </section>
      )}

      {/* Main Content - with Sidebar */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <motion.div
              className={`${
                showMobileFilters ? "block" : "hidden"
              } lg:block bg-white rounded-2xl p-6 border border-gray-200 h-fit sticky top-16 md:top-20 overflow-hidden`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="font-bold text-lg text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Industry Filter */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-3">Industry</label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => {
                    setSelectedIndustry(e.target.value);
                    setShowMobileFilters(false);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                >
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stage Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Funding Stage</label>
                <div className="space-y-2">
                  {stages.map((stage) => (
                    <button
                      key={stage}
                      onClick={() => {
                        setSelectedStage(stage);
                        setShowMobileFilters(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-all ${
                        selectedStage === stage
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Filters */}
              {(selectedIndustry !== "All Industries" || selectedStage !== "All Stages") && (
                <button
                  onClick={() => {
                    setSelectedIndustry("All Industries");
                    setSelectedStage("All Stages");
                  }}
                  className="w-full mt-6 py-2.5 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>

            {/* Main Grid */}
            <div className="lg:col-span-3">
              {/* Header with Mobile Filter Toggle */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-gray-900">All Opportunities</h2>
                  <p className="text-gray-600 mt-1">
                    {filteredEntrepreneurs.length} opportunities found
                  </p>
                </div>
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-primary-100 text-primary-700 font-bold rounded-lg border border-primary-300"
                >
                  <Filter size={18} />
                  Filters
                </button>
              </div>

              {/* Cards Grid */}
              {isLoading ? (
                <div className="flex h-96 items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading opportunities...</p>
                  </div>
                </div>
              ) : filteredEntrepreneurs.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {paginatedEntrepreneurs.map((ent) => (
                      <OpportunityCard key={ent.userId || ent._id} entrepreneur={ent} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                        disabled={currentPage === 0}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold"
                      >
                        <ChevronLeft size={18} />
                        Previous
                      </button>

                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentPage(idx)}
                            className={`w-10 h-10 rounded-lg font-bold transition-all ${
                              currentPage === idx
                                ? "bg-primary-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {idx + 1}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={currentPage === totalPages - 1}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold"
                      >
                        Next
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Opportunities Found</h3>
                  <p className="text-gray-600">Try adjusting your filters to find more deals</p>
                </div>
              )}
            </div>
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
