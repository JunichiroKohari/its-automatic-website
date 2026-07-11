/* App composition for 鹿乃宿 LP */

const { React, ReactDOM } = window;
const { useState } = React;
const {
  TopNav,
  Hero,
  Problem,
  Empathy,
  Solution,
  Service,
  Strengths,
  Voice,
  Flow,
  FAQ,
  CTA,
  Footer,
  StickyReserve,
  BookingModal,
  SiteDisclaimer,
} = window;

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(true);
  const openModal = () => setModalOpen(true);

  return (
    <div>
      <TopNav onReserve={openModal} />
      <Hero onReserve={openModal} />
      <Problem />
      <Empathy />
      <Solution />
      <Service />
      <Strengths />
      <Voice />
      <Flow onReserve={openModal} />
      <FAQ />
      <CTA />
      <Footer />
      <StickyReserve onOpen={openModal} />
      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <SiteDisclaimer open={disclaimerOpen} onClose={() => setDisclaimerOpen(false)} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
