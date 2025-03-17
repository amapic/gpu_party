import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const ServicesSection = styled.section`
  padding: 80px 0;
  background-color: #000;
  color: #fff;
  opacity: ${props => props.visible ? 1 : 0};
  transform: translateY(${props => props.visible ? '0' : '50px'});
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
`;

const Title = styled.h2`
  font-size: 48px;
  margin-bottom: 60px;
  font-weight: 500;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ServiceCard = styled.div`
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  padding: 40px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  
  &:last-child {
    border-right: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const ServiceNumber = styled.span`
  font-size: 72px;
  font-weight: 300;
  margin-bottom: 40px;
`;

const ServiceTitle = styled.h3`
  font-size: 24px;
  font-weight: 500;
  line-height: 1.4;
  text-transform: uppercase;
`;

const Button = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  color: #fff;
  padding: 20px 40px;
  margin-top: 60px;
  cursor: pointer;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const services = [
  {
    number: "01",
    title: "AUDIT & IT CONSULTING"
  },
  {
    number: "02",
    title: "DIGITAL SOLUTION"
  },
  {
    number: "03",
    title: "DATA SOLUTION"
  },
  {
    number: "04",
    title: "MARKETING & BRANDING"
  }
];

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Mettre à jour la visibilité quand l'élément entre dans la vue
        setIsVisible(entry.isIntersecting);
      },
      {
        // Options de l'observer
        threshold: 0.1, // Déclencher quand 10% de l'élément est visible
        rootMargin: '-100px', // Déclencher un peu avant que l'élément soit visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <ServicesSection ref={sectionRef} visible={isVisible}>
      <Title>360° SERVICES</Title>
      
      <ServicesGrid>
        {services.map((service) => (
          <ServiceCard key={service.number}>
            <ServiceNumber>{service.number}</ServiceNumber>
            <ServiceTitle>{service.title}</ServiceTitle>
          </ServiceCard>
        ))}
      </ServicesGrid>

      <Button>
        <span>OUR SERVICES</span>
        <span>OPEN</span>
      </Button>
    </ServicesSection>
  );
};

export default Services; 