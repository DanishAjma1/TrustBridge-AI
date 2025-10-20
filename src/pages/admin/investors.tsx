import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  deleteInvestorByAdmin,
  fetchInvestorsForAdmin,
} from "../../data/adminData";
import { Investor } from "../../types";

export const Investors: React.FC = () => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);

  const deleteInvestor = async (id: string) => {
    try {
      await deleteInvestorByAdmin(id);
      setInvestors((prev) => prev.filter((i) => i.userId !== id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        setLoading(true);
        const fetchedInvestors = await fetchInvestorsForAdmin();
        setInvestors(fetchedInvestors ?? []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load investors");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, []);

  if (loading) return <p className="p-4 text-gray-600">Loading investors...</p>;

  if (investors.length === 0)
    return <p className="p-4 text-gray-600">No investors found.</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Investor Management</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow border">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-800 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Total Investments</th>
              <th className="px-4 py-3">Investment Interests</th>
              <th className="px-4 py-3">Is Online</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Exits</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {investors.map((inv) => (
              <tr key={inv.userId} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 flex flex-col">
                  <img
                    src={inv.avatarUrl}
                    alt=".."
                    className="h-8 w-8 rounded-full "
                  />
                  {inv.name}
                </td>
                <td className="px-4 py-2">{inv.email}</td>
                <td className="px-4 py-2">{inv.totalInvestments ?? 0}</td>
                <td className="px-4 py-2">
                  {inv.investmentInterests && inv.investmentInterests.length > 0
                    ? inv.investmentInterests.join(", ")
                    : "--"}
                </td>
                <td className="px-4 py-2">
                  <p
                    className={`${
                      inv.isOnline ? "bg-green-400" : "bg-gray-200"
                    } w-fit px-1 rounded-2xl `}
                  >
                    {inv.isOnline ? "Online" : "Offline"}
                  </p>
                </td>
                <td className="px-4 py-2">{inv.location || "--"}</td>
                <td className="px-4 py-2">{inv.successfullExits || "--"}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => deleteInvestor(inv.userId)}
                    className="text-red-600 hover:text-red-800 font-medium bg-gray-100 rounded-2xl px-3 py-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
