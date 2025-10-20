import axios from "axios";
import toast from "react-hot-toast";

export const fetchInvestorsForAdmin = async () => {
  try {
    const res = await axios(`${import.meta.env.VITE_BACKEND_URL}/admin/get-investors`);
    const { investors } = res.data;
    return investors || [];
  } catch (error) {
    console.error(error);
    toast.error("Failed to load investors");
  }
};

export const deleteInvestorByAdmin = async (id: string) => {
  if (!confirm("Are you sure you want to delete this investor?")) return;

  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/admin/user/${id}`,
      { withCredentials: true }
    );
    if (res.status !== 200) throw new Error("Failed to delete");
    toast.success("Investor deleted successfully");
  } catch (error) {
    toast.error("Error deleting investor: " + error);
  }
};

export const fetchEntrepreneurForAdmin = async () => {
  try {
    const res = await axios(`${import.meta.env.VITE_BACKEND_URL}/admin/get-entrepreneurs`);
    const { entrepreneurs } = res.data;
    return entrepreneurs || [];
  } catch (error) {
    console.error(error);
    toast.error("Failed to load Entrepreneurs");
  }
};

export const deleteEntrepreneurByAdmin = async (id: string) => {
  if (!confirm("Are you sure you want to delete this Entrepreneur?")) return;

  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/admin/user/${id}`,
      { withCredentials: true }
    );
    if (res.status !== 200) throw new Error("Failed to delete");
    toast.success("Entrepreneur deleted successfully");
  } catch (error) {
    toast.error("Error deleting Entrepreneur: " + error);
  }
};
