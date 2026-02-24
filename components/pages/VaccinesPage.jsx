"use client";

import React, { useState, useEffect } from "react";
import { toast } from 'sonner';
import api from "../../lib/axios";
import Card from "../shared/Card";
import Table from "../shared/Table";
import Modal from "../shared/Modal";
import StatCard from "../shared/StatCard";

export default function VaccinesPage() {
  const [vaccines, setVaccines] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAssociateModal, setShowAssociateModal] = useState(false);

  // Selection
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [doctorVaccines, setDoctorVaccines] = useState([]);

  // Forms
  const [formData, setFormData] = useState({
    vaccineName: "",
    manufacturer: "",
    dosesRequired: "",
    ageRange: "",
    status: "Active",
  });

  const [associateData, setAssociateData] = useState({
    vaccineId: "",
    doctorId: "",
  });

  // Fetch all vaccines
  const fetchVaccines = async () => {
    setLoading(true);
    try {
      const response = await api.get("/vaccine/getAll");
      setVaccines(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching vaccines:", error);
      toast.error("Failed to fetch vaccines");
      setVaccines([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all doctors for dropdowns
  const fetchDoctors = async () => {
    try {
      const response = await api.get("/doctor/getAll");
      setDoctors(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      // Not critical to fail page load if doctors fail, but good to know
    }
  };

  // Fetch vaccines by doctor
  const fetchVaccinesByDoctor = async (doctorId) => {
    if (!doctorId) {
      setDoctorVaccines([]);
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/vaccine/doctor/${doctorId}`);
      setDoctorVaccines(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching doctor vaccines:", error);
      toast.error("Failed to fetch doctor's vaccines");
      setDoctorVaccines([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVaccineDetail = async (id) => {
    try {
      const response = await api.get(`/vaccine/get/${id}`);
      setSelectedVaccine(response.data);
      setShowDetailModal(true);
    } catch (error) {
      console.error("Error fetching vaccine detail:", error);
      toast.error("Failed to fetch vaccine details");
    }
  };

  useEffect(() => {
    fetchVaccines();
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctorId) {
      fetchVaccinesByDoctor(selectedDoctorId);
    } else {
      setDoctorVaccines([]);
    }
  }, [selectedDoctorId]);

  // Handle Add Vaccine
  const handleAddVaccine = async (e) => {
    e.preventDefault();
    if (!formData.vaccineName || !formData.manufacturer || !formData.dosesRequired) {
      toast.error("Please fill in required fields");
      return;
    }
    try {
      const payload = {
        vaccineName: formData.vaccineName,
        manufacturer: formData.manufacturer,
        dosesRequired: Number(formData.dosesRequired),
        ageRange: formData.ageRange, // string, e.g. "18-60"
        status: formData.status,
      };

      await api.post("/vaccine/add", payload);
      toast.success("Vaccine added successfully!");
      setShowAddModal(false);

      setFormData({
        vaccineName: "",
        manufacturer: "",
        dosesRequired: "",
        ageRange: "",
        status: "Active",
      });
      fetchVaccines();
    } catch (error) {
      console.error("Error adding vaccine:", error);
      toast.error(error.response?.data?.message || error.response?.data || "Failed to add vaccine");
    }
  };

  // Handle Associate Vaccine with Doctor
  const handleAssociateWithDoctor = async (e) => {
    e.preventDefault();
    if (!associateData.vaccineId || !associateData.doctorId) {
      toast.error("Select both vaccine and doctor");
      return;
    }
    try {
      await api.post(
        `/vaccine/associate/${associateData.vaccineId}/doctor/${associateData.doctorId}`
      );
      toast.success("Vaccine associated with doctor successfully!");
      setShowAssociateModal(false);
      setAssociateData({ vaccineId: "", doctorId: "" });

      // Refresh list if we are in 'By Doctor' view and the selected doctor was updated
      if (activeTab === "byDoctor" && Number(selectedDoctorId) === Number(associateData.doctorId)) {
        fetchVaccinesByDoctor(selectedDoctorId);
      }
    } catch (error) {
      console.error("Error associating vaccine:", error);
      toast.error(error.response?.data?.message || error.response?.data || "Failed to associate");
    }
  };

  const columns = [
    { key: "vaccineName", label: "Vaccine Name" },
    { key: "manufacturer", label: "Manufacturer" },
    { key: "dosesRequired", label: "Doses Required" },
    { key: "ageRange", label: "Age Range" },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span className={`badge ${value === "Active" ? "badge-success" : "badge-danger"}`}>
          {value || "Active"}
        </span>
      ),
    },
  ];

  const emptyState = (
    <div className="flex flex-col items-center gap-4">
      <span>{activeTab === "byDoctor" ? "No vaccines found for this doctor" : "No vaccines registered yet"}</span>
      {activeTab === "all" && (
        <button
          className="text-sm text-primary hover:underline"
          onClick={async () => {
            setLoading(true);
            try {
              const samples = [
                { vaccineName: "COVID-19 Pfizer", manufacturer: "Pfizer", dosesRequired: 2, ageRange: "12+", status: "Active" },
                { vaccineName: "COVID-19 Moderna", manufacturer: "Moderna", dosesRequired: 2, ageRange: "18+", status: "Active" },
                { vaccineName: "Influenza", manufacturer: "Sanofi", dosesRequired: 1, ageRange: "6mos+", status: "Active" }
              ];
              await Promise.all(samples.map(data => api.post("/vaccine/add", data)));
              toast.success("Sample vaccines loaded");
              fetchVaccines();
            } catch (err) {
              console.error(err);
              toast.error("Failed to load sample vaccines");
              setLoading(false);
            }
          }}
        >
          Load Sample Data
        </button>
      )}
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Vaccines Management</h1>
          <p className="page-subtitle">Manage vaccines and doctor associations</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className="btn btn-outline"
            onClick={() => setShowAssociateModal(true)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            Associate with Doctor
          </button>
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
            Add Vaccine
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon="vaccines" value={vaccines.length} label="Total Vaccines" variant="primary" />
        <StatCard
          icon="appointments"
          value={vaccines.filter((v) => v.status === "Active").length}
          label="Active Vaccines"
          variant="success"
        />
        <StatCard
          icon="users"
          value={vaccines.reduce((acc, v) => acc + (v.dosesRequired || 0), 0)}
          label="Total Doses Managed"
          variant="warning"
        />
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All Vaccines
        </button>
        <button
          className={`tab ${activeTab === "byDoctor" ? "active" : ""}`}
          onClick={() => setActiveTab("byDoctor")}
        >
          By Doctor
        </button>
      </div>

      {activeTab === "byDoctor" && (
        <Card title="Filter by Doctor" className="mb-4">
          <div className="form-group" style={{ marginBottom: 0, maxWidth: "300px" }}>
            <select
              className="form-select"
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
            >
              <option value="">Select a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.docId || doctor.id} value={doctor.docId || doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>
        </Card>
      )}

      <Card title={activeTab === "all" ? "All Vaccines" : "Doctor's Vaccines"}>
        {loading ? (
          <div className="loading">
            <div className="spinner" />
          </div>
        ) : (
          <Table
            columns={columns}
            data={activeTab === "all" ? vaccines : doctorVaccines}
            emptyMessage={activeTab === "byDoctor" && !selectedDoctorId ? "Please select a doctor" : emptyState}
            actions={(row) => (
              <button
                className="action-btn edit"
                onClick={() => fetchVaccineDetail(row.id)}
                title="View Details"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            )}
          />
        )}
      </Card>

      {/* Add Vaccine Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Vaccine"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleAddVaccine}>
              Add Vaccine
            </button>
          </>
        }
      >
        <form onSubmit={handleAddVaccine}>
          <div className="form-group">
            <label className="form-label">Vaccine Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter vaccine name"
              value={formData.vaccineName}
              onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Manufacturer</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter manufacturer name"
              value={formData.manufacturer}
              onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Doses Required</label>
              <input
                type="number"
                className="form-input"
                placeholder="Number of doses"
                value={formData.dosesRequired}
                onChange={(e) => setFormData({ ...formData, dosesRequired: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Age Range</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 18-65 years"
                value={formData.ageRange}
                onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Associate Vaccine with Doctor Modal */}
      <Modal
        isOpen={showAssociateModal}
        onClose={() => setShowAssociateModal(false)}
        title="Associate Vaccine with Doctor"
        footer={
          <>
            <button
              className="btn btn-outline"
              onClick={() => setShowAssociateModal(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleAssociateWithDoctor}>
              Associate
            </button>
          </>
        }
      >
        <form onSubmit={handleAssociateWithDoctor}>
          <div className="form-group">
            <label className="form-label">Select Vaccine</label>
            <select
              className="form-select"
              value={associateData.vaccineId}
              onChange={(e) =>
                setAssociateData({ ...associateData, vaccineId: e.target.value })
              }
              required
            >
              <option value="">Choose a vaccine</option>
              {vaccines.map((vaccine) => (
                <option key={vaccine.id} value={vaccine.id}>
                  {vaccine.vaccineName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Select Doctor</label>
            <select
              className="form-select"
              value={associateData.doctorId}
              onChange={(e) =>
                setAssociateData({ ...associateData, doctorId: e.target.value })
              }
              required
            >
              <option value="">Choose a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.docId || doctor.id} value={doctor.docId || doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>

      {/* Vaccine Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Vaccine Details"
      >
        {selectedVaccine && (
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">Name</div>
              <div className="detail-value">{selectedVaccine.vaccineName}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Manufacturer</div>
              <div className="detail-value">{selectedVaccine.manufacturer}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Doses Required</div>
              <div className="detail-value">{selectedVaccine.dosesRequired}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Age Range</div>
              <div className="detail-value">{selectedVaccine.ageRange}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Status</div>
              <div className="detail-value">
                <span
                  className={`badge ${selectedVaccine.status === "Active" ? "badge-success" : "badge-danger"
                    }`}
                >
                  {selectedVaccine.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
