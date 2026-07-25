import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// ATS keyword analysis — pure server-side text matching, no LLM needed (fast & deterministic)
const STOP_WORDS = new Set([
  "the","a","an","and","or","but","in","on","at","to","for","of","with","by","from","up","about","into","through","during",
  "is","are","was","were","be","been","being","have","has","had","do","does","did","will","would","could","should","may","might",
  "you","your","we","our","us","they","them","their","he","she","it","its","i","me","my","this","that","these","those",
  "job","role","work","working","experience","skills","skill","ability","responsible","responsibilities","duties","requirements",
  "required","preferred","plus","etc","must","strong","excellent","good","great","team","teams","including","include","includes",
  "using","use","used","able","across","within","well","new","year","years","per","day","week","month","time","full","part",
  "apply","application","candidate","candidates","hiring","position","positions","company","opportunity","seeking","looking",
  "join","help","make","making","able","self","motivated","detail","oriented","fast","paced","environment","equal","employer",
  "what","why","how","when","where","which","who","whom","also","than","then","so","if","as","not","no","yes","more","most","less",
  "plus","comfortable","willing","both","either","each","all","any","some","such","own","same","other","over","under","between",
]);

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z][a-z0-9+#.\-]+/g) || [])
    .map((w) => w.replace(/[.\-]+$/, ""))
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

// Split text into phrase segments (by sentence/clause boundaries) so bigrams don't span unrelated words
function phraseSegments(text: string): string[] {
  return text
    .split(/[.;:,!?()\n\r•·\u2022]|and\/or|&| - | — /)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

// Known skill/tech terms to always treat as keywords when present
const KNOWN_SKILLS = new Set([
  "javascript","typescript","python","java","c++","c#","go","rust","ruby","php","swift","kotlin","scala","r","matlab",
  "react","reactjs","vue","vue.js","angular","svelte","next.js","nextjs","nuxt","gatsby","remix",
  "node","node.js","express","nestjs","django","flask","fastapi","spring","rails","laravel",
  "html","css","scss","tailwind","bootstrap","sass","less","styled",
  "sql","postgres","postgresql","mysql","mongodb","redis","sqlite","dynamodb","firebase","supabase","prisma",
  "aws","gcp","azure","docker","kubernetes","k8s","terraform","ansible","jenkins","ci","cd","cicd",
  "git","github","gitlab","bitbucket","jira","confluence",
  "figma","sketch","adobe","xd","photoshop","illustrator","indesign","after effects","premiere","framer","principle",
  "product design","design systems","design system","ux","ui","ux research","user research","prototyping","wireframing",
  "accessibility","wcag","a11y","responsive","mobile","web","ios","android",
  "agile","scrum","kanban","waterfall","saas","b2b","b2c","fintech","edtech","healthtech","ecommerce","marketplace",
  "leadership","mentorship","mentoring","stakeholder","roadmap","kpi","okr","analytics","a/b testing","experimentation",
  "machine learning","ml","ai","deep learning","nlp","computer vision","tensorflow","pytorch","pandas","numpy",
  "salesforce","hubspot","stripe","razorpay","graphql","rest","api","apis","microservices","serverless",
  "cross-functional","collaboration","communication","presentation","storytelling","facilitation",
  "seo","sem","google analytics","mixpanel","amplitude","heap","fullstory","hotjar","maze",
]);

function isKnownSkill(term: string): boolean {
  return KNOWN_SKILLS.has(term.toLowerCase());
}

function topKeywords(text: string): { term: string; count: number; isPhrase: boolean }[] {
  const counts = new Map<string, number>();
  const phrases = phraseSegments(text);

  for (const phrase of phrases) {
    const tokens = tokenize(phrase);
    // Unigrams
    for (const t of tokens) {
      counts.set(t, (counts.get(t) || 0) + 1);
    }
    // Bigrams (only within same phrase segment, avoiding cross-clause noise)
    for (let i = 0; i < tokens.length - 1; i++) {
      const bg = `${tokens[i]} ${tokens[i + 1]}`;
      // Only count bigrams that are known skills OR appear multiple times
      const isKnown = isKnownSkill(bg);
      const tentative = (counts.get(bg) || 0) + 1.4;
      if (isKnown || tentative >= 2.4) {
        counts.set(bg, tentative);
      }
    }
  }

  return [...counts.entries()]
    .map(([term, count]) => ({
      term,
      count,
      isPhrase: term.includes(" "),
    }))
    .sort((a, b) => b.count - a.count);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeText, jobDescription } = body;
    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: "resumeText and jobDescription are required" }, { status: 400 });
    }

    const jobKw = topKeywords(jobDescription).slice(0, 25);
    const resumeLower = resumeText.toLowerCase();
    const resumeTokens = new Set(tokenize(resumeText));
    const resumeBigrams = new Set(
      phraseSegments(resumeText).flatMap((p) => {
        const t = tokenize(p);
        const bgs: string[] = [];
        for (let i = 0; i < t.length - 1; i++) bgs.push(`${t[i]} ${t[i + 1]}`);
        return bgs;
      })
    );

    const matched: { term: string; count: number }[] = [];
    const missing: { term: string; count: number }[] = [];
    for (const kw of jobKw) {
      const present = kw.isPhrase
        ? resumeBigrams.has(kw.term) || resumeLower.includes(kw.term)
        : resumeTokens.has(kw.term) || resumeLower.includes(kw.term);
      if (present) matched.push({ term: kw.term, count: kw.count });
      else missing.push({ term: kw.term, count: kw.count });
    }

    // Score: weighted by frequency importance of matched terms
    const totalWeight = jobKw.reduce((s, k) => s + k.count, 0) || 1;
    const matchedWeight = matched.reduce((s, k) => s + k.count, 0);
    const score = Math.min(100, Math.round((matchedWeight / totalWeight) * 100));

    // Word count & reading stats
    const wordCount = resumeText.trim().split(/\s+/).filter(Boolean).length;

    // Recommendations
    const recommendations: string[] = [];
    if (score < 50) recommendations.push(`Your resume matches only ${score}% of the job's key terms. Add the missing keywords above where truthful.`);
    else if (score < 75) recommendations.push(`Decent ${score}% match. Adding a few more missing keywords could push you past ATS filters.`);
    else recommendations.push(`Strong ${score}% keyword match. Focus on quantifying achievements to stand out to recruiters.`);
    if (missing.length > 8) recommendations.push(`${missing.length} key terms are missing — prioritize the most relevant ones.`);
    if (wordCount < 300) recommendations.push(`Resume looks short (${wordCount} words). Aim for 400–800 words for experienced roles.`);
    else if (wordCount > 1000) recommendations.push(`Resume may be too long (${wordCount} words). Trim to 1–2 pages for ATS readability.`);
    else recommendations.push(`Resume length looks good (${wordCount} words).`);
    recommendations.push("Mirror the job title verbatim in your summary if it matches your target role.");
    recommendations.push("Use the exact tool names from the job description (e.g. 'Figma', not 'design software').");

    return NextResponse.json({
      score,
      matched,
      missing,
      wordCount,
      jobKeywordCount: jobKw.length,
      recommendations,
    });
  } catch (e) {
    console.error("ATS analysis error:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
