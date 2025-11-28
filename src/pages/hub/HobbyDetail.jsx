import { LazyMotion, m, domAnimation } from "framer-motion";
import useHobbyDetail from "./hooks/useHobbyDetail";
import DetailHeader from "./components/hobby-detail/DetailHeader";
import DetailMetadata from "./components/hobby-detail/DetailMetadata";
import DetailStats from "./components/hobby-detail/DetailStats";
import DetailTools from "./components/hobby-detail/DetailTools";
import DetailActions from "./components/hobby-detail/DetailActions";
import BackgroundGlow from "./components/shared/BackgroundGlow";
import NavigationButton from "./components/shared/NavigationButton";
import NotFound from "./components/shared/NotFound";

export default function HobbyDetail() {
  const {
    hobby,
    handleBack,
    handleStartActivity,
    handleSaveForLater,
    isHobbyFound
  } = useHobbyDetail();

  if (!isHobbyFound) {
    return <NotFound onBack={handleBack} message="Hobi tidak ditemukan" />;
  }

  return (
    <LazyMotion features={domAnimation}>
      <main className="relative min-h-screen bg-gradient-to-b from-[#0d111a] via-[#111726] to-[#0d111a] text-white overflow-hidden">
        <BackgroundGlow />
        
        <NavigationButton onBack={handleBack} />
        
        <div className="container mx-auto px-6 py-24 max-w-4xl">
          <DetailHeader hobby={hobby} />
          
          <div className="grid md:grid-cols-2 gap-8">
            <LeftColumn hobby={hobby} />
            <RightColumn 
              hobby={hobby}
              onStartActivity={handleStartActivity}
              onSaveForLater={handleSaveForLater}
            />
          </div>
        </div>
      </main>
    </LazyMotion>
  );
}

// Sub-components for better organization
function LeftColumn({ hobby }) {
  return (
    <m.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-6"
    >
      <DetailMetadata metadata={hobby.metadata} />
      <DetailTools tools={hobby.metadata.tools} />
    </m.div>
  );
}

function RightColumn({ hobby, onStartActivity, onSaveForLater }) {
  return (
    <m.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="space-y-6"
    >
      <DetailStats stats={hobby.stats} />
      <DetailActions 
        hobby={hobby}
        onStartActivity={onStartActivity}
        onSaveForLater={onSaveForLater}
      />
    </m.div>
  );
}