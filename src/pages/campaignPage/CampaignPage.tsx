import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { StripeDonationForm } from "../../components/camp/StripeDonationForm";
import { Navbar } from "../../components/home/Navbar";
import { Footer } from "../../components/home/Footer";
import { Button } from "../../components/ui/Button";
import { ArrowRight, TrendingUp, Users, Target, Heart, Filter, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface CampaignCardProps {
  _id: string;
  title: string;
  description: string;
  category: string;
  goalAmount: number;
  raisedAmount: number;
  images?: string[];
  organizer?: string;
  endDate: string;
  status: string;
  isLifetime?: boolean;
  supporters?: Array<{
    supporterId: string;
    amount: number;
    date: Date;
  }>;
}

interface DonationFormData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  amount: number;
  campaignId: string;
  campaignTitle: string;
}

export const CampaignsPage: React.FC = () => {
  const URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<CampaignCardProps[]>([]);
  const [allCampaigns, setAllCampaigns] = useState<CampaignCardProps[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<CampaignCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignCardProps | null>(null);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [donationForm, setDonationForm] = useState<DonationFormData>({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    amount: 0,
    campaignId: "",
    campaignTitle: "",
  });

  const categories = ["Technology", "Health", "Education", "Environment", "Other"];

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${URL}/admin/campaigns`);
      const data = response.data || [];
      setAllCampaigns(data);
      const activeCampaigns = data.filter((campaign: CampaignCardProps) => campaign.status === "active");
      setCampaigns(activeCampaigns);
      setFilteredCampaigns(activeCampaigns);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [URL]);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredCampaigns(campaigns);
    } else {
      setFilteredCampaigns(campaigns.filter((campaign) => campaign.category === selectedCategory));
    }
  }, [selectedCategory, campaigns]);

  const calculateDaysLeft = (endDate: string): number => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const CampaignCard: React.FC<CampaignCardProps> = ({
    _id,
    title,
    description,
    category,
    goalAmount,
    raisedAmount,
    images,
    organizer,
    endDate,
    isLifetime,
  }) => {
    const progress = (raisedAmount / goalAmount) * 100;
    const daysLeft = calculateDaysLeft(endDate);
    const displayImage =
      images && images.length > 0
        ? `${URL}${images[0]}`
        : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800";

    return (
      <motion.div
        onClick={() => navigate(`/campaigns/${_id}`)}
        className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl cursor-pointer transition-all duration-300"
        whileHover={{ y: -4 }}
      >
        {/* Image Section */}
        <div className="relative h-40 overflow-hidden bg-gradient-to-b from-primary-50 to-white">
          <img
            src={displayImage}
            alt={title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

          {/* Badges */}
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">
              {category}
            </span>
          </div>
          <div className="absolute top-2 right-2">
            <span className="px-2.5 py-1 bg-white/95 text-gray-700 text-xs font-bold rounded-full border border-gray-200">
              {isLifetime ? "⏳ Lifetime" : `⏳ ${daysLeft}d`}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">{title}</h3>
          <p className="text-xs text-gray-600 mb-3 line-clamp-1">{description}</p>

          {organizer && (
            <p className="text-xs text-gray-500 mb-3">
              By <span className="font-semibold text-primary-600">{organizer}</span>
            </p>
          )}

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">
                <span className="font-bold text-primary-600">${(raisedAmount / 1000).toFixed(0)}K</span>
              </span>
              <span className="text-gray-600">{progress.toFixed(0)}%</span>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCampaign({ _id, title, description, category, goalAmount, raisedAmount, images, organizer, endDate, status: "active" });
              setDonationForm((prev) => ({
                ...prev,
                campaignId: _id,
                campaignTitle: title,
                amount: Math.max(25, Math.ceil((goalAmount - raisedAmount) * 0.01)),
              }));
              setShowDonationForm(true);
            }}
            className="w-full px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-200 text-sm flex items-center justify-center gap-1"
          >
            <Heart size={14} /> Support
          </button>
        </div>
      </motion.div>
    );
  };

  const handleAmountClick = (amount: number) => {
    setDonationForm((prev) => ({ ...prev, amount }));
  };

  const handleCloseModal = () => {
    setShowDonationForm(false);
    setSelectedCampaign(null);
    setDonationForm({ cardNumber: "", cardHolder: "", expiryDate: "", cvv: "", amount: 0, campaignId: "", campaignTitle: "" });
  };

  return (
    <div className="min-h-screen bg-white pt-16 md:pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50 to-white overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-8 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

        <div className="max-w-7xl mx-auto relative z-10 text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full border border-primary-300 mb-6">
              <Heart size={16} />
              <span className="text-sm font-semibold">Make a Difference</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-4">
              Support <span className="text-primary-600">Impactful</span> Campaigns
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Discover campaigns making real change. Every donation, no matter the amount, contributes to meaningful impact.
            </p>

            {/* Quick Stats */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {[
                { icon: TrendingUp, label: "Active Campaigns", value: campaigns.length },
                { icon: Target, label: "Total Raised", value: `$${(allCampaigns.reduce((sum, c) => sum + c.raisedAmount, 0) / 1000).toFixed(0)}K` },
                {
                  icon: Users,
                  label: "Success Rate",
                  value: `${allCampaigns.length > 0 ? Math.round((allCampaigns.filter((c) => c.raisedAmount >= c.goalAmount).length / allCampaigns.length) * 100) : 0}%`,
                },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                    <Icon className="w-5 h-5 text-primary-600 mx-auto mb-2" />
                    <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Scroll Down Indicator */}
          <motion.div
            className="mt-12 flex justify-center"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <button
              onClick={() => window.scrollBy({ top: 400, behavior: "smooth" })}
              className="p-3 rounded-full bg-white border-2 border-primary-300 hover:border-primary-600 text-primary-600 hover:text-primary-700 transition-all"
            >
              <ChevronDown size={24} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="sticky top-24 bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                  <Filter size={20} className="text-primary-600" />
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                </div>

                {/* Category Filter */}
                <div className="space-y-3">
                  <p className="text-sm font-bold text-gray-700 uppercase">Category</p>
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className={`w-full px-4 py-2.5 rounded-lg text-left font-semibold transition-all text-sm ${
                      selectedCategory === "All"
                        ? "bg-primary-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    All Causes
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full px-4 py-2.5 rounded-lg text-left font-semibold transition-all text-sm ${
                        selectedCategory === cat
                          ? "bg-primary-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {filteredCampaigns.length === 0 ? (
                <div className="text-center py-20">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedCategory === "All" ? "No Active Campaigns" : `No ${selectedCategory} Campaigns`}
                  </h3>
                  <p className="text-gray-600">Check back soon for amazing campaigns to support!</p>
                </div>
              ) : (
                <>
                  {/* Featured Campaign */}
                  {filteredCampaigns.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-8 border border-primary-200"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        {/* Featured Image - Clickable */}
                        <div
                          className="relative rounded-xl overflow-hidden h-80 shadow-lg cursor-pointer group"
                          onClick={() => navigate(`/campaigns/${filteredCampaigns[0]._id}`)}
                        >
                          <img
                            src={
                              filteredCampaigns[0].images && filteredCampaigns[0].images.length > 0
                                ? `${URL}${filteredCampaigns[0].images[0]}`
                                : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"
                            }
                            alt={filteredCampaigns[0].title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          <span className="absolute top-4 left-4 px-4 py-2 bg-primary-600 text-white text-sm font-bold rounded-full">
                            Featured
                          </span>
                        </div>

                        {/* Featured Campaign Details */}
                        <div className="space-y-6">
                          <div
                            className="cursor-pointer group"
                            onClick={() => navigate(`/campaigns/${filteredCampaigns[0]._id}`)}
                          >
                            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full mb-3">
                              {filteredCampaigns[0].category}
                            </span>
                            <h2 className="text-3xl font-black text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                              {filteredCampaigns[0].title}
                            </h2>
                            {filteredCampaigns[0].organizer && (
                              <p className="text-gray-600">
                                By <span className="font-bold text-primary-600">{filteredCampaigns[0].organizer}</span>
                              </p>
                            )}
                          </div>

                          {/* Progress */}
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="font-bold text-gray-900">${filteredCampaigns[0].raisedAmount.toLocaleString()} raised</span>
                              <span className="text-gray-600">{((filteredCampaigns[0].raisedAmount / filteredCampaigns[0].goalAmount) * 100).toFixed(0)}%</span>
                            </div>
                            <div className="h-2.5 bg-white rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                                style={{ width: `${Math.min((filteredCampaigns[0].raisedAmount / filteredCampaigns[0].goalAmount) * 100, 100)}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-600 mt-2">Goal: ${filteredCampaigns[0].goalAmount.toLocaleString()}</p>
                          </div>

                          {/* Quick Stats */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <p className="text-xs text-gray-600 mb-1">Supporters</p>
                              <p className="text-xl font-bold text-primary-600">{filteredCampaigns[0].supporters?.length || 0}</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <p className="text-xs text-gray-600 mb-1">Time Left</p>
                              <p className="text-xl font-bold text-gray-900">{calculateDaysLeft(filteredCampaigns[0].endDate)} days</p>
                            </div>
                          </div>

                          {/* Support Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCampaign(filteredCampaigns[0]);
                              setDonationForm((prev) => ({
                                ...prev,
                                campaignId: filteredCampaigns[0]._id,
                                campaignTitle: filteredCampaigns[0].title,
                                amount: Math.max(25, Math.ceil((filteredCampaigns[0].goalAmount - filteredCampaigns[0].raisedAmount) * 0.01)),
                              }));
                              setShowDonationForm(true);
                            }}
                            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                          >
                            <Heart size={18} /> Support This Campaign
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Other Campaigns Grid */}
                  {filteredCampaigns.length > 1 && (
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-6">Other Campaigns</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredCampaigns.slice(1).map((campaign) => (
                          <CampaignCard key={campaign._id} {...campaign} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Donation Modal */}
      {showDonationForm && selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <motion.div
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-2xl">
              <h3 className="text-lg font-bold text-gray-900">Support This Campaign</h3>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 space-y-6">
              {/* Campaign Info */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4">{selectedCampaign.title}</h4>

                {/* Progress */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700 font-semibold">${selectedCampaign.raisedAmount.toLocaleString()} raised</span>
                    <span className="text-gray-600">of ${selectedCampaign.goalAmount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                      style={{
                        width: `${Math.min(
                          (selectedCampaign.raisedAmount / selectedCampaign.goalAmount) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Donation Amount</label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[25, 50, 100, 250, 500, 1000].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleAmountClick(amount)}
                      className={`py-2.5 rounded-lg font-semibold text-sm transition-all ${
                        donationForm.amount === amount
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold">$</span>
                  <input
                    type="number"
                    min="1"
                    value={donationForm.amount || ""}
                    onChange={(e) =>
                      setDonationForm((prev) => ({
                        ...prev,
                        amount: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              {/* Stripe Form */}
              <Elements stripe={stripePromise}>
                <StripeDonationForm
                  amount={donationForm.amount}
                  campaignId={selectedCampaign._id}
                  onSuccess={() => {
                    handleCloseModal();
                    fetchCampaigns();
                  }}
                  onCancel={handleCloseModal}
                />
              </Elements>
            </div>
          </motion.div>
        </div>
      )}

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

