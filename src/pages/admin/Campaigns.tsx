"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import CampForm from "../../components/camp/CampForm";
import { CampaignAnalyticsChart } from "../../components/admin/CampaignAnalyticsChart";
import { Card, CardHeader } from "../../components/ui/Card";

interface Campaign {
  _id: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  status: string;
  category: string;
  startDate: string;
  endDate: string;
  images?: string[];
}

export const Campaigns: React.FC = () => {
  const URL = import.meta.env.VITE_BACKEND_URL;
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filtered, setFiltered] = useState<Campaign[]>([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | undefined>(undefined);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(`${URL}/admin/campaigns`);
      setCampaigns(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("Failed to fetch campaigns");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.put(`${URL}/admin/campaigns/${id}/status`, { status });
      toast.success("Status updated!");
      fetchCampaigns();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = (id: string) => {
    setCampaignToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!campaignToDelete) return;
    try {
      await axios.delete(`${URL}/admin/campaigns/${campaignToDelete}`);
      toast.success("Campaign deleted");
      fetchCampaigns();
    } catch {
      toast.error("Failed to delete campaign");
    } finally {
      setDeleteModalOpen(false);
      setCampaignToDelete(null);
    }
  };

  const handleEdit = (c: Campaign) => {
    setEditingCampaign(c);
    setShowForm(true);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleSearch = (e: any) => {
    e.preventDefault();
    const q = query.toLowerCase();

    const result = campaigns.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );

    setFiltered(result);
  };

  const activeCampaigns = filtered.filter((c) => c.status === "active");

  const completedCampaigns = filtered.filter(
    (c) =>
      c.status === "completed" ||
      c.status === "stopped" ||
      new Date(c.endDate) < new Date()
  );

  const total = filtered.length;
  const active = activeCampaigns.length;
  const completed = completedCampaigns.length;

  const categories = ["All", ...new Set(campaigns.map((c) => c.category))];

  // ✅ ONLY FIX HERE (Analytics safe + correct)
  const chartData = filtered
    .filter((c) => selectedCategory === "All" || c.category === selectedCategory)
    .map((c) => ({
      name: c.title,
      raised: Number(c.raisedAmount) || 0,
      goal: Number(c.goalAmount) || 0,
    }));

  const renderCampaigns = (list: Campaign[]) => (
    <div className="flex gap-5 overflow-x-auto pb-6">
      {list.map((c) => {
        const progress = Math.min((c.raisedAmount / c.goalAmount) * 100, 100);

        return (
          <div
            key={c._id}
            className="min-w-[260px] relative group bg-white/70 backdrop-blur-lg 
                       border border-white/30 rounded-2xl shadow-lg 
                       hover:shadow-2xl hover:-translate-y-2 
                       transition-all duration-500 p-4 flex flex-col"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br 
              from-indigo-200/20 to-purple-200/20 opacity-0 
              group-hover:opacity-100 transition duration-500 pointer-events-none" />

            {c.images && c.images.length > 0 && (
              <div className="flex overflow-x-auto gap-2 mb-3 pb-1">
                {c.images.map((img, i) => (
                  <img
                    key={i}
                    src={`${URL}${img}`}
                    alt={c.title}
                    className="w-20 h-20 object-cover rounded-xl shadow-sm flex-shrink-0 hover:scale-105 transition"
                  />
                ))}
              </div>
            )}

            <h2 className="text-lg font-bold text-gray-800 group-hover:text-indigo-700 transition truncate">
              {c.title}
            </h2>

            <p className="text-xs text-gray-600 mt-1 line-clamp-3">
              {c.description}
            </p>

            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Raised</span>
                <span className="font-semibold text-indigo-600">
                  ${c.raisedAmount} / ${c.goalAmount}
                </span>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="text-xs mt-3 space-y-1 text-gray-500">
              <p>📂 {c.category}</p>
              <p>
                📅 {new Date(c.startDate).toLocaleDateString()} →{" "}
                {new Date(c.endDate).toLocaleDateString()}
              </p>
            </div>

            <div className="mt-3">
              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold 
                ${
                  c.status === "active"
                    ? "bg-green-100 text-green-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {c.status}
              </span>
            </div>

            <div className="flex gap-2 mt-auto pt-3">
              <button
                onClick={() => handleEdit(c)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full shadow"
              >
                ✏️
              </button>

              <button
                onClick={() => handleDelete(c._id)}
                className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-full shadow"
              >
                🗑️
              </button>

              {c.status === "active" ? (
                <button
                  onClick={() => updateStatus(c._id, "completed")}
                  className="flex-1  rounded-full py-1 text-xs font-semibold hover:scale-105 transition"
                >
                  Stop
                </button>
              ) : (
                <button
                  onClick={() => updateStatus(c._id, "active")}
                  className="flex-1 bg-indigo-600 text-white rounded-full py-1 text-xs font-semibold hover:scale-105 transition"
                >
                  Run
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Campaigns</h1>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value === "") setFiltered(campaigns);
          }}
          className="border px-3 py-2 rounded w-full"
        />
        <button className="bg-blue-500 text-white px-4 rounded">
          Search
        </button>
      </form>

      {/* ✅ ONLY FIX: safe chart render */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="font-bold">Campaign Analytics</h2>
        </CardHeader>

        <div className="p-4 h-[300px]">
          {chartData.length > 0 ? (
            <CampaignAnalyticsChart data={chartData} />
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>
      </Card>

      <div className="flex justify-around bg-white shadow rounded p-4 mb-6">
        <div><p>Total</p><p className="font-bold">{total}</p></div>
        <div><p>Active</p><p className="text-green-500 font-bold">{active}</p></div>
        <div><p>Completed</p><p className="text-blue-500 font-bold">{completed}</p></div>
      </div>

      <h2 className="text-xl font-bold text-green-600 mb-2">Active Campaigns</h2>
      {renderCampaigns(activeCampaigns)}

      <h2 className="text-xl font-bold text-blue-600 mt-6 mb-2">Completed Campaigns</h2>
      {renderCampaigns(completedCampaigns)}
    </div>
  );
};