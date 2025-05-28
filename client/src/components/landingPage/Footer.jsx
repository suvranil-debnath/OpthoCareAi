import React from 'react';
import logo from '../../assets/logo.svg';
import './Footer.css';
const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-about">
        <div className="logo">
          <img src={logo} alt="BetterSight Logo" />
          <span>BetterSight</span>
        </div>
     
      </div>
      <div className="footer-links">
        <h4>Company</h4>
        <a href="#about">About Our Team</a>
        <a href="#team">Medical Resources</a>
        <a href="#careers">FAQ</a>
        <a href="#press">Support</a>
      </div>
      <div className="footer-links">
        <h4>Legal</h4>
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms of Service</a>
        <a href="#hipaa">HIPAA Compliance</a>
        <a href="#contact">Contact Us</a>
      </div>
      <div className="footer-social">
        <h4>Follow Our AI Journey</h4>
        <div className="social-icons">
          <a href="#twitter"><i className="fab fa-twitter"></i></a>
          <a href="#facebook"><i className="fab fa-facebook"></i></a>
          <a href="#linkedin"><i className="fab fa-linkedin"></i></a>
          <a href="#youtube"><i className="fab fa-youtube"></i></a>
        </div>
        <div className="app-stores">
          <button className="app-store">
            <i className="fab fa-apple"></i>
            <span>App Store</span>
          </button>
          <button className="app-store">
            <i className="fab fa-google-play"></i>
            <span>Google Play</span>
          </button>
        </div>
      </div>
    </div>
    <div className="footer-copyright">
      © {new Date().getFullYear()} BetterSight. All rights reserved.
    </div>
  </footer>
);

export default Footer;