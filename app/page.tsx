import { supabase } from '../lib/supabase';

type ResultData = {
  candidate_id: string;
  name: string;
  total_votes: number;
  color: string;
  image_url?: string | null;
};

export default async function Home() {
  // Fetch the live data directly on the server
  const { data: results } = await supabase.from('vote_totals').select('*');
  
  // Sort by highest votes
  const sortedResults = (results || []).sort((a, b) => b.total_votes - a.total_votes) as ResultData[];
  const totalVotes = sortedResults.reduce((sum, item) => sum + item.total_votes, 0);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="w-full px-6 py-6 flex justify-between items-center max-w-6xl mx-auto">
        <div className="text-2xl font-extrabold tracking-widest text-vox-charcoal">
          VOXARENA
        </div>
        <a 
          href="#download" 
          className="bg-vox-emerald text-vox-ivory px-6 py-2 rounded-md font-bold text-sm hover:opacity-90 transition"
        >
          Download App
        </a>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20 max-w-4xl mx-auto">
        <div className="inline-block bg-vox-card text-vox-emerald px-4 py-1 rounded-full text-xs font-bold tracking-widest mb-6">
          THE FACE-OFF
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-vox-charcoal tracking-tight mb-6">
          Sifuna <span className="text-vox-emerald">·</span> Ruto
        </h1>
        <p className="text-xl md:text-2xl text-vox-grey max-w-2xl mb-12 leading-relaxed">
          A civic, non-binding public opinion poll. Your voice, on the record. 
          Independent and not affiliated with any political party.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <a 
            href="#download" 
            className="bg-vox-charcoal text-vox-ivory px-8 py-4 rounded-md font-bold text-lg hover:bg-black transition shadow-lg"
          >
            Enter the Arena
          </a>
          <a 
            href="#results" 
            className="border-2 border-vox-charcoal text-vox-charcoal px-8 py-4 rounded-md font-bold text-lg hover:bg-vox-card transition"
          >
            View Live Results
          </a>
        </div>
      </section>

      {/* Live Results Section */}
      <section id="results" className="bg-vox-card py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-vox-charcoal mb-2">Live Results</h2>
            <p className="text-vox-grey">Based on {totalVotes} verified votes from the mobile app.</p>
          </div>

          <div className="bg-vox-ivory p-8 rounded-xl shadow-sm space-y-8">
            {sortedResults.map((candidate) => {
              const percent = totalVotes === 0 ? 0 : Math.round((candidate.total_votes / totalVotes) * 100);
              
              return (
                <div key={candidate.candidate_id} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      {candidate.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={candidate.image_url} alt={candidate.name} className="w-10 h-10 rounded-full object-cover bg-gray-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: candidate.color }}>
                          {candidate.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-bold text-vox-charcoal text-lg">{candidate.name}</span>
                    </div>
                    <span className="font-extrabold text-vox-charcoal text-xl">{percent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${percent}%`, backgroundColor: candidate.color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-center text-xs text-vox-grey mt-6">
            These results are not official election results. They represent only the users of the VoxArena application.
          </p>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-24 px-6 text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold text-vox-charcoal mb-6">Download VoxArena</h2>
        <p className="text-lg text-vox-grey mb-10">
          The app is currently available for Android. iOS support is coming soon.
        </p>
        
        <a 
          href="/voxarena.apk" 
          download
          className="inline-flex items-center gap-3 bg-vox-emerald text-vox-ivory px-10 py-5 rounded-xl font-bold text-xl hover:bg-opacity-90 transition shadow-xl"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0004.5511-.4482.9997-.9993.9997zm-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997zm11.4045-6.02l1.9973-3.4592c.1152-.1996.0472-.4537-.1524-.5688-.1996-.1151-.4537-.0472-.5688.1524l-2.0237 3.5047c-1.3997-.6396-2.9654-.9984-4.6295-.9984-1.6637 0-3.2294.3588-4.6295.9984L6.351 5.4463c-.1151-.1996-.3692-.2675-.5688-.1524-.1996.1151-.2676.3692-.1524.5688l1.9973 3.4592C3.326 11.1118.6283 14.9295.1382 19.4609H23.862c-.4901-4.5314-3.1878-8.3491-7.9805-10.1395z"/>
          </svg>
          Download APK for Android
        </a>
        
        <p className="mt-6 text-sm text-vox-grey">
          Note: You may need to allow "Install from unknown sources" in your Android settings.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-vox-charcoal text-vox-ivory py-12 text-center px-6">
        <div className="text-xl font-bold tracking-widest mb-4">VOXARENA</div>
        <p className="text-vox-grey text-sm max-w-lg mx-auto">
          VoxArena is an independent platform and is not affiliated with any candidate, party, or government body. Its polls are non-binding and do not represent official election results.
        </p>
        <p className="text-vox-grey text-xs mt-8">
          © 2026 VoxArena. All rights reserved.
        </p>
      </footer>
    </main>
  );
}