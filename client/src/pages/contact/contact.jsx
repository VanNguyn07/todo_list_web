import React, { useState } from "react";
import "./contact.css";
import "../../components/footer/Footer.css";
import Header from "../../components/header/Header";
import Body from "../../components/body/Body";
import imgContact from "../../assets/images/contact.png";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import Textarea from "../../components/textArea/Textarea";

function Contact({ img = imgContact, alt = "Contact img" }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    message: "",
    type: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        submitted: true,
        message: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        submitted: true,
        message: "Please enter a valid email address.",
        type: "error",
      });
      return;
    }

    // Simulate form submission (you can connect this to your backend)
    setFormStatus({
      submitted: true,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
      type: "success",
    });

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setFormStatus({
        submitted: false,
        message: "",
        type: "",
      });
    }, 3000);
  };

  return (
    <div className="contact-page">
      <div className="container-contact animate__animated animate__fadeInDown animate__fast">
        <Header className="header-contact">
          <i className="fa-solid fa-file-signature"></i>
          <h1>Contact with us!</h1>
        </Header>

        <Body className="container-contact-content">
          <div className="content-top">
            <div className="content-top-background">
              <div className="content-top-decoration"></div>
            </div>
            <div className="content-top-wrapper">
              <div className="text-content-top">
                <div className="content-badge">
                  <i className="fa-solid fa-heart"></i>
                  <span>Customer First</span>
                </div>
                <h2>
                  <span className="highlight-text">We are always ready</span> to support you!
                </h2>
                <h3>
                  Have questions, feedback, or need assistance? We're here to help!
                  Reach out through any channel below or send us a message directly.
                  <span className="emphasis-text"> Your success is our priority.</span>
                </h3>
                <div className="content-features">
                  <div className="content-feature-item">
                    <i className="fa-solid fa-clock"></i>
                    <span>24/7 Support</span>
                  </div>
                  <div className="content-feature-item">
                    <i className="fa-solid fa-shield-halved"></i>
                    <span>Secure & Reliable</span>
                  </div>
                  <div className="content-feature-item">
                    <i className="fa-solid fa-rocket"></i>
                    <span>Fast Response</span>
                  </div>
                </div>
              </div>
              <div className="img-wrapper">
                <div className="img-decoration-circle circle-1"></div>
                <div className="img-decoration-circle circle-2"></div>
                <div className="img-decoration-circle circle-3"></div>
                <img className="img-contact" src={img} alt={alt} />
              </div>
            </div>
          </div>

          <div className="why-contact-section">
            <div className="why-contact-header">
              <i className="fa-solid fa-question-circle"></i>
              <h2>Why Contact Us?</h2>
            </div>
            <div className="why-contact-cards">
              <div className="why-contact-card">
                <i className="fa-solid fa-headset"></i>
                <h3>24/7 Support</h3>
                <p>Get help whenever you need it with our dedicated support team</p>
              </div>
              <div className="why-contact-card">
                <i className="fa-solid fa-lightbulb"></i>
                <h3>Feature Requests</h3>
                <p>Share your ideas to help us improve the platform</p>
              </div>
              <div className="why-contact-card">
                <i className="fa-solid fa-bug"></i>
                <h3>Report Issues</h3>
                <p>Found a bug? Let us know and we'll fix it quickly</p>
              </div>
              <div className="why-contact-card">
                <i className="fa-solid fa-comments"></i>
                <h3>Feedback</h3>
                <p>Your opinion matters! Help us make Todo List better</p>
              </div>
            </div>
          </div>

          <div className="container-cards-contact">
            <div className="content-email-contact">
              <div className="icon-email">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <h2>Email</h2>
              <p className="contact-info">abc@todolist.com</p>
              <p className="contact-desc">Respond in 24 hours</p>
              <p className="contact-note">Best for detailed inquiries and documentation</p>
            </div>

            <div className="content-hotline-contact">
              <div className="icon-hotline">
                <i className="fa-solid fa-phone"></i>
              </div>
              <h2>Hotline</h2>
              <p className="contact-info">1900 123 456</p>
              <p className="contact-desc">8:00 - 20:00 (Thứ 2 - Chủ nhật)</p>
              <p className="contact-note">Immediate assistance for urgent matters</p>
            </div>

            <div className="content-office-contact">
              <div className="icon-office">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <h2>Office</h2>
              <p className="contact-info">123 Đường ABC, Quận XYZ, TP. Da Nang</p>
              <p className="contact-desc">8:00 - 17:00 (Thứ 2 - Thứ 6)</p>
              <p className="contact-note">Visit us for in-person consultations</p>
            </div>
          </div>

          <div className="contact-form-section">
            <div className="form-header">
              <i className="fa-solid fa-paper-plane"></i>
              <h2>Send us a Message</h2>
              <p>Fill out the form below and we'll respond as soon as possible</p>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    Full Name <span className="required">*</span>
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    Email Address <span className="required">*</span>
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="What is this regarding?"
                  value={formData.subject}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">
                  Message <span className="required">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows="6"
                  placeholder="Tell us how we can help you..."
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                />
              </div>
              </div>
              {formStatus.submitted && (
                <div className={`form-message ${formStatus.type}`}>
                  <i
                    className={
                      formStatus.type === "success"
                        ? "fa-solid fa-check-circle"
                        : "fa-solid fa-exclamation-circle"
                    }
                  ></i>
                  {formStatus.message}
                </div>
              )}
              <Button type="submit" className="submit-btn">
                <i className="fa-solid fa-paper-plane"></i>
                Send Message
              </Button>
            </form>
          </div>

          <div className="faq-section">
            <div className="faq-header">
              <i className="fa-solid fa-circle-question"></i>
              <h2>Frequently Asked Questions</h2>
            </div>
            <div className="faq-container">
              <div className="faq-item">
                <div className="faq-question">
                  <i className="fa-solid fa-q"></i>
                  <h3>How quickly will I receive a response?</h3>
                </div>
                <div className="faq-answer">
                  <p>
                    We typically respond to all inquiries within 24 hours during
                    business days. For urgent matters, please call our hotline
                    for immediate assistance.
                  </p>
                </div>
              </div>
              <div className="faq-item">
                <div className="faq-question">
                  <i className="fa-solid fa-q"></i>
                  <h3>Can I request a new feature?</h3>
                </div>
                <div className="faq-answer">
                  <p>
                    Absolutely! We love hearing from our users. Send us your
                    feature request through the contact form or email, and our
                    team will review it for future updates.
                  </p>
                </div>
              </div>
              <div className="faq-item">
                <div className="faq-question">
                  <i className="fa-solid fa-q"></i>
                  <h3>What should I do if I find a bug?</h3>
                </div>
                <div className="faq-answer">
                  <p>
                    Please report bugs immediately through our contact form.
                    Include as much detail as possible (steps to reproduce,
                    screenshots, browser/device info) to help us fix it quickly.
                  </p>
                </div>
              </div>
              <div className="faq-item">
                <div className="faq-question">
                  <i className="fa-solid fa-q"></i>
                  <h3>Do you offer technical support?</h3>
                </div>
                <div className="faq-answer">
                  <p>
                    Yes! Our support team is available via email, hotline, or
                    through the contact form. We provide assistance with account
                    setup, feature usage, troubleshooting, and more.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-content-top">
            <i className="fa-solid fa-globe"></i>
            <h1>Connect with us on social media!</h1>
          </div>

          <Footer className="footer-pages">
            <p>&copy; {new Date().getFullYear()} My todo - list web</p>
            <div className="social-icons">
              <Button className="social-btn btn-Facebook">
                <a
                  href="https://www.facebook.com/share/1AD9oX3wBW/"
                  className="facebook"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
              </Button>

              <Button className="social-btn btn-Ig">
                <a
                  href="https://www.instagram.com/zan_nguyn07/?hl=en"
                  className="instagram"
                >
                  <i className="fa-brands fa-instagram"></i>
                </a>
              </Button>

              <Button className="social-btn btn-Github">
                <a href="https://github.com/VanNguyn07" className="github">
                  <i className="fa-brands fa-github"></i>
                </a>
              </Button>

              <Button className="social-btn btn-Linkedin">
                <a href="#" className="linkedin">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </Button>
            </div>
          </Footer>
        </Body>
      </div>
    </div>
  );
}

export default Contact;
