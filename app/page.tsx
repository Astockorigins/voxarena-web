'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const translations = {
  en: {
    navDownload: "Download App",
    heroBadge: "THE FACE-OFF",
    heroTitle: "Presidential Race",
    heroSubtitle: "A civic, non-binding public opinion poll. Your voice, on the record. Independent and not affiliated with any political party.",
    heroBtn1: "Enter the Arena",
    heroBtn2: "View Live Results",
    resultsLive: "LIVE TALLYING",
    resultsTitle: "National Results",
    resultsTotal: "Total Verified Votes",
    resultsTurnout: "Voter Turnout",
    resultsTurnoutSub: "registered users have voted.",
    resultsBreakdown: "Candidate Breakdown",
    resultsVotes: "Votes",
    resultsShare: "Share",
    resultsDisclaimer: "These results are not official election results. They represent only the users of the VoxArena application.",
    fundingTitle: "Support VoxArena",
    fundingSub: "Help us keep the servers running and the platform ad-free.",
    fundingGoal: "Funding Goal",
    fundingRaised: "raised of",
    downloadTitle: "Download VoxArena",
    downloadSub: "The app is currently available for Android. iOS support is coming soon.",
    downloadNew: "New Update Available: v1.0.7",
    downloadBtnTop: "Download for Android",
    downloadBtnBottom: "VoxArena APK",
    downloadNote: "Note: You may need to allow \"Install from unknown sources\" in your Android settings.",
    footerDisclaimer: "VoxArena is an independent platform and is not affiliated with any candidate, party, or government body. Its polls are non-binding and do not represent official election results.",
    footerRights: "All rights reserved."
  },
  sw: {
    navDownload: "Pakua App",
    heroBadge: "PAMBANO LA WANANCHI",
    heroTitle: "Kinyang'anyiro cha Urais",
    heroSubtitle: "Kura ya maoni ya umma isiyo ya lazima. Sauti yako, kwenye rekodi. Huru na haihusiani na chama chochote cha siasa.",
    heroBtn1: "Ingia Jukwaani",
    heroBtn2: "Tazama Matokeo",
    resultsLive: "UHESABU WA MUBASHARA",
    resultsTitle: "Matokeo ya Kitaifa",
    resultsTotal: "Jumla ya Kura Zilizothibitishwa",
    resultsTurnout: "Ushiriki wa Wapiga Kura",
    resultsTurnoutSub: "watumiaji waliosajiliwa wamepiga kura.",
    resultsBreakdown: "Mchanganuo wa Wagombea",
    resultsVotes: "Kura",
    resultsShare: "Asilimia",
    resultsDisclaimer: "Matokeo haya sio matokeo rasmi ya uchaguzi. Yanawakilisha tu watumiaji wa programu ya VoxArena.",
    fundingTitle: "Saidia VoxArena",
    fundingSub: "Tusaidie kuendesha seva na kufanya jukwaa hili liwe na matangazo.",
    fundingGoal: "Lengo la Ufadhili",
    fundingRaised: "zilizokusanywa kati ya",
    downloadTitle: "Pakua VoxArena",
    downloadSub: "Programu inapatikana kwa Android kwa sasa. iOS inakuja hivi karibuni.",
    downloadNew: "Sasisho Jipya Linapatikana: v1.0.7",
    downloadBtnTop: "Pakua kwa Android",
    downloadBtnBottom: "VoxArena APK",
    downloadNote: "Kumbuka: Unaweza kuhitaji kuruhusu \"Sakinisha kutoka vyanzo visivyojulikana\" kwenye mipangilio yako ya Android.",
    footerDisclaimer: "VoxArena ni jukwaa huru na haihusiani na mgombea yeyote, chama, au taasisi ya serikali. Kura zake sio za lazima na haziwakilishi matokeo rasmi ya uchaguzi.",
    footerRights: "Haki zote zimehifadhiwa."
  }
};

