'use client';

import { useState, useEffect, useRef } from 'react';
import { careers } from '@/lib/careers-data';
import { ChatMessage } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Sidebar from '@/components/shared/sidebar';
import { Send, Compass, Bot, User } from 'lucide-react';

const WELCOME_MESSAGE =
  "Hey! I'm your Nexus career coach. I know about 50+ careers, AI trends, and I can help you think through what fits YOU — not what your parents want, not what’s trending. Ask me anything.";

const QUICK_PROMPTS = [
  'Is computer science right for me?',
  'My parents want NEET but I hate bio',
  "What careers won't be replaced by AI?",
  'I love both art and technology',
];

function generateResponse(input: string): string {
  const lower = input.toLowerCase();

  // Check if user mentions a specific career
  const matchedCareer = careers.find(
    (c) =>
      lower.includes(c.name.toLowerCase()) ||
      c.name
        .toLowerCase()
        .split(/\s+/)
        .some((word) => word.length > 3 && lower.includes(word))
  );

  if (matchedCareer) {
    const riskLabel =
      matchedCareer.ai_risk_score < 30
        ? 'low'
        : matchedCareer.ai_risk_score <= 50
          ? 'moderate'
          : 'high';
    return `Great question about **${matchedCareer.name}**! Here's what I know:

**What it is:** ${matchedCareer.description}

**Key skills:** ${matchedCareer.skills.join(', ')}

**Education:** ${matchedCareer.education_path}

**Salary range:** ₹${(matchedCareer.salary_range.min / 100000).toFixed(1)}L - ₹${(matchedCareer.salary_range.max / 100000).toFixed(1)}L per year

**AI Risk:** ${matchedCareer.ai_risk_score}% (${riskLabel}) — Growth trend is ${matchedCareer.growth_trend}.

**A typical day:** ${matchedCareer.day_in_life}

Would you like to explore how this career aligns with your identity profile? Or compare it with another career?`;
  }

  if (lower.includes('parent') || lower.includes('family') || lower.includes('mom') || lower.includes('dad')) {
    return `Family conversations about careers can be tough. Here’s the thing — your parents’ concerns usually come from love and worry about financial security. And your feelings about what excites you are equally valid.

Instead of a head-on disagreement, try this:
1. **Acknowledge their concern** — "I understand you want me to be financially secure"
2. **Show research** — share real salary data and growth trends (I can help with that!)
3. **Propose a test** — "Let me explore this for 3 months and show you what I learn"

What specific career are your parents pushing for? And what are YOU drawn to? Let me help bridge that gap with real data.`;
  }

  if (lower.includes('confused') || lower.includes("don't know") || lower.includes('not sure') || lower.includes('no idea')) {
    return `Being confused is actually a great starting point — it means you haven’t settled for the default. Most students who "know" what they want are just repeating what others told them.

Let me help you think through this:
- **What activities make you lose track of time?** (That’s a clue to your natural flow)
- **When you help friends, what do they come to you for?** (That reveals your strengths)
- **What problems in the world bother you the most?** (That shows your values)

Try answering even one of these, and I’ll help connect it to career paths you might not have considered. There’s no rush — career clarity is a process, not a moment.`;
  }

  if (lower.includes('ai') || lower.includes('future') || lower.includes('replace') || lower.includes('automat')) {
    return `Smart question about AI and the future of work! Here’s what the data tells us:

**Careers with LOW AI risk (<20%):** Clinical Psychologist, Social Worker, Entrepreneur, Robotics Engineer, Sports Coach, Human Rights Lawyer — these need deep human connection, physical presence, or creative judgment.

**Careers with MODERATE risk (20-40%):** Data Scientist, UX Designer, Lawyer, Digital Marketer — AI will change HOW you do these jobs, but humans will still be essential.

**Careers with HIGHER risk (>40%):** Data Analyst, Graphic Designer, Translator, Pharmacist — routine parts will be automated, but those who adapt and focus on human skills will thrive.

The key insight: **it’s not about picking a "safe" career. It’s about building skills that are hard to automate** — creativity, empathy, complex problem-solving, and leadership.

Want me to analyze the AI risk for a specific career you’re interested in?`;
  }

  if (lower.includes('science') || lower.includes('engineering') || lower.includes('iit') || lower.includes('jee')) {
    return `Engineering and science are popular paths in India, but let’s dig deeper into what fits YOU.

There’s a big difference between:
- **Loving science** (curiosity, experiments, research) → Research Scientist, Biotech, Environmental Science
- **Loving math and logic** (puzzles, problem-solving) → CS, Data Science, AI/ML
- **Loving building things** (hands-on, practical) → Mechanical, Civil, Robotics Engineering
- **Being told to do engineering** (pressure, not passion) → Let’s explore alternatives!

Which of these resonates with you? I can suggest specific careers that match your actual interests rather than just the broad "engineering" label.`;
  }

  if (lower.includes('art') || lower.includes('creative') || lower.includes('design') || lower.includes('draw')) {
    return `Creative careers are thriving in India right now! The "arts don’t pay" myth is outdated.

Here are some creative careers with strong growth:
- **UX/UI Design** — ₹5-25L/year, every tech company needs designers
- **Content Creator** — unlimited earning potential with the right audience
- **Architecture** — stable, respected, combines art + engineering
- **Film/Animation** — India’s entertainment industry is booming
- **Fashion Design** — NIFT/NID graduates do very well

The key is: creative skills + business understanding = unstoppable. Which creative area excites you most?`;
  }

  // Default: encouraging exploration
  const prompts = [
    `That’s an interesting thought! Let me ask you this — when you imagine yourself 10 years from now, what does your ideal day look like? Not the title or salary, but the actual activities. Are you talking to people, solving problems, creating things, or leading teams?

This simple exercise can reveal more about your ideal career than any aptitude test. Tell me what you imagine, and I’ll help connect it to real career paths.`,
    `Here’s a powerful way to think about careers: instead of asking "what should I become?", ask "what problems do I want to solve?"

Every career is ultimately about solving problems:
- Doctors solve health problems
- Engineers solve technical problems
- Designers solve experience problems
- Entrepreneurs solve market problems

What kind of problems interest you the most? Let’s explore from there!`,
    `You know what most career advice gets wrong? It focuses on the destination instead of the journey. The best careers aren’t chosen — they’re discovered through exploration.

I’d love to help you explore. Try telling me:
- A subject you enjoy (even if it’s not "practical")
- Something you’re naturally good at
- A career you’ve been curious about

And I’ll help you connect the dots!`,
  ];

  return prompts[Math.floor(Math.random() * prompts.length)];
}

