import {
  SKILLS_DESC,
  SKILLS_DESC_TITLE,
  SKILLS_LIST,
  SKILLS_SUBTITLE,
  SKILLS_TITLE,
} from "@/constants/ui";

const ExpertiseSection = () => {
  return (
    <section className="py-32 px-8 border-t border-cyan-500/20">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="text-xs font-mono text-cyan-400 tracking-widest">
                {SKILLS_TITLE}
              </div>
              <h2 className="text-3xl font-light font-mono">
                {SKILLS_SUBTITLE}
              </h2>
              <div className="h-px w-24 bg-gradient-to-r from-cyan-400 to-transparent"></div>
            </div>
          </div>
          <div className="space-y-12">
            <div className="space-y-8">
              <p className="text-lg leading-relaxed text-gray-300 font-light font-mono">
                {SKILLS_DESC_TITLE}
              </p>
              <p className="text-gray-400 leading-relaxed font-light">
                {SKILLS_DESC}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {SKILLS_LIST.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 group cursor-pointer"
                >
                  <div className="p-2 border border-cyan-500/30 group-hover:border-cyan-400 transition-all duration-300">
                    <item.icon size={20} className="text-cyan-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-mono text-white group-hover:text-cyan-300 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400 font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;
