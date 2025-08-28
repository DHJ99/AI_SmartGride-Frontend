// Compliance framework implementation
import { logSecurityEvent } from '@/utils/securityLogger';
import { generateSecureToken } from '@/utils/encryption';

class ComplianceFramework {
  constructor() {
    this.frameworks = new Map();
    this.assessments = new Map();
    this.policies = new Map();
    this.initializeFrameworks();
  }

  initializeFrameworks() {
    // NERC CIP (North American Electric Reliability Corporation Critical Infrastructure Protection)
    this.frameworks.set('NERC-CIP', {
      name: 'NERC CIP',
      version: 'CIP-013-2',
      description: 'Critical Infrastructure Protection standards for bulk electric system',
      applicability: 'Electric utilities and grid operators',
      requirements: this.getNERCRequirements(),
      assessmentFrequency: 'Annual',
      lastAssessment: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      nextAssessment: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000),
      overallScore: 95,
      status: 'COMPLIANT'
    });

    // ISO 27001
    this.frameworks.set('ISO-27001', {
      name: 'ISO 27001',
      version: '2013',
      description: 'Information security management systems requirements',
      applicability: 'All organizations handling sensitive information',
      requirements: this.getISO27001Requirements(),
      assessmentFrequency: 'Annual',
      lastAssessment: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      nextAssessment: new Date(Date.now() + 245 * 24 * 60 * 60 * 1000),
      overallScore: 92,
      status: 'COMPLIANT'
    });

    // GDPR
    this.frameworks.set('GDPR', {
      name: 'GDPR',
      version: '2018',
      description: 'General Data Protection Regulation',
      applicability: 'Organizations processing EU personal data',
      requirements: this.getGDPRRequirements(),
      assessmentFrequency: 'Continuous',
      lastAssessment: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      nextAssessment: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
      overallScore: 98,
      status: 'COMPLIANT'
    });

