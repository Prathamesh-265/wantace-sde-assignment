import React, { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import NumberQuestion from '../dynamic/NumberQuestion.jsx';
import SelectQuestion from '../dynamic/SelectQuestion.jsx';
import ProgressBar from './ProgressBar.jsx';
import ContactStep from './ContactStep.jsx';
import ResultCard from './ResultCard.jsx';
import Spinner from '../ui/Spinner.jsx';
import Button from '../ui/Button.jsx';

const QUESTION_COMPONENTS = {
  number: NumberQuestion,
  select: SelectQuestion,
};

export default function EstimatorWizard() {
  const [config, setConfig] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [contact, setContact] = useState({ name: '', phone: '', email: '' });
  const [stepErrors, setStepErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadConfig();
  }, []);

  function loadConfig() {
    setLoadError(null);
    api
      .getConfig()
      .then(setConfig)
      .catch((err) => setLoadError(err.message));
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-md text-center py-10">
        <p className="text-lg font-semibold text-slate-900">We couldn't load the estimator.</p>
        <p className="mt-2 text-slate-600">{loadError}</p>
        <Button className="mt-4" onClick={loadConfig}>Try again</Button>
      </div>
    );
  }

  if (!config) return <Spinner label="Loading the estimator…" />;

  const questions = config.questions;
  const totalSteps = questions.length + 1; // + contact step
  const isContactStep = step === questions.length;
  const currentQuestion = isContactStep ? null : questions[step];

  function handleAnswerChange(key, value) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function handleContactChange(field, value) {
    setContact((prev) => ({ ...prev, [field]: value }));
  }

  function validateCurrentStep() {
    if (isContactStep) {
      const errs = [];
      if (!contact.name.trim()) errs.push('name is required.');
      if (!contact.phone.trim()) errs.push('phone is required.');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(contact.email)) errs.push('a valid email is required.');
      setStepErrors(errs);
      return errs.length === 0;
    }

    const q = currentQuestion;
    const value = answers[q.key];
    if (q.required && (value === undefined || value === '' || value === null)) {
      setStepErrors([`${q.label} is required.`]);
      return false;
    }
    if (q.type === 'number' && value !== undefined && value !== '') {
      const numeric = Number(value);
      if (q.min !== undefined && numeric < q.min) {
        setStepErrors([`Must be at least ${q.min}.`]);
        return false;
      }
      if (q.max !== undefined && numeric > q.max) {
        setStepErrors([`Must be at most ${q.max}.`]);
        return false;
      }
    }
    setStepErrors([]);
    return true;
  }

  function goNext() {
    if (!validateCurrentStep()) return;
    if (isContactStep) {
      handleSubmit();
      return;
    }
    setStep((s) => s + 1);
  }

  function goBack() {
    setStepErrors([]);
    setStep((s) => Math.max(0, s - 1));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = { ...contact, answers };
      const data = await api.submitEstimate(payload);
      setResult(data);
    } catch (err) {
      setSubmitError(err.details?.join(' ') || err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function startOver() {
    setAnswers({});
    setContact({ name: '', phone: '', email: '' });
    setStep(0);
    setResult(null);
    setSubmitError(null);
    loadConfig();
  }

  if (result) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <ResultCard result={result} onStartOver={startOver} />
      </div>
    );
  }

  const FieldComponent = currentQuestion ? QUESTION_COMPONENTS[currentQuestion.type] : null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <ProgressBar current={step + 1} total={totalSteps} />

      <div className="min-h-[180px]">
        {isContactStep ? (
          <ContactStep contact={contact} onChange={handleContactChange} errors={stepErrors} />
        ) : (
          FieldComponent && (
            <FieldComponent
              question={currentQuestion}
              value={answers[currentQuestion.key]}
              onChange={handleAnswerChange}
              error={stepErrors[0]}
            />
          )
        )}
      </div>

      {submitError && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{submitError}</p>
      )}

      <div className="mt-5 flex items-center justify-between">
        <Button variant="ghost" onClick={goBack} disabled={step === 0 || submitting}>
          Back
        </Button>
        <Button onClick={goNext} disabled={submitting}>
          {submitting ? 'Calculating…' : isContactStep ? 'Get my estimate' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
