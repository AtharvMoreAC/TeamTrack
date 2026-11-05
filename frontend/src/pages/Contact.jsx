function Contact() {
  return (
    <div className="contact-container">
      <h1>Contact Us</h1>

      <p className="contact-intro">
        Have questions or suggestions? We would love to hear from you!
      </p>

      <div className="contact-content">
        <div className="contact-card">
          <h2>Get in Touch</h2>

          <p>
            If you have any queries regarding TeamTrack,
            feel free to contact our project team.
          </p>

          <div className="contact-info">
            <p>
              <strong>Project:</strong> TeamTrack
            </p>

            <p>
              <strong>Purpose:</strong> College Project Management System
            </p>

            <p>
              <strong>Email:</strong> teamtrack@gmail.com
            </p>

            <p>
              <strong>Location:</strong> Maharashtra, India
            </p>
          </div>
        </div>

        <div className="contact-card">
          <h2>Our Support</h2>

          <p>
            We aim to make project management easier for
            students and guides. Your feedback helps us
            improve TeamTrack.
          </p>

          <div className="contact-highlight">
            Thank you for using TeamTrack!
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
