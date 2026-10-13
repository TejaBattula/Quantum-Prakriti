import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, CheckCircle2, AlertCircle, BriefcaseBusiness, X, Code2 } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';
import '../styles/contact.css';

const initial = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    if (!form.email.trim()) e.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email address.';
    if (!form.subject.trim()) e.subject = 'Please enter a subject.';
    if (!form.message.trim()) e.message = 'Please enter your message.';
    else if (form.message.trim().length < 10) e.message = 'Please provide a slightly longer message.';
    return e;
  };

  const handleChange = (field) => (ev) => {
    setForm((f) => ({ ...f, [field]: ev.target.value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      setStatus('error');
      return;
    }
    // NOTE: The frontend is not connected to a backend. We honestly report that
    // the message cannot be delivered from this build.
    setStatus('submitting');
    setTimeout(() => {
      setStatus('error');
      // Do not falsely show success.
    }, 900);
  };

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="eyebrow">Contact</span>
            <h1>Let's start a conversation</h1>
            <p className="page-hero__lead">
              Share your questions, ideas, or requirements. We'll get back to you as
              soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container contact-grid">
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
                <div><strong>Email</strong><span>contact@q-prakrithi.example</span></div>
              </li>
              <li>
                <Phone size={18} />
                <div><strong>Phone</strong><span>+00 000 000 0000 (placeholder)</span></div>
              </li>
              <li>
                <MapPin size={18} />
                <div><strong>Office Address</strong><span>Office address placeholder — to be confirmed.</span></div>
              </li>
            </ul>

            <div className="contact-socials">
              <a href="#" aria-label="LinkedIn"><BriefcaseBusiness size={16} /></a>
              <a href="#" aria-label="X"><X size={16} /></a>
              <a href="#" aria-label="GitHub"><Code2 size={16} /></a>
            </div>
          </motion.div>

          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <div className="contact-form__row">
              <div className="field">
                <label htmlFor="name">Name <span aria-hidden="true">*</span></label>
                <input
                  id="name" name="name" type="text"
                  value={form.name} onChange={handleChange('name')}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  placeholder="Your full name"
                />
                {errors.name && <span id="name-error" className="field__error">{errors.name}</span>}
              </div>
              <div className="field">
                <label htmlFor="email">Email <span aria-hidden="true">*</span></label>
                <input
                  id="email" name="email" type="email"
                  value={form.email} onChange={handleChange('email')}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  placeholder="you@example.com"
                />
                {errors.email && <span id="email-error" className="field__error">{errors.email}</span>}
              </div>
            </div>

            <div className="field">
              <label htmlFor="subject">Subject <span aria-hidden="true">*</span></label>
              <input
                id="subject" name="subject" type="text"
                value={form.subject} onChange={handleChange('subject')}
                aria-invalid={!!errors.subject}
                aria-describedby={errors.subject ? 'subject-error' : undefined}
                placeholder="How can we help?"
              />
              {errors.subject && <span id="subject-error" className="field__error">{errors.subject}</span>}
            </div>

            <div className="field">
              <label htmlFor="message">Message <span aria-hidden="true">*</span></label>
              <textarea
                id="message" name="message" rows="5"
                value={form.message} onChange={handleChange('message')}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-error' : undefined}
                placeholder="Tell us a bit about your enquiry"
              />
              {errors.message && <span id="message-error" className="field__error">{errors.message}</span>}
            </div>

            <button type="submit" className="btn btn--gold btn--md contact-form__submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Sending…' : <>Send Message <Send size={16} /></>}
            </button>

            {status === 'success' && (
              <div className="form-status form-status--ok" role="status">
                <CheckCircle2 size={16} /> Your message was sent successfully.
              </div>
            )}
            {status === 'error' && (
              <div className="form-status form-status--err" role="alert">
                <AlertCircle size={16} />
                This frontend build is not connected to a working submission handler.
                Please email us directly at <strong>contact@q-prakrithi.example</strong>.
              </div>
            )}
          </motion.form>
        </div>
      </section>
    </>
  );
}