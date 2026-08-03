import api from "../axios";

// Fetch Pending Admins
export const getPendingAdmins = () => {
  return api.get("/superadmin/pending-admins");
};

// Approve or Reject Admin 
export const approveAdmin = (userId, data) => {
  return api.patch(`/superadmin/approve-admin/${userId}`, data);
};