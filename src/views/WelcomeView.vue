<template>
  <div class="max-w-4xl mx-auto px-6 py-10 space-y-14 pb-20">

    <!-- ── Header ──────────────────────────────────────────────────────────── -->
    <div class="text-center space-y-3">
      <div class="text-blades-gold/40 font-mono text-xs tracking-[0.5em] uppercase mb-2">Campaign Companion</div>
      <h1 class="text-5xl text-blades-gold glow-gold">Aurelion</h1>
      <p class="text-blades-muted font-mono text-sm">
        A Blades in the Dark Campaign — the city that survives by containing its failures
      </p>
      <div class="flex items-center justify-center gap-3 pt-2">
        <div class="h-px flex-1 bg-blades-border" />
        <span class="text-blades-gold/40 text-xs">✦</span>
        <div class="h-px flex-1 bg-blades-border" />
      </div>
    </div>

    <!-- ── Quick Navigation ─────────────────────────────────────────────────── -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <a href="#the-world" class="blades-card p-4 text-center hover:border-blades-gold/40 transition-colors cursor-pointer">
        <div class="text-2xl mb-2">🌍</div>
        <div class="text-xs font-serif text-blades-gold uppercase tracking-wider">The World</div>
        <div class="text-[10px] font-mono text-blades-muted mt-1">Setting &amp; lore</div>
      </a>
      <a href="#the-city" class="blades-card p-4 text-center hover:border-blades-gold/40 transition-colors cursor-pointer">
        <div class="text-2xl mb-2">🏙</div>
        <div class="text-xs font-serif text-blades-gold uppercase tracking-wider">The City</div>
        <div class="text-[10px] font-mono text-blades-muted mt-1">Districts &amp; tiers</div>
      </a>
      <a href="#the-game" class="blades-card p-4 text-center hover:border-blades-gold/40 transition-colors cursor-pointer">
        <div class="text-2xl mb-2">🎲</div>
        <div class="text-xs font-serif text-blades-gold uppercase tracking-wider">The Rules</div>
        <div class="text-[10px] font-mono text-blades-muted mt-1">BiTD primer</div>
      </a>
      <a href="#using-this-app" class="blades-card p-4 text-center hover:border-blades-gold/40 transition-colors cursor-pointer">
        <div class="text-2xl mb-2">◈</div>
        <div class="text-xs font-serif text-blades-gold uppercase tracking-wider">This App</div>
        <div class="text-[10px] font-mono text-blades-muted mt-1">Getting started</div>
      </a>
    </div>

    <!-- ── THE WORLD ─────────────────────────────────────────────────────────── -->
    <section id="the-world" class="scroll-mt-6 space-y-5">
      <div class="section-header"><h2>The World</h2></div>

      <div class="blades-card p-6 space-y-4">
        <p class="text-blades-text font-sans text-sm leading-relaxed">
          Long ago, a party of heroes defeated the <span class="text-blades-gold">Demon King</span>
          and broke his empire. The land beyond Aurelion's walls is blighted, unlivable — salted by the
          war's aftermath. Three walled cities survive. Two rail lines connect them through the wastes.
          The wider world does not exist in any practical sense anymore.
        </p>
        <p class="text-blades-text font-sans text-sm leading-relaxed">
          Aurelion itself was the Demon King's capital. The victorious hero party stayed, argued, split
          along old political lines, and failed to build a stable peace. Each founded an institution instead:
          a Church, a Mage College, a law enforcement force, a trade guild, a transport authority.
          <span class="text-blades-muted italic">Their statues are everywhere. Their institutions are the law.</span>
        </p>
        <div class="blades-card p-4 border-blades-gold/20 bg-blades-gold/5">
          <div class="blades-label mb-2">The City's Ruling Philosophy</div>
          <p class="text-blades-gold font-serif italic text-sm">
            "It is better to contain a problem than fix it."
          </p>
          <p class="text-blades-muted font-mono text-xs mt-2">
            This is not cynicism — it is policy. Aurelion has survived three centuries by
            isolating failures into manageable compartments. The Undercity exists so the
            Upper City doesn't have to think about it. The Lower City exists so the Mid City
            can sleep at night.
          </p>
        </div>
      </div>
    </section>

    <!-- ── THE CITY ──────────────────────────────────────────────────────────── -->
    <section id="the-city" class="scroll-mt-6 space-y-5">
      <div class="section-header"><h2>The City</h2></div>

      <p class="text-blades-muted font-mono text-xs leading-relaxed">
        Aurelion is divided into four vertical tiers. Height equals legitimacy, safety, and access.
        Movement between tiers is frictional — paperwork, toll gates, faction affiliation. Most citizens
        never leave their tier. Your crew almost certainly crosses tiers constantly.
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <!-- Upper City -->
        <div class="blades-card p-5 space-y-3 border-blades-gold/20">
          <div class="flex items-center gap-2">
            <span class="text-xl">👑</span>
            <div>
              <div class="text-blades-gold font-serif font-semibold">Upper City</div>
              <div class="text-blades-muted font-mono text-[10px]">Legitimacy · Memory · Ideology</div>
            </div>
          </div>
          <div class="space-y-1.5 text-xs font-mono text-blades-muted">
            <div><span class="text-blades-text">Crownrise</span> — Power performed. Ceremonial parades,
              monuments to the Heroes, proclamations. Legitimacy as theater.</div>
            <div><span class="text-blades-text">High Sanctum</span> — The Cleric's Church. Faith, charity,
              and the Order of the Pale Seal — the city's sanctioned demon-hunters.</div>
            <div><span class="text-blades-text">Stonefall</span> — Old noble families rotting in their
              estates. The sealed prison. Titles that mean less each decade.</div>
            <div><span class="text-blades-text">Archivum</span> — Paper power. Controls who legally exists
              in Aurelion. Can unmake a person with a single ledger correction.</div>
          </div>
        </div>

        <!-- Mid City -->
        <div class="blades-card p-5 space-y-3 border-blades-sage/20">
          <div class="flex items-center gap-2">
            <span class="text-xl">⚙</span>
            <div>
              <div class="text-blades-sage-light font-serif font-semibold">Mid City</div>
              <div class="text-blades-muted font-mono text-[10px]">Control · Infrastructure · Law</div>
            </div>
          </div>
          <div class="space-y-1.5 text-xs font-mono text-blades-muted">
            <div><span class="text-blades-text">Wardspire</span> — Courts, Bluecoat HQ, central prison.
              Law made concrete. Presence thins significantly below Mid City.</div>
            <div><span class="text-blades-text">Runeward</span> — The Mage's institution. Licensed magic,
              ward maintenance, inspections. Unlicensed casting is a serious crime.</div>
            <div><span class="text-blades-text">Ironline</span> — Rail hub. The only safe transit between
              the three surviving cities. Controls who leaves and who returns.</div>
            <div><span class="text-blades-text">Guildreach</span> — Industry and labor. Guilds set wages,
              hours, and permitted trades. Organized — and exploited.</div>
          </div>
        </div>

        <!-- Lower City -->
        <div class="blades-card p-5 space-y-3 border-blades-red/20">
          <div class="flex items-center gap-2">
            <span class="text-xl">🏮</span>
            <div>
              <div class="text-blades-red-light font-serif font-semibold">Lower City</div>
              <div class="text-blades-muted font-mono text-[10px]">Survival · Adaptation · Crime</div>
            </div>
          </div>
          <div class="space-y-1.5 text-xs font-mono text-blades-muted">
            <div><span class="text-blades-text">Low Lanterns</span> — Pleasure, debt, and shadow brokerage.
              What happens above stays above; what happens here stays dark.</div>
            <div><span class="text-blades-text">Night Market</span> — Everything illegal or just
              extralegal, sold openly after dark. Fences, forgers, alchemists.</div>
            <div><span class="text-blades-text">The Stacks</span> — Displaced workers, radical politics,
              and organizers who dream of burning Guildreach to the ground.</div>
            <div><span class="text-blades-text">Drownways</span> — Flooded canals, smuggling channels,
              and old Demon-King infrastructure no one has mapped completely.</div>
            <div><span class="text-blades-text">Ashfall</span> — Contaminated ruins. People who have
              nowhere else to go. Strange mutations. Unofficial containment zone.</div>
          </div>
        </div>

        <!-- Undercity -->
        <div class="blades-card p-5 space-y-3 border-blades-occult/30">
          <div class="flex items-center gap-2">
            <span class="text-xl">💀</span>
            <div>
              <div class="text-blades-occult-light font-serif font-semibold">The Undercity</div>
              <div class="text-blades-muted font-mono text-[10px]">Sealed · Ancient · Unresolved</div>
            </div>
          </div>
          <div class="space-y-1.5 text-xs font-mono text-blades-muted">
            <div><span class="text-blades-text">Old Nexus</span> — The buried heart of the Demon King's
              power. Ancient, partially sealed, never truly resolved. Those who go below
              often do not return the same.</div>
            <div class="text-blades-occult-light/60 italic text-[10px]">
              The city's official position: Old Nexus is contained. The city's unofficial reality:
              no one is entirely sure.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── THE GAME ──────────────────────────────────────────────────────────── -->
    <section id="the-game" class="scroll-mt-6 space-y-5">
      <div class="section-header"><h2>Blades in the Dark — Rules Primer</h2></div>

      <p class="text-blades-muted font-mono text-xs leading-relaxed">
        Blades in the Dark is a game about criminals doing scores in a dark, industrial fantasy city.
        The mechanics assume you will fail sometimes, get hurt, and still push forward anyway.
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div class="blades-card p-5 space-y-3">
          <h3 class="text-base text-blades-gold font-serif">Rolling the Dice</h3>
          <div class="space-y-2 text-xs font-mono text-blades-muted leading-relaxed">
            <p>When you take a <span class="text-blades-text">risky action</span>, roll a pool of d6s equal
              to the relevant <span class="text-blades-gold">Action Rating</span> (0–4).</p>
            <div class="space-y-1 pl-2 border-l-2 border-blades-border">
              <div><span class="text-green-400">6</span> — Full success. You do it.</div>
              <div><span class="text-amber-400">4–5</span> — Partial success. You do it, but there's a
                complication.</div>
              <div><span class="text-blades-red-light">1–3</span> — Failure. Things go wrong. You still
                make progress sometimes.</div>
            </div>
            <p>If your pool is <span class="text-blades-text">0 dice</span>, roll two and take the
              <em>lower</em> result. Rolling multiple dice takes the highest single die.</p>
          </div>
        </div>

        <div class="blades-card p-5 space-y-3">
          <h3 class="text-base text-blades-gold font-serif">Stress &amp; Trauma</h3>
          <div class="space-y-2 text-xs font-mono text-blades-muted leading-relaxed">
            <p>Characters have <span class="text-blades-text">9 stress boxes</span>. Push yourself by taking
              2 stress to add +1d to a roll, resist consequences for 1–6 stress, or assist allies
              for 1 stress.</p>
            <p>Filling your stress track means you take a
              <span class="text-blades-red-light">Trauma</span> — a permanent personality fracture
              (Haunted, Cold, Reckless…). You clear all stress and continue, but
              <span class="italic">you're changed</span>.</p>
            <p>Four Trauma means retirement from the life. Not death — something worse.</p>
          </div>
        </div>

        <div class="blades-card p-5 space-y-3">
          <h3 class="text-base text-blades-gold font-serif">The Score &amp; The Downtime</h3>
          <div class="space-y-2 text-xs font-mono text-blades-muted leading-relaxed">
            <p>Play alternates between <span class="text-blades-text">Scores</span> (the job — a heist,
              assassination, negotiation, smuggling run) and
              <span class="text-blades-text">Downtime</span> (recovery, projects, vice, faction work).</p>
            <p>Before a Score: choose your
              <span class="text-blades-gold">Approach</span> (stealth, social, force, etc.) and pick
              your <span class="text-blades-gold">Loadout</span> (light, standard, or heavy gear).
              You don't list specific items — you just note you have them and describe them when needed.</p>
          </div>
        </div>

        <div class="blades-card p-5 space-y-3">
          <h3 class="text-base text-blades-gold font-serif">Factions &amp; Heat</h3>
          <div class="space-y-2 text-xs font-mono text-blades-muted leading-relaxed">
            <p><span class="text-blades-text">Heat</span> (0–9) tracks how much law enforcement attention
              your crew has drawn. High heat means more patrols, harder jobs, wanted level.</p>
            <p><span class="text-blades-text">Factions</span> have Tiers (0–5) and relationships with
              your crew (−3 War to +3 Ally). Scores affect faction standing. Factions that like you
              provide assets, information, and safe houses. Ones that hate you send assassins.</p>
            <p>Your <span class="text-blades-gold">Crew's Tier</span> determines your baseline power,
              pay rates, and what targets are realistic to take on.</p>
          </div>
        </div>

        <div class="blades-card p-5 space-y-3">
          <h3 class="text-base text-blades-gold font-serif">Actions (12 core)</h3>
          <div class="grid grid-cols-3 gap-2 text-[10px] font-mono">
            <div>
              <div class="text-blades-muted mb-1">Insight</div>
              <div class="space-y-0.5 text-blades-text">
                <div>Hunt</div><div>Study</div><div>Survey</div><div>Tinker</div>
              </div>
            </div>
            <div>
              <div class="text-blades-muted mb-1">Prowess</div>
              <div class="space-y-0.5 text-blades-text">
                <div>Finesse</div><div>Prowl</div><div>Skirmish</div><div>Wreck</div>
              </div>
            </div>
            <div>
              <div class="text-blades-muted mb-1">Resolve</div>
              <div class="space-y-0.5 text-blades-text">
                <div>Attune</div><div>Command</div><div>Consort</div><div>Sway</div>
              </div>
            </div>
          </div>
          <p class="text-blades-muted text-[10px] font-mono leading-relaxed">
            Each action is rated 0–4. You start with 2 points to distribute, and gain more through
            XP. Actions rarely start above 2 — mastery is earned.
          </p>
        </div>

        <div class="blades-card p-5 space-y-3">
          <h3 class="text-base text-blades-gold font-serif">Clocks</h3>
          <div class="space-y-2 text-xs font-mono text-blades-muted leading-relaxed">
            <p>Progress on complex situations is tracked with <span class="text-blades-text">Clocks</span>
              — pie charts divided into 4, 6, or 8 segments. Fill a clock to complete the thing.</p>
            <p>Clocks can be: <em>a rival plan nearing completion, a building that needs to be
              searched, a guard becoming suspicious, the city guard arriving</em>. They create
              pressure and make the fiction concrete.</p>
            <p>The GM fills segments on failure or complication. Players fill them on success.
              Two clocks racing is a classic Blades situation.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── USING THIS APP ─────────────────────────────────────────────────────── -->
    <section id="using-this-app" class="scroll-mt-6 space-y-5">
      <div class="section-header"><h2>Using This Companion</h2></div>

      <div class="space-y-3">

        <div class="blades-card p-5 flex gap-4">
          <div class="text-2xl flex-shrink-0 mt-0.5">⚓</div>
          <div>
            <div class="text-blades-text font-serif font-semibold mb-1">The Crew</div>
            <p class="text-blades-muted font-mono text-xs leading-relaxed">
              Start here. Set your crew type, name, and track Heat, Rep, Tier, and Coin. Add
              Crew Clocks for ongoing situations. Your Lair and Contacts are listed here too.
            </p>
          </div>
        </div>

        <div class="blades-card p-5 flex gap-4">
          <div class="text-2xl flex-shrink-0 mt-0.5">◉</div>
          <div>
            <div class="text-blades-text font-serif font-semibold mb-1">Player Characters</div>
            <p class="text-blades-muted font-mono text-xs leading-relaxed">
              Full character sheets — Action ratings, XP tracks, Stress, Trauma, Harm, Coin,
              Special Abilities, and personal Items. Use the XP track to track advancement
              during Downtime.
            </p>
          </div>
        </div>

        <div class="blades-card p-5 flex gap-4">
          <div class="text-2xl flex-shrink-0 mt-0.5">◈</div>
          <div>
            <div class="text-blades-text font-serif font-semibold mb-1">NPCs</div>
            <p class="text-blades-muted font-mono text-xs leading-relaxed">
              The world's cast — faction leaders, allies, rivals, marks, and strangers the crew
              has met. Search by name or role. Filter by faction. Mark favorites (★) to pin key
              characters to the top. Toggle 🌐 Public to control what appears on your campaign
              site when you publish to GitHub Pages.
            </p>
          </div>
        </div>

        <div class="blades-card p-5 flex gap-4">
          <div class="text-2xl flex-shrink-0 mt-0.5">⚑</div>
          <div>
            <div class="text-blades-text font-serif font-semibold mb-1">Factions</div>
            <p class="text-blades-muted font-mono text-xs leading-relaxed">
              Track your standing (−3 War through +3 Ally) with every major power in Aurelion.
              Factions seeded from the BiTD SRD — add your own as the campaign grows. Each faction
              shows Tier, Hold, and category.
            </p>
          </div>
        </div>

        <div class="blades-card p-5 flex gap-4">
          <div class="text-2xl flex-shrink-0 mt-0.5">◬</div>
          <div>
            <div class="text-blades-text font-serif font-semibold mb-1">Locations</div>
            <p class="text-blades-muted font-mono text-xs leading-relaxed">
              Navigate the city's hierarchy — World → City → District → Site. Each site shows
              the NPCs assigned there. Use the search bar to find any location instantly. Click
              <em>✦ AI</em> on any location card to generate a Ghibli-style banner image.
            </p>
          </div>
        </div>

        <div class="blades-card p-5 flex gap-4">
          <div class="text-2xl flex-shrink-0 mt-0.5">◇</div>
          <div>
            <div class="text-blades-text font-serif font-semibold mb-1">Items</div>
            <p class="text-blades-muted font-mono text-xs leading-relaxed">
              Catalogue notable gear — artifacts, contraband, loot, or plot-relevant objects.
              Track who holds each item and where it's located. Search by name, tag, or
              description. Load ratings (0–3+) help with encumbrance during Loadout.
            </p>
          </div>
        </div>

        <div v-if="!isStatic" class="blades-card p-5 flex gap-4 border-blades-gold/20">
          <div class="text-2xl flex-shrink-0 mt-0.5">↑</div>
          <div>
            <div class="text-blades-gold font-serif font-semibold mb-1">Publishing to GitHub Pages</div>
            <p class="text-blades-muted font-mono text-xs leading-relaxed">
              Mark items, NPCs, and locations as <span class="text-blades-text">🌐 Public</span> to
              include them in your campaign site. Private (🔒) entries stay local. When ready, click
              <em>↑ Publish to GitHub Pages</em> in the sidebar to deploy a read-only version of
              your public content for your players. See the
              <span class="text-blades-gold">README</span> in the GitHub repository for full setup
              instructions.
            </p>
          </div>
        </div>

      </div>
    </section>

    <!-- ── Footer ─────────────────────────────────────────────────────────────── -->
    <div class="text-center text-blades-muted/40 font-mono text-[10px] pt-4 border-t border-blades-border">
      Blades in the Dark by John Harper · Aurelion setting · Frieren: Beyond Journey's End aesthetic
    </div>

  </div>
</template>

<script setup lang="ts">
declare const __STATIC_MODE__: boolean
const isStatic = __STATIC_MODE__
</script>
