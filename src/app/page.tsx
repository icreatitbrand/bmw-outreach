import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { WhoItsFor } from "@/components/who-its-for";
import { IntroVideo } from "@/components/intro-video";
import { Coordinator } from "@/components/coordinator";
import { HowItWorks } from "@/components/how-it-works";
import { SignupForm } from "@/components/signup-form";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/scroll-reveal";

/**
 * Single-page landing site for Businessmen & Women Outreach.
 * Section order follows PRD §4: Header, Hero, Who It's For, Intro Video,
 * A Word from the Coordinator, How It Works, Sign-Up Form, Footer.
 * Sections below the hero fade/lift into view via scroll-reveal.
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Reveal>
          <WhoItsFor />
        </Reveal>
        <Reveal>
          <IntroVideo />
        </Reveal>
        <Reveal>
          <Coordinator />
        </Reveal>
        <Reveal>
          <HowItWorks />
        </Reveal>
        <Reveal>
          <SignupForm />
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
