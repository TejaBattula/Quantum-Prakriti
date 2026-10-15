import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import {
  Mail,
  MapPin,
  Phone,
  Send,
  CheckCircle2,
  AlertCircle,
  BriefcaseBusiness,
  X,
  Code2,
  User,
  MessageSquare,
  ClipboardCheck,
} from 'lucide-react';

import SectionHeading from '../components/SectionHeading.jsx';
import Stepper, { Step } from '../components/stepper.jsx';

import '../styles/contact.css';

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [theme, setTheme] = useState('dark');

  // Synchronize the form theme with the website theme.
  useEffect(() => {
    const updateTheme = () => {
      const currentTheme =
        document.documentElement.getAttribute('data-theme');

      setTheme(currentTheme === 'light' ? 'light' : 'dark');
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  // Validate the supplied fields.
  const validate = (fields) => {
    const nextErrors = {};

    if (
      fields.name !== undefined &&
      !fields.name.trim()
    ) {
      nextErrors.name = 'Please enter your name.';
    }

    if (fields.email !== undefined) {
      if (!fields.email.trim()) {
        nextErrors.email = 'Please enter your email.';
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          fields.email.trim()
        )
      ) {
        nextErrors.email = 'Please enter a valid email address.';
      }
    }

    if (
      fields.subject !== undefined &&
      !fields.subject.trim()
    ) {
      nextErrors.subject = 'Please enter a subject.';
    }

    if (fields.message !== undefined) {
      if (!fields.message.trim()) {
        nextErrors.message = 'Please enter your message.';
      } else if (fields.message.trim().length < 10) {
        nextErrors.message =
          'Please provide a message of at least 10 characters.';
      }
    }

    return nextErrors;
  };

  // Handle changes to individual fields.
  const handleChange = (field) => (event) => {
    const value = event.target.value;

    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => {
      const updated = { ...previous };
      delete updated[field];
      return updated;
    });

    if (status === 'error') {
      setStatus('idle');
    }
  };

  // Validate only the fields belonging to the current step.
  const validateStep = (fields) => {
    const stepErrors = validate(fields);

    setErrors((previous) => {
      const updated = { ...previous };

      Object.keys(fields).forEach((field) => {
        delete updated[field];
      });

      return {
        ...updated,
        ...stepErrors,
      };
    });

    return Object.keys(stepErrors).length === 0;
  };

  const validateDetails = () =>
    validateStep({
      name: form.name,
      email: form.email,
    });

  const validateEnquiry = () =>
    validateStep({
      subject: form.subject,
      message: form.message,
    });

  // Called when the user completes the final step.
  const handleSubmit = () => {
    const allErrors = validate(form);

    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      setStatus('idle');
      return false;
    }

    // Demonstration only: no backend is connected.
    setStatus('submitting');

    window.setTimeout(() => {
      setStatus('error');
    }, 1200);

    return true;
  };

  // Reset the form after the completion screen.
  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setStatus('idle');
  };

  // Display a field validation message.
  const fieldError = (field) => {
    if (!errors[field]) return null;

    return (
      <span
        id={`${field}-error`}
        className="field__error"
        role="alert"
      >
        {errors[field]}
      </span>
    );
  };

  return (
    <>
      {/* PAGE INTRODUCTION */}
      <section className="page-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="eyebrow">Contact</span>

            <h1>Let's start a conversation</h1>

            <p className="page-hero__lead">
              Share your questions, ideas, or requirements.
              We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="section section--dark">
        <div className="container contact-grid">

          {/* LEFT: CONTACT INFORMATION */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <SectionHeading
              eyebrow="Get in touch"
              title="Contact information"
            />

            <ul className="contact-info__list">
              <li>
                <Mail size={18} />

                <div>
                  <strong>Email</strong>
                  <span>
                    contact@q-prakrithi.example
                  </span>
                </div>
              </li>

              <li>
                <Phone size={18} />

                <div>
                  <strong>Phone</strong>
                  <span>
                    +00 000 000 0000 (placeholder)
                  </span>
                </div>
              </li>

              <li>
                <MapPin size={18} />

                <div>
                  <strong>Office Address</strong>
                  <span>
                    Office address placeholder — to be confirmed.
                  </span>
                </div>
              </li>
            </ul>

            <div className="contact-socials">
              <a href="#" aria-label="LinkedIn">
                <BriefcaseBusiness size={16} />
              </a>

              <a href="#" aria-label="X">
                <X size={16} />
              </a>

              <a href="#" aria-label="GitHub">
                <Code2 size={16} />
              </a>
            </div>
          </motion.div>

          {/* RIGHT: ANIMATED CONTACT FORM */}
          <motion.div
            className="contact-form contact-form--stepper"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <div className="contact-form__heading">
              <span className="eyebrow">
                Let's connect
              </span>

              <h2>Send us a message</h2>

              <p>
                Complete these quick steps to tell us how
                we can help.
              </p>
            </div>

            <Stepper
              initialStep={1}
              onFinalStepCompleted={handleSubmit}
              backButtonText="Back"
              nextButtonText="Continue"
              completeButtonText="Send Message"
              indicator="numbers"
              orientation="horizontal"
              transition="slide"
              linear={true}
              theme={theme}
              accentColor="#d4af37"
              frame={false}
              radius={18}
              width="100%"
              className="contact-stepper"
              nextButtonProps={{
                onClick: (event) => {
                  const stepper =
                    event.currentTarget.closest('.stepper');

                  if (!stepper) return;

                  const activeTitle = stepper.querySelector(
                    '.stepper__title[data-status="active"]'
                  )?.textContent?.trim();

                  let valid = true;

                  if (activeTitle === 'Your Details') {
                    valid = validateDetails();
                  } else if (
                    activeTitle === 'Your Enquiry'
                  ) {
                    valid = validateEnquiry();
                  }

                  if (!valid) {
                    event.preventDefault();
                  }
                },
              }}
              completedContent={
                <div className="contact-completed">
                  <div className="contact-completed__icon">
                    {status === 'error' ? (
                      <AlertCircle size={30} />
                    ) : status === 'submitting' ? (
                      <Send size={30} />
                    ) : (
                      <CheckCircle2 size={30} />
                    )}
                  </div>

                  <h3>
                    {status === 'submitting'
                      ? 'Preparing your message…'
                      : status === 'error'
                        ? 'Message not delivered'
                        : 'Thank you!'}
                  </h3>

                  <p>
                    {status === 'submitting'
                      ? 'Your form has passed validation. Please wait…'
                      : status === 'error'
                        ? 'This form is not connected to a message delivery service yet. Your message has not been sent.'
                        : 'Your form has been completed.'}
                  </p>

                  {status === 'error' && (
                    <p className="contact-completed__note">
                      Connect a backend or email service to
                      receive messages from this form.
                    </p>
                  )}

                  <button
                    type="button"
                    className="btn btn--gold btn--md"
                    onClick={resetForm}
                  >
                    Start Again
                  </button>
                </div>
              }
            >

              {/* STEP 1: YOUR DETAILS */}
              <Step
                title="Your Details"
                description="Tell us who you are"
                icon={<User size={17} />}
              >
                <div className="contact-step-content">
                  <div>
                    <h3>Your Details</h3>

                    <p className="contact-step-content__lead">
                      Let's start with your name and email address.
                    </p>
                  </div>

                  <div className="field">
                    <label htmlFor="contact-name">
                      Full Name <span>*</span>
                    </label>

                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={handleChange('name')}
                      aria-invalid={!!errors.name}
                      aria-describedby={
                        errors.name ? 'name-error' : undefined
                      }
                      placeholder="Enter your full name"
                    />

                    {fieldError('name')}
                  </div>

                  <div className="field">
                    <label htmlFor="contact-email">
                      Email Address <span>*</span>
                    </label>

                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={handleChange('email')}
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? 'email-error' : undefined
                      }
                      placeholder="you@example.com"
                    />

                    {fieldError('email')}
                  </div>
                </div>
              </Step>

              {/* STEP 2: YOUR ENQUIRY */}
              <Step
                title="Your Enquiry"
                description="Tell us what you need"
                icon={<MessageSquare size={17} />}
              >
                <div className="contact-step-content">
                  <div>
                    <h3>Your Enquiry</h3>

                    <p className="contact-step-content__lead">
                      Tell us about your question or project.
                    </p>
                  </div>

                  <div className="field">
                    <label htmlFor="contact-subject">
                      Subject <span>*</span>
                    </label>

                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      value={form.subject}
                      onChange={handleChange('subject')}
                      aria-invalid={!!errors.subject}
                      aria-describedby={
                        errors.subject
                          ? 'subject-error'
                          : undefined
                      }
                      placeholder="How can we help?"
                    />

                    {fieldError('subject')}
                  </div>

                  <div className="field">
                    <label htmlFor="contact-message">
                      Message <span>*</span>
                    </label>

                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange('message')}
                      aria-invalid={!!errors.message}
                      aria-describedby={
                        errors.message
                          ? 'message-error'
                          : undefined
                      }
                      placeholder="Tell us about your enquiry..."
                    />

                    {fieldError('message')}
                  </div>
                </div>
              </Step>

              {/* STEP 3: REVIEW */}
              <Step
                title="Review"
                description="Check your information"
                icon={<ClipboardCheck size={17} />}
              >
                <div className="contact-step-content">
                  <div>
                    <h3>Review your message</h3>

                    <p className="contact-step-content__lead">
                      Check your details before completing the form.
                    </p>
                  </div>

                  <div className="contact-review">
                    <div className="contact-review__item">
                      <span>Name</span>
                      <strong>
                        {form.name || 'Not provided'}
                      </strong>
                    </div>

                    <div className="contact-review__item">
                      <span>Email</span>
                      <strong>
                        {form.email || 'Not provided'}
                      </strong>
                    </div>

                    <div className="contact-review__item">
                      <span>Subject</span>
                      <strong>
                        {form.subject || 'Not provided'}
                      </strong>
                    </div>

                    <div className="contact-review__item">
                      <span>Message</span>
                      <p>
                        {form.message || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </Step>
            </Stepper>
          </motion.div>
        </div>
      </section>
    </>
  );
}