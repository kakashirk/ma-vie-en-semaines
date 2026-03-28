import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useState } from 'react';

const fmt = (num) => new Intl.NumberFormat('fr-FR').format(num);

const getPopulationAtYear = (year) => {
  const data = { 1950: 2.5, 1960: 3.0, 1970: 3.7, 1980: 4.4, 1990: 5.3, 2000: 6.1, 2010: 6.9, 2020: 7.8, 2025: 8.1 };
  const years = Object.keys(data).map(Number);
  const closest = years.reduce((p, c) => Math.abs(c - year) < Math.abs(p - year) ? c : p);
  return Math.round(data[closest] * 1_000_000_000);
};

const calculateStats = (date) => {
  const birth = new Date(date);
  const today = new Date();
  const msW = 604_800_000, msD = 86_400_000;
  const weeksLived = Math.floor((today - birth) / msW);
  const daysLived = Math.floor((today - birth) / msD);
  const totalWeeks = 4160;
  return {
    weeksLived, totalWeeks,
    weeksRemaining: totalWeeks - weeksLived,
    pct: Math.round(weeksLived / totalWeeks * 100),
    daysLived,
    hoursSlept: Math.floor(daysLived * 8),
    heartbeats: Math.floor(daysLived * 1440 * 70),
    breaths: Math.floor(daysLived * 1440 * 16),
    seasons: Math.floor(daysLived / 91.25),
    lunarCycles: Math.round(daysLived / 29.53),
    years: Math.floor(daysLived / 365.25),
    birthYear: birth.getFullYear(),
  };
};

const TABS = ['Semaines', 'Stats', 'Cosmos'];

export default function App() {
  const [birthdate, setBirthdate] = useState('');
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState(0);
  const [hover, setHover] = useState(null);

  const handleStart = () => {
    if (birthdate) setStats(calculateStats(birthdate));
  };

  if (!stats) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '48px 40px', maxWidth: 440, width: '90%', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>⏳</div>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>La vie en semaines</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, marginBottom: 36 }}>Visualisez votre temps sur Terre d'une façon que vous n'avez jamais vue.</p>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 13, textAlign: 'left', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>Date de naissance</label>
          <input
            type="date"
            value={birthdate}
            onChange={e => setBirthdate(e.target.value)}
            style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 16, boxSizing: 'border-box', marginBottom: 20, outline: 'none', colorScheme: 'dark' }}
          />
          <button
            onClick={handleStart}
            disabled={!birthdate}
            style={{ width: '100%', padding: '15px', borderRadius: 12, border: 'none', background: birthdate ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 16, fontWeight: 600, cursor: birthdate ? 'pointer' : 'not-allowed', transition: 'all .2s', letterSpacing: 0.5 }}
          >
            Découvrir ma vie →
          </button>
        </div>
      </div>
    );
  }

  const { weeksLived, totalWeeks, weeksRemaining, pct, daysLived, hoursSlept, heartbeats, breaths, seasons, lunarCycles, years, birthYear } = stats;

  const WeekGrid = () => {
    const rows = [];
    for (let r = 0; r < 80; r++) {
      const cells = [];
      for (let c = 0; c < 52; c++) {
        const w = r * 52 + c;
        const past = w < weeksLived;
        const current = w === weeksLived;
        cells.push(
          <div key={w}
            onMouseEnter={() => setHover(w)}
            onMouseLeave={() => setHover(null)}
            style={{
              width: 9, height: 9, margin: 1.5, borderRadius: 2,
              background: current ? '#a78bfa' : past ? '#7c3aed' : 'rgba(255,255,255,0.08)',
              boxShadow: current ? '0 0 8px #a78bfa' : 'none',
              transition: 'transform .1s',
              transform: hover === w ? 'scale(1.6)' : 'scale(1)',
              cursor: 'default',
            }}
          />
        );
      }
      rows.push(<div key={r} style={{ display: 'flex' }}>{cells}</div>);
    }
    return (
      <div>
        <div style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
          {[['#7c3aed', 'Passé'], ['#a78bfa', 'Présent'], ['rgba(255,255,255,0.08)', 'Futur']].map(([col, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: col }} />
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ overflowX: 'auto' }}>{rows}</div>
        {hover !== null && (
          <div style={{ marginTop: 16, color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
            Semaine {hover + 1} — {hover < weeksLived ? 'Votre passé' : hover === weeksLived ? '✨ Votre semaine actuelle' : 'Votre futur'}
          </div>
        )}
      </div>
    );
  };

  const Card = ({ title, items }) => (
    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
      <h3 style={{ color: '#a78bfa', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16, fontWeight: 600 }}>{title}</h3>
      {items.map(([label, value]) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{label}</span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{value}</span>
        </div>
      ))}
    </div>
  );

  const StatsTab = () => (
    <div>
      <Card title="Votre vie" items={[
        ['Semaines vécues', fmt(weeksLived)],
        ['Semaines restantes', fmt(weeksRemaining)],
        ['Jours vécus', fmt(daysLived)],
        ['Saisons', fmt(seasons)],
        ['Cycles lunaires', fmt(lunarCycles)],
      ]} />
      <Card title="Votre corps" items={[
        ['Heures de sommeil', fmt(hoursSlept)],
        ['Battements de cœur', fmt(heartbeats)],
        ['Respirations', fmt(breaths)],
      ]} />
      <Card title="Le monde" items={[
        ['Population à votre naissance', fmt(getPopulationAtYear(birthYear))],
        ['Personnes probablement rencontrées', fmt(Math.round(80000 * pct / 100))],
        ['Naissances depuis votre naissance', fmt(Math.round(daysLived * 385000))],
      ]} />
    </div>
  );

  const CosmosTab = () => (
    <div>
      <Card title="Dans l'espace" items={[
        ['km parcourus autour du Soleil', fmt(Math.round(daysLived * 1_600_000))],
        ['km dans la Voie Lactée', fmt(Math.round(daysLived * 24 * 828000))],
        ["% de l'âge de l'univers", (80 / 13_800_000_000 * 100).toFixed(10) + '%'],
      ]} />
      <Card title="Sur Terre" items={[
        ['Tours autour du Soleil', fmt(years)],
        ["% de la vie d'un séquoia (3000 ans)", ((years / 3000) * 100).toFixed(2) + '%'],
        ['Vos cellules ont été renouvelées', '~7 fois'],
      ]} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', fontFamily: "'Segoe UI', sans-serif", paddingBottom: 40 }}>
      <div style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>⏳ La vie en semaines</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>{years} ans · {pct}% vécu</p>
        </div>
        <button onClick={() => setStats(null)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
          ← Recommencer
        </button>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.08)' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', transition: 'width 1s ease' }} />
      </div>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, background: 'rgba(255,255,255,0.05)', padding: 6, borderRadius: 12, width: 'fit-content' }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{
              padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all .2s',
              background: tab === i ? 'linear-gradient(135deg, #7c3aed, #a78bfa)' : 'transparent',
              color: tab === i ? '#fff' : 'rgba(255,255,255,0.5)',
            }}>{t}</button>
          ))}
        </div>
        {tab === 0 && <WeekGrid />}
        {tab === 1 && <StatsTab />}
        {tab === 2 && <CosmosTab />}
      </div>
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
