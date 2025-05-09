import React from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiLock, FiCpu } from 'react-icons/fi';
import FeaturesSection1 from './FeaturesSection1';
import FeaturesSection2 from './FeaturesSection2';
import FeaturesSection3 from './FeaturesSection3';

const Features = () => {
  // Animation variants
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Feature card data
  const featureCards = [
    {
      icon: <FiActivity className="text-4xl text-blue-400" />,
      title: "Real-time Analytics",
      description: "Get live market data and performance metrics to make informed decisions."
    },
    {
      icon: <FiLock className="text-4xl text-purple-400" />,
      title: "Bank-grade Security",
      description: "Your assets are protected with military-grade encryption and secure storage."
    },
    {
      icon: <FiCpu className="text-4xl text-cyan-400" />,
      title: "Advanced Trading",
      description: "Access powerful tools for technical analysis and automated trading."
    }
  ];

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden bg-blue-dark/50 px-4">
      {/* Simplified background decoration */}
      <div className="absolute -top-40 right-0 w-60 h-60 bg-blue-500/5 rounded-full blur-[80px] z-0"></div>
      <div className="absolute -bottom-40 left-0 w-60 h-60 bg-purple-500/5 rounded-full blur-[80px] z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section heading */}
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Future-proof your portfolio
            </span>
          </h2>
          <p className="text-lg text-blue-100/80 max-w-2xl mx-auto">
            Market sentiments, portfolio management, and infrastructure built for the next generation of crypto investors.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24"
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featureCards.map((card, index) => (
            <motion.div
              key={index}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
              variants={itemVariant}
            >
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{card.title}</h3>
              <p className="text-blue-100/70">{card.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature sections */}
        <FeaturesSection1 />
        <FeaturesSection2 />
        <FeaturesSection3 />
      </div>
    </section>
  );
};

export default Features;
