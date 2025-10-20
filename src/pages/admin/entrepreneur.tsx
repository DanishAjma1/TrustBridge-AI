import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { deleteEntrepreneurByAdmin, fetchEntrepreneurForAdmin } from "../../data/adminData";
import { Entrepreneur } from "../../types";


export const Entrepreneurj: React.FC = () => {
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntrepreneurs = async () => {
    try {
      setLoading(true);
      const fetchedInvestors = await fetchEntrepreneurForAdmin();
      setEntrepreneurs(fetchedInvestors ?? []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load investors");
    } finally {
      setLoading(false);
    }
  };

  const deleteEntrepreneur = async (id: string) => {
    try {
      await deleteEntrepreneurByAdmin(id);
      setEntrepreneurs((prev) => prev.filter((i) => i.userId !== id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEntrepreneurs();
  }, []);

  if (loading)
    return <p className="p-4 text-gray-600">Loading entrepreneurs...</p>;
  if (entrepreneurs.length === 0)
    return <p className="p-4 text-gray-600">No entrepreneurs found.</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Entrepreneur Management</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow border">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-800 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Startup Name</th>
              <th className="px-4 py-3">Industry</th>
              <th className="px-4 py-3">Growth Rate</th>
              <th className="px-4 py-3">Team Size</th>
              <th className="px-4 py-3">Founded Year</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {entrepreneurs.map((user) => (
              <tr key={user.userId} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{user.name || "--"}</td>
                <td className="px-4 py-2">{user.email || "--"}</td>
                <td className="px-4 py-2">{user.startupName || "--"}</td>
                <td className="px-4 py-2">{user.industry || "--"}</td>
                <td className="px-4 py-2">{user.growthRate || "--"}</td>
                <td className="px-4 py-2">{user.teamSize || "--"}</td>
                <td className="px-4 py-2">{user.foundedYear || "--"}</td>
                <td className="px-4 py-2">{user.location || "--"}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => deleteEntrepreneur(user.userId)}
                    className="text-red-600 hover:text-red-800 font-medium"
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