export default function Home() {
  const [lang, setLang] = useState<'en' | 'sw'>('sw'); // Default to Kiswahili
  const [results, setResults] = useState<any[]>([]);
  const [funding, setFunding] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const t = translations[lang];

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Votes
        const { data: voteData, error: voteError } = await supabase.from('vote_totals').select('*');
        if (voteError) console.error("Vote Error:", voteError);
        if (voteData) {
          const sorted = voteData.sort((a, b) => b.total_votes - a.total_votes);
          setResults(sorted);
        }

        // Fetch Funding
        const { data: fundingData, error: fundingError } = await supabase.from('funding_goal').select('*').single();
        if (fundingError) console.error("Funding Error:", fundingError);
        if (fundingData) {
          setFunding(fundingData);
        }

      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalVotes = results.reduce((sum, item) => sum + item.total_votes, 0);
  const totalRegistered = results.length > 0 ? results[0].total_registered_users : 0;
  const turnoutPercent = totalRegistered === 0 ? 0 : Math.round((totalVotes / totalRegistered) * 100);
  const progress = funding ? Math.min(Math.round((funding.current_amount / funding.target_amount) * 100), 100) : 0;

  return (
    <main className="min-h-screen flex flex-col bg-vox-ivory">
      {/* Navigation */}
      <nav className="w-full px-6 py-6 flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="VoxArena Logo" className="w-10 h-10 object-contain" />
          <div className="hidden sm:block text-2xl font-extrabold tracking-widest text-vox-charcoal">VOXARENA</div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Language Toggle */}
          <button 
            onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
            className="flex items-center gap-2 border border-vox-charcoal text-vox-charcoal px-3 py-1 rounded-md text-sm font-bold hover:bg-vox-charcoal hover:text-vox-ivory transition"
          >
            {lang === 'en' ? '🇰🇪 SW' : '🇬🇧 EN'}
          </button>

          <a href="#download" className="bg-vox-emerald text-vox-ivory px-6 py-2 rounded-md font-bold text-sm hover:opacity-90 transition">
            {t.navDownload}
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20 w-full max-w-4xl mx-auto overflow-hidden">
        <div className="inline-block bg-vox-card text-vox-emerald px-4 py-1 rounded-full text-xs font-bold tracking-widest mb-6">
          {t.heroBadge}
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-vox-charcoal tracking-tight mb-6 leading-tight break-all px-2 w-full">
          {t.heroTitle}
        </h1>
        <p className="text-xl md:text-2xl text-vox-grey max-w-2xl mb-12 leading-relaxed">
          {t.heroSubtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#download" className="bg-vox-charcoal text-vox-ivory px-8 py-4 rounded-md font-bold text-lg hover:bg-black transition shadow-lg">
            {t.heroBtn1}
          </a>
          <a href="#results" className="border-2 border-vox-charcoal text-vox-charcoal px-8 py-4 rounded-md font-bold text-lg hover:bg-vox-card transition">
            {t.heroBtn2}
          </a>
        </div>
      </section>

      {/* Live Results Section */}
      <section id="results" className="bg-vox-card py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold tracking-widest mb-4 uppercase">
              <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
              {t.resultsLive}
            </div>
            <h3 className="text-4xl font-extrabold text-vox-charcoal mb-4">{t.resultsTitle}</h3>
          </div>

          <div className="bg-vox-ivory rounded-2xl p-10 text-center mb-8 shadow-sm">
            <p className="text-sm font-bold text-vox-grey uppercase tracking-widest mb-2">{t.resultsTotal}</p>
            <p className="text-6xl font-black text-vox-charcoal">{totalVotes.toLocaleString()}</p>
          </div>

          <div className="bg-vox-ivory p-6 rounded-2xl shadow-sm mb-8 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-vox-charcoal text-lg">{t.resultsTurnout}</span>
              <span className="font-black text-vox-emerald text-2xl">{turnoutPercent}%</span>
            </div>
            <p className="text-vox-grey text-sm">
              {totalVotes} {lang === 'sw' ? 'kati ya' : 'out of'} {totalRegistered.toLocaleString()} {t.resultsTurnoutSub}
            </p>
          </div>

          <div className="space-y-6">
            {results.map((candidate) => {
              const percent = totalVotes === 0 ? 0 : Math.round((candidate.total_votes / totalVotes) * 100);
              return (
                <div key={candidate.candidate_id} className="bg-vox-ivory p-6 md:p-8 rounded-2xl shadow-sm flex flex-col gap-6">
                  <div className="flex items-center gap-6">
                    <div className="relative flex items-center justify-center shrink-0 w-20 h-20">
                      <svg width="80" height="80" className="transform -rotate-90">
                        <circle stroke="#E5E7EB" fill="none" cx="40" cy="40" r="35" strokeWidth="10" />
                        <circle stroke={candidate.color} fill="none" cx="40" cy="40" r="35" strokeWidth="10" strokeDasharray={`${2 * Math.PI * 35} ${2 * Math.PI * 35}`} strokeDashoffset={`${(1 - percent / 100) * 2 * Math.PI * 35}`} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                      </svg>
                      <div className="absolute text-sm font-extrabold text-vox-charcoal">{percent}%</div>
                    </div>
                    <div className="flex items-center gap-3">
                      {candidate.image_url && <img src={candidate.image_url} alt={candidate.name} className="w-12 h-12 rounded-full object-cover bg-gray-200" />}
                      <span className="font-bold text-vox-charcoal text-2xl">{candidate.name}</span>
                    </div>
                  </div>
                  <div className="w-full border-t border-gray-200">
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-vox-grey font-medium">{t.resultsVotes}</span>
                      <span className="font-extrabold text-vox-charcoal">{candidate.total_votes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-vox-grey font-medium">{t.resultsShare}</span>
                      <span className="font-extrabold" style={{ color: candidate.color }}>{percent}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-center text-xs text-vox-grey mt-8 max-w-md mx-auto">
            {t.resultsDisclaimer}
          </p>
        </div>
      </section>

      {/* Funding Progress */}
      <section className="py-24 px-6 text-center max-w-3xl mx-auto w-full">
        <h2 className="text-3xl font-extrabold text-vox-charcoal mb-6">{t.fundingTitle}</h2>
        <p className="text-lg text-vox-grey mb-10">{t.fundingSub}</p>
        <div className="bg-vox-card p-8 rounded-2xl shadow-sm text-left">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-vox-charcoal text-lg">{t.fundingGoal}</span>
            <span className="font-black text-vox-emerald text-2xl">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div className="bg-vox-emerald h-4 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-vox-grey text-sm">
            KES {funding?.current_amount.toLocaleString() || 0} {t.fundingRaised} KES {funding?.target_amount.toLocaleString() || 0}
          </p>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-24 px-6 text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold text-vox-charcoal mb-6">{t.downloadTitle}</h2>
        
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold tracking-widest mb-6 uppercase">
          <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
          {t.downloadNew}
        </div>

        <p className="text-lg text-vox-grey mb-10">{t.downloadSub}</p>
        
        <a 
          href="https://github.com/Astockorigins/voxarena-web/releases/download/v1.0.7/voxarena.apk" 
          download
          className="inline-flex items-center gap-4 bg-vox-charcoal text-vox-ivory px-6 py-4 rounded-xl font-bold text-lg hover:bg-black transition shadow-xl hover:-translate-y-1 duration-200"
        >
          <div className="bg-white/10 p-2 rounded-lg">
            <img src="/logo.png" alt="VoxArena Icon" className="w-8 h-8 object-contain" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-normal text-gray-300 uppercase tracking-wider">{t.downloadBtnTop}</span>
            <span className="text-xl">{t.downloadBtnBottom}</span>
          </div>
          <svg className="w-5 h-5 text-gray-400 ml-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0004.5511-.4482.9997-.9993.9997zm-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997zm11.4045-6.02l1.9973-3.4592c.1152-.1996.0472-.4537-.1524-.5688-.1996-.1151-.4537-.0472-.5688.1524l-2.0237 3.5047c-1.3997-.6396-2.9654-.9984-4.6295-.9984-1.6637 0-3.2294.3588-4.6295.9984L6.351 5.4463c-.1151-.1996-.3692-.2675-.5688-.1524-.1996.1151-.2676.3692-.1524.5688l1.9973 3.4592C3.326 11.1118.6283 14.9295.1382 19.4609H23.862c-.4901-4.5314-3.1878-8.3491-7.9805-10.1395z"/>
          </svg>
        </a>
        
        <p className="mt-6 text-sm text-vox-grey">{t.downloadNote}</p>
      </section>

      {/* Footer */}
      <footer className="bg-vox-charcoal text-vox-ivory py-12 text-center px-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src="/logo.png" alt="VoxArena Logo" className="w-8 h-8 object-contain" />
          <div className="text-xl font-bold tracking-widest">VOXARENA</div>
        </div>
        <p className="text-vox-grey text-sm max-w-lg mx-auto">
          {t.footerDisclaimer}
        </p>
        <p className="text-vox-grey text-xs mt-8">
          © {new Date().getFullYear()} VoxArena. {t.footerRights}
        </p>
      </footer>
    </main>
  );
}