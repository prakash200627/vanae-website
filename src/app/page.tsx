"use client";

import { useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import ArchitectureNatureStory from "@/components/ArchitectureNatureStory";
import LifestyleSection from "@/components/LifestyleSection";
import FloorPlansSection from "@/components/FloorPlansSection";
import GallerySection from "@/components/GallerySection";
import EnquirySection from "@/components/EnquirySection";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";
import EnquiryModal from "@/components/EnquiryModal";
import VideoModal from "@/components/VideoModal";
import LightboxModal, { type LightboxItem } from "@/components/LightboxModal";
import FloatingActions from "@/components/FloatingActions";
import Chatbot from "@/components/chatbot/Chatbot";
import OpeningLogoAnimation from "@/components/OpeningLogoAnimation";
import { siteContent } from "@/data/siteContent";

export default function Home() {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [enquiryTitle, setEnquiryTitle] = useState("Enquire about Vanae");
  const [enquiryFormTitle, setEnquiryFormTitle] = useState("Your enquiry");
  const enquiryTriggerRef = useRef<HTMLButtonElement | null>(null);
  const floatingEnquiryRef = useRef<HTMLButtonElement>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const [lightboxItems, setLightboxItems] = useState<LightboxItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxTriggerRef = useRef<HTMLElement | null>(null);

  const openEnquiry = (
    formTitle: string = "Your enquiry",
    options?: { isRegister?: boolean; trigger?: HTMLButtonElement | null }
  ) => {
    enquiryTriggerRef.current =
      options?.trigger ?? floatingEnquiryRef.current ?? enquiryTriggerRef.current;
    setEnquiryTitle(
      options?.isRegister ? "Register your interest" : "Enquire about Vanae"
    );
    setEnquiryFormTitle(formTitle);
    setIsEnquiryOpen(true);
  };

  const openLightbox = (
    items: LightboxItem[],
    index: number,
    trigger: HTMLElement | null
  ) => {
    lightboxTriggerRef.current = trigger;
    setLightboxItems(items);
    setLightboxIndex(index);
  };

  return (
    <main className="min-h-screen bg-forest-nearBlack text-white">
      <OpeningLogoAnimation />

      <Navbar
        onOpenRegister={() =>
          openEnquiry("Register Now", { isRegister: true })
        }
      />

      <HeroSection />

      <IntroSection />

      <ArchitectureNatureStory onPlayVideo={() => setIsVideoOpen(true)} />

      <LifestyleSection
        onOpenEnquire={() => openEnquiry("Amenities enquiry")}
      />

      <FloorPlansSection
        onOpenPlans={() => openEnquiry("Request floor plans")}
        onOpenLightbox={openLightbox}
      />

      <LocationSection />

      <GallerySection onOpenLightbox={openLightbox} />

      <EnquirySection
        onOpenEnquiry={(trigger) =>
          openEnquiry("Your enquiry", { trigger })
        }
      />

      <Footer
        onOpenEnquiry={(trigger) =>
          openEnquiry("Your enquiry", { trigger })
        }
      />

      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        title={enquiryTitle}
        formTitle={enquiryFormTitle}
        triggerRef={enquiryTriggerRef}
      />

      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl={siteContent.verticalEcosystem.videoUrl}
      />

      <LightboxModal
        items={lightboxItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
        triggerRef={lightboxTriggerRef}
      />

      <FloatingActions
        onOpenEnquiry={() =>
          openEnquiry("Your enquiry", {
            trigger: floatingEnquiryRef.current,
          })
        }
        enquiryButtonRef={floatingEnquiryRef}
        isEnquiryOpen={isEnquiryOpen}
        isChatOpen={isChatOpen}
      />

      <Chatbot
        isEnquiryOpen={isEnquiryOpen}
        open={isChatOpen}
        onOpenChange={setIsChatOpen}
      />
    </main>
  );
}
