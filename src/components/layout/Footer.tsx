import { CRAFTED } from "@/constants/content";
import { TRADEMARK } from "@/constants/personal";

const Footer = () => {
  return (
    <footer className="py-8 px-8 border-t" style={{ borderColor: 'var(--theme-border-primary)' }}>
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <p className="text-sm font-mono text-gray-500">{TRADEMARK}</p>
        <p className="text-sm font-mono text-gray-500">{CRAFTED}</p>
      </div>
    </footer>
  );
};

export default Footer;
