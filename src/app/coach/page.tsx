'use client';

import { useState, useEffect, useRef } from 'react';
import { careers } from '@/lib/careers-data';
import { ChatMessage } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Sidebar from '@/components/shared/sidebar';
import { Send, Compass, Bot, User } from 'lucide-react';

const WELCOME_MESSAGE =
  "Hey! I'm your Nexus career co-pilot. I know about 50+ careers, AI trends, and I can help you think through what fits YOU \u2014 not what your parents want, not what\u2019s trending. Ask me anything.";

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
    return `\u{1f9ed} Great question about **${matchedCareer.name}**! Here's what I know:

**What it is:** ${matchedCareer.description}

**Key skills:** ${matchedCareer.skills.join(', ')}

**Education:** ${matchedCareer.education_path}

**Salary range:** \u20b9${(matchedCareer.salary_range.min / 100000).toFixed(1)}L - \u20b9${(matchedCareer.salary_range.max / 100000).toFixed(1)}L per year

**AI Risk:** ${matchedCareer.ai_risk_score}% (${riskLabel}) \u2014 Growth trend is ${matchedCareer.growth_trend}.

**A typical day:** ${matchedCareer.day_in_life}

Would you like to explore how this career aligns with your identity profile? Or compare it with another career?`;
  }

  if (lower.includes('parent') || lower.includes('family') || lower.includes('mom') || lower.includes('dad')) {
    return `\u{1f9ed} Family conversations about careers can be tough. Here\u2019s the thing \u2014 your parents\u2019 concerns usually come from love and worry about financial security. And your feelings about what excites you are equally valid.

Instead of a head-on disagreement, try this:
1. **Acknowledge their concern** \u2014 "I understand you want me to be financially secure"
2. **Show research** \u2014 share real salary data and growth trends (I can help with that!)
3. **Propose a test** \u2014 "Let me explore this for 3 months and show you what I learn"

What specific career are your parents pushing for? And what are YOU drawn to? Let me help bridge that gap with real data.`;
  }

  if (lower.includes('confused') || lower.includes("don't know") || lower.includes('not sure') || lower.includes('no idea')) {
    return `\u{1f9ed} Being confused is actually a great starting point \u2014 it means you haven\u2019t settled for the default. Most students who "know" what they want are just repeating what others told them.

Let me help you think through this:
- **What activities make you lose track of time?** (That\u2019s a clue to your natural flow)
- **When you help friends, what do they come to you for?** (That reveals your strengths)
- **What problems in the world bother you the most?** (That shows your values)

Try answering even one of these, and I\u2019ll help connect it to career paths you might not have considered. There\u2019s no rush \u2014 career clarity is a process, not a moment.`;
  }

  if (lower.includes('ai') || lower.includes('future') || lower.includes('replace') || lower.includes('automat')) {
    return `\u{1f9ed} Smart question about AI and the future of work! Here\u2019s what the data tells us:

**Careers with LOW AI risk (<20%):** Clinical Psychologist, Social Worker, Entrepreneur, Robotics Engineer, Sports Coach, Human Rights Lawyer \u2014 these need deep human connection, physical presence, or creative judgment.

**Careers with MODERATE risk (20-40%):** Data Scientist, UX Designer, Lawyer, Digital Marketer \u2014 AI will change HOW you do these jobs, but humans will still be essential.

**Careers with HIGHER risk (>40%):** Data Analyst, Graphic Designer, Translator, Pharmacist \u2014 routine parts will be automated, but those who adapt and focus on human skills will thrive.

The key insight: **it\u2019s not about picking an "AI-proof" career. It\u2019s about building skills that are hard to automate** \u2014 creativity, empathy, complex problem-solving, and leadership.

Want me to analyze the AI risk for a specific career you\u2019re interested in?`;
  }

  if (lower.includes('science') || lower.includes('engineering') || lower.includes('iit') || lower.includes('jee')) {
    return `\u{1f9ed} Engineering and science are popular paths in India, but let\u2019s dig deeper into what fits YOU.

There\u2019s a big difference between:
- **Loving science** (curiosity, experiments, research) \u2192 Research Scientist, Biotech, Environmental Science
- **Loving math and logic** (puzzles, problem-solving) \u2192 CS, Data Science, AI/ML
- **Loving building things** (hands-on, practical) \u2192 Mechanical, Civil, Robotics Engineering
- **Being told to do engineering** (pressure, not passion) \u2192 Let\u2019s explore alternatives!

Which of these resonates with you? I can suggest specific careers that match your actual interests rather than just the broad "engineering" label.`;
  }

  if (lower.includes('art') || lower.includes('creative') || lower.includes('design') || lower.includes('draw')) {
    return `\u{1f9ed} Creative careers are thriving in India right now! The "arts don\u2019t pay" myth is outdated.

Here are some creative careers with strong growth:
- **UX/UI Design** \u2014 \u20b95-25L/year, every tech company needs designers
- **Content Creator** \u2014 unlimited earning potential with the right audience
- **Architecture** \u2014 stable, respected, combines art + engineering
- **Film/Animation** \u2014 India\u2019s entertainment industry is booming
- **Fashion Design** \u2014 NIFT/NID graduates do very well

The key is: creative skills + business understanding = unstoppable. Which creative area excites you most?`;
  }

  // Default: encouraging exploration
  const prompts = [
    `\u{1f9ed} That\u2019s an interesting thought! Let me ask you this \u2014 when you imagine yourself 10 years from now, what does your ideal day look like? Not the title or salary, but the actual activities. Are you talking to people, solving problems, creating things, or leading teams?

This simple exercise can reveal more about your ideal career than any aptitude test. Tell me what you imagine, and I\u2019ll help connect it to real career paths.`,
    `\u{1f9ed} Here\u2019s a powerful way to think about careers: instead of asking "what should I become?", ask "what problems do I want to solve?"

Every career is ultimately about solving problems:
- Doctors solve health problems
- Engineers solve technical problems
- Designers solve experience problems
- Entrepreneurs solve market problems

What kind of problems interest you the most? Let\u2019s explore from there!`,
    `\u{1f9ed} You know what most career advice gets wrong? It focuses on the destination instead of the journey. The best careers aren\u2019t chosen \u2014 they\u2019re discovered through exploration.

I\u2019d love to help you explore. Try telling me:
- A subject you enjoy (even if it\u2019s not "practical")
- Something you\u2019re naturally good at
- A career you\u2019ve been curious about

And I\u2019ll help you connect the dots!`,
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
          <strong key={i} className="text-zinc-100 font-semibold">
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
    <div className="flex h-screen bg-black text-white">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
      {/* Header */}
      <header className="shrink-0 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-lg">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-indigo-600/20 flex items-center justify-center">
              <Compass className="size-4 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-sm font-semibold">Nexus Career Coach</h1>
              <p className="text-xs text-zinc-500">AI-powered career guidance</p>
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
                <div className="shrink-0 size-7 rounded-full bg-zinc-800 flex items-center justify-center mt-1">
                  <Bot className="size-4 text-indigo-400" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-md'
                    : 'bg-zinc-800/80 text-zinc-300 rounded-bl-md'
                }`}
              >
                {renderMarkdown(msg.content)}
              </div>
              {msg.role === 'user' && (
                <div className="shrink-0 size-7 rounded-full bg-indigo-600/20 flex items-center justify-center mt-1">
                  <User className="size-4 text-indigo-400" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="shrink-0 size-7 rounded-full bg-zinc-800 flex items-center justify-center mt-1">
                <Bot className="size-4 text-indigo-400" />
              </div>
              <div className="bg-zinc-800/80 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="size-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="size-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="size-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick prompts + Input */}
      <div className="shrink-0 border-t border-zinc-800 bg-zinc-950">
        {messages.length <= 1 && (
          <div className="mx-auto max-w-3xl px-4 pt-3">
            <p className="text-xs text-zinc-500 mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="px-3 py-1.5 rounded-full text-xs bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 transition-colors"
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
              className="flex-1 min-h-[44px] max-h-32 resize-none bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500"
              rows={1}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 w-11 p-0 shrink-0"
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
