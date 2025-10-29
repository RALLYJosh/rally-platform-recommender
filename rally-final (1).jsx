import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Sparkles, Check, Download, Mail, Save, Upload, Copy, BarChart3, X, CheckCircle } from 'lucide-react';

export default function RallyPlatformRecommender() {
  const [step, setStep] = useState(0);
  const [quickNotes, setQuickNotes] = useState('');
  const [showQuickNotes, setShowQuickNotes] = useState(false);
  const [audiences, setAudiences] = useState([]);
  const [goals, setGoals] = useState([]);
  const [existingPlatforms, setExistingPlatforms] = useState([]);
  const [budget, setBudget] = useState('');
  const [capacity, setCapacity] = useState('');
  const [timeline, setTimeline] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [expandedCards, setExpandedCards] = useState({});
  const [loading, setLoading] = useState(false);
  const [clientEmail, setClientEmail] = useState('');
  const [generatingEmail, setGeneratingEmail] = useState(false);
  const [platformPrompts, setPlatformPrompts] = useState({});
  const [generatingPrompt, setGeneratingPrompt] = useState(null);
  const [copiedPrompt, setCopiedPrompt] = useState(null);
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonScenarios, setComparisonScenarios] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Auto-save to localStorage on changes
  useEffect(() => {
    if (step > 0) {
      const autoSave = {
        step,
        quickNotes,
        audiences,
        goals,
        existingPlatforms,
        budget,
        capacity,
        timeline,
        timestamp: Date.now()
      };
      localStorage.setItem('rallyAutoSave', JSON.stringify(autoSave));
    }
  }, [step, quickNotes, audiences, goals, existingPlatforms, budget, capacity, timeline]);

  // Load saved scenarios from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('rallyScenarios');
    if (saved) {
      setSavedScenarios(JSON.parse(saved));
    }

    // Check for auto-save
    const autoSave = localStorage.getItem('rallyAutoSave');
    if (autoSave) {
      const data = JSON.parse(autoSave);
      const hoursSinceLastSave = (Date.now() - data.timestamp) / (1000 * 60 * 60);
      if (hoursSinceLastSave < 24 && data.step > 0) {
        // Could prompt user to resume, but for now just silently available
      }
    }
  }, []);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const audienceOptions = [
    { value: 'congress-staffers', label: 'Congressional Decision-Makers & Staff', description: 'Hill staffers, elected officials, policy advisors' },
    { value: 'young-activists', label: 'Young Activists & Organizers (18-30)', description: 'College students, early career advocates, grassroots organizers' },
    { value: 'donors-supporters', label: 'Donors & High-Value Supporters', description: 'Foundation leaders, major donors, philanthropists' },
    { value: 'general-public', label: 'General Public / Broad Awareness', description: 'Wide demographic reach, mass awareness campaigns' },
    { value: 'suburban-voters', label: 'Suburban Voters & Parents', description: 'Middle-income families, education-focused, moderate voters' },
    { value: 'coalition-partners', label: 'Coalition Partners & Allies', description: 'Other nonprofits, advocacy groups, partner organizations' },
    { value: 'media-influencers', label: 'Media & Influencers', description: 'Journalists, bloggers, content creators, thought leaders' },
    { value: 'grassroots-community', label: 'Grassroots Community Members', description: 'Local community leaders, volunteers, neighborhood advocates' }
  ];

  const goalOptions = [
    { value: 'awareness', label: 'Awareness / Reach', description: 'Get message in front of as many people as possible' },
    { value: 'donations', label: 'Donations / Fundraising', description: 'Drive financial contributions' },
    { value: 'petition-signatures', label: 'Petition Signatures', description: 'Collect signatures for advocacy campaigns' },
    { value: 'email-signups', label: 'Email List Growth / Subscribers', description: 'Build email list for ongoing engagement' },
    { value: 'voter-turnout', label: 'Voter Turnout / Registration', description: 'Register voters or drive election participation' },
    { value: 'event-signups', label: 'Event Attendance / RSVPs', description: 'Fill events, webinars, rallies, town halls' },
    { value: 'downloads', label: 'Downloads / Resources', description: 'Reports, toolkits, guides, educational materials' },
    { value: 'advocacy-actions', label: 'Advocacy Actions', description: 'Call representatives, send emails, take action' },
    { value: 'community-building', label: 'Community Building / Engagement', description: 'Foster ongoing conversation and participation' }
  ];

  const platforms = [
    { value: 'landing-page', label: 'Campaign/Landing Page (1-3 pages)', category: 'website' },
    { value: 'brochure-site', label: 'Brochure Website (4-10 pages)', category: 'website' },
    { value: 'medium-site', label: 'Medium Website (10-25 pages)', category: 'website' },
    { value: 'large-site', label: 'Large Organization Website (25+ pages)', category: 'website' },
    { value: 'facebook', label: 'Facebook (Organic)', category: 'social' },
    { value: 'twitter', label: 'Twitter/X (Organic)', category: 'social' },
    { value: 'linkedin', label: 'LinkedIn (Organic)', category: 'social' },
    { value: 'instagram', label: 'Instagram (Organic)', category: 'social' },
    { value: 'tiktok', label: 'TikTok (Organic)', category: 'social' },
    { value: 'threads', label: 'Threads (Organic)', category: 'social' },
    { value: 'reddit', label: 'Reddit (Organic)', category: 'social' },
    { value: 'email', label: 'Email Marketing', category: 'email' },
    { value: 'google-ads', label: 'Google Ads', category: 'paid' },
    { value: 'meta-ads', label: 'Facebook/Instagram Ads', category: 'paid' },
    { value: 'linkedin-ads', label: 'LinkedIn Ads', category: 'paid' },
    { value: 'twitter-ads', label: 'Twitter/X Ads', category: 'paid' },
    { value: 'seo', label: 'SEO / Search Optimization', category: 'seo' }
  ];

  const budgetOptions = [
    { value: 'minimal', label: 'Minimal ($0-2K/month)', description: 'Organic-only or very small ad spend' },
    { value: 'small', label: 'Small ($2K-10K/month)', description: 'Mix of organic and targeted paid' },
    { value: 'medium', label: 'Medium ($10K-50K/month)', description: 'Sustained paid campaigns across platforms' },
    { value: 'large', label: 'Large ($50K+/month)', description: 'Major campaign with multi-platform paid strategy' }
  ];

  const capacityOptions = [
    { value: 'minimal', label: 'Minimal (1-2 hours/week)', description: 'Very limited staff time' },
    { value: 'part-time', label: 'Part-time (5-10 hours/week)', description: 'One person part-time or shared responsibilities' },
    { value: 'dedicated', label: 'Dedicated (20+ hours/week)', description: 'Staff member(s) focused on digital' },
    { value: 'full-team', label: 'Full Team', description: 'Multiple staff or agency support' }
  ];

  const timelineOptions = [
    { value: 'urgent', label: 'Urgent (Launch within 2 weeks)', description: 'Immediate campaign need' },
    { value: 'short', label: 'Short-term (1-3 months)', description: 'Quick campaign or pilot' },
    { value: 'medium', label: 'Medium-term (3-6 months)', description: 'Standard campaign timeline' },
    { value: 'ongoing', label: 'Ongoing / Long-term', description: 'Sustained presence, no specific end date' }
  ];

  const priorityOptions = ['Primary', 'Secondary', 'Tertiary'];

  const toggleAudience = (audienceValue, priority) => {
    const existing = audiences.find(a => a.value === audienceValue);
    if (existing) {
      if (existing.priority === priority) {
        setAudiences(audiences.filter(a => a.value !== audienceValue));
      } else {
        setAudiences(audiences.map(a => 
          a.value === audienceValue ? { ...a, priority } : a
        ));
      }
    } else {
      if (audiences.length < 3) {
        setAudiences([...audiences, { value: audienceValue, priority }]);
      }
    }
  };

  const toggleGoal = (goalValue, priority) => {
    const existing = goals.find(g => g.value === goalValue);
    if (existing) {
      if (existing.priority === priority) {
        setGoals(goals.filter(g => g.value !== goalValue));
      } else {
        setGoals(goals.map(g => 
          g.value === goalValue ? { ...g, priority } : g
        ));
      }
    } else {
      if (goals.length < 3) {
        setGoals([...goals, { value: goalValue, priority }]);
      }
    }
  };

  const togglePlatform = (platformValue) => {
    setExistingPlatforms(prev => 
      prev.includes(platformValue) 
        ? prev.filter(p => p !== platformValue)
        : [...prev, platformValue]
    );
  };

  const toggleExpanded = (index) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const saveScenario = () => {
    if (!scenarioName.trim()) return;
    
    const scenario = {
      id: Date.now(),
      name: scenarioName,
      date: new Date().toISOString(),
      data: {
        quickNotes,
        audiences,
        goals,
        existingPlatforms,
        budget,
        capacity,
        timeline,
        recommendations
      }
    };

    const updated = [...savedScenarios, scenario];
    setSavedScenarios(updated);
    localStorage.setItem('rallyScenarios', JSON.stringify(updated));
    setShowSaveModal(false);
    setScenarioName('');
    
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const loadScenario = (scenario) => {
    setQuickNotes(scenario.data.quickNotes);
    setAudiences(scenario.data.audiences);
    setGoals(scenario.data.goals);
    setExistingPlatforms(scenario.data.existingPlatforms);
    setBudget(scenario.data.budget);
    setCapacity(scenario.data.capacity);
    setTimeline(scenario.data.timeline);
    setRecommendations(scenario.data.recommendations);
    setStep(scenario.data.recommendations.length > 0 ? 6 : 5);
    setShowLoadModal(false);
  };

  const deleteScenario = (scenarioId) => {
    const updated = savedScenarios.filter(s => s.id !== scenarioId);
    setSavedScenarios(updated);
    localStorage.setItem('rallyScenarios', JSON.stringify(updated));
  };

  const addToComparison = () => {
    if (comparisonScenarios.length < 3) {
      setComparisonScenarios([...comparisonScenarios, {
        id: Date.now(),
        name: scenarioName || `Scenario ${comparisonScenarios.length + 1}`,
        audiences,
        goals,
        budget,
        capacity,
        recommendations
      }]);
    }
  };

  const generateRecommendations = async () => {
    setLoading(true);
    
    const audiencesText = audiences.map(a => {
      const audienceObj = audienceOptions.find(ao => ao.value === a.value);
      return `${a.priority}: ${audienceObj.label}`;
    }).join(', ');

    const goalsText = goals.map(g => {
      const goalObj = goalOptions.find(go => go.value === g.value);
      return `${g.priority}: ${goalObj.label}`;
    }).join(', ');

    const existingPlatformNames = existingPlatforms.map(ep => 
      platforms.find(p => p.value === ep)?.label
    ).join(', ');

    const prompt = `You are a digital strategy expert for an advocacy communications agency called RALLY. A colleague is working with a client and needs platform recommendations.

CLIENT CONTEXT:
- Quick Notes: ${quickNotes || 'None provided'}
- Target Audiences: ${audiencesText}
- Goals: ${goalsText}
- Existing Platforms: ${existingPlatformNames || 'None yet'}
- Budget: ${budgetOptions.find(b => b.value === budget)?.label}
- Content Capacity: ${capacityOptions.find(c => c.value === capacity)?.label}
- Timeline: ${timelineOptions.find(t => t.value === timeline)?.label}

AVAILABLE PLATFORMS TO RECOMMEND:
${platforms.map(p => `- ${p.label}`).join('\n')}

Please provide 3-5 platform recommendations ranked by priority. For each recommendation, provide:
1. Platform name
2. Priority rank (1 = highest priority)
3. Brief rationale (2-3 sentences explaining why this platform fits the audiences and goals)
4. Tactical details including:
   - Recommended content types
   - Posting frequency / campaign approach
   - Quick wins (what they can do immediately)
   - Common mistakes to avoid
   - Estimated time investment per week
   - Estimated budget allocation (if paid)

Consider:
- Platform demographics and where these audiences actually spend time
- Which platforms best support the stated goals (prioritize primary goal)
- Budget and capacity constraints
- What platforms they already use (prioritize those if they make sense)
- Industry best practices for advocacy and nonprofit work as of 2025
- The quick notes provided for any client-specific context

Respond with ONLY valid JSON in this exact format (no markdown, no backticks):
{
  "recommendations": [
    {
      "platform": "Platform Name",
      "rank": 1,
      "rationale": "Why this platform is the best fit...",
      "tactics": {
        "contentTypes": ["Type 1", "Type 2"],
        "frequency": "Recommended posting schedule",
        "quickWins": ["Quick win 1", "Quick win 2"],
        "avoidMistakes": ["Mistake 1", "Mistake 2"],
        "timeInvestment": "X hours per week",
        "budgetAllocation": "Budget guidance or N/A for organic"
      }
    }
  ]
}`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [
            { role: "user", content: prompt }
          ]
        })
      });

      const data = await response.json();
      let responseText = data.content[0].text;
      
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      const result = JSON.parse(responseText);
      setRecommendations(result.recommendations);
      setStep(6);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      alert("Sorry, there was an error generating recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateClientEmail = async () => {
    setGeneratingEmail(true);

    const audiencesText = audiences.map(a => {
      const audienceObj = audienceOptions.find(ao => ao.value === a.value);
      return `${a.priority}: ${audienceObj.label}`;
    }).join(', ');

    const goalsText = goals.map(g => {
      const goalObj = goalOptions.find(go => go.value === g.value);
      return `${g.priority}: ${goalObj.label}`;
    }).join(', ');

    const recsText = recommendations.slice(0, 3).map((rec, i) => 
      `${i + 1}. ${rec.platform}: ${rec.rationale}`
    ).join('\n');

    const prompt = `You are writing a professional email from a RALLY team member to a client presenting digital platform recommendations.

CONTEXT:
- Target Audiences: ${audiencesText}
- Goals: ${goalsText}
- Top Recommendations: 
${recsText}

Write a warm, professional email that:
- Opens with a friendly greeting
- Briefly recaps their goals and audience
- Presents the top 3 platform recommendations with brief rationale for each
- Offers to discuss in more detail
- Closes with next steps

Tone: Professional but approachable. Not salesy. Confident but collaborative.
Length: 250-350 words
Format: Ready to copy and paste (include a subject line)

DO NOT use placeholder brackets like [Client Name]. Just write "Hi there," or similar.
DO NOT include fake data or make up specifics not provided.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [
            { role: "user", content: prompt }
          ]
        })
      });

      const data = await response.json();
      setClientEmail(data.content[0].text);
    } catch (error) {
      console.error("Error generating email:", error);
      alert("Sorry, there was an error generating the email. Please try again.");
    } finally {
      setGeneratingEmail(false);
    }
  };

  const exportToDocument = () => {
    const audiencesText = audiences.map(a => {
      const audienceObj = audienceOptions.find(ao => ao.value === a.value);
      return `${a.priority}: ${audienceObj.label}`;
    }).join('\n');

    const goalsText = goals.map(g => {
      const goalObj = goalOptions.find(go => go.value === g.value);
      return `${g.priority}: ${goalObj.label}`;
    }).join('\n');

    let content = `RALLY DIGITAL PLATFORM RECOMMENDATIONS\n`;
    content += `Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n\n`;
    content += `CLIENT CONTEXT\n`;
    content += `${quickNotes ? `Notes: ${quickNotes}\n` : ''}`;
    content += `\nTarget Audiences:\n${audiencesText}\n`;
    content += `\nGoals:\n${goalsText}\n`;
    content += `\nBudget: ${budgetOptions.find(b => b.value === budget)?.label}\n`;
    content += `Content Capacity: ${capacityOptions.find(c => c.value === capacity)?.label}\n`;
    content += `Timeline: ${timelineOptions.find(t => t.value === timeline)?.label}\n\n`;
    content += `---\n\n`;
    
    content += `RECOMMENDATIONS\n\n`;
    recommendations.forEach((rec, i) => {
      content += `${i + 1}. ${rec.platform}\n`;
      content += `${'='.repeat(rec.platform.length + 3)}\n\n`;
      content += `${rec.rationale}\n\n`;
      content += `Content Types: ${rec.tactics.contentTypes.join(', ')}\n`;
      content += `Frequency: ${rec.tactics.frequency}\n`;
      content += `Time Investment: ${rec.tactics.timeInvestment}\n`;
      content += `Budget: ${rec.tactics.budgetAllocation}\n\n`;
      content += `Quick Wins:\n${rec.tactics.quickWins.map(w => `  • ${w}`).join('\n')}\n\n`;
      content += `Common Mistakes to Avoid:\n${rec.tactics.avoidMistakes.map(m => `  • ${m}`).join('\n')}\n\n`;
      content += `---\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RALLY_Platform_Recommendations_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(clientEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      alert('Failed to copy email. Please select and copy manually.');
    }
  };

  const generatePlatformPrompt = async (platformName, index) => {
    setGeneratingPrompt(index);

    const audiencesText = audiences.map(a => {
      const audienceObj = audienceOptions.find(ao => ao.value === a.value);
      return `${a.priority}: ${audienceObj.label} - ${audienceObj.description}`;
    }).join('\n');

    const goalsText = goals.map(g => {
      const goalObj = goalOptions.find(go => go.value === g.value);
      return `${g.priority}: ${goalObj.label} - ${goalObj.description}`;
    }).join('\n');

    const contextPrompt = `I need a detailed digital strategy for ${platformName} based on the following client profile:

CLIENT CONTEXT:
${quickNotes ? `Additional Notes: ${quickNotes}\n` : ''}
Target Audiences:
${audiencesText}

Goals:
${goalsText}

Budget: ${budgetOptions.find(b => b.value === budget)?.label}
Content Creation Capacity: ${capacityOptions.find(c => c.value === capacity)?.label}
Timeline: ${timelineOptions.find(t => t.value === timeline)?.label}

${existingPlatforms.length > 0 ? `Current Platforms: ${existingPlatforms.map(ep => platforms.find(p => p.value === ep)?.label).join(', ')}\n` : ''}
Please provide a comprehensive ${platformName} strategy that includes:

1. Strategic Overview
   - How this platform fits into the overall campaign
   - Key success metrics and KPIs to track
   - Platform-specific opportunities based on the audiences and goals

2. Content Strategy
   - Detailed content calendar framework (what to post when)
   - Specific content ideas tailored to the audiences
   - Content formats that will perform best
   - Voice and tone recommendations

3. Audience Targeting & Growth
   - How to reach and engage each target audience on this platform
   - Organic growth tactics
   - Community management approach
   ${budget !== 'minimal' ? '- Paid targeting recommendations (demographics, interests, behaviors)\n   - Budget allocation suggestions across campaign phases' : ''}

4. Implementation Plan
   - Week-by-week action plan for the first month
   - Tools and resources needed
   - Team roles and responsibilities given the capacity constraints

5. Optimization & Reporting
   - What to test and when
   - How to measure success
   - When and how to pivot based on performance

Please base all recommendations on current best practices for ${platformName} as of 2025, with specific attention to how advocacy organizations and nonprofits can succeed on this platform.`;

    try {
      // For this use case, we just generate the prompt text itself
      // The user will copy and paste it into their own LLM
      setPlatformPrompts(prev => ({
        ...prev,
        [index]: contextPrompt
      }));
    } catch (error) {
      console.error("Error generating prompt:", error);
      alert("Sorry, there was an error generating the prompt. Please try again.");
    } finally {
      setGeneratingPrompt(null);
    }
  };

  const copyPlatformPrompt = async (index) => {
    try {
      await navigator.clipboard.writeText(platformPrompts[index]);
      setCopiedPrompt(index);
      setTimeout(() => setCopiedPrompt(null), 2000);
    } catch (err) {
      alert('Failed to copy prompt. Please select and copy manually.');
    }
  };

  const resetTool = () => {
    if (confirm('Start over? Your current progress will be saved automatically if you want to return to it later.')) {
      setStep(0);
      setQuickNotes('');
      setAudiences([]);
      setGoals([]);
      setExistingPlatforms([]);
      setBudget('');
      setCapacity('');
      setTimeline('');
      setRecommendations([]);
      setExpandedCards({});
      setClientEmail('');
    }
  };

  const canProceed = () => {
        if (step === 0) return true;
    if (step === 1) return audiences.length > 0;
    if (step === 2) return goals.length > 0;
    if (step === 3) return true;
    if (step === 4) return budget !== '' && capacity !== '' && timeline !== '';
    return false;
  };

  const getWhyDisabled = () => {
    if (step === 1 && audiences.length === 0) return 'Select at least one audience to continue';
    if (step === 2 && goals.length === 0) return 'Select at least one goal to continue';
    if (step === 4) {
      if (!budget) return 'Select a budget level to continue';
      if (!capacity) return 'Select content capacity to continue';
      if (!timeline) return 'Select a timeline to continue';
    }
    return '';
  };

  const getAudiencePriorityLabel = (audienceValue) => {
    const aud = audiences.find(a => a.value === audienceValue);
    return aud ? aud.priority : null;
  };

  const getGoalPriorityLabel = (goalValue) => {
    const g = goals.find(go => go.value === goalValue);
    return g ? g.priority : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-[#F4F2ED] p-4 md:p-8">
      {/* Skip to main content link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-black text-white px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full mb-4">
            <Sparkles size={20} aria-hidden="true" />
            <span className="font-semibold">RALLY Digital</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Platform Recommender
          </h1>
          <p className="text-gray-600 text-lg">
            Get smart digital strategy recommendations for your clients
          </p>

          {/* Action Buttons */}
          {step >= 5 && (
            <nav aria-label="Scenario management" className="flex flex-wrap gap-3 justify-center mt-6">
              <button
                onClick={() => setShowLoadModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-[#ECBE01] text-black rounded-lg hover:bg-[#FDD94C] focus:outline-none focus:ring-4 focus:ring-[#ECBE01] transition-all font-medium"
                aria-label="Load a saved scenario"
              >
                <Upload size={18} aria-hidden="true" />
                Load Saved
              </button>
              {step >= 5 && (
                <>
                  <button
                    onClick={() => setShowSaveModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-[#ECBE01] text-black rounded-lg hover:bg-[#FDD94C] focus:outline-none focus:ring-4 focus:ring-[#ECBE01] transition-all font-medium"
                    aria-label="Save current scenario"
                  >
                    <Save size={18} aria-hidden="true" />
                    Save Scenario
                  </button>
                  <button
                    onClick={() => setComparisonMode(!comparisonMode)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-[#ECBE01] text-black rounded-lg hover:bg-[#FDD94C] focus:outline-none focus:ring-4 focus:ring-[#ECBE01] transition-all font-medium"
                    aria-label={comparisonMode ? 'Exit comparison mode' : 'Enter comparison mode'}
                  >
                    <BarChart3 size={18} aria-hidden="true" />
                    {comparisonMode ? 'Exit Comparison' : 'Compare'}
                  </button>
                </>
              )}
            </nav>
          )}
        </header>

        {/* Success Message */}
        {showSuccessMessage && (
          <div 
            role="alert" 
            aria-live="polite"
            className="mb-6 p-4 bg-[#FDD94C] border-2 border-[#ECBE01] rounded-lg flex items-center gap-3 animate-fadeIn"
          >
            <CheckCircle className="text-black flex-shrink-0" size={24} aria-hidden="true" />
            <p className="text-black font-medium">Scenario saved successfully!</p>
          </div>
        )}

        {/* Progress Bar */}
        {step > 0 && step < 6 && (
          <nav aria-label="Progress" className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {[1, 2, 3, 4, 5].map(s => (
                <div key={s} className="flex items-center flex-1">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                      s < step ? 'bg-[#FDD94C]0 text-white' :
                      s === step ? 'bg-black text-white ring-4 ring-[#ECBE01]' :
                      'bg-gray-200 text-gray-500'
                    }`}
                    aria-label={`Step ${s}`}
                    aria-current={s === step ? 'step' : undefined}
                  >
                    {s < step ? <Check size={20} aria-hidden="true" /> : s}
                  </div>
                  {s < 5 && (
                    <div 
                      className={`flex-1 h-1.5 mx-2 transition-all ${
                        s < step ? 'bg-[#FDD94C]0' : 'bg-gray-200'
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs md:text-sm text-gray-600 font-medium px-1">
              <span>Audience</span>
              <span>Goals</span>
              <span>Platforms</span>
              <span>Constraints</span>
              <span>Review</span>
            </div>
          </nav>
        )}

      {/* Main Content */}
        <main id="main-content" className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Step 0: Quick Notes */}
          {step === 0 && (
            <div>
              <div className="mb-8 pb-8 border-b-2 border-gray-200">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Welcome to the Platform Recommender
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
                    This tool helps RALLY staff quickly develop smart digital platform recommendations for clients without needing to consult the digital team for every conversation.
                  </p>
                  
                  <div className="bg-indigo-50 border-l-4 border-indigo-600 p-5 rounded-r-lg mb-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-3">How it works:</h3>
                    <ol className="space-y-2 text-gray-700">
                      <li className="flex gap-3">
                        <span className="font-bold text-indigo-600 flex-shrink-0">1.</span>
                        <span>Answer a few quick questions about your client (5 steps, takes about 3 minutes)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-bold text-indigo-600 flex-shrink-0">2.</span>
                        <span>Get AI-powered platform recommendations ranked by priority</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-bold text-indigo-600 flex-shrink-0">3.</span>
                        <span>Export recommendations or generate a professional client email</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-bold text-indigo-600 flex-shrink-0">4.</span>
                        <span>Optionally generate detailed strategy prompts for specific platforms</span>
                      </li>
                    </ol>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-r-lg mb-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">What you'll get:</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex gap-2">
                        <span className="text-green-600 flex-shrink-0">✓</span>
                        <span>3-5 platform recommendations tailored to the client's audience and goals</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600 flex-shrink-0">✓</span>
                        <span>Tactical guidance (content types, posting frequency, quick wins)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600 flex-shrink-0">✓</span>
                        <span>Time and budget estimates for each platform</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600 flex-shrink-0">✓</span>
                        <span>A professional email draft ready to send to the client</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600 flex-shrink-0">✓</span>
                        <span>Custom prompts for deeper strategy development</span>
                      </li>
                    </ul>
                  </div>

                  <p className="text-sm text-gray-600 italic">
                    Your progress is automatically saved as you go. You can also save complete scenarios to compare different approaches or return to them later.
                  </p>
                </div>
              </div>
          
          )}

          {/* Step 1: Audiences */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Who are the target audiences?
              </h2>
              <p className="text-gray-600 text-lg mb-4">
                Select up to 3 audiences and rank them by importance.
              </p>
              <div 
                className="bg-[#FDD94C] border-2 border-[#FDD94C] rounded-lg p-4 mb-6"
                role="status"
                aria-live="polite"
              >
                <p className="text-sm md:text-base text-black font-medium">
                  Selected: <span className="font-bold">{audiences.length} of 3</span>
                  {audiences.length > 0 && (
                    <span className="block mt-2 text-sm">
                      {audiences.map(a => {
                        const opt = audienceOptions.find(ao => ao.value === a.value);
                        return `${a.priority}: ${opt?.label}`;
                      }).join(' • ')}
                    </span>
                  )}
                </p>
              </div>
              <div className="space-y-4" role="group" aria-label="Audience selection">
                {audienceOptions.map(aud => {
                  const currentPriority = getAudiencePriorityLabel(aud.value);
                  const isSelected = audiences.some(a => a.value === aud.value);
                  
                  return (
                    <div
                      key={aud.value}
                      className={`p-5 rounded-lg border-2 transition-all ${
                        isSelected ? 'border-[#ECBE01] bg-[#FDD94C] shadow-sm' : 'border-gray-300 hover:border-[#ECBE01]'
                      }`}
                    >
                      <div className="font-semibold text-gray-900 text-lg mb-2">{aud.label}</div>
                      <div className="text-sm md:text-base text-gray-600 mb-4">{aud.description}</div>
                      <div className="flex flex-wrap gap-2" role="group" aria-label={`Priority options for ${aud.label}`}>
                        {priorityOptions.map(priority => (
                          <button
                            key={priority}
                            onClick={() => toggleAudience(aud.value, priority)}
                            disabled={!isSelected && audiences.length >= 3}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-[#ECBE01] ${
                              currentPriority === priority
                                ? 'bg-black text-white shadow-sm'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            } ${!isSelected && audiences.length >= 3 ? 'opacity-40 cursor-not-allowed' : ''}`}
                            aria-pressed={currentPriority === priority}
                            aria-label={`Set ${aud.label} as ${priority} priority`}
                          >
                            {priority}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Goals */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                What are the goals?
              </h2>
              <p className="text-gray-600 text-lg mb-4">
                Select up to 3 goals and rank them by importance.
              </p>
              <div 
                className="bg-[#FDD94C] border-2 border-[#FDD94C] rounded-lg p-4 mb-6"
                role="status"
                aria-live="polite"
              >
                <p className="text-sm md:text-base text-black font-medium">
                  Selected: <span className="font-bold">{goals.length} of 3</span>
                  {goals.length > 0 && (
                    <span className="block mt-2 text-sm">
                      {goals.map(g => {
                        const opt = goalOptions.find(go => go.value === g.value);
                        return `${g.priority}: ${opt?.label}`;
                      }).join(' • ')}
                    </span>
                  )}
                </p>
              </div>
              <div className="space-y-4" role="group" aria-label="Goal selection">
                {goalOptions.map(goal => {
                  const currentPriority = getGoalPriorityLabel(goal.value);
                  const isSelected = goals.some(g => g.value === goal.value);
                  
                  return (
                    <div
                      key={goal.value}
                      className={`p-5 rounded-lg border-2 transition-all ${
                        isSelected ? 'border-[#ECBE01] bg-[#FDD94C] shadow-sm' : 'border-gray-300 hover:border-[#ECBE01]'
                      }`}
                    >
                      <div className="font-semibold text-gray-900 text-lg mb-2">{goal.label}</div>
                      <div className="text-sm md:text-base text-gray-600 mb-4">{goal.description}</div>
                      <div className="flex flex-wrap gap-2" role="group" aria-label={`Priority options for ${goal.label}`}>
                        {priorityOptions.map(priority => (
                          <button
                            key={priority}
                            onClick={() => toggleGoal(goal.value, priority)}
                            disabled={!isSelected && goals.length >= 3}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-[#ECBE01] ${
                              currentPriority === priority
                                ? 'bg-black text-white shadow-sm'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            } ${!isSelected && goals.length >= 3 ? 'opacity-40 cursor-not-allowed' : ''}`}
                            aria-pressed={currentPriority === priority}
                            aria-label={`Set ${goal.label} as ${priority} priority`}
                          >
                            {priority}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Existing Platforms */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                What platforms does the client already use?
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Select all that apply. This helps us recommend platforms they're already comfortable with. Skip if starting from scratch.
              </p>
              
              <div className="space-y-8">
                {['website', 'social', 'email', 'paid', 'seo'].map(category => {
                  const categoryPlatforms = platforms.filter(p => p.category === category);
                  const categoryLabel = {
                    website: 'Website',
                    social: 'Social Media',
                    email: 'Email Marketing',
                    paid: 'Paid Advertising',
                    seo: 'Search & SEO'
                  }[category];

                  return (
                    <fieldset key={category}>
                      <legend className="font-bold text-gray-900 text-lg mb-4">{categoryLabel}</legend>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {categoryPlatforms.map(plat => (
                          <button
                            key={plat.value}
                            onClick={() => togglePlatform(plat.value)}
                            className={`text-left p-4 rounded-lg border-2 transition-all focus:outline-none focus:ring-4 focus:ring-[#ECBE01] ${
                              existingPlatforms.includes(plat.value)
                                ? 'border-[#ECBE01] bg-[#FDD94C] shadow-sm'
                                : 'border-gray-300 hover:border-[#ECBE01]'
                            }`}
                            role="checkbox"
                            aria-checked={existingPlatforms.includes(plat.value)}
                            aria-label={plat.label}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                existingPlatforms.includes(plat.value)
                                  ? 'border-[#ECBE01] bg-black'
                                  : 'border-gray-400'
                              }`}>
                                {existingPlatforms.includes(plat.value) && (
                                  <Check size={16} className="text-white" aria-hidden="true" />
                                )}
                              </div>
                              <span className="text-sm md:text-base font-medium text-gray-900">{plat.label}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Constraints */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                What are the constraints?
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Help us understand what's realistic for this client.
              </p>

              <div className="space-y-8">
                <fieldset>
                  <legend className="font-bold text-gray-900 text-lg mb-4">Budget</legend>
                  <div className="space-y-3" role="radiogroup" aria-label="Budget options">
                    {budgetOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setBudget(opt.value)}
                        className={`w-full text-left p-5 rounded-lg border-2 transition-all focus:outline-none focus:ring-4 focus:ring-[#ECBE01] ${
                          budget === opt.value
                            ? 'border-[#ECBE01] bg-[#FDD94C] shadow-sm'
                            : 'border-gray-300 hover:border-[#ECBE01]'
                        }`}
                        role="radio"
                        aria-checked={budget === opt.value}
                      >
                        <div className="font-semibold text-gray-900 text-base md:text-lg">{opt.label}</div>
                        <div className="text-sm md:text-base text-gray-600 mt-1">{opt.description}</div>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="font-bold text-gray-900 text-lg mb-4">Content Creation Capacity</legend>
                  <div className="space-y-3" role="radiogroup" aria-label="Content capacity options">
                    {capacityOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setCapacity(opt.value)}
                        className={`w-full text-left p-5 rounded-lg border-2 transition-all focus:outline-none focus:ring-4 focus:ring-[#ECBE01] ${
                          capacity === opt.value
                            ? 'border-[#ECBE01] bg-[#FDD94C] shadow-sm'
                            : 'border-gray-300 hover:border-[#ECBE01]'
                        }`}
                        role="radio"
                        aria-checked={capacity === opt.value}
                      >
                        <div className="font-semibold text-gray-900 text-base md:text-lg">{opt.label}</div>
                        <div className="text-sm md:text-base text-gray-600 mt-1">{opt.description}</div>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="font-bold text-gray-900 text-lg mb-4">Timeline</legend>
                  <div className="space-y-3" role="radiogroup" aria-label="Timeline options">
                    {timelineOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setTimeline(opt.value)}
                        className={`w-full text-left p-5 rounded-lg border-2 transition-all focus:outline-none focus:ring-4 focus:ring-[#ECBE01] ${
                          timeline === opt.value
                            ? 'border-[#ECBE01] bg-[#FDD94C] shadow-sm'
                            : 'border-gray-300 hover:border-[#ECBE01]'
                        }`}
                        role="radio"
                        aria-checked={timeline === opt.value}
                      >
                        <div className="font-semibold text-gray-900 text-base md:text-lg">{opt.label}</div>
                        <div className="text-sm md:text-base text-gray-600 mt-1">{opt.description}</div>
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>
          )}

          {/* Step 5: Review before generation */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Review & Generate
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Here's what we'll analyze to generate your recommendations:
              </p>

              <div className="space-y-4 mb-8">
                {quickNotes && (
                  <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Quick Notes</h3>
                    <p className="text-gray-700">{quickNotes}</p>
                  </div>
                )}
                
                <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Audiences</h3>
                  <ul className="space-y-2">
                    {audiences.map(a => {
                      const opt = audienceOptions.find(ao => ao.value === a.value);
                      return (
                        <li key={a.value} className="text-gray-700 text-base">
                          <span className="font-semibold">{a.priority}:</span> {opt?.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Goals</h3>
                  <ul className="space-y-2">
                    {goals.map(g => {
                      const opt = goalOptions.find(go => go.value === g.value);
                      return (
                        <li key={g.value} className="text-gray-700 text-base">
                          <span className="font-semibold">{g.priority}:</span> {opt?.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Constraints</h3>
                  <ul className="space-y-2 text-gray-700 text-base">
                    <li><span className="font-semibold">Budget:</span> {budgetOptions.find(b => b.value === budget)?.label}</li>
                    <li><span className="font-semibold">Capacity:</span> {capacityOptions.find(c => c.value === capacity)?.label}</li>
                    <li><span className="font-semibold">Timeline:</span> {timelineOptions.find(t => t.value === timeline)?.label}</li>
                  </ul>
                </div>

                {existingPlatforms.length > 0 && (
                  <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-3 text-lg">Existing Platforms</h3>
                    <p className="text-gray-700 text-base">
                      {existingPlatforms.map(ep => platforms.find(p => p.value === ep)?.label).join(', ')}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={generateRecommendations}
                disabled={loading}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#ECBE01]300 ${
                  loading
                    ? 'bg-gray-200 text-gray-500 cursor-wait'
                    : 'bg-black text-white hover:bg-black shadow-lg hover:shadow-xl'
                }`}
                aria-busy={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="animate-spin">⏳</span>
                    Generating Recommendations...
                  </span>
                ) : (
                  'Generate Recommendations'
                )}
              </button>
            </div>
          )}

          {/* Step 6: Results */}
          {step === 6 && !comparisonMode && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Your Platform Recommendations
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Based on your client's profile, here are our top recommendations:
              </p>

              {/* Recommendations */}
              <div className="space-y-4 mb-8" role="list" aria-label="Platform recommendations">
                {recommendations.map((rec, index) => (
                  <article 
                    key={index} 
                    className="border-2 border-gray-300 rounded-lg overflow-hidden hover:border-[#ECBE01] transition-all"
                    role="listitem"
                  >
                    <div className="p-5 bg-gradient-to-r from-[#FDD94C] to-white">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span 
                              className="bg-black text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-sm"
                              aria-label={`Priority rank ${rec.rank}`}
                            >
                              #{rec.rank}
                            </span>
                            <h3 className="text-xl font-bold text-gray-900">{rec.platform}</h3>
                          </div>
                          <p className="text-gray-700 text-base leading-relaxed">{rec.rationale}</p>
                        </div>
                        <button
                          onClick={() => toggleExpanded(index)}
                          className="flex-shrink-0 p-3 hover:bg-[#FDD94C] rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-[#ECBE01]"
                          aria-expanded={expandedCards[index]}
                          aria-label={expandedCards[index] ? 'Hide details' : 'Show details'}
                        >
                          {expandedCards[index] ? (
                            <ChevronDown className="text-[#ECBE01]" size={24} aria-hidden="true" />
                          ) : (
                            <ChevronRight className="text-[#ECBE01]" size={24} aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>

                    {expandedCards[index] && (
                      <div className="p-5 bg-white border-t-2 border-gray-200">
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-bold text-gray-900 mb-3 text-base">Recommended Content Types</h4>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                              {rec.tactics.contentTypes.map((type, i) => (
                                <li key={i} className="leading-relaxed">{type}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-bold text-gray-900 mb-2 text-base">Posting Frequency</h4>
                            <p className="text-gray-700 leading-relaxed">{rec.tactics.frequency}</p>
                          </div>

                          <div>
                            <h4 className="font-bold text-gray-900 mb-3 text-base">Quick Wins</h4>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                              {rec.tactics.quickWins.map((win, i) => (
                                <li key={i} className="leading-relaxed">{win}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-bold text-gray-900 mb-3 text-base">Common Mistakes to Avoid</h4>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                              {rec.tactics.avoidMistakes.map((mistake, i) => (
                                <li key={i} className="leading-relaxed">{mistake}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t-2 border-gray-200">
                            <div>
                              <h4 className="font-bold text-gray-900 mb-2 text-base">Time Investment</h4>
                              <p className="text-gray-700">{rec.tactics.timeInvestment}</p>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 mb-2 text-base">Budget Allocation</h4>
                              <p className="text-gray-700">{rec.tactics.budgetAllocation}</p>
                            </div>
                          </div>

                          {/* Detailed Strategy Prompt */}
                          <div className="pt-5 border-t-2 border-gray-200">
                            <div className="bg-[#FDD94C] border-2 border-[#ECBE01] rounded-lg p-5">
                              <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                                <Sparkles className="text-black" size={20} aria-hidden="true" />
                                Want More Detail?
                              </h4>
                              <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                                Generate a comprehensive prompt you can paste into ChatGPT, Claude, or any LLM to get a detailed {rec.platform} strategy tailored to this client.
                              </p>
                              
                              {!platformPrompts[index] ? (
                                <button
                                  onClick={() => generatePlatformPrompt(rec.platform, index)}
                                  disabled={generatingPrompt === index}
                                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#ECBE01] text-white rounded-lg font-semibold hover:bg-[#D9AD00] disabled:bg-gray-300 disabled:cursor-wait focus:outline-none focus:ring-4 focus:ring-[#ECBE01] transition-all"
                                  aria-busy={generatingPrompt === index}
                                >
                                  <Sparkles size={18} aria-hidden="true" />
                                  {generatingPrompt === index ? 'Generating Prompt...' : 'Generate Strategy Prompt'}
                                </button>
                              ) : (
                                <div>
                                  <div className="bg-white border-2 border-[#ECBE01] rounded-lg p-4 mb-3 max-h-64 overflow-y-auto">
                                    <pre className="whitespace-pre-wrap text-xs md:text-sm text-gray-800 font-mono leading-relaxed">
                                      {platformPrompts[index]}
                                    </pre>
                                  </div>
                                  <div className="flex gap-3">
                                    <button
                                      onClick={() => copyPlatformPrompt(index)}
                                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#ECBE01] text-white rounded-lg font-semibold hover:bg-[#D9AD00] focus:outline-none focus:ring-4 focus:ring-[#ECBE01] transition-all"
                                      aria-label={`Copy ${rec.platform} strategy prompt`}
                                    >
                                      <Copy size={16} aria-hidden="true" />
                                      {copiedPrompt === index ? 'Copied!' : 'Copy Prompt'}
                                    </button>
                                    <button
                                      onClick={() => setPlatformPrompts(prev => {
                                        const newPrompts = { ...prev };
                                        delete newPrompts[index];
                                        return newPrompts;
                                      })}
                                      className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-all"
                                      aria-label="Regenerate prompt"
                                    >
                                      Regenerate
                                    </button>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-3 text-center">
                                    Copy this prompt and paste it into ChatGPT, Claude, or your preferred LLM for a detailed strategy.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>

              {/* Export & Email Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <button
                  onClick={exportToDocument}
                  className="flex items-center justify-center gap-3 py-4 px-6 bg-black text-white rounded-lg font-bold text-base hover:bg-black focus:outline-none focus:ring-4 focus:ring-[#ECBE01]300 transition-all shadow-md hover:shadow-lg"
                  aria-label="Export recommendations to document"
                >
                  <Download size={20} aria-hidden="true" />
                  Export to Document
                </button>
                <button
                  onClick={generateClientEmail}
                  disabled={generatingEmail}
                  className="flex items-center justify-center gap-3 py-4 px-6 bg-[#ECBE01] text-black rounded-lg font-bold text-base hover:bg-[#D9AD00] focus:outline-none focus:ring-4 focus:ring-[#ECBE01] transition-all shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-wait"
                  aria-busy={generatingEmail}
                  aria-label="Generate client email"
                >
                  <Mail size={20} aria-hidden="true" />
                  {generatingEmail ? 'Generating...' : 'Generate Client Email'}
                </button>
              </div>

              {/* Client Email */}
              {clientEmail && (
                <div className="mb-8 p-5 bg-[#FDD94C] border-2 border-[#ECBE01] rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                      <Mail className="text-black" size={24} aria-hidden="true" />
                      Client Email (Ready to Send)
                    </h3>
                    <button
                      onClick={copyEmailToClipboard}
                      className="flex items-center gap-2 px-4 py-2 bg-[#ECBE01] text-black rounded-lg text-sm font-bold hover:bg-[#D9AD00] focus:outline-none focus:ring-4 focus:ring-[#ECBE01] transition-all"
                      aria-label="Copy email to clipboard"
                    >
                      <Copy size={16} aria-hidden="true" />
                      {copiedEmail ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="bg-white p-5 rounded-lg border-2 border-[#ECBE01]">
                    <pre className="whitespace-pre-wrap text-sm md:text-base text-gray-800 font-sans leading-relaxed">
                      {clientEmail}
                    </pre>
                  </div>
                </div>
              )}

              <button
                onClick={resetTool}
                className="w-full bg-gray-200 text-gray-800 py-4 px-6 rounded-lg font-bold text-base hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-all"
                aria-label="Start new recommendation"
              >
                Start New Recommendation
              </button>
            </div>
          )}

          {/* Comparison Mode */}
          {comparisonMode && step === 6 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Comparison Mode
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Compare up to 3 different scenarios side-by-side.
              </p>

              {comparisonScenarios.length < 3 && (
                <div className="mb-6 p-5 bg-[#FDD94C] border-2 border-[#ECBE01] rounded-lg">
                  <label htmlFor="scenario-name" className="block font-semibold text-gray-900 mb-2">
                    Name this scenario
                  </label>
                  <input
                    id="scenario-name"
                    type="text"
                    value={scenarioName}
                    onChange={(e) => setScenarioName(e.target.value)}
                    placeholder="e.g., High Budget Option"
                    className="w-full p-3 border-2 border-[#ECBE01] rounded-lg mb-3 focus:border-[#ECBE01] focus:outline-none focus:ring-4 focus:ring-[#FDD94C]"
                  />
                  <button
                    onClick={addToComparison}
                    disabled={!scenarioName.trim()}
                    className="w-full py-3 bg-[#ECBE01] text-white rounded-lg font-bold hover:bg-[#D9AD00] disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#ECBE01] transition-all"
                  >
                    Add Current Scenario to Comparison
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {comparisonScenarios.map((scenario) => (
                  <article key={scenario.id} className="p-5 border-2 border-gray-300 rounded-lg bg-white">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">{scenario.name}</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-semibold block mb-1">Audiences:</span>
                        <ul className="ml-4 space-y-1">
                          {scenario.audiences.map(a => (
                            <li key={a.value} className="text-gray-700">
                              {a.priority}: {audienceOptions.find(ao => ao.value === a.value)?.label}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-semibold block mb-1">Goals:</span>
                        <ul className="ml-4 space-y-1">
                          {scenario.goals.map(g => (
                            <li key={g.value} className="text-gray-700">
                              {g.priority}: {goalOptions.find(go => go.value === g.value)?.label}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-semibold">Budget:</span> {scenario.budget}
                      </div>
                      <div>
                        <span className="font-semibold block mb-1">Top Recommendation:</span>
                        <p className="text-gray-700 font-medium">
                          {scenario.recommendations[0]?.platform}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Persistent Quick Notes at bottom of steps 1-5 */}
          {step > 0 && step < 6 && (
            <div className="mb-6 pb-6 border-t-2 border-gray-200 pt-6 mt-8">
              <button
                onClick={() => setShowQuickNotes(!showQuickNotes)}
                className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors font-semibold text-sm"
                aria-expanded={showQuickNotes}
                aria-controls="quick-notes-section"
              >
                <span className="text-lg">📝</span>
                {showQuickNotes ? 'Hide' : 'Add'} Client Notes
              </button>
              {showQuickNotes && (
                <div id="quick-notes-section" className="mt-3">
                  <p className="text-sm text-gray-600 mb-3">
                    {step === 1 && "Add notes about this client's audiences that might be relevant. For example: 'Staff tend to be policy wonks who prefer detailed content' or 'Reaching Gen Z activists who respond to authentic storytelling.'"}
                    {step === 2 && "Add notes about this project's goals that might be relevant. For example: 'Primary goal is immediate donations for emergency response' or 'Building long-term relationships is more important than quick conversions.'"}
                    {step === 3 && "Add notes about their current digital presence. For example: 'Strong Instagram following but minimal engagement' or 'Website is outdated and needs refresh before campaign launch.'"}
                    {step === 4 && "Add notes about constraints or special considerations. For example: 'Budget is flexible if we see early wins' or 'CEO wants to see progress within first 30 days.'"}
                    {step === 5 && "Add any final context before generating recommendations. For example: 'Concerned about bandwidth for social media management' or 'Previous campaign struggled with consistent messaging.'"}
                  </p>
                  <div className="p-4 bg-[#FDD94C] border-2 border-[#ECBE01] rounded-lg">
                    <label htmlFor="persistent-quick-notes" className="block font-semibold text-black mb-2 text-sm">
                      Your notes
                    </label>
                    <textarea
                      id="persistent-quick-notes"
                      value={quickNotes}
                      onChange={(e) => setQuickNotes(e.target.value)}
                      placeholder="Add context here..."
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#ECBE01] focus:outline-none focus:ring-4 focus:ring-[#FDD94C] min-h-24 text-sm transition-all bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          {step >= 0 && step < 6 && (
            <nav aria-label="Navigation" className="flex gap-4">
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3.5 px-6 rounded-lg font-bold hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-all"
                  aria-label="Go back to previous step"
                >
                  Back
                </button>
              )}
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className={`${step === 0 ? 'w-full' : 'flex-1'} py-3.5 px-6 rounded-lg font-bold transition-all focus:outline-none focus:ring-4 ${
                  canProceed()
                    ? 'bg-[#ECBE01] text-black hover:bg-[#D9AD00] focus:ring-[#FDD94C] shadow-md hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                aria-label="Continue to next step"
                aria-disabled={!canProceed()}
                title={!canProceed() ? getWhyDisabled() : ''}
              >
                {step === 0 ? 'Get Started' : 'Next'}
              </button>
            </nav>
          )}

          {!canProceed() && step > 0 && step < 5 && (
            <p className="text-sm text-gray-600 text-center mt-4" role="status" aria-live="polite">
              {getWhyDisabled()}
            </p>
          )}
        </main>

        {/* Save Modal */}
        {showSaveModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-modal-title"
          >
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
              <h3 id="save-modal-title" className="text-xl font-bold text-gray-900 mb-4">Save Scenario</h3>
              <label htmlFor="save-scenario-name" className="block text-sm font-medium text-gray-700 mb-2">
                Scenario Name
              </label>
              <input
                id="save-scenario-name"
                type="text"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                placeholder="e.g., Q1 Campaign Strategy"
                className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4 focus:border-[#ECBE01] focus:outline-none focus:ring-4 focus:ring-[#ECBE01]"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSaveModal(false);
                    setScenarioName('');
                  }}
                  className="flex-1 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={saveScenario}
                  disabled={!scenarioName.trim()}
                  className="flex-1 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#ECBE01]300 transition-all"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Load Modal */}
        {showLoadModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="load-modal-title"
          >
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2">
                <h3 id="load-modal-title" className="text-xl font-bold text-gray-900">Load Saved Scenario</h3>
                <button
                  onClick={() => setShowLoadModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all"
                  aria-label="Close dialog"
                >
                  <X size={20} />
                </button>
              </div>
              
              {savedScenarios.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No saved scenarios yet. Save your first scenario to see it here.</p>
              ) : (
                <div className="space-y-3">
                  {savedScenarios.map(scenario => (
                    <div key={scenario.id} className="p-4 border-2 border-gray-300 rounded-lg hover:border-[#ECBE01] transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-base">{scenario.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Saved {new Date(scenario.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => loadScenario(scenario)}
                            className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-black focus:outline-none focus:ring-4 focus:ring-[#ECBE01]300 transition-all"
                            aria-label={`Load ${scenario.name}`}
                          >
                            Load
                          </button>
                          <button
                            onClick={() => deleteScenario(scenario.id)}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all"
                            aria-label={`Delete ${scenario.name}`}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-8 text-sm text-gray-600">
          <p>Built for RALLY Digital Team • Powered by AI</p>
        </footer>
      </div>
    </div>
  );
}