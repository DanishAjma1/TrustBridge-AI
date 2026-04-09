import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Navbar } from "../../components/home/Navbar";
import { Footer } from "../../components/home/Footer";
import { Button } from "../../components/ui/Button";
import { Share2, Heart, Users, Target, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { ShareModal } from "../../components/common/ShareModal";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { StripeDonationForm } from "../../components/camp/StripeDonationForm";
import { motion } from "framer-motion";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface Campaign {
  _id: string;
  title: string;
  description: string;
  category: string;
  goalAmount: number;
  raisedAmount: number;
  images?: string[];
  video?: string;
  organizer?: string;
  endDate: string;
  startDate: string;
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

export const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_BACKEND_URL;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [relatedCampaigns, setRelatedCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [donationForm, setDonationForm] = useState<DonationFormData>({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    amount: 0,
    campaignId: "",
    campaignTitle: "",
  });

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${URL}/admin/campaigns`);
      const foundCampaign = response.data.find((c: Campaign) => c._id === id);

      if (foundCampaign) {
        setCampaign(foundCampaign);

        // Load related campaigns from the same category (excluding current campaign)
        const related = response.data.filter(
          (c: Campaign) => c.category === foundCampaign.category && c._id !== id && c.status === "active"
        ).slice(0, 3);
        setRelatedCampaigns(related);
      } else {
        toast.error("Campaign not found");
        navigate("/campaigns");
      }
    } catch (error) {
      console.error("Failed to fetch campaign:", error);
      toast.error("Failed to load campaign details");
      navigate("/campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCampaign();
    }
  }, [id, URL, navigate]);

  useEffect(() => {
    if (campaign?.images && campaign.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev === campaign.images!.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [campaign]);

  const nextImage = () => {
    if (campaign?.images) {
      setCurrentImageIndex((prev) => (prev === campaign.images!.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (campaign?.images) {
      setCurrentImageIndex((prev) => (prev === 0 ? campaign.images!.length - 1 : prev - 1));
    }
  };

  const calculateDaysLeft = (endDate: string): number => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleAmountClick = (amount: number) => {
    setDonationForm((prev) => ({ ...prev, amount }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  if (!campaign) {
    return null;
  }

  const progress = (campaign.raisedAmount / campaign.goalAmount) * 100;
  const daysLeft = calculateDaysLeft(campaign.endDate);

  return (
    <div className="min-h-screen bg-white pt-16 md:pt-20">
      <Navbar />

      {/* Back Button */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate("/All-Campaigns")}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Campaigns
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Media */}
          <motion.div className="space-y-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            {/* Video Section */}
            {campaign.video && (
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                <video src={`${URL}${campaign.video}`} controls className="w-full h-auto" />
              </div>
            )}

            {/* Images Section */}
            {campaign.images && campaign.images.length > 0 && (
              <div className="relative">
                {campaign.images.length === 1 ? (
                  <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                    <img
                      src={`${URL}${campaign.images[0]}`}
                      alt={campaign.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                    <div className="relative h-96">
                      {campaign.images.map((image, index) => (
                        <img
                          key={index}
                          src={`${URL}${image}`}
                          alt={`${campaign.title} - ${index + 1}`}
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                            index === currentImageIndex ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      ))}

                      {/* Navigation Buttons */}
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 transition-all shadow-lg z-10"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 transition-all shadow-lg z-10"
                      >
                        <ChevronRight size={20} />
                      </button>

                      {/* Indicators */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                        {campaign.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`rounded-full transition-all ${
                              index === currentImageIndex
                                ? "bg-primary-600 w-8 h-2"
                                : "bg-white/50 hover:bg-white/75 w-2 h-2"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              {[
                { icon: Heart, label: "Supporters", value: campaign.supporters?.length || 0 },
                { icon: Target, label: "Goal", value: `$${(campaign.goalAmount / 1000).toFixed(1)}K` },
                { icon: Users, label: "Raised", value: `$${(campaign.raisedAmount / 1000).toFixed(1)}K` },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                    <Icon className="w-5 h-5 text-primary-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                    <div className="font-bold text-gray-900">{stat.value}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div className="space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-primary-100 text-primary-700 text-sm font-bold rounded-full border border-primary-300">
                {campaign.category}
              </span>
              <span className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-bold rounded-full border border-gray-300">
                {campaign.isLifetime ? "⏳ Lifetime" : `⏳ ${daysLeft} days left`}
              </span>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                title="Share Campaign"
              >
                <Share2 size={18} />
              </button>
            </div>

            {/* Title & Organizer */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-3">{campaign.title}</h1>
              {campaign.organizer && (
                <p className="text-gray-600">
                  Organized by <span className="font-bold text-primary-600">{campaign.organizer}</span>
                </p>
              )}
            </div>

            {/* Progress Card */}
            <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-6 border border-primary-200">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Raised</p>
                  <p className="text-3xl font-black text-primary-600">
                    ${campaign.raisedAmount.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Goal</p>
                  <p className="text-3xl font-black text-gray-900">
                    ${campaign.goalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-right text-sm font-bold text-primary-600">{progress.toFixed(1)}% funded</p>
            </div>

            {/* Support Button */}
            <button
              onClick={() => {
                setDonationForm((prev) => ({
                  ...prev,
                  campaignId: campaign._id,
                  campaignTitle: campaign.title,
                  amount: Math.max(25, Math.ceil((campaign.goalAmount - campaign.raisedAmount) * 0.01)),
                }));
                setShowDonationForm(true);
              }}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg flex items-center justify-center gap-2"
            >
              <Heart size={20} /> Support This Campaign
            </button>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs font-bold text-gray-600 uppercase mb-2">Start Date</p>
                <p className="text-gray-900 font-semibold">
                  {new Date(campaign.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs font-bold text-gray-600 uppercase mb-2">End Date</p>
                <p className="text-gray-900 font-semibold">
                  {campaign.isLifetime
                    ? "Lifetime"
                    : new Date(campaign.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Description Section */}
        <motion.div
          className="mt-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-black text-gray-900 mb-4">About This Campaign</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">{campaign.description}</p>
        </motion.div>

        {/* Related Campaigns Section */}
        {relatedCampaigns.length > 0 && (
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-black text-gray-900 mb-8">Similar Campaigns</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedCampaigns.map((relatedCampaign) => (
                <motion.div
                  key={relatedCampaign._id}
                  onClick={() => navigate(`/campaigns/${relatedCampaign._id}`)}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl cursor-pointer transition-all duration-300"
                  whileHover={{ y: -4 }}
                >
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden bg-gradient-to-b from-primary-50 to-white">
                    <img
                      src={
                        relatedCampaign.images && relatedCampaign.images.length > 0
                          ? `${URL}${relatedCampaign.images[0]}`
                          : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"
                      }
                      alt={relatedCampaign.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                    <span className="absolute top-2 left-2 px-2.5 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">
                      {relatedCampaign.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">{relatedCampaign.title}</h3>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                          style={{
                            width: `${Math.min(
                              (relatedCampaign.raisedAmount / relatedCampaign.goalAmount) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-primary-600">
                          ${(relatedCampaign.raisedAmount / 1000).toFixed(0)}K
                        </span>
                        <span className="text-gray-600">
                          {((relatedCampaign.raisedAmount / relatedCampaign.goalAmount) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    {/* Supporters */}
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
                      <Users size={14} className="text-primary-600" />
                      {relatedCampaign.supporters?.length || 0} supporters
                    </div>

                    {/* Button */}
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="w-full py-2 px-3 bg-primary-50 hover:bg-primary-100 text-primary-600 font-semibold rounded-lg transition-all text-sm flex items-center justify-center gap-1"
                    >
                      <ArrowRight size={14} /> View Campaign
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Donation Modal */}
      {showDonationForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <motion.div
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-2xl">
              <h3 className="text-lg font-bold text-gray-900">Make Your Donation</h3>
              <button
                onClick={() => setShowDonationForm(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 space-y-6">
              {/* Campaign Info */}
              <div>
                <h4 className="font-bold text-gray-900">{campaign.title}</h4>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-900">${campaign.raisedAmount.toLocaleString()} raised</span>
                  <span className="text-gray-600">of ${campaign.goalAmount.toLocaleString()}</span>
                </div>
                <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                    style={{ width: `${Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Select Amount</label>
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
                    placeholder="Enter custom amount"
                  />
                </div>
              </div>

              {/* Stripe Form */}
              <Elements stripe={stripePromise}>
                <StripeDonationForm
                  amount={donationForm.amount}
                  campaignId={campaign._id}
                  onCancel={() => setShowDonationForm(false)}
                  onSuccess={() => {
                    setShowDonationForm(false);
                    fetchCampaign();
                  }}
                />
              </Elements>
            </div>
          </motion.div>
        </div>
      )}

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={campaign.title}
        url={window.location.href}
        theme="light"
      />

      <Footer />
    </div>
  );
};
