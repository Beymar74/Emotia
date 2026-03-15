export const dashboardCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  :root {
    --garnet:      #8E1B3A;
    --bordeaux:    #5A0F24;
    --gold:        #BC9968;
    --beige:       #F5E6D0;
    --choco:       #5C3A2E;
    --gray:        #B0B0B0;
    --sidebar-w:   252px;
    --topbar-h:    72px;
    --radius-sm:   10px;
    --radius-md:   16px;
    --radius-lg:   20px;
    --shadow-sm:   0 2px 8px rgba(90,15,36,0.05);
    --shadow-md:   0 8px 28px rgba(90,15,36,0.08);
    --shadow-lg:   0 16px 48px rgba(90,15,36,0.12);
    --ease:        0.2s ease;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 16px; scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #FAF7F4;
    color: var(--choco);
    -webkit-font-smoothing: antialiased;
  }

  /* ── Layout ── */
  .dashboard-layout { display: flex; min-height: 100vh; }

  /* ── Sidebar ── */
  .sidebar {
    width: var(--sidebar-w);
    background: #fff;
    border-right: 1px solid rgba(188,153,104,0.18);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0; left: 0;
    height: 100vh;
    z-index: 100;
    transition: transform 0.3s cubic-bezier(.4,0,.2,1), box-shadow 0.3s ease;
    will-change: transform;
  }

  .sidebar-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: 90;
    backdrop-filter: blur(2px);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .sidebar-overlay--visible { opacity: 1; }

  /* ── Logo ── */
  .logo-area {
    height: var(--topbar-h);
    display: flex;
    align-items: center;
    padding: 0 24px;
    border-bottom: 1px solid rgba(188,153,104,0.18);
    gap: 10px;
    cursor: pointer;
    flex-shrink: 0;
    text-decoration: none;
  }

  .logo-gem {
    width: 36px; height: 36px;
    background: linear-gradient(145deg, var(--garnet), var(--bordeaux));
    border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(142,27,58,0.25);
  }

  .logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 900;
    color: var(--bordeaux);
    letter-spacing: -0.5px; line-height: 1;
  }

  .sidebar-close-btn {
    display: none;
    margin-left: auto;
    background: none; border: none;
    cursor: pointer; color: var(--gray);
    padding: 4px; border-radius: 6px;
    transition: color var(--ease);
  }
  .sidebar-close-btn:hover { color: var(--garnet); }

  /* ── Nav ── */
  .nav {
    padding: 20px 12px;
    flex: 1; display: flex;
    flex-direction: column; gap: 2px;
    overflow-y: auto;
  }

  .nav-section {
    font-size: 0.68rem; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--gray); padding: 14px 12px 6px;
  }

  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 12px; border-radius: var(--radius-sm);
    font-size: 0.875rem; font-weight: 500;
    color: var(--choco); cursor: pointer;
    border: none; background: transparent;
    width: 100%; text-align: left;
    font-family: 'DM Sans', sans-serif;
    transition: background var(--ease), color var(--ease);
    position: relative;
  }
  .nav-item:hover { background: rgba(188,153,104,0.08); color: var(--garnet); }
  .nav-item--active {
    background: linear-gradient(90deg, rgba(142,27,58,0.10), rgba(142,27,58,0.02));
    color: var(--garnet); font-weight: 600;
  }
  .nav-item--active::before {
    content: '';
    position: absolute; left: 0; top: 20%; bottom: 20%;
    width: 3px; border-radius: 0 3px 3px 0;
    background: var(--garnet);
  }
  .nav-item svg { flex-shrink: 0; opacity: 0.7; transition: opacity var(--ease); }
  .nav-item:hover svg, .nav-item--active svg { opacity: 1; }

  .nav-badge {
    margin-left: auto;
    background: var(--garnet); color: white;
    font-size: 0.65rem; font-weight: 700;
    padding: 2px 7px; border-radius: 100px; line-height: 1.4;
  }

  /* ── Profile ── */
  .profile-area {
    padding: 14px 16px;
    border-top: 1px solid rgba(188,153,104,0.18);
    display: flex; align-items: center; gap: 10px;
    flex-shrink: 0;
  }
  .avatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), var(--garnet));
    display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 700; font-size: 0.85rem;
    flex-shrink: 0; border: 2px solid rgba(188,153,104,0.3);
  }
  .profile-name {
    font-size: 0.85rem; font-weight: 700; color: var(--bordeaux);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .badge-vip {
    display: inline-block;
    font-size: 0.63rem; font-weight: 700;
    padding: 2px 6px; border-radius: 4px;
    background: rgba(188,153,104,0.15); color: var(--gold);
    letter-spacing: 0.06em; text-transform: uppercase; margin-top: 1px;
  }
  .logout-btn {
    background: none; border: none; cursor: pointer;
    color: var(--gray); padding: 6px; border-radius: 8px;
    display: flex; align-items: center;
    transition: color var(--ease), background var(--ease);
  }
  .logout-btn:hover { color: var(--garnet); background: rgba(142,27,58,0.06); }

  /* ── Main ── */
  .dashboard-main {
    flex: 1;
    margin-left: var(--sidebar-w);
    display: flex; flex-direction: column;
    min-height: 100vh;
    transition: margin-left 0.3s cubic-bezier(.4,0,.2,1);
  }

  /* ── Topbar ── */
  .topbar {
    height: var(--topbar-h);
    background: rgba(250,247,244,0.88);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(188,153,104,0.12);
    display: flex; align-items: center;
    justify-content: space-between;
    padding: 0 36px;
    position: sticky; top: 0; z-index: 80;
  }
  .topbar-left { display: flex; align-items: center; gap: 16px; }
  .topbar-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem; font-weight: 700; color: var(--bordeaux);
  }
  .topbar-right { display: flex; align-items: center; gap: 12px; }
  .hamburger-btn {
    display: none; background: none; border: none;
    cursor: pointer; color: var(--bordeaux);
    padding: 6px; border-radius: 8px;
    transition: background var(--ease);
  }
  .hamburger-btn:hover { background: rgba(142,27,58,0.06); }

  .search-bar {
    display: flex; align-items: center; gap: 8px;
    background: white; border: 1px solid rgba(188,153,104,0.2);
    border-radius: 100px; padding: 8px 16px; width: 280px;
    transition: border-color var(--ease), box-shadow var(--ease);
  }
  .search-bar:focus-within {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(188,153,104,0.12);
  }
  .search-bar input {
    background: transparent; border: none; outline: none;
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
    color: var(--choco); width: 100%;
  }
  .search-bar input::placeholder { color: var(--gray); }

  .icon-btn {
    width: 38px; height: 38px; border-radius: 50%;
    background: white; border: 1px solid rgba(188,153,104,0.2);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--choco); position: relative;
    transition: border-color var(--ease), box-shadow var(--ease);
    flex-shrink: 0;
  }
  .icon-btn:hover { border-color: var(--gold); box-shadow: 0 2px 8px rgba(188,153,104,0.15); }
  .notif-dot {
    position: absolute; top: 7px; right: 8px;
    width: 7px; height: 7px;
    background: var(--garnet); border-radius: 50%;
    border: 1.5px solid white;
  }

  /* ── Content ── */
  .content { padding: 36px; flex: 1; }
  .content-inner { max-width: 1080px; margin: 0 auto; }

  /* ── Greeting ── */
  .greeting {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-bottom: 32px; flex-wrap: wrap; gap: 20px;
  }
  .greeting-sub {
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.13em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 6px;
  }
  .greeting-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.6rem, 3vw, 2.3rem);
    font-weight: 900; color: var(--bordeaux); line-height: 1.15;
  }
  .greeting-title em { font-style: italic; color: var(--garnet); }

  .btn-cta {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, var(--garnet), var(--bordeaux));
    color: white; border: none; padding: 13px 24px; border-radius: 100px;
    font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 600;
    cursor: pointer; white-space: nowrap;
    transition: transform var(--ease), box-shadow var(--ease);
    box-shadow: 0 4px 16px rgba(142,27,58,0.22);
  }
  .btn-cta:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
  .btn-cta:active { transform: translateY(0); }

  /* ── Stats ── */
  .stats {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 16px; margin-bottom: 24px;
  }
  .stat-card {
    background: white; border: 1px solid rgba(188,153,104,0.15);
    border-radius: var(--radius-md); padding: 20px;
    transition: transform var(--ease), box-shadow var(--ease); cursor: default;
  }
  .stat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
  .stat-icon {
    width: 40px; height: 40px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 14px;
  }
  .stat-num {
    font-size: 1.7rem; font-weight: 700; color: var(--bordeaux);
    line-height: 1; margin-bottom: 4px;
  }
  .stat-label { font-size: 0.78rem; color: var(--gray); font-weight: 500; }

  /* ── Cards grid ── */
  .cards-grid {
    display: grid; grid-template-columns: 1fr 340px;
    gap: 20px; margin-bottom: 24px;
  }

  /* ── Card base ── */
  .card {
    background: white; border: 1px solid rgba(188,153,104,0.15);
    border-radius: var(--radius-lg); overflow: hidden;
    transition: box-shadow var(--ease);
  }
  .card:hover { box-shadow: var(--shadow-md); }
  .card-header {
    padding: 20px 24px 16px;
    display: flex; justify-content: space-between; align-items: center;
    border-bottom: 1px solid rgba(188,153,104,0.1);
  }
  .card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem; font-weight: 700; color: var(--bordeaux);
  }
  .card-link {
    font-size: 0.82rem; color: var(--gold); font-weight: 600;
    cursor: pointer; background: none; border: none;
    font-family: inherit; transition: color var(--ease);
  }
  .card-link:hover { color: var(--garnet); }

  /* ── Order rows ── */
  .order-row {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 24px; border-bottom: 1px solid rgba(188,153,104,0.08);
    transition: background var(--ease); cursor: pointer;
  }
  .order-row:last-child { border-bottom: none; }
  .order-row:hover { background: rgba(188,153,104,0.03); }
  .order-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: var(--beige); display: flex; align-items: center;
    justify-content: center; color: var(--garnet); flex-shrink: 0;
  }
  .order-info { flex: 1; min-width: 0; }
  .order-name {
    font-size: 0.88rem; font-weight: 600; color: var(--choco);
    margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .order-meta { font-size: 0.77rem; color: var(--gray); }
  .order-meta strong { color: var(--bordeaux); font-weight: 600; }
  .order-row-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .status-badge {
    padding: 4px 11px; border-radius: 100px;
    font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.05em; text-transform: uppercase; white-space: nowrap;
  }

  /* ── Right column ── */
  .right-col { display: flex; flex-direction: column; gap: 20px; }

  /* ── Hero card ── */
  .hero-card {
    border-radius: var(--radius-lg); padding: 24px;
    background: linear-gradient(145deg, var(--bordeaux), var(--garnet));
    color: white; position: relative; overflow: hidden;
  }
  .hero-card::after {
    content: ''; position: absolute; right: -24px; top: -24px;
    width: 110px; height: 110px; border-radius: 50%;
    background: rgba(255,255,255,0.06);
  }
  .hero-card::before {
    content: ''; position: absolute; right: 40px; bottom: -36px;
    width: 80px; height: 80px; border-radius: 50%;
    background: rgba(255,255,255,0.04);
  }
  .hero-label {
    font-size: 0.68rem; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; opacity: 0.7; margin-bottom: 6px;
  }
  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem; font-weight: 700; margin-bottom: 8px;
    line-height: 1.3; position: relative;
  }
  .hero-body {
    font-size: 0.83rem; opacity: 0.8; line-height: 1.5;
    margin-bottom: 18px; position: relative;
  }
  .btn-white {
    background: white; color: var(--garnet); border: none;
    padding: 9px 18px; border-radius: 100px;
    font-size: 0.82rem; font-weight: 700;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    transition: transform var(--ease), box-shadow var(--ease); position: relative;
  }
  .btn-white:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,0,0,0.18); }

  /* ── Points card ── */
  .points-card {
    background: white; border: 1px solid rgba(188,153,104,0.15);
    border-radius: var(--radius-lg); padding: 22px;
  }
  .points-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .points-title { font-family: 'Playfair Display', serif; font-size: 0.95rem; font-weight: 700; color: var(--bordeaux); }
  .points-num { font-size: 2rem; font-weight: 700; color: var(--garnet); line-height: 1; }
  .points-num span { font-size: 1rem; color: var(--gray); font-weight: 400; }
  .points-label { font-size: 0.78rem; color: var(--gray); margin-top: 3px; margin-bottom: 14px; }
  .progress-bar { width: 100%; height: 5px; background: #f3f4f6; border-radius: 10px; overflow: hidden; margin-bottom: 6px; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, var(--gold), var(--garnet)); border-radius: 10px; }
  .progress-ends { display: flex; justify-content: space-between; font-size: 0.73rem; color: var(--gray); }
  .progress-ends .pct { color: var(--gold); font-weight: 600; }
  .pts-row { display: flex; gap: 8px; margin-top: 14px; }
  .pts-badge {
    flex: 1; padding: 9px 6px; border-radius: var(--radius-sm);
    background: rgba(188,153,104,0.08); text-align: center;
    font-size: 0.73rem; font-weight: 600; color: var(--choco);
    border: 1px solid rgba(188,153,104,0.12);
  }
  .pts-badge-val { display: block; font-size: 1.05rem; color: var(--garnet); font-weight: 700; margin-bottom: 2px; }

  /* ── Tracking ── */
  .tracking-body { padding: 20px 24px; }
  .track-steps { display: flex; flex-direction: column; }
  .track-step { display: flex; gap: 14px; align-items: flex-start; position: relative; }
  .track-connector {
    position: absolute; left: 11px; top: 28px;
    width: 2px; bottom: 0; background: rgba(188,153,104,0.2);
  }
  .step-dot {
    width: 24px; height: 24px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 0.7rem; font-weight: 700;
    position: relative; z-index: 1;
  }
  .step-name { font-size: 0.87rem; font-weight: 600; margin-bottom: 2px; }
  .step-date { font-size: 0.76rem; color: var(--gray); }

  /* ══════════════════════════
      RESPONSIVE
  ══════════════════════════ */
  @media (max-width: 1024px) {
    .stats { grid-template-columns: repeat(2, 1fr); }
    .cards-grid { grid-template-columns: 1fr; }
    .right-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  }

  @media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); }
    .sidebar--open { transform: translateX(0); box-shadow: var(--shadow-lg); }
    .sidebar-overlay { display: block; }
    .sidebar-close-btn { display: flex; }
    .hamburger-btn { display: flex; }
    .dashboard-main { margin-left: 0; }
    .topbar { padding: 0 20px; }
    .topbar-title { font-size: 1.1rem; }
    .search-bar { display: none; }
    .content { padding: 24px 20px; }
    .greeting { flex-direction: column; align-items: flex-start; margin-bottom: 24px; }
    .btn-cta { width: 100%; justify-content: center; }
    .stats { gap: 12px; }
    .cards-grid { gap: 16px; }
    .right-col { grid-template-columns: 1fr; }
    .order-row { padding: 12px 16px; }
    .card-header { padding: 16px 16px 12px; }
    .tracking-body { padding: 16px; }
    .order-meta { display: none; }
  }

  @media (max-width: 480px) {
    .stat-card { padding: 14px; }
    .stat-icon { width: 34px; height: 34px; margin-bottom: 10px; }
    .stat-num { font-size: 1.25rem; }
    .content { padding: 16px; }
    .pts-row { flex-wrap: wrap; }
  }
`;