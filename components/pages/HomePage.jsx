'use client';

import React from 'react';
import Link from 'next/link';
import RegisterModal from '../auth/RegisterModal';
import LoginModal from '../auth/LoginModal';

const features = [
  {
    id: 'users',
    title: 'Users Management',
    description: 'Register users, verify OTP, manage profiles and track vaccination history.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    href: '/dashboard/users',
    color: 'primary',
  },
  {
    id: 'doctors',
    title: 'Doctors Management',
    description: 'Add and manage doctors, assign them to vaccination centers.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
        <circle cx="20" cy="10" r="2" />
      </svg>
    ),
    href: '/dashboard/doctors',
    color: 'success',
  },
  {
    id: 'centers',
    title: 'Vaccination Centers',
    description: 'Manage vaccination centers, capacity and doctor assignments.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
        <path d="M9 22v-4h6v4" />
        <path d="M8 6h.01" />
        <path d="M16 6h.01" />
        <path d="M12 6h.01" />
        <path d="M12 10h.01" />
        <path d="M12 14h.01" />
        <path d="M16 10h.01" />
        <path d="M16 14h.01" />
        <path d="M8 10h.01" />
        <path d="M8 14h.01" />
      </svg>
    ),
    href: '/dashboard/centers',
    color: 'warning',
  },
  {
    id: 'vaccines',
    title: 'Vaccines Management',
    description: 'Track vaccines, manage inventory and assign to doctors.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 2 4 4" />
        <path d="m17 7 3-3" />
        <path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" />
        <path d="m9 11 4 4" />
        <path d="m5 19-3 3" />
        <path d="m14 4 6 6" />
      </svg>
    ),
    href: '/dashboard/vaccines',
    color: 'danger',
  },
  {
    id: 'doses',
    title: 'Doses Management',
    description: 'Track dose administration and vaccination status.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 2v2" />
        <path d="M17 2v2" />
        <path d="M5 4h14" />
        <rect width="14" height="16" x="5" y="4" rx="2" />
        <path d="M5 10h14" />
      </svg>
    ),
    href: '/dashboard/doses',
    color: 'secondary',
  },
  {
    id: 'appointments',
    title: 'Appointments',
    description: 'Book and manage vaccination appointments.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
        <path d="M8 18h.01" />
        <path d="M12 18h.01" />
        <path d="M16 18h.01" />
      </svg>
    ),
    href: '/dashboard/appointments',
    color: 'primary',
  },
];

export default function HomePage() {
  return (
    <div className="home-page">
      {/* Navigation */}
      <nav className="home-nav">
        <div className="home-nav-container">
          <div className="home-nav-logo">
            <Link href="/dashboard" style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--primary)' }}>
              Dashboard
            </Link>
          </div>
          <div className="home-nav-links" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <RegisterModal>
              <button className="btn btn-primary">Register</button>
            </RegisterModal>
            <LoginModal>
              <button className="btn btn-outline">Login</button>
            </LoginModal>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title"><span style={{ fontSize: "1.25em" }}>e-</span>Vaccination Booking System</h1>
          <p className="hero-subtitle">
            A comprehensive platform to manage users, doctors, vaccination centers, vaccines, doses, and appointments all in one place.
          </p>
          <div className="hero-actions">
            <Link href="/dashboard/appointments" className="btn btn-primary btn-lg">
              Book Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="features-title">Manage Everything in One Place</h2>
          <p className="features-subtitle">Access all modules through our intuitive admin dashboard</p>
          <div className="features-grid">
            {features.map((feature) => (
              <Link key={feature.id} href={feature.href} className="feature-card">
                <div className={`feature-icon ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <span className="feature-link">
                  Manage {feature.title.split(' ')[0]}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="home-stats-section">
        <div className="home-stats-container">
          <div className="home-stat">
            <div className="home-stat-value">10K+</div>
            <div className="home-stat-label">Users Registered</div>
          </div>
          <div className="home-stat">
            <div className="home-stat-value">500+</div>
            <div className="home-stat-label">Doctors</div>
          </div>
          <div className="home-stat">
            <div className="home-stat-value">100+</div>
            <div className="home-stat-label">Vaccination Centers</div>
          </div>
          <div className="home-stat">
            <div className="home-stat-value">50K+</div>
            <div className="home-stat-label">Appointments</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="home-footer-container">
          <div className="home-footer-logo">
            <span><span style={{ fontSize: "1.25em" }}>e-</span>Vaccination Booking System</span>
          </div>
          <p className="home-footer-text">e-Vaccination Booking System - Healthcare made simple.</p>
        </div>
      </footer>
    </div>
  );
}
