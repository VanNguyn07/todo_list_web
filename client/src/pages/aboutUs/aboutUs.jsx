import React from "react";
import "./aboutUs.css";
import "../../components/footer/Footer.css";
import Header from "../../components/header/Header";
import Body from "../../components/body/Body";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/button/Button";
import logo from "../../assets/images/logo.png";

function AboutUs() {
  return (
    <div className="about-page">
      <div className="container-about animate__animated animate__fadeInDown animate__fast">
        <Header className="header-about">
          <i className="fa-solid fa-circle-info"></i>
          <h1>About Us</h1>
        </Header>

        <Body className="container-about-content">
          <div className="content-top-about">
            <div className="text-content-top-about">
              <h2>Welcome to Todo List!</h2>
              <h3>
                Your ultimate productivity companion designed to help you
                organize, prioritize, and achieve your goals with ease.
              </h3>
            </div>
            <img className="img-about" src={logo} alt="Todo List Logo" />
          </div>

          <div className="mission-section">
            <div className="mission-icon">
              <i className="fa-solid fa-bullseye"></i>
            </div>
            <div className="mission-content">
              <h2>Our Mission</h2>
              <p>
                To empower individuals and teams to be more productive, organized,
                and successful by providing an intuitive, feature-rich task
                management platform that adapts to your workflow.
              </p>
            </div>
          </div>

          <div className="features-section">
            <div className="features-header">
              <i className="fa-solid fa-star"></i>
              <h2>Key Features</h2>
            </div>
            <div className="container-features-cards">
              <div className="feature-card">
                <div className="icon-feature">
                  <i className="fa-solid fa-list-check"></i>
                </div>
                <h3>Task Management</h3>
                <p>
                  Create, organize, and track your tasks with categories,
                  priorities, and deadlines.
                </p>
              </div>

              <div className="feature-card">
                <div className="icon-feature">
                  <i className="fa-solid fa-hourglass-half"></i>
                </div>
                <h3>Pomodoro Timer</h3>
                <p>
                  Boost your productivity with the proven Pomodoro technique
                  for focused work sessions.
                </p>
              </div>

              <div className="feature-card">
                <div className="icon-feature">
                  <i className="fa-solid fa-chart-pie"></i>
                </div>
                <h3>Analytics</h3>
                <p>
                  Visualize your progress with detailed charts and insights
                  into your productivity patterns.
                </p>
              </div>

              <div className="feature-card">
                <div className="icon-feature">
                  <i className="fa-solid fa-fire"></i>
                </div>
                <h3>Streak Tracking</h3>
                <p>
                  Build consistency with streak tracking to maintain your
                  momentum and stay motivated.
                </p>
              </div>

              <div className="feature-card">
                <div className="icon-feature">
                  <i className="fa-solid fa-calendar-days"></i>
                </div>
                <h3>Calendar Integration</h3>
                <p>
                  Plan your schedule effectively with our integrated calendar
                  widget.
                </p>
              </div>

              <div className="feature-card">
                <div className="icon-feature">
                  <i className="fa-solid fa-note-sticky"></i>
                </div>
                <h3>Quick Notes</h3>
                <p>
                  Capture your thoughts instantly with quick notes that sync
                  across all your devices.
                </p>
              </div>
            </div>
          </div>

          <div className="values-section">
            <div className="values-header">
              <i className="fa-solid fa-heart"></i>
              <h2>Our Values</h2>
            </div>
            <div className="container-values-cards">
              <div className="value-card">
                <div className="icon-value">
                  <i className="fa-solid fa-users"></i>
                </div>
                <h3>User-Centric</h3>
                <p>We put our users first in every decision we make.</p>
              </div>

              <div className="value-card">
                <div className="icon-value">
                  <i className="fa-solid fa-lightbulb"></i>
                </div>
                <h3>Innovation</h3>
                <p>Continuously improving with cutting-edge features.</p>
              </div>

              <div className="value-card">
                <div className="icon-value">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <h3>Reliability</h3>
                <p>Your data is safe and your tasks are always accessible.</p>
              </div>
            </div>
          </div>

          <div className="footer-content-about">
            <i className="fa-solid fa-handshake"></i>
            <h1>Join thousands of users achieving their goals!</h1>
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

export default AboutUs;