export default function CoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('nexus_coach_history');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch {}
    setMessages([
      { role: 'assistant', content: WELCOME_MESSAGE, timestamp: new Date().toISOString() },
    ]);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('nexus_coach_history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  async function handleSend(text?: string) {
    const msg = (text || input).trim();
    if (!msg) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: msg,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const identity = (() => { try { const raw = localStorage.getItem('nexus_identity'); return raw ? JSON.parse(raw) : null; } catch { return null; } })();
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          identity,
        }),
      });
      const data = await res.json();
      const response = data.response || data.error || generateResponse(msg);
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Fallback to mock if API fails
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: generateResponse(msg),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function renderMarkdown(text: string) {
    // Simple markdown: bold and line breaks
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="text-foreground font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      // Handle line breaks
      return part.split('\n').map((line, j) => (
        <span key={`${i}-${j}`}>
          {j > 0 && <br />}
          {line}
        </span>
      ));
    });
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="shrink-0 border-b border-border bg-card">
          <div className="mx-auto max-w-3xl px-4 py-3 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Compass className="size-4 text-primary" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-foreground">Career Coach</h1>
                <p className="text-xs text-muted-foreground">Ask about any career path</p>
              </div>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-6 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="shrink-0 size-7 rounded-full bg-card border border-border flex items-center justify-center mt-1">
                    <Bot className="size-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary/10 text-foreground rounded-br-md'
                      : 'bg-card border border-border text-muted-foreground rounded-bl-md'
                  }`}
                >
                  {renderMarkdown(msg.content)}
                </div>
                {msg.role === 'user' && (
                  <div className="shrink-0 size-7 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                    <User className="size-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="shrink-0 size-7 rounded-full bg-card border border-border flex items-center justify-center mt-1">
                  <Bot className="size-4 text-primary" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="size-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="size-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="size-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick prompts + Input */}
        <div className="shrink-0 border-t border-border bg-card">
          {messages.length <= 1 && (
            <div className="mx-auto max-w-3xl px-4 pt-3">
              <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="px-3 py-1.5 rounded-full text-xs border border-border bg-muted text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="mx-auto max-w-3xl px-4 py-3 pb-20 md:pb-3">
            <div className="flex gap-2 items-end">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about any career, share your thoughts..."
                className="flex-1 min-h-[44px] max-h-32 resize-none bg-muted border-border text-foreground placeholder:text-muted-foreground"
                rows={1}
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 w-11 p-0 shrink-0"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
