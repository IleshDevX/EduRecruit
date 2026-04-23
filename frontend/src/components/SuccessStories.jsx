import { motion } from 'framer-motion';
import {
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineShieldCheck,
} from 'react-icons/hi';

const stories = [
  {
    icon: HiOutlineAcademicCap,
    name: 'Priya Patel',
    role: 'Student, Information Technology',
    quote:
      'The application tracker helped me stay focused and prepared for each interview round.',
  },
  {
    icon: HiOutlineBriefcase,
    name: 'Ananya Rao',
    role: 'Campus Recruiter, TechCorp',
    quote:
      'Shortlisting candidates by eligibility criteria saved us hours in every hiring cycle.',
  },
  {
    icon: HiOutlineShieldCheck,
    name: 'Placement Cell Team',
    role: 'Admin Panel Users',
    quote:
      'Approvals, notifications, and reports are now centralized, reliable, and easy to audit.',
  },
];

const SuccessStories = () => {
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 lg:mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Success Stories
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-dark mt-3 mb-4">
            Real Outcomes Across Campus Hiring
          </h2>
          <p className="text-maintext max-w-2xl mx-auto text-lg">
            Hear how students, recruiters, and placement teams use EduRecruit to deliver better placements.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {stories.map((story, index) => (
            <motion.article
              key={story.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-2xl border border-border bg-background p-7 lg:p-8 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <story.icon className="w-6 h-6" />
              </div>
              <p className="text-maintext leading-relaxed mb-5">"{story.quote}"</p>
              <p className="font-semibold text-dark">{story.name}</p>
              <p className="text-sm text-maintext">{story.role}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;