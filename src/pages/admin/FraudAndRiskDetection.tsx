import { useEffect, useState } from "react";
import axios from "axios";
import { FraudAndRiskDetectionChart } from "../../components/admin/FraudAndRiskDetectionChart";

interface SummaryItem {
  eventType: string;
  email: string;
  count: number;
}

interface FinalItem {
  eventType: string;
  riskScore: number;
  count: number;
}

interface DetailedRiskEvent {
  email: string;
  eventType: string;
  reason: string;
  riskScore: number;
  isFraud?: boolean;
  createdAt?: string;
}

export const FraudAndRiskDetection: React.FC = () => {
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [finalData, setFinalData] = useState<FinalItem[]>([]);
  const [detailedEvents, setDetailedEvents] = useState<DetailedRiskEvent[]>([]);
  const [unapprovedUsers, setUnapprovedUsers] = useState<DetailedRiskEvent[]>([]);
  const [suspiciousEmails, setSuspiciousEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "detailed" | "unapproved" | "suspicious">("overview");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        // Prefer an explicit admin token (adminToken) so you can keep a normal user token
        // in localStorage for other roles while testing admin in dev.
        const adminToken = localStorage.getItem("adminToken") || localStorage.getItem("token");

        if (!adminToken) {
          setError("No authentication token found. Please log in as admin or set 'adminToken' in localStorage.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/risk-detection-flags`,
          {
            headers: {
                Authorization: `Bearer ${adminToken}`,
              },
          }
        );
        // Log full response for debugging
        // eslint-disable-next-line no-console
        console.log("/admin/risk-detection-flags response:", res.data);
        setSummary(res.data.summary || []);
        setFinalData(res.data.finalData || []);
        setDetailedEvents(res.data.detailedEvents || []);
        setUnapprovedUsers(res.data.unapprovedUsers || []);
        setSuspiciousEmails(res.data.suspiciousEmails || []);
        setLastUpdated(new Date().toLocaleString());
      } catch (err: any) {
        console.error("Error fetching risk flags:", err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to fetch risk data";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchDebugEvents = async () => {
    try {
      // only allow in dev mode
      if (import.meta.env.MODE === "production") return;
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/risk-detection-debug`);
      // eslint-disable-next-line no-console
      console.log("/admin/risk-detection-debug response:", res.data);
      const events = res.data.events || [];
      setDetailedEvents(events as DetailedRiskEvent[]);
      // derive summary/finalData minimally for display
      const summaryAgg = [] as SummaryItem[];
      const finalAggMap: Record<string, { riskScore: number; count: number }> = {};
      events.forEach((e: any) => {
        const et = e.eventType || "other";
        const idx = summaryAgg.findIndex(s => s.eventType === et);
        if (idx === -1) summaryAgg.push({ eventType: et, email: e.email || "", count: 1 });
        else summaryAgg[idx].count += 1;

        if (!finalAggMap[et]) finalAggMap[et] = { riskScore: e.riskScore || 0, count: 0 };
        finalAggMap[et].count += 1;
      });
      setSummary(summaryAgg);
      setFinalData(Object.keys(finalAggMap).map(k => ({ eventType: k, riskScore: finalAggMap[k].riskScore, count: finalAggMap[k].count })));
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error fetching debug events:", err);
    }
  };

  if (loading) return <div className="p-6">Loading risk data…</div>;

  if (error) return <div className="p-6 text-red-600 bg-red-50 rounded border border-red-200">Error: {error}</div>;

  const getRiskBadgeColor = (riskScore: number) => {
    if (riskScore >= 30) return "bg-red-100 text-red-800";
    if (riskScore >= 20) return "bg-orange-100 text-orange-800";
    if (riskScore >= 10) return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-12 gap-6">
        {/* Left: summary + description */}
        <div className="col-span-12 md:col-span-4">
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold">Fraud & Risk Detection</h1>
            <div className="text-sm text-gray-500 mt-1">Monitor suspicious activity, failed logins and high-risk events.</div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-3 sm:col-span-1 bg-white rounded-lg p-3 shadow-sm border flex flex-col">
                <div className="text-xs text-gray-400">Total Flagged</div>
                <div className="mt-1 text-2xl font-bold">{detailedEvents.length + unapprovedUsers.length + suspiciousEmails.length}</div>
                <div className="text-xs text-gray-500 mt-1">Events detected</div>
              </div>
              <div className="col-span-3 sm:col-span-1 bg-white rounded-lg p-3 shadow-sm border flex flex-col">
                <div className="text-xs text-gray-400">Failed Logins</div>
                <div className="mt-1 text-2xl font-bold">{detailedEvents.filter(e => e.eventType === 'failed_login' || e.eventType === 'multiple_time_failed_login').length}</div>
                <div className="text-xs text-gray-500 mt-1">Login failures</div>
              </div>
              <div className="col-span-3 sm:col-span-1 bg-white rounded-lg p-3 shadow-sm border flex flex-col">
                <div className="text-xs text-gray-400">Unapproved</div>
                <div className="mt-1 text-2xl font-bold">{unapprovedUsers.length}</div>
                <div className="text-xs text-gray-500 mt-1">Blocked / Rejected</div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-600">{summary.length > 0 ? 'Summary of flagged events by type.' : 'No flagged events yet.'}</div>
              <div className="text-xs text-gray-400 mt-2">Updated: {lastUpdated ?? '—'}</div>
            </div>
          </div>
        </div>

        {/* Right: chart */}
        <div className="col-span-12 md:col-span-8">
          <div className="bg-white border rounded-lg p-4 shadow-sm h-full flex flex-col">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">Trend (last 12 months)</h3>
                <div className="text-xs text-gray-500">Event counts and risk score by type</div>
              </div>
              <div className="flex items-center gap-2">
                {import.meta.env.MODE !== 'production' && (
                  <button onClick={fetchDebugEvents} className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Load debug</button>
                )}
              </div>
            </div>

            <div className="mt-4 flex-1 min-h-[450px]">
              <FraudAndRiskDetectionChart data={finalData} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-transparent">
        <div className="flex gap-2 items-center">
          {['overview','detailed','unapproved','suspicious'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab===tab? 'bg-blue-600 text-white': 'bg-gray-100 text-gray-700'}`}
            >{tab === 'overview' ? 'Overview' : tab === 'detailed' ? 'Failed Logins' : tab === 'unapproved' ? 'Unapproved' : 'Suspicious'}</button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-12 gap-6">
          <div className="col-span-12">
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <h4 className="text-md font-semibold mb-2">Event Summary</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-left">
                        <tr>
                          <th className="p-3">Event Type</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.map((item, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{item.eventType.replace(/_/g,' ').toUpperCase()}</td>
                            <td className="p-3">{item.email}</td>
                            <td className="p-3">{item.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <h4 className="text-md font-semibold mb-2">Risk Score Breakdown</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-left">
                        <tr>
                          <th className="p-3">Event Type</th>
                          <th className="p-3">Risk Score</th>
                          <th className="p-3">Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {finalData.map((item, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{item.eventType.replace(/_/g,' ').toUpperCase()}</td>
                            <td className="p-3"><span className={`px-3 py-1 rounded-full font-semibold ${getRiskBadgeColor(item.riskScore)}`}>{item.riskScore}</span></td>
                            <td className="p-3">{item.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed */}
            {activeTab === 'detailed' && (
              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <h4 className="text-md font-semibold mb-3">Failed Login Attempts & Patterns</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                      <tr>
                        <th className="p-3">Email</th>
                        <th className="p-3">Event</th>
                        <th className="p-3">Reason</th>
                        <th className="p-3">Risk</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Flag</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailedEvents.filter(e => e.eventType !== 'unapproved_login_attempt').map((event, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{event.email}</td>
                          <td className="p-3">{event.eventType.replace(/_/g,' ').toUpperCase()}</td>
                          <td className="p-3">{event.reason}</td>
                          <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-semibold ${getRiskBadgeColor(event.riskScore)}`}>{event.riskScore}</span></td>
                          <td className="p-3 text-xs">{event.createdAt ? new Date(event.createdAt).toLocaleString() : 'N/A'}</td>
                          <td className="p-3">{event.isFraud ? <span className="text-red-600 font-semibold">Fraud</span> : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Unapproved */}
            {activeTab === 'unapproved' && (
              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <h4 className="text-md font-semibold mb-3">Unapproved / Rejected Attempts</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                      <tr>
                        <th className="p-3">Email</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Reason</th>
                        <th className="p-3">Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unapprovedUsers.map((u, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{u.email}</td>
                          <td className="p-3">{u.eventType.replace(/_/g,' ')}</td>
                          <td className="p-3">{u.reason}</td>
                          <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-semibold ${getRiskBadgeColor(u.riskScore)}`}>{u.riskScore}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Suspicious */}
            {activeTab === 'suspicious' && (
              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <h4 className="text-md font-semibold mb-3">Suspicious Email Patterns</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                      <tr>
                        <th className="p-3">Email</th>
                        <th className="p-3">Event Type</th>
                        <th className="p-3">Occurrences</th>
                        <th className="p-3">Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suspiciousEmails.map((s, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{s.email}</td>
                          <td className="p-3">{s.eventType}</td>
                          <td className="p-3">{s.count}</td>
                          <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-semibold ${getRiskBadgeColor(s.riskScore)}`}>{s.riskScore}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
