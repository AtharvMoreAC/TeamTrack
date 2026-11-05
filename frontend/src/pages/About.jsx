function About() {
  return (
    <div className="about-container">
      <h1>About TeamTrack</h1>

      <p className="about-intro">
        TeamTrack is a web-based project management system designed
        to simplify and organize group projects.
      </p>

      <section className="about-section">
        <h2>Our Purpose</h2>
        <p>
          Managing college group projects can be challenging.
          Students often struggle with task distribution, deadlines,
          and tracking project progress.
          TeamTrack provides a centralized platform where students
          can collaborate, manage tasks, and complete projects
          efficiently.
        </p>
      </section>

      <section className="about-section">
        <h2>Key Features</h2>
        <ul>
          <li>Team creation and member management</li>
          <li>Task assignment and priority management</li>
          <li>Task status tracking</li>
          <li>Project phase and deadline management</li>
          <li>Separate Guide and Member dashboards</li>
          <li>Project progress monitoring</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Technologies Used</h2>
        <div className="tech-list">
          <span>React.js</span>
          <span>Node.js</span>
          <span>Express.js</span>
          <span>MySQL</span>
          <span>HTML</span>
          <span>CSS</span>
        </div>
      </section>

      <section className="about-section">
        <h2>Our Goal</h2>
        <p>
          Our goal is to improve teamwork, accountability,
          and productivity among students by making project
          management simple and effective.
        </p>
      </section>
    </div>
  );
}

export default About;
