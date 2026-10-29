"use client";

import { useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import ArchitectureNatureStory from "@/components/ArchitectureNatureStory";
import AmenitiesSection from "@/components/AmenitiesSection";
import FloorPlansSection from "@/components/FloorPlansSection";
import GallerySection from "@/components/GallerySection";
import EnquirySection from "@/components/EnquirySection";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";
import EnquiryModal from "@/components/EnquiryModal";
import VideoModal from "@/components/VideoModal";
import LightboxModal, { type LightboxItem } from "@/components/LightboxModal";
import FloatingActions from "@/components/FloatingActions";

import OpeningLogoAnimation from "@/components/OpeningLogoAnimation";
import { siteContent } from "@/data/siteContent";

export default function Home() {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryTitle, setEnquiryTitle] = useState("Register your interest");
  const [enquiryFormTitle, setEnquiryFormTitle] = useState("Register Your Interest");
  const enquiryTriggerRef = useRef<HTMLButtonElement | null>(null);
  const floatingEnquiryRef = useRef<HTMLButtonElement>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const [lightboxItems, setLightboxItems] = useState<LightboxItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxTriggerRef = useRef<HTMLElement | null>(null);

  const openRegister = (
    title: string = "Register Your Interest",
    trigger?: HTMLButtonElement | null
  ) => {
    enquiryTriggerRef.current =
      trigger ?? floatingEnquiryRef.current ?? enquiryTriggerRef.current;
    setEnquiryTitle("Register your interest");
    setEnquiryFormTitle(title);
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

      <Navbar onOpenRegister={() => openRegister("Register Now")} />

      <HeroSection onOpenEnquiry={() => openRegister("Register Your Interest")} />

      <IntroSection onOpenBrochure={() => openRegister("Register Interest")} />

      <ArchitectureNatureStory onPlayVideo={() => setIsVideoOpen(true)} />

      <AmenitiesSection onOpenAmenities={() => openRegister("Amenities Enquiry")} />

      <FloorPlansSection
        onOpenPlans={() => openRegister("Request Floor Plans")}
        onOpenLightbox={openLightbox}
      />

      <GallerySection onOpenLightbox={openLightbox} />

      <EnquirySection
        onOpenEnquiry={(trigger) => openRegister("Enquiry", trigger)}
      />

      <LocationSection />

      <Footer onOpenEnquiry={(trigger) => openRegister("Enquiry", trigger)} />

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
          openRegister("Register Your Interest", floatingEnquiryRef.current)
        }
        enquiryButtonRef={floatingEnquiryRef}
        isEnquiryOpen={isEnquiryOpen}
      />
    </main>
  );
}
