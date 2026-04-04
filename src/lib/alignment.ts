// Calculate alignment between parent expectations and student identity/interests

interface AlignmentResult {
  score: number; // 0-100
  aligned: string[]; // areas of alignment
  gaps: string[]; // areas of misalignment
  suggestions: string[]; // conversation starters
}

export function calculateAlignment(): AlignmentResult {
  // Read from localStorage
  const onboarding = JSON.parse(localStorage.getItem('nexus_onboarding') || '{}');
  const identity = JSON.parse(localStorage.getItem('nexus_identity') || '{}');
  const hypotheses = JSON.parse(localStorage.getItem('career_hypotheses') || '[]');

  const parentExpectations = onboarding.parentExpectations || [];
  const interests = onboarding.interests || [];

  let score = 50; // base score
  const aligned: string[] = [];
  const gaps: string[] = [];
  const suggestions: string[] = [];

  // Check if parent expectations align with student's identity dimensions

  // Engineering expectation
  if (parentExpectations.includes('Engineering')) {
    if (identity.analytical > 60 || identity.practical > 60) {
      score += 10;
      aligned.push('Your child has strong analytical/practical skills that align with engineering');
    } else if (identity.creative > 70) {
      score -= 10;
      gaps.push('Your child has a strong creative drive — consider design or creative tech instead of traditional engineering');
      suggestions.push('Ask: "What if you could combine technology with creativity? Would that interest you?"');
    }
  }

  // Medicine expectation
  if (parentExpectations.includes('Medicine')) {
    if (identity.caring > 60 && identity.analytical > 50) {
      score += 10;
      aligned.push('Your child genuinely cares about helping others and has analytical ability');
    } else {
      score -= 5;
      gaps.push('Medicine requires both caring and analytical traits — your child may have different strengths');
      suggestions.push('Explore: Healthcare has many paths beyond MBBS — psychology, physiotherapy, public health');
    }
  }

  // CA/Commerce expectation
  if (parentExpectations.includes('CA/Commerce') || parentExpectations.includes('CA')) {
    if (identity.analytical > 60) {
      score += 10;
      aligned.push('Your child has the analytical mindset suited for commerce and finance');
    } else if (identity.entrepreneurial > 60) {
      score += 5;
      aligned.push('Your child has entrepreneurial drive that could channel well through business studies');
    }
  }

  // Government job expectation
  if (parentExpectations.includes('Government Job')) {
    if (identity.caring > 60 && identity.social > 50) {
      score += 5;
      aligned.push('Your child values public service and social impact');
    } else {
      gaps.push('Government jobs offer stability but may not match your child\'s creative or entrepreneurial drive');
      suggestions.push('Discuss: What aspects of government work appeal to you — the stability, the impact, or the respect?');
    }
  }

  // "They support whatever I choose" — high alignment
  if (parentExpectations.includes('They support whatever I choose')) {
    score += 15;
    aligned.push('Your child feels supported in making their own career choices — this is wonderful');
  }

  // "Not Sure" — neutral
  if (parentExpectations.includes('Not Sure')) {
    suggestions.push('It\'s okay to not have expectations yet. Use Nexus together to explore possibilities.');
  }

  // Check if student's interests align with parent expectations
  if (interests.includes('technology') && (parentExpectations.includes('Engineering') || parentExpectations.includes('CA/Commerce'))) {
    score += 5;
    aligned.push('Both agree that technology/analytical fields are interesting');
  }

  if (interests.includes('art_design') && !parentExpectations.some((e: string) => ['Engineering', 'Medicine', 'CA/Commerce', 'Government Job'].includes(e))) {
    score += 5;
  } else if (interests.includes('art_design') && parentExpectations.includes('Engineering')) {
    gaps.push('Your child is drawn to art & design, but the expectation is engineering — consider creative engineering fields like UX, game dev, or architecture');
  }

  // Career hypotheses alignment
  const careerNames = hypotheses.map((h: { career_name?: string; name?: string }) => (h.career_name || h.name || '').toLowerCase());
  const technicalCareers = careerNames.filter((n: string) => ['data scientist', 'ai/ml engineer', 'devops engineer', 'cybersecurity analyst', 'mechanical engineer', 'civil engineer', 'robotics engineer'].includes(n));
  const creativeCareers = careerNames.filter((n: string) => ['ux designer', 'graphic designer', 'film director', 'animator', 'fashion designer', 'content creator', 'musician'].includes(n));

  if (technicalCareers.length > 0 && parentExpectations.includes('Engineering')) {
    score += 5;
    aligned.push('Your child is actively exploring technical careers that align with your expectations');
  }

  if (creativeCareers.length > 0 && parentExpectations.includes('Engineering')) {
    gaps.push(`Your child is exploring creative careers (${creativeCareers.join(', ')}) — these are growing fields in India with strong earning potential`);
  }

  // Clamp score
  score = Math.max(20, Math.min(95, score));

  // Add default suggestions if few
  if (suggestions.length === 0) {
    suggestions.push('Have an open conversation about what success means to each of you');
    suggestions.push('Explore 3 careers together on Nexus and discuss what appeals to each of you');
  }

  if (aligned.length === 0) {
    aligned.push('You both want the best for your child\'s future');
  }

  if (gaps.length === 0) {
    gaps.push('Keep communicating openly — alignment is an ongoing process');
  }

  return { score, aligned, gaps, suggestions };
}
