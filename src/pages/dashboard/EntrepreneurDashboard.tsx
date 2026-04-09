import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Bell,
  Calendar,
  TrendingUp,
  AlertCircle,
  PlusCircle,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { CollaborationRequestCard } from "../../components/collaboration/CollaborationRequestCard";
import { InvestorCard } from "../../components/investor/InvestorCard";
import { useAuth } from "../../context/AuthContext";
import { CollaborationRequest, Investor } from "../../types";
import { getRequestsForEntrepreneur, updateRequestStatus } from "../../data/collaborationRequests";
import { getAiRecommendations, getInvestorsFromDb } from "../../data/users";

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  const [collaborationRequests, setCollaborationRequests] = useState<
    CollaborationRequest[]
  >([]);
  const [recommendedInvestors, setRecommendedInvestors] = useState<Investor[]>([]);
  const [aiRecommendedInvestors, setAiRecommendedInvestors] = useState<Investor[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const userId = user?.userId;
    if (!userId) return;

    const fetchData = async () => {
      const investors = await getInvestorsFromDb();
      setRecommendedInvestors(Array.isArray(investors) ? investors : []);

      // Fetch AI recommendations
      setIsAiLoading(true);
      try {
        const recommendations = await getAiRecommendations(userId);
        setAiRecommendedInvestors(recommendations);
      } catch (error) {
        console.error("AI Recommendation fetch failed", error);
      } finally {
        setIsAiLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    const userId = user?.userId;
    if (!userId) return;

    const fetchRequests = async () => {
      const requests = await getRequestsForEntrepreneur(userId);
      setCollaborationRequests(Array.isArray(requests) ? requests : []);
    };

    fetchRequests();
  }, [user]);

  if (!user) return null;

  const pendingRequests = Array.isArray(collaborationRequests)
    ? collaborationRequests.filter((req) => req.requestStatus === "pending")
    : [];

  const handleRequestStatusUpdate = (
    requestId: string,
    status: "accepted" | "rejected"
  ) => {
    setCollaborationRequests((prevRequests) =>
      prevRequests.map((req) =>
        req._id === requestId ? { ...req, requestStatus: status } : req
      )
    );
    updateRequestStatus(requestId, status)
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user.name}
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your startup today
          </p>
        </div>

        <div className="flex gap-2">
          <Link to="/dashboard/entrepreneur/requests">
            <Button variant="outline" leftIcon={<Bell size={18} />}>
              Requests
            </Button>
          </Link>
          <Link to="/investors">
            <Button leftIcon={<PlusCircle size={18} />}>Find Investors</Button>
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary-50 border border-primary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Bell size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">
                  Pending Requests
                </p>
                <h3 className="text-xl font-semibold text-primary-900">
                  {pendingRequests.length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-secondary-50 border border-secondary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full mr-4">
                <Users size={20} className="text-secondary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700">
                  Total Connections
                </p>
                <h3 className="text-xl font-semibold text-secondary-900">
                  {
                    collaborationRequests.filter(
                      (req) => req.requestStatus === "accepted"
                    ).length
                  }
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-accent-50 border border-accent-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full mr-4">
                <Calendar size={20} className="text-accent-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-700">
                  Upcoming Meetings
                </p>
                <h3 className="text-xl font-semibold text-accent-900">2</h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-success-50 border border-success-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <TrendingUp size={20} className="text-success-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-success-700">
                  Profile Views
                </p>
                <h3 className="text-xl font-semibold text-success-900">24</h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collaboration requests */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Collaboration Requests
              </h2>
              <Badge variant="primary">{pendingRequests.length} pending</Badge>
            </CardHeader>

            <CardBody>
              {collaborationRequests.length > 0 ? (
                <div className="space-y-4">
                  {collaborationRequests.map((request) => (
                    <CollaborationRequestCard
                      key={request._id}
                      request={request}
                      onStatusUpdate={handleRequestStatusUpdate}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <AlertCircle size={24} className="text-gray-500" />
                  </div>
                  <p className="text-gray-600">No collaboration requests yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    When investors are interested in your startup, their
                    requests will appear here
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* AI Recommended investors */}
        <div className="space-y-4">
          <Card className="border-2 border-indigo-100 shadow-indigo-50">
            <CardHeader className="flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-indigo-100 p-1.5 flex items-center justify-center">
                  <img src="/logo-512x512.png" alt="TrustBridge AI" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-tight">
                    TrustBridge AI Matching
                  </h2>
                  <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">Top Investor Picks</p>
                </div>
              </div>
            </CardHeader>

            <CardBody className="space-y-4">
              {isAiLoading ? (
                <div className="py-8 flex flex-col items-center justify-center space-y-3">
                  <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="text-xs text-indigo-400 font-medium animate-pulse">Finding your perfect matches...</p>
                </div>
              ) : aiRecommendedInvestors && aiRecommendedInvestors.length > 0 ? (
                aiRecommendedInvestors.map((item: Investor, i) => (
                  <div key={i} className="hover:scale-[1.02] transition-transform">
                    <InvestorCard investor={item} />
                  </div>
                ))
              ) : (
                <div className="text-center py-6 px-4">
                  <p className="text-sm text-gray-500 italic">No direct matches found for your industry yet. Try updating your profile details!</p>
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Recommended Investors
              </h2>
              <Link
                to="/investors"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </CardHeader>

            <CardBody className="space-y-4">
              {recommendedInvestors && recommendedInvestors.length > 0 ? (
                recommendedInvestors.slice(0, 3).map((investor, i) => (
                  <div key={i}>
                    <InvestorCard investor={investor} />
                  </div>
                ))
              ) : (
                <div>No investors found</div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
