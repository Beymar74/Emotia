// ─────────────────────────────────────────────────────────────
// styles.ts — CSS global de la landing Memora
// ─────────────────────────────────────────────────────────────

export const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --garnet:    #8E1B3A;
    --bordeaux:  #5A0F24;
    --crimson:   #AB3A50;
    --chocolate: #5C3A2E;
    --gold:      #BC9968;
    --beige:     #F5E6D0;
    --white:     #FFFFFF;
    --radius-sm: 12px;
    --radius-md: 20px;
    --radius-lg: 32px;
    --shadow-sm: 0 2px 8px rgba(90,15,36,0.08);
    --shadow-md: 0 8px 24px rgba(90,15,36,0.12);
    --shadow-lg: 0 20px 48px rgba(90,15,36,0.16);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--beige);
    color: var(--chocolate);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  @keyframes float        { 0%,100% { transform: translateY(0) rotate(0deg); }  50% { transform: translateY(-18px) rotate(4deg); } }
  @keyframes pulse-ring   { 0%      { transform: scale(1); opacity: 0.8; }      100%{ transform: scale(1.6); opacity: 0; } }
  @keyframes shimmer      { 0%      { background-position: -200% center; }      100%{ background-position: 200% center; } }
  @keyframes fadeUp       { from    { opacity: 0; transform: translateY(24px); } to  { opacity: 1; transform: translateY(0); } }
  @keyframes blink        { 0%,100% { opacity: 1; }  50%  { opacity: 0; } }
  @keyframes gradientFlow { 0%,100% { background-position: 0% 50%; }            50% { background-position: 100% 50%; } }
  @keyframes slideIn      { from    { opacity: 0; transform: translateX(-16px); } to { opacity: 1; transform: translateX(0); } }

  .hero-bg {
    background: linear-gradient(135deg, var(--beige) 0%, #f0d8bc 40%, #e8c8a8 70%, var(--beige) 100%);
    background-size: 300% 300%;
    animation: gradientFlow 10s ease infinite;
  }

  .text-shimmer {
    background: linear-gradient(90deg, var(--garnet), var(--gold), var(--crimson), var(--garnet));
    background-size: 250% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--garnet), var(--bordeaux));
    color: white; border: none; cursor: pointer;
    position: relative; overflow: hidden;
    font-family: 'DM Sans', sans-serif; font-weight: 600;
    letter-spacing: 0.02em;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .btn-primary::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%);
    transform: translateX(-100%); transition: transform 0.5s ease;
  }
  .btn-primary:hover::after  { transform: translateX(100%); }
  .btn-primary:hover         { transform: translateY(-3px); box-shadow: 0 20px 40px rgba(142,27,58,0.35); }
  .btn-primary:active        { transform: translateY(-1px); }

  .btn-secondary {
    background: transparent; color: var(--garnet);
    border: 1.5px solid var(--garnet); cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-weight: 600;
    transition: background 0.2s, color 0.2s, transform 0.2s;
  }
  .btn-secondary:hover { background: var(--garnet); color: white; transform: translateY(-2px); }

  .card-hover { transition: transform 0.35s ease, box-shadow 0.35s ease; }
  .card-hover:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }

  .gradient-border {
    background: linear-gradient(white, white) padding-box,
                linear-gradient(135deg, var(--gold), var(--garnet)) border-box;
    border: 1.5px solid transparent;
  }

  .section-label {
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.22em;
    text-transform: uppercase; color: var(--gold);
    display: inline-flex; align-items: center; gap: 8px;
  }
  .section-label::before {
    content: ''; display: inline-block; width: 20px; height: 1.5px; background: var(--gold);
  }

  .chat-bubble-ai {
    background: white; border-radius: 18px 18px 18px 4px; padding: 13px 17px;
    box-shadow: var(--shadow-sm); font-size: 0.9rem; color: var(--chocolate);
    max-width: 88%; animation: slideIn 0.35s ease; font-weight: 500; line-height: 1.5;
    border: 1px solid rgba(188,153,104,0.15);
  }
  .chat-bubble-user {
    background: linear-gradient(135deg, var(--garnet), var(--crimson));
    border-radius: 18px 18px 4px 18px; padding: 13px 17px;
    box-shadow: 0 4px 16px rgba(142,27,58,0.22); font-size: 0.9rem; color: white;
    max-width: 88%; align-self: flex-end; animation: slideIn 0.35s ease;
    font-weight: 500; line-height: 1.5;
  }

  .typing-dots span {
    display: inline-block; width: 5px; height: 5px; border-radius: 50%;
    background: var(--gold); margin: 0 2px; animation: blink 1.4s infinite;
  }
  .typing-dots span:nth-child(2) { animation-delay: 0.22s; }
  .typing-dots span:nth-child(3) { animation-delay: 0.44s; }

  .orb {
    position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.12;
    animation: float 7s ease-in-out infinite; pointer-events: none;
  }

  .fade-in { animation: fadeUp 0.6s ease both; }

  .section-divider {
    width: 48px; height: 3px;
    background: linear-gradient(90deg, var(--garnet), var(--gold));
    border-radius: 2px; margin: 12px 0 20px;
  }

  @media (max-width: 768px) {
    .hidden-mobile  { display: none !important; }
    .show-mobile    { display: flex !important; }
  }
  @media (min-width: 769px) {
    .hidden-desktop { display: none !important; }
  }

  ::-webkit-scrollbar        { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--beige); }
  ::-webkit-scrollbar-thumb { background: var(--garnet); border-radius: 3px; }

  :focus-visible { outline: 2px solid var(--garnet); outline-offset: 3px; border-radius: 4px; }
`;