    // SOX (Sarbanes-Oxley)
    this.frameworks.set('SOX', {
      name: 'Sarbanes-Oxley Act',
      version: '2002',
      description: 'Financial reporting and corporate governance requirements',
      applicability: 'Public companies and their subsidiaries',
      requirements: this.getSOXRequirements(),
      assessmentFrequency: 'Annual',
      lastAssessment: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      nextAssessment: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000),
      overallScore: 94,
      status: 'COMPLIANT'
    });

    // NIST Cybersecurity Framework
    this.frameworks.set('NIST-CSF', {
      name: 'NIST Cybersecurity Framework',
      version: '1.1',
      description: 'Framework for improving critical infrastructure cybersecurity',
      applicability: 'Critical infrastructure organizations',
      requirements: this.getNISTCSFRequirements(),
      assessmentFrequency: 'Bi-annual',
      lastAssessment: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      nextAssessment: new Date(Date.now() + 185 * 24 * 60 * 60 * 1000),
      overallScore: 89,
      status: 'PARTIALLY_COMPLIANT'
    });
  }

  getNERCRequirements() {
    return {
      'CIP-002-5.1': {
        title: 'BES Cyber System Categorization',
        description: 'Categorization of BES Cyber Systems and their associated BES Cyber Assets',
        status: 'COMPLIANT',
        score: 100,
        evidence: ['Asset inventory', 'Categorization documentation'],
        lastReview: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        findings: []
      },
      'CIP-003-8': {
        title: 'Security Management Controls',
        description: 'Cyber security policies, leadership, and organizational structures',
        status: 'COMPLIANT',
        score: 95,
        evidence: ['Security policies', 'Organizational charts', 'Training records'],
        lastReview: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        findings: ['Minor policy update needed']
      },
      'CIP-004-6': {
        title: 'Personnel & Training',
        description: 'Personnel risk assessments and cyber security training',
        status: 'COMPLIANT',
        score: 98,
        evidence: ['Background check records', 'Training completion certificates'],
        lastReview: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        findings: []
      },
      'CIP-005-5': {
        title: 'Electronic Security Perimeters',
        description: 'Electronic security perimeter identification and protection',
        status: 'COMPLIANT',
        score: 92,
        evidence: ['Network diagrams', 'Firewall configurations', 'Access logs'],
        lastReview: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        findings: ['Firewall rule optimization recommended']
      },
      'CIP-006-6': {
        title: 'Physical Security of BES Cyber Systems',
        description: 'Physical security controls for BES Cyber Systems',
        status: 'COMPLIANT',
        score: 96,
        evidence: ['Physical access logs', 'Security camera footage', 'Badge records'],
        lastReview: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        findings: []
      },
      'CIP-007-6': {
        title: 'System Security Management',
        description: 'System security management for BES Cyber Systems',
        status: 'COMPLIANT',
        score: 94,
        evidence: ['Patch management records', 'Antivirus logs', 'Port scanning results'],
        lastReview: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        findings: ['Patch deployment timeline needs improvement']
      },
      'CIP-008-5': {
        title: 'Incident Reporting and Response Planning',
        description: 'Cyber security incident reporting and response planning',
        status: 'COMPLIANT',
        score: 90,
        evidence: ['Incident response plan', 'Incident reports', 'Response team contact list'],
        lastReview: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
        findings: ['Response plan needs annual update']
      },
      'CIP-009-6': {
        title: 'Recovery Plans for BES Cyber Systems',
        description: 'Recovery plans for the continuation of BES Cyber System operations',
        status: 'COMPLIANT',
        score: 93,
        evidence: ['Recovery procedures', 'Backup verification logs', 'Recovery test results'],
        lastReview: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
        findings: []
      },
      'CIP-010-2': {
        title: 'Configuration Change Management and Vulnerability Assessments',
        description: 'Configuration change management and vulnerability assessments',
        status: 'COMPLIANT',
        score: 97,
        evidence: ['Change management logs', 'Vulnerability scan reports', 'Configuration baselines'],
        lastReview: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        findings: []
      },
      'CIP-011-2': {
        title: 'Information Protection',
        description: 'Information protection measures for BES Cyber System Information',
        status: 'COMPLIANT',
        score: 99,
        evidence: ['Data classification policy', 'Encryption implementation', 'Access control matrix'],
        lastReview: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        findings: []
      },
      'CIP-013-1': {
        title: 'Cyber Security - Supply Chain Risk Management',
        description: 'Supply chain risk management plan for BES Cyber Systems',
        status: 'COMPLIANT',
        score: 91,
        evidence: ['Vendor assessments', 'Supply chain risk plan', 'Vendor contracts'],
        lastReview: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000),
        findings: ['Vendor assessment frequency needs increase']
      }
    };
  }

  getISO27001Requirements() {
    return {
      'A.5': {
        title: 'Information Security Policies',
        description: 'Management direction and support for information security',
        status: 'IMPLEMENTED',
        score: 95,
        evidence: ['Information security policy', 'Management approval records'],
        lastReview: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        findings: []
      },
      'A.6': {
        title: 'Organization of Information Security',
        description: 'Internal organization and mobile devices and teleworking',
        status: 'IMPLEMENTED',
        score: 90,
        evidence: ['Organizational structure', 'Role definitions', 'Mobile device policy'],
        lastReview: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000),
        findings: ['Mobile device policy needs update']
      },
      'A.9': {
        title: 'Access Control',
        description: 'Business requirements, user access management, and system responsibilities',
        status: 'IMPLEMENTED',
        score: 96,
        evidence: ['Access control policy', 'User access reviews', 'Privileged access management'],
        lastReview: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        findings: []
      },
      'A.10': {
        title: 'Cryptography',
        description: 'Cryptographic controls and key management',
        status: 'IMPLEMENTED',
        score: 94,
        evidence: ['Cryptographic policy', 'Key management procedures', 'Encryption implementation'],
        lastReview: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        findings: []
      },
      'A.12': {
        title: 'Operations Security',
        description: 'Operational procedures, malware protection, backup, and logging',
        status: 'IMPLEMENTED',
        score: 89,
        evidence: ['Operational procedures', 'Backup logs', 'Security monitoring logs'],
        lastReview: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        findings: ['Backup testing frequency needs improvement']
      },
      'A.13': {
        title: 'Communications Security',
        description: 'Network security management and information transfer',
        status: 'IMPLEMENTED',
        score: 92,
        evidence: ['Network security controls', 'Data transfer agreements', 'Encryption protocols'],
        lastReview: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        findings: []
      },
      'A.16': {
        title: 'Information Security Incident Management',
        description: 'Management of information security incidents and improvements',
        status: 'IMPLEMENTED',
        score: 93,
        evidence: ['Incident response procedures', 'Incident logs', 'Lessons learned reports'],
        lastReview: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        findings: []
      },
      'A.18': {
        title: 'Compliance',
        description: 'Compliance with legal requirements and information security review',
        status: 'IMPLEMENTED',
        score: 98,
        evidence: ['Legal compliance matrix', 'Audit reports', 'Review schedules'],
        lastReview: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        findings: []
      }
    };
  }

  getGDPRRequirements() {
    return {
      'Art.5': {
        title: 'Principles Relating to Processing of Personal Data',
        description: 'Lawfulness, fairness, transparency, purpose limitation, data minimization',
        status: 'COMPLIANT',
        score: 99,
        evidence: ['Data processing register', 'Privacy notices', 'Consent records'],
        lastReview: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        findings: []
      },
      'Art.13-14': {
        title: 'Information to be Provided to Data Subject',
        description: 'Transparency requirements when collecting personal data',
        status: 'COMPLIANT',
        score: 100,
        evidence: ['Privacy notices', 'Data collection forms', 'Website privacy policy'],
        lastReview: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        findings: []
      },
      'Art.15': {
        title: 'Right of Access by the Data Subject',
        description: 'Data subject access request procedures',
        status: 'COMPLIANT',
        score: 98,
        evidence: ['Access request procedures', 'Response templates', 'Processing logs'],
        lastReview: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        findings: []
      },
      'Art.17': {
        title: 'Right to Erasure (Right to be Forgotten)',
        description: 'Data deletion procedures and technical implementation',
        status: 'COMPLIANT',
        score: 96,
        evidence: ['Deletion procedures', 'Technical deletion capabilities', 'Audit logs'],
        lastReview: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
        findings: []
      },
      'Art.25': {
        title: 'Data Protection by Design and by Default',
        description: 'Privacy-by-design implementation in systems and processes',
        status: 'COMPLIANT',
        score: 97,
        evidence: ['System design documentation', 'Privacy impact assessments', 'Default settings'],
        lastReview: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        findings: []
      },
      'Art.32': {
        title: 'Security of Processing',
        description: 'Technical and organizational security measures',
        status: 'COMPLIANT',
        score: 98,
        evidence: ['Security controls documentation', 'Encryption implementation', 'Access controls'],
        lastReview: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        findings: []
      },
      'Art.33': {
        title: 'Notification of a Personal Data Breach to the Supervisory Authority',
        description: '72-hour breach notification procedures',
        status: 'COMPLIANT',
        score: 94,
        evidence: ['Breach notification procedures', 'Incident response plan', 'Notification templates'],
        lastReview: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
        findings: ['Notification timeline needs optimization']
      },
      'Art.35': {
        title: 'Data Protection Impact Assessment',
        description: 'DPIA procedures for high-risk processing',
        status: 'COMPLIANT',
        score: 92,
        evidence: ['DPIA templates', 'Risk assessment procedures', 'Completed DPIAs'],
        lastReview: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        findings: ['DPIA template needs minor updates']
      }
    };
  }

  getSOXRequirements() {
    return {
      'Section.302': {
        title: 'Corporate Responsibility for Financial Reports',
        description: 'CEO and CFO certification of financial reports',
        status: 'COMPLIANT',
        score: 95,
        evidence: ['Certification documents', 'Review procedures', 'Control assessments'],
        lastReview: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        findings: []
      },
      'Section.404': {
        title: 'Management Assessment of Internal Controls',
        description: 'Internal control over financial reporting assessment',
        status: 'COMPLIANT',
        score: 93,
        evidence: ['Control documentation', 'Testing results', 'Management assessment'],
        lastReview: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        findings: ['Control testing frequency needs increase']
      },
      'Section.409': {
        title: 'Real Time Issuer Disclosures',
        description: 'Rapid disclosure of material changes in financial condition',
        status: 'COMPLIANT',
        score: 96,
        evidence: ['Disclosure procedures', 'Material event logs', 'Filing records'],
        lastReview: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        findings: []
      }
    };
  }

  getNISTCSFRequirements() {
    return {
      'ID': {
        title: 'Identify',
        description: 'Asset management, business environment, governance, risk assessment',
        status: 'IMPLEMENTED',
        score: 90,
        evidence: ['Asset inventory', 'Risk assessments', 'Governance framework'],
        lastReview: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        findings: ['Asset inventory needs updating']
      },
      'PR': {
        title: 'Protect',
        description: 'Identity management, awareness training, data security, protective technology',
        status: 'IMPLEMENTED',
        score: 88,
        evidence: ['Access controls', 'Training records', 'Data protection measures'],
        lastReview: new Date(Date.now() - 170 * 24 * 60 * 60 * 1000),
        findings: ['Training program needs enhancement']
      },
      'DE': {
        title: 'Detect',
        description: 'Anomalies and events, security continuous monitoring, detection processes',
        status: 'IMPLEMENTED',
        score: 92,
        evidence: ['Monitoring systems', 'Detection procedures', 'Event logs'],
        lastReview: new Date(Date.now() - 160 * 24 * 60 * 60 * 1000),
        findings: []
      },
      'RS': {
        title: 'Respond',
        description: 'Response planning, communications, analysis, mitigation, improvements',
        status: 'IMPLEMENTED',
        score: 85,
        evidence: ['Response plans', 'Communication procedures', 'Incident reports'],
        lastReview: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000),
        findings: ['Response plan testing needs improvement']
      },
      'RC': {
        title: 'Recover',
        description: 'Recovery planning, improvements, communications',
        status: 'PARTIALLY_IMPLEMENTED',
        score: 82,
        evidence: ['Recovery procedures', 'Backup systems', 'Recovery testing'],
        lastReview: new Date(Date.now() - 140 * 24 * 60 * 60 * 1000),
        findings: ['Recovery testing frequency insufficient', 'Recovery time objectives need definition']
      }
    };
  }

  // Conduct compliance assessment
  async conductAssessment(frameworkId, assessorId) {
    const framework = this.frameworks.get(frameworkId);
    if (!framework) {
      throw new Error(`Framework ${frameworkId} not found`);
    }

    const assessmentId = generateSecureToken().substring(0, 16);
    const assessment = {
      id: assessmentId,
      frameworkId,
      frameworkName: framework.name,
      assessorId,
      startDate: new Date(),
      status: 'IN_PROGRESS',
      findings: [],
      recommendations: [],
      overallScore: 0,
      requirementScores: {}
    };

    this.assessments.set(assessmentId, assessment);

    logSecurityEvent('compliance_assessment_started', {
      assessmentId,
      frameworkId,
      assessorId
    });

    // Simulate assessment process
    await this.performAssessment(assessment, framework);

    assessment.endDate = new Date();
    assessment.status = 'COMPLETED';
    framework.lastAssessment = new Date();
    framework.overallScore = assessment.overallScore;

    logSecurityEvent('compliance_assessment_completed', {
      assessmentId,
      frameworkId,
      overallScore: assessment.overallScore,
      findingsCount: assessment.findings.length
    });

    return assessment;
  }

  async performAssessment(assessment, framework) {
    const requirements = framework.requirements;
    let totalScore = 0;
    let requirementCount = 0;

    for (const [reqId, requirement] of Object.entries(requirements)) {
      // Simulate requirement assessment
      await new Promise(resolve => setTimeout(resolve, 100));

      // Add some variability to scores
      const variation = (Math.random() - 0.5) * 10; // ±5 points
      const newScore = Math.max(0, Math.min(100, requirement.score + variation));
      
      assessment.requirementScores[reqId] = newScore;
      totalScore += newScore;
      requirementCount++;

      // Generate findings for lower scores
      if (newScore < 90) {
        assessment.findings.push({
          requirementId: reqId,
          requirementTitle: requirement.title,
          severity: newScore < 70 ? 'HIGH' : newScore < 85 ? 'MEDIUM' : 'LOW',
          description: `${requirement.title} scored ${newScore}% - below target threshold`,
          recommendation: this.generateRecommendation(reqId, newScore)
        });
      }
    }

    assessment.overallScore = Math.round(totalScore / requirementCount);

    // Generate overall recommendations
    assessment.recommendations = this.generateOverallRecommendations(assessment);
  }

  generateRecommendation(requirementId, score) {
    const recommendations = {
      'CIP-003-8': 'Update security policies to reflect current threat landscape',
      'CIP-005-5': 'Optimize firewall rules and implement network segmentation',
      'CIP-007-6': 'Improve patch management timeline and automation',
      'CIP-008-5': 'Update incident response plan and conduct tabletop exercises',
      'CIP-013-1': 'Increase vendor assessment frequency and implement continuous monitoring',
      'A.6': 'Update mobile device policy to address remote work requirements',
      'A.12': 'Implement automated backup testing and improve monitoring',
      'Art.33': 'Optimize breach notification timeline and automate where possible',
      'Art.35': 'Update DPIA template to include emerging privacy risks',
      'Section.404': 'Increase control testing frequency and implement continuous monitoring',
      'ID': 'Update asset inventory with automated discovery tools',
      'PR': 'Enhance security awareness training program with phishing simulations',
      'RS': 'Improve incident response plan testing with realistic scenarios',
      'RC': 'Define recovery time objectives and increase testing frequency'
    };

    return recommendations[requirementId] || 'Review and improve implementation based on current best practices';
  }

  generateOverallRecommendations(assessment) {
    const recommendations = [];

    if (assessment.overallScore < 85) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Overall Compliance',
        description: 'Overall compliance score is below target. Immediate attention required.',
        action: 'Develop comprehensive remediation plan with timeline and resource allocation'
      });
    }

    const highFindings = assessment.findings.filter(f => f.severity === 'HIGH');
    if (highFindings.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Critical Findings',
        description: `${highFindings.length} high-severity findings require immediate attention`,
        action: 'Address high-severity findings within 30 days'
      });
    }

    const mediumFindings = assessment.findings.filter(f => f.severity === 'MEDIUM');
    if (mediumFindings.length > 3) {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'Process Improvement',
        description: 'Multiple medium-severity findings indicate systematic issues',
        action: 'Review and improve compliance processes and controls'
      });
    }

    return recommendations;
  }

  // Generate compliance report
  generateComplianceReport(frameworkId = null) {
    const frameworks = frameworkId ? 
      [this.frameworks.get(frameworkId)] : 
      Array.from(this.frameworks.values());

    const report = {
      id: generateSecureToken().substring(0, 16),
      generatedAt: new Date(),
      frameworks: frameworks.map(framework => ({
        id: framework.name,
        name: framework.name,
        version: framework.version,
        overallScore: framework.overallScore,
        status: framework.status,
        lastAssessment: framework.lastAssessment,
        nextAssessment: framework.nextAssessment,
        requirementCount: Object.keys(framework.requirements).length,
        compliantRequirements: Object.values(framework.requirements)
          .filter(req => req.status === 'COMPLIANT' || req.status === 'IMPLEMENTED').length,
        findings: Object.values(framework.requirements)
          .flatMap(req => req.findings || [])
      })),
      summary: {
        totalFrameworks: frameworks.length,
        averageScore: Math.round(
          frameworks.reduce((sum, fw) => sum + fw.overallScore, 0) / frameworks.length
        ),
        compliantFrameworks: frameworks.filter(fw => fw.status === 'COMPLIANT').length,
        totalFindings: frameworks.reduce((sum, fw) => 
          sum + Object.values(fw.requirements).flatMap(req => req.findings || []).length, 0
        )
      }
    };

    logSecurityEvent('compliance_report_generated', {
      reportId: report.id,
      frameworksIncluded: frameworks.length,
      averageScore: report.summary.averageScore
    });

    return report;
  }

  // Get compliance dashboard data
  getComplianceDashboard() {
    const frameworks = Array.from(this.frameworks.values());
    
    return {
      overview: {
        totalFrameworks: frameworks.length,
        averageScore: Math.round(
          frameworks.reduce((sum, fw) => sum + fw.overallScore, 0) / frameworks.length
        ),
        compliantFrameworks: frameworks.filter(fw => fw.status === 'COMPLIANT').length,
        upcomingAssessments: frameworks.filter(fw => 
          fw.nextAssessment && fw.nextAssessment <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        ).length
      },
      frameworks: frameworks.map(fw => ({
        id: fw.name,
        name: fw.name,
        score: fw.overallScore,
        status: fw.status,
        lastAssessment: fw.lastAssessment,
        nextAssessment: fw.nextAssessment,
        trend: this.calculateTrend(fw.name) // Mock trend calculation
      })),
      recentAssessments: Array.from(this.assessments.values())
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        .slice(0, 5),
      upcomingDeadlines: frameworks
        .filter(fw => fw.nextAssessment)
        .sort((a, b) => new Date(a.nextAssessment) - new Date(b.nextAssessment))
        .slice(0, 5)
        .map(fw => ({
          framework: fw.name,
          deadline: fw.nextAssessment,
          daysRemaining: Math.ceil((fw.nextAssessment - new Date()) / (24 * 60 * 60 * 1000))
        }))
    };
  }

  calculateTrend(frameworkName) {
    // Mock trend calculation - in real implementation, compare with historical data
    const trends = ['up', 'down', 'stable'];
    return trends[Math.floor(Math.random() * trends.length)];
  }

  // Get specific framework details
  getFrameworkDetails(frameworkId) {
    const framework = this.frameworks.get(frameworkId);
    if (!framework) {
      throw new Error(`Framework ${frameworkId} not found`);
    }

    return {
      ...framework,
      assessmentHistory: Array.from(this.assessments.values())
        .filter(assessment => assessment.frameworkId === frameworkId)
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    };
  }
}

export const complianceFramework = new ComplianceFramework();