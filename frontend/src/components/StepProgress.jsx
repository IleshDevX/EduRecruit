import { HiCheck, HiX } from 'react-icons/hi';

const StepProgress = ({ currentStatus }) => {
  const steps = ['Applied', 'Shortlisted', 'Interview', 'Selected'];
  const isRejected = currentStatus === 'Rejected';
  
  const getStepIndex = () => {
    if (isRejected) return -1;
    return steps.indexOf(currentStatus);
  };

  const currentIndex = getStepIndex();

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, index) => {
        const isCompleted = !isRejected && index <= currentIndex;
        const isCurrent = !isRejected && index === currentIndex;
        const isUpcoming = !isRejected && index > currentIndex;

        return (
          <div key={step} className="flex items-center">
            {/* Step Indicator */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isRejected && index === 0
                    ? 'bg-danger text-white'
                    : isCompleted
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'bg-border text-maintext'
                }`}
              >
                {isRejected && index === 0 ? (
                  <HiX className="w-4 h-4" />
                ) : isCompleted ? (
                  <HiCheck className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium whitespace-nowrap ${
                  isRejected && index === 0
                    ? 'text-danger'
                    : isCurrent
                    ? 'text-primary'
                    : isCompleted
                    ? 'text-primary'
                    : 'text-maintext'
                }`}
              >
                {isRejected && index === 0 ? 'Rejected' : step}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`w-8 h-0.5 mx-1 ${
                  isCompleted && index < currentIndex
                    ? 'bg-primary'
                    : 'bg-border'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepProgress;
