import React from 'react';
import { COLORS } from '../constants';
import { STATS, ORDERS, TRACKING_STEPS } from '../data';
import { IconStar, IconGoldStar, IconChevron } from './Icons';

function StatCard({ stat }: { stat: any }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: stat.color, color: stat.stroke }}>
        {stat.icon}
      </div>
      <div className="stat-num">{stat.num}</div>
      <div className="stat-label">{stat.label}</div>
    </div>
  );
}

function StatusBadge({ status, text }: { status: string, text: string }) {
  const styles: Record<string, any> = {
    transit: { background: "#E0F2FE", color: "#0369A1" },
    prep:    { background: "rgba(188,153,104,0.15)", color: COLORS.garnet },
    done:    { background: "#F3F4F6", color: "#6B7280" },
  };
  return (
    <span className="status-badge" style={styles[status]}>
      {text}
    </span>
  );
}

function OrderRow({ order, onNavigate }: { order: any, onNavigate: (t: string) => void }) {
  return (
    <div className="order-row" onClick={() => onNavigate(order.tab)} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onNavigate(order.tab)}>
      <div className="order-icon">{order.icon}</div>
      <div className="order-info">
        <div className="order-name">{order.item}</div>
        <div className="order-meta">
          <strong>{order.recipient}</strong> · {order.date} · {order.id}
        </div>
      </div>
      <div className="order-row-right">
        <StatusBadge status={order.status} text={order.statusText} />
        <IconChevron />
      </div>
    </div>
  );
}

function TrackStep({ step, isLast }: { step: any, isLast: boolean }) {
  const dotStyles: Record<string, any> = {
    done:    { background: "rgba(34,197,94,0.1)", color: "#16A34A", border: "1.5px solid rgba(34,197,94,0.3)" },
    active:  { background: COLORS.beige, color: COLORS.garnet, border: `2px solid ${COLORS.gold}` },
    pending: { background: "#f9fafb", color: COLORS.gray, border: "1.5px solid #e5e7eb" },
  };
  const dotSymbol: Record<string, string> = { done: "✓", active: "↗", pending: "○" };

  return (
    <div className="track-step" style={{ paddingBottom: isLast ? 0 : 18 }}>
      {!isLast && <div className="track-connector" />}
      <div className="step-dot" style={dotStyles[step.state]}>
        {dotSymbol[step.state]}
      </div>
      <div>
        <div className="step-name" style={{ color: step.state === "active" ? COLORS.garnet : step.state === "pending" ? COLORS.gray : COLORS.choco }}>
          {step.label}
        </div>
        <div className="step-date">{step.date}</div>
      </div>
    </div>
  );
}

export default function DashboardContent({ navigate }: { navigate: (t: string) => void }) {
  return (
    <div className="content">
      <div className="content-inner">

        {/* Greeting */}
        <div className="greeting">
          <div>
            <p className="greeting-sub">Resumen — 15 Mar 2026</p>
            <h1 className="greeting-title">
              Hola, Beymar. <br />
              <em>¿Qué celebraremos</em> hoy?
            </h1>
          </div>
          <button className="btn-cta" onClick={() => navigate("asesor")}>
            <IconStar />
            Nueva Asesoría IA
          </button>
        </div>

        {/* Stats */}
        <div className="stats">
          {STATS.map((stat) => <StatCard key={stat.id} stat={stat} />)}
        </div>

        {/* Cards grid */}
        <div className="cards-grid">

          {/* Historial */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Historial reciente</span>
              <button className="card-link" onClick={() => navigate("historial")}>Ver todos →</button>
            </div>
            {ORDERS.map((order) => (
              <OrderRow key={order.id} order={order} onNavigate={navigate} />
            ))}
          </div>

          {/* Right column */}
          <div className="right-col">

            {/* Hero card */}
            <div className="hero-card">
              <div className="hero-label">Próxima fecha especial</div>
              <div className="hero-title">Aniversario de tus papás — 12 días</div>
              <p className="hero-body">La IA ya preparó sugerencias únicas para esta ocasión especial.</p>
              <button className="btn-white" onClick={() => navigate("asesor")}>Ver sugerencias</button>
            </div>

            {/* Points card */}
            <div className="points-card">
              <div className="points-header">
                <IconGoldStar />
                <span className="points-title">Emotia Points</span>
              </div>
              <div className="points-num">450 <span>pts</span></div>
              <div className="points-label">A 50 pts de tu próxima entrega gratis</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "70%" }} />
              </div>
              <div className="progress-ends">
                <span>0</span>
                <span className="pct">70%</span>
                <span>500</span>
              </div>
              <div className="pts-row">
                <div className="pts-badge"><span className="pts-badge-val">3</span>Compras</div>
                <div className="pts-badge"><span className="pts-badge-val">⭐ 2</span>Insignias</div>
                <div className="pts-badge"><span className="pts-badge-val">VIP</span>Estado</div>
              </div>
            </div>

          </div>
        </div>

        {/* Tracking */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Seguimiento — #EM-2041</span>
            <span style={{ fontSize: "0.8rem", color: COLORS.gray }}>Llegada estimada: hoy 16:30 hrs</span>
          </div>
          <div className="tracking-body">
            <div className="track-steps">
              {TRACKING_STEPS.map((step, i) => (
                <TrackStep key={i} step={step} isLast={i === TRACKING_STEPS.length - 1} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}