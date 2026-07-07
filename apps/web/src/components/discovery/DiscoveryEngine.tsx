'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Send, Check, ShieldAlert, Terminal as TermIcon } from 'lucide-react';
import { Button, Input } from '@hawkedge/ui';
import { QUESTIONS, BuildType, Question } from './logic';
import { BriefViewer } from './BriefViewer';

const BUILD_TYPES = [
  { value: 'WEBSITE', label: 'Public Website Architecture' },
  { value: 'AI_SOLUTION', label: 'AI Pipeline & Machine Intelligence' },
  { value: 'WEB_APP', label: 'Dynamic SaaS Web Application' },
  { value: 'DASHBOARD', label: 'High-Throughput Telemetry Dashboard' },
  { value: 'PARTNERSHIP', label: 'Academic or Corporate Partnership' },
];

export function DiscoveryEngine() {
  // Navigation Steps:
  // - 'BUILD_TYPE': Selecting what to build
  // - 'QUESTIONS': Iterating branching questions
  // - 'CONTACT': Getting name/company/email details
  // - 'RESULT': Showing BriefViewer
  const [currentStep, setCurrentStep] = useState<'BUILD_TYPE' | 'QUESTIONS' | 'CONTACT' | 'RESULT'>('BUILD_TYPE');
  const [selectedBuildType, setSelectedBuildType] = useState<BuildType | null>(null);
  const [subStepIndex, setSubStepIndex] = useState(0);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  // Contacts form state
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const containerRef = useRef<HTMLDivElement>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const cache = localStorage.getItem('hawkedge_consultation_flow');
      if (cache) {
        const parsed = JSON.parse(cache);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.selectedBuildType) setSelectedBuildType(parsed.selectedBuildType);
        if (parsed.subStepIndex !== undefined) setSubStepIndex(parsed.subStepIndex);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.companyName) setCompanyName(parsed.companyName);
        if (parsed.email) setEmail(parsed.email);
      }
    } catch (e) {
      console.warn('Failed to load local storage consultation cache.', e);
    }
  }, []);

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const saveState = (stepVal: typeof currentStep, typeVal: BuildType | null, indexVal: number, ansVal: Record<string, any>) => {
    try {
      localStorage.setItem(
        'hawkedge_consultation_flow',
        JSON.stringify({
          currentStep: stepVal,
          selectedBuildType: typeVal,
          subStepIndex: indexVal,
          answers: ansVal,
          fullName,
          companyName,
          email,
        })
      );
    } catch (e) {
      // Ignore storage block exceptions
    }
  };

  const getActiveQuestionsList = (): Question[] => {
    if (!selectedBuildType) return [];
    return QUESTIONS[selectedBuildType] || [];
  };

  const activeQuestions = getActiveQuestionsList();
  const currentQuestion = activeQuestions[subStepIndex];

  // Logic flow navigations:
  const goBack = () => {
    setError(null);
    if (currentStep === 'RESULT') {
      setCurrentStep('CONTACT');
      saveState('CONTACT', selectedBuildType, subStepIndex, answers);
    } else if (currentStep === 'CONTACT') {
      setCurrentStep('QUESTIONS');
      setSubStepIndex(activeQuestions.length - 1);
      saveState('QUESTIONS', selectedBuildType, activeQuestions.length - 1, answers);
    } else if (currentStep === 'QUESTIONS') {
      if (subStepIndex > 0) {
        setSubStepIndex(subStepIndex - 1);
        saveState('QUESTIONS', selectedBuildType, subStepIndex - 1, answers);
      } else {
        setCurrentStep('BUILD_TYPE');
        setSelectedBuildType(null);
        saveState('BUILD_TYPE', null, 0, answers);
      }
    }
  };

  const goNext = () => {
    setError(null);
    if (currentStep === 'BUILD_TYPE') {
      if (!selectedBuildType) {
        setError('Please select a build type coordinates direction.');
        return;
      }
      setCurrentStep('QUESTIONS');
      setSubStepIndex(0);
      saveState('QUESTIONS', selectedBuildType, 0, answers);
    } else if (currentStep === 'QUESTIONS') {
      const q = activeQuestions[subStepIndex];
      if (!q) return;
      const ans = answers[q.id];
      if (!ans || (Array.isArray(ans) && ans.length === 0)) {
        setError('Please specify options answers parameter before proceeding.');
        return;
      }

      if (subStepIndex < activeQuestions.length - 1) {
        setSubStepIndex(subStepIndex + 1);
        saveState('QUESTIONS', selectedBuildType, subStepIndex + 1, answers);
      } else {
        setCurrentStep('CONTACT');
        saveState('CONTACT', selectedBuildType, subStepIndex, answers);
      }
    }
  };

  const selectOption = (id: string, value: string, isMulti = false) => {
    setError(null);
    const currentAns = answers[id];
    
    if (isMulti) {
      const list = Array.isArray(currentAns) ? [...currentAns] : [];
      const idx = list.indexOf(value);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(value);
      }
      const updated = { ...answers, [id]: list };
      setAnswers(updated);
      saveState(currentStep, selectedBuildType, subStepIndex, updated);
    } else {
      const updated = { ...answers, [id]: value };
      setAnswers(updated);
      
      // Auto-advance for single select lists to improve conversion UX
      if (currentStep === 'BUILD_TYPE') {
        const nextType = value as BuildType;
        setSelectedBuildType(nextType);
        setCurrentStep('QUESTIONS');
        setSubStepIndex(0);
        saveState('QUESTIONS', nextType, 0, updated);
      } else {
        if (subStepIndex < activeQuestions.length - 1) {
          setSubStepIndex(subStepIndex + 1);
          saveState('QUESTIONS', selectedBuildType, subStepIndex + 1, updated);
        } else {
          setCurrentStep('CONTACT');
          saveState('CONTACT', selectedBuildType, subStepIndex, updated);
        }
      }
    }
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full Name is required.';
    if (!companyName.trim()) errs.companyName = 'Company / Organization is required.';
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Invalid email address coordinates.';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);

    const payload = {
      ...answers,
      fullName,
      companyName,
      email,
      buildType: selectedBuildType,
    };

    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to submit consultation details.');
      }

      const resData = await res.json();
      setLeadId(resData.leadId || null);
      setCurrentStep('RESULT');
      saveState('RESULT', selectedBuildType, subStepIndex, answers);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Server ingestion endpoint error.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Keyboard navigation logic handlers
  useEffect(() => {
    const isInputActive = () => {
      const active = document.activeElement;
      if (!active) return false;
      const tagName = active.tagName.toLowerCase();
      return tagName === 'input' || tagName === 'textarea' || active.getAttribute('contenteditable') === 'true';
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInputActive()) {
        if (e.key === 'Enter' && currentStep === 'CONTACT') {
          // Allow submitting form on enter inside text fields
          handleSubmit();
        }
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        goBack();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentStep === 'CONTACT') {
          handleSubmit();
        } else {
          goNext();
        }
      } else if (/^[1-9]$/.test(e.key)) {
        const idx = parseInt(e.key) - 1;
        
        if (currentStep === 'BUILD_TYPE') {
          const opt = BUILD_TYPES[idx];
          if (opt) selectOption('buildType', opt.value);
        } else if (currentStep === 'QUESTIONS' && currentQuestion) {
          const opt = currentQuestion.options?.[idx];
          if (opt) {
            selectOption(currentQuestion.id, opt.value, currentQuestion.type === 'multi');
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, selectedBuildType, subStepIndex, answers, fullName, companyName, email, currentQuestion]);

  const handleReset = () => {
    localStorage.removeItem('hawkedge_consultation_flow');
    setCurrentStep('BUILD_TYPE');
    setSelectedBuildType(null);
    setSubStepIndex(0);
    setAnswers({});
    setFullName('');
    setCompanyName('');
    setEmail('');
    setError(null);
    setFormErrors({});
  };

  if (currentStep === 'RESULT') {
    return (
      <div className="w-full bg-bg-surface/10 p-6 sm:p-8 border border-border-default">
        <BriefViewer answers={{ ...answers, fullName, companyName, email, buildType: selectedBuildType }} leadId={leadId || undefined} onReset={handleReset} />
      </div>
    );
  }

  // Live Telemetry Logs helper for the right pane
  const renderLiveConsoleLogs = () => {
    const lines = [];
    lines.push(`// TELEMETRY INGESTION CONSOLE ONLINE`);
    lines.push(`SYSTEM_STATUS: ACTIVE`);
    if (selectedBuildType) {
      lines.push(`BUILD_TYPE: ${selectedBuildType}`);
      
      const qList = QUESTIONS[selectedBuildType] || [];
      qList.forEach((q) => {
        const val = answers[q.id];
        if (val) {
          lines.push(`${q.id.toUpperCase()}: ${Array.isArray(val) ? val.join(', ') : val}`);
        }
      });
    } else {
      lines.push(`BUILD_TYPE: PENDING_SELECTION`);
    }

    if (fullName) lines.push(`CLIENT_NAME: ${fullName}`);
    if (companyName) lines.push(`CLIENT_ORG: ${companyName}`);
    if (email) lines.push(`CLIENT_EMAIL: ${email}`);

    return lines;
  };

  return (
    <div ref={containerRef} className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch font-body">
      
      {/* Left Column: Diagnostics questionnaire */}
      <div className="lg:col-span-7 border border-border-default bg-bg-surface/30 p-6 sm:p-8 flex flex-col justify-between min-h-[480px]">
        <div>
          {/* Diagnostic Steps Indicators */}
          <div className="flex justify-between items-center mb-8 font-mono text-[9px] border-b border-border-subtle pb-4 text-text-muted">
            <span className="text-brand-primary font-bold uppercase">
              // DIAGNOSTIC CORE: {currentStep}
            </span>
            <div className="flex gap-2">
              <span className={currentStep === 'BUILD_TYPE' ? 'text-text-primary' : ''}>01_SECTOR</span>
              <span>&gt;</span>
              <span className={currentStep === 'QUESTIONS' ? 'text-text-primary' : ''}>02_BRANCH</span>
              <span>&gt;</span>
              <span className={currentStep === 'CONTACT' ? 'text-text-primary' : ''}>03_COORDS</span>
            </div>
          </div>

          {/* Core Questionnaire State Renderer */}
          {currentStep === 'BUILD_TYPE' && (
            <div className="flex flex-col gap-6">
              <div>
                <span className="font-mono text-[10px] text-brand-primary uppercase block mb-1">
                  // OPTION COORDINATES
                </span>
                <h3 className="font-heading font-extrabold text-xl text-text-primary">
                  Select System Build Category
                </h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Identify the core technology segment that outlines your project parameters.
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                {BUILD_TYPES.map((opt, idx) => (
                  <button
                    key={opt.value}
                    onClick={() => selectOption('buildType', opt.value)}
                    className="w-full flex items-center justify-between px-4 py-3.5 border border-border-subtle hover:border-border-default hover:bg-bg-hover/30 text-left transition-colors focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  >
                    <span className="text-xs font-semibold text-text-secondary">{opt.label}</span>
                    <span className="font-mono text-[10px] text-brand-primary">[key: {idx + 1}]</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'QUESTIONS' && currentQuestion && (
            <div className="flex flex-col gap-6">
              <div>
                <span className="font-mono text-[10px] text-brand-primary uppercase block mb-1">
                  // PARAMETER CONFIG: {subStepIndex + 1} / {activeQuestions.length}
                </span>
                <h3 className="font-heading font-extrabold text-xl text-text-primary">
                  {currentQuestion.text}
                </h3>
              </div>

              {currentQuestion.type === 'select' && currentQuestion.options && (
                <div className="flex flex-col gap-2.5">
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelected = answers[currentQuestion.id] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => selectOption(currentQuestion.id, opt.value)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 border transition-all focus:outline-none focus:ring-1 focus:ring-brand-primary ${
                          isSelected 
                            ? 'border-brand-primary bg-bg-elevated/20' 
                            : 'border-border-subtle hover:border-border-default hover:bg-bg-hover/30'
                        }`}
                      >
                        <span className={`text-xs font-semibold ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
                          {opt.label}
                        </span>
                        <span className="font-mono text-[10px] text-brand-primary">[key: {idx + 1}]</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'multi' && currentQuestion.options && (
                <div className="flex flex-col gap-2.5">
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelected = (answers[currentQuestion.id] || []).includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        onClick={() => selectOption(currentQuestion.id, opt.value, true)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 border transition-all focus:outline-none focus:ring-1 focus:ring-brand-primary ${
                          isSelected 
                            ? 'border-brand-primary bg-bg-elevated/20' 
                            : 'border-border-subtle hover:border-border-default hover:bg-bg-hover/30'
                        }`}
                      >
                        <span className={`text-xs font-semibold ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
                          {opt.label}
                        </span>
                        <div className="flex items-center gap-3">
                          {isSelected && <Check className="w-3.5 h-3.5 text-brand-primary" />}
                          <span className="font-mono text-[10px] text-brand-primary">[key: {idx + 1}]</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {currentStep === 'CONTACT' && (
            <div className="flex flex-col gap-6">
              <div>
                <span className="font-mono text-[10px] text-brand-primary uppercase block mb-1">
                  // CONTACT COORDINATES
                </span>
                <h3 className="font-heading font-extrabold text-xl text-text-primary">
                  Verify Client Parameters
                </h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Provide coordinates to generate project metrics calculation brief.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="Full Representative Name"
                  id="fullName"
                  placeholder="Enter full name..."
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: '' });
                  }}
                  error={formErrors.fullName}
                  className="bg-bg-subtle/50 text-text-primary border-border-default focus:border-brand-primary"
                />

                <Input
                  label="Company / Enterprise"
                  id="companyName"
                  placeholder="Organization name..."
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                    if (formErrors.companyName) setFormErrors({ ...formErrors, companyName: '' });
                  }}
                  error={formErrors.companyName}
                  className="bg-bg-subtle/50 text-text-primary border-border-default focus:border-brand-primary"
                />

                <Input
                  label="Email coordinates address"
                  id="email"
                  type="email"
                  placeholder="name@enterprise.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                  }}
                  error={formErrors.email}
                  className="bg-bg-subtle/50 text-text-primary border-border-default focus:border-brand-primary"
                />
              </form>
            </div>
          )}
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="my-4 px-4 py-3 bg-semantic-danger-bg border border-semantic-danger/30 text-semantic-danger font-mono text-[10px] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>ERROR: {error}</span>
          </div>
        )}

        {/* Navigation Buttons footer */}
        <div className="flex justify-between items-center border-t border-border-subtle pt-6 mt-8">
          <button
            onClick={goBack}
            disabled={currentStep === 'BUILD_TYPE'}
            className="flex items-center gap-2 px-3 py-1.5 border border-border-subtle text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed font-mono text-[10px] transition-colors focus:outline-none focus:ring-1 focus:ring-brand-primary"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> REVERT_BACK
          </button>
          
          <span className="font-mono text-[9px] text-text-placeholder hidden sm:inline">
            Use [BACKSPACE] for revert | [ENTER] to submit option selection
          </span>

          {currentStep === 'CONTACT' ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleSubmit()}
              isLoading={loading}
              className="font-mono text-xs"
              rightIcon={<Send className="w-3.5 h-3.5" />}
            >
              COMPILE_BRIEF
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={goNext}
              disabled={currentStep === 'BUILD_TYPE' && !selectedBuildType}
              className="font-mono text-xs"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              PROCEED_NEXT
            </Button>
          )}
        </div>

      </div>

      {/* Right Column: Live specification preview console */}
      <div className="lg:col-span-5 border border-border-default bg-bg-base/80 p-6 flex flex-col justify-between font-mono relative">
        <div className="absolute top-0 right-0 p-3 border-l border-b border-border-default font-mono text-[9px] text-text-muted">
          PREVIEW_CONSOLE_STREAM
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
            <TermIcon className="w-4 h-4 text-brand-primary animate-pulse" />
            <span className="text-[10px] text-text-secondary font-bold">Telemetry Live stream</span>
          </div>

          <div className="text-[10px] leading-relaxed text-text-muted select-none">
            {renderLiveConsoleLogs().map((line, idx) => (
              <div key={idx} className={line.startsWith('//') ? 'text-text-placeholder font-semibold' : 'text-text-secondary'}>
                {line}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-border-subtle pt-4 text-[9px] text-text-placeholder">
          HAWKEDGE_DISCOVERY_ENGINE // PHASE_5_STABLE
        </div>

      </div>

    </div>
  );
}
export default DiscoveryEngine;
