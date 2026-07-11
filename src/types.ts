/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TranslationSet {
  navHome: string;
  navServices: string;
  navPortfolio: string;
  navFAQ: string;
  navAbout: string;
  navContact: string;
  navCRM: string;

  heroTag: string;
  heroTitle: string;
  heroSub: string;
  heroCtaPrimary: string;
  heroCtaSec: string;
  heroStaticFallbackNote: string;

  servicesTitle: string;
  servicesSubtitle: string;

  portfolioTitle: string;
  portfolioSubtitle: string;
  portfolioAll: string;
  portfolioFilterWeb: string;
  portfolioFilterBranding: string;
  portfolioFilterFlyers: string;
  portfolioFilterVideos: string;

  resultsTitle: string;
  resultsSubtitle: string;
  resultsMetric1Val: string;
  resultsMetric1Lbl: string;
  resultsMetric2Val: string;
  resultsMetric2Lbl: string;
  resultsMetric3Val: string;
  resultsMetric3Lbl: string;

  aboutTitle: string;
  aboutText1: string;
  aboutText2: string;
  aboutFounderTitle: string;

  testimonialsTitle: string;
  testimonialsSubtitle: string;

  contactTitle: string;
  contactSubtitle: string;
  contactNameLabel: string;
  contactEmailLabel: string;
  contactPhoneLabel: string;
  contactBudgetLabel: string;
  contactServiceLabel: string;
  contactMessageLabel: string;
  contactSubmitBtn: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  url: string;
  industry: string;
  year: string;
  tags: string[];
  problem: string;
  solution: string;
  results: string;
  technologies: string[];
  image: string;
}

export interface Lead {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  status: "Identificado" | "En Contacto" | "Propuesta Enviada" | "Convertido" | "Perdido";
  score: number;
  industry: string;
  notes: string;
  createdAt: string;
}

export interface Proposal {
  leadId: string;
  leadName: string;
  title: string;
  price: number;
  scope: string[];
  timeline: string;
  report: string;
}
