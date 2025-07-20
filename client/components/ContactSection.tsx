export function ContactSection() {
  return (
    <div className="section py-20 px-5 max-w-6xl mx-auto" id="contact">
      <h2 className="text-4xl font-bold mb-6 text-center">Get in Touch</h2>
      <p className="text-lg text-muted-foreground text-center max-w-4xl mx-auto mb-8">
        Ready to transform your ideas into reality? Connect with us to explore
        custom AI solutions, secure software, and more.
      </p>
      <div className="text-center space-x-4">
        <a
          href="https://github.com/FeexSystems?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 underline text-lg"
        >
          GitHub
        </a>
        <span className="text-muted-foreground">|</span>
        <a
          href="https://gamma.app/docs/FEEXSYSTEMS-HQ-jvm6gb3pbjss40a"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 underline text-lg"
        >
          Learn More
        </a>
      </div>
    </div>
  );
}
