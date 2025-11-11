import React from "react";
import "./contact.css";
import "../../components/footer/Footer.css";
import Header from "../../components/header/Header";
import Body from "../../components/body/Body";
import imgContact from "../../assets/images/contact.png";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/button/Button";

function Contact({ img = imgContact, alt = "Contact img" }) {
  return (
    <div className="contact-page">
      <div className="container-contact animate__animated animate__fadeInDown animate__fast">
        <Header className="header-contact">
          <i className="fa-solid fa-file-signature"></i>
          <h1>Contact with us!</h1>
        </Header>

        <Body className="container-contact-content">
          <div className="content-top">
            <div className="text-content-top">
              <h2>We are always ready to support you!</h2>
              <h3>
                Let's contact us via the channels below or send your comments
                directly.
              </h3>
            </div>
            <img className="img-contact" src={img} alt={alt} />
          </div>

          <div className="container-cards-contact">
            <div className="content-email-contact">
              <div className="icon-email">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <h2>Email</h2>
              <p>abc@todolist.com</p>
              <p>Respond in 24 hours</p>
            </div>

            <div className="content-hotline-contact">
              <div className="icon-hotline">
                <i className="fa-solid fa-phone"></i>
              </div>
              <h2>Hotline</h2>
              <p>1900 123 456</p>
              <p>8:00 - 20:00 (Thứ 2 - Chủ nhật)</p>
            </div>

            <div className="content-office-contact">
              <div className="icon-office">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <h2>Office</h2>
              <p>123 Đường ABC, Quận XYZ, TP. Da Nang</p>
              <p>8:00 - 17:00 (Thứ 2 - Thứ 6)</p>
            </div>
          </div>

          <div className="footer-content-top">
            <i className="fa-solid fa-globe"></i>
            <h1>Connect with us!</h1>
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
                  <i class="fa-brands fa-instagram"></i>
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
