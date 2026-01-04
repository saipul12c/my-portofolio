// src/data/plannedVersions.js
const PLANNED_VERSIONS = [
  {
    version: "v1.30.0",
    status: "PLANNED",
    date: "Coming Soon",
    type: "Minor",
    description: "Transformative streaming experience with real-time community integration, low-latency delivery, and comprehensive creator tools.",
    color: "bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-purple-600/10 border-purple-500/30",
    textColor: "text-purple-300",
    iconColor: "text-purple-300",
    details: [
      "Dedicated streaming hub with intelligent channel categorization and personalized recommendations",
      "Ultra-low latency WebRTC delivery (<500ms) with automatic fallback to HLS/LL-HLS",
      "Real-time collaborative features: synchronized viewing parties and watch-along experiences",
      "Advanced chat system with sentiment analysis, spam filtering, and AI-powered moderation",
      "Interactive overlay system supporting custom widgets, alerts, and third-party integrations",
      "Comprehensive analytics dashboard with viewer engagement heatmaps and retention metrics",
      "Multi-platform simulcasting support (YouTube, Twitch, Facebook) with unified chat aggregation",
      "Clip creation with AI-assisted highlights detection and automatic transcription",
      "Monetization framework for subscriptions, donations, and pay-per-view events",
      "Advanced accessibility: real-time live captioning with multi-language support",
      "Creator studio with scene composition, source switching, and broadcast presets",
      "Distributed edge network for global low-latency delivery and DDoS protection"
    ],
    author: "Streaming Infrastructure & Community Experience Team",
    estimatedReadTime: "18 minutes",
    tags: ["streaming", "real-time", "webrtc", "analytics", "monetization", "accessibility", "global-cdn"],
    changelog: [
      { date: "Coming Soon", version: "v1.30.0-alpha1", type: "alpha", changes: "Core streaming engine with WebRTC support and basic chat functionality" },
      { date: "Coming Soon", version: "v1.30.0-alpha2", type: "alpha", changes: "Moderator tools suite and clip creation pipeline with watermarking" },
      { date: "Coming Soon", version: "v1.30.0-beta1", type: "beta", changes: "Analytics dashboard, multi-language captions, and accessibility audit" },
      { date: "Coming Soon", version: "v1.30.0-rc", type: "rc", changes: "Production readiness with load testing and security penetration testing" }
    ],
    relatedDocs: ["streaming-architecture", "webrtc-implementation", "moderation-guidelines", "analytics-metrics"],
    resources: [
      { type: "architecture", label: "Streaming Infrastructure Diagram", url: "/docs/architecture/streaming" },
      { type: "api", label: "Streaming API Reference", url: "/api/v1/streaming" },
      { type: "monitoring", label: "Live Streaming Dashboard", url: "/monitoring/streaming" },
      { type: "tutorial", label: "Creator Setup Guide", url: "/help/streaming/setup" }
    ],
    compatibility: {
      minRequired: "1.28.0",
      testedUpTo: "1.31.0-beta",
      browserSupport: ["chrome 120+", "firefox 118+", "safari 16.4+", "edge 120+"],
      mobileSupport: ["iOS 16+", "Android 13+ (Chrome)"],
      apiCompatibility: "v4 with backward compatibility to v3",
      sdkSupport: ["JavaScript 2.4+", "React 18+", "Vue 3.3+", "Mobile SDK 1.2+"]
    },
    acceptanceCriteria: [
      "Stream latency under 500ms for 95% of viewers in same region",
      "Chat message delivery under 200ms P99 latency",
      "Concurrent viewer capacity of 100,000+ per stream",
      "99.9% uptime for streaming infrastructure",
      "Automatic failover between regions within 30 seconds",
      "GDPR-compliant data processing for EU viewers",
      "WCAG 2.1 AA compliance for all streaming interfaces"
    ],
    releaseChecklist: [
      "✅ Infrastructure scalability testing (100K concurrent users)",
      "✅ Security audit by third-party penetration testing team",
      "✅ Legal review for copyright and content moderation policies",
      "✅ CDN configuration across 15+ global edge locations",
      "✅ Load testing with 10x expected peak traffic",
      "✅ Disaster recovery plan documented and tested",
      "✅ Compliance documentation for data retention policies"
    ],
    testPlan: {
      smoke: ["Stream creation → encoding → delivery → playback E2E flow"],
      integration: ["Chat system with moderation actions and webhook integrations"],
      performance: ["Load testing with 50K simulated concurrent viewers"],
      security: ["DDoS mitigation testing and encryption validation"],
      accessibility: ["Screen reader compatibility and keyboard navigation"],
      regression: ["Backward compatibility with existing video features"]
    },
    migrationNotes: {
      db: [
        "New collections: streams, stream_analytics, clips, stream_schedules",
        "Index optimization for geo-querying and time-series data",
        "Data migration for existing video content to new streaming schema"
      ],
      api: [
        "Deprecation warning for legacy /api/videos endpoints",
        "New WebSocket endpoints for real-time communication",
        "Rate limiting adjustments for streaming endpoints"
      ],
      rollback: [
        "Maintain v3 API compatibility for 90 days",
        "Feature flag to disable new streaming UI",
        "Database rollback scripts prepared"
      ]
    },
    performanceTargets: {
      firstFrame: "≤800ms on 5G, ≤1.5s on 4G",
      bufferingRatio: "<1% for viewers with >5Mbps connection",
      apiResponseTime: "P95 < 100ms for core endpoints",
      bundleSize: "Streaming module < 180KB gzipped",
      coldStart: "Stream ready in < 3s from creation"
    },
    analyticsEvents: [
      { event: "stream_play", dimensions: ["quality", "device", "region"] },
      { event: "stream_watch_time", metrics: ["seconds", "percentage"] },
      { event: "stream_interaction", actions: ["chat", "reaction", "clip", "share"] },
      { event: "stream_quality_change", data: ["from", "to", "reason"] }
    ],
    securityConsiderations: [
      "End-to-end encryption for all stream data in transit",
      "Content moderation with AI-assisted NSFW detection",
      "Rate limiting per IP and per account for chat messages",
      "DDoS protection with automatic traffic rerouting",
      "Secure token generation for stream access control"
    ],
    accessibilityNotes: [
      "Live captioning with adjustable positioning and styling",
      "Screen reader announcements for stream status changes",
      "Keyboard shortcuts for all player controls",
      "High contrast mode for chat and overlays",
      "Reduced motion options for animated elements"
    ],
    rolloutStrategy: {
      phases: [
        { phase: "internal-alpha", users: "50", duration: "1 week" },
        { phase: "creator-beta", users: "500", duration: "2 weeks" },
        { phase: "gradual-rollout", increase: "5%/day", monitoring: "strict" },
        { phase: "general-availability", target: "100%", date: "Coming Soon" }
      ],
      monitoring: [
        "stream.health (error rates, latency)",
        "user.engagement (watch time, interactions)",
        "infrastructure.cost (CDN, encoding expenses)"
      ],
      rollbackTriggers: [
        "Error rate > 1% for > 10 minutes",
        "Latency > 2s for > 5% of viewers",
        "Critical security vulnerability discovered"
      ]
    },
    businessImpact: {
      expectedIncrease: "30% user engagement, 25% creator retention",
      monetization: "Subscription revenue share model (70/30)",
      costStructure: "Variable based on encoding minutes and bandwidth",
      kpis: ["MAU streaming", "Avg watch time", "Creator satisfaction score"]
    }
  },
  {
    version: "v1.20.0",
    status: "PLANNED",
    date: "Coming Soon",
    type: "Minor",
    description: "Comprehensive design system overhaul with performance optimization, enhanced accessibility, and developer experience improvements.",
    color: "bg-gradient-to-r from-blue-500/10 via-sky-500/10 to-blue-600/10 border-blue-500/30",
    textColor: "text-blue-300",
    iconColor: "text-blue-300",
    details: [
      "Complete design token system with CSS custom properties for theming",
      "Performance-first component architecture with code splitting and tree shaking",
      "Accessibility audit and remediation across 100+ core components",
      "Enhanced image optimization pipeline with WebP/AVIF fallbacks and blur-up LQIP",
      "Motion design system with reduced-motion preferences and performance budgets",
      "Comprehensive icon library with SVG sprites and automated sprite generation",
      "Design documentation with interactive component playgrounds",
      "Automated visual regression testing with Percy/Chromatic integration",
      "Bundle analysis and optimization with Webpack Module Federation",
      "Server-side rendering improvements for 40% faster FCP",
      "Progressive web app enhancements: offline support, background sync",
      "Developer tools: Design linting, accessibility warnings, performance budgets"
    ],
    author: "Design Systems & Frontend Infrastructure Team",
    estimatedReadTime: "15 minutes",
    tags: ["design-system", "performance", "accessibility", "developer-experience", "pwa"],
    changelog: [
      { date: "Coming Soon", version: "v1.20.0-alpha", type: "alpha", changes: "Design token system and core component refactoring" },
      { date: "Coming Soon", version: "v1.20.0-beta", type: "beta", changes: "Accessibility improvements and performance optimization" },
      { date: "Coming Soon", version: "v1.20.0-rc", type: "rc", changes: "Visual regression testing and bundle optimization" }
    ],
    relatedDocs: ["design-tokens", "performance-budget", "a11y-standards", "component-guidelines"],
    resources: [
      { type: "storybook", label: "Component Library", url: "https://storybook.example.com" },
      { type: "figma", label: "Design System", url: "https://figma.com/@company" },
      { type: "docs", label: "Developer Guide", url: "/docs/frontend/design-system" }
    ],
    compatibility: {
      minRequired: "1.18.0",
      testedUpTo: "1.30.0",
      browserSupport: ["chrome 115+", "firefox 115+", "safari 15+", "edge 115+"],
      mobileSupport: ["iOS 14+", "Android 10+"],
      apiCompatibility: "v2 with backward compatibility to v1",
      sdkSupport: ["JavaScript 2.0+", "React 17+", "Vue 3.2+", "Svelte 4+"]
    },
    acceptanceCriteria: [
      "Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1",
      "100% WCAG 2.1 AA compliance for all public components",
      "Bundle size reduction of 25% from baseline",
      "Design system adoption rate > 90% across codebase"
    ],
    releaseChecklist: [
      "✅ Design system documentation complete",
      "✅ Accessibility audit passes with zero critical issues",
      "✅ Performance budgets met across all page types",
      "✅ Cross-browser testing on 20+ device/OS combinations",
      "✅ Developer training materials prepared"
    ],
    testPlan: {
      smoke: ["Component rendering and theming E2E flow"],
      integration: ["Theme switching, responsive behavior, and component interactions"],
      performance: ["Lighthouse scores, bundle size analysis, and runtime performance"],
      security: ["XSS protection and CSP compliance"],
      accessibility: ["axe-core automated testing, screen reader testing, keyboard navigation"],
      regression: ["Visual regression testing for 200+ component states"]
    },
    migrationNotes: {
      db: [
        "No database changes required",
        "Design tokens stored in version-controlled configuration files"
      ],
      api: [
        "Updated component APIs for 15+ core components",
        "Theme configuration moved to design tokens",
        "Backward compatibility maintained for 60 days"
      ],
      rollback: [
        "Maintain v1.18.0 compatibility for 30 days",
        "Feature flag to revert to old design system",
        "CSS rollback via versioned asset delivery"
      ]
    },
    performanceTargets: {
      firstFrame: "≤1.0s on 4G networks",
      bufferingRatio: "N/A",
      apiResponseTime: "P95 < 50ms for design token APIs",
      bundleSize: "Core design system < 150KB gzipped",
      coldStart: "N/A"
    },
    analyticsEvents: [
      { event: "design_system_usage", dimensions: ["component", "version", "theme"] },
      { event: "performance_metric", metrics: ["fcp", "lcp", "cls", "inp"] },
      { event: "accessibility_issue", actions: ["detected", "resolved", "bypass"] }
    ],
    securityConsiderations: [
      "CSP policies updated for new component architecture",
      "XSS protection for dynamic content rendering",
      "Subresource integrity for all third-party assets",
      "Secure design token distribution mechanism"
    ],
    accessibilityNotes: [
      "Screen reader testing with NVDA, JAWS, VoiceOver",
      "Keyboard navigation patterns documented and tested",
      "Focus management for modal and drawer components",
      "ARIA live regions for dynamic content updates",
      "High contrast mode support for all components"
    ],
    rolloutStrategy: {
      phases: [
        { phase: "internal-alpha", users: "100", duration: "2 weeks" },
        { phase: "beta-progressive", users: "1000", duration: "3 weeks" },
        { phase: "gradual-rollout", increase: "10%/day", monitoring: "strict" },
        { phase: "general-availability", target: "100%", date: "Coming Soon" }
      ],
      monitoring: [
        "design.system.usage (adoption metrics)",
        "performance.core_web_vitals (LCP, FID, CLS)",
        "accessibility.violations (axe-core reports)",
        "developer.satisfaction (feedback scores)"
      ],
      rollbackTriggers: [
        "Critical accessibility regression",
        "Performance degradation > 20% on core metrics",
        "User satisfaction drop > 15%",
        "Adoption rate < 50% after 2 weeks"
      ]
    },
    businessImpact: {
      expectedIncrease: "40% faster page loads, 25% better mobile performance",
      monetization: "Reduced infrastructure costs through optimized assets",
      costStructure: "Lower CDN bandwidth costs, reduced development time",
      kpis: ["Core Web Vitals scores", "Design system adoption rate", "Developer satisfaction", "Accessibility compliance"]
    }
  },
  {
    version: "v1.19.0",
    status: "PLANNED",
    date: "Coming Soon",
    type: "Minor",
    description: "Quality assurance infrastructure and beta ecosystem with comprehensive testing frameworks, monitoring, and feedback loops.",
    color: "bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-cyan-600/10 border-cyan-500/30",
    textColor: "text-cyan-300",
    iconColor: "text-cyan-300",
    details: [
      "End-to-end testing framework with 90%+ coverage for critical user journeys",
      "Automated visual regression testing across 100+ viewport configurations",
      "Performance benchmarking suite with automated regression detection",
      "Beta management platform with cohort analysis and feature flag orchestration",
      "Comprehensive error tracking and user feedback integration (Sentry + Hotjar)",
      "A/B testing infrastructure with statistical significance calculations",
      "Load testing automation for simulating 50K+ concurrent users",
      "Security scanning pipeline integrated into CI/CD",
      "Accessibility testing automation with axe-core integration",
      "Real-time monitoring dashboard for beta program metrics",
      "Automated release note generation from commit history",
      "Quality gates and deployment safety checks"
    ],
    author: "Quality Engineering & DevOps Team",
    estimatedReadTime: "12 minutes",
    tags: ["qa", "testing", "beta", "monitoring", "devops", "automation"],
    changelog: [
      { date: "Coming Soon", version: "v1.19.0-alpha", type: "alpha", changes: "Testing framework infrastructure and beta management backend" },
      { date: "Coming Soon", version: "v1.19.0-beta", type: "beta", changes: "Automated testing pipelines and monitoring dashboards" },
      { date: "Coming Soon", version: "v1.19.0-rc", type: "rc", changes: "Security scanning integration and production deployment gates" }
    ],
    relatedDocs: ["testing-strategy", "beta-program-management", "monitoring-setup", "ci-cd-pipeline"],
    resources: [
      { type: "dashboard", label: "Beta Analytics", url: "/monitoring/beta" },
      { type: "docs", label: "Testing Framework Guide", url: "/docs/testing" },
      { type: "portal", label: "Beta Tester Portal", url: "/beta" }
    ],
    compatibility: {
      minRequired: "1.16.0",
      testedUpTo: "1.30.0",
      browserSupport: ["chrome 115+", "firefox 115+", "safari 15+", "edge 115+"],
      mobileSupport: ["iOS 14+", "Android 10+"],
      apiCompatibility: "v3 with backward compatibility to v2",
      sdkSupport: ["JavaScript 2.0+", "React 17+", "Vue 3.2+", "Testing SDK 1.0+"]
    },
    acceptanceCriteria: [
      "Test automation coverage > 80% for critical paths",
      "Mean time to detect (MTTD) < 5 minutes for P1 issues",
      "Beta user feedback loop < 24 hours response time",
      "Zero critical security vulnerabilities in production deployment",
      "99.9% uptime for monitoring and alerting systems"
    ],
    releaseChecklist: [
      "✅ All automated test suites passing",
      "✅ Performance baselines established and documented",
      "✅ Beta cohort segmentation and invitation system ready",
      "✅ Monitoring alerts configured and tested",
      "✅ Rollback procedures documented and practiced",
      "✅ Security scanning integrated into CI/CD pipeline"
    ],
    testPlan: {
      smoke: ["Critical user journey E2E tests"],
      integration: ["API contract testing with Pact, webhook testing"],
      performance: ["Load testing with k6, performance regression testing"],
      security: ["OWASP Top 10 vulnerability scanning, penetration testing"],
      accessibility: ["Automated axe-core testing, screen reader compatibility"],
      regression: ["Full regression suite covering 90% of user flows"]
    },
    migrationNotes: {
      db: [
        "New collections: beta_testers, test_runs, quality_metrics",
        "Historical test data migration to new schema",
        "Index optimization for query performance"
      ],
      api: [
        "New endpoints for test management and beta program",
        "Deprecation of legacy testing endpoints after 60 days",
        "Rate limiting for automated testing endpoints"
      ],
      rollback: [
        "Maintain legacy testing framework for 30 days",
        "Feature flags for new QA infrastructure",
        "Database backup and restore procedures documented"
      ]
    },
    performanceTargets: {
      firstFrame: "N/A",
      bufferingRatio: "N/A",
      apiResponseTime: "P95 < 100ms for test execution APIs",
      bundleSize: "Testing utilities < 50KB gzipped",
      coldStart: "Test environment ready in < 2 minutes"
    },
    analyticsEvents: [
      { event: "test_execution", dimensions: ["type", "result", "duration"] },
      { event: "beta_feedback", metrics: ["rating", "response_time", "category"] },
      { event: "performance_regression", actions: ["detected", "alerted", "resolved"] },
      { event: "quality_metric", data: ["coverage", "pass_rate", "flakiness"] }
    ],
    securityConsiderations: [
      "Secure handling of beta user data and PII",
      "Encryption of test data containing sensitive information",
      "Access controls for beta management interfaces",
      "Isolation of testing environments from production data"
    ],
    accessibilityNotes: [
      "Testing tools must be accessible to QA engineers with disabilities",
      "Beta feedback forms must meet WCAG 2.1 AA standards",
      "Monitoring dashboards must support screen readers",
      "Keyboard navigation for all testing interfaces"
    ],
    rolloutStrategy: {
      phases: [
        { phase: "internal-alpha", users: "50", duration: "1 week" },
        { phase: "team-beta", users: "200", duration: "2 weeks" },
        { phase: "gradual-rollout", increase: "20%/week", monitoring: "aggressive" },
        { phase: "general-availability", target: "100%", date: "Coming Soon" }
      ],
      monitoring: [
        "qa.infrastructure.health (uptime, errors)",
        "test.execution.metrics (duration, success rate)",
        "beta.program.engagement (participation, feedback)",
        "security.scan.results (vulnerabilities, compliance)"
      ],
      rollbackTriggers: [
        "Test flakiness rate > 10%",
        "Critical security vulnerability in testing tools",
        "Beta program participation < 20% of target",
        "False positive rate > 15% on automated alerts"
      ]
    },
    businessImpact: {
      expectedIncrease: "40% reduction in production incidents, 60% faster release cycles",
      monetization: "N/A",
      costStructure: "Reduced manual testing effort by 70%, lower incident response costs",
      kpis: ["Mean time to detection (MTTD)", "Mean time to resolution (MTTR)", "Test automation coverage", "Beta program satisfaction"]
    }
  }
];

export default PLANNED_VERSIONS;