export const addStyles = () => {
  if (typeof document !== 'undefined') {
    const styleId = 'social-portal-redesign-styles';
    
    if (!document.getElementById(styleId)) {
      const styleSheet = document.createElement('style');
      styleSheet.id = styleId;
      styleSheet.textContent = `
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -50px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        
        .bg-grid-white {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.02)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
        
        .bg-grid-16 {
          background-size: 16px 16px;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Hide scrollbar but keep functionality */
        .scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        
        /* Gradient text animation */
        .gradient-text {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
        
        /* Glass effect */
        .glass {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        
        /* Better tap targets on mobile */
        @media (max-width: 768px) {
          button, [role="button"] {
            min-height: 44px;
            min-width: 44px;
          }
        }
        
        /* Performance optimizations */
        .will-change-transform {
          will-change: transform;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }

        /* QR Code Animation */
        @keyframes qr-appear {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .qr-animation {
          animation: qr-appear 0.3s ease-out;
        }

        /* QR Code scanner lines animation */
        @keyframes scan-line {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        .scan-line {
          position: absolute;
          width: 100%;
          height: 2px;
          background: linear-gradient(to right, transparent, #00ff88, transparent);
          animation: scan-line 2s ease-in-out infinite;
        }

        /* QR Code pulsating effect */
        @keyframes qr-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.4);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(0, 255, 136, 0);
          }
        }

        .qr-pulse {
          animation: qr-pulse 2s infinite;
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }
};