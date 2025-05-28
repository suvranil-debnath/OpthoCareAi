import React from 'react';
import './TestimonialsSection.css';
const testimonials = [
  {
    text: "BetterSight's AI detected early signs of glaucoma that my regular checkup missed. The specialist it recommended confirmed the diagnosis and said early detection saved my vision.",
    avatar: "https://avatar.iran.liara.run/public/96",
    name: "Sarah J.",
    location: "New York, USA",
    rating: 5
  },
  {
    text: "As a diabetic, I need to monitor my eyes carefully. BetterSight's AI tracks subtle changes between my monthly photos and alerts me to anything concerning before it becomes serious.",
    avatar: "https://avatar.iran.liara.run/public/11",
    name: "Michael T.",
    location: "London, UK",
    rating: 5
  },
  {
    text: "The AI chat answered all my questions about my child's conjunctivitis at 2AM when no doctor was available. It was accurate, reassuring, and even reminded me when to follow up.",
    avatar: "https://avatar.iran.liara.run/public/47",
    name: "Priya K.",
    location: "Mumbai, India",
    rating: 4.5
  },
  {
    text: "As a diabetic, I need to monitor my eyes carefully. BetterSight's AI tracks subtle changes between my monthly photos and alerts me to anything concerning before it becomes serious.",
    avatar: "https://avatar.iran.liara.run/public/11",
    name: "Michael T.",
    location: "London, UK",
    rating: 5
  }
];

const TestimonialsSection = () => (
  <section className="testimonials-section">
    <h2>Trusted by Users Worldwide</h2>
    <p className="section-subtitle">Join thousands who have transformed their eye care with our AI technology</p>
    <div className="testimonials-grid">
      {testimonials.map((testimonial, index) => (
        <TestimonialCard key={index} {...testimonial} />
      ))}
    </div>
  </section>
);

const TestimonialCard = ({ text, avatar, name, location, rating }) => (
  <div className="testimonial-card">
    <div className="testimonial-text">{text}</div>
    <div className="testimonial-author">
      <img className="testimonial-avatar" src={avatar} alt="User Avatar" />
      <div>
        <h4>{name}</h4>
        <p>{location}</p>
        <div className="testimonial-rating">
          {[...Array(5)].map((_, i) => (
            <i 
              key={i} 
              className={`fas fa-star${i >= rating ? '' : i === Math.floor(rating) && rating % 1 !== 0 ? '-half-alt' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default TestimonialsSection;