"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";

const messages = [
  "Preparando tu espacio seguro...",
  "Escuchando tus emociones...",
  "Casi listo para ti...",
];

const LOADER_DURATION_MS = 2800;

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const steps = 100;
    const interval = LOADER_DURATION_MS / steps;

    let step = 0;
    const timer = window.setInterval(() => {
      step += 1;
      setProgress(step);

      if (step === 33) setMsgIndex(1);
      if (step === 66) setMsgIndex(2);

      if (step >= steps) {
        window.clearInterval(timer);
        window.setTimeout(() => setVisible(false), 400);
      }
    }, interval);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Lato:wght@300;400&display=swap');

        :root {
          --cream:    #FAF3E8;
          --warm:     #F2E0C8;
          --blush:    #E8C4A0;
          --rose:     #C2556A;
          --burgundy: #5A0F24;
          --deep:     #3A0818;
          --gold:     #C9943A;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .loader-root {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--cream);
          overflow: hidden;
          transition: opacity 0.6s ease;
        }
        .loader-root.fade-out { opacity: 0; pointer-events: none; }

        /* ── ambient orbs ── */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.45;
          animation: drift 8s ease-in-out infinite alternate;
        }
        .orb-1 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, #e8a090 0%, transparent 70%);
          top: -140px; left: -140px;
          animation-delay: 0s;
        }
        .orb-2 {
          width: 380px; height: 380px;
          background: radial-gradient(circle, #c2556a55 0%, transparent 70%);
          bottom: -80px; right: -80px;
          animation-delay: -3s;
        }
        .orb-3 {
          width: 260px; height: 260px;
          background: radial-gradient(circle, #c9943a44 0%, transparent 70%);
          top: 40%; left: 60%;
          animation-delay: -6s;
        }
        @keyframes drift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(30px, 20px) scale(1.08); }
        }

        /* ── grain overlay ── */
        .grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.035;
          pointer-events: none;
        }

        /* ── main card ── */
        .card {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          animation: rise 1s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes rise {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── logo area ── */
        .logo-wrap {
          position: relative;
          width: 96px;
          height: 96px;
          margin-bottom: 28px;
        }
        .logo-ring {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          border: 1.5px solid transparent;
          background: linear-gradient(135deg, var(--rose), var(--gold), var(--blush)) border-box;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out;
          mask-composite: exclude;
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .logo-ring-2 {
          position: absolute;
          inset: -20px;
          border-radius: 50%;
          border: 0.75px solid #c2556a22;
          animation: spin 10s linear infinite reverse;
        }
        .logo-img {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
        }
        /* fallback monogram if image fails */
        .logo-mono {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--burgundy) 0%, var(--rose) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.6rem;
          font-weight: 300;
          color: var(--cream);
          letter-spacing: 0.04em;
        }
        .logo-pulse {
          position: absolute;
          inset: -16px;
          border-radius: 50%;
          background: radial-gradient(circle, #c2556a18 0%, transparent 70%);
          animation: pulse 2.8s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(0.95); opacity: 0.6; }
          50%       { transform: scale(1.12); opacity: 1; }
        }

        /* ── brand name ── */
        .brand {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3rem;
          font-weight: 300;
          letter-spacing: 0.22em;
          color: var(--burgundy);
          text-transform: uppercase;
          line-height: 1;
          margin-bottom: 6px;
        }
        .brand span {
          display: inline-block;
          animation: letterIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .brand span:nth-child(1)  { animation-delay: 0.15s; }
        .brand span:nth-child(2)  { animation-delay: 0.20s; }
        .brand span:nth-child(3)  { animation-delay: 0.25s; }
        .brand span:nth-child(4)  { animation-delay: 0.30s; }
        .brand span:nth-child(5)  { animation-delay: 0.35s; }
        .brand span:nth-child(6)  { animation-delay: 0.40s; }
        @keyframes letterIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .tagline {
          font-family: 'Lato', sans-serif;
          font-size: 0.68rem;
          font-weight: 300;
          letter-spacing: 0.3em;
          color: var(--rose);
          text-transform: uppercase;
          margin-bottom: 48px;
          opacity: 0;
          animation: fadeIn 0.8s ease 0.6s both;
        }
        @keyframes fadeIn {
          to { opacity: 0.8; }
        }

        /* ── progress ── */
        .progress-wrap {
          width: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          opacity: 0;
          animation: fadeIn 0.6s ease 0.8s both;
        }

        .bar-track {
          width: 100%;
          height: 2px;
          background: #e0c8b8;
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }
        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--rose), var(--gold));
          border-radius: 2px;
          transition: width 0.08s linear;
          position: relative;
        }
        .bar-fill::after {
          content: '';
          position: absolute;
          right: 0;
          top: -3px;
          width: 8px;
          height: 8px;
          background: var(--gold);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--gold);
        }

        .status-msg {
          font-family: 'Lato', sans-serif;
          font-size: 0.73rem;
          font-weight: 300;
          letter-spacing: 0.12em;
          color: #8B5A6A;
          text-align: center;
          height: 18px;
          transition: opacity 0.4s ease;
        }

        /* ── decorative rule ── */
        .deco-rule {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 36px;
          opacity: 0;
          animation: fadeIn 0.6s ease 0.5s both;
        }
        .rule-line {
          width: 48px;
          height: 0.75px;
          background: linear-gradient(90deg, transparent, var(--blush));
        }
        .rule-line.right {
          background: linear-gradient(90deg, var(--blush), transparent);
        }
        .rule-diamond {
          width: 5px;
          height: 5px;
          background: var(--rose);
          transform: rotate(45deg);
          opacity: 0.7;
        }

        /* ── dots breathing ── */
        .dots {
          display: flex;
          gap: 7px;
          margin-top: 24px;
          opacity: 0;
          animation: fadeIn 0.6s ease 1s both;
        }
        .dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--rose);
          animation: breathe 1.4s ease-in-out infinite;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; background: var(--gold); }
        .dot:nth-child(3) { animation-delay: 0.4s; background: var(--blush); }
        @keyframes breathe {
          0%, 100% { transform: scale(0.7); opacity: 0.4; }
          50%       { transform: scale(1.3); opacity: 1; }
        }
      `}</style>

      <div className={`loader-root${!visible ? " fade-out" : ""}`}>
        <div className="grain" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="card">
          {/* Logo */}
          <div className="logo-wrap">
            <div className="logo-pulse" />
            <div className="logo-ring" />
            <div className="logo-ring-2" />
            <img
              src="/logo/logo.png"
              alt="Emotia"
              className="logo-img"
              onError={(e) => {
                const t = e.currentTarget;
                t.style.display = "none";
                const mono = t.nextElementSibling as HTMLElement;
                if (mono) mono.style.display = "flex";
              }}
            />
            <div className="logo-mono" style={{ display: "none" }}>E</div>
          </div>

          {/* Brand */}
          <h1 className="brand" aria-label="Emotia">
            {"EMOTIA".split("").map((l, i) => <span key={i}>{l}</span>)}
          </h1>

          {/* Decorative rule */}
          <div className="deco-rule">
            <div className="rule-line" />
            <div className="rule-diamond" />
            <div className="rule-line right" />
          </div>

          {/* Tagline */}
          <p className="tagline">tu espacio emocional</p>

          {/* Progress bar */}
          <div className="progress-wrap">
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="status-msg">{messages[msgIndex]}</p>
          </div>

          {/* Breathing dots */}
          <div className="dots">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>
        </div>
      </div>
    </>
  );
}
