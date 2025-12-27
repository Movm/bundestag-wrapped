import { memo } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { SlideContainer, itemVariants } from '../shared';

const GITHUB_REPO_URL = 'https://github.com/Movm/bundestag-wrapped';

function GitHubIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

interface EndSlideProps {
  onRestart?: () => void;
}

const socialLinks = [
  {
    href: 'https://github.com/Movm/bundestag-wrapped',
    icon: GitHubIcon,
    label: 'GitHub',
  },
  {
    href: 'https://www.linkedin.com/in/moritz-w%C3%A4chter-6ab033210/',
    icon: LinkedInIcon,
    label: 'LinkedIn',
  },
  {
    href: 'https://x.com/MoritzWaech',
    icon: XIcon,
    label: 'X (Twitter)',
  },
  {
    href: 'https://www.instagram.com/moritz_waechter/',
    icon: InstagramIcon,
    label: 'Instagram',
  },
];

export const EndSlide = memo(function EndSlide({ onRestart }: EndSlideProps) {
  return (
    <SlideContainer
      innerClassName="max-w-md md:max-w-4xl lg:max-w-5xl"
      className="relative overflow-hidden"
    >
      {/* Desktop: side-by-side | Mobile: stacked */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-12 lg:gap-16">
        {/* Author Photo - Left on desktop */}
        <motion.div
          variants={itemVariants}
          className="mb-6 md:mb-0 md:flex-shrink-0 flex justify-center md:justify-start"
        >
          <motion.img
            src="/author.jpg"
            alt="Moritz Wächter"
            className="w-24 h-24 md:w-40 md:h-52 lg:w-44 lg:h-56 rounded-2xl md:rounded-3xl object-cover shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', bounce: 0.3 }}
          />
        </motion.div>

        {/* Content - Right on desktop */}
        <div className="flex-1 text-center md:text-left">
          {/* Das war Bundestag Wrapped - End indicator */}
          <motion.p
            variants={itemVariants}
            className="text-white/50 text-sm md:text-base uppercase tracking-widest mb-2"
          >
            Das war
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-2xl md:text-4xl lg:text-5xl font-black gradient-text mb-4"
          >
            Bundestag Wrapped
          </motion.h2>

          {/* Personal Message */}
          <motion.div variants={itemVariants} className="mb-6">
            <p className="text-white/80 text-sm md:text-lg leading-relaxed mb-3">
              Mir ist es wichtig zu betonen: Alle demokratischen Politiker:innen
              leisten harte Arbeit für unser Land – unabhängig von ihrer Partei.
            </p>
            <p className="hidden md:block text-white/60 text-sm md:text-base">
              Dies ist ein Spaßprojekt und keine wissenschaftliche Analyse. Mehr
              zur Methodik findest du in der Dokumentation oder auf GitHub.
            </p>
          </motion.div>

          {/* Social Icons */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center md:justify-start gap-3 mb-6"
          >
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all hover:scale-110"
                aria-label={link.label}
              >
                <link.icon />
              </a>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center md:justify-start gap-3"
          >
            <Link
              to="/dokumentation"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-full text-white font-semibold transition-all hover:scale-105 text-sm"
            >
              <span className="hidden md:inline">📖</span>
              Dokumentation
            </Link>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-full text-white font-semibold transition-all hover:scale-105 text-sm"
            >
              <GitHubIcon />
              GitHub
            </a>
            <button
              onClick={onRestart}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-500 hover:bg-pink-600 rounded-full text-white font-semibold transition-all hover:scale-105 text-sm"
            >
              Nochmal starten
            </button>
            <Link
              to="/abgeordnete"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-full text-white font-semibold transition-all hover:scale-105 text-sm"
            >
              Abgeordnete
            </Link>
          </motion.div>
        </div>
      </div>
    </SlideContainer>
  );
});
