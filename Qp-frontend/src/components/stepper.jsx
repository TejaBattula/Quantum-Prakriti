import {
    Children,
    isValidElement,
    useCallback,
    useEffect,
    useMemo,
    useState,
  } from 'react';
  
  import { motion, AnimatePresence } from 'framer-motion';
  
  import {
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
  } from 'lucide-react';
  
  import './stepper.css';
  
  export function Step({ children }) {
    return <div className="stepper__step">{children}</div>;
  }
  
  export default function Stepper({
    children,
    initialStep = 1,
    onStepChange = () => {},
    onFinalStepCompleted = () => {},
    backButtonText = 'Back',
    nextButtonText = 'Continue',
    completeButtonText = 'Complete',
    indicator = 'numbers',
    orientation = 'horizontal',
    linear = true,
    transition = 'slide',
    theme = 'dark',
    accentColor = '#d4af37',
    frame = true,
    radius = 18,
    width = '100%',
    className = '',
    nextButtonProps = {},
    backButtonProps = {},
    completedContent = null,
  }) {
    const steps = useMemo(
      () =>
        Children.toArray(children).filter(isValidElement),
      [children]
    );
  
    const totalSteps = steps.length;
  
    const [currentStep, setCurrentStep] = useState(() =>
      Math.min(Math.max(initialStep, 1), Math.max(totalSteps, 1))
    );
  
    const [completed, setCompleted] = useState(false);
    const [direction, setDirection] = useState(1);
  
    // Extract custom handlers so they don't overwrite Stepper logic.
    const {
      onClick: customNextClick,
      ...nextButtonRest
    } = nextButtonProps;
  
    const {
      onClick: customBackClick,
      ...backButtonRest
    } = backButtonProps;
  
    useEffect(() => {
      setCurrentStep((previous) =>
        Math.min(
          Math.max(previous, 1),
          Math.max(totalSteps, 1)
        )
      );
    }, [totalSteps]);
  
    const activeStep = steps[currentStep - 1];
  
    const goToStep = useCallback(
      (step) => {
        if (step < 1 || step > totalSteps) return;
  
        setDirection(step > currentStep ? 1 : -1);
        setCurrentStep(step);
        onStepChange(step);
      },
      [currentStep, onStepChange, totalSteps]
    );
  
    const goBack = () => {
      if (completed) {
        setCompleted(false);
        return;
      }
  
      if (currentStep > 1) {
        goToStep(currentStep - 1);
      }
    };
  
    const goNext = (event) => {
      customNextClick?.(event);
  
      if (event.defaultPrevented) return;
  
      if (currentStep < totalSteps) {
        goToStep(currentStep + 1);
        return;
      }
  
      // Allow the parent to prevent completion if validation fails.
      const result = onFinalStepCompleted();
  
      if (result === false) return;
  
      setCompleted(true);
    };
  
    const getStepStatus = (stepNumber) => {
      if (stepNumber < currentStep) return 'completed';
      if (stepNumber === currentStep) return 'active';
      return 'upcoming';
    };
  
    const variants = {
      enter: (dir) => ({
        opacity: 0,
        x: transition === 'slide' ? dir * 35 : 0,
        y: transition === 'slide' ? 0 : 12,
      }),
  
      center: {
        opacity: 1,
        x: 0,
        y: 0,
      },
  
      exit: (dir) => ({
        opacity: 0,
        x: transition === 'slide' ? dir * -35 : 0,
        y: transition === 'slide' ? 0 : -12,
      }),
    };
  
    if (!totalSteps) return null;
  
    return (
      <div
        className={[
          'stepper',
          `stepper--${orientation}`,
          `stepper--${theme}`,
          frame ? 'stepper--frame' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          width,
          '--stepper-accent': accentColor,
          '--stepper-radius': `${radius}px`,
        }}
      >
        {/* STEP INDICATORS */}
        {!completed && (
          <div className="stepper__header">
            <div className="stepper__track">
              {steps.map((step, index) => {
                const stepNumber = index + 1;
                const status = getStepStatus(stepNumber);
  
                const title =
                  step.props.title || `Step ${stepNumber}`;
  
                const icon = step.props.icon;
  
                return (
                  <div
                    className={`stepper__segment stepper__segment--${status}`}
                    key={step.key ?? stepNumber}
                  >
                    <button
                      type="button"
                      className="stepper__indicator"
                      onClick={() => {
                        if (
                          !linear &&
                          stepNumber !== currentStep
                        ) {
                          goToStep(stepNumber);
                        }
                      }}
                      disabled={
                        linear || status === 'upcoming'
                      }
                      aria-current={
                        status === 'active' ? 'step' : undefined
                      }
                      aria-label={`${title}, ${status}`}
                    >
                      <span className="stepper__badge">
                        {status === 'completed' ? (
                          <Check size={15} />
                        ) : indicator === 'icons' && icon ? (
                          icon
                        ) : (
                          stepNumber
                        )}
                      </span>
                    </button>
  
                    <div className="stepper__meta">
                      <span
                        className="stepper__title"
                        data-status={status}
                      >
                        {title}
                      </span>
  
                      {step.props.description && (
                        <span className="stepper__description">
                          {step.props.description}
                        </span>
                      )}
                    </div>
  
                    {index < totalSteps - 1 && (
                      <div className="stepper__connector">
                        <motion.div
                          className="stepper__connector-fill"
                          initial={false}
                          animate={{
                            scaleX:
                              stepNumber < currentStep ? 1 : 0,
                          }}
                          transition={{ duration: 0.35 }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
  
        {/* ANIMATED STEP CONTENT */}
        <div className="stepper__body">
          <AnimatePresence mode="wait" custom={direction}>
            {completed ? (
              <motion.div
                key="completed"
                className="stepper__completed"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                {completedContent || (
                  <div className="stepper__default-completed">
                    <CheckCircle2 size={48} />
  
                    <h3>All steps completed!</h3>
  
                    <p>
                      You have successfully completed the process.
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={currentStep}
                className="stepper__content"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
              >
                {activeStep}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
  
        {/* NAVIGATION BUTTONS */}
        {!completed && (
          <div className="stepper__footer">
            <button
              type="button"
              className="stepper__button stepper__button--back"
              onClick={(event) => {
                customBackClick?.(event);
  
                if (!event.defaultPrevented) {
                  goBack();
                }
              }}
              disabled={currentStep === 1}
              {...backButtonRest}
            >
              <ArrowLeft size={16} />
              <span>{backButtonText}</span>
            </button>
  
            <div className="stepper__progress">
              Step {currentStep} of {totalSteps}
            </div>
  
            <button
              type="button"
              className="stepper__button stepper__button--next"
              onClick={goNext}
              {...nextButtonRest}
            >
              <span>
                {currentStep === totalSteps
                  ? completeButtonText
                  : nextButtonText}
              </span>
  
              {currentStep === totalSteps ? (
                <Check size={16} />
              ) : (
                <ArrowRight size={16} />
              )}
            </button>
          </div>
        )}
      </div>
    );
  }