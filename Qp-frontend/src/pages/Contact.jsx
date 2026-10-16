import { useState } from 'react';
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
} from 'lucide-react';

import SectionHeading from '../components/SectionHeading.jsx';

import '../styles/contact.css';

const initialForm = {
  name: '',
  organisation: '',
  email: '',
  message: '',
};

/* ------------------------------------------------------------------
   TODO: connect a real delivery service here (own API, Formspree,
   EmailJS, etc.). Until then this throws, so the form honestly
   tells the visitor that the message was NOT sent.
------------------------------------------------------------------- */
async function sendMessage(/* data */) {
  throw new Error('not-connected');
}

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const validate = (fields) => {
    const next = {};

    if (!fields.name.trim()) {
      next.name = 'Please enter your name.';
    }

    if (!fields.email.trim()) {
      next.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
      next.email = 'Please enter a valid email address.';
    }

    if (!fields.message.trim()) {
      next.message = 'Please enter your message.';
    } else if (fields.message.trim().length < 10) {
      next.message = 'Please provide a message of at least 10 characters.';
    }

    return next;
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;

    setForm((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => {
      if (!prev[field]) return prev;
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });

    if (status === 'error') setStatus('idle');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === 'submitting') return;

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus('submitting');

    try {
      await sendMessage(form);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setStatus('idle');
  };

  const fieldError = (field) =>
    errors[field] ? (
      <span id={`${field}-error`} className="field__error" role="alert">
        {errors[field]}
      </span>
    ) : null;

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
            <SectionHeading eyebrow="Get in touch" title="Contact information" />

            <ul className="contact-info__list">
              <li>
                <Mail size={18} />
                <div>
                  <strong>Email</strong>
                  <span>contact@q-prakrithi.example</span>
                </div>
              </li>

              <li>
                <Phone size={18} />
                <div>
                  <strong>Phone</strong>
                  <span>+00 000 000 0000 (placeholder)</span>
                </div>
              </li>

              <li>
                <MapPin size={18} />
                <div>
                  <strong>Office Address</strong>
                  <span>Office address placeholder — to be confirmed.</span>
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

          {/* RIGHT: SIMPLE CONTACT FORM */}
          <motion.div
            className="contact-form"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            {status === 'success' ? (
              <div className="contact-completed">
                <div className="contact-completed__icon">
                  <CheckCircle2 size={30} />
                </div>

                <h3>Thank you!</h3>

                <p>
                  Your message has been sent. Our team will get back to you soon.
                </p>

                <button
                  type="button"
                  className="btn btn--gold btn--md"
                  onClick={resetForm}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div className="contact-form__heading">
                  <span className="eyebrow">Let's connect</span>
                  <h2>Send us a message</h2>
                  <p>Tell us how we can help and we will get back to you.</p>
                </div>

                <form className="contact-form__form" onSubmit={handleSubmit} noValidate>
                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="contact-name">
                        Name <span>*</span>
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={form.name}
                        onChange={handleChange('name')}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        placeholder="Your full name"
                      />
                      {fieldError('name')}
                    </div>

                    <div className="field">
                      <label htmlFor="contact-organisation">
                        Organisation <em>(optional)</em>
                      </label>
                      <input
                        id="contact-organisation"
                        name="organisation"
                        type="text"
                        autoComplete="organization"
                        value={form.organisation}
                        onChange={handleChange('organisation')}
                        placeholder="Company or institution"
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="contact-email">
                      Email <span>*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={handleChange('email')}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      placeholder="you@example.com"
                    />
                    {fieldError('email')}
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
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      placeholder="Tell us about your enquiry..."
                    />
                    {fieldError('message')}
                  </div>

                  {status === 'error' && (
                    <div className="form-status form-status--err" role="alert">
                      <AlertCircle size={16} />
                      Message not sent. This form is not connected to an email
                      service yet.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn--gold btn--md contact-form__submit"
                    disabled={status === 'submitting'}
                  >
                    {status === 'submitting' ? 'Sending…' : 'Send Message'}
                    <Send size={15} />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}