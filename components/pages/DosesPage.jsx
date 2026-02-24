"use client";

import React, { useState, useEffect } from "react";
import { toast } from 'sonner';
import api from "../../lib/axios";
import Card from "../shared/Card";
import Modal from "../shared/Modal";
import StatCard from "../shared/StatCard";

export default function DosesPage() {
  const [showGiveDoseModal, setShowGiveDoseModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // doseData stores input for the manual "Give Dose" form
  const [doseData, setDoseData] = useState({
    doseId: "", // user will type string e.g., "DOSE-123" or select
    userId: "",
  });

  // Since Backend has no "/dose/getAll", we might need to fetch users to see their doses.
  // Assuming we iterate through users to show dose history.
  const [doseRecords, setDoseRecords] = useState([]);
  const [stats, setStats] = useState({
    completed: 0,
    scheduled: 0,
    pending: 0
  });

  // Fetch users to display their dose status
  const fetchDoseRecords = async () => {
    setLoading(true);
    try {
      // NOTE: There is no direct "/dose/getAll". Doses are linked to Users.
      // So we fetch Users and check their 'dose' field.
      // Adjust endpoint if you have a specific user list endpoint.
      // Assuming /user/getAll exists based on typical patterns, or we simulate it.
      // If not, we might fail here. Let's try to find a way. 
      // Checking previous context, user fetching wasn't explicitly shown but implied.
      // Let's assume we can't fetch all doses easily without a backend change.
      // BUT, for now, we will try initialized empty and rely on manual entry or standard logic.

      // However, to show the table, we really need data. 
      // Let's try fetching users if possible. If not, we use local state or a different approach.
      // Since I cannot see User Controller, I will assume we might need to rely on what we have.
      // Wait, let's just use a placeholder for now as we don't have a clear "Get All Doses" endpoint.
      // Actually, let's try to reuse the pattern: maybe we can just show "Recent Vaccinations" if we had that.

      // Better approach: We will purely handle "Give Dose" here. 
      // And maybe show a list if we have a way to query.
      // Without get-all-doses, this View is hard to populate from Backend.
      // I will implement the "Give Dose" action robustly.

      // For the list, I will leave it empty with a message "Dose history not available" 
      // OR I will simply use the implementation to allow "Marking" without listing history 
      // if I can't fetch it.

      // Let's try to create a local simulation or if the user provided User Controller? 
      // User Controller was not provided in this turn.

      // Strategy: 
      // 1. Maintain local list of "Recently Administered" doses for this session.
      // 2. Allow adding/giving doses.

      // If checking previous turns, maybe I can find user endpoint?
      // I'll stick to robust "Give Dose" implementation.

      setDoseRecords([]);
    } catch (error) {
      console.error("Error fetching doses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoseRecords();
  }, []);

  const handleGiveDose = async (e) => {
    e.preventDefault();
    if (!doseData.doseId || !doseData.userId) {
      toast.error("Please enter Dose ID and User ID");
      return;
    }

    try {
      // API: /dose/giveDose1?doseId=...&userId=...
      const response = await api.post(
        `/dose/giveDose1?doseId=${doseData.doseId}&userId=${doseData.userId}`
      );

      toast.success(response.data || "Dose administered successfully!");
      setShowGiveDoseModal(false);

      // Add to local display for immediate feedback
      const newRecord = {
        id: Date.now(),
        userId: doseData.userId,
        // We don't get userName back easily, so use placeholder or ID
        userName: `User ${doseData.userId}`,
        doseId: doseData.doseId,
        date: new Date().toISOString().split('T')[0],
        status: "Completed"
      };

      setDoseRecords(prev => [newRecord, ...prev]);
      setStats(prev => ({ ...prev, completed: prev.completed + 1 }));
      setDoseData({ doseId: "", userId: "" });

    } catch (error) {
      console.error("Error giving dose:", error);
      toast.error(error.response?.data?.message || error.response?.data || "Failed to administer dose. Check User ID.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Doses Management</h1>
          <p className="page-subtitle">Administer vaccination doses to users</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowGiveDoseModal(true)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m18 2 4 4" />
            <path d="m17 7 3-3" />
            <path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" />
            <path d="m9 11 4 4" />
            <path d="m5 19-3 3" />
            <path d="m14 4 6 6" />
          </svg>
          Mark Dose as Given
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          icon="vaccines"
          value={stats.completed}
          label="Doses Administered (Session)"
          variant="success"
        />
        {/* Since we don't have global stats, we show session stats or placeholders */}
        <StatCard
          icon="appointments"
          value={0}
          label="Pending (Unknown)"
          variant="warning"
        />
      </div>

      <Card title="Recently Administered Doses">
        {doseRecords.length === 0 ? (
          <div className="text-center py-8 text-muted">
            <p>No doses administered in this session yet.</p>
            <p className="text-sm">Use the "Mark Dose as Given" button to record a vaccination.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {doseRecords.map((dose) => (
              <div key={dose.id} className="p-4 border rounded-lg shadow-sm bg-card hover:shadow-md transition-all">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div>
                    <h4 style={{ fontWeight: "600", marginBottom: "4px" }}>{dose.userName}</h4>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                      User ID: {dose.userId}
                    </p>
                  </div>
                  <span className="badge badge-success">
                    {dose.status}
                  </span>
                </div>
                <div className="detail-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <div className="detail-item">
                    <div className="detail-label">Dose ID</div>
                    <div className="detail-value" style={{ fontSize: "14px" }}>{dose.doseId}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Date</div>
                    <div className="detail-value" style={{ fontSize: "14px" }}>
                      {dose.date}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Give Dose Modal */}
      <Modal
        isOpen={showGiveDoseModal}
        onClose={() => setShowGiveDoseModal(false)}
        title="Mark Dose as Given"
        footer={
          <>
            <button
              className="btn btn-outline"
              onClick={() => setShowGiveDoseModal(false)}
            >
              Cancel
            </button>
            <button className="btn btn-success" onClick={handleGiveDose}>
              Confirm Dose Given
            </button>
          </>
        }
      >
        <form onSubmit={handleGiveDose}>
          <div className="form-group">
            <label className="form-label">Dose ID</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. DOSE-101"
              value={doseData.doseId}
              onChange={(e) => setDoseData({ ...doseData, doseId: e.target.value })}
              required
            />
            <small className="text-muted">Unique identifier for this dose event</small>
          </div>
          <div className="form-group">
            <label className="form-label">User ID (Patient) *</label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter User ID (integer)"
              value={doseData.userId}
              onChange={(e) => setDoseData({ ...doseData, userId: e.target.value })}
              required
            />
          </div>
          <div className="alert alert-warning">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" x2="12" y1="9" y2="13" />
              <line x1="12" x2="12.01" y1="17" y2="17" />
            </svg>
            <div>
              Please verify the patient&apos;s identity before administering the dose.
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
