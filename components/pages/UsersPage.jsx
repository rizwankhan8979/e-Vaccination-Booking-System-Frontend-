"use client";

import React, { useState } from "react";
import api from "../../lib/axios";
import Card from "../shared/Card";
import Modal from "../shared/Modal";

export default function UsersPage() {
  // Search User state
  const [searchedUser, setSearchedUser] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Get Vaccination Date state
  const [vacDateUserId, setVacDateUserId] = useState("");
  const [vacDateResult, setVacDateResult] = useState(null);
  const [vacDateLoading, setVacDateLoading] = useState(false);
  const [vacDateError, setVacDateError] = useState("");

  // Update Email state
  const [updateEmailUserId, setUpdateEmailUserId] = useState("");
  const [updateEmailNewEmail, setUpdateEmailNewEmail] = useState("");
  const [updateEmailLoading, setUpdateEmailLoading] = useState(false);
  const [updateEmailSuccess, setUpdateEmailSuccess] = useState("");
  const [updateEmailError, setUpdateEmailError] = useState("");
  const [showUpdateEmailModal, setShowUpdateEmailModal] = useState(false);

  // Add User state (two-step OTP flow)
  const [showAddModal, setShowAddModal] = useState(false);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState("");
  const [addUserSuccess, setAddUserSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "MALE",
    contactNo: "",
  });

  // Get My Profile - GET /user/profile
  const handleGetMyProfile = async () => {
    setSearchLoading(true);
    setSearchError("");
    setSearchedUser(null);
    try {
      const response = await api.get("/user/profile");
      if (response.data) {
        setSearchedUser(response.data);
      } else {
        setSearchError("Profile not found");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      const msg = error.response?.data?.message || (typeof error.response?.data === 'string' ? error.response?.data : "Failed to fetch profile");
      setSearchError(msg);
    }
    setSearchLoading(false);
  };

  // Get Vaccination Date - GET /user/getVaccinationDate?userId=
  const handleGetVaccinationDate = async () => {
    if (!vacDateUserId) {
      setVacDateError("Please enter a User ID");
      return;
    }
    setVacDateLoading(true);
    setVacDateError("");
    setVacDateResult(null);
    try {
      const response = await api.get(`/user/getVaccinationDate?userId=${vacDateUserId}`);
      if (response.data) {
        setVacDateResult(response.data);
      } else {
        setVacDateError("No vaccination date found");
      }
    } catch (error) {
      console.error("Error fetching vaccination date:", error);
      const msg = error.response?.data?.message || (typeof error.response?.data === 'string' ? error.response?.data : "Dose not taken yet or user not found");
      setVacDateError(msg);
    }
    setVacDateLoading(false);
  };



  // Add User - POST /user/add
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.age || !formData.contactNo) {
      setAddUserError("Please fill in all required fields");
      return;
    }
    setAddUserLoading(true);
    setAddUserError("");
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        age: Number(formData.age),
        gender: formData.gender,
        contactNo: formData.contactNo,
      };

      const response = await api.post("/user/add", payload);
      const msg = response.data?.message || (typeof response.data === 'string' ? response.data : "User profile completed successfully!");
      setAddUserSuccess(msg);
      // Reset form after successful registration
      setTimeout(() => {
        resetAddUserForm();
      }, 2000);
    } catch (error) {
      console.error("Error adding user:", error);
      const msg = error.response?.data?.message || (typeof error.response?.data === 'string' ? error.response?.data : "Failed to add user. Please try again.");
      setAddUserError(msg);
    }
    setAddUserLoading(false);
  };

  const resetAddUserForm = () => {
    setShowAddModal(false);
    setFormData({
      name: "",
      email: "",
      age: "",
      gender: "MALE",
      contactNo: "",
    });
    setAddUserError("");
    setAddUserSuccess("");
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Users Management</h1>
          <p className="page-subtitle">
            View your profile, vaccination dates, and manage appointments
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" x2="12" y1="5" y2="19" />
            <line x1="5" x2="19" y1="12" y2="12" />
          </svg>
          Complete Profile
        </button>
      </div>

      {/* Section A: Get My Profile */}
      <Card
        title="My Profile"
        actions={
          <button
            className="btn btn-primary btn-sm"
            onClick={handleGetMyProfile}
            disabled={searchLoading}
          >
            {searchLoading ? "Loading..." : "Get Profile"}
          </button>
        }
      >
        <p style={{ color: "var(--text-secondary)", marginBottom: "16px", fontSize: "14px" }}>
          Click to view your profile details
        </p>

        {searchError && (
          <div className="alert alert-danger" style={{ marginTop: "16px" }}>
            {searchError}
          </div>
        )}

        {searchedUser && (
          <div style={{ marginTop: "24px" }}>
            <h4 style={{ marginBottom: "16px", fontWeight: "600", color: "var(--text-primary)" }}>
              User Details
            </h4>
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">User ID</div>
                <div className="detail-value">{searchedUser.userId}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Name</div>
                <div className="detail-value">{searchedUser.name}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Email</div>
                <div className="detail-value">{searchedUser.emailId}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Mobile No</div>
                <div className="detail-value">{searchedUser.mobileNo}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Age</div>
                <div className="detail-value">{searchedUser.age} years</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Gender</div>
                <div className="detail-value">{searchedUser.gender}</div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Section B: Get Vaccination Date */}
      <div style={{ marginTop: "24px" }}>
        <Card
          title="Get Vaccination Date"
          actions={
            <button
              className="btn btn-primary btn-sm"
              onClick={handleGetVaccinationDate}
              disabled={vacDateLoading}
            >
              {vacDateLoading ? "Loading..." : "Get Vaccination Date"}
            </button>
          }
        >
          <div className="form-group">
            <label className="form-label">User ID</label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter User ID"
              value={vacDateUserId}
              onChange={(e) => setVacDateUserId(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleGetVaccinationDate()}
            />
          </div>

          {vacDateError && (
            <div className="alert alert-warning" style={{ marginTop: "16px" }}>
              {vacDateError}
            </div>
          )}

          {vacDateResult && (
            <div style={{ marginTop: "16px" }}>
              <label className="form-label">Vaccination Date</label>
              <input
                type="text"
                className="form-input"
                value={vacDateResult}
                readOnly
                style={{ backgroundColor: "var(--background)", cursor: "not-allowed" }}
              />
            </div>
          )}
        </Card>
      </div>

      {/* Section C: Find User by Email */}
      <div style={{ marginTop: "24px" }}>
        <Card title="Find User by Email">
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter user email"
                id="search-email-input"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const email = e.target.value;
                    if (!email) return;
                    setSearchLoading(true);
                    setSearchError("");
                    setSearchedUser(null);
                    api.get(`/auth/by-email/${email}`)
                      .then(res => {
                        if (res.data) setSearchedUser(res.data);
                        else setSearchError("User not found");
                      })
                      .catch(err => {
                        console.error(err);
                        setSearchError("User not found or error occurred");
                      })
                      .finally(() => setSearchLoading(false));
                  }
                }}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                const email = document.getElementById("search-email-input").value;
                if (!email) {
                  setSearchError("Please enter an email");
                  return;
                }
                setSearchLoading(true);
                setSearchError("");
                setSearchedUser(null);
                api.get(`/auth/by-email/${email}`)
                  .then(res => {
                    if (res.data) setSearchedUser(res.data);
                    else setSearchError("User not found");
                  })
                  .catch(err => {
                    console.error(err);
                    setSearchError("User not found or error occurred");
                  })
                  .finally(() => setSearchLoading(false));
              }}
              disabled={searchLoading}
            >
              {searchLoading ? "Searching..." : "Search"}
            </button>
          </div>

          {searchError && (
            <div className="alert alert-danger" style={{ marginTop: "16px" }}>{searchError}</div>
          )}

          {searchedUser && (
            <div style={{ marginTop: "24px", padding: "16px", background: "var(--background-secondary)", borderRadius: "8px" }}>
              <h4 style={{ marginBottom: "12px", fontWeight: "600" }}>User Found:</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-label">Email</div>
                  <div className="detail-value">{searchedUser.email}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Role</div>
                  <div className="detail-value">{searchedUser.role}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Verified</div>
                  <div className="detail-value">{searchedUser.emailVerified ? "Yes" : "No"}</div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Section D: Update Email */}
      <div style={{ marginTop: "24px" }}>
        <Card title="Update Email">
          <div className="form-group">
            <label className="form-label">New Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter new email"
              value={updateEmailNewEmail}
              onChange={(e) => setUpdateEmailNewEmail(e.target.value)}
            />
          </div>
          <button
            className="btn btn-warning"
            onClick={async () => {
              if (!updateEmailNewEmail) {
                setUpdateEmailError("Please enter a new email");
                return;
              }
              setUpdateEmailLoading(true);
              setUpdateEmailError("");
              setUpdateEmailSuccess("");
              try {
                // 1. Send OTP to new email
                const response = await api.put("/auth/update-email", { newEmail: updateEmailNewEmail });
                setUpdateEmailSuccess(response.data?.message || "OTP sent successfully");
                setShowUpdateEmailModal(true); // Open Modal for OTP
              } catch (error) {
                console.error(error);
                setUpdateEmailError(error.response?.data?.message || "Failed to send OTP");
              } finally {
                setUpdateEmailLoading(false);
              }
            }}
            disabled={updateEmailLoading}
          >
            {updateEmailLoading ? "Sending OTP..." : "Update Email"}
          </button>

          {updateEmailSuccess && !showUpdateEmailModal && (
            <div className="alert alert-success" style={{ marginTop: "16px" }}>{updateEmailSuccess}</div>
          )}
          {updateEmailError && (
            <div className="alert alert-danger" style={{ marginTop: "16px" }}>{updateEmailError}</div>
          )}
        </Card>
      </div>

      {/* Update Email OTP Modal */}
      <Modal
        isOpen={showUpdateEmailModal}
        onClose={() => setShowUpdateEmailModal(false)}
        title="Verify New Email"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowUpdateEmailModal(false)}>Cancel</button>
            <button
              className="btn btn-primary"
              onClick={async () => {
                const otpVal = document.getElementById("modal-update-email-otp").value;
                if (!otpVal) {
                  setUpdateEmailError("Please enter OTP");
                  return;
                }
                setUpdateEmailLoading(true);
                setUpdateEmailError(""); // Clear previous errors
                try {
                  // 2. Verify OTP
                  const payload = {
                    newEmail: updateEmailNewEmail,
                    otp: Number(otpVal)
                  };
                  await api.post("/auth/verify-update-otp", payload);
                  alert("Email updated successfully! Please login again.");
                  window.location.href = "/";
                } catch (error) {
                  console.error(error);
                  // Show error in the modal context or toast? For now, we reuse the state or alert
                  alert(error.response?.data?.message || "Invalid OTP");
                } finally {
                  setUpdateEmailLoading(false);
                }
              }}
              disabled={updateEmailLoading}
            >
              {updateEmailLoading ? "Verifying..." : "Verify & Update"}
            </button>
          </>
        }
      >
        <div className="alert alert-info" style={{ marginBottom: "16px" }}>
          OTP sent to: <strong>{updateEmailNewEmail}</strong>
        </div>
        <div className="form-group">
          <label className="form-label">Enter 6-digit OTP</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="form-input"
            placeholder="Enter OTP"
            id="modal-update-email-otp"
            maxLength={6}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
            }}
          />
        </div>
      </Modal>



      {/* Section D: Register User Modal with Two-Step OTP Flow */}
      <Modal
        isOpen={showAddModal}
        onClose={resetAddUserForm}
        title="Complete User Profile"
        footer={
          <>
            <button className="btn btn-outline" onClick={resetAddUserForm}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleAddUser}
              disabled={addUserLoading}
            >
              {addUserLoading ? "Saving..." : "Save Profile"}
            </button>
          </>
        }
      >
        {addUserError && (
          <div className="alert alert-danger" style={{ marginBottom: "16px" }}>
            {addUserError}
          </div>
        )}
        {addUserSuccess && (
          <div className="alert alert-success" style={{ marginBottom: "16px" }}>
            {addUserSuccess}
          </div>
        )}

        <form onSubmit={handleAddUser}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email ID *</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Age *</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
                min="1"
                max="120"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gender *</label>
              <select
                className="form-select"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                required
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Contact No *</label>
            <input
              type="tel"
              className="form-input"
              placeholder="Enter contact number"
              value={formData.contactNo}
              onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
